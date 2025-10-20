---
layout: post
title: 如何取得免費 Apple 開發帳號的 App Provisioning Profile 並用在 Visual Studio App Center 中
date: 2018-03-12 23:32
author: Poy Chang
comments: true
categories: [App, Tools]
permalink: export-provisioning-profile-with-free-ios-developer-/
---
前情提要：因為我只有免費 Personal Team 的 Apple 開發者帳號，又想要玩玩看 [Visual Studio App Center](https://www.visualstudio.com/zh-hant/app-center/)，讓 App 開發也能有 CI/CD 的開發流程，而要讓 App Center 能順利建置 iOS App 專案，你必須要提供開發人員憑證檔(Certificates)，以及 App 項目描述檔 (Provisioning Profiles)，如果你是付費開發者帳號，可以從 [Apple 開發者網站](https://developer.apple.com/account/)去下載 Provisioning Profiles，但免費的 Personal Team 帳號就無法在該網站下載了，這時候該怎麼辦呢？

## .p12 憑證檔

要取得免費 Personal Team 的 Apple 開發者帳號 `.p12` 憑證檔，網路上很多人分享，基本上就是從工具程式中，開啟`鑰匙圈存取`這個程式，然後製作一個憑證請求檔，然後到 [Apple 開發者網站](https://developer.apple.com/account/)去提交申請，即可下載取得，可以參考這篇 [iOS App 上架流程, (2/3) 產出 .P12 憑證與 Provisioning Profile 檔案](http://gogoprivateryan.blogspot.tw/2015/08/ios-app-23-p12-provisioning-profile.html)。

## Provisioning Profiles

重點在這段。

在建立完 iOS App 專案後，從專案屬性頁中，有兩個欄位是這裡需要注意的：

1. Bundle Identifier
2. Provisioning Profile

>這裡的 Bundle Identifier 要先記起來，對於後面找 Provisioning Profile 會很有幫助。

![新的 iOS App 專案](https://i.imgur.com/tUwMt17.png)

由於是使用免費的開發者帳號，所以 Xcode 會產生一個臨時的 Provisioning Profile，這個檔案是無法從 Apple 開發者網站中下載的。

但要使用 Visual Studio App Center 了話，沒有 Provisioning Profile 是無法正確建置的，這時我們可以透過 Xcode 的匯出開發者帳號功能來取得。

點選 Xcode 的 Perferences 後，並點選 Accounts 頁籤，可以看到這台機器上所有的開發者帳號及其團隊資訊

![點選 Xcode 的 Perferences](https://i.imgur.com/sul4b1t.png)

![開發者帳號及其團隊資訊](https://i.imgur.com/QF87Wvg.png)

在開發者帳號列表的下方，點選齒輪圖示，可以匯出指定帳號的資料，這裡面的資料會包含所有跟你開發 App 有關的憑證檔及有使用過的 Provisioning Profile。

![匯出開發者帳號](https://i.imgur.com/RIZoHA7.png)

匯出的檔案會長得像 `XXX.developerprofile` 這樣，但其實你可以用任何一套解壓縮軟體打開，裡面的檔案結構如下：

![developerprofile 內的檔案結構](https://i.imgur.com/NFgIP4g.png)

其中 `profiles` 資料夾內，就會有我們所需要的 Provisioning Profile，但點進去後你會發現，你完全認不得哪個檔案是你要的，這裡面包含所有曾經用過的 Provisioning Profile，而且還用 GUID 作為檔案名稱，根本看不出我們的 App 是用哪個檔案。

![profiles 資料夾內的檔案](https://i.imgur.com/90aImbj.png)

當然，你可以用試錯法，一個一個丟到 Visual Studio App Center 去建置看看，如果成功就代表用對了。

這裡提供另一種方式，透過 [Binary Viewer](http://www.proxoft.com/binaryviewer.aspx) 這套工具，可以讓我們檢視二進位的檔案。

這時我們可以逐一開啟 Provisioning Profile 檔，並透過建立 App 專案時所設定的 Bundle Identifier 值來搜尋，例如我手邊的專案的 Bundle Identifier 叫做 `com.poychang.DemoIOSApp`，你可以從檔案中找到類似的字樣，如下圖：

![檢視二進位檔](https://i.imgur.com/N7ER9Wt.png)

這樣我們就鎖定我們要的 Provisioning Profile 檔了。

## Visual Studio App Center

藉由 Visual Studio App Center 我們可以更容易的管理 iOS、Android、Windows 和 macOS 應用程式的生命週期，透過這個平台強大的自動化流程，更快速的建置、測試、部署。

這裡簡單帶一下，使用這個平台服務進行建置 iOS App 的做法。

建立專案時需要指定你的應用程式類型，目前支援以下作業系統的應用程式：

* iOS
* Android
* Windows
* macOS

以及以下開發應用程式的平台：

* Objective-C / Swift
* React Native
* Cordova
* Xamarin

完成後選擇程式碼來源，支援 Visual Studio Team Services、GitHub、Bitbucket，這裡我使用 GitHub 當範例。

![建立專案後選擇 GitHub](https://i.imgur.com/qLBpAzg.png)

選定程式碼來源後，會自動擷取該版控的狀態，取得分支資訊及最新的 Commit 訊息。實際使用時發現，他擷取的速度超快的，當你版控有更新，這裡幾乎馬上反應。

接者點選分支右側的齒輪進行建置設定。

![選擇指定分支右側的齒輪](https://i.imgur.com/xDeIw5w.png)

這裡用 iOS App 當範例，重點在於上傳 p12 和 Provisioning Profile 檔。免費的 Apple 開發者帳號，可以透過文章上面的方式取得 Provisioning Profile 檔。

![上傳 p12 和 Provisioning Profile 檔](https://i.imgur.com/DyK73QG.png)

設定完成後，就開始建置囉，直接點選該分之，可以看到詳細的建置過程，建置完成後畫面如下：

![建置完成的畫面](https://i.imgur.com/wNX8Fys.png)

設定和流程都相當簡單、方便。

Visual Studio App Center 還很佛心的提供 Analytics 使用分析的功能，只要在你的程式碼加入幾行程式碼，就可以及時掌握使用者執行你 App 的狀態資訊，有興趣的人可以玩玩看。相關 App Center Analytics 資訊請參考[此連結](https://docs.microsoft.com/en-us/appcenter/sdk/analytics/ios?WT.mc_id=DT-MVP-5003022)。

----------

參考資料：

* [無開發人員帳號將 APP 部署到iPhone的方式(Free Provisioning)](https://dotblogs.com.tw/rainmaker/2016/07/23/105824)
* [How do I transfer my iOS developer profile to another computer?](https://apple.stackexchange.com/questions/57059/how-do-i-transfer-my-ios-developer-profile-to-another-computer)
* [iOS Provisioning Profile(Certificate)与Code Signing详解](http://blog.csdn.net/phunxm/article/details/42685597)
* [最详细iOS打包流程](https://www.jianshu.com/p/cda386ddaa2c)

