---
layout: post
title: 你可以這樣用 HTML 的 Meta 標籤
date: 2017-12-01 12:00
author: Poy Chang
comments: true
categories: [Develop]
permalink: how-to-use-html-head/
---
HTML 中的 Meta 標籤可以用來提供網頁的內容資訊給瀏覽器或存取網頁的服務使用，例如常見的網頁內容描述（Description）、適用的螢幕解析度（Viewport），還有很多給爬蟲、社群媒體等使用的設定可以透過 Meta 標籤來標示，這裡做個整理。

## Meta 基本用法

標準的 Meta 標籤沒有結尾，可以直接將參數寫在 Meta 內，而一個網頁內可以寫多個 Meta 標籤做設定，但全部都要寫在 `head` 標籤內才是有效的寫法，參考下列 Html 5 的樣板，設定網頁編碼（charset）及螢幕解析度（viewport）的範例：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="css/style.css" rel="stylesheet">
    </head>
    <body>
    
    </body>
</html>
```

這個範例同時也是建議網頁最少要配置的 Meta 標籤，如果網頁的用戶有使用 IE 的時候，建議再加上這行，讓什麼版本的 IE 就用什麼版本的標準模式，避免 [IE 相容性檢視所造成的問題](https://blog.poychang.net/iis-http-header-ie-compatible/)。

```
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```

>建議上面三個標籤放在 head 標籤的最前面，其他的都放在後面。

## 複習一下

```html
<!-- 網頁標題 -->
<title>Page Title</title>

<!-- 在這個網頁相對路徑的基本路徑 -->
<base href="/base/path">

<!-- CSS 引用方式 -->
<link rel="stylesheet" href="styles.css">

<!-- 檔案內 CSS 撰寫方式-->
<style>
  /* ... */
</style>

<!-- JavaScript 引用方式-->
<script src="script.js"></script>

<!-- 定義 JavaScript 未被執行時的替代顯示內容-->
<noscript><!--no JS alternative--></noscript>
```
## 各項 Meta 用途說明

### Meta

```html
<!-- 設置文檔的字符編碼 -->
<meta charset="UTF-8">
<!-- 螢幕解析度 -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- IE 相容性模式 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<!-- 在資源載入的地方可以允許控制 -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
<!-- 盡可能早地把標籤放在文檔中 -->
<!-- 僅僅應用下面的這些標籤 -->

<!-- 如果網站是作為一個 App 來使用的話，設置 App 名稱 -->
<meta name="application-name" content="Application Name">

<!-- 頁面的短描述(至多150個字符) -->
<!-- 在某些情況下，描述會作為搜索結果的顯示文字-->
<meta name="description" content="A description of the page">

<!-- 控制搜索引擎爬蟲和索引的行為 -->
<meta name="robots" content="index,follow,noodp"><!-- All Search Engines -->
<meta name="googlebot" content="index,follow"><!-- Google Specific -->

<!-- 告訴 Google 不要再搜索框裡面顯示網站鏈接-->
<meta name="google" content="nositelinkssearchbox">

<!-- 告訴 Google 不要翻譯這個頁面 -->
<meta name="google" content="notranslate">

<!-- 對於 Google 搜索驗證所有權 -->
<meta name="google-site-verification" content="verification_token">

<!-- 在構架網站的時候對軟件進行命名 (比如 - WordPress, Dreamweaver) -->
<meta name="generator" content="program">

<!-- 網站主題的短描述 -->
<meta name="subject" content="your website's subject">

<!-- 非常短的描述（不多於10個單詞）。基本上是對於學術論文 -->
<meta name="abstract" content="">

<!-- 域名全稱或者網站地址 -->
<meta name="url" content="https://example.com/">

<meta name="directory" content="submission">

<!-- 根據網站內容給出一個通用的年齡打分 -->
<meta name="rating" content="General">

<!-- Allows control over how referrer information is passed -->
<meta name="referrer" content="no-referrer">

<!-- Disable automatic detection and formatting of possible phone numbers -->
<meta name="format-detection" content="telephone=no">

<!-- Completely opt out of DNS prefetching by setting to 'off' -->
<meta http-equiv="x-dns-prefetch-control" content="off">

<!-- Stores cookie on the client web browser for client identification -->
<meta http-equiv="set-cookie" content="name=value; expires=date; path=url">

<!-- Specifies the page to appear in a specific frame -->
<meta http-equiv="Window-Target" content="_value">

<!-- Geo tags -->
<meta name="ICBM" content="latitude, longitude">
<meta name="geo.position" content="latitude;longitude">
<meta name="geo.region" content="country[-state]"><!-- Country code (ISO 3166-1): mandatory, state code (ISO 3166-2): optional; eg. content="US" / content="US-NY" -->
<meta name="geo.placename" content="city/town"><!-- eg. content="New York City" -->
```

- [Meta tags that Google understands](https://support.google.com/webmasters/answer/79812?hl=en)
- [WHATWG Wiki: MetaExtensions](https://wiki.whatwg.org/wiki/MetaExtensions)
- [ICBM on Wikipedia](https://en.wikipedia.org/wiki/ICBM_address#Modern_use)
- [Geotagging on Wikipedia](https://en.wikipedia.org/wiki/Geotagging#HTML_pages)

### 不推薦繼續使用的 Meta 

以下的 Meta 屬性不建議再繼續使用，因為他們的採用率很低或者已經被棄用了。

```html
<!-- Used to declare the document language, but not well supported. Better to use <html lang=""> -->
<meta name="language" content="en">

<!-- Google disregards & Bing considers it an indicator of spam -->
<meta name="keywords" content="your,keywords,here,comma,separated,no,spaces">
<!-- No evidence of current use in any search engines -->
<meta name="revised" content="Sunday, July 18th, 2010, 5:15 pm">

<!-- Provides an easy way for spam bots to harvest email addresses -->
<meta name="reply-to" content="email@example.com">

<!-- Better to use <link rel="author"> or humans.txt file -->
<meta name="author" content="name, email@example.com">
<meta name="designer" content="">
<meta name="owner" content="">

<!-- Tells search bots to revisit the page after a period. This is not supported because most Search Engines now use random intervals for re-crawling a webpage -->
<meta name="revisit-after" content="7 days">

<!-- Sends user to a new URL after a certain amount of time -->
<!-- The W3C recommends that this tag not be used. Google recommends using a server-side 301 redirect instead. -->
<meta http-equiv="refresh" content="300; url=https://example.com/">

<!-- Describes the topic of the website -->
<meta name="topic" content="">

<!-- Brief summary of the company or purpose of the website -->
<meta name="summary" content="">

<!-- A deprecated tag that does the same as the keywords meta tag -->
<meta name="classification" content="business">

<!-- Does the same as URL, older and not supported -->
<meta name="identifier-URL" content="https://example.com/">

<!-- Similar function to the keywords tag -->
<meta name="category" content="">

<!-- Makes sure your website shows up in all countries and languages -->
<meta name="coverage" content="Worldwide">

<!-- Does the same as the coverage tag -->
<meta name="distribution" content="Global">

<!-- Controls what user can access on the internet -->
<meta http-equiv="Pics-label" content="value">

<!-- Cache Control -->
<!-- Better to configure cache control server side -->
<meta http-equiv="Expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache">
```

## Link

```html
<!-- Helps prevent duplicate content issues -->
<link rel="canonical" href="https://example.com/2010/06/9-things-to-do-before-entering-social-media.html">

<!-- Used to be included before the icon link, but is deprecated and no longer is used -->
<link rel="shortlink" href="https://example.com/?p=42">

<!-- Links to an AMP HTML version of the current document -->
<link rel="amphtml" href="https://example.com/path/to/amp-version.html">

<!-- Points to a CSS stylesheet -->
<link rel="stylesheet" href="https://example.com/styles.css">

<!-- Links to a JSON file that specifies "installation" credentials for web applications -->
<link rel="manifest" href="manifest.json">

<!-- Links to the author of the document -->
<link rel="author" href="humans.txt">

<!-- Refers to a copyright statement that applies to the links context -->
<link rel="copyright" href="copyright.html">

<!-- Gives a reference to a location in your document that may be in another language -->
<link rel="alternate" href="https://es.example.com/" hreflang="es">

<!-- Gives information about an author or another person -->
<link rel="me" href="https://google.com/profiles/thenextweb" type="text/html">
<link rel="me" href="mailto:name@example.com">
<link rel="me" href="sms:+15035550125">

<!-- Links to a document that contains an archive link to the current document -->
<link rel="archives" href="https://example.com/2003/05/" title="May 2003">

<!-- Links to top level resource in an hierarchical structure -->
<link rel="index" href="https://example.com/" title="DeWitt Clinton">

<!-- Gives the starting point of the document -->
<link rel="start" href="https://example.com/photos/pattern_recognition_1_about/" title="Pattern Recognition 1">

<!-- Leads to the preceding resource of the sequence the current document is in -->
<link rel="prev" href="https://example.com/opensearch/opensearch-and-openid-a-sure-way-to-get-my-attention/" title="OpenSearch and OpenID? A sure way to get my attention.">

<!-- Gives a self reference - useful when the document has multiple possible references -->
<link rel="self" type="application/atom+xml" href="https://example.com/atomFeed.php?page=3">

<!-- The first, next, previous, and last documents in a series of documents, respectively -->
<link rel="first" href="https://example.com/atomFeed.php">
<link rel="next" href="https://example.com/atomFeed.php?page=4">
<link rel="previous" href="https://example.com/atomFeed.php?page=2">
<link rel="last" href="https://example.com/atomFeed.php?page=147">

<!-- Used when using a 3rd party service to maintain a blog -->
<link rel="EditURI" href="https://example.com/xmlrpc.php?rsd" type="application/rsd+xml" title="RSD">

<!-- Forms an automated comment when another WordPress blog links to your WordPress blog or post -->
<link rel="pingback" href="https://example.com/xmlrpc.php">

<!-- Notifies a url when you link to it on your site -->
<link rel="webmention" href="https://example.com/webmention">

<!-- Loads in an external HTML file into the current HTML file -->
<link rel="import" href="component.html">

<!-- Open Search -->
<link rel="search" href="/open-search.xml" type="application/opensearchdescription+xml" title="Search Title">

<!-- Feeds -->
<link rel="alternate" href="https://feeds.feedburner.com/example" type="application/rss+xml" title="RSS">
<link rel="alternate" href="https://example.com/feed.atom" type="application/atom+xml" title="Atom 0.3">

<!-- Prefetching, preloading, prebrowsing -->
<link rel="dns-prefetch" href="//example.com/">
<link rel="preconnect" href="https://www.example.com/">
<link rel="prefetch" href="https://www.example.com/">
<link rel="prerender" href="https://example.com/">
<link rel="preload" href="image.png" as="image">
<!-- More info: https://css-tricks.com/prefetching-preloading-prebrowsing/ -->
```

### 不推薦繼續使用的 Link

以下的 Link 屬性不建議再繼續使用。

```html
<link rel="shortcut icon" href="path/to/favicon.ico">

<!-- Not useful, proprietary and buggy, see https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/Y_2eFRh9BOs/gULYapoRBwAJ -->
<link rel="subresource" href="styles.css">
```

### Favicons

```html
<!-- IE 10 或以下版本 -->
<!-- 不需要提供 Link 設定，只要將 favicon.ico 檔案放在網站根目錄即可 -->

<!-- 瀏覽器 IE 11, Chrome, Firefox, Safari, Opera 的設定-->
<link rel="icon" href="path/to/favicon-16.png" sizes="16x16" type="image/png">
<link rel="icon" href="path/to/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="path/to/favicon-48.png" sizes="48x48" type="image/png">
<link rel="icon" href="path/to/favicon-62.png" sizes="62x62" type="image/png">
<link rel="icon" href="path/to/favicon-192.png" sizes="192x192" type="image/png">
<!-- More info: https://bitsofco.de/all-about-favicons-and-touch-icons/ -->
```

- [All About Favicons (And Touch Icons)](https://bitsofco.de/all-about-favicons-and-touch-icons/)
- [Favicon Cheat Sheet](https://github.com/audreyr/favicon-cheat-sheet)

### Social

各大社群媒體有他們自己使用 Meta 的方式，所規格化定義的 HTML Meta 屬性提供網頁的標題、縮圖、描述等等資訊，讓網頁能以更完美的形式呈現在各平台之中。

#### Facebook / Open Graph

```html
<meta property="fb:app_id" content="123456789">
<meta property="og:url" content="https://example.com/page.html">
<meta property="og:type" content="website">
<meta property="og:title" content="Content Title">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:description" content="Description Here">
<meta property="og:site_name" content="Site Name">
<meta property="og:locale" content="en_US">
<meta property="article:author" content="">
<!-- Facebook: https://developers.facebook.com/docs/sharing/webmasters#markup -->
<!-- Open Graph: http://ogp.me/ -->
```

- [Facebook Open Graph Markup](https://developers.facebook.com/docs/sharing/webmasters#markup)
- [Open Graph protocol](http://ogp.me/)
- [Open Graph？跟資料視覺化有什麼關係？](http://blog.infographics.tw/2015/03/open-graph-and-data-visualization/)

#### Facebook / Instant Articles

```html
<meta charset="utf-8">
<meta property="op:markup_version" content="v1.0">

<!-- The URL of the web version of your article -->
<link rel="canonical" href="http://example.com/article.html">

<!-- The style to be used for this article -->
<meta property="fb:article_style" content="myarticlestyle">
```

- [Facebook Instant Articles: Creating Articles](https://developers.facebook.com/docs/instant-articles/guides/articlecreate)
- [Instant Articles: Format Reference](https://developers.facebook.com/docs/instant-articles/reference)

#### Twitter

```html
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@site_account">
<meta name="twitter:creator" content="@individual_account">
<meta name="twitter:url" content="https://example.com/page.html">
<meta name="twitter:title" content="Content Title">
<meta name="twitter:description" content="Content description less than 200 characters">
<meta name="twitter:image" content="https://example.com/image.jpg">
<!-- More info: https://dev.twitter.com/cards/getting-started -->
<!-- Validate: https://dev.twitter.com/docs/cards/validation/validator -->
```

- [Twitter Cards: Getting Started Guide](https://dev.twitter.com/cards/getting-started)
- [Twitter Card Validator](https://dev.twitter.com/docs/cards/validation/validator)

#### Google+ / Schema.org

```html
<link href="https://plus.google.com/+YourPage" rel="publisher">
<meta itemprop="name" content="Content Title">
<meta itemprop="description" content="Content description less than 200 characters">
<meta itemprop="image" content="https://example.com/image.jpg">
```

#### Pinterest

Pinterest lets you prevent people from saving things from your website, according [to their help center](https://help.pinterest.com/en/articles/prevent-people-saving-things-pinterest-your-site). The `description` is optional.

```html
<meta name="pinterest" content="nopin" description="Sorry, you can't save from my website!">
```

### OEmbed

oEmbed 是一種開放格式，目的在於讓網站內容可內嵌於其他網頁。

```html
<link rel="alternate" type="application/json+oembed"
  href="http://example.com/services/oembed?url=http%3A%2F%2Fexample.com%2Ffoo%2F&amp;format=json"
  title="oEmbed Profile: JSON">
<link rel="alternate" type="text/xml+oembed"
  href="http://example.com/services/oembed?url=http%3A%2F%2Fexample.com%2Ffoo%2F&amp;format=xml"
  title="oEmbed Profile: XML">
```

- [oEmbed format](http://oembed.com/)
- [可內嵌 Facebook 內容的 oEmbed 端點](https://developers.facebook.com/docs/plugins/oembed-endpoints/?locale=zh_TW)

### Platforms

Meta 除了在社群媒體上有專屬的用法，在各系統平台也有提供類似的設定方式。

#### Apple

iOS 系列：

```html
<!-- Smart App Banner -->
<meta name="apple-itunes-app" content="app-id=APP_ID,affiliate-data=AFFILIATE_ID,app-argument=SOME_TEXT">

<!-- Disable automatic detection and formatting of possible phone numbers -->
<meta name="format-detection" content="telephone=no">

<!-- Add to Home Screen -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="App Title">

<!-- Touch Icons -->
<link rel="apple-touch-icon" href="path/to/apple-touch-icon.png">
<link rel="apple-touch-icon-precomposed" href="path/to/apple-touch-icon-precomposed.png">
<!-- iOS 8+ no longer support precomposed, only apple-touch-icon is required -->

<!-- In most cases, one 180×180px touch icon in the head is enough -->
<!-- Utilize the different icon sizes if you would want unique icons -->
<!-- determined by device. -->
<link rel="apple-touch-icon" sizes="57x57" href="path/to/icon@57.png">
<link rel="apple-touch-icon" sizes="72x72" href="path/to/icon@72.png">
<link rel="apple-touch-icon" sizes="114x114" href="path/to/icon@114.png">
<link rel="apple-touch-icon" sizes="144x144" href="path/to/icon@144.png">

<!-- Startup Image (棄用) -->
<link rel="apple-touch-startup-image" href="path/to/startup.png">

<!-- iOS app deep linking -->
<meta name="apple-itunes-app" content="app-id=APP-ID, app-argument=http/url-sample.com">
<link rel="alternate" href="ios-app://APP-ID/http/url-sample.com">
```

- [Apple Meta Tags](https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)

Safari 系列：

```html
<!-- Pinned Site -->
<link rel="mask-icon" href="path/to/icon.svg" color="red">
```

### Google

Android 系列：

```html
<meta name="theme-color" content="#E64545">

<!-- Add to home screen -->
<meta name="mobile-web-app-capable" content="yes">
<!-- More info: https://developer.chrome.com/multidevice/android/installtohomescreen -->

<!-- Android app deep linking -->
<meta name="google-play-app" content="app-id=package-name">
<link rel="alternate" href="android-app://package-name/http/url-sample.com">
```

Chrome 系列：

```html
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/APP_ID">

<!-- Disable translation prompt -->
<meta name="google" value="notranslate">
```

Chrome Mobile (Android Only) 系列：

Since Chrome 31, you can set up your web app to "app mode" like Safari.

```html
<!-- Link to a manifest and define the manifest metadata. -->
<!-- The example of manifest.json could be found in the link below. -->
<link rel="manifest" href="manifest.json">

<!-- Define your web page as a web app -->
<meta name="mobile-web-app-capable" content="yes">

<!-- The first one is the official recommended format.  -->
<link rel="icon" sizes="192x192" href="nice-highres.png">
<link rel="icon" sizes="128x128" href="niceicon.png">
<!-- Formats with Apple prefix will be deprecated. -->
<link rel="apple-touch-icon" sizes="128x128" href="niceicon.png">
<link rel="apple-touch-icon-precomposed" sizes="128x128" href="niceicon.png">
```

[Google Developer](https://developer.chrome.com/multidevice/android/installtohomescreen)

### Microsoft

Internet Explorer 系列：

```html
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta http-equiv="cleartype" content="on">
<meta name="skype_toolbar" content="skype_toolbar_parser_compatible">

<!-- Disable link highlighting on IE 10 on Windows Phone (https://blogs.windows.com/buildingapps/2012/11/15/adapting-your-webkit-optimized-site-for-internet-explorer-10/) -->
<meta name="msapplication-tap-highlight" content="no">

<!-- Pinned sites (https://msdn.microsoft.com/en-us/library/dn255024(v=vs.85).aspx) -->
<meta name="application-name" content="Contoso Pinned Site Caption">
<meta name="msapplication-tooltip" content="Example Tooltip Text">
<meta name="msapplication-starturl" content="/">

<meta name="msapplication-config" content="http://example.com/browserconfig.xml">

<meta name="msapplication-allowDomainApiCalls" content="true">
<meta name="msapplication-allowDomainMetaTags" content="true">
<meta name="msapplication-badge" content="frequency=30; polling-uri=http://example.com/id45453245/polling.xml">
<meta name="msapplication-navbutton-color" content="#FF3300">
<meta name="msapplication-notification" content="frequency=60;polling-uri=http://example.com/livetile">
<meta name="msapplication-square150x150logo" content="path/to/logo.png">
<meta name="msapplication-square310x310logo" content="path/to/largelogo.png">
<meta name="msapplication-square70x70logo" content="path/to/tinylogo.png">
<meta name="msapplication-wide310x150logo" content="path/to/widelogo.png">
<meta name="msapplication-task" content="name=Check Order Status;action-uri=./orderStatus.aspx?src=IE9;icon-uri=./favicon.ico">
<meta name="msapplication-task-separator" content="1">
<meta name="msapplication-TileColor" content="#FF3300">
<meta name="msapplication-TileImage" content="path/to/tileimage.jpg">
<meta name="msapplication-window" content="width=1024;height=768">
```

### App Links

要再行動裝置中從網頁呼叫 App 有兩種方式，常見的是使用 Url Scheme，但方式的點擊率不高，因此有了 App Link 來達成 App 和 App 之間互相連結，當然，瀏覽器和 App 的連結也是其中之一。

```
<!-- iOS -->
<!-- 該網頁對應到 App 某個 URL Scheme 位置 -->
<meta property="al:ios:url" content="applinks://docs">
<!-- 這可以讓使用者在未安裝 App 時，連結至安裝位置 -->
<meta property="al:ios:app_store_id" content="12345">
<!-- 這會出現在使用者未安裝 App，叫你去下載某某 App 的那個文案 -->
<meta property="al:ios:app_name" content="App Links">

<!-- Android -->
<meta property="al:android:url" content="applinks://docs">
<meta property="al:android:app_name" content="App Links">
<meta property="al:android:package" content="org.applinks">

<!-- Web Fallback -->
<!-- 要在使用者未安裝 App 的時候自動 fallback 帶使用者到網頁版嗎？預設是 true，若設為 false，會問使用者是否要下載該 App，或是直接去網頁 -->
<meta property="al:web:url" content="http://applinks.org/documentation">
```

- [App Links Docs](http://applinks.org/documentation/)
- [關於 APPLINKS 兩三事](https://blog.patw.me/archives/1080/something-about-app-links/)

## Related Projects

- [Atom HTML Head Snippets](https://github.com/joshbuchea/atom-html-head-snippets) - Atom package for `HEAD` snippets
- [Sublime Text HTML Head Snippets](https://github.com/marcobiedermann/sublime-head-snippets) - Sublime Text package for `HEAD` snippets
- [head-it](https://github.com/hemanth/head-it) - CLI interface for `HEAD` snippets
- [vue-head](https://github.com/ktquez/vue-head) - Manipulating the meta information of the `HEAD` tag for Vue.js


----------

參考資料：

* [HTML5 Boilerplate Docs: The HTML](https://github.com/h5bp/html5-boilerplate/blob/master/dist/doc/html.md)
* [HTML5 Boilerplate Docs: Extend and customize](https://github.com/h5bp/html5-boilerplate/blob/master/dist/doc/extend.md)

