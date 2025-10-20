---
layout: post
title: 使用 remotebuild 遠端建置 iOS App
date: 2016-05-13 16:02
author: Poy Chang
comments: true
categories: [App]
permalink: remotebuild-hook-failed-with-error-code-127/
---

利用 Visual Studio + Cordova 開發跨平台的 App，可以利用 [remotebuild](http://taco.tools/docs/remote-build.html) 來達成不離開 Visual Studio 又可以測試 iOS App 的開發環境。

使用 remotebuild 的先決條件：你必須要有一台 Mac（真希望之後可以不用...），再來 Mac 須符合下列環境需求及安裝相關工具。

1. 作業系統需 Mac OS X Mavericks 10.9 以上版本
2. 安裝 Xcode 6 以上版本
3. 安裝 Xcode command-line tools，可透過終端機，執行 `xcode-select --install` 進行線上安裝
4. 安裝 [Node.js](https://nodejs.org/en/)
5. Git command line tools, if you are using a CLI from a Git repository. If the CLI version is pointed to a Git location, Git is required to build the app for iOS.

具備上述條件後，接下來就是要在 Mac 上安裝並啟動 remotebuild

```bash
# 透過 npm 安裝 remotebuild 套件
sudo npm install -g remotebuild
# 啟動，預設使用安全模式
remotebuild
# 使用非安全模式（HTTP 傳輸）啟動
remotebuild --secure false
```

啟動後會出現下列訊息，我們要把**主機**、**連接埠**、**安全性 PIN 碼**記下來，之後要設定在 Visual Studio 中。

![啟動 remotebuild](http://i.imgur.com/dHjCuAD.jpg)

接著在 Visual Studio 的「工具 > 選項 > Apache Cordova 工具」中設定對應的設定值。

![Apache Cordova 工具設定](http://i.imgur.com/ltw4wXG.png)

接者在偵錯前，先選好要佈署的平台模擬器或裝置。

![選擇偵錯的平台及模擬器](http://i.imgur.com/I3Qx5LO.png)

這樣就大功告成了，可以讓我們在開發時，盡量減少切換裝置去開發的動作，但是目前為止，如果你要封裝 iOS ipa 檔了話，你還是需要開啟 Xcode 去做封裝。

## 成功前的小插曲

一開始在使用 remotebuild 的時候，一直無法成功編譯，出現 `Error: Hook failed with error code 127: /hooks/after_prepare/010_add_platform_class.js` 的錯誤訊息，這是因為 010_add_platform_class.js 在一些尚不知名的原因，會在換行的地方出現 `^M`，造成編譯錯誤。

解法如下：

```bash
# 檢查檔案中，結尾是否有 ^M
cat -v 010_add_platform_class.js
# 修正檔案
tr -d '\r' < 010_add_platform_class.js > 010_add_platform_class.js.fix
# 檢查修正後的檔案內容
cat -v 010_add_platform_class.js.fix
# 蓋調原本的檔案
mv 010_add_platform_class.js.fix  010_add_platform_class.js
```

----------

參考資料：

* [Remote Build](http://taco.tools/docs/remote-build.html)
* [Error: Hook failed with error code 127](https://forum.ionicframework.com/t/error-hook-failed-with-error-code-127/12236)
* [在 iOS 上執行 Apache Cordova 應用程式](https://msdn.microsoft.com/zh-tw/library/dn757056.aspx)
