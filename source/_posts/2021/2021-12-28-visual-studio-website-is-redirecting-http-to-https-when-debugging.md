---
layout: post
title: 開發網站時被 HSTS 強制轉至 HTTPS 造成無法啟動開發中網站
date: 2021-12-28 17:28
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: visual-studio-website-is-redirecting-http-to-https-when-debugging/
---

瀏覽器越來越重視安全性，現在大多數的瀏覽器會盡可能的將 HTTP 網站導向到 HTTPS，甚至提供 HTTPS-Only 模式，讓使用者在造訪不支援 HTTPS 網站時跳出示警訊。注重安全是理所當然的，但在開發一些封閉環境，或是舊專案的時候，可就沒有 HTTPS 了，這也間接造成開發的困擾，開發過程中無法啟動網站，這要怎麼開發呢？

如果你有使用 Visual Studio 來建立過 ASP.NET Core 的專案，應該不難注意到有個選項叫做 HSTS，讓你的開發中網站也可以啟用 HTTPS。

>HSTS 是 HTTP 強制安全傳輸技術 (HTTP Strict Transport Security) 是一套網際網路安全策略機制，網站可以選擇使用 HSTS 策略，來讓瀏覽器強制使用 HTTPS 與網站進行通訊。

不過有些專案可能就無法套用這設定了。

假設我們開發中的網站專案會使用 http://localhost:5000 這個網址，這時因為新版的 Chrome 或 Microsoft Edge 會盡可能將網站導向到 HTTPS，這就造成開啟 http://localhost:5000 的時候，瀏覽器會把你導向到 https://localhost:5000，然而啟動這個網站的服務沒有 SSL，然後就無法正確開啟網站，你可能就會看到像下圖這樣：

![無法正確開啟 HTTPS 的開發中網站](https://i.imgur.com/sszsSeQ.png)

這時我們可以透過修改瀏覽器的設定來避免這個問題，處理方式如下：

1. 開啟 Chrome 或 Microsoft Edge 瀏覽器
2. 網址列輸入以下網址開啟 HSTS/PKP 設定
   * chrome://net-internals/#hsts
   * edge://net-internals/#hsts
3. 在最下方的 `Delete domain security policies` 中，輸入 `localhost` 網域，再按下 `Delete` 按鈕

![設定瀏覽器 HSTS 的設定頁面](https://i.imgur.com/Odq4Jux.png)

如此一來，這個強制轉到 HTTPS 的安全性設定，就不會套用在 localhost 的網站了。

如果有需要加回去了話，在 `Add HSTS domain` 這個選項中，輸入 `localhost` 重新加入即可。接著可以在 `Query HSTS/PKP domain` 查詢看看是否找到指定網域的設定。

## 後記

如果專案有設定 HSTS 了話（現在 Visual Studio 建立新專案時都會問），讓我們在開發時期也可以用 https 瀏覽網頁，就不會出現上述的問題。

----------

參考資料：

* [Visual Studio website is redirecting http to https when debugging](https://stackoverflow.com/questions/26501670/visual-studio-website-is-redirecting-http-to-https-when-debugging)
* [移除 Chrome HSTS 的網域清單](https://yungke.me/clear-google-chrome-hsts/)
