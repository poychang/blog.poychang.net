---
layout: post
title: Cordova 取得相機使用權限
date: 2016-08-11 10:24
author: Poy Chang
comments: true
categories: [App, Tools]
permalink: cordova-camera-authorization/
---

想要讓 Cordova App 具有掃描 QR Code 的功能，簡單！加入 [phonegap/phonegap-plugin-barcodescanner](https://github.com/phonegap/phonegap-plugin-barcodescanner) 套件，照著套件的使用說明，寫個[幾行程式碼](#code-1)就搞定了，輕鬆寫意。只是部署到 Android 然後要使用相機功能時，出現了這個畫面...

![相機出現問題](http://i.imgur.com/RivLKnr.png)

>很抱歉，相機出現問題。您可能需要重新啟動設備。

但其實這個狀況不是相機出問題，你也不需要重新啟動設備，而是需要在該應用程式中，開啟對相機的使用授權即可。

如果你的裝置是 Android 4.x 版的時候，還不會遇到這問題，而從 Android 5.x 開始，系統對原生裝置的授權變的重視，因此如果你沒有取得裝置使用者授權，是無法啟用如相機、麥克風等功能的。

好加在有個套件在處理這件事，讓取得授權變得更友善，透過 [dpa99c/cordova-diagnostic-plugin](https://github.com/dpa99c/cordova-diagnostic-plugin) 套件，可以讓你在程式碼中判斷何時要詢問使用者，是否給予授權，照著套件的使用說明，寫個[幾行程式碼](#code-2)就搞定了，一切海闊天空。

## 同場加映

最近終於拿到一台堪用的 Android 裝置，可以直接部屬程式碼到該手機，不用再封裝成 apk 然後請求同事幫忙測試。

只是初次使用 Android 手機，卻找不到「開發人員選項」有點尷尬，才發現要開啟這功能，是需要一些密技的，而且各家廠商有些許的不同，這裡紀錄兩大廠 HTC、SAMSUNG 如何開啟 Android 開發人員選項的方法（對！在我心中台灣的 HTC 還是大廠）：

HTC：`設定` > `關於` > `軟體資訊` > `更多` > `建置號碼`，然後對 `建置號碼` 一直點擊它開發人員選項就會出現了

SAMSUNG：`設定` > `關於裝置` > `版本號碼`，然後對 `版本號碼` 一直點擊它開發人員選項就會出現了

最後要使用 Visual Studio 直接部署至裝置了話，要記得開啟開發人員選項中的 `USB偵錯` 選項。

----------

## code-1

```javascript
cordova.plugins.barcodeScanner.scan(
  function (result) {
      alert("We got a barcode\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);
  }, 
  function (error) {
      alert("Scanning failed: " + error);
  }
);
```

## code-2

```javascript
cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
    console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
}, function (error) {
    console.error(error);
});
```

----------

參考資料：

* [Problem with Android 6.0.1 #139](https://github.com/phonegap/phonegap-plugin-barcodescanner/issues/139)
* [Requesting Permissions at Run Time](https://developer.android.com/training/permissions/requesting.html)
