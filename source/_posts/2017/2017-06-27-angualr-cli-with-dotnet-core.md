---
layout: post
title: Angular CLI 和 ASP.NET Core Web API 專案整合步驟 1 2 3
date: 2017-06-27 23:12
author: Poy Chang
comments: true
categories: [Angular, WebAPI, Develop, Tools]
permalink: angualr-cli-with-dotnet-core/
---

Angular CLI 開發工具真的是很優秀，將前端開發所需要的工作、流程都包裝好了，學會之後，前端開發流程就甘之如飴了。前端搞定了，別忘了還有後端，我偏好使用 ASP.NET Core Web API 作為開發後端專案的框架，然後前後端都有自己的專案架構，這兩者要如何整合呢？

在整合 Angular 專案與 ASP.NET Core 專案前，請確認你的環境有安裝下列工具：

- [.NET Core](https://www.microsoft.com/net/core#windowsvs2017)
- [Node.js](https://nodejs.org/)
- [Angular CLI](https://github.com/angular/angular-cli)

## 步驟一：ASP.NET Core WebAPI 專案

我使用 Visual Studio 2017 來建立 ASP.NET Core Web 應用程式，並命名為 `DemoAngularDotnet`。

![建立 ASP.NET Core Web 應用程式 DemoAngularDotnet](http://i.imgur.com/qgWYvvK.png)

我們打算前端的程式都交給 Angular 去實作，因此新增時選擇 Web API 專案範本，執行這個範本時，不會產生任何前端頁面的程式碼，這樣讓我們更輕鬆和 Angular 做整合。

![使用 Web API 專案範本](http://i.imgur.com/ba4iImD.png)

身為地表上最強的 IDE，Visual Studio，當然內建自動幫你編譯 TypeScript 成 JavaScript 的功能，但我們希望這件事交由 Angular CLI 來幫我處理，因此需要修改專案檔的設定。

在專案檔上按右鍵選擇`編輯 DemoAngularDotnet.csproj` 修改專案檔設定。

![編輯 DemoAngularDotnet.csproj](http://i.imgur.com/06rUobQ.png)

在 `PropertyGroup` 區段中加入 `<TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>` 設定不要自動編譯 TypeScript 檔。

![不要自動編譯 TypeScript 檔](http://i.imgur.com/Zxm4Fiv.png)

>上圖有誤，請使用 `<TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>` 設定不要自動編譯 TypeScript 檔。

Angular CLI 會幫我們編譯出靜態的前端網頁程式碼，因此在專案中，我們需要加入存取靜態檔案（如 html、js、css...等）的 middleware，讓應用程式能夠回應給客戶端靜態檔案的資料。

首先先用 NuGet 安裝 `Microsoft.AspNetCore.StaticFiles` 套件。

![安裝 Microsoft.AspNetCore.StaticFiles 套件](http://i.imgur.com/QPyRxeU.png)

接著修改 `Startup.cs` 中的 `Configure()` 方法，加入 `app.UseDefaultFiles()` 和 `app.UseStaticFiles()` 方法。

![加入 app.UseDefaultFiles() 和 app.UseStaticFiles()](http://i.imgur.com/A2845ve.png)

**接著重點來了！**

現在我們的 Web API 專案具有提供 API 以及提供靜態檔案的服務了，再來我們需要判斷連進來的 Request 是 API 還是網頁的需求，如果是要存取網頁，則需要把 Request 轉向到 Angular 專案的進入點 `index.html`，因此需要再修改 `Startup.cs` 中的 `Configure()` 方法，建立一層 Middleware 來處理這件事

![判斷 Request 的目的](http://i.imgur.com/KRedJvP.png)

> 建議可以將此 Middleware 抽離成一個[檔案](https://gist.github.com/poychang/c98f5b35e11f56ad22ff6de6ab09974d)做管理。

最後，Web API 的專案範本預設一啟動會開啟 `api/values` 這個路徑，為了避免這預設動作，可以修改 `properties` 下的 `launchSettings.json` 檔案，將其中的 `launchUrl` 修改成空值。

![properties 中的 launchSettings.json 檔案](http://i.imgur.com/Y4T80Hj.png)

![將 launchUrl 修改成空值](http://i.imgur.com/TSHQNjU.png)

## 步驟二：建立 Angular CLI 專案

我們將使用 Angular CLI 在 ASP.NET Core 專案中建立 Angular 專案。

這裡有個動作要**注意**，執行 `ng new MY_APP_NAME` 指令，會在該路徑下建立 `MY_APP_NAME` 資料夾，請確認執行該指令的位置。

我們最後希望前、後端的程式碼能整合在一起，因此在 ASP.NET Core 方案檔（`DemoAngularDotnet.sln`）的同一層來執行此指令。

> 這裡我使用這個指令來產生 Angular 專案 `ng new DemoAngularDotnet -sg -si -st --routing`，後面的參數分別會，不建立 git 版控、不執行 `npm install`、不產生測試檔、建立路由模組

![建立 Angular 專案](http://i.imgur.com/d8ro5Jh.png)

產生後的專案資料夾結構如下：

![專案資料夾結構](http://i.imgur.com/a7dNVn2.png)

到這個階段已經將兩個專案放在一起，但彼此還無法結合、互通，下一步驟就要整合兩者，讓彼此融為一體。

## 步驟三：整合前、後端專案

Angular 專案裡有兩個資料夾需要調整：

1. 預設的 `src` 程式碼開發根目錄，為了識別為前端程式碼，建議更名為 `client-src`
2. 預設的 `dist` 編譯後的輸出資料夾，為了提供給 ASP.NET Core 專案使用，調整成 `wwwroot` 作為前端靜態網頁程式碼的存放位置

> 如果是全新專案，在還沒有執行 `ng build` 前，是不會有 `dist` 資料夾的

完成上述調整後，需要修改 `angular-cli.json` 設定檔，告訴 Angular 專案相對應的變更：

1. 將 `root` 的值，修改為 `client-src`
2. 將 `outDir` 的值，修改為 `wwwroot`

![告訴 Angular 專案開發根目錄及輸出資料夾之相對應的變更](http://i.imgur.com/wt9zMuR.png)

如此一來，Angular 專案就會將編譯後的程式碼作為靜態網頁作呈現，我們的前後端整合也就完成了。

## 開發流程

因為是整合兩個開發專案，各自有各自的開發工具和編譯需求，因此在開發流程上，需要做一些小調整。

首先，如果你使用 git 做版控了話，你不會想把每次前端編譯後的檔案加到版控系統中，所以可以修改 `.gitignore` 檔案，將 `wwwroot` 排除在版控外，這和我們會排除 `dist` 的原因是一樣的。

> 雖然產生 Angular 專案時沒有使用 git，但建議手動加入 Angular CLI 所產生的 `.gitignore` 檔，避免將開發前端所產生的檔案，如 `node_modules`，被加到版控中。
> 而上面提到要排除 `wwwroot` 資料夾的設定，我也會寫在前端的 `.gitignore` 中。

![版控排除 wwwroot 資料夾](http://i.imgur.com/bSU5ISA.png)

再來，開發上我們會將 ASP.NET Core 視為主要專案，Angular 則是負責前端開發、編譯的輔助專案，所以我們在編譯專案上，必須先編譯 Angular，產生前端程式碼至 `wwwroot` 中，接著再編譯 ASP.NET Core 專案，讓網站運行完整。

所以編譯時會需要兩個步驟：

1. 使用 Angular CLI 執行 `ng build`
2. 執行 Visual Studio 中的`啟動但不偵錯`來運行專案

如果你的開發團隊是前後端分開，那後端在開發時只要執行一次 `ng build` 就可以安心的繼續處理後端程式碼。

但如果你是全端開發者，那這樣的編譯流程總覺得繁瑣（對！兩個動作就是繁瑣 XD），這時你可以在 Visual Studio 中開啟該專案的屬性，其中會有個`建置事件`的分頁，可以在裡面的`建置前事件命令列`輸入 `ng build`，告訴 Visual Studio 在執行建置前先執行該指令，這樣就會自動呼叫 Angular CLI 來編譯前端專案了。

![建置前事件命令](http://i.imgur.com/thFCcss.png)

> 但這裡要注意，透過`建置前事件命令列`來編譯前端專案，會拉長建置時間，有時候反而浪費時間，所以我覺得竟然都拆前後端專案了，那就訓練自己**關注點分離**，開發前端時專心寫前端，建置後端時專心做後端。

## 程式碼

關於本篇文章完整的程式碼發布於 GitHub：[poychang/DemoAngularDotnet](https://github.com/poychang/DemoAngularDotnet)。

希望這篇整合 Angular CLI 和 ASP.NET Core Web API 專案的說明能幫到你，如果有介紹不清楚的地方，歡迎留言討論：)

## 後記

- 2017/10/01 \* 在「步驟二：建立 Angular CLI 專案」時，可以考慮把整個 Angular 專案收在一個 `ClientApp` 資料夾裡，讓整個專案資料夾結構更清爽些。步驟三的 `angular-cli.json` 設定檔也要有對應的路徑修改。
- 2017/10/04 \* Visual Studio 會在啟動時遍尋專案資料夾內的所有目錄，因此如果使用 Visual Studio 開啟有 `node_modules` 資料夾的專案時，有時候會造成啟動很慢，或是有 build 很久的狀況，這時可手動在 `.csproj` 內設定排除 `node_modules` 資料夾，這樣才能讓 dotnet run 或 dotnet build 速度正常，設定方法如下：
  `xml <PropertyGroup> <DefaultItemExcludes>YOUR_PATH\node_modules\**;$(DefaultItemExcludes)</DefaultItemExcludes> </PropertyGroup>` \* 深入調查後發現這狀況是個 bug，[目前已修正](https://github.com/aspnet/websdk/commit/771888b40c9947b86af443238ca9427a10bf23a5#diff-81c6e234d77bce12b4c645c597b860cb)，會在下一版中更新。

---

參考資料：

- [Angular CLI With .NET Core](https://dustinewers.com/angular-cli-with-net-core/)
- [Multiple solutions for Angular Ahead of Time (AOT) Compilation](https://blog.craftlab.hu/multiple-solutions-for-angular-ahead-of-time-aot-compilation-c474d9a0d508)
- [Visual Studio 2017 csproj core file exclusion](https://stackoverflow.com/questions/42803170/visual-studio-2017-csproj-core-file-exclusion)
- [Performance impact by searching excluded directories](https://github.com/dotnet/cli/issues/7525)
