---
layout: post
title: Android App 上架前的準備動作
date: 2016-06-09 17:46
author: Poy Chang
comments: true
categories: [App, Tools]
permalink: android-app-google-play/
---

Android 的上架動作其實很簡單，相關資料打一打，分級問卷寫一寫就差不多了，只是封裝好的 APK 需要做一些處理，才能上傳成功。

因為我是開發 Cordova 專案，因此我沒有裝 [Android Studio](https://developer.android.com/studio/index.html) 開發工具，但一定會裝 JDK 和 Android SDK，所以可以透過指令來完成許多必要的動作，接下來就說明一下，用指令來完成 APK 上架前的準備動作。

## 產生憑證

相較之下 Android 的憑證處理真的簡單多了，可以透過 JDK 的 `keytool` 來產生所需的憑證檔，指令如下：

```bash
keytool -genkey -v -keystore AppName.keystore -alias AppAliasName -keyalg RSA -validity 10000
```

上述指令有兩個地方需要修改：

* `AppName.keystore` 憑證檔名，AppName 可以改成你的專案名稱
* `AppAliasName` App 的別名

執行的過程中，會需要輸入一些資訊，例如個人名稱和組織名稱等，可以參考下圖。

![keytool process](http://i.imgur.com/Gc9tlnW.png)

**注意！此憑證要妥善收藏！**一旦使用該憑證做完 APK 的簽署及上架，之後要做更新架上的 App 時，都要使用同一個憑證簽署後的 APK 才能順利上傳，否則只能砍掉重練了。

## 簽署 APK

執行 `cordova build android --release` 會在專案資料夾下的 `\AppName\platforms\android\build\outputs\apk` 位置，產生一個 `android-release-unsigned.apk` 檔，這是未簽署的 APK 封裝檔，這時候我們可以移至該資料夾下，並透過 JDK 的 `jarsigner` 來進行簽署，指令如下：

```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore AppName.keystore android-release-unsigned.apk AppAliasName
```

上述指令有三個地方需要修改：

* `AppName.keystore` 憑證檔的位置及檔名
* `android-release-unsigned.apk` 要簽署的 APK 檔，預設是這個，但你有可能改成其他名稱
* `AppAliasName` App 的別名，和上一個步驟的名稱是一樣

**注意！憑證要妥善收藏！**一旦使用該憑證做完 APK 的簽署及上架，之後要做更新架上的 App 時，都要使用同一個憑證簽署後的 APK 才能順利上傳，否則只能砍掉重練了。

## 優化 APK

Android 的 SDK 中包含了一個用於優化 APK 的工具 [zipalign](https://developer.android.com/studio/command-line/zipalign.html)。此工具主要的目的是為了使未壓縮的數據相對文件起始處有一個固定的偏移，使 APK 中所有未壓縮的數據均按照 4 bytes 對齊，提升執行效率。

只要有安裝 Android SDK，你可以在安裝的目錄下找到這個工具（我的 Windows 的路徑為：`C:\Program Files (x86)\Android\android-sdk\build-tools\23.0.2`）。

為了讓打指令的時候，可以打少一點字，可以將此路徑加入系統的環境變數中。

![環境變數加入 zipalign.exe 位置](http://i.imgur.com/xjbYufj.png)

如此一來就可以透過下列指令來進行優化：

```bash
zipalign -v 4 android-release-unsigned.apk AppName.apk
```

上述指令有兩個地方需要修改：

* `android-release-unsigned.apk` 要簽署的 APK 檔，預設是這個，但你有可能改成其他名稱
* `AppName.apk` 輸出的檔案名稱

## 準備收工

`AppName.apk` 就是我們最後須要的檔案了，接下來就可以到 [Google Play Developer Console](https://play.google.com/apps/publish/) 去上傳簽署 + 優化過的 APK 了。

## 後記

如果你在執行**簽署 APK**時，最後出現下圖警告：

![timestamp warning](http://i.imgur.com/yMFyKHs.png)

`No -tsa or -tsacert is provided and this jar is not timestamped.` 這訊息主要是因為 JAVA 7 以後，在簽署時增加了 `timestamp` 的檢查，所以需要增加 `tsa` 參數，以下提供兩家可以使用的 `timestamp` 服務網站：

1. http://timestamp.digicert.com
2. http://tsa.starfieldtech.com

再將指令改成如下，就不會有警告了。

```bash
jarsigner  -tsa http://timestamp.digicert.com -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore AppName.keystore android-release-unsigned.apk AppAliasName
```

----------

參考資料：

* [Inoic: Publishing your app](http://ionicframework.com/docs/guide/publishing.html)
* [-tsa or -tsacert timestamp for applet jar self-signed](http://stackoverflow.com/questions/21695520/tsa-or-tsacert-timestamp-for-applet-jar-self-signed)
