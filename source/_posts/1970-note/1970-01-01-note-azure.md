---
layout: post
title: Azure 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Azure]
permalink: note-azure/
---

本篇作為書籤用途，紀錄網路上的 Azure 參考資料

## Azure 地區

Azure 已在全球 36 個區域正式運作，也計畫宣佈增加 6 個區域。擴展地理區域是我們的首要任務，為的是提供更高的效能，以及支援您與資料位置相關的需求及喜好。請參考[官方地圖](https://azure.microsoft.com/zh-tw/regions/)。

## 台灣對外頻寬及光纖的資訊

- [TWNIC 台灣網路資訊中心](http://map.twnic.net.tw/)可查詢各電信業者及機構的連線頻寬圖
- [Submarine Cable Map 全球海底纜線分佈圖](http://www.submarinecablemap.com/)

## 其他資源

- Microsoft Azure, Cloud and Enterprise Symbol / Icon Set, [下載位置](https://www.microsoft.com/en-us/download/details.aspx?id=41937)

## Azure Function 簡介

Azure Function 是一個在雲端輕鬆執行一小段程式碼或功能的解決方案，你只需要撰寫手頭上問題所需的程式碼，而不需要擔心整個應用程式、執行環境與基礎架構。下列是 Azure Function 一些主要功能：

- 多種語言選擇：C#、F#、Node.js、Python、PHP、Batch、Bash 或任何可執行程式。 您可以在 Azure Portal 內設定 Azure Function
- 使用付費：只有程式碼執行期間需要付費。Azure Function 也支援 NuGet 與 NPM，您可以加入自己喜歡的 lib
- 安全性：透過 OAuth 程序保護 Http 觸發函式 (如： Azure Active Directory，Facebook，Google，Twitter 和 Microsoft 帳戶)
- 簡單整合：輕鬆地整合 Azure Service 與 SaaS 產品
- 靈活開發：可以在 Portal 上編輯程式。或透過 Github、Visual Studio Team Services 和其他支援開發工具設定持續整合或佈署程式碼

Function App 是指佈署的一個單位，可以將很多 Functions 聚在一起被佈署上去到雲端，他們可以擁有同樣的環境變數或是 APP 設定，然後可以一起被彈性擴展。所以一個 Function App 可以包含多個 Functions。

[多個 Functions 組成的 Function App](https://i.imgur.com/JUPIMVq.png)

### function.json 是用來做什麼的

用來定義 functions(函式) 的 Binding 以及其他基本的組態設定。 我們可以 bind 如何 trigger 這個函式，以及輸出的類型。

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

- 上面這組 `function.json` 定義了這支 Azure Function 的 Trigger 可以透過 HTTP 的 GET、POST 來觸發
- 裡面的　`"name": "req"`，會對應到 run.cs 的 `HttpRequestMessage req` 參數

### 什麼是 host.json

有點像這個 Functions 運作的設定檔案，因為我們一開始什麼 Trigger 都沒有設定，所以一開始會是空的。我們 Azure Functions 與其他服務串接的設定資料，都會寫在這個 host.json 裡。

參考資料：[適用於 Azure Functions 2.x 的 host.json 參考](https://docs.microsoft.com/zh-tw/azure/azure-functions/functions-host-json?WT.mc_id=DT-MVP-5003022)

### 範例程式碼

- [azure-functions-durable-extension](https://github.com/Azure/azure-functions-durable-extension)
- [azure-functions-templates](https://github.com/Azure/azure-functions-templates)


---

參考資料：

- [Azure Speed Test](http://azurespeedtest.azurewebsites.net/)
