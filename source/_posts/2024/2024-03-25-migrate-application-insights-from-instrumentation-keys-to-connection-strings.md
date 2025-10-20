---
layout: post
title: 改用 Connection Strings 來發送遙測資訊到 Application Insights
date: 2024-03-25 15:48
author: Poy Chang
comments: true
categories: [Azure, Develop]
permalink: migrate-application-insights-from-instrumentation-keys-to-connection-strings/
---

過去要發送 Telemetry 到 Application Insights，都是透過設定 Instrumentation Key 的方式來控制要送到哪個資源去，而這個方式在 2025/03/31 之後，將終止支援，也就是說還是可以用，但不會提供新功能。因此在專案有盈餘時間的時候，就盡量抓時間更新吧。至於為甚麼會有這篇，是因為更新的過程中，有一些小細節需要注意。

由於要改成用 Connection Strings 來發送遙測資訊到 Application Insights 的程式碼修改相當簡單，基本上就是不要設定 Instrumentation Key 的屬性，改用 Connection Strings 就對了，而 Connection Strings 的設定值，就上 Azure Portal 上查詢該 Application Insights 資源頁面即可，這裡就不多做贅述。

直接講要注意的地方。

## 端點

當改成用 Connection Strings 的時候，你會發現 Connection Strings 設定值多了幾個屬性，例如 `IngestionEndpoint` 和 `LiveEndpoint`，前者用於數據收集，而後者則用於實時收集指標數據，藉由這兩個屬性來設定不同功能所要發送到的收集端點。

- `IngestionEndpoint`：用於收集數據，包括控制台日誌、異常、依賴調用等，當應用程序產生這些數據時，會被發送到指定的位置
- `LiveEndpoint`：用於收集實時指標數據，當你訪問 Azure Portal 的 Application Insights 資源時才會啟用，才會派上用場

仔細看 Connection Strings，你會發現這兩個位置都會將與地理位置相關，這主要是與隱私議題相關。

`IngestionEndpoint` 基本上會長得像 `https://<region>.in.applicationinsights.azure.com`，這是依賴區域的端點，另外，他還有一個全域的端點 `https://dc.applicationinsights.azure.com`，這就不會限定 Telemetry 只會送到哪個區域，而是每個 DC 都有可能。

## TLS

根據 Azure 的[公告](https://azure.microsoft.com/en-us/updates/azuretls12/)，在 Azure 內的連線將全面支援 TLS 1.2，且新的服務與資源將只支援 TLS 1.2 以上協議版本。

因此在遷移 Application Insights 到 Connection Strings 模式的時候，所使用到的**依賴區域的端點**將僅支援 TLS 1.2，所以應用程式若沒有設定連線是採用 TLS 1.2 以上版本，將無法順利傳送 Telemetry 到 Application Insights。

例如，手邊遇到的 VSTO 專案，預設沒有支援 TLS 1.2，因此可以透過下列程式碼來設定要支援 TLS 1.2。

```csharp
System.Net.ServicePointManager.SecurityProtocol |= System.Net.SecurityProtocolType.Tls12;
```

如果你的應用程式無法支援 TLS 1.2，但又要改用 Connection Strings 模式了話，還是可以的。你只要手動調整 Connection Strings 的 `IngestionEndpoint` 端點位置成全域端點 `https://dc.applicationinsights.azure.com` 即可。

## 擇一

請勿同時使用連接字串(Connection Strings)和檢測金鑰 (Instrumentation Key)，因為後者會覆蓋掉前者，可能會導致遙測未出現在 Application Insights 上。

以上就是先前在遷移到 Connection Strings 模式時，發現的注意事項。

## 後記

最近在調整 K8S 內的應用程式時，也發生無法順利上傳 Telemtry 到 Application Insights 的狀況。

經過調查，原來是 .NET 5 的時候，因為 Kestrel 變更了背後的行為，將原本預設的 SslProtocols 從 `SslProtocols.Tls12 | SslProtocols.Tls11` 調整成 `SslProtocols.None` （詳細請參考[重大變更：Kestrel：預設支援的 TLS 通訊協定版本改變](https://learn.microsoft.com/zh-tw/dotnet/core/compatibility/aspnet-core/5.0/kestrel-default-supported-tls-protocol-versions-changed?WT.mc_id=DT-MVP-5003022)），這造成跟上面 VSTO 一樣的狀況，因為改用 Connection String 的方式且使用區域的 `IngestionEndpoint`，所以需要 TLS 1.2 才能順利傳送 Telemtry。

解法有以下兩種：

1. 跟 VSTO 一樣，加入上面那行程式碼，透過 `ServicePointManager` 來調整 TLS 的使用版本
2. 在 `Program.cs` 中，在 `Builder` 中調整 `Kestrel` 的 SSL Protocol 設定，詳細請參考下列程式碼：

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseKestrel(kestrelOptions =>
{
    kestrelOptions.ConfigureHttpsDefaults(httpsOptions =>
    {
        httpsOptions.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls11;
    });
});
```

---

參考資料：

* [MS Learn - 從 Application Insights 檢測金鑰移轉至連接字串](https://learn.microsoft.com/zh-tw/azure/azure-monitor/app/migrate-from-instrumentation-keys-to-connection-strings?WT.mc_id=DT-MVP-5003022)
* [MS Learn - Azure 監視器所使用的 IP 位址](https://learn.microsoft.com/zh-tw/azure/azure-monitor/ip-addresses#addresses-grouped-by-region-azure-public-cloud?WT.mc_id=DT-MVP-5003022)
* [MS Learn - 針對 Azure 監視器 Application Insights 中遺失的應用程式遙測進行疑難排解](https://learn.microsoft.com/zh-tw/troubleshoot/azure/azure-monitor/app-insights/investigate-missing-telemetry?WT.mc_id=DT-MVP-5003022)
* [MS Learn - Kestrel：預設支援的 TLS 通訊協定版本已變更](https://learn.microsoft.com/zh-tw/dotnet/core/compatibility/aspnet-core/5.0/kestrel-default-supported-tls-protocol-versions-changed?WT.mc_id=DT-MVP-5003022)
