---
layout: post
title: 使用 GitHub Pages 打造簡易短網址系統
date: 2020-04-04 00:01
author: Poy Chang
comments: true
categories: [Javascript, App, Azure]
permalink: how-to-use-github-pages-build-a-short-url-app/
---

短網址的優點顯而易見，可以適用於很多種情境，例如線上會議的連結（通常這連結都很長），我們可以透過自訂短網址名稱，讓原本無意義的網址，變成容易辨識用途的名稱，各大短網址服務都有提供類似的功能，但缺點就是若要使用自己的網域名稱來建立短網址了話，都需要額外的費用，這篇將介紹如何利用 GitHub Pages 搭配自己的網域，打造出簡易的短網址服務，而且自帶 HTTPS 之外還免費！

## 設定 GitHub Pages

[GitHub Pages](https://pages.github.com/) 真是個佛心的服務，讓我們可以輕鬆架設靜態網頁，甚至可以使用 [Jekyll](https://jekyllrb.com/) 靜態網頁產生器來製作，而你只要有 [GitHub](https://github.com/) 帳號，像是我的 GitHub 帳號是 `poychang`，我就有一個名為 `poychang.github.io` 的 GitHub Pages 網址可以用，而這個網址背後的網頁內容，就會去抓你在 GitHub 上建立名為 `poychang.github.io` 的 Repository 內容。

但是 GitHub Pages 不僅僅如此，其實你在任一個 Repository 都可以使用 GitHub Pages 的服務，例如我建立了一個 `s.poychang.net` 的 Repository，我就可以在設定裡面設定靜態網頁是從下面三個選項中的哪一個，來建立 GitHub Pages：

1. `gh-pages` 分支
2. `master` 分支下的 `docs` 資料夾
3. `master` 分支

設定位置如下圖，在 `settings` 頁籤中的 GitHub Pages 段落，可以設定靜態網頁的 `Source` 檔案來源，我這裡是選擇 `master` 分支，並且設定 `Custom Domain` 自訂網域為 `s.poychang.net`，然後勾選 `Enforce HTTPS` 強制使用加密的 HTTPS 協定：

![設定 GitHub Pages 的檔案位置](https://i.imgur.com/Uwd7vFT.png)

這邊我們就解決了自訂網域以及 HTTPS 安全加密連線的問題，接著我們再來看看，我們如何使用靜態網頁實作短網址服務。

>關於使用 GitHub Pages 架設網站的完整的教學請參考 [Creating a GitHub Pages site 官方教學文件](https://help.github.com/en/github/working-with-github-pages/creating-a-github-pages-site)。

## 基於 JavaScript 的短網址服務

我們常見的短網址格式會像是這樣：`https://domain.name/short-url`，然後短網址系統會使用 `short-url` 這組關鍵字去找他背後是要轉跳到哪個網頁去，接著做轉址的動作。

但當我們用同樣的方式來瀏覽 GitHub Pages 的時候，他的行為會是去找 `short-url` 資料夾下的 `index.html` 檔，這時就會因為找不到網頁而顯示下面這 GitHub Pages 標準的 404 畫面。

![GitHub Pages 404 page](https://i.imgur.com/gukeByV.png)

這個 404 畫面是可以被自訂的，只要你在該 Repository 底下建立 `404.html` 檔案，當要顯示 404 畫面時，GitHub Pages 就會使用這個檔案，而我們就是要利用 GitHub Page 找不到檔案時，會轉到 `404.html` 這個特性，再搭配一點點的 JavaScript 來實現 URL Rewrite 的機制，進而表現出短網址服務的行為。

在 `404.html` 裡面只有簡單的 HTML 結構，然後在 `head` 執行一段 JavaScript，我們直接從程式碼看看我們做了什麼事：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Short URL App</title>
    <script type="text/javascript">
        // 使用 IIFE 模式立即調用裡面的 JavaScript 程式碼
        (function () {
            // 使用 fetch API 來取得 routes.json 短網址對照表
            // 請注意 fetch 不支援 IE 瀏覽器，若你想要有更好的相容性，請改用 XMLHttpRequest
            fetch('routes.json')
                .then(response => response.json())
                .then(routes => {
                    // 取出當前網址中，最後一個 / 之後的值
                    // 以上面的範例來說，就會取道 short-url 這個值
                    var fragment = location.pathname.split('/').pop();
                    // 從 routes.json 中找到該關鍵字所對應到的網址
                    var url = routes[fragment];
                    // 若該關鍵字有設定對應的網址，則轉跳到該網址中，若沒有則回到首頁
                    location.href = url ? url : './index.html';
                });
        })();
    </script>
</head>
</html>
```

除了 `404.html` 外，從上面的程式碼可以知道，還有另一個很重要的短網址對照表 `routes.json`，這就只是個簡單的 key-value JSON 檔：

```json
{
    "s4": "https://study4.tw",
    "PoyChang": "https://blog.poychang.net"
}
```

透過 [JSON Schema 建議的標準特性](https://json-schema.org/understanding-json-schema/reference/object.html#property-names)，我們可以讓短網址關鍵字達成以下目標：

1. 鍵值必須唯一
2. 鍵值區分大小寫
3. 第一個字符必須是英文字母、`_` 底線
4. 隨後的字符可以是英文字母、`_` 底線

但其實 JSON 的鍵值只要是字串就可以了（詳請參考[ECMA-404 JSON 標準](https://www.json.org/json-en.html#spec)），所以可使用的短網址格式限制是很寬鬆的。

透過上面的 `routes.json`，我們就可以提供 2 個短網址服務，分別是：

1. `https://domain.name/s4`
2. `https://domain.name/PoyChang`

## GitHub Pages 自訂網址

這裡補充一下，要如何設定 GitHub Pages 自訂網址。

除了上面在 GitHub 的 Repository 設定外，在你網域的 DNS 中，有需要設定一組 CNAME 紀錄，並將該 CNAME 紀錄設定為你 GitHub Pages 的網址，以我來說，就會是 `poychang.github.io` 這個網址，下面我用在 [Azure DNS](https://azure.microsoft.com/zh-tw/services/dns/) 的設定畫面當範例：

![在 Azure DNS 上設定 GitHub Pages 自訂網域所需要的 CNAME 紀錄](https://i.imgur.com/vPboUi8.png)

>本篇完整範例程式碼請參考 [poychang/short-url-github-page](https://github.com/poychang/short-url-github-page)。

## 後記

這篇的起源來自於 [Andrew 大神](https://columns.chicken-house.net/)的 **Short URL as Code** 這句話，藉由 GitHub Pages 的服務來打造短網址服務，並使用 Git 來管理短網址對照表，用寫程式碼的方式來維護短網址服務，實做起來還真的蠻有趣的 😀

----------

參考資料：

* [URL rewriting with Github Pages](https://lea.verou.me/2016/11/url-rewriting-with-github-pages/)
* [Managing a custom domain for your GitHub Pages site - Configuring a subdomain](https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain)
