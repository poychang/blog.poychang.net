---
layout: post
title: 安裝並自動接受 Android SDK 授權
date: 2016-11-05 11:30
author: Poy Chang
comments: true
categories: [App]
permalink: android-accept-agreements/
---

在將 Cordova 專案的 CLI 工具從 6.0 生到 6.4 的時候發生了「授權」問題，在偉大的 stackoverflow 中找到了快速解法，筆記一下。

將 Cordova CLI 工具升級很簡單，只要將 `taco.json` （我用 Visual Studio 的 [TACO](https://taco.visualstudio.com/) 專案來開發）中對應的版本號改一下，改成 `"cordova-cli": "6.4.0"`基本上就 OK 了，下次編譯的時候會改用新的版本去執行，當然前提是你的環境有先將 cordova 升級成這個版本。

我在升級後做編譯時，吐出了這樣的訊息：

![](http://i.imgur.com/KRga5j5.png)

以下為部分文字內容，方便之後搜尋可以蒐的到。

```
You have not accepted the license agreements of the following SDK components:
[Android SDK Platform 24].
Before building your project, you need to accept the license agreements and complete the installation of the missing components using the Android Studio SDK Manager.
Alternatively, to learn how to transfer the license agreements from one workstation to another, go to http://d.android.com/r/studio-ui/export-licenses.html
```

這訊息簡單說就是少安裝 Android SDK Platform 24 並接受授權所造成的，有個超方便的解法，就是直接在命令提示字元中執行下列指令：

```
android update sdk --no-ui --filter build-tools-24.0.0,android-24,extra-android-m2repository
```

這樣就會更新你 Android SDK 並自動接受授權了，輕鬆升上 Android SDK Platform 24。

----------

參考資料：

* [Automatically accept all SDK licences](http://stackoverflow.com/questions/38096225/automatically-accept-all-sdk-licences)
