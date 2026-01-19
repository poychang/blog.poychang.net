---
layout: post
title: 如何避免 API 專案在 Azure AlwaysOn 出現 404 錯誤
date: 2026-01-19 09:05
author: Poy Chang
comments: true
categories: [Dotnet, WebAPI, Azure]
permalink: how-to-avoid-azure-alwayson-404-errors/
---

當在 Azure App Service 上部署 ASP.NET Core WebAPI 專案時，如果啟用 AlwaysOn 功能，會因為 Azure 為了讓應用程式保持載入狀態，因此不斷嘗試連現網站根目錄，但因為 API 專案不會回應根目錄的請求，導致出現 404 錯誤。本文將介紹如何避免這個問題。

## 什麼是 AlwaysOn

如果您想要讓應用程式保持載入狀態，即使沒有流量也一樣開啟，您可以啟用 AlwaysOn 功能，這樣 Azure 會定期向應用程式發送要求，以防止它進入閒置狀態。

Azure App Service 應用程式預設會在沒有任何活動的情況下，20 分鐘後自動卸除，而卸載的應用程式可能會因為新要求的準備時間，而造成高延遲。為了避免這種情況，您可以啟用 AlwaysOn 功能，確保應用程式保持載入狀態。

當 AlwaysOn 開啟時，Azure App Service 的前端負載平衡器會每隔 5 分鐘就會將要求傳送 GET 至應用程式根目錄，藉此方法達到連續 Ping 網站的效果，來防止應用程式卸載。

特別要注意的是，當應用程式有使用連續 WebJobs 或 CRON 運算式觸發的 WebJobs 時，開啟 AlwaysOn 是必要的。

## 解法一：為根目錄補一條路由

推薦這個簡單有效的方法，只需要在 API 專案的 `Program.cs` 中，為根目錄補上一條路由即可。

告訴應用程式當收到根目錄的請求時，回應一個簡單的 200 `OK` 狀態碼。

```csharp
app.MapGet("/", () => Results.Ok("OK"));
```

或者，偏好回傳更乾淨的 204 `No Content` 狀態碼也是可行的。

```csharp
app.MapGet("/", () => Results.NoContent());
```

## 解法二：掛靜態首頁當根目錄

如果不想更動 API 路由，也可以透過啟動靜態檔案中介軟體 (Static File Middleware)，並在 `wwwroot` 資料夾中放置一個 `index.html` 檔案，來回應根目錄的請求。

```csharp
app.UseDefaultFiles();
app.UseStaticFiles();
```

這樣當收到根目錄的請求時，應用程式會回應 `wwwroot/index.html` 檔案的內容，避免 404 錯誤。

## 解法三：用中介軟體攔截

如果你有更細緻的處理需求，或是想要增加更多自訂邏輯的操作，可以使用中介軟體 (Middleware) 來攔截根目錄的請求，並回應一個簡單的狀態碼。

在 `app.UseRouting()` 之前插入：

```csharp
app.Use(async (ctx, next) =>
{
    if (HttpMethods.IsGet(ctx.Request.Method) && ctx.Request.Path == "/")
    {
        ctx.Response.StatusCode = StatusCodes.Status204NoContent;
        return;
    }
    await next();
});
```

接著你可以在此中介軟體中加入更多自訂邏輯，例如記錄日誌、驗證等。

## 後記

有一點需要注意的是，不要將 AlwaysOn 功能和 Health check 混為一談。

Health check 是另一個機制，用來報告應用程式基礎結構元件的健康情況，路徑可設 `/health` 或 `/healthz`。此機制不會「把 AlwaysOn 的探測路徑改成別的」，因此要消除 404，仍以讓呼叫 `/` 根目錄並回傳成功狀態碼為準。

---

參考資料：

- [設定 App Service 應用程式 - 一般設定](https://learn.microsoft.com/zh-tw/azure/app-service/configure-common?tabs=portal#configure-general-settings?WT.mc_id=DT-MVP-5003022)
- [使用健康情況檢查來監視 App Service 執行個體](https://learn.microsoft.com/zh-tw/azure/app-service/monitor-instances-health-check?WT.mc_id=DT-MVP-5003022)
- [ASP.NET Core 中的健康狀態檢查](https://learn.microsoft.com/zh-tw/aspnet/core/host-and-deploy/health-checks?WT.mc_id=DT-MVP-5003022)
