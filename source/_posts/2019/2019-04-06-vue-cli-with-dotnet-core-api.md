---
layout: post
title: Vue CLI 和 ASP.NET Core Web API 專案整合步驟 1 2 3
date: 2019-04-06 20:10
author: Poy Chang
comments: true
categories: [Javascript, CSharp, Dotnet, WebAPI, Develop]
permalink: vue-cli-with-dotnet-core-api/
---

Vue CLI 開發工具幫助 Vue 開發人員快速建立前端專案，但網站除了前端之外，後端的 API 支援也是專案中相當重要的一部分，然而前後端都有自己的專案架構，要如何將兩者整合在一個專案，其實很簡單的。這裡使用 ASP.NET Core Web API 作為後端專案的框架，然後搭配 Vue CLI 來產生前端專案架構，再做一點點調整，讓前後端除了保有自己的專案架構，還讓兩者能融洽的存在同一個專案中。

在整合 Vue 專案與 ASP.NET Core 專案前，請確認你的環境有安裝下列工具：

- .NET Core
- Node.js
- Vue CLI

## 步驟一：ASP.NET Core WebAPI 專案

首先就開啟地表最強的 Visual Studio 2019 來建立 ASP.NET Core Web 應用程式，並將專案命名為 `DemoVueDotnet`。

![建立 ASP.NET Core Web 應用程式 DemoVueDotnet](https://i.imgur.com/2udr4My.png)

![將專案命名為 DemoVueDotnet](https://i.imgur.com/ndLK1PG.png)

我們打算前端的程式都交給 Vue 去實作，因此新增時選擇 Web API 專案範本，執行這個範本時，不會產生任何前端頁面的程式碼，這樣讓我們更輕鬆和 Vue 做整合。

![使用 API 專案範本](https://i.imgur.com/azPyHob.png)

如果之後你的 Vue 專案有選用 TypeScript 作為開發語言，那地表上最強的 IDE，Visual Studio，內建了自動幫你編譯 TypeScript 成 JavaScript 的功能，但我們希望這件事交由 Vue CLI 來幫我們處理，因此需要修改專案檔的設定。

在專案檔上按右鍵選擇`編輯 DemoVueDotnet.csproj` 修改專案檔設定，在 Visual Studio 2019 也可以直接用滑鼠點擊專案黨兩下來開啟。

![編輯 DemoVueDotnet.csproj](https://i.imgur.com/7ACBAUO.png)

在 `PropertyGroup` 區段中加入 `<TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>` 設定不要自動編譯 TypeScript 檔。

![不要自動編譯 TypeScript 檔](https://i.imgur.com/MdH7p2V.png)

> 如果你之後所建立的 Vue CLI 專案沒有用 TypeScript 了話，這個步驟可以跳過。

Vue CLI 會幫我們編譯出靜態的前端網頁程式碼，因此在專案中，我們需要加入存取靜態檔案（如 html、js、css...等）的 middleware，讓應用程式能夠回應給客戶端靜態檔案的資料。

首先先用 NuGet 安裝 `Microsoft.AspNetCore.StaticFiles` 套件。

![安裝 Microsoft.AspNetCore.StaticFiles 套件](https://i.imgur.com/EigOtEe.png)

> 請注意套件的版本，若專案是使用 ASP.NET Core 2.1 請安裝 2.1.x 版本的 Microsoft.AspNetCore.StaticFiles 套件，否則會有相容性的錯誤訊息。

接著修改 `Startup.cs` 中的 `Configure()` 方法，加入 `app.UseDefaultFiles()` 和 `app.UseStaticFiles()` 方法，分別代表讓此 Web API 專案能使用預設的檔案作為進入點，並使其能使用靜態檔案作為網頁的資源。

![加入 app.UseDefaultFiles() 和 app.UseStaticFiles()](https://i.imgur.com/fyzzYdw.png)

**接著重點來了！**

現在我們的 Web API 專案具有提供 API 以及提供靜態檔案的服務了，再來我們需要判斷連進來的 Request 是 API 還是網頁的需求，如果是要存取網頁，則需要把 Request 轉向到 Vue 專案的進入點 `index.html`，因此需要再修改 `Startup.cs` 中的 `Configure()` 方法，建立一層 Middleware 來處理這件事。

![判斷 Request 的目的地](https://i.imgur.com/i4aQNFp.png)

> 建議可以將此 Middleware 抽離成一個檔案做管理，相關作法及用法請參考此 [gist](https://gist.github.com/poychang/c98f5b35e11f56ad22ff6de6ab09974d)。

最後，Web API 的專案範本預設一啟動會開啟 `api/values` 這個路徑，為了避免這預設動作，可以修改 `properties` 下的 `launchSettings.json` 檔案，將其中的 `launchUrl` 修改成空值。

![properties 中的 launchSettings.json 檔案](https://i.imgur.com/OmIKCvy.pngz)

![將 launchUrl 修改成空值](https://i.imgur.com/g6dQ2v9.png)

## 步驟二：建立 Vue CLI 專案

我們將使用 Vue CLI 在 ASP.NET Core 專案中建立 Vue 專案。

這裡有個動作要**注意**，執行 `vue create my-app-name` 指令時，是會在該路徑下建立 `my-app-name` 資料夾，且你的 Vue 專案名稱也會是 `my-app-name`，但這裡我希望整個 Vue 專案是放在 `ClientApp` 資料夾中，而專案名稱依照指令所給的，請參考下列步驟：

1. 手動建立 `ClientApp` 資料夾，並執行 `cd ClientApp` 進入該資料夾中
2. 執行 `vue create my-app-name` 來建立 Vue CLI 專案
3. 將 `ClientApp\my-app-name` 資料夾下的 `.git` 資料夾刪除，但請保留 `.gitignore` 檔
4. 再將 `ClientApp\my-app-name` 資料夾下的所有檔案搬到上一層
5. 刪除 `my-app-name` 資料夾

產生後的專案資料夾結構如下：

![專案資料夾結構](https://i.imgur.com/AKim6fS.png)

到這個階段已經將兩個專案放在一起，但彼此還無法結合、互通，下一步驟就要整合兩者，讓彼此融為一體。

## 步驟三：整合前、後端專案

Vue 專案預設會將編譯後的檔案輸出到 `dist` 資料夾中，但以目前的專案架構，我們希望他能放在上一層的 `wwwroot` 資料夾，提供給 ASP.NET Core 專案使用，因此我們需要一個 `vue.config.js` Vue CLI 專案的設定檔。

> 預設 Vue CLI 專案是沒有 `vue.config.js` 這個檔案，必須手動新增，詳細選項請[參考這裡](https://cli.vuejs.org/zh/config/)。

新增 `vue.config.js` 檔案後，請參考下列程式碼進行設定：

```javascript
module.exports = {
  outputDir: '../wwwroot'
};
```

透過此 `outputDir` 設定，可將 Vue CLI 建置時所產生的檔案，指定要存儲到哪個路徑下。

如此一來，Vue CLI 專案就會將編譯後的程式碼存放在 `wwwroot` 中，作為 ASP.NET Core 的靜態網頁呈現，我們的前後端整合也就完成了。

## 開發流程

因為是整合兩個開發專案，各自有各自的開發工具和編譯需求，因此在開發流程上，需要做一些小調整。

首先，如果你使用 git 做版控了話，且不想把每次前端編譯後的檔案加到版控系統中，可以修改 `.gitignore` 檔案，將 `wwwroot` 排除在版控外，這和我們會排除 `dist` 的原因是一樣的。

> 產生 Vue CLI 專案時，若沒有使用 `--no-git` 參數，會一起產生的 `.gitignore` 檔，建議保留此檔案，避免將開發前端所產生的檔案，如 `node_modules`，被加到版控中。

![版控排除 wwwroot 資料夾](https://i.imgur.com/aI3MlBY.png)

> 如果你的專案中沒有 `.gitignore` 檔，可以從這裡 [github/gitignore](https://github.com/github/gitignore) 取得適合你專案的，或點[這裡](https://github.com/github/gitignore/blob/master/VisualStudio.gitignore)取得適用於 Visual Studio 的 `.gitignore` 檔。

再來，開發上我們會將 ASP.NET Core 視為主要專案，Vue 則是負責前端開發、編譯的輔助專案，所以我們在編譯專案上，必須先編譯 Vue，產生前端程式碼至 `wwwroot` 中，接著再編譯 ASP.NET Core 專案，讓網站運行完整。

所以編譯時會需要兩個步驟：

1. 執行 `npm run build`
2. 執行 Visual Studio 中的`啟動但不偵錯`來運行專案

如果你的開發團隊是前後端分開，那後端在開發時只要執行一次 `npm run build` 就可以安心的繼續處理後端程式碼，又或者有把 `wwwroot` 提交到版控中，後端開發人員也可以省道這個步驟。

> 除非你是一個人同時在修改前後端，才會需要這樣的編譯步驟，但我們都前後端分離了，職責也分離了，所以在修改前端時，不應也在修改後端程式碼，應該讓開發過程中，只專注在一個面向的開發。

如果你是全端開發者，那這樣的編譯流程總覺得繁瑣（對！兩個動作就是繁瑣 XD），這時你可以在 Visual Studio 中開啟該專案的屬性，其中會有個`建置事件`的分頁，可以在裡面的`建置前事件命令列`輸入 `cd ClientApp` 及 `npm run build`，告訴 Visual Studio 在執行建置前先至 Vue CLI 專案資料夾中執行編譯前端的指令，再接續編譯 ASP.NET Core Web 專案。

![建置前事件命令](https://i.imgur.com/U61DGHt.png)

> 但這裡要注意，透過`建置前事件命令列`來編譯前端專案，會拉長建置時間，有時候反而浪費時間，所以我覺得竟然都拆前後端專案了，那就訓練自己**關注點分離**，開發前端時專心寫前端，建置後端時專心做後端。

## 程式碼

關於本篇文章完整的程式碼發布於 GitHub：[poychang/Demo-Vue-Dotnet](https://github.com/poychang/Demo-Vue-Dotnet)。

希望這篇整合 Vue CLI 和 ASP.NET Core Web API 專案的說明能幫到你，如果有介紹不清楚的地方，歡迎留言討論：)

---

參考資料：

- [Vue 專案之全局 CLI 配置](https://cli.vuejs.org/zh/config/)
