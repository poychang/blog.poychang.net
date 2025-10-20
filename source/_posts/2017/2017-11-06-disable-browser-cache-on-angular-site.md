---
layout: post
title: 在 Angular 網站中取消瀏覽器快取功能
date: 2017-11-06 10:01
author: Poy Chang
comments: true
categories: [Angular]
permalink: disable-browser-cache-on-angular-site/
---
預設的情況下，瀏覽器會將網站的資料作快取，幫助下次瀏覽時能更快速的呈現內容，不過有時候我們不想要這樣的功能時，例如安全性議題，該怎麼應對呢？這樣提供兩種方式，修改 Html 的 Meta 設定，或是從 Angular 程式碼中下手。

## 修改 Html Meta 的方法

在 HTTP 1.1 規格中，有 [Cache-Control](https://tools.ietf.org/html/rfc2616#section-14.9) 可以設定 Client 端的快取設定。

在 HTTP 1.0 規格中，有 [Pragma](https://tools.ietf.org/html/rfc1945#section-10.12) 可以設定 Client 端的快取設定。

而兩個規格中都有 Expires（[1.1](https://tools.ietf.org/html/rfc2616#section-14.21)、[1.0](https://tools.ietf.org/html/rfc1945#section-10.7)）快取內容的有效期限設定，但在 1.1 的規格中，Cache-Control 的優先權是大於 Expires 的。

藉此我們可以規劃出通用的設定：

``` 
<meta http-equiv="Cache-Control" content="no-cache, no-store, max-age=0, must-revalidate">
<meta http-equiv="pragma" content="no-cache" />
<meta http-equiv="expires" content="0" />
```

將上述程式碼加到 index.html 的 head 段落，就可以關閉該網頁的快取功能。

## 修改 Angular 程式碼的方法

如果我們只想針對特定的 Angular 元件做控制呢？可以透過 URL 參數這個小手段達成。

```
@Component({
  selector: 'some-component',
  templateUrl: `./app/some-component.html?v=${new Date().getTime()}`,
  styleUrls: [`./app/some-component.css?v=${new Date().getTime()}`]
})
```

在 Component 的設定中，Html 和 CSS 的路徑上加上 URL 參數，使之每次取得的路徑是不同的，上面的執行結果會變成這樣 `/app/some-component.html?v=1509933322801`，而讓瀏覽器不會從快取中取資料，而是重新要一份，藉此讓該 Component 達到不使用快取的目的。

`v=${new Date().getTime()` 這段我們還可以有些變化，例如控制成每天更新一次，可以改成這樣 `new Date().toISOString().substr(0,13)`，這樣執行結果就會變成 `/app/some-component.html?v=2017-11-06T00`。

----------

參考資料：

* [How to prevent Browser cache on Angular 2 site?](https://stackoverflow.com/questions/39647810/how-to-prevent-browser-cache-on-angular-2-site)
* [How to control web page caching, across all browsers?](https://stackoverflow.com/questions/49547/how-to-control-web-page-caching-across-all-browsers)
* [循序漸進理解 HTTP Cache 機制](http://blog.techbridge.cc/2017/06/17/cache-introduction/)