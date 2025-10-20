---
layout: post
title: Angular 整合第三方套件，以 Swiper 為例
date: 2017-08-12 18:23
author: Poy Chang
comments: true
categories: [Typescript, Angular]
permalink: integrate-swiper-into-angular/
---
[Swiper](http://idangero.us/swiper/) 是一款很不錯的開放原始碼套件，可輕鬆製作出支援觸碰的輪播功能，相關的範例與 API 都非常完整，這篇就用它來跑一次 Angular 整合第三方套件的作法。

## 建立專案

首先使用 Angular CLI 建立專案，在命令提示字元下執行：

```bash
ng new demo-angular-swiper
```

## 安裝第三方套件 Swiper

使用 npm 安裝這次要使用的第三方套件 Swiper，安裝指令如下：

```bash
npm install swiper --save
```

這會將套件安裝至專案資料夾的 `node_modules` 中，接著修改 `.angular-cli.json` 設定檔，將 Swiper 套件中主要的函式庫 `swiper.min.css` 和 `swiper.min.js` 加入 `styles` 和 `scripts` 中，使 Webpack 在封裝時將該套件的程式碼也一起包進去。

![setting angular-cli.json](http://i.imgur.com/Pcjel1Y.png)

## 安裝模組定義檔

為了在 Typescript 中使用第三方 Javascript 函示庫，可以在 [TypeSearch](https://microsoft.github.io/TypeSearch/) 網站中查找看看有沒有對應的模組定義檔，透過模組定義檔，除了幫助 Typescript 編譯外，我們還可以透過 IntelliSense 快速地查該模組的找方法、屬性，讓寫程式更有效率。

![TypeSearch website](http://i.imgur.com/SE9eMSH.png)

從 TypeSearch 網站中我們可以找到 Swiper 模組定義檔，在專案資料夾中執行下列指令，加入 Swiper 的模組定義檔

```bash
npm install @types/swiper --save
```

## 設定專案使用模組定義檔

Typescript 會根據 `tsconfig.json` 的設定進行編譯，從專案中的 `tsconfig.json` 檔可以發現，Angular CLI 產生的專案預設會使用 `node_modules/@types` 這個路徑作為模組定義檔的根目錄。在安裝完需要的模組定義檔後，Typescript 會自己去這個目錄裡面找模組定義檔。

![tsconfig.json](http://i.imgur.com/OH7IQKK.png)

另外 Angular CLI 所產生的專案，在 `src` 資料夾下還有兩個繼承 `tsconfig.json` 的設定檔

1. `tsconfig.app.json` 是給開發專案用的
2. `tsconfig.spec.json` 是給測試用的

[Typescrit 文件](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types)有說，如果設定檔中有 `types` 屬性，則只會載入有列在裡面的模組設定檔，反之將不會載入。

>If *types* is specified, only packages listed will be included.

![add Swiper into tsconfig.app.json](http://i.imgur.com/xp0dawP.png)

因此必須在這裡**明確指定**要載入 Swiper 模組設定檔，Typescript 才會正確編譯。

>請注意，在 Angular 專案執行 `ng serve` 時，如果有修改 `.angular-cli.json`、`tsconfig.json` 等設定檔，需要重新編譯才能正確執行。 

## 使用 Swiper 建立輪播功能

經過上面幾個步驟的安裝及設定，我們就可以開始使用 Swiper 函式庫，完整的程式碼可以參考這裡 [poychang/demo-angular-swiper](https://github.com/poychang/demo-angular-swiper)。

建立簡易 Swiper 輪播功能的程式碼可以參考[這個 Commit](https://github.com/poychang/demo-angular-swiper/commit/57cd093270b0ecb207042120fe97db7f02bcfc83)，這段裡面有透過 `*ngFor` 來產生輪播圖，因此 Swiper 要等樣板內容產生完畢才能接續執行，所以我將 Swiper 初始化移至 `ngAfterViewInit` 這個階段執行，詳細可參考 [Angular 執行生命週期](https://angular.io/guide/lifecycle-hooks)，簡單說就是會在該元件完成樣板畫面初始化之後執行。

<iframe src="https://stackblitz.com/edit/angular-with-swiper?embed=1&file=main.ts&view=preview" height="400" width="100%" frameborder="0"></iframe>

## 後記

[StackBlitz](https://stackblitz.com/) 這個線上工具很方便，可以直接在網站上寫 Angular 程式，拿來寫些簡單案例相當好用，這篇的程式碼也可以參考[這裡](https://stackblitz.com/edit/angular-with-swiper)。

----------

參考資料：

* [Typescript @types, typeRoots and types](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types)
* [Angular 與 jQuery 共舞：整闔第三方套件的技巧、陷阱與解決方案](https://www.facebook.com/will.fans/videos/1718120871550383/)