---
layout: post
title: 如何開啟 Microsoft Edge 的 IE Mode
date: 2019-07-17 12:56
author: Poy Chang
comments: true
categories: [Tools]
permalink: enable-ie-mode-microsoft-edge/
---

相信還有很多企業內部的網頁應用程式還是只能用 IE 來開啟使用，針對這點 Microsoft Edge (Chromium) 有提供 IE Mode，讓你可以在 Microsoft Edge 中使用 IE 開啟 IE Only 的網頁，而不脫離整個瀏覽器介面，對於不想要在多個應用程式切換來切換去的使用者來說，相當便利。

>2020/02/01 更多關於以 IE Mode 使用 Microsoft Edge 請參考這份[官方文件](https://docs.microsoft.com/zh-tw/deployedge/edge-ie-mode)。

想要體驗 IE Mode 功能，首先你需要 Microsoft Edge 瀏覽器，而且必須是 77.0.211.1 以上版本，可以到[這裡](https://www.microsoftedgeinsider.com/en-us/)下載安裝 Dev 或 Canary 頻道的版本。

## 啟動 IE Mode 設定

啟動 IE Mode 的方式請參考下列步驟：

1. 在 Microsoft Ede 的網址列上輸入 `edge://flags/` 開啟實驗功能設定頁面
2. 搜尋 `#edge-internet-explorer-integration` 關鍵字，選擇 `Enable IE Integration` 請設定成 `IE Mode`
  ![在實驗功能設定頁面中搜尋 #edge-internet-explorer-integration 關鍵字](https://i.imgur.com/5ixGMt3.png)
3. 另外兩個選項 `Enable enhanced hang resistance for IE Integration` 和 `Enable IE window hang resistance for IE Integration` 也可以順便啟用，增強 IE Mode 的啟動
4. 重新啟動 Microsoft Edge 瀏覽器
5. 修改 Microsoft Edge 瀏覽器的捷徑，在路徑後面加上 `--ie-mode-test`
6. 瀏覽器選項的 `更多工具` 就會有 `在 Internet Explorer 模式中開啟網站`

## 使用 IE Mode

設定完成之後，可以在 Microsoft Edge 的設定選單的 `More tools` 中，點選 `Open sites in Internet Explorer mode` 來用 IE 開啟當前頁面。

![啟動 IE Mode 的方式](https://i.imgur.com/VsX7Woy.png)

使用 IE Mode 開啟網頁會有幾點特徵，第一個是網址列左側你會看到一個傳統 IE 的圖示，代表當前頁面是透過 IE 來渲染開啟的。

第二個是你在頁面上按滑鼠右鍵，會看到傳統的 IE 網頁選項，但目前的功能尚不齊全，例如沒有開發者工具可以使用，也沒有 IE 細部的設定。

![使用 IE Mode 開啟網頁](https://i.imgur.com/LUHaUq6.png)

當然這還在實驗階段，許多功能沒有是很正常的，但在可以已預見的未來，Microsoft Edge 可以將 IE 包裡面，讓終端使用者能稍微無縫的切換到現代化的瀏覽器，體驗自然會好些。

對於開發人員來說，能一步步的誘導使用者習慣使用現代化瀏覽器，絕對能夠讓開發網頁的道路變得更平穩。

----------

參考資料：

* [How to enable IE Mode on Microsoft Edge Chromium](https://pureinfotech.com/enable-ie-mode-microsoft-edge-chromium/)
* [Microsoft Edge Chromium Receives Full Featured IE Mode](https://winaero.com/blog/microsoft-edge-chromium-receives-full-featured-ie-mode/)
* [以 IE 模式使用 Microsoft Edge](https://docs.microsoft.com/zh-tw/deployedge/edge-ie-mode)
* [開啟 Microsoft Edge 內建 IE Mode，使用 Internet Explorer 模式開啟網頁](https://free.com.tw/microsoft-edge-ie-mode/)
