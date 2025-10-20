---
layout: post
title: .NET 開發者沒有 Mac 也能開發 iOS App
date: 2021-03-17 23:20
author: Poy Chang
comments: true
categories: [Dotnet, App, Develop, Tools]
permalink: develop-ios-app-no-mac-required/
---

過去要開發 iOS App 時，不管你是用哪種技術，一定要買一台 Mac 搭配 XCode 做建置，才能安裝到手邊的 iPhone 開發機上，如果你是使用 Windows 的開發者，那麼整個開發流程就是很不順暢。如果你是使用 .NET 的 Xamarin 技術開發 iOS App 了話，那一定要知道 Xamarin 搭配 Visual Studio 的 [Hot Restart](https://docs.microsoft.com/zh-tw/xamarin/xamarin-forms/deploy-test/hot-restart) 功能，讓你不用 Mac 也能將建置 iOS App 並安裝到 iPhone 上。

## Apple 開發者帳號

我們知道要開發 Apple 的 App 必須要先建立 [Apple ID](https://appleid.apple.com/account) 做為開發人員帳戶，並且每年付 $99 美金來訂閱 [Apple Developer Program](https://developer.apple.com/programs/)，才能上架到 App Store 或安裝 App 到裝置上（若是要 in-house 使用則需要訂閱 [Apple Developer Enterprise Program](https://developer.apple.com/programs/enterprise/)），關於免費和付費版的開發人員帳戶差別可以參考[這個官方連結](https://developer.apple.com/support/compare-memberships/)。

這裡要特別提的是，除非公司要你專職在開發 Apple 的 App，不然一個開發團隊只需要一個付費的訂閱帳號即可，你可以將多個免費的開發人員帳戶都加到付費帳戶的團隊下，做法如下：

使用付費帳戶登入[開發人員後台](https://developer.apple.com/account/)，點選 People 選單。

![使用付費帳戶登入後點選 People 選單](https://i.imgur.com/FelNn5E.png)

這時會轉跳到團隊使用者的管理介面，根據你想要給的權限將免費的開發人員帳戶加入即可。

![將免費的開發人員帳戶加入並設定成 Admin 權限](https://i.imgur.com/hvMbwHZ.png)

因為這篇是要使用到 Hot Restart 的功能，這裡的權限必須設定成 Admin，原因是只有 Admin 才能建立 App 的 Provision。

這裡的權限列表請[參考這裡](https://developer.apple.com/support/roles/)。

## 開啟 Visual Studio Hot Restart 功能

目前 Xamarin Hot Restart 僅適用於 Visual Studio 2019 16.5 以上版本，且現在還是預覽階段（希望會跟著 .NET 6 一起正式發布），所以開啟 Visual Studio 上方選單列的 [工具] > [選項] 視窗，然後在 [環境] > [預覽功能] 中開啟 Hot Restart 功能，設定完記得重新啟動 Visual Studio。

![啟動預覽版的 Hot Restart 功能](https://i.imgur.com/vF5Dbs9.png)

>在 Visual Studio 16.9 之後的版本，Xamarin Hot Restart 已經是預設開啟的狀態，貌似已經脫離 Preview 了 👍

## 體驗沒有 Mac 的狀態開發 iOS App

要體驗沒有 Mac 的 iOS App 開發，環境要安裝 [iTunes](https://www.microsoft.com/zh-tw/p/itunes/9pb2mz1zmb1s)，在使用 Xamarin Hot Restart 時，請先開啟 iTunes 並確認手機已經連線成功。

我是直接用 Xamarin.Forms 的範本來建立新專案，這就不多贅述了。

接著要使用 Xamarin Hot Restart 對開發中的 iOS App 偵錯時，要先設定起始專案為 iOS 的 Xamarin.Forms 專案，並選用 Local Device，如果已經有接上手機時，Local Device 會是你的手機名稱，像是下圖的 `Poy's iPhone`：

![設定起始專案並選用 Local Device](https://i.imgur.com/wcxdiDT.png)

然後你就可以直接 F5 進行偵錯模式囉！

在執行偵錯模式時，如果是第一次使用，會開啟設定 Hot Restart 視窗畫面。

![設定 Hot Restart 視窗畫面](https://i.imgur.com/lkXSio4.png)

接著會要你連接你的 iOS 設備裝置，如果連接不到可以嘗試移除裝置重新接上連接線，或者開啟 iTunes（不知道為什麼開啟 iTunes 會讓連線變得順暢...）。

![連接你的 iOS 裝置](https://i.imgur.com/YpHlxEY.png)

再來會要你登入你的 Apple Developer 開發者帳號，並且選用對應的開發團隊，這裡主要是自動化建立給這個 App 用的 Provisioning Profile。

![登入並選擇開發團隊](https://i.imgur.com/pq3zVqB.png)

你可以到 Apple Developer 後台網站，點選 Certificates, Identifiers & Profiles 選單就可以看到這自動化建立的 Provisioning Profile。

在完成啟動 Hot Restart 後，背後會用一個很神秘的方式安裝了一個 Xamarin Shell App 到你的手機上，藉此你就可以橋接到你開發中的 App。

## 背後黑魔法

個人覺得 Hot Restart 非常的黑魔法，這到底是怎麼辦到的呢？先來看看下面張圖：

![基本原理](https://i.imgur.com/lQiQ5k1.png)

Hot Restart 背後的運作原理其實是預先建置了一個 Shell App 放在 Visual Studio for Windows 中，在偵錯時會先拿這個 Pre-build 的 App 加上你的程式碼（User Code），並加入必要執行程序（Libraries）來即時編譯、執行你所撰寫的程式，然後套上自動化建立的 Provisioning Profile，因為這基本上預先編譯好的 App（至少底層是），已經通過類似 XCode 的編譯檢查，所以有機會直接安裝至 iOS 中執行。

這樣的處理方式還是有些限制，例如他無法調整 Launch Screen 和底層的 `info.plist`，不過這對於偵錯開發中的 App 已經非常夠用了！

## 後記

最後，貼一下這歷史的一刻，No Mac still can develop iOS App！

![No Mac still can develop iOS App](https://i.imgur.com/XKv3GDs.png)

----------

參考資料：

* [Apple iOS Program 的各種授權比較](https://dotblogs.com.tw/ryannote/2016/03/02/230209)
* [Look iOS Developer, No Mac Required - Build an iOS Application using Xamarin and Visual Studio for Windows without using a Mac](https://nicksnettravels.builttoroam.com/ios-dev-no-mac/)
* [Xamarin Hot Restart](https://docs.microsoft.com/zh-tw/xamarin/xamarin-forms/deploy-test/hot-restart?WT.mc_id=DT-MVP-5003022)

