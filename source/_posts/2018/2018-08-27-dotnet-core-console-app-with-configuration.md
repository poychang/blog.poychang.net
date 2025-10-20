---
layout: post
title: 在 .NET Core 主控台應用程式中使用 appsettings.json 設定檔
date: 2018-08-27 18:27
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: dotnet-core-console-app-with-configuration/
---

如果建立過 ASP.NET Core 的專案範本，會在專案資料夾中看到 `appsettings.json` 這個 ASP.NET Core 應用程式的組態設定檔，透過這個檔案我們可以把應用程式的設定從程式碼中抽離，以達到跨環境，或是管理組態檔的目的。如果要在主控台應用程式中使用這樣的手法來控制組態設定，或是要透過環境變數來指定你要使用的組態檔，你可以參考這篇的作法。

## 建立專案

首先，使用 Visual Studio 預設的主控台應用程式(.NET Core)專案範本來建立一個空白的專案。

![使用預設的主控台專案範本](https://i.imgur.com/dgXDO6H.png)

預設的專案樣貌很簡單，只有一個 `Program.cs` 檔案。

![預設的專案樣貌](https://i.imgur.com/mmEFtgF.png)

## 安裝套件

組態設定可以來自多種來源，可能是來自一個 JSON 檔或者是來自環境變數，以下為常見的來源：

- 檔案格式，例如 INI、JSON 或者 XML 檔
- 透過啟動應用程式時，給的命令列參數
- 執行環境的環境變數

這裡我們會使用微軟提供的 `ConfigurationBuilder` 來幫助我們整合多來源的組態設定，主要會使用到以下 3 個套件，用途說明如下：

- `Microsoft.Extensions.Configuration` 提供管理基於 key-value 結構的組態設定的建造者
- `Microsoft.Extensions.Configuration.Json` 提供從 JSON 檔案取得組態設定的提供者
- `Microsoft.Extensions.Configuration.EnvironmentVariables` 提供從環境變數取得組態設定的提供者

除了上面 3 個套件外，建議多安裝下面這個：

- `Microsoft.Extensions.Configuration.Binder` 提供綁定資料與物件的擴充方法，搭配 POCO 讓組態設定更容易被使用（詳參考下面的範例）

## 讀取組態

加入 `appsetting.json` 組態設定檔至主控台應用程式專案資料夾中，設定檔內容如下：

```json
{
    "Message":  "It's appsettings.json" 
}
```

為了讓我們之後方便取用組態設定檔中的設定值，比照設定檔內容建立一個 POCO 模型 `AppSettingsModel.cs`：

```csharp
public class AppSettingsModel
{
    public string Message { get; set; }
}
```

接著建立一個透過 `ConfigurationBuilder` 取得組態設定的方法，請參考下列程式碼：

```csharp
public static IConfigurationRoot ReadFromAppSettings()
{
    return new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", false)
        .Build();
}
```

動作很簡單，就是靠 `ConfigurationBuilder` 將應用程式執行目錄下的 `appsettings.json` 檔案來源載入，最後透過 `Build()` 產生一個組態物件做回傳。

這裡如果你想要增加並整合不同的來源組態時，例如依照環境變數載入 Debug 的組態檔，或者載入來自環境變數的組態設定，請參考下列程式碼：

```csharp
public static IConfigurationRoot ReadFromAppSettings()
{
    return new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", false)
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("NETCORE_ENVIRONMENT")}.json", optional: true)
        .AddEnvironmentVariables()
        .Build();
}
```

第二個 `AddJsonFile()` 會透過藉由 `NETCORE_ENVIRONMENT` 這個環境變數來指定要加載的組態檔，使用這個方法時，通常會加上 `optional` 這個參數，`true` 代表這個加載項是非必要的，沒有這個檔案也沒關係。

而 `AddEnvironmentVariables()` 則是會載入來自環境變數的組態設定。

>`NETCORE_ENVIRONMENT` 是自訂的環境變數名稱，是參考至 ASP.NET Core 會使用 `ASPNETCORE_ENVIRONMENT` 環境變數，作為區分來源組態的設定。

順便提一下。

在開發時間，多少都會用 Visual Studio 的偵錯功能來測試開發中的應用程式，這時我們可以在專案屬性設定的偵錯 (Debug) 頁籤中設定偵錯時期的環境變數 (如下圖)，或者你也可以直接修改 `Properties` 資料夾下的 `launchSettings.json`，自己指定對應環境變數的值。

![在 Visual Studio 偵錯時期加入環境變數](https://i.imgur.com/XwoChZp.png)

## 建置 & 執行

到這裡我們就可以透過切換環境變數，來指定應用程式要使用哪一個組態檔了，執行結果如下圖。

![切換環境變數的結果](https://i.imgur.com/nBERC3A.png)

## 其他細節

到這裡我們想要達成的目標都處理好了，以下是一些其他細節的補充。

### 調整專案的檔案結構

我們期待的專案的檔案結構會像是下圖右邊，`appsettings.json` 會有檔案階層，這樣看起來比較順眼。

![建立 appsettings.json 的檔案階層](https://i.imgur.com/KINKSQo.png)

要做到檔案階層的收折，要來調整 `.csproj` 專案檔，請參考下列程式碼：

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <!-- 略... -->
    <ItemGroup>
        <None Update="appsettings.json">
            <CopyToOutputDirectory>Always</CopyToOutputDirectory>
        </None>
        <None Update="appsettings.*.json">
            <CopyToOutputDirectory>Always</CopyToOutputDirectory>
            <DependentUpon>appsettings.json</DependentUpon>
        </None>
    </ItemGroup>
</Project>
```

接著把每個檔案都加進去 `ItemGroup` 並做對應的設定，或者可以使用 `*` 萬用字元來將多個檔案一起做設定。這裡有兩個屬性要知道：

- `CopyToOutputDirectory` 設定是否複製至輸出資料夾，有以下三個設定值
  - `Never` 不複製至輸出資料夾
  - `Always` 總是複製至輸出資料夾
  - `PreserveNewest` 有更新時才複製至輸出資料夾
- `DependentUpon` 設定此檔案依賴於哪個主要檔案

如此一來，我們的專案的檔案結構就變得漂亮多了。

### 組態設定的使用

永遠不要將密碼或其他敏感性資料儲存在組態設定檔中 (盡量啦...)，絕對不要在開發或測試環境中使用生產環境的密鑰，最好的做法是在專案外部指定，防止沒有授權的人存取原始碼時，取得不該看到的資訊，因此開發時期可以透過 Secret Manager 或是環境變數來存放敏感資訊，會是個好方法。

若是使用環境變數來指定的組態值，冒號 (`:`) 可能無法在所有平台上運作，建是使用雙底線 (`__`) 來對環境變數命名，以取得所有平台的支援。

然而在 `ConfigurationBuilder` 中，我們還是可以在所有平台上，透過冒號 (`:`) 的方法取得階層的組態設定值。

>本篇完整範例程式碼請參考 [poychang/Demo-Config-Console-App](https://github.com/poychang/Demo-Config-Console-App)。

----------

參考資料：

* [ASP.NET Core 建立、取得組態設定檔的方法](https://docs.microsoft.com/zh-tw/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration&WT.mc_id=DT-MVP-5003022)
* [在 ASP.NET Core 開發的應用程式祕密的安全儲存體](https://docs.microsoft.com/zh-tw/aspnet/core/security/app-secrets?view=aspnetcore-2.1&tabs=windows&WT.mc_id=DT-MVP-5003022)
