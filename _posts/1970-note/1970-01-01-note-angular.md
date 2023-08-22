---
layout: post
title: Angular 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Angular]
---

本篇作為書籤用途，記錄網路上的 Angular 參考資料

- Angular.io Search URL `https://angular.io/api?query={q}` 其中 `{q}` 可替換成要搜尋的文字

## 發布 Angular 至 IIS 應用程式中

- [Tips for Running an Angular app in IIS](https://blogs.msdn.microsoft.com/premier_developer/2017/06/14/tips-for-running-an-angular-app-in-iis/)
- IIS URL Rewrite [下載位置](https://www.iis.net/downloads/microsoft/url-rewrite)

## 在 Angular 中使用 Wallaby.js 單元測試

- [如何在 Visual Studio Code 執行 Wallaby 單元測試?](https://old-oomusou.goodjack.tw/vscode/wallaby/)
- [範例專案 - wallabyjs/ngCliWebpackSample](https://github.com/wallabyjs/ngCliWebpackSample#wallabyjs)
- 快速四步驟 1. 專案根目錄加入 [wallaby.js](https://github.com/wallabyjs/ngCliWebpackSample/blob/master/wallaby.js) 設定檔 2. 加入啟動測試程式碼 [wallabyTest.ts](https://github.com/wallabyjs/ngCliWebpackSample/blob/master/src/wallabyTest.ts) 至 `src\wallabyTest.ts` 3. 在 `tsconfig.json` 中設定排除 `src/wallabyTest.ts` 避免影響 Angular AOT 編譯 4. 執行 `npm install wallaby-webpack angular2-template-loader electron --save-dev`
- Wakkaby 覆蓋指標
  _ <span style="background-color: #CCCCCC"> □ 灰色</span> 表示該段程式碼不包含在任何測試中
  _ <span style="background-color: #5FB550"> □ 綠色</span> 表示該段程式碼至少被一個測試給所覆蓋
  _ <span style="background-color: #D3A121"> □ 黃色</span> 表示該段程式碼僅部分被某些測試所覆蓋
  _ <span style="background-color: #FF5167"> □ 紅色</span> 表示該段程式碼是錯誤或與期望不符 \* <span style="background-color: #F39796"> □ 粉紅色</span> 表示該段程式碼在失敗測試的執行路徑上

## 小技巧

### 常用的建專案指令

- `ng new PORJECT_NAME -sg -si -st --routing` 建立不含 git、不 npm install、不含測試，但有路由模組的專案
- `ng new PORJECT_NAME --minimal` 建立極簡版專案，不產生 spec 檔案，component template 或是 style 都是 inline 模式

### 使用 Proxy 呼叫 API

1. 在專案根目錄下新增一個 `proxy.config.json` 設定檔，設定檔內容如下：

   ```josn
   {
     "/api": {
       "target": "http://your.apiwebsite",
       "secure": false
     }
   }
   ```

   請注意：

   - 這裡的 target 是目標 API 的網址，不能加上路徑部分
   - 這裡的 `/api` 是我們要鏡像的網址 Prefix，所有連到 `http://localhost:4200/api/aaa` 網址，都會自動轉發到 `http://your.apiwebsite/api/aaa`，以此類推！

2. 接著開啟 `package.json` 修改 "script" 區段中的 "start" 命令，加上 `--proxy-config proxy.config.json` 參數，如下內容：
   ```json
   "scripts": {
     "ng": "ng",
     "start": "ng serve --proxy-config proxy.config.json",
     "build": "ng build",
     "build-prod": "ng build --prod --base-href /BasePath/",
   },
   ```

### 任意屬性

```typescript
export interface ModelName {
  errors: { [key: string]: string };
  [propName: string]: any;
}
```

- `errors: {[key: string]: string};` 定義了 errors 這個屬性下可以有任意屬性為 string 類型的值
- `[propName: string]: any;` 定義了任意屬性為 string 類型的值，定義後該 Class 或 Interface 的屬性必須為該任意屬性的子屬性，以此例來說只能為 string 屬性

### 解決 import 路徑過長的問題

Angular 程式寫到後面，會發現那個 import 的路徑越來越長，一路點點點下去也不是辦法，[官網文件](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)有提供很好的解法，在 `tsconfig.json` 的 `compilerOptions` 內，可以使用 `"PATH_ALIAS": ["PATH"]` 的方式來設定路徑別名，範例如下：

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@app/*": ["app/*"]
    }
  }
}
```

注意！如果是用 Angular CLI 產生的專案，在 `src` 資料夾底下會有 `tsconfig.app.json` 和 `tsconfig.spec.json` 兩個設定檔，會以 `tsconfig.json` 為基底將設定覆蓋掉，所以要再確認相關設定是否符合需求。

設定完成後，只要使用 `@app` 就會指到應用程式的根目錄

```typescript
// 原本的 import 是長這樣
import * as env from './../../environments/environment';

// 設定後的寫法
import * as env from '@app/environments/environment';
```

你也可以把 `@app` 設定成其他常用的路徑，讓 import 的畫面變乾淨。

## Angular 4 網站開發最佳實務 (Modern Web 2017)

SlideShare：[Angular 4 網站開發最佳實務 (Modern Web 2017)](https://www.slideshare.net/WillHuangTW/angular-4-best-practics)

- 更新 Angular CLI 工具套件的步驟
  _ 更新全域 npm
  _ `npm install -g @angular/cli`
  _ 更新專案 npm
  _ `npm install @angular/cli --save-dev`
  _ `rimraf node_modules package-lock.json`
  _ `npm install`
- 網站伺服器都會壓縮靜態檔案（gzip/deflate），因此實際下載大小會比看見的小很多
- 使用 TrackBy 避免不必要的 DOM 操作

## 使用 Angular 開發 TodoMVC 應用程式完整實作教學

youtube：[使用 Angular 開發 TodoMVC 應用程式完整實作教學](https://www.youtube.com/watch?v=aMeF8ksXv7o&t=271s)

## Microsoft 線上課程

來自 Microsoft Virtual Academy 的線上課程，透過 Eric Greene 帶來 10 小時的系列課程，由淺入深的探索 Angular 開發技巧。

Mastering Angular 課程目錄([點此搜尋更多](https://mva.microsoft.com/search/SearchResults.aspx#!q=Mastering%20Angular&lang=1033))

1. [Components](https://mva.microsoft.com/en-US/training-courses/mastering-angular-part-1-components-17709)
2. [Pipes](https://mva.microsoft.com/en-US/training-courses/mastering-angular-part-2-pipes-17710)
3. [Services](https://mva.microsoft.com/en-US/training-courses/mastering-angular-part-3-services-17711)
4. [Reactive Forms](https://mva.microsoft.com/en-US/training-courses/mastering-angular-part-4-reactive-forms-17728)
5. [Template Forms](https://mva.microsoft.com/en-US/training-courses/mastering-angular-part-5-template-forms-17731)
6. [Form Validation](https://mva.microsoft.com/en-US/training-courses/mastering-angular-part-6-form-validation-17734)
7. [Custom Form Validation](https://mva.microsoft.com/en-US/training-courses/mastering-angular-part-7-custom-form-validation-17736)
8. [Displaying Form Validation Information](https://mva.microsoft.com/en-US/training-courses/mastering-angular-part-8-displaying-form-validation-information-17741)

## TypeScript

### 學習資源

- [TypeScript 和字段初始化器](https://gxnotes.com/article/137971.html)
- [TypeScript 入门教程](https://ts.xcatliu.com/basics/type-of-object-interfaces.html)

## TypeScript - tsconfig.json 設定

[TypeScript 2.3: The --strict Compiler Option](https://blog.mariusschulz.com/2017/06/09/typescript-2-3-the-strict-compiler-option)

- 建議一開始開發就開啟 `strict mode`，讓開發過程充分享受強型別的好處 \* 如果到後期才開了話，通常報錯會報到你再把它關掉...

## 在 VS Code 中對 Angular CLI 專案進行偵錯

這份 VSCode 食譜，展示如何在 VS Code 裡面使用 Debugger for Chrome 擴充套件，來對 Angular CLI 建立的專案進行偵錯！

[Chrome Debugging with Angular CLI](https://github.com/Microsoft/vscode-recipes/tree/master/Angular-CLI)

## 測試

object 驗證，有東西不想驗，用這個方法跳過：[jasmine.objectContaining](https://jasmine.github.io/2.0/introduction.html#section-Partial_Matching_with_<code>jasmine.objectContaining</code>)

## primeng

- 載入 primeng 的 SharedModule 時，會和自己的 SharedModule 衝突，建議使用下面的方式載入： \* [參考資料](https://github.com/primefaces/primeng/issues/2508)

```
import SharedModule as PrimeSharedModule from "primeng/common/shared";
```

---

參考資料：

- [Angular FAQ](https://github.com/semlinker/angular-faq)
