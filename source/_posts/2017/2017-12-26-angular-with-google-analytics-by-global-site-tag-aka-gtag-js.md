---
layout: post
title: 在 Angular 專案中加入 Google Analytics 網站追蹤程式碼
date: 2017-12-26 19:32
author: Poy Chang
comments: true
categories: [Typescript, Angular]
permalink: angular-with-google-analytics-by-global-site-tag-aka-gtag-js/
---
2017 年 8 月開始，Google Analytics 推出新的追蹤流量工具 Global Site Tag (gtag.js) 來接收網頁流量數據，此工具除了提供更強大的資料收集 API 外，還對 SPA (Single Page Application) 網站提出了更簡單使用的 API。這篇將示範如何在 Angular 專案中加入 Global Site Tag 網站追蹤程式碼。

>官方文件：[Add gtag.js to your site](https://developers.google.com/analytics/devguides/collection/gtagjs/)
 
## 取得追蹤碼

在您的 Google Analytics 帳戶管理介面中，可以從`資源` > `追蹤資訊` > `追蹤程式碼`中取得專屬的全域網站代碼，程式碼長得如下：

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'GA_TRACKING_ID');
</script>
```

>上述程式碼中的 `GA_TRACKING_ID` 請改成你專屬的追蹤編號。

## 安裝追蹤碼

這一步沒有難度，直接將取得的程式碼貼到 `index.html` 的 `head` 區段內。

這裡我希望做個改變，將 `GA_TRACKING_ID` 移至 `environment` 做管理，這樣做可以區分測試和正式環境，避免在開發測試時，你的測試流量也被傳送到 Google Analytics 中。

```html
<head>
  ...

  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    <!-- gtag('config', 'GA_TRACKING_ID'); 這行會被移除 -->
  </script>
</head>
```

## 設定 Angular 專案

先來處理 `environment.prod.ts`，加入 `GA_TRACKING_ID` 的設定。

```typescript
export const environment = {
  production: true,
  google: {
    GA_TRACKING_ID: 'UA-XXXXXXXX-X'
  }
};
```

接著修改 `app.module.ts`，主要處理 3 件事情：

1. 使用 `InjectionToken`的方式提供 `environment` 服務，方便專案之後的使用
2. 在外層宣告一個型別為 `Funtion` 的變數 `gtag`（後面再說明為甚麼）
3. 在 `AppModule` 的 `constructor` 中執行 `gtag('config', 'GA_TRACKING_ID');`，記得要把 `GA_TRACKING_ID` 改成 `environment` 中的設定值

```typescript
import {Inject, InjectionToken, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {environment} from './../environments/environment';

// 步驟 1
export const EnvironmentToken = new InjectionToken('ENVIRONMENT');

// 步驟 2
declare let gtag: Function;

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [{ provide: EnvironmentToken, useValue: environment }],
  entryComponents: [AppComponent]
})
export class AppModule {
  constructor(@Inject(EnvironmentToken) private env: any) {
    // 步驟 3
    gtag('config', this.env.google.GA_TRACKING_ID);
  }
}
```

步驟 2 的寫法是因為目前 Global Site Tag 所使用的 `gtag.js` 還有沒 Typescript 用的模組定義檔，所以再外層直接宣告一個 `gtag` 變數，作為暫時的替代方案，避免 Typescript 在編譯時期跟你抱怨他找不到 `gtag` 在哪裡。

## 追蹤 Pageview

完成上述的設定後，我們希望在每次路由變更的時候，能夠發送瀏覽數據給 GA，這裡我們可以從啟動的根元件 `AppComponent` 下手。

我們可以透過監聽路由的 `NavigationEnd` 事件，當成功完成路由變更時，觸發發送瀏覽數據的事件方法 `gtag('event', 'page_view', { 'page_path': x.url }); })`，並且將當前的網址路徑傳送過去。

```typescript
import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {distinctUntilChanged} from 'rxjs/operators';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(distinctUntilChanged((previous: any, current: any) => {
        if (current instanceof NavigationEnd) {
          return previous.url === current.url;
        }
        return true;
      }))
      .subscribe(
        (x: any) => { gtag('event', 'page_view', { 'page_path': x.url }); });
  }
}
```

>這邊使用 RxJS 的 `distinctUntilChanged` 操作符，`distinctUntilChanged` 跟 `distinct` 一樣會把相同的元素過濾掉，但 `distinctUntilChanged` 只會跟最後一次送出的元素比較，不會每個都比。因此 `distinctUntilChanged` 只會暫存一個元素，不像 `distinct` 會在背後產生一個暫存用的 Set，當用在一個無限的 observable 時，這個 Set 可能會撐爆你的記憶體。

順道一提，Pageview Event 有三個參數可以傳送：

<table class="table table-striped">
<thead>
  <tr>
    <th>參數名稱</th>
	<th>型別</th>
	<th>選用</th>
	<th>說明</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>page_title</td>
	<td>string</td>
	<td>No</td>
	<td>網頁標題</td>
  </tr>
  <tr>
    <td>page_location</td>
	<td>string</td>
	<td>No</td>
	<td>網頁 URL</td>
  </tr>
  <tr>
    <td>page_path</td>
	<td>string</td>
	<td>No</td>
	<td>以 / 開頭的網址路徑</td>
  </tr>
</tbody>
</table>

## 測試是否成功

追蹤碼及程式碼寫完後可以用 `ng serve` 來測試執行，可以透過以下兩種方式來檢查是否有正確執行：

1. 登入 Google Analytics 查看即時報表，當有使用者瀏覽該網站時，一分鐘內就會顯示資料
2. 安裝 Chrome 擴充套件 [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk?hl=zh-TW)，在打開網頁後，執行 Tag Assistant 檢查是否拿到正確的 tag 資訊

## 更多進階使用資訊

如果你想要使用更多 Global Site Tag 額外的追蹤需求，例如事件追蹤、時間追蹤、電子商務分析、流量來源追蹤等功能，請參考以下資訊：

* [事件追蹤](https://developers.google.com/analytics/devguides/collection/gtagjs/events)：客製化追蹤使用者在網頁中的行為，例如點擊特定區塊、播放影片等
* [時間追蹤](https://developers.google.com/analytics/devguides/collection/gtagjs/user-timings)：客製化追蹤時間相關資訊，例如影片播放時間、表單填寫時間
* [電子商務](https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce)：瞭解客戶在購買流程中的狀況，找出導購網頁的關鍵問題
* [流量來源](https://support.google.com/analytics/answer/1033867?hl=zh-Hant)：除了基本的流量來源追蹤外，可在連結網址中加入 utm 參數，客製化流量來源的紀錄項目

## SPA 解決方案 

SPA 網站會在首次載入網頁時，會將所需資源全部載入，並在使用者點擊網站鏈接與網站互動時，以動態的方式載入後續內容。傳統的流量分析工具，會因為始終沒有發出 HTTP Request 網頁載入請求，而無法追蹤、紀錄使用者行為，造成網頁互動數據的遺失。 

Global Site Tag 對 SPA 網站提供了虛擬網頁瀏覽的追蹤，根據[官方文件](https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications)，你可以透過下列方式，當網站動態載入內容並更新 URL 網址時，發送瀏覽數據及網址路徑至 Google Analytics 做紀錄。

```javascript
gtag('config', 'GA_TRACKING_ID', {'page_path': '/new-page.html'});
```

但其實，藉由上面的作法，我們也成功紀錄 Angular SPA 專案的使用者瀏覽變化。

----------

參考資料：

* [Add gtag.js to your site](https://developers.google.com/analytics/devguides/collection/gtagjs/)
* [Tracking Google Analytics Page Views in Angular2](https://stackoverflow.com/questions/37655898/tracking-google-analytics-page-views-in-angular2)
* [GA 追蹤碼安裝指南](https://training.pada-x.com/docs/article.jsp?key=google-analytics-tracking-code)
* [30 天精通 RxJS(15): Observable Operators - distinct, distinctUntilChanged](https://ithelp.ithome.com.tw/articles/10188194)

