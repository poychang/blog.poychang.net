---
layout: post
title: 使用 Ngrok 快速 Demo 本機開發中的網站專案
date: 2017-10-26 12:59
author: Poy Chang
comments: true
categories: [Tools]
permalink: use-ngrok-demo-local-development/
---
專案的進程中，時常需要和使用單位討論進度或介面，使用截圖的方式溝通稍嫌沒有效率，而且無法讓使用單位體驗操作方式，除了將開發中的網站專案架在測試站台外，可以利用 [Ngrok](https://ngrok.com/) 直接 Demo 本機 localhost 運行的網站。

![Demo](https://i.imgur.com/wpgVYu4.png)

[Ngrok](https://ngrok.com/) 的核心概念是做為一個轉發伺服器，將外界的請求轉發到你本機指定的 port。

## 安裝

從官方網站[下載](https://ngrok.com/download)符合你環境的壓縮檔，解壓縮後即可使用。

以 Windows 為例，個人為了執行指令方便，會將解壓縮後的執行檔放在一個存放工具的資料夾，例如 `D:\Tools\Ngrok` 底下，再修改環境變數 `Path`，加入該路徑，這樣我就可以在專案資料夾下輕鬆地執行 `ngrok` 命令。

## 基本使用

基本使用方式很簡單，在本機執行下列指令：

```
ngrok http 53885
```

`53885` 為你本機要開放的 Port，此時會產生一組隨機的網址，對應到你本機的位置，如下圖的 `http://dac311d2.ngrok.io -> localhost:53885`，這時我們就可以將 `http://dac311d2.ngrok.io` 給使用單位，當使用單位對該網址發出請求時，Ngrok 就會將這些請求轉發到你的電腦，是不是很方便呢。

![執行命令後的訊息](https://i.imgur.com/ThtooLz.png)

除了看終端機所呈現的訊息外，ngrok 還提供儀表板來列出當前的連線請求，一目了然。

![連線請求儀表板](https://i.imgur.com/ipqM7pt.png)

另外，如果你只想讓該網站給有權限的人看，ngrok 有提供密碼驗證功能，這需要先[註冊 ngrok 的會員](https://dashboard.ngrok.com/user/login)。

註冊完成後，可以在網站的後台找到你的連線 token，再使用以下指令於設定本機的 ngrok：

```
ngrok authtoken [YOUR_TOKEN]
```

設定完成後即可使用 auth 參數，設定帳號密碼：

```
ngrok http -auth "[YOUR_ACCOUNT]:[YOUR_PASSWORD]" [YOUR_PORT]
```

如此一來，沒有帳號密碼的人就無法連到該測試網站了。

## 注意事項

Ngrok 免費方案有些限制：

* HTTP/TCP 通道只能建立隨機的 URL
* 一台電腦只能開啟一個 ngrok
* 每個 ngrok 只能建立 4 個通道
* 每分鐘最多 40 個連線

以 Demo 來說，免費版相當夠用，詳細的限制和價格方案請看[這裡](https://ngrok.com/pricing)。

[Ngrok](https://ngrok.com/) 真是個網站開發者必備的神器呀！

----------

參考資料：

* [Ngrok Docs](https://ngrok.com/docs)
* [Connect your local development server to the Nexmo API using an ngrok tunnel](https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr/)
* [Ngrok – 讓本機也可以開發 webhook 免部署環境的神器](https://coder.tw/?p=7211)
