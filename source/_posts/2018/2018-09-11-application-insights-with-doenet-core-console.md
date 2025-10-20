---
layout: post
title: 適用於各種應用程式的 Application Insights 遙測工具使用方式
date: 2018-09-11 22:34
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Tools]
permalink: application-insights-with-doenet-core-console/
---

一般聽到 Azure 的 [Application Insights](https://docs.microsoft.com/zh-tw/azure/application-insights/app-insights-overview?WT.mc_id=AZ-MVP-5003022)，會直接與 Web 應用程式連結在一起，認為他是一個監視即時 Web 應用程式狀態的遙測工具。但其實我們可以將 Application Insights 強大的自動偵測效能異常及分析功能，放在一般的應用程式中，例如主控台應用程式。

> 在使用 Application Insights 功能之前，您必須要有 Azure 訂閱帳戶，[免費取得 NT$6,100 的 Azure 點數與 12 個月的熱門服務](https://azure.microsoft.com/zh-tw/free/)。

## 建立 Application Insights 資源

申請好 Azure 訂閱之後，請先建立一個資源群組，我們可以將相關聯的 Azure 資源，統一放在一個資源群組中做管理。

在建立好的資源群組內，可以點選左上角的**新增**來增加 Azure 上所提供的所有資源至這個資源群組中。如果該資源群組是空的，也可以點選畫面中間的**建立資源**。

![在資源群組中新增資源](https://i.imgur.com/mpSE6ib.png)

這裡我們可以直接用搜尋的方式，輸入 `Application Insights` 關鍵字，即可找到所需要的 Application Insights 資源，點選後進行建立的動作。

![搜尋並選擇 Application Insights 資源](https://i.imgur.com/7cpFtnp.png)

輸入 Application Insights 資源的基本資訊，其中有一個關鍵的欄位**應用程式類型**，這個欄位會影響之後所見圖表的預設選取項目，有以下 5 個類型可以選擇，這裡我們要建立通用應用程式的遙測，因此選擇`一般`。

- ASP.NET Web 應用程式
- JAVA Web 應用程式
- Node.js 應用程式
- 一般
- App Center 應用程式

> 顯而易見的，如果是要用在 Web 應用程式，就選擇 `ASP.NET Web 應用程式` 這個選項。比較特別的 `App Center 應用程式` 選項，是用於搭配 [App Center](https://appcenter.ms/) 做 App 遙測的。

![建立 Application Insights 資源](https://i.imgur.com/qEpFLNq.png)

建立完成後，在 **概觀** 或 **屬性** 的頁面中，可以找到`檢測金鑰` (Instrumentation Key) 這個欄位，之後的程式會透過這組金鑰，將遙測資料傳進這個 Application Insights 資源中。

![遙測金鑰](https://i.imgur.com/6lirCv5.png)

當之後的程式運行時，若有遙測事件被觸發，可以在**搜尋**頁面中做查看，如果遙測的資料太多，可以透過上方的搜尋列，輸入搜尋關鍵字做資料過濾，或者點選**時間範圍**和**篩選**，也可以做到基本的資料過濾動作。

![搜尋遙測資料](https://i.imgur.com/TYJ69bx.png)

如果需要更進階的資料查詢動作，可以點選**分析**，這會開啟 [Azure Log Analytic](https://docs.loganalytics.io/) 平台，針對你的 Application Insights 資源進行資料查詢。

## 在主控台應用程式中使用 Application Insights

目前 Application Insights [官方提供](https://github.com/Microsoft/ApplicationInsights-Home)下列這些框架/程式語言的 SDK：

- [Asp.Net Core (formerly Asp.Net 5)](https://github.com/Microsoft/ApplicationInsights-aspnetcore)
- [DotNet Base](https://github.com/Microsoft/ApplicationInsights-dotnet)
- [DotNet Logging Adaptors](https://github.com/Microsoft/ApplicationInsights-dotnet-logging)
- [DotNet Server](https://github.com/Microsoft/ApplicationInsights-server-dotnet)
- [JavaScript](https://github.com/Microsoft/ApplicationInsights-js)
- [Java](https://github.com/Microsoft/ApplicationInsights-Java)
- [Node.js](https://github.com/Microsoft/ApplicationInsights-node.js)

藉此我們可以輕鬆在 .NET 專案中使用 Application Insights 的服務。

這裡我們想要建立一個適用於各種應用程式的 Application Insights 遙測工具使用方式，使用 [Application Insights for .NET 套件](https://github.com/Microsoft/ApplicationInsights-dotnet) 並搭配最基本的主控台應用程式來做範例。

### 安裝套件

開啟熟悉的 Visual Studio 建立 .NET Core Console 專案，接著安裝下列 2 個套件：

- [Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights) 提供 Application Insights 核心的遙測功能
- [Microsoft.ApplicationInsights.DependencyCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector) 提供自動追蹤 HTTP、SQL 或某些其他外部相依性呼叫

>安裝 `Microsoft.ApplicationInsights` 套件是不會自動產生 `ApplicationInsights.config` 設定檔的，必須手動建立。

### 設定 TelemetryClient 遙測客戶端的方法

有兩種方式來設定 `TelemetryClient` 客戶端的遙測實體，第一種是透過程式碼來設定 `TelemetryClient` 要收集的遙測資訊，這個方法能夠讓我們自行決定那些程式碼段落要套用哪種收集遙測資料的收集器，相關程式碼範例請參考[這裡](https://docs.microsoft.com/zh-tw/azure/application-insights/application-insights-console?WT.mc_id=AZ-MVP-5003022#configuring-telemetry-collection-from-code)。

另一種是[使用設定檔的方式](https://docs.microsoft.com/zh-tw/azure/application-insights/application-insights-console?WT.mc_id=AZ-MVP-5003022#using-config-file)，比較常見透過 `ApplicationInsights.config` 檔案做設定，然後加載到 `TelemetryClient` 遙測實體，預設會抓應用程式根目錄下的這個官方預設檔案，而你也可以明確指定設定檔路徑做載入，請參考下列程式碼來指定檔案位置：

```csharp
// 使用官方預設設定檔
var configuration = TelemetryConfiguration.Active;
var telemetryClient = new TelemetryClient(configuration);
```

```csharp
// 明確指定設定檔路徑的方法
using System.IO;

var configuration = TelemetryConfiguration.CreateFromConfiguration(File.ReadAllText("C:\\ApplicationInsights.config"));
var telemetryClient = new TelemetryClient(configuration);
```

上述明確指定設定檔路徑的範例，會使用存放在 C 槽跟目錄的設定檔來設定 `TelemetryClient`，借此你也可以讓多個應用程式共用同一個遙測設定檔。

>詳細的 `ApplicationInsights.config` 設定說明請參考[這裡](https://docs.microsoft.com/zh-tw/azure/application-insights/app-insights-configuration-with-applicationinsights-config?WT.mc_id=AZ-MVP-5003022)。

有一點請注意，為了收集完整的應用程式遙測資料，應盡早將 Application Insights 初始化。

### 設定 TelemetryClient 遙測客戶端

這裡使用明確指定 `ApplicationInsights.config` 設定檔位置的方式來設定 `TelemetryClient`，下面程式碼範例是包含相依性追蹤(`DependencyCollector`)的設定，這個模組會收集該應用程式對資料庫或外部服務呼叫的遙測資料。

>之所以要用**明確指定**設定檔位置，這是因為 .NET Core 和 .NET Framework 的預設動作不一樣，經查看[原始碼檔案](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Microsoft.ApplicationInsights/Extensibility/Implementation/Platform/PlatformImplementation.cs)，目前只有 .NET Framework 能正確抓到預設的 `ApplicationInsights.config` 檔案，而 .NET Core 不行。

`ApplicationInsights.config` 設定檔請參考下列程式碼：

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">

    <!--Application Insights Key: Azure 上的 Application Insights 檢測金鑰-->
    <InstrumentationKey>YOUR_APPLICATION_INSIGHTS_KEY</InstrumentationKey>

    <!--Data Collection: 資料收集的對象會實作為一組遙測模組，各自負責特定的資料集-->
    <TelemetryModules>
        <Add Type="Microsoft.ApplicationInsights.DependencyCollector.DependencyTrackingTelemetryModule, Microsoft.AI.DependencyCollector">
            <ExcludeComponentCorrelationHttpHeadersOnDomains>
                <Add>core.windows.net</Add>
                <Add>core.chinacloudapi.cn</Add>
                <Add>core.cloudapi.de</Add>
                <Add>core.usgovcloudapi.net</Add>
                <Add>localhost</Add>
                <Add>127.0.0.1</Add>
            </ExcludeComponentCorrelationHttpHeadersOnDomains>
            <IncludeDiagnosticSourceActivities>
                <Add>Microsoft.Azure.ServiceBus</Add>
                <Add>Microsoft.Azure.EventHubs</Add>
            </IncludeDiagnosticSourceActivities>
        </Add>
    </TelemetryModules>

    <!--Telemetry Enrichment: 擴充遙測項目的內容-->
    <TelemetryInitializers>
        <Add Type="Microsoft.ApplicationInsights.Extensibility.OperationCorrelationTelemetryInitializer, Microsoft.AI.DependencyCollector"/>
        <Add Type="Microsoft.ApplicationInsights.DependencyCollector.HttpDependenciesParsingTelemetryInitializer, Microsoft.AI.DependencyCollector"/>
    </TelemetryInitializers>

    <!--Telemetry Processing Pipeline: 這裡用來定義要過濾的遙測資料，預設會用不破壞統計精確度的取樣方式，減少傳送自動收集的遙測資料-->
    <TelemetryProcessors></TelemetryProcessors>

    <!--Telemetry Transmission: 所有遙測資料會排入都佇列，進行批次、壓縮、定期傳送至目的地-->
    <TelemetryChannel Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel, Microsoft.AI.ServerTelemetryChannel"/>

</ApplicationInsights>
```

從設定檔中我們可以看出 Application Insights SDK 處理遙測的四個階段，用下圖來表示會更清楚。

![Application Insights SDK 如何處理遙測](https://i.imgur.com/yBmcQ5e.png)

### 在應用程式中使用遙測客戶端

設定完 `ApplicationInsights.config` 之後，要讓應用程式中的 `TelemetryClient` 去抓指定的設定檔做設定，接著就可以傳送遙測資料了。使用方式其實相當簡單，程式碼參考如下：

```csharp
using System.IO;

var configuration = TelemetryConfiguration.CreateFromConfiguration(File.ReadAllText("C:\\ApplicationInsights.config"));
var telemetryClient = new TelemetryClient(configuration);
telemetryClient.TrackTrace("Hello Telemetry Client!");
```

這樣就可以把自訂的遙測訊息傳送到 Application Insights 了。

## 完整範例

文中有說到使用明確指定設定檔路徑做設定 `TelemetryClient` 比較不會有問題，這裡再來看一下完整的範例程式碼，會比較有感覺。

```csharp
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using System;
using System.IO;
using System.Net.Http;

namespace ApplicationInsightsConsole
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // 如果你用 .NET Framework 可以直接這樣設定 TelemetryClient
            // var telemetryClient = InitializeTelemetry();

            // 這裡明確指定設定檔路徑
            var configPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ApplicationInsights.config");
            var telemetryClient = InitializeTelemetry(configPath);

            // 傳送自訂訊息的遙測資料
            telemetryClient.TrackTrace("Hello World!");

            using (var httpClient = new HttpClient())
            {
                // 因為有設定 DependencyCollector 所以會自動追蹤 HTTP 呼叫
                httpClient.GetAsync("https://microsoft.com").Wait();
            }

            // 強制排清 TelemetryClient 緩衝區內的訊息
            telemetryClient.Flush();
            System.Threading.Thread.Sleep(3000);
        }

        // 透過這個自訂的方法，方便我們初始化 TelemetryClient
        private static TelemetryClient InitializeTelemetry(string configPath = null)
        {
            // 這裡會判斷是否使用明確指定設定檔路徑，若有指定，則使用自訂的設定檔
            var configuration = string.IsNullOrEmpty(configPath)
                ? TelemetryConfiguration.Active
                : TelemetryConfiguration.CreateFromConfiguration(File.ReadAllText(configPath));

            return new TelemetryClient(configuration);
        }
    }
}
```

如果

本文一開始有提到，安裝一個常用的遙測套件 `Microsoft.ApplicationInsights.DependencyCollector` 它會自動追蹤 HTTP、SQL 或某些其他外部相依性呼叫，這個遙測套件相當實用，建議一定要裝。

完整範例中，用到 `telemetryClient.Flush()` 提前清空 Application Insights 的訊息緩衝區，這常用在關閉應用程式前使用此方法強制將資料傳送出去，官方說明文件請參考[這裡](https://docs.microsoft.com/zh-tw/azure/application-insights/app-insights-api-custom-events-metrics#flushing-data?WT.mc_id=AZ-MVP-5003022)。

> 本篇完整範例程式碼請參考 [poychang/Demo-ApplicationInsights-Console-App](https://github.com/poychang/Demo-ApplicationInsights-Console-App)。

## 後記

其實這篇主要內容老早就寫好了，但是被 .NET Core 和 .NET Framework 的預設動作不一樣這件事情弄到，好險 [ApplicationInsights for .NET](https://github.com/Microsoft/ApplicationInsights-dotnet) 專案是開放原始碼的，才讓我追出底層[原始碼](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/Microsoft.ApplicationInsights/Extensibility/Implementation/Platform/PlatformImplementation.cs)到底是發生甚麼事：同樣的 `ReadConfigurationXml()` 方法有兩種實作，這也太雷了。

---

參考資料：

- [什麼是 Application Insights](https://docs.microsoft.com/zh-tw/azure/application-insights/app-insights-overview?WT.mc_id=AZ-MVP-5003022)
- [適用於 .NET 主控台應用程式的 Application Insights](https://docs.microsoft.com/zh-tw/azure/application-insights/application-insights-console?WT.mc_id=AZ-MVP-5003022)
- [Microsoft/ApplicationInsights-Home](https://github.com/Microsoft/ApplicationInsights-Home)
- [DevOps - 透過 Application Insights 將遙測最佳化](https://msdn.microsoft.com/magazine/mt808502)
- [Azure Application Insights REST API](https://dev.applicationinsights.io/)
- [Microsoft/ApplicationInsights-dotnet](https://github.com/Microsoft/ApplicationInsights-dotnet)
