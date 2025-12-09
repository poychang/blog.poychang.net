---
layout: post
title: 為甚麼泛型主機專案改用 CreateApplicationBuilder() 後抓不到設定檔了
date: 2025-12-09 16:45
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: why-createapplicationbuilder-config-not-loaded/
---

最近在將使用 .NET 泛型主機的專案從 `Host.CreateDefaultBuilder()` 換成 `Host.CreateApplicationBuilder()` 後，使用 `builder.Configuration.SetBasePath(AppContext.BaseDirectory)` 竟然無法正確讀到 `appsettings.json` 設定檔。追進原始碼後會發現，問題並非 API 改變，而是時序與底層 `FileProvider` 的行為造成的。

> .NET 泛型主機是一種應用程式啟動與存留期管理的基礎框架，它把應用程式需要的資源與生命週期控制集中在一個物件中。

稍微前情提要一下，為什麼會要做這個改動？因為 `Host.CreateDefaultBuilder()` 是 .NET 6.0 以前建立泛型主機的 API，讓我們能快速建立一個預設配置好的主機建構器，並且支援更多現代化的組態與 DI 功能。但這個 API 使用 Callback 的方式做設定，這種作法容易造成設定錯誤，因此，在 .NET 7.0 及以後版本中，新增了 `Host.CreateApplicationBuilder()` 這個 API，整體想法是採用線性的方式來設定所有組態，在 .NET 10 之後，已經成為主流且推薦的使用方式。

以下以技術層面拆解這次遇到的問題與解法。

## 預設組態建立流程的關鍵差異

### DefaultBuilder 的模式

`Host.CreateDefaultBuilder()` 採用「傳統 HostBuilder 鍊式 API」。設定流程往往寫在 `ConfigureAppConfiguration` 中：

```csharp
Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration((ctx, config) =>
    {
        config.SetBasePath(AppContext.BaseDirectory);
        config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
        ...
    });
```

在這種模式下，`SetBasePath()` 會在你加入自己的 `AddJsonFile()` 之前執行，因此 `FileProvider` 能正確指向你指定的目錄。

### ApplicationBuilder 的模式

`Host.CreateApplicationBuilder()` 則是「先建立好完整預設組態」，包含：

* `appsettings.json`
* `appsettings.{Environment}.json`
* User Secrets
* Environment variables
* Command-line args

這些 JSON 設定來源會在建構函式階段*立即加入*，每個 `JsonConfigurationSource` 也會綁定一份建立於當下 ContentRoot 的 `PhysicalFileProvider`。

因此當組態已經加好後，你才呼叫：

```csharp
builder.Configuration.SetBasePath(AppContext.BaseDirectory);
```

此時已加入的 JSON sources 都已經綁定舊的 `FileProvider`，因此不會被更新。

這也就是為甚麼，專案改用 `CreateApplicationBuilder()` 之後，就抓不到 `appsettings.json` 設定檔的設定值了，因為它們其實是從非預期的路徑中讀取的設定。

## 解法總結（依使用情境挑選）

### 解法一：在建立時直接指定 ContentRoot（最乾淨、建議）

```csharp
var builder = new HostApplicationBuilder(new HostApplicationBuilderSettings
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory
});
```

所有預設的 appsettings 檔案都會從正確的路徑讀取，不需額外處理。

### 解法二：完全重建組態管線（適合高度客製化）

```csharp
var builder = Host.CreateApplicationBuilder(args);

builder.Configuration.Sources.Clear();

builder.Configuration
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables()
    .AddCommandLine(args);
```

可確保所有 JSON sources 使用你指定的 base path。

### 解法三：強制重設既有 JSON sources 的 FileProvider（Workaround）

適合需要沿用預設行為、但要修改路徑的情境：

```csharp
foreach (var source in builder.Configuration.Sources.OfType<FileConfigurationSource>())
{
    if (source.FileProvider == builder.Configuration.GetFileProvider())
        source.FileProvider = null;
}

builder.Configuration.SetBasePath(AppContext.BaseDirectory);
```

讓舊 sources 能在 SetBasePath 之後重新取得新的 FileProvider。

## 後記

`Host.CreateApplicationBuilder()` 的組態行為其實並沒有改變，只是「產生預設設定來源的時機」移到了建構階段，造成結果和預期不同。一旦理解 JSON sources 的 FileProvider 在加入時即被固定，就能理解為何 SetBasePath 會失效。

若你從舊風格的 DefaultBuilder 過渡到 ApplicationBuilder，必須調整組態初始化策略，否則就會遇到「明明改了 BasePath，卻讀不到設定檔」的情況。

處理方式並不複雜，理解時序後，挑選適合的解法即可完成遷移。

---

參考資料：

- [MS Learn - .NET 泛型主機](https://learn.microsoft.com/zh-tw/dotnet/core/extensions/generic-host?WT.mc_id=DT-MVP-5003022)
- [MS Learn - HostApplicationBuilder 類別](https://learn.microsoft.com/zh-tw/dotnet/api/microsoft.extensions.hosting.hostapplicationbuilder?WT.mc_id=DT-MVP-5003022)
- ['Host.CreateDefaultBuilder' vs 'WebApplication.CreateBuilder' API shape inconsistency](https://github.com/dotnet/runtime/discussions/81090)
