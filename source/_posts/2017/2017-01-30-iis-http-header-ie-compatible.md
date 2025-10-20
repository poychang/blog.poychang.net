---
layout: post
title: 在 IIS 設定 IE 相容模式
date: 2017-01-30 10:32
author: Poy Chang
comments: true
categories: [Tools]
permalink: iis-http-header-ie-compatible/
---
公司有個系統因為時空背景的關係只能用 IE 開，而且還要利用[相容性檢視設定](https://support.microsoft.com/zh-tw/help/17472/windows-internet-explorer-11-fix-site-display-problems-compatibility-view)的方式才能正確開啟，只是這個方法套用下去，只要是該網域的網站都會用舊版的 IE 模式來瀏覽，一直以來相安無事，直到有新系統進來，惱人的事又來了。

若使用新版 IE 瀏覽網站時發生版面、影像或文字跑版時，可透過微軟所提供之**相容性檢視**功能幫忙解決，使其運作是使用舊版 IE 來模擬 CSS、JavaScript 的行為。只是這個設定會套用到整個網域，會造成同個網域下的網站也被迫使用舊版的方式來解析 CSS、JavaScript，這樣就不好了。

## 特定頁面設定 X-UA-Compatible

在寫網頁程式碼的時候，我們可以透過 HTML 的 `meta` 元素中加入 `X-UA-Compatible` 的 `http-equiv` 標頭，藉以來設定指定網頁的 IE 相容性檢視模式。下列範例是指定使用 `EmulateIE7` 來開啟該網頁。 

```html
<html>
    <head>
        <!-- Mimic Internet Explorer 7 -->
        <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
        <title>Page Title</title>
    </head>
    <body>
    </body>
</html>
```

這裡列一些常用的情境：

* 強制瀏覽器呈現為特定的版本的標準。它不支援 IE7 及以下：
    * `<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7"/>`
* 如果用分號分開，它設定為不同版本的兼容級別，IE7、IE9。它允許不同層次的向後兼容性：
    * `<meta http-equiv="X-UA-Compatible" content="IE=7; IE-9"/>`
* 只選擇其中一個選項：
    * `<meta http-equiv="X-UA-Compatible" content="IE=9">`
    * `<meta http-equiv="X-UA-Compatible" content="IE=8"/>`
    * `<meta http-equiv="X-UA-Compatible" content="IE=7">`
    * `<meta http-equiv="X-UA-Compatible" content="IE=5">`
* 允許更容易的測試和維護。雖然通常比較有用的版本，這是使用模擬：
    * `<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9"/>`
    * `<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8"/>`
    * `<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">`
* 什麼版本的 IE 就用什麼版本的標準模式：
    * `<meta http-equiv="X-UA-Compatible" content="IE=edge">`
* 使用以下程式碼強制 IE 使用 [Chrome Frame](https://zh.wikipedia.org/wiki/Google_Chrome_Frame)（此專案已於 2014 年 2 月 25 日停止維護）：
    * `<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">`

## 在 IIS 上指定 IE 使用的瀏覽器模式

上面的作法是針對特定網頁去做設定，如果是想針對網站做設定了話，可以透過 IIS 來處理。

IIS 7 中，可以在針對站台的**HTTP 回應標頭**新增 HTTP 標頭名稱為 `X-UA-Compatible`，並且將值設為 `IE=EmulateIE7` 即可完成全站設定。

![HTTP 回應標頭](http://i.imgur.com/n3JLjUh.png)

>選擇站台中的 **HTTP 回應標頭**

![新增](http://i.imgur.com/FRQOTku.png)

>點選右側動作的新增

![設定 X-UA-Compatible 標頭](http://i.imgur.com/4XGhPiX.png)

>設定 X-UA-Compatible 標頭

如果同時有以上二種作法，則是「特定頁面設定 X-UA-Compatible」的優先權較高。

## 同場加映：使用 HTTP_USER_AGENT 確認瀏覽器是否為 IE

這是一場歷史的共業，以前 IE 實在是造成太多困擾，因此有些網站透過判斷 `HTTP_USER_AGENT` 是否為 `MSIE` 來決定要顯示網站內容，只要是 IE 就轉跳畫面或直接給**請使用 Chrome / Firefox**（簡單說就是 IE Sorry）。

微軟也知道這問題將嚴重打擊網路事業的發展，因此在 IE 8 開始，`HTTP_USER_AGENT` 就除了使用 `MSIE` 還加了 `Trident` 做識別，而在 IE11 之後，就全面改用 `Trident`，避免自家瀏覽器陷入無法瀏覽網頁的冏境。

* Trident for IE8+
* MSIE for IE10-

根據上面兩個規則，可以裡用下面的程式碼來判斷是否為 IE 瀏覽器：

```php
<?php
if(
    isset($_SERVER['HTTP_USER_AGENT']) &&
    (
        strpos($_SERVER['HTTP_USER_AGENT'], 'Trident') !== false ||
        strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false
    )
){/*IE Browser*/}
?>
```

>PHP 程式碼

```vb
Dim UserAgent
UserAgent = Lcase(Request.ServerVariables("HTTP_USER_AGENT"))

if Instr(UserAgent, "msie") <> 0 or Instr(UserAgent, "trident") <> 0 then
	'IE Browser
else
	'Not IE Browser
end if
```

>VB 程式碼

----------

參考資料：

* [【HTML教學】X-UA-Compatible設置IE兼容模式](http://injerry.pixnet.net/blog/post/57042465-%E3%80%90html%E6%95%99%E5%AD%B8%E3%80%91x-ua-compatible%E8%A8%AD%E7%BD%AEie%E5%85%BC%E5%AE%B9%E6%A8%A1%E5%BC%8F)
* [如何從 Server-side 指定 IE8 瀏覽器應使用的瀏覽器模式](http://blog.miniasp.com/post/2009/03/12/work-around-webpage-display-issues-in-Internet-Explorer-80.aspx)
* [user-agent to check for IE (including IE 11)](https://edward-designer.com/web/_serveruser-agent-check-ie-including-ie-11/)
* [Google Chrome Frame 內嵌框架](https://zh.wikipedia.org/wiki/Google_Chrome_Frame)