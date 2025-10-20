---
layout: post
title: 在 Jekyll 上增加 Facebook Like 按鈕
date: 2017-01-20 14:14
author: Poy Chang
comments: true
categories: [Tools]
permalink: jekyll-facebook-like-button/
---
社群媒體當道的時代，在部落格上增加一個 Facebook Like 按鈕，也是理所當然的事情，如何在使用 Jekyll 架設的部落格中，添加這社群媒體的神兵利器，這裡讓你看仔細。

## Jekyll 架構

Jekyll 預設的架構

```
.
├── _config.yml
├── _drafts
|   ├── begin-with-the-crazy-ideas.textile
|   └── on-simplicity-in-technology.markdown
├── _includes
|   ├── footer.html
|   └── header.html
├── _layouts
|   ├── default.html
|   └── post.html
├── _posts
|   ├── 2016-06-10-javascript-copy-clipboard.md
|   └── 2016-06-13-cordova-android-localized-app-name.md
├── _data
|   └── members.yml
├── _site
├── .jekyll-metadata
└── index.html
```

* 根目錄中有兩個重要檔案：主設定檔 `_config.yml` 和主入口 `index.html`
* 重點資料夾：`_includes`、`_layouts`、`_posts`、`_sass`
	* `_includes` 資料夾存放各種版面上的元件，利於後續模組化使用
{% raw %}
	* `_layouts` 資料夾存放各種版面的檔案，例如設計好的 header、footer 版面等，可以再透過 `{% include header.html %}`
{% endraw %}
這樣的方式來引用。

	* `_posts` 資料夾存放部落格文章
	* `_sass` 資料夾存放網站 SASS 樣式檔

這裡我們主要重點放在 `_includes` 資料夾，在這裡建立 Facebook Like 按鈕，並在各個版面中使用。

## 建立 Like 按鈕

在建立 Facebook Like 按鈕前，你必須要有一個粉絲頁，可以[從這裡](https://www.facebook.com/pages/create/)去建立一個。

建立完粉絲頁後，要到 [Like Button for the Web](https://developers.facebook.com/docs/plugins/like-button) 中填寫 Like Button Configurator 中的相關資訊並產生程式碼。

其中最重要的一點是，在 `URL to Like` 這個欄位中，要填入你粉絲頁的 URL 網址。

![Like Button Configurator](http://i.imgur.com/Gkwo9Qp.png)

如果你是第一次使用 Facebook Developer tools，你可能需要先建立一個 Facebook App，然後平台選擇 Website，才能接續建立 Like 按鈕。

Like Button Configurator 程式碼產生器會產出如下兩段的程式碼：

```html
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.8&appId=325238924476122";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
```

```html
<div class="fb-like" data-href="https://developers.facebook.com/docs/plugins/" data-layout="standard" data-action="like" data-size="small" data-show-faces="true" data-share="true"></div>
```

## 加入你的文章中

首先在 `_includes` 資料夾中建立一個名為 `fb-like.html` 的檔案，並將上述產生的兩段程式碼複製至此檔案內。

接著就可以在 `_layouts` 資料夾中，選擇你想要擺放的版面，使用 `{``% include fb-like.html %}` 來引入該元件，例如，如果想在所有文章中加入 Facebook Like 按鈕，可以在 `post.html` 中加入 `{``% include fb-like.html %}`。

## 延遲載入

網頁內容才是來看你部落格的主要目的，因此我們不希望載入 Facebook Like 按鈕的程式碼造成內容瀏覽的負擔，因此可以在 `script` 標籤中透過 `defer` 參數來延遲此 Javascript 的載入。

```html
<script defer>
(function(d, s, id) {
	//do something...
})();
</script>
```

![async 和 defer 的時序圖](http://i.imgur.com/xqax04D.jpg)

* `<script src="demo.js" ></script>`
	* 整個網頁的繪製會暫停，等 demo.js 下載並執行完成後繼續繪製
* `<script src="demo.js" defer ></script>`
	* 網頁繪製不會暫停， demo.js 在背景下載，待 DOMContentLoaded 事件發生後，再執行 demo.js
* `<script src="demo.js" async ></script>`
	* 網頁繪製不會暫停， demo.js 在背景下載，待網頁繪製完成之後執行 demo.js，

----------

參考資料：

* [Adding Facebook Like Button to Jekyll Blog](https://blog.webjeda.com/facebook-like-button-jekyll/)
* [Like Button for the Web](https://developers.facebook.com/docs/plugins/like-button)
* [Asynchronous and deferred JavaScript execution explained](http://peter.sh/experiments/asynchronous-and-deferred-javascript-execution-explained/)