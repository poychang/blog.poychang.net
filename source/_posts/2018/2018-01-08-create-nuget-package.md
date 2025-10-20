---
layout: post
title: 建立 NuGet 套件並上傳至私有的 NuGet 伺服器
date: 2018-01-08 12:00
author: Poy Chang
comments: true
categories: [Tools]
permalink: create-nuget-package/
---

上一篇介紹如何[架設私有的 NuGet 伺服器](https://poychang.github.io/hosting-your-own-nuget-server/)，這一篇要講如何在私有的 NuGet Server 上新增 NuGet 套件。

建立一個自己的 NuGet 套件有以下兩種方式：

1. 使用 [NuGet Package Explorer](https://github.com/NuGetPackageExplorer/NuGetPackageExplorer) GUI 工具
2. 使用 [NuGet CLI](https://www.nuget.org/downloads) 命令列工具

使用 NuGet Package Explorer 因為有介面，所以操作起來相對直覺，但是不同人做可能結果不同，且無法做到自動化。

因此這裡我採用在專案中添加 `.nuspec` 然後使用 NuGet CLI 來封裝套件，為了方便在 Visual Studio 2017 中製作套件，可使用 [NuPack](https://marketplace.visualstudio.com/items?itemName=CnSharpStudio.NuPack) 擴充套件。

## 使用 NuGet CLI 新增/發行套件

>為甚麼要使用指令來管理 NuGet 套件？因為要知道如何使用指令的方式來管理套件，才有辦法做到自動化。

安裝 NuGet CLI 很簡單，先到官網[這裡下載](https://www.nuget.org/downloads) `nuget.exe`，選擇官網建議使用的版本就可以了。

![下載 nuget.exe](https://i.imgur.com/iTPZBW5.png)

由於官網提供的不是 NuGet CLI 的安裝檔，而是單純的可執行檔，為了方便之後使用，建議在系統的環境變數 `PATH` 中，加上你 `nuget.exe` 的存放路徑，這樣會比較好用。

>我個人是將 `nuget.exe` 存放在 `C:\Tools\` 底下，統一管理。

有了 NuGet CLI 之後我們就可以推送/刪除 NuGet Server 上的套件了。

以下圖片使用 Dapper 套件當作要操作的套件。

在執行之前，建議先透過下列指令在本機設定目標來源的 API Key，這樣下面的操作就不用再加上 `[YOUR_SHARED_API_KEY]` 這個 API Key 參數了。 

```
nuget setApiKey [YOUR_SHARED_API_KEY] -Source http://localhost:51958/nuget
```

![nuget setApiKey](https://i.imgur.com/SbzNU0Z.png)

### 建立套件

透過 `.spec` XML 檔案設定程式包識別資訊，配合在同目錄下建立特定資料夾:

* content (放置要部署到專案根目錄下的資料夾結構及各種檔案)
* lib (放置要部署到bin下的DLL檔案，可為不同.NET Runtime版本提供專屬DLL)
* tools (安裝過程要執行的額外程序及用來做進階設定的工具程式)

接著執行 `nuget pack MyPackage.nuspec` 就可產出 `MyPackage.nupack`。

更多資訊可以參考[使用 nuget.exe CLI 建立套件](https://docs.microsoft.com/zh-tw/nuget/create-packages/creating-a-package)官方文件

### 新增套件

請使用以下指令：

```
nuget push [PACKAGE_FILE_PATH] [YOUR_SHARED_API_KEY] -Source http://localhost:51958/nuget
```

請將上列指令的 `[PACKAGE_FILE_PATH]` 改成你自己的 `.nupkg` 檔位置，並將 `[YOUR_SHARED_API_KEY]` 改成 `web.config` 檔中 `apiKey` 的值即可。

![推送套件至 NuGet Server](https://i.imgur.com/2zR9xaR.png)

然後你在 Visual Studio 的 NuGet 封裝管理員就可以找到剛剛推送的套件。

![在 NuGet 封裝管理員瀏覽新推送的套件](https://i.imgur.com/b6jhTu2.png)

### 刪除套件

請使用以下指令：

```
nuget delete [PACKAGE_ID] [PACKAGE_VERSION] [YOUR_SHARED_API_KEY] -Source https://api.nuget.org/v3/index.json
```

![刪除 NuGet Server 上的指定套件](https://i.imgur.com/SjWwkDK.png)

更多 NuGet CLI 詳細指令和說明請參考[官方文件](https://docs.microsoft.com/en-us/nuget/tools/nuget-exe-cli-reference)，或直接執行 `nuget.exe` 就會列出所有指令。若是要查詢指令的用法可在後面加一個 `?`，例如 `nuget push ?`，就會顯示使用方式。

----------

參考資料：

* [NuGet CLI reference](https://docs.microsoft.com/en-us/nuget/tools/nuget-exe-cli-reference)
* [NuGet - 建立簡單的內部 NuGet Server](http://limitedcode.blogspot.tw/2017/05/nuget-nuget-server.html)

