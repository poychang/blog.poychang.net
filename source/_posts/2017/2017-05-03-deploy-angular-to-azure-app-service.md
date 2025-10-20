---
layout: post
title: 在 Azure 中使用 CI 和 CD 佈署 Angular 應用程式 
date: 2017-05-03 23:10
author: Poy Chang
comments: true
categories: [Angular, Azure, Tools]
permalink: deploy-angular-to-azure-app-service/
---
DevOps 當道的時代，CI 和 CD 這兩個名詞一定要知道，而在 Azure App Service 上，也有提供 CI、CD 的服務，讓你可以使用各種版控工具做提交，然後執行腳本來完成持續整合，並在最後發布至 Azure App Service 中。

一般來說，在開發完 Angular 的應用程式後，如果要部署到 Azure 上，你必須在本機 `ng build` 一次後，再將 `dist` 資料夾中的檔案上傳到 Azure 中，才能順利開啟網頁。

## Azure 的版控部署選項

其實我們可以設定 Azure 上面提供的**部署選項**，直接和版控工具或是儲存系統勾再一起，目前部署選項支援：

* Visual Studio Team Services
* OneDrive
* 本機 Git 儲存機制
* Github
* Bitbucket
* Dropbox
* 外部儲存機制

![部署選項](http://i.imgur.com/xp7uXOf.png)

這裡的設定在 Azure Portal 上都可以很直覺的操作，如果今天是開發 ASP.NET 專案了話，直接在部署選項設定使用的部署方式即可。

但如果是像 Angular CLI 產生的前端專案，因為必須透過 node.js 並執行指定的腳本指令（如 `ng build`），或透過 gulp、webpack 等工具做套件還原等動作，我們就必須修改 Azure Web App 預設的部署腳本了。

下面就以 Angular 專案來介紹設定部署的流程。

## Angular 部署流程

主要部署流程的步驟如下：

1. 建立專案
2. 建立部署腳本
3. 修改 Azure 起始虛擬應用程式和目錄

### 建立專案

這邊我使用 Angular CLI 工具來產生前端專案，執行指令 `ng new AzureProject` 產生名為 `AzureProject` 的專案。

產生完成後，在專案資料夾下可以執行 `ng serve` 來啟動專案看看是否一切都正常運作。沒有意外了話，可以在瀏覽器看到下面這個畫面。

![本機執行結果](http://i.imgur.com/yRqY50a.png)

### 建立部署腳本

透過 Azure 版控部署的時候，基本上會有三個步驟：

1. 複製應用程式內容至 Azure
2. 如果跟目錄沒有部署腳本 `.deployment`，則自動建立一個
3. 執行部署腳本

這裡的重點在步驟二，部署腳本。我們可以自訂一個部署腳本，透過他去執行指定動作，例如前端專案常用的 `npm install` 安裝相依套件。

#### Azure CLI

部署腳本可以手動建立（可參考文章底的備註），也可以使用 Azure CLI 來產生，這裡使用 CLI 來做。

先安裝 Azure CLI 工具，執行 `npm install azure-cli -g`。

在前端專案資料夾中執行 `azure site deploymentscript --node` 來建立給 node.js 專案用的部署腳本，如下兩個檔案：

* `.deployment` 內容為部署時要執行的命令
* `deploy.cmd` 內容為主要的部署腳本

>如果你是在 Mac 或 Linux 下執行此命令，則會產生 `deploy.sh`

如果你在執行此命令時出現下圖錯誤，是因為目前你所使用的 Azure CLI 模式為資源管理者，需要切換至組態管理者模式，切換指令為 `azure config mode asm`

![](http://i.imgur.com/P9RXz8U.png)

### 修改程式用於 Angular 的部署腳本

打開 `deploy.cmd` 並移到 `Deployment` 段落（如下圖），可以看到除了預設的部署動作外，在 `:: 3. Install npm packages` 這段增加了 node.js 專案常用的 `npm install --production` 指令。

![預設的 Deployment 段落](http://i.imgur.com/2xjybje.png)

接下來需要修改一下預設的程式碼。

預設的情況下，`npm install --production` 會忽略 `package.json` 中的 `devDependencies` 套件，因此我們必須使用 `npm install --only=dev` 這個指令，把沒安裝到的開發用套件補回去，這樣在下一步才能用 Angular CLI 的 `build` 指令。修改後的程式碼段落如下：

```bash
:: 3. Install npm packages
IF EXIST "%DEPLOYMENT_TARGET%\package.json" (
  pushd "%DEPLOYMENT_TARGET%"
  call :ExecuteCmd !NPM_CMD! install --production
  call :ExecuteCmd !NPM_CMD! install --only=dev
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)
```

做完上一步的安裝相依性套件後，必須執行 `ng build --prod` 透過 Angular CLI 來編譯專案，並輸出至 `dist` 資料夾，增加的程式碼段落如下：

```bash
:: 4. Angular production build
IF EXIST "%DEPLOYMENT_TARGET%\.angular-cli.json" (
  pushd "%DEPLOYMENT_TARGET%"
  call :ExecuteCmd ./node_modules/.bin/ng build --prod
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)
```

這樣 Angular 專案的部署腳本就完成了。

### 修改 Azure 起始虛擬應用程式和目錄

由於 Azure Web App 預設是使用 `site\wwwroot` 當作網站的根目錄，而 Angular CLI 編譯後的檔案是輸出到 `site\wwwroot\dist` 資料夾中，因此我們必須在 Web App 的**應用程式設定**中，修改他的**起始虛擬應用程式和目錄**，如下圖：  

![修改 Azure 起始虛擬應用程式和目錄](http://i.imgur.com/utok7P4.png)

完成後，就可以開啟該 Web App 囉～

![瀏覽器結果畫面](http://i.imgur.com/0gQXgaY.png)

## 備註

如果你不想安裝 Azure CLI 可以直接抓下面的程式碼去修改。

<script src="https://gist.github.com/poychang/04098db7b88deec9b9af3e5a947b9677.js"></script>

## 後記

部署到 Azure 後一定都很正常，直到在子頁面（例：`example.com/about`）中按下 `F5` 做重新整理的時候，網站就掛掉了，錯誤訊息如下：

`The resource you are looking for has been removed, had its name changed, or is temporarily unavailable.`

也就是網站找不到指定資源的錯誤。

這讓我想到保哥[有篇文章](http://blog.miniasp.com/post/2017/01/17/Angular-2-deploy-on-IIS.aspx)說過 Angular 的路由機制在 IIS 下會有狀況發生，其因大致上就是 Angular 的路由方式會被 IIS 當作是找靜態檔案，所以路由就失效了。

保哥的文章有三個解法，很值得看，而我這次是要部屬到 Azure 上，所以採用 URL Rewrite 自動網址重寫的方式來做。

首先在 `src` 資料夾下加入 `web.config` 檔案，並加入以下內容：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA" stopProcessing="true">
          <match url=".*" />
          <action type="Rewrite" url="/" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

然後修改 `.angular-cli.json` 中的 `assets` 值，大致如下：

```json
"assets": [
	"assets",
	"web.config",
	"favicon.ico"
]
```

目的是要把 `web.config` 當作靜態資源，保留在編譯後的 `dist` 資料夾中，然後跟著部署一起上 Azure，這樣就搞定了。

----------

參考資料：

* [Running Angular2 App on Azure App Services with CI and CD](https://prmadi.com/running-angular2-app-on-azure-app-services-with-ci-cd/)
* [Run NPM, Bower, Composer, Gulp & Grunt In Azure App Services During Deployment](https://prmadi.com/azure-custom-deployment/)
* [如何將 Angular 2 含有路由機制的 SPA 網頁應用程式部署到 IIS 網站伺服器](http://blog.miniasp.com/post/2017/01/17/Angular-2-deploy-on-IIS.aspx)