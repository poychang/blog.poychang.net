---
layout: post
title: 不使用套件直接產生 Jekyll 的 sitemap.xml
date: 2017-04-28 12:52
author: Poy Chang
comments: true
categories: [Tools]
permalink: generating-sitemap-in-jekyll-without-plugin/
---
最近剛好在處理 Sitemap 的問題，如果有在做 SOE 的朋友應該都知道 Sitemap 的重要性，他可以為搜索引擎的蜘蛛提供瀏覽整個網站的連結，藉此讓搜尋引擎更認識你的網站，後來就想在自己的部落格來玩玩看，就找到這個方法，不使用任何 Jekyll 套件，就能輕鬆產出 sitemap.xml。

>因為我的部落格是使用 Github Pages 的服務，所以 Jekyll 是執行 `--safe` 模式，因此也不能使用客製套件

## Sitemap 格式

`sitemap.xml` 裡面包含網站內的各個連結，他有個固定的格式，如下：

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://blog.poychang.net/generating-sitemap-in-jekyll-without-plugin/</loc>
        <lastmod>2017-04-27T23:42:00+08:00</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
</urlset>
```

Sitemap 必須符合以下條件：

* 以起始 `<urlset>` 標記做為開頭，並以結束 `</urlset>` 標記結束
* 指定 `<urlset>` 內的名稱領域 (通訊協定標準)
* 讓每個 URL 中包含一個 `<url>` 項目做為母層 XML 標記
* 在每個 `<url>` 母層標記包含一個 `<loc>` 子層項目

每一組 `<url>` 就代表一個頁面，其中屬性說明如下：

* `loc` 網頁的 URL
* `lastmod` 檔案的最後修改日期
* `changefreq` 網頁可能變更的頻率，有效值如下：
	* always
	* hourly
	* daily
	* weekly
	* monthly
	* yearly
	* never
* `priority` 此 URL 相對於您網站上的其他 URL 的優先順序，有效值從 0.0 到 1.0

## 自動產生 sitemap.xml 內容

{% raw %}
在 Jekyll 我們可以透過 `{% for post in site.posts %}` 來遍巡文章，或 `{% for page in site.pages %}` 來遍尋頁面，藉此取得各頁面的 metadata，然後寫入 xml 中，因此可以在 jekyll 專案裡面建立一個 `sitemap.xml` 檔案，內容如下：
{% endraw %}

<script src="https://gist.github.com/poychang/fb7be1320565c6cee6cf8255a1ce321a.js"></script>

透過上面的程式碼，我們可以在部落格文章（post）或頁面（page）中，使用下列 metadata 來提供或修改相關資訊，格式如下：

```
sitemap:
  lastmod: 2014-01-23
  priority: 0.7
  changefreq: 'monthly'
  exclude: 'yes'
```

## 補充說明

在 Google Search Console 的[提交 Sitemap 說明文件](https://support.google.com/webmasters/answer/183668?hl=zh-Hant)中提到， Sitemap 檔案要使用 UTF-8 編碼，如果遇到下列字元，需轉換成溢出碼。

<table class="table table-striped">
<thead>
  <tr>
    <th>字元</th>
	<th>逸出碼</th>
  </tr>
</thead>
<tbody>
  <tr>
	<td>& 符號</td>
	<td>&amp;amp;</td>
  </tr>
  <tr>
	<td>單引號</td>
	<td>&amp;apos;</td>
  </tr>
  <tr>
	<td>雙引號</td>
	<td>&amp;quot;</td>
  </tr>
  <tr>
	<td>大於</td>
	<td>&amp;gt;</td>
  </tr>
  <tr>
	<td>小於</td>
	<td>&amp;lt;</td>
  </tr>
</tbody>
</table>

----------

參考資料：

* [Sitemaps XML 格式](https://www.sitemaps.org/zh_TW/protocol.html)
* [Google Search Console 建立並提交 Sitemap](https://support.google.com/webmasters/answer/183668?hl=zh-Hant)
* [Generating a Sitemap in Jekyll without a Plugin](http://davidensinger.com/2013/03/generating-a-sitemap-in-jekyll-without-a-plugin/)
* [Building a Better Sitemap.xml with Jekyll](http://davidensinger.com/2013/11/building-a-better-sitemap-xml-with-jekyll/)