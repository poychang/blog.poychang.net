---
layout: post
title: 免費在 GitHub Pages 執行你的 Angular 應用程式
date: 2018-11-18 22:43
author: Poy Chang
comments: true
categories: [Angular]
permalink: publish-angular-app-to-github-pages/
---

GitHub 除了提供版控的功能，還有一個服務叫做 [GitHub Pages](https://pages.github.com/)，可以透過他來架設靜態網頁，甚至還有提供綁定網域名稱的功能，因此這對於想用來展示作品集、做單頁式行銷，甚至拿來部屬 SPA 應用程式都是可以的，這篇來分享如何將 Angular 應用程式佈署到 GitHub Pages，輕鬆地展示你的開發成果。

## GitHub Pages 的限制

畢竟他是個免費的服務，有一些限制你必須先知道：

1. 不支援任何後端程式語言，例如 C#、PHP 等，僅支援呈現靜態網頁
2. 不支援 `.htaccess` 設定檔
3. 不支援 FTP 上傳，僅能透過 Git 來上傳檔案
4. 所有的 GitHub Pages 都是公開的，即使你是使用私有的專案，該頁面也是公開的

## 佈署 Angular 到 GitHub Pages

基本流程如下：

1. 建立 GitHub 專案
2. 執行 `npm i -g angular-cli-ghpages` 安裝 [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages) 至全域環境
3. 執行 `ng build --prod --base-href /GITHUB_PROJECT_NAME/` 修改 index.html 的 base href 並產生要佈署的檔案
4. 執行 `npx ngh` 將 `dist` 資料夾下的 Angular App 佈署到 Github Pages
5. 開啟網站 `http://GITHUB_ACCOUNT.github.io/GITHUB_PROJECT_NAME`

這邊用一個很久以前在練習 Angular 2 的專案 [poychang/angular-tour-of-heroes](https://github.com/poychang/angular-tour-of-heroes) 做示範。

### 前置作業

首先執行 `npm i -g angular-cli-ghpages` 安裝 angular-cli-ghpages 套件，或用 `ngh --version` 檢查本機是否已經有安裝過了。

![檢查本機 angular-cli-ghpages 版本](https://i.imgur.com/GItZ3pl.png)

將專案從 GitHub Clone 到本機後，還原相依的 npm 套件。

![還原專案 npm 套件](https://i.imgur.com/2sgllAT.png)

### 建置專案

這是重點步驟，在執行 `ng build` 建置專案時，需要一個重點參數 `--base-href`。

因為 GitHub Pages 會給你一個像 `GITHUB_ACCOUNT.github.io` 這樣的網域，其中 `GITHUB_ACCOUNT` 就是你的 GitHub 帳號，而專案的網址會是基於這個網域之下，會長的像 `GITHUB_ACCOUNT.github.io/GITHUB_PROJECT_NAME` 這樣，其中 `GITHUB_PROJECT_NAME` 就是你在 GitHub 上面建立的專案名稱。

而 Angular 應用程式會基於 `index.html` 中的 `base href` 當作應用程式的根目錄，預設會設定 `/` 使用網站根目錄當起始點。

![預設的 base href](https://i.imgur.com/wxoFQNS.png)

這裡我們希望將 `index.html` 中的 `base href` 修改成如下圖這樣，使用 `/angular-tour-of-heroes/` 當作 Angular 應用程式的起始目錄。

![修改後的 base href](https://i.imgur.com/DXmZLnI.png)

要做到這效果，我們執行 Angular CLI 建置命令時要加上 `--base-href` 參數，如 `ng build --prod --base-href /angular-tour-of-heroes/`，使之在建置時幫我們修改 `index.html` 中的 `base href`。

>請注意！這裡所設定 base-href 要跟 GitHub 專案名稱一樣，且要注意大小寫。

![建置專案並設定 base href](https://i.imgur.com/2pbrUTF.png)

### 佈署至該專案的 GitHub Pages

其實佈署到 GitHub Pages 就是在該 GitHub 專案中建立一個 `gh-pages` Git 分支，然後將建置專案後的靜態檔案上傳上去即可。

透過 angular-cli-ghpages 這個套件，讓我們可以在專案目錄下，簡單執行 `npx ngh` 指令，讓這些動作自動完成。

![執行 npx ngh 指令](https://i.imgur.com/QCb5evH.png)

如果你要佈署的是 Angular 6 以上版本的專案，因為 Angular CLI 會在 `dist` 資料夾下建立對應你 app 名稱的資料夾，因此你需要手動指定靜態檔案的來源位置，指令如下，其中 `PROJECT_NAME` 就是你 Angular 專案中的 App 名稱：

```bash
npx ngh --dir=dist/PROJECT_NAME
```

如果你想知道執行過程中詳細的 log 訊息，可以執行 `npx ngh --no-silent` 指令，將過程中的訊息顯示出來。從 log 中你也可以清楚的知道，他背後的動作其實就只是一系列 Git 的操作而已。

![執行 npx ngh 指令並顯示詳細 log 訊息](https://i.imgur.com/67jlY4s.png)

>npx 是甚麼？[npx](https://github.com/zkat/npx) 是 NPM 5.2 版後加入的命令，方便開發者使用套件中所提供的命令列工具，例如 `./node_modules/.bin/webpack -v` 這樣的命令，可以改用 `npx webpack -v` 來執行。

### 開啟網站

完成上述的建置及佈署後，就可以開啟瀏覽器，輸入 [https://blog.poychang.net/angular-tour-of-heroes/heroes](https://blog.poychang.net/angular-tour-of-heroes/heroes) 來檢視你的 Angular 應用程式囉。

![檢視 angular-tour-of-heroes 網站](https://i.imgur.com/TlZL0jr.png)

## 後記

有了免費的前端站台，如果你還需要後端站台來提供 API 服務了話，可以[註冊一個 Azure](https://azure.microsoft.com/zh-tw/free/) 帳號來玩玩看，Azure 提供了很多免費的服務可以玩，尤其是 [Web App](https://azure.microsoft.com/zh-tw/services/app-service/web/) 的免費方案非常實用，還可以輕鬆架設後端 API 站台，但是僅適用於流量不高且沒有自訂網域需求的情境下，但展示站台本來流量就不高，而且對於後端 API 來說，自訂網域也沒有那麼重要（畢竟使用者不會看到）。

集成了 GitHub 和 Azure 兩個重量級的網路資源，讓你輕鬆展示作品集 <3

----------

參考資料：

* 使用 GitHub 免費製作個人網站](https://gitbook.tw/chapters/github/using-github-pages.html)
* [stories github pages](https://github.com/angular/angular-cli/wiki/stories-github-pages)
* [angular-schule/angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages)
