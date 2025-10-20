---
layout: post
title: 使用 Crosswalk 統一 WebView 的表現
date: 2016-12-22 10:56
author: Poy Chang
comments: true
categories: [App, Develop, Tools]
permalink: crosswalk-cordova/
---

開發 Hybird App 時，不同版本的 Android 有著不同的 WebView 實作，造成同一組 JavaScript 或 CSS 有著不同的表現，尤其是 CSS 屬性支援的差異，造成介面不容易控制，有這種困擾的時候，[Crosswalk](https://crosswalk-project.org/) 的出現，頓時讓生命美好了。

## Crosswalk 解決了什麼？

[Crosswalk](https://crosswalk-project.org/) 來自於 Intel Open Source Technology Center，致力於開源項目的組織，他在官網裡寫到一句話：

>沒有開發者希望**老舊過時的設備**阻止他們使用最新最酷的 API

這個感覺就像是當年 IE 市占率還很高的時代，很多好用的 API 因為 IE 不支援只能大嘆 IE 不長進，因此讓網站開發人員的生命蒙上了一層灰，也因此誕生了很多 IE 的 polyfills，例如：[HTML5 Shim](https://github.com/aFarkas/html5shiv)、[Selectivizr](http://selectivizr.com/) 等等。

Crosswalk 要解決的就是這 API 不一至的環境，讓各種版本的 WebView 有一致表現。

## 怎麼做到的？

要了解 Crosswalk 是怎麼達成的，看一下這 3 分鐘的影片，非常的清楚。

<iframe width="560" height="315" src="https://www.youtube.com/embed/GtyI4Jg6xD8" frameborder="0" allowfullscreen></iframe>

影片中所介紹的使用流程如下：

![Using the Crosswalk webview plugin](http://i.imgur.com/J4GQmlj.png)

簡單來說，Crosswalk 是使用最新版本的 Google Chromium 來實作 web runtime，來替代既有的裝置內建的 WebView，使開發者能使用最新的 Web 技術和 API，例如：WebRTC、WebGL、CSS feature queries、Current Flexbox、WOFF web fonts 等。

## 在 Cordava 專案上要怎麼做？

目標平台至少要是 iOS 8+ 或 Anriod 4.0+ 的平台。

在官方網站有很清楚的 [Android 操作流程](https://crosswalk-project.org/documentation/cordova.html)。

首先要先確認 Cordova CLI 的版本是 5.0 以上，安裝的 Cordova Android platform 是 4.0 以上，然後在專案目錄下安裝 Crosswalk 套件即可，指令如下：

```
$ cordova plugin add cordova-plugin-crosswalk-webview
```

這樣之後在執行 `cordova build android` 編譯專案時，會自動下載穩定版的 Crosswalk WebView libraries 並封裝進 apk 中，且會有兩個版本：

* `android-armv7-debug.apk` 提供給 ARM 處理器的設備 
* `android-x86-debug.apk` 提供給 x86 處理器的設備（例如 Intel 的處理器)

## 有缺點嗎？

這麼優秀的工具，當然...也是有缺點 XD。

因為 Crosswalk 取代了裝置上原生的 WebView，也就表示他必須實作一個新的 WebView 給你的 Hybird App 來使用，所以使用 Crosswalk 最大的缺點就是，你的 **App 會因此肥了 15~20MB**，是胖滿多的。

Crosswalk 團隊也知道這是個問題，因此推出了 [Crosswalk Lite](https://crosswalk-project.org/documentation/crosswalk_lite.html) 版本，縮減了將近一半的空間，當然這也取消了不少功能，例如：WebRTC、WebDatabase 等，詳請[見此清單](https://crosswalk-project.org/documentation/crosswalk_lite/lite_disabled_feature_list.html)。

如果這點空間對你的 App 來說不是甚麼缺點，或著老闆覺得這不是問題，那這個好物，的確是可以省了不少麻煩事。

----------

參考資料：

* [Crosswalk Project](https://crosswalk-project.org/index_zh.html)
* [Crosswalk with Cordova 4.0](https://crosswalk-project.org/documentation/cordova.html)
