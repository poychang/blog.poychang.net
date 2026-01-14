---
layout: post
title: 將 ASP.NET Core 的 AppSettings.json 轉成適合 Azure Web App 用的環境變數格式
date: 2025-02-25 11:33
author: Poy Chang
comments: true
categories: [Dotnet, Azure, Develop, Tools]
permalink: convert-appsettings-to-azure-webapp-environment-variables/
---

Azure Web App 上的環境變數是不能直接使用 ASP.NET Core 原生的 `appsettings.json` 內容，因為 `appsettings.json` 可能是有階層結構的，而 Azure Web App 上的環境變數是扁平的，像是一筆一筆的紀錄。這時候想要將 `appsettings.json` 的內容套用進 Azure Web App 環境變數中時，就需要做一些調整。

在 Azure Web App 的環境變數頁面中，你可以使用`進階編輯`來幫助我們快速編輯多項設定：

![Azure Web App 環境變數有進階編輯的功能](https://i.imgur.com/NiNaYUL.png)

你會發現，使用`進階編輯`的 JSON 內容（右側）和 ASP.NET Core 的 `appsettings.json` 內容有很大的不同。

除此之外，調整上還需要注意，Azure Web App 所使用的 [App Service Plan](https://learn.microsoft.com/zh-tw/azure/app-service/overview-hosting-plans) 是使用哪種作業系統，Windows 或是 Linux，因為這兩種系統所需要做的調整有些微的不同。

在 Windows 下，要將有階層結構的 `appsettings.json` 轉換成環境變數，除了需要壓平階層外，原本階層的關係要用`:`來表示，如下所示：

```json
// 原始的 appsettings.json
{
  "AA": {
    "BB": "123"
  },
  "CC": "456"
}
// 轉換後 (Windows 版本)
{
  "name": "AA:BB",
  "value": "123",
  "slotSetting": false
},
{
  "name": "CC",
  "value": "456",
  "slotSetting": false
}
```

如果是使用 Linux 了話，原本階層的關係要用`__`（雙底線）來表示，如下所示：

```json
// 轉換後 (Linux 版本)
{
  "name": "AA__BB",
  "value": "123",
  "slotSetting": false
},
{
  "name": "CC",
  "value": "456",
  "slotSetting": false
}
```

轉換規則相當簡單，不過如果有個工具幫忙轉換了話還是挺好的。下面的格式轉換功能就是為了方便轉化而設計的，輸入 `appsettings.json` 的內容，然後選擇作業系統，就可以快速轉換格式。

<script type="module" src="/assets/components/appsettings-converter.js"></script>
<appsettings-converter></appsettings-converter>

---

參考資料：

* [MS Learn - 設定 App Service 應用程式](https://learn.microsoft.com/zh-tw/azure/app-service/configure-common?WT.mc_id=DT-MVP-5003022)
* [MS Learn - Azure App Service 中的環境變數和應用程式設定](https://learn.microsoft.com/zh-tw/azure/app-service/reference-app-settings?WT.mc_id=DT-MVP-5003022)
