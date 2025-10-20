---
layout: post
title: Azure Bot Service 快速建立對話機器人的服務介紹
date: 2018-04-20 01:13
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Bot]
permalink: introduction-azure-bot-service-and-bot-framework/
---
Azure Bot Service 是一套專用於開發、運行對話機器人的整合環境，也可以說是一個解決方案，裡面關聯到的功能、服務相當多元，從建置機器人對話服務、連結至各對話頻道、測試對話功能，甚至佈署與管理，都包含在 Azure Bot Service 中。

## Azure Bot Service

Azure Bot Service 可以看成運作在 Azure 雲端平台上的 Bot Service，提供開發、執行對話機器人服務的整合環境，在 Azure 上，提供以下三種資源方案來建置：

![Azure Bot Service](https://i.imgur.com/gaxn66h.png)

1. *Web App Bot*
	* 註冊 Bot Connector Service
	* 採用 Azure Web App 為基底環境
	* 在 Azure Web App 上面建立 Web API 應用程式作為解決方案
2. *Functions Bot*
	* 註冊 Bot Connector Service
	* 採用 Azure Functions 無伺服器架構的基底環境作為解決方案
3. *Bot Channels Registration*
	* 註冊 Bot Connector Service
	* 你可以使用 Bot Builder SDK 寫你的對話機器人應用程式，且可以架設在任何非 Azure 的平台上

>我們註冊一個 Bot，實際上是向微軟 註冊一個 Bot Connector Service，我們將來可以透過這個 Bot Connector 來串接不同的 Bot Client (Channels)，預設狀況下，最基本的 Bot Client 就是 Web Chat，也就 是 Bot Connector 自帶的一個對談介面(用戶端)。

前兩個方案，都可直接套用多種預先裝載的程式碼，目前提供以下 5 種機器人範本：

![5 種機器人範本](https://i.imgur.com/zt9sPN1.png)

* *Basic* 此機器人擁有能回應使用者輸入內容的單一對話框
* *Form* 此機器人能示範如何收集來自使用 FormFlow 引導式對話的使用者的輸入內容
* *Language understanding* 此機器人能示範如何利用辨識服務 LUIS API 來處理自然語言
* *Question and Answer* 此機器人能抽取資訊，轉化為會話用且易於應對的答案
* *Proactive* 此機器人能示範如何使用 Azure Functions 來觸發 Azure 機器人中的事件

## 基本架構

![Azure Bot Service](https://i.imgur.com/l2hM5TN.png)

我很喜歡上面這張圖，而且很多資料或影片都有用到，畫的又漂亮又都勾到重點，但因為涵蓋太廣，所以比較難清楚看出 Azure Bot Service 核心功能。

![核心服務 Bot Service Connector](https://i.imgur.com/kKR2xe6.png)

這張圖清楚看出 Bot Service 的核心服務架構是長怎樣，你的機器人會藉由 Bot Service 中的 Connector 服務，去串聯各種不同的頻道，讓你輕鬆借接各種即時通訊軟體。

![運作方式](https://i.imgur.com/0IcJ7Lm.gif)

其實 Bot Service 就是一個夾在頻道與機器人之前的 WebAPI，從程式碼架構也可以看出是一個標準的 ASP.NET WebAPI，而這個 WebAPI 的基本運作原理就是將來自頻道的 Channel JSON Data 轉成通用的 Activity JSON Data，通過這個介面讓我們建立一個對話機器人，就可以運用在各個頻道中。

## 開發工具

### Bot Builder SDK

Azure Bot Service 是一個開發、運行對話機器人的整合環境，然而在開發對話機器人時，我們可以使用 [Bot Builder SDK](https://github.com/Microsoft/BotBuilder) 進行開發，這套 SDK 提供 C# 和 Node.js 兩種平台的開發 API。

以 C# 開發環境來說，除了安裝 Visual Studio 外，下載並安裝以下的 Bot Framework 範本：

* [Bot Application](http://aka.ms/bf-bc-vstemplate)
* [Bot Controller](http://aka.ms/bf-bc-vscontrollertemplate)
* [Bot Dialog](http://aka.ms/bf-bc-vsdialogtemplate)

>或者直接從 Visual Studio 中的擴充管理員搜尋 Bot Builder Template，會有官方的樣板套件。選擇時請注意，目前有分 [v3](https://marketplace.visualstudio.com/items?itemName=BotBuilder.BotBuilderV3) 和 [v4](https://marketplace.visualstudio.com/items?itemName=BotBuilder.botbuilderv4) 版。

接者可以參考*使用 Bot Builder SDK 建立對話機器人*的官方快速上手文件：

* [Create a bot with the Bot Builder SDK for .NET](https://docs.microsoft.com/en-us/bot-framework/dotnet/bot-builder-dotnet-quickstart?WT.mc_id=DT-MVP-5003022)
* [Create a bot with the Bot Builder SDK for Node.js](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-quickstart?WT.mc_id=AZ-MVP-5003022)

### Bot Framework Emulator

開發時期可以透過 Azure Bot Service 平台上面的 WebChat 測試介面進行測試。

![Azure Bot Service 平台上面的 WebChat 測試介面](https://i.imgur.com/FUYCTtl.png)

除此之外，還可以使用 [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator) 在本地端執行測試，[下載連結](https://github.com/Microsoft/BotFramework-Emulator/releases)。

![使用 Bot Framework Emulator 在本地端執行測試](https://i.imgur.com/qrIj8jH.png)

### Bot Framework Web Chat

在 Azure Bot Service 上有一個測試用的 Web Chat 功能，它包含了完整的對話框所需要呈現的前端介面，這個 Web Chat 專案同時也是 MIT License 的開放原始碼專案，[Microsoft/BotFramework-WebChat](https://github.com/Microsoft/BotFramework-WebChat)，如果你想要快速建立專案，你可以從這個專案中的 Samples Code 中找到很多所需的前端程式碼範例。

### 介面預覽

Bot Framework 提供產生對話框操作介面的 API，用於產生卡片、按鈕、圖片等對話框介面，但因為每個通訊頻道都有自己的介面設計，如果想要查看各個頻道所對應產生的介面時，可以透過 [Channel Inspector](https://docs.botframework.com/en-us/channel-inspector/channels/WebChat/) 這個線上工具進行預覽，相當方便。

### Bot Framework REST API

有時候我們不想使用各種第三方的通訊平台，而是想自建一個的時候，可以使用 Bot Service 中的 Direct Line 頻道，這個頻道官方有提供專屬的 [Direct Line API 文件](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-concepts?WT.mc_id=AZ-MVP-5003022)，透過文件中的操作方式，我們可以自己運用各種 API 呼叫，組合出自己的對話流程。

## 後記

整個 Azure Bot Service 涵蓋的內容很多，這裡只是簡單的介紹這個開發、運行對話機器人的整合環境，歡迎各位先進互相交流。

----------

參考資料：

* [官方文件 - Create a bot with the Bot Builder SDK for .NET](https://docs.microsoft.com/en-us/bot-framework/dotnet/bot-builder-dotnet-quickstart?WT.mc_id=DT-MVP-5003022)
* [2018 鐵人賽 - 利用 MS Bot framework 與 Cognitive Service 建構自用智慧小秘書](https://ithelp.ithome.com.tw/users/20091494/ironman/1411)
