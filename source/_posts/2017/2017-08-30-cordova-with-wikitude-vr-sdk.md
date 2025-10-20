---
layout: post
title: 實作 Wikitude AR SDK 的 Cordova 範例 App
date: 2017-08-30 21:57
author: Poy Chang
comments: true
categories: [App]
permalink: cordova-with-wikitude-vr-sdk/
---
近年來 VR 話題不斷，從 Apple 的 ARKit 到 Google 最近推出的 ARCore，甚至傳統的 AR SDK 廠商 Vuforia 和 Wikitude 也不斷的增強其開發工具，這都意味著 AR 的開發一直被注目。而最近有機會去研究 AR 在 Cordova 上面的實作與應用，這篇主要是建置 Wikitude 範例 App 的筆記。

>因為目前只有 Wikitude 有推出 Cordova AR SDK 的套件，所以就從此開始著手研究。

![Architecture of the Wikitude SDK](http://i.imgur.com/oJZgkol.png)

[Wikitude](http://www.wikitude.com) 是個付費的開發 AR 解決方案，從上圖可知，其 SDK 除了提供給原生 App 使用外，還有提供 Cordova Plugin，讓 Hybrid App 也能使用，是個相當完整的 SDK。 

>主要的參考資源為 [Wikitude Cordova Plugin 官方教學文件](https://www.wikitude.com/external/doc/documentation/latest/phonegap/)。

Wikitude 文件中提供了 4 種設定情境，其中有一個情境(下述第 3 項)很貼心的把常用的 AR 功能做成一個範例 App，並且放在 Github 上供大家測試，這篇就是用此範例專案做實作。

1. [從空白專案開始建立](https://www.wikitude.com/external/doc/documentation/latest/phonegap/setupguidecordovacli.html#PhoneGapEmptyApp)
2. [使用既有專案做設定](https://www.wikitude.com/external/doc/documentation/latest/phonegap/setupguidecordovacli.html#PhoneGapExistingApp)
3. [使用範例專案](https://www.wikitude.com/external/doc/documentation/latest/phonegap/setupguidecordovacli.html#PhoneGapSampleApp)
4. [使用 Wikitude Plugin](https://www.wikitude.com/external/doc/documentation/latest/phonegap/setupguidecordovacli.html#UsingTheWikitudePlugin)

## 建立專案

首先先至 GitHub 下載 [Wikitude/wikitude-cordova-plugin-samples](https://github.com/Wikitude/wikitude-cordova-plugin-samples) 專案，或[點此下載](https://github.com/Wikitude/wikitude-phonegap-samples/archive/master.zip)。

![範例專案資料夾結構](http://i.imgur.com/f9viSzx.png)

下載後解壓縮，你會看到裡面不像是 Cordova 專案的資料結構，因為這是 Wikitude 製作的專案產生器，可以透過 `CreateSampleApp.cmd` 或 `CreateSampleApp.sh`，用下指令產生 Android 或 iOS 的 Cordova 專案。

產生 Android 範例專案指令如下：

```
CreateSampleApp.cmd -d %CD%/YourProjectName -android true
```

產生 iOS 範例專案指令如下：

```
CreateSampleApp.sh -d %CD%/YourProjectName -ios true
```

等到出現 `*** DONE - SUCCESS ***` 就代表專案建立完成了。

![產生 YourProjectName 專案](http://i.imgur.com/bgDOA8s.png)

執行的過程中，會自動下載、安裝所需要的平台程式碼及套件，所需空間滿大的，所有東西安裝完約用掉 771MB，驚人！

如果你使用的是 Android 專案了話，在產生專案後，要先修改 Android SDK 最小 API 層級，設定成 `19`，作法有兩種：

第一種是修改 `config.xml`，在裡面增加 `<preference name="android-minSdkVersion" value="19" />`，但這樣需要使用 Crodova CLI 來重建 Android 平台專案。

第二種是直接修改 Android 平台專案內的 `AndroidManifest.xml`檔，將 `android:minSdkVersion` 改成 `19`。

![修改 AndroidManifest.xml 內的 android:minSdkVersion](http://i.imgur.com/Chfogtk.png)

這樣範例專案就算產生完成了。

## 輸入金鑰

Wikitude 是付費的解決方案，在開始使用前需要先取得 SDK 的金鑰，因此要先至 Wikitude 網站[註冊成開發者](http://www.wikitude.com/developer/licenses)，登入後從後台取得試用的 SDK 金鑰。

![取得 SDK 試用金鑰](http://i.imgur.com/ibYQjTI.png)

然後在編譯前，參考[此網頁](https://www.wikitude.com/external/doc/documentation/latest/phonegap/triallicense.html#where-should-i-enter-the-license-key)的說明，輸入剛剛取得的 SDK 金鑰。

基本上確認以下 3 個地方：

1. plugin 內的
	* `node_modules/com.wikitude.phonegap.wikitudeplugin/www/WikitudePlugin.js`
2. Android 平台
	* `platforms/android/platform_www/plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js`
3. iOS 平台
	* `platforms/ios/platform_www/plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js`

將第 14 行的 `ENTER-YOUR-KEY-HERE` 替換成 SDK 金鑰字串即可。 

這樣就可以進行編譯並測試了。

## 測試

![測試截圖](http://i.imgur.com/CYkOD5K.jpg)

上圖為此範例 App 的螢幕截圖，由左至右是 App 功能目錄、IMAGE ON TARGET、DIFFERENT TARGETS 的功能。

因為我們使用的是試用的 SDK 金鑰，所以執行的畫面上會有 `Trial` 的浮水印，據官方文件表示，SDK 功能是一樣的，差別只在這個浮水印而已。

另外，這是 Wikitude 範例 App，裡面的測試內容需要搭配[此網頁](http://www.wikitude.com/external/doc/documentation/latest/android/targetimages.html#target-images)內的圖片進行測試。

## 後記

![功能範例資料夾](http://i.imgur.com/MTHnHwU.png)

這個範例 App 所提供的功能範例程式碼，會在 `www` 下的 `world` 中，可以從這裡去了解各個功能是如何被實作的。

另外，在各個功能的 `index.html` 中，會有下列這段程式碼：

```
<script src="https://www.wikitude.com/libs/architect.js"></script>
```

這是因為要使用 Wikitude SDK JavaScript API 而加進去的，可能會覺得奇怪的是，難道他每次執行時，都會去遠端下載這個檔案嗎？答案是否定的，Wikitude SDK 會在執行時期將所需要的 `architect.js` 注入進去，取代遠端下載，因此你在執行時，是不會看到 `404 -Not found` 的錯誤訊息，也因此也不需要擔心沒有網路的情境。

附註一下，以上之所以能夠透過注入的方式取代該行程式碼，是因為他在執行時是使用他自己的 AR View，這是一種類似於 Web View 的 UI 元件，進而達到擴增實境的效果。

----------

參考資料：

* [Wikitude AR SDK for Cordova](https://www.wikitude.com/external/doc/documentation/latest/phonegap/)
* [Wikitude AR SDK for Cordova Examples Tutorials](https://www.wikitude.com/external/doc/documentation/latest/phonegap/samples.html#examples)