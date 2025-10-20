---
layout: post
title: iOS 支援多語系 App 名稱
date: 2016-06-13 17:22
author: Poy Chang
comments: true
categories: [App, Develop]
permalink: cordova-ios-localized-app-name/
---

繼上一篇的 Android 支援多語系 App 名稱，趕緊把 iOS 的多語系 App 名稱給補齊。因為在我的 Cordova 專案中，沒辦法做自動化流程，所以不趕緊做些筆記，應該很快就會忘記了。

iOS App 的名稱主要是抓專案檔 Info 中 Bundle Display Name 和 Bundle Name 欄位的設定值，從下圖可以看到這兩個設定值都是 `${PRODUCT_NAME}`。 

![Project Info](http://i.imgur.com/SQFijjL.png)

這個參數是存在專案 `MyProject.xcodeproj` 的 `project.pbxproj` 裡面，而且從開發界面是看不到的，要用文字編輯器開啟 `project.pbxproj`，然後搜尋關鍵字 `PRODUCT_NAME` 才找的到蹤影（藏的可真深...）。

在[官方文件](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html)中可以知道，這兩個欄位的欄位名稱分別為 `CFBundleDisplayName` 和 `CFBundleName`，理論上我們可以直接修改這個欄位的值，來達到變更 App 名稱的目的，但**請別這樣做**，因為這樣就把名稱寫死了。

我們可以透過 applications Information Property List（`Info.plist`）來管理這些欄位的設定，接下來就處理如何透過 `Info.plist` 來達到支援多語系 App 名稱。

----------

範例的作業環境

* OS X 10.11.5
* Xcode 7.3.1

----------

## 步驟一

實際上我們不修改 `Info.plist`，而是藉由 `InfoPlist.strings` 然後進行本地化設定，`InfoPlist.strings` 會在系統執行的時候覆蓋掉對應的 `Info.plist` 屬性。

首先，在 `Resources` 資料夾下新增一個檔案，選擇 Strings 樣板並取名叫做 `InfoPlist.strings`。

![新增 InfoPlist.strings 檔案](http://i.imgur.com/eidAzAs.png)

![選擇 Strings 樣板](http://i.imgur.com/L8eyoI6.png)

## 步驟二

在 `InfoPlist.strings` 中加入下面兩行程式碼並輸入你的 App 名稱（英文語系的名稱），然後點選 Xcode 右方的面板的 `Localize...`，此時這個檔案就有了區分不同語系的屬性，預設的語系是 `English`。

```
"CFBundleDisplayName" = "Hello";
"CFBundleName" = "Hello";
```

![輸入 App 名稱並使之本地化](http://i.imgur.com/ro8YIjc.png)

## 步驟三

執行完上述的本地化之後，會在專案資訊的 `Localizations` 中看到目前有 `English` 的語系，而該欄後面的 Resource 欄位中，可以看到寫者 `1 File Localized`，這就是指我們剛剛本地化的 `InfoPlist.strings` 檔案。

接下來我們就可以按左下方的加號，來新增 `InfoPlist.strings` 對應的語系，`zh-Hant` 中文。

![](http://i.imgur.com/gv3V9d2.png)

![](http://i.imgur.com/e7by8Bk.png)

## 最後

完成上述步驟後，可以在檔案導覽中看到 `InfoPlist.strings` 左邊多了個黑色箭頭，點開後可以看到對應語系的檔案，這時候我們就可以去修改中文語系的 App 名稱，就搞定了。

![完成多語系設定](http://i.imgur.com/P2vuY5p.png)

## 補充

做完上面的步驟後，如果你開啟 Finder 看 `Resources` 資料夾，你會找不到原本的 `InfoPlist.strings`，取而代之的是 `en.lproj` 和 `zh-Hant.lproj` 資料夾，本地化就是透過這樣的方式達成的。

![Finder](http://i.imgur.com/8hKI6me.png)

這些動作好像都只是增加些檔案，就可以達到多語系的功能了，那應該可以透過 Cordova Hook 去處理這些事情，讓這段自動化呀，為什麼會說不行呢？

因為在 Xcode 的專案裡面，本地化檔案是需要被註冊到 `project.pbxproj` 裡面，如果沒有註冊了話，Xcode 是會忽略該檔案的，因此無法用自動化的方式來處理。

但有個半自動化的方案，就是把寫好的資料夾和檔案複製下來，之後有需要的時候，在用介面新增進去。用介面處理的時候，Xcode 就會自動幫你註冊檔案了，這樣是會讓流程稍微快一點。

----------

參考資料：

* [Localize iPhone Application Name](http://useyourloaf.com/blog/localize-iphone-application-name/)
* [How to localize the name of your App and the Splash/Launch Image](https://archive.appcelerator.com/question/98921/how-to-localize-the-name-of-your-app-and-the-splashlaunch-image)
