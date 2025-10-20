---
layout: post
title: launchSettings.json 的 commandName 是做什麼用的？
date: 2019-07-19 15:06
author: Poy Chang
comments: true
categories: [Dotnet, WebAPI, Develop]
permalink: visual-studio-launch-settings-iis-express-iis-project-executable/
---

當我們使用 Visual Studio 開發 ASP.NET Core 網站的時候，執行偵錯時，Visual Studio 會去讀取 `launchSettings.json` 設定檔，並根據所提供的設定值來啟動網站，但裡面有個屬性 `commandName` 其實很關鍵，關係到 Visual Studio 是"如何"啟動網站的。

## 緣由

在參考這篇[在 ASP.NET Core WebAPI 中做 Windows 驗證](https://blog.poychang.net/asp-net-core-windows-authentication/)的文章做實驗時，有些人可以成功拿到 Windows 驗證的 AD 資訊，但有些人沒辦法，正覺得奇怪時，發現成功取得 AD 資訊的人，是使用 `IIS Express` Profile 來啟動應用程式，而無法取得資訊的人是用 `WindowsSecurity`。

![選擇使用哪個 Profile 啟動應用程式](https://i.imgur.com/Ry6cCC3.png)

為什麼一個可以，應一個不行呢？原因就在 `commandName` 這個屬性。

## launchSettings.json 設定檔

如果你使用 Visual Studio 來建立專案，你會發現 Properties 資料夾下會有個 `launchSettings.json` 設定檔，這是 Visual Studio 用來決定執行應用程式時要套用的環境設定，下面的範例則是從 [WindowsSecurity](https://github.com/poychang/Demo-Net-Core-Auth/tree/master/WindowsSecurity) 這個專案修改而來。

```json
{
  "iisSettings": {
    "windowsAuthentication": true,                 // 啟動 Windows 身分驗證
    "anonymousAuthentication": false,              // 啟動匿名驗證
    "iisExpress": {
      "applicationUrl": "http://localhost:60164/", // 應用程式啟動的 URL 路徑
      "sslPort": 0                                 // 啟動 SSL 的連接埠
    }
  },
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",                 // 執行應用程式的模式
      "commandLineArgs": "",                       // 傳遞命令參數
      "workingDirectory": "",                      // 設定執行的工作目錄
      "launchBrowser": true,                       // 是否啟動瀏覽器
      "launchUrl": "api/values",                   // 啟動瀏覽器後的相對 URL 位置
      "environmentVariables": {                    // 設定環境變數
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "WindowsSecurity": {
      "commandName": "Project",
      "launchBrowser": true,
      "launchUrl": "api/values",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "applicationUrl": "http://localhost:60165/"
    }
  }
}
```

基本上分兩個段落，`iisSettings` 段落為 IIS 設定，裡面可以 IIS 或 IIS Express 通用的設定值，而 `profiles` 段落則是讓 Visual Studio 可以選擇要用哪個 Profile 來啟動應用程式。

>`launchSettings.json` 設定檔完整的屬性列表，可以參考這裡 [http://json.schemastore.org/launchsettings](http://json.schemastore.org/launchsettings)，透過這個 JSON Schema 來推敲所有能設定的屬性。

## 執行應用程式的模式 commandName

關鍵來了！`commandName` 這個屬性相當重要，JSON Schema 所提供的定義為：Identifies the debug target to run，標識要執行的偵錯目標。

這是甚麼意思？

先看看 `commandName` 這個屬性可以有哪些設定：

- `IIS Express`: 預設會使用此設定，這會使用 Visual Studio 所提供的 IIS Express 測試伺服器來執行應用程式，例如 ASP.NET Core 應用程式
- `IIS`: 如果你本機有安裝完整版的 IIS，可以使用此設定，讓你的應用程式直接在 IIS 中運行
- `Project`: 使用 Console 的方式來啟動應用程式，這相當於你用 dotnet CLI 來執行，因此可以從 Console 中直接看到應用程式的輸出，對於 ASP.NET Core 應用程式來說，其內建了 Kestrel 輕量網頁伺服器，因此用此模式來啟動網頁應用程式也是沒問題的
- `Executable`: 允許你執行任意的可執行檔（EXE 檔），這選項不適用於網頁應用程式

所以基本上開發 ASP.NET Core 應用程式，你只會用到上述前 3 種模式，至於要使用哪一種模式，就看開發者的選擇了。

## 回到緣由

為什麼 ASP.NET Core 要取得 AD 資訊時，使用 `IIS Express` Profile 會成功，用 `WindowsSecurity` 卻會失敗呢？

從上面的 `launchSettings.json` 設定檔可以看出來，`IIS Express` Profile 使用的是 `IISExpress` 模式，而 `WindowsSecurity` Profile 使用的是 `Project` 模式。

然而 Kestrel 輕量網頁伺服器是無法取得 Windows 驗證資訊的，只有 IIS 系的網頁伺服器才有辦法取得 Windows 驗證的 AD 資訊，所以造成有些人成功、有些人失敗的狀況。

## 後記

`launchSettings.json` 設定檔的資訊相當少，官方文件也相當稀缺，要不是遇到這次的狀況，也不太會仔細研究這個設定檔裡面的屬性，希望這篇文章能幫助到正在閱讀的你。

----------

參考資料：

* [ASP.NET Core launch settings: IIS Express, IIS, Project, Executable](https://stackoverflow.com/questions/51801184/asp-net-core-launch-settings-iis-express-iis-project-executable)
