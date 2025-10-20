---
layout: post
title: 讓 GitHub Pages 能支援不區分大小寫網址的能力
date: 2022-04-11 15:52
author: Poy Chang
comments: true
categories: [Javascript]
permalink: make-jekyll-github-pages-case-insensitive/
---

URL 的[網路標準]（https://www.w3.org/TR/WD-html40-970708/htmlweb.html）是有區分大小寫的，畢竟目前為止約有 80% 的網站都是使用 Unix-like 的作業系統架設的，而 Unix-like 作業系統中，是會區分大小寫的。那麼我們要如何讓架設在 GitHub Pages 的 Jekyll 網站，能支援不區分大小寫的網址呢？

Jekyll 本身沒有支援相關的設定，但是你可以透過 [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from) 套件來處理這個問題。

但這個方式有點麻煩，要在每個頁面都加上相關設定。

透過 GitHub Pages 的 `404.html` 機制，好像挺不錯的。

只要在你的網站中提供 `404.html` 檔案，當 GitHub Pages 找不到相關的網址（URL 大寫的網址）時，就會自動導向到 `404.html` 這個檔案。然後我們在這裡去處理相關的路由導向即可。

以下程式碼是以本部落格為例，使用 `site.posts` 取得所有網頁的 URL，然後和當前的網址進行比對，找到正確的網址做導向。

```javascript
var allPosts = [];
function redirectToCorrectPage() {
    console.log('Unable to find page. Trying other URL cases.');
    {% for post in site.posts %}
        allPosts.push('{{ post.url }}');
    {% endfor %}
    var url = window.location.pathname;
    // strip trailing /
    if (url.slice(-1) === '/') {
        url = url.slice(0, -1);
    }
    var allPostsUpperCase = allPosts.map(function (value) {
        // strip trailing /
        if (value.slice(-1) === '/') {
            value = value.slice(0, -1);
        }
        return value.toUpperCase();
    });
    console.log('Looking for ' + url.toUpperCase() + ' in ' + allPostsUpperCase);
    var i = allPostsUpperCase.indexOf(url.toUpperCase());
    if (i != -1) {
        console.log(allPosts[i]);
        window.location = allPosts[i];
    }
}
window.onload = redirectToCorrectPage;
```

這樣就可以讓 GitHub Pages 支援不區分大小寫的網址了。

----------

參考資料：

* [Jekyll 404 page on GitHub Pages to fix case sensitive URLs](https://gist.github.com/AmrEldib/81a4660fe00da8f11956)
