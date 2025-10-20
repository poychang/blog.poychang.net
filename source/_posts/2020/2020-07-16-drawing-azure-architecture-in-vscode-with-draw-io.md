---
layout: post
title: 使用 VSCode 製作 Azure 架構圖
date: 2020-07-16 15:05
author: Poy Chang
comments: true
categories: [Azure, Tools]
permalink: drawing-azure-architecture-in-vscode-with-draw-io/
---

先前在我的 Facebook 粉絲團[Poy Chang 的技術交流中心](https://www.facebook.com/poychang.tech)分享過畫 Azure 雲端架構圖所必備的高品質的 [Azure 雲服務 Icon](https://azure.microsoft.com/en-us/patterns/styles/glyphs-icons/)，藉此增加架構圖的美感，然而畫架構圖除了可以用 [Microsoft Visio](https://www.microsoft.com/zh-tw/microsoft-365/visio/flowchart-software)搭配 [Azure Visio Stencil](https://github.com/David-Summers/Azure-Design/blob/master/ICONS_Azure-Full-Colour_V-2.8.vssx)之外，[Diagrams](https://www.diagrams.net/)（前身就是 Draw.io）也是一套相當不錯的工具，而且他在今年 [6 月還推出了 VSCode 擴充套件](https://www.diagrams.net/blog/embed-diagrams-vscode)，讓開發者能直接用 Visual Studio Code 來製作架構圖唷。

## Diagrams

Diagrams 原本只有提供線上版的工具，只需要連到 [app.diagrams.net](https://app.diagrams.net/) 這個網站，就可以開始製作架構圖，而且他支援的檔案來源有本機、Google Drive、OneDrive、Dropbox，甚至還可以從 GitHub、GitLab 來開啟檔案，相當方便。

當電腦沒有網路想要離線編輯的時候，有兩種處理方式，第一種是透過 PWA 的方式，將 Diagrams 網站安裝成 PWA 應用程式，如果你是使用 Microsoft Edge 了話，安裝方式就只是開啟 [app.diagrams.net](https://app.diagrams.net/) 然後在網址列上點擊右側的安裝鈕即可，如下圖：

![使用 Microsoft Edge 安裝 Diagrams PWA 應用程式](https://i.imgur.com/NLdpH7z.png)

同時 Diagrams 也有推出用 Electron 打造的桌上型應用程式 [drawio-desktop](https://github.com/jgraph/drawio-desktop/)，你可以直接從[該專案的 GitHub Release](https://github.com/jgraph/drawio-desktop/releases) 上直接下載你所需要的版本來安裝即可。

## VSCode 擴充套件

前面講了兩種離線使用 Diagrams 畫架構圖的方式，而對於某些開發者來說 VSCode 是他們每天都在用的工具，如果讓這個工具除了寫程式之外，還能同時畫架構圖，這樣多方便呀！

Diagrams 上個月推出了整合他們自家服務的 VSCode 擴充套件 [Draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio)，使用這個擴充套件你就可以在 VSCode 上編輯或打開 `.drawio`、`.dio`、`.drawio.svg`、`.drawio.png` 這些檔案，或者使用 VSCode 的指令 `Draw.io: Convert To...` 來轉換檔案格式。

>這裡大推 `.drawio.svg` 這個檔案格式，他除了保有可編輯的特性，還可以直接在 GitHub 的 README 檔案上美美的呈現唷。

VSCode 載入 Diagrams 所支援的檔案格式後，所開啟的編輯介面如下：

![Diagrams 編輯介面](https://i.imgur.com/LewS1Kl.png)

## Azure 資源圖示

對於 Azure 雲端資源的架構圖，網路上有人整理並做成 Diagrams 用的 Azure 相關資源圖庫，如果想直接使用線上版的 Diagrams 來畫 Azure 架構圖，你可以[點此連結](https://app.diagrams.net/?splash=0&clibs=Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Analytics.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Blockchain.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Compute.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Containers.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Databases.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-DevOps.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Favorites.xml.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-General.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Identity.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Integration.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Intune.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-IoT.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Machine-Learning.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Manage.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Migrate.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Miscellaneous.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Networking.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Security.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Stack.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Storage.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FAzure-Web.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FCommands.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FLogos.xml;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fpacodelacruz%2Fdiagrams-net-azure-libraries%2Fmaster%2FEnterprise.xml;)開啟預先載入各種 Azure 圖庫的檔案，從下圖的左側可以看到各種類型的 Azure 資源分類，有興趣的人可以開起來自己玩玩看。

![預先載入 Azure 圖庫的線上版 Diagrams 檔畫面](https://i.imgur.com/hrNGgFH.png)

如果你仔細看上面那個連結內容，其實可以推敲得出來，那些 Azure 圖庫是從 GitHub 上載入的，你可以看看 [pacodelacruz/diagrams-net-azure-libraries](https://github.com/pacodelacruz/diagrams-net-azure-libraries) 這個專案內容，而這個專案的背後則是匯集 [Azure Icon Collection](https://code.benco.io/icon-collection/) 這裡的資源。

那如果是離線版的呢？要載入這些前人整理好的 Azure 圖庫檔其實也很簡單，也就 3 個步驟：

1. 從 [pacodelacruz/diagrams-net-azure-libraries](https://github.com/pacodelacruz/diagrams-net-azure-libraries) 這裡下載所有 `.xml` 檔
2. 用 VSCode 開啟 `.drawio`（或其他有支援的檔案格式）檔案
3. 從上方的工具列（擴充套件的產生的） File > Import From > Device 匯入 `.xml` 檔，或者將檔案直接拖曳進去也可以

![在 VSCode 中匯入 Azure 資源圖庫](https://i.imgur.com/iB6OwTe.png)

如此一來，要用 VSCode 來畫美美的 Azure 架構圖或其他各式各樣的架構圖，也就輕鬆很多了。

----------

參考資料：

* [Azure Icons Libraries for Diagrams.net (Draw.io)](https://pacodelacruz.io/2020/06/11/azure-icons-library-diagrams-net)
* [Azure.microsoft.com UX Patterns](https://azure.microsoft.com/en-us/patterns/styles/glyphs-icons/)
* [David-Summers/Azure-Design](https://github.com/David-Summers/Azure-Design/)
* [Azure Icon Libraries for Diagrams.net - XML File](https://github.com/pacodelacruz/diagrams-net-azure-libraries)
