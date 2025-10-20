---
layout: post
title: 手把手將 Blazor WebAssembly 部署到 GitHub Pages
date: 2021-11-09 18:06
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Blazor]
permalink: publish-blazor-webassembly-app-to-github-page/
---

如果 Blazor WebAssembly App 可以是純前端的網站，不需要有後端只要有瀏覽器就可以運作，那麼可不可以用 GitHub Pages 來當作 Blazor WebAssembly App 的執行環境呢？答案是肯定的，只是過程中有滿多細節需要注意的，這篇來動手做一次看看吧！

## 建立 Blazor WebAssembly App 專案

這邊使用 Visual Studio 來建立 Blazor WebAssembly App。

![使用 Blazor WebAssembly 專案範本建立專案](https://i.imgur.com/zXlH3kN.png)

並且選用最新的 .NET 6 來作為底層框架，同時設定使用 PWA (Progressive Web App)。

![設定使用 PWA](https://i.imgur.com/D0U9Jj1.png)

初始化專案的部分沒甚麼好說的，點幾下就完成了，重點是接下來的各項調整。

## SHA 雜湊值問題

>最雷得先開始處理。

由於在團隊開發中，可能有些開發者用 Linux 有些人用 Windows，這時候可能會遇到開發環境使用不同的換行符號（Linux 慣用 LF，Windows 慣用 CRLF），尤其在將檔案提交到 Git 上時，可能會因為 Git 預設處理檔案的方式，造成檔案的 SHA 雜湊值和預期不同。

因為這個範例會使用 Blazor WebAssembly App 搭配 PWA 進行建置，因為 PWA 其中的 Service Worker 在執行時會去查看 `service-worker-assets.js` 這個檔案（這個檔案會在最後發布 Blazor App 時看到），檢查相關檔案的 SHA 雜湊值，要符合對應的 SHA 雜湊值才能正確取得檔案資源。

但因為 Git 會預設有個自動修改換行符號的機制，而這個換行符號的修正，可能會造成發布時所計算得到的 SHA 雜湊值，和真正提交到 GitHub Pages 上的檔案不同，造成無法正確取得檔案的問題。

如果發佈到 GitHub Pages 後，瀏覽該網站時，在瀏覽器的 Console 中看到類似下列的錯誤訊息，那就表示你可能遇到類似上面的問題。

```log
Failed to find a valid digest in the 'integrity' attribute for resource 'https://poychang.github.io/BlazorAppOnGitHubPages/_framework/blazor.webassembly.js' with computed SHA-256 integrity '2M2aQEciVK1PXon46d1v4Egc7aTt4RYT6dXlkmHIR0c='. The resource has been blocked.
```

這時候我們可以在 GitHub Pages 的目錄下新增 `.gitattributes` 檔案，藉此來定義 Git 對所有文字檔案進行正規化處理的方式。

然而，一般來說我們可以在 `.gitattributes` 檔案中寫上 `autocrlf=false` 來要告訴 Git 不要幫我轉換 CRLF 字元，避免換行符號造成 SHA 雜湊值比對不到的問題，但是這個方法效果似乎有限，因此改用下面的設定方式，告訴 Git 把 `docs` 資料夾下的所有檔案，當作二進制檔案來處理，藉此不處理任何文字或符號。

```
docs/** binary
```

>因為我這邊搭配的 GitHub Pages 設定是使用 `docs` 資料夾當作網站檔案來源，如果你是採用 `gh-pages` 分支的方式，則可以使用 `* binary` 這樣的設定。

## 設定 404 轉址

我知道這個標題很奇怪，但真的是透過 GitHub Pages 若收到 404 狀態碼會轉址到 `404.html` 這個特性，來達成 URL Rewrite 的效果。

這邊推薦用 [rafrex/spa-github-pages](https://github.com/rafrex/spa-github-pages) 的程式碼來完成這個功能。

我們只需要在專案中的 `wwwroot` 資料夾中增加一個 `404.html` 並套用以下內容即可：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Single Page Apps for GitHub Pages</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // https://github.com/rafrex/spa-github-pages
      // Copyright (c) 2016 Rafael Pedicini, licensed under the MIT License
      // ----------------------------------------------------------------------
      // This script takes the current url and converts the path and query
      // string into just a query string, and then redirects the browser
      // to the new url with only a query string and hash fragment,
      // e.g. http://www.foo.tld/one/two?a=b&c=d#qwe, becomes
      // http://www.foo.tld/?p=/one/two&q=a=b~and~c=d#qwe
      // Note: this 404.html file must be at least 512 bytes for it to work
      // with Internet Explorer (it is currently > 512 bytes)

      // If you're creating a Project Pages site and NOT using a custom domain,
      // then set segmentCount to 1 (enterprise users may need to set it to > 1).
      // This way the code will only replace the route part of the path, and not
      // the real directory in which the app resides, for example:
      // https://username.github.io/repo-name/one/two?a=b&c=d#qwe becomes
      // https://username.github.io/repo-name/?p=/one/two&q=a=b~and~c=d#qwe
      // Otherwise, leave segmentCount as 0.
      var segmentCount = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?p=/' +
        l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
        (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

## 處理網址的查詢字串

一樣是為了在 GitHub Pages 上讓 SPA 網頁能正確處理網址的查詢字串，我們需要修改專案中的 `wwwroot` 資料夾下的 `index.html`，在 `head` 標籤中加上以下內容：

```html
<head>
    <!-- 略... -->

    <!-- Start Single Page Apps for GitHub Pages -->
    <script type="text/javascript">
        // Single Page Apps for GitHub Pages
        // https://github.com/rafrex/spa-github-pages
        // Copyright (c) 2016 Rafael Pedicini, licensed under the MIT License
        // ----------------------------------------------------------------------
        // This script checks to see if a redirect is present in the query string
        // and converts it back into the correct url and adds it to the
        // browser's history using window.history.replaceState(...),
        // which won't cause the browser to attempt to load the new url.
        // When the single page app is loaded further down in this file,
        // the correct url will be waiting in the browser's history for
        // the single page app to route accordingly.
        (function (l) {
            if (l.search) {
                var q = {};
                l.search.slice(1).split('&').forEach(function (v) {
                    var a = v.split('=');
                    q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
                });
                if (q.p !== undefined) {
                    window.history.replaceState(null, null,
                        l.pathname.slice(0, -1) + (q.p || '') +
                        (q.q ? ('?' + q.q) : '') +
                        l.hash
                    );
                }
            }
        }(window.location))
    </script>
    <!-- End Single Page Apps for GitHub Pages -->
</head>
```

## 調整預設根網址

如果使用 GitHub Pages 所提供的網址來瀏覽了話，會有類似虛擬目錄的概念在處理各個 GitHub 專案的網站，例如現在這個範例，網址會是 `https://poychang.github.io/BlazorAppOnGitHubPages/`。

而我們目前專案中的 `index.html` 中，因為在 `head` 區塊中有設定 `<base href="/" />`，使用網址根目錄來作為網站的根目錄，這樣會造成連結找不到正確的資源位置，因此我們必須改成 `<base href="/BlazorAppOnGitHubPages/" />`，告訴他正確的根目錄在哪裡，否則你應該會在瀏覽器的 Console 中看到很多以下的錯誤訊息：

```log
Failed to load resource: the server responded with a status of 404 ()
```

當然，如果你有在 GitHub Pages 上使用自訂網址了話，這部分可以略過。

## 調整 Jekyll 設定

由於 GitHub Pages 背後是使用 Jekyll 來處理網站，因為 Jekyll 會忽略底線開頭的資料夾，這會造成網站會找不到 `_framework/blazor.webassembly.js` 檔案，而在瀏覽器的 Console 中看到類似以下的錯誤訊息：

```
GET https://poychang.github.io/BlazorAppOnGitHubPages/_framework/blazor.webassembly.js net::ERR_ABORTED 404
```

解法很簡單，只需要在專案中的 `wwwroot` 資料夾下新增 `.nojekyll` 這個檔案，而檔案內容保留空白即可避免這個問題。

## 建置與部署

到這裡就差不多了，接下來就只是把 Blazor App 建置一下並發行出來。

如果你是透過 Visual Studio 發行到資料夾了話，你會看到一個 `wwwroot` 資料夾，和一個 `web.config` 檔案，這裡我們只需要將 `wwwroot` 資料夾內的檔案，複製到 `docs` 資料夾中（或是你的 `gh-pages` 分支），再提交到 GitHub 上就可以了。

當然 GitHub 上的 GitHub Pages 相關設定，你也要去設定一下。

![Demo 網站](https://i.imgur.com/L4gVYNn.png)

你可以到這裡 [https://poychang.github.io/BlazorAppOnGitHubPages/](https://poychang.github.io/BlazorAppOnGitHubPages/) 玩玩看 Blazor WebAssembly on GitHub Pages 的效果。

>本篇完整範例程式碼請參考 [poychang/BlazorAppOnGitHubPages](https://github.com/poychang/BlazorAppOnGitHubPages)。

## 後記

Blazor WebAssembly App 可以把很多原本後端做才方便的事情搬到前端來處理，或是把 .NET 後端好用的套件移到前端來使用，例如我想用 [VersOne.Epub](https://github.com/vers-one/EpubReader) 這個 NuGet 套件來讀取 EPub 檔案，然後把內容顯示在網頁上，甚至用 Microsoft Edge 中超棒的 Read Aloud 功能，把電子書便有聲書，這樣複雜的功能情就，我就用這樣的技術來處理，想試試看效果的，可以到 [Epub Read Aloud](https://poychang.github.io/EpubReadAloud/) 這個網站來玩玩看。

當然，這個網站只是簡單玩一下，裡面有很多非這篇文章的 bug。

----------

參考資料：

* [MS Docs - 裝載和部署 ASP.NET Core Blazor WebAssembly](https://docs.microsoft.com/zh-tw/aspnet/core/blazor/host-and-deploy/webassembly?WT.mc_id=DT-MVP-5003022)
* [Github Pages 裝載和部署 ASP.NET Core Blazor WebAssembly](https://dotblogs.azurewebsites.net/jakeuj/2021/04/09/BlazorWebAssemblyGithubPages)
