---
layout: post
title: 使用 Bot Builder SDK v4 建立對話機器人
date: 2018-06-27 13:30
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI, Azure, Bot]
permalink: build-bot-framework-with-bot-builder-v4/
---
在兩年前的 Build 2016 大會，微軟正式推出了 Bot Framework 智能機器人開發框架，一個**交談即平台** (conversation as a platform) 未來就此展開。在兩年後的今天，許多技術不斷迭代已經和過去不一樣了，在 Bot Builder SDK v3 以前，是用 .NET Framework 的 ASP.NET WebAPI 作為開發基礎，現在跨平台的 .NET Core 推出了，也成熟了，Bot Builder SDK v4 也理所當然的改用新的技術架構，讓開發者能輕鬆打造出跨平台、高效能的智能機器人。

>請注意！目前為止 Bot Builder SDK v4 還在 Preview 階段，程式碼可能會有部分調整，請斟酌使用。

>根據官方的 [Roadmap](https://github.com/Microsoft/botbuilder-dotnet/wiki/Roadmap)，預計 2018 年 9 月會釋出穩定版、完整的文件與範例。

**Table of Contents**

- [開發環境](#%e9%96%8b%e7%99%bc%e7%92%b0%e5%a2%83)
- [建立對話機器人](#%e5%bb%ba%e7%ab%8b%e5%b0%8d%e8%a9%b1%e6%a9%9f%e5%99%a8%e4%ba%ba)
- [本機偵錯](#%e6%9c%ac%e6%a9%9f%e5%81%b5%e9%8c%af)
- [發行至 Azure](#%e7%99%bc%e8%a1%8c%e8%87%b3-azure)
- [註冊對話機器人服務](#%e8%a8%bb%e5%86%8a%e5%b0%8d%e8%a9%b1%e6%a9%9f%e5%99%a8%e4%ba%ba%e6%9c%8d%e5%8b%99)
- [專案範本擴充套件](#%e5%b0%88%e6%a1%88%e7%af%84%e6%9c%ac%e6%93%b4%e5%85%85%e5%a5%97%e4%bb%b6)

## 開發環境

需要用的到工具和服務相當多，這裡先條列出來。

* 主要使用 Visual Studio 2017 15.6 以上版本的 IDE 開發工具 ([下載位置](https://visualstudio.microsoft.com/zh-hant/vs/))
* 使用 ASP.NET Core 跨平台的 Web 開發技術
* 使用 Bot Framework Emulator ([下載位置](https://github.com/Microsoft/BotFramework-Emulator/releases))
  * Bot Framework Emulator v3 或 v4 都可以用，這裡使用 v4 的工具
* 需要 Microsoft Azure 訂閱 ([申請免費 NT$6,100 的點數](https://azure.microsoft.com/zh-tw/free/))

## 建立對話機器人

我們接下來會逐步建立一個回音機器人，也就是你跟機器人說什麼，他就會回你什麼，藉此做為練習。

使用 Visual Studio 建立新的 ASP.NET Core Web 應用程式。

![使用 ASP.NET Core Web 應用程式專案範本建立專案](https://i.imgur.com/gkAmNCc.png)

選擇空白專案，從甚麼都沒有開始。

![選擇空白專案](https://i.imgur.com/atDPy8w.png)

對話機器人服務本身其實是個 WebAPI 網站服務，但為了簡單介紹這個網站服務的用途，可以在 `wwwroot` 資料夾中建立一個靜態的 `index.html` HTML 網頁，

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta charset="utf-8" />
</head>
<body style="font-family:'Segoe UI'">
    <h1>使用 ASP.Net Core 2 建立 EchoBot</h1>
    <p>這個對話機器人會回傳接收到的對話。</p>
    <p>請使用 Bot Framework Emulator 對您的對話機器人進行偵錯，並將下列 URL 複製至模擬器 Endpoint URL 欄位中。</p>
    <div style="padding-left: 50px;" id="botBaseUrl"></div>
    <p>如需發行對話機器人服務，請至 <a href="https://www.botframework.com/">Bot Framework 網站</a>進行對話機器人註冊，請提供下列 URL 進行註冊。</p>
    <div style="padding-left: 50px;">
        https://<strong>{your domain name}</strong>/api/messages
    </div>
    <script>
        var urlDiv = document.getElementById("botBaseUrl");
        var aTag = document.createElement('a');
        aTag.setAttribute('href', location.protocol + "//" + location.host + "/api/messages");
        aTag.innerHTML = location.protocol + "//" + location.host + "/api/messages";
        urlDiv.appendChild(aTag);
    </script>
</body>
</html>
```

開啟專案的 NuGet 套件管理工具，勾選`搶鮮版`選項，並搜尋以下套件進行安裝：

* Microsoft.Bot.Builder.Core
* Microsoft.Bot.Builder.Core.Extensions
* Microsoft.Bot.Builder.Integration.AspNet.Core
  * 此套件用來將 Bot Builder 整合進 ASP.NET Core 專案中
  * 提供中介程序做設定，如 `UseBotFramework()`

>看目前 Bot Builder SDK 專案的發展，未來 `Microsoft.Bot.Builder.Core` 和 `Microsoft.Bot.Builder.Core.Extensions` 會收攏成一個 `Microsoft.Bot.Builder` 套件。

![安裝 Microsoft.Bot.Builder.Core 和 Microsoft.Bot.Builder.Core.Extensions 套件](https://i.imgur.com/MPdCsD7.png)

![安裝 Microsoft.Bot.Builder.Integration.AspNet.Core 套件](https://i.imgur.com/7HvWBIm.png)

新增 `EchoState.cs` 檔案，建立 `EchoState` 類別，裡面包含一個 `TurnCount` 屬性，作為記錄第幾次對話的計數器。

>有時為了追蹤對話過程中的關鍵資訊，為對話機器人設計 State 作為資訊保留機制，能讓我們更容易處理程式邏輯，詳細請參考官方文件[Save state using conversation and user properties](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-state?view=azure-bot-service-4.0&tabs=csharp&WT.mc_id=AZ-MVP-5003022)。

```cs
namespace DemoBotBuilderV4
{
    public class EchoState
    {
        public int TurnCount { get; set; } = 0;
    }
}
```

新增 `EchoBot.cs` 主要處理對話邏輯的檔案，建立 `EchoBot` 類別並實作 `IBot` 介面，這個介面要求實作 `OnTurn` 方法，在這個方法裡面可以設計我們自己處理邏輯。

`OnTurn` 方法會接收一個 `ITurnContext` 類型的參數，這個參數裡面包含執行與使用者對話的所有資訊。

```cs
namespace DemoBotBuilderV4
{
    public class EchoBot : IBot
    {
        public async Task OnTurn(ITurnContext context)
        {
            // 當收到活動類型為 Messages 的訊息時執行以下程序
            if (context.Activity.Type is ActivityTypes.Message)
            {
                // 取得儲存在對話狀態中的自訂資訊
                var state = context.GetConversationState<EchoState>();

                // 增加對話計數器
                state.TurnCount++;

                // 回傳使用者傳送的的對話訊息
                await context.SendActivity($"Turn {state.TurnCount}: You sent '{context.Activity.Text}'");
            }
        }
    }
}
```

接著修改 `Startup.cs`，首先在建構式中注入應用程式的環境變數，並設定存取 `appsettings.json` 的 `Configuration` 屬性。

```cs
public Startup(IHostingEnvironment env)
{
    var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
        .AddEnvironmentVariables();

    Configuration = builder.Build();
}

public IConfiguration Configuration { get; }
```

在 `Startup.cs` 的 `ConfigureServices()` 中註冊對話機器人服務，請參考以下程式碼：

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddBot<EchoBot>(options =>
    {
        // 對話機器人需要一組 Microsoft App ID，這通常會存在 appsettings.json 或應用程式環境變數中
        // 透過傳入 Configuration 給 CredentialProvider，藉此取得相關資訊
        options.CredentialProvider = new ConfigurationCredentialProvider(Configuration);

        // 為對話機器人加入處理最高層級的例外(Exception)控制，當有例外發生時，會執行以下動作
        // TraceActivity() 只會傳訊息給對話機器人模擬器，而 SendActivity() 會傳訊息給使用者
        options.Middleware.Add(new CatchExceptionMiddleware<Exception>(async (context, exception) =>
        {
            await context.TraceActivity("EchoBot Exception", exception);
            await context.SendActivity("Sorry, it looks like something went wrong!");
        }));

        // 本機偵錯時，建議使用記憶體來存放對話狀態資訊，每次重新啟動都會清空所存放的資訊
        IStorage dataStore = new MemoryStorage();

        // 若你的對話機器人運行在單一機器，且希望每次重新啟動能存取上一次的對話狀態資訊，請參考下列作法將資訊存成暫存檔案
        // IStorage dataStore = new FileStorage(System.IO.Path.GetTempPath());

        // 對於正是環境的對話機器人，你可以利用 Azure Table Store、Azure Blob 或 Azure CosmosDB 來保留對話狀態資訊
        // 請先至 NuGet 套件管理工具中搜尋並安裝 Microsoft.Bot.Builder.Azure，請參考以下作法將資訊存至 Azure 平台
        // IStorage dataStore = new Microsoft.Bot.Builder.Azure.AzureTableStorage("AzureTablesConnectionString", "TableName");
        // IStorage dataStore = new Microsoft.Bot.Builder.Azure.AzureBlobStorage("AzureBlobConnectionString", "containerName");

        options.Middleware.Add(new ConversationState<EchoState>(dataStore));
    });
}
```

在 `Startup.cs` 的 `Configure()` 設定中介程序

```cs
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseDefaultFiles()
        // 使網站可以開啟 index.html 網頁
        .UseStaticFiles()
        // 將所註冊的 Bot 加入網站運行的程序中
        .UseBotFramework();
}
```

到這裡我們程式就寫完了，請按 <kbd>Ctrl</kbd> + <kbd>F5</kbd> 啟動網站，會開啟如下圖的網站畫面。

![啟動網站](https://i.imgur.com/q6Dz6O5.png)

下一段會使用 `https://localhost/api/messages` 這個端點來做對話機器人測試。

在測試之前，或許你會好奇，我們沒有建立 `/api/messages` 這個 API 端點，為什麼就忽然可以用了呢？原因是 `Microsoft.Bot.Builder.Integration.AspNet.Core` 套件所提供的 `UseBotFramework()` 會去偵測 Bot Builder 的預設 API 端點，也就是 `/api/messages`，我們可以從[原始碼](https://github.com/Microsoft/botbuilder-dotnet/blob/master/libraries/Microsoft.Bot.Builder/Integration/BotFrameworkPaths.cs)中找到這項設定。

## 本機偵錯

我們可以使用 [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator) 在本機偵錯對話機器人，v3 或 v4 的模擬器，都可以從[這裡下載](https://github.com/Microsoft/BotFramework-Emulator/releases)。

>目前 v4 版本還在預覽階段，但已經可以正常使用，這裡用 v4 的模擬器做展示。

開啟模擬器後，直接從工具列中點選 File > New Bot，會開啟下列視窗，請輸入機器人名稱 `Bot Name` 和測試的 API 端點 `Endpoint URL`。

如果你今天要測試的是發行出去的對話機器人，請填上 `MSA app ID` 和 `MSA app password`，這兩個欄位分別是下一段發行至 Azure 中會提到的 Microsoft App ID 和 Microsoft App Password。

![建立與本機執行的機器人連線](https://i.imgur.com/N4Ryfgt.png)

設定完成後，就可以測試本機的對話機器人了。

![測試本機對話機器人](https://i.imgur.com/iyDGjWf.png)

對話個過程中，你可以點選對話框或者右側的 LOG 訊息，來觀察傳送的 JSON 資訊，可以更進一步了解對話過程中，傳輸了哪些資訊。

## 發行至 Azure

最後我們可以使用 Visual Studio 將我們開發好的對話機器人發行至 Azure WebApp。

在專案上點選滑鼠右鍵，選擇 `Publish` 發行專案。

![專案上點選滑鼠右鍵，選擇 Publish](https://i.imgur.com/ctWCCDS.png)

選擇 App Service 並新增一個新的 Web App 資源。

![新增 App Service](https://i.imgur.com/S1nAvzM.png)

輸入你的 App 名稱並選擇 Azure 訂閱及資源群組，如果沒有已存在的資源群組，可以在這邊直接建立一個新的。

![輸入 App 名稱並選擇 Azure 訂閱及資源群組](https://i.imgur.com/50RodfL.png)

點選 Create 按鈕，就會在 Azure 上建立所需的資源，並且將對話機器人發行至該網站中，發行成功會跳出如下的網頁畫面。

![發行後的網站](https://i.imgur.com/Lrs3Tn2.png)

## 註冊對話機器人服務

網站佈署好了，但這時候還無法使用對話機器人，對話機器人本身是個 WebAPI 網站，要真的接上各個對話頻道，如 Teams、Skype 等，還需要在 Azure 上透過 Bot Channels Registration 資源來註冊對話機器人的服務。

使用 Azure 上的 Bot Channels Registration 資訊，進行 Bot Service 註冊流程如下：

登入 Azure 並於上述建立的資源群組中點選新增。

![登入 Azure 並於上述建立的資源群組中點選新增](https://i.imgur.com/d228UUA.png)

搜尋 Bot Service 相關資源，選擇 Bot Channels Registration，準備註冊我們的對話機器人。

![搜尋 Bot Service 相關資源，選擇 Bot Channels Registration](https://i.imgur.com/OoBDafa.png)

註冊對話機器人時，下圖中 6 和 7 要特別注意。

![輸入註冊對話機器人的相關資訊](https://i.imgur.com/SHQNnBC.png)

第 6 點，訊息端點可以從上面發行成功後的網頁找到。

第 7 點是要建立一組 Microsoft 應用程式 ID，這裡建議點選`創建新項目`中的`在應用程式註冊入口網站中建立應用程式ID`做手動建立，如果使用自動建立你會看不到產生的 Microsoft App Password，必須要重新手動產生密鑰。

>請記得把產生出來的  Microsoft App ID 和 Microsoft App Password 記下來，等一下馬上就會用到。

![產生 Microsoft App ID](https://i.imgur.com/vOI03uu.png)

![產生 Microsoft App Password](https://i.imgur.com/vrMbnL5.png)

這樣我們的對話機器人就註冊好了，最後一步就是將所產生出來的 Microsoft App ID 和 Microsoft App Password 更新至我們的網站中。

直接在專案中，更新 `appsetting.json` 內的 Microsoft App ID、Microsoft App Password，參考下圖。

![更新 appsetting.json 內的 Microsoft App ID、Microsoft App Password](https://i.imgur.com/zWkADdR.png)

完成後重新發行網站，就可以在 Azure 平台上進入 Bot Service 資源中，在`機器人管理`功能中點選`在 WebChat 中測試`，這裡就可以測試和你的對話機器人對話了。

![在 Azure 平台上測試對話機器人](https://i.imgur.com/IG4ps29.png)

## 專案範本擴充套件

在 Visual Studio Marketplace 上可以找到 2 個 Bot Builder 專案範本：

* [Bot Builder Template for Visual Studio](https://marketplace.visualstudio.com/items?itemName=BotBuilder.BotBuilderV3)
* [Bot Builder V4 SDK Template for Visual Studio](https://marketplace.visualstudio.com/items?itemName=BotBuilder.botbuilderv4)

若要使用 Bot Builder v4 來建置對話機器人，請使用 Bot Builder V4 SDK Template for Visual Studio 這個專案範本。

本篇所建立的對話機器人，會和這個專案範本所產生的功能一樣，透過從頭做過一遍，會更清楚整個對話機器人是如何被產生出來的。

>本篇完整範例程式碼請參考 [poychang/Demo-Bot-Builder-V4](https://github.com/poychang/Demo-Bot-Builder-V4)，或參考[官方範例專案](https://github.com/Microsoft/botbuilder-dotnet/blob/master/samples-final/3.AspNetCore-EchoBot-With-State/readme.md)。

----------

參考資料：

* [Build a Microsoft Bot Framework bot with the Bot Builder SDK v4](https://blog.botframework.com/2018/05/07/build-a-microsoft-bot-framework-bot-with-the-bot-builder-sdk-v4/)
* [Bot Builder SDK v4](https://github.com/Microsoft/botbuilder-dotnet)
* [Bot Builder tools](https://github.com/Microsoft/botbuilder-tools)
