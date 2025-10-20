---
layout: post
title: 架設私有的 NuGet 伺服器
date: 2018-01-07 17:27
author: Poy Chang
comments: true
categories: [Tools]
permalink: hosting-your-own-nuget-server/
---
NuGet 對於 .NET 開發人員的重要如同喝咖啡一般，當你開發了一套給自己或內部人員使用的套件時，有個 NuGet Server 幫你管理這些套件，那是多麼開心的一件事。

從微軟官方文件看到一篇[如何架設私有 NuGet 伺服器](https://docs.microsoft.com/zh-tw/nuget/hosting-packages/overview?WT.mc_id=DT-MVP-5003022)，裡面提到有三種方法：

1. [Local feed](https://docs.microsoft.com/zh-tw/nuget/hosting-packages/local-feeds?WT.mc_id=DT-MVP-5003022)
	* 在本機透過 `nuget init` 和 `nuget add` 指令建立 NuGet 的資料夾架構，再透過分享檔案的方式來使用
2. [NuGet Server](https://docs.microsoft.com/zh-tw/nuget/hosting-packages/nuget-server?WT.mc_id=DT-MVP-5003022)
	* 架設簡易網站提供 NuGet 服務
	* 除了用此 [NuGet Server](http://nugetserver.net/) 套件來架設外，還可以用 [VSTS](https://www.visualstudio.com/docs/package/nuget/publish)、[MyGet](http://myget.org/)、[ProGet](http://inedo.com/proget)、[NuGet Server (Open Source)](http://nuget-server.net/) 等工具
3. [NuGet Gallery](https://github.com/NuGet/NuGetGallery#build-and-run-the-gallery-in-arbitrary-number-easy-steps)
	* 架設如同 [nuget.org](https://www.nuget.org/) 的網站，除了提供 NuGet 服務外，還包含網站介面等探索功能

內部的使用通常不需要網站介面，能夠存取私有 NuGet Server 上的套件就可以了，這裡用 [NuGet Server](http://nugetserver.net/) 這套件來架設。

以下分三個段落：

1. 架設 NuGet Server 步驟
2. 設定 Visual Studio 的 NuGet 來源
3. 新增 NuGet 套件

## 架設 NuGet Server 步驟

建立 ASP.NET Web 應用程式 (.NET Framework) 專案，取名叫做 `PrivateNuGetServer`。

![建立專案](https://i.imgur.com/zSn1Qtp.png)

選用空白專案範本。

![選用空白專案範本](https://i.imgur.com/4P1uJP3.png)

使用 NuGet 安裝 [NuGet Server](https://www.nuget.org/packages/NuGet.Server/) 套件，你也可以使用 NuGet 的套件管理器主控台並執行 `Install-Package NuGet.Server` 指令來安裝。

![安裝 NuGet.Server 套件](https://i.imgur.com/xuv5IYe.png)

>注意！如果你的目標框架是使用 .NET Framework 4.5.2，NuGet Server 套件請選用 2.10.3 版。

安裝套件的過程中，會修改 `web.config` 增加所需設定，另外還會產生一個 `Packages` 資料夾，之後上傳的套件就會存放在這裡。

如果想要在 NuGet Server 上線時，預設包含某些套件，可以直接將該套件的 `.nupkg` 檔放入 `Packages` 資料夾中，並修改該檔案的屬性，將**複製到輸出目錄**的設定改成**一律複製**即可。

![預設包含某些套件](https://i.imgur.com/Pe6LdXk.png)

>注意！如果你有用 Git 做版控，Visual Studio 預設的 `.gitignore` 是會排除 `.ngpkg` 檔，如果你想要把預設的套件加入版控，記得調整一下 `.gitignore` 檔。

到這裡就可以按 `Ctrl` + `F5` 測試一下 NuGet Server 囉！

![NuGet Server 運行畫面](https://i.imgur.com/RjTB2vg.png)

記住 Repository URLs 方框內的網址，如上圖的 `http://localhost:51958/nuget`，這就會是之後我們私有 NuGet 套件庫的來源網址。 

## 設定 Visual Studio 的 NuGet 來源

要在 Visual Studio 中取得我們架設的私有 NuGet Server 套件，可以參考以下設定步驟：

從工具列中的**工具** > **NuGet 封裝管理員**開啟**套件管理員設定**

![套件管理員設定](https://i.imgur.com/93zWpcG.png)

在**套件來源**中點選加號新增，並輸入你的 NuGet Server 名稱及來源（來源請參考剛剛安裝步驟中的網址），這樣就完成了。

接下來你就可以在 NuGet 封裝管理員中，修改套件來源，指向我們私有的 NuGet Server，就會列出私有 NuGet Server 有提供的套件了。

![設定套件來源](https://i.imgur.com/wRzylSy.png)

>題外話，如果你去看運行中的 NuGet Server 中的 `Packages` 資料夾，你會發現他的檔案結構後我們專案中的結構不太一樣，這是因為 NuGet 自動將套件做分檔、歸類，以增加搜尋效能，簡單說就是讓 NuGet 自己更容易管理。

## 新增 NuGet 套件

在新增 NuGet 套件前，有些設定和環境要先處理。

### 設定 NuGet Server

首先 `web.config` 檔有兩個設定值與增加套件有關，`requireApiKey` 和 `apiKey`。

```xml
<appSettings>
    <!--
    設定 Api Key 是否為必要的，若設定為 true 則必須設定 apiKey，於推送或刪除套件時使用
    -->
    <add key="requireApiKey" value="true" />

    <!--
    設定使用者可用此 Api Key 來向 NuGet Server 推送或刪除套件
    請注意！此為所有使用者共同使用的金鑰
    -->
    <add key="apiKey" value="[YOUR_SHARED_API_KEY]" />
</appSettings>
```
 
如果你的 NuGet Server 是給內部網路的使用者使用，外部網路是存取不到的時候，可以將 `apiKey` 保持空白 `requireApiKey` 設定成 `false`，方便增加套件。

### NuGet CLI

安裝 NuGet CLI 很簡單，先到官網[這裡下載](https://www.nuget.org/downloads) nuget.exe，選擇官網建議使用的版本就可以了。

![下載 nuget.exe](https://i.imgur.com/iTPZBW5.png)

官網提供的不是 NuGet CLI 的安裝檔，而是單純的可執行檔，為了方便之後使用，建議在系統的環境變數 `PATH` 中，加上你 nuget.exe 的存放路徑，這樣會比較好用。

### 新增/刪除套件

>以下圖片使用 Dapper 套件當作要操作的套件。

有了 NuGet CLI 之後我們就可以推送套件至 NuGet Server了，不過在執行之前，建議先透過下列指令在本機設定目標來源的 API Key。 

```
nuget setApiKey [YOUR_SHARED_API_KEY] -Source http://localhost:51958/nuget
```

![nuget setApiKey](https://i.imgur.com/SbzNU0Z.png)

推送新增的套件，請使用以下指令：

```
nuget push [PACKAGE_FILE_PATH] [YOUR_SHARED_API_KEY] -Source http://localhost:51958/nuget
```

請將上列指令的 `[PACKAGE_FILE_PATH]` 改成你自己的 `.nupkg` 檔位置，並將 `[YOUR_SHARED_API_KEY]` 改成 `web.config` 檔中 `apiKey` 的值即可。

![推送套件至 NuGet Server](https://i.imgur.com/2zR9xaR.png)

然後你在 Visual Studio 的 NuGet 封裝管理員就可以找到剛剛推送的套件。

![在 NuGet 封裝管理員瀏覽新推送的套件](https://i.imgur.com/b6jhTu2.png)

要刪除 NuGet Server 上的套件，請使用以下指令：

```
nuget delete [PACKAGE_ID] [PACKAGE_VERSION] [YOUR_SHARED_API_KEY] -Source https://api.nuget.org/v3/index.json
```

![刪除 NuGet Server 上的指定套件](https://i.imgur.com/SjWwkDK.png)

>如果有執行剛剛的 `serApiKey`，上述指令就不用輸入 `[YOUR_SHARED_API_KEY]`。

更多 NuGet CLI 詳細指令和說明請參考[官方文件](https://docs.microsoft.com/en-us/nuget/tools/nuget-exe-cli-reference?WT.mc_id=DT-MVP-5003022)，或直接執行 `nuget.exe` 就會列出所有指令。若是要查詢指令的用法可在後面加一個 `?`，例如 `nuget push ?`，就會顯示使用方式。

>本篇完整範例程式碼請參考 [poychang/DemoPrivateNuGetServer](https://github.com/poychang/DemoPrivateNuGetServer)。

## 後記

## 修改套件存放位置

在 `web.config` 中還有很多選項可以讓我們調整 NuGet Server 的設定，其中之一就是調整套件的存放位置，請參考下列程式碼。

```xml
<appSettings>
    <!--
    修改套件存放位置
    預設是 ~/Packages 網站下的 Packages 資料夾
    這個路徑可以是虛擬或是實體路徑
    -->
    <add key="packagesPath" value="C:\MyPackages" />
</appSettings>
```

----------

參考資料：

* [NuGet Documentation](https://docs.microsoft.com/zh-tw/nuget/?WT.mc_id=DT-MVP-5003022)
* [NuGet.Server](http://nugetserver.net/)

