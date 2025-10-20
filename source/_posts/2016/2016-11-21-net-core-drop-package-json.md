---
layout: post
title: .NET Core 棄用 package.json
date: 2016-11-21 12:27
author: Poy Chang
comments: true
categories: [CSharp, WebAPI, Develop, Tools]
permalink: net-core-drop-package-json/
---

在 2016 年 5 月的時候就有消息說 .NET Core 計畫要棄用 `package.json`，在安裝完 Visual Studio 2017 並使用新範本來建立專案時，確認了這項傳言，.NET Core 棄用 package.json 啦！

在官方部落格的 [Announcing .NET Core Tools MSBuild “alpha”](https://blogs.msdn.microsoft.com/dotnet/2016/11/16/announcing-net-core-tools-msbuild-alpha/) 這篇文章中，在開頭第二段就提到這件事，當初為了讓各平台的使用者，能用非 Visual Studio 的編輯器來寫 .NET Core 程式，而導入使用的 `package.json`，但因許多客戶更希望能相容於 MSBuild，使其他專案能繼續使用，因此開發團隊擷取了 `package.json` 的優點，整合至 `.csproj/MSBuild` 中。

## `.xproj` 轉換成 `.csproj`

如此一來，使用之前 .NET Core 範本建立所產生的 `.xproj` 專案檔，到了 Visual Studio 2017 需要進行轉換才能開啟，轉換的方式有兩種：

1. 在有 `package.json` 的資料夾下，執行 `dotnet migrate` 指令
2. 使用  Visual Studio 2017 開啟專案，會跳出轉換訊息

建議使用第一個方法，因為我現行的專案總是轉不成功...

## 新建專案

在 Visual Studio 2017 不論是 Windows 或 Mac 版，都是使用 `.csproj`，不再支援 `package.json` 了。

新版的 .NET Command Line Tools 在執行 `dotnet new`、`dotnet restore`、`dotnet build`、`dotnet publish`、`dotnet run` 也都是使用 `.csproj`，不再支援 `package.json` 了。

----------

參考資料：

* [.NET Core Plans to Drop project.json](http://www.infoq.com/cn/news/2016/05/project-json)
* [.NET Core 2.0 Changes – 5 Things to Know](https://stackify.com/net-core-2-0-changes/)
