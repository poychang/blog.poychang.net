---
layout: post
title: 如何手動快速下載不同版本的 Xcode
date: 2021-10-12 15:40
author: Poy Chang
comments: true
categories: [App, Develop, Tools]
permalink: manually-download-multiple-versions-of-xcode/
---

如果你要開發 Apple 的應用程式，不管是 iOS 還是 MacOS，開發久了你多少都會碰到 Xcode 版本的問題，因為在 iOS 或 MacOS 上執行的 App，有時必須要搭配特定以上版本的 Xcode 才有辦法建置成功，因此如何在自己的開發機器上，保留多個 Xcode 版本，變成是 Apple 開發者必須要學會的一件事。這問題，就從下載 Xcode 開始。

## 千萬不要用 App Store 安裝/更新 Xcode

如果你曾經使用 Mac App Store 來下載安裝 Xcode 了話，很不幸的，你一定會滿口抱怨。

透過 Mac App Store 來安裝或更新 Xcode 時，非常容易失敗，且會花非常久的時間，況且這個方法只能保留 1 個版本的 Xcode，所以**千萬不要**使用這個方法來管理 Xcode。

## 直接從 Apple Developer 網站下載

[Apple Developer 網站](https://developer.apple.com/downloads)上有下載各個 Xcode 版本的連結，登入開發者帳號之後，可以從 [https://developer.apple.com/downloads/more](https://developer.apple.com/downloads/more) 這裡可以搜尋到各個版本的下載位置，

從這裡可以下載到 `.xip` 壓縮檔版本的 Xcode，你只需要滑鼠點兩下，透過封存工具程式解壓縮即可得到 Xocde 應用程式。

因為這個解壓縮後的檔案名稱都叫做 Xcode，通常這時候我會重新命名這個 Xcode 應用程式，在檔名上加上版本號，再把它拖拉進`應用程式`資料夾中，方便識別是哪個版本的 Xcode。

只是這個網站的搜尋介面差強人意，有些眼尖的人可能會發現，他下載檔案的連結其實相當很容易預測，像是下面這樣：

```
Xcode 13
https://download.developer.apple.com/Developer_Tools/Xcode_13/Xcode_13.xip

Xcode 12.5.1
https://download.developer.apple.com/Developer_Tools/Xcode_12.5.1/Xcode_12.5.1.xip
```

連結就是 `Xcode_版本號`，因此，如果你知道你要下載的版本號，可以直接打網址來下載，不過還是要先登入 Apple Developer 網站才能下載。

## 下載連結

這裡條列了 Xcode 開放 SwiftUI 框架之後，到目前為止的下載清單，方便直接下載。請注意，下載前請先[登入 Apple Developer](https://developer.apple.com/account/) 才能順利下載。

- [Xcode 11](https://download.developer.apple.com/Developer_Tools/Xcode_11/Xcode_11.xip)
- [Xcode 11.1](https://download.developer.apple.com/Developer_Tools/Xcode_11.1/Xcode_11.1.xip)
- [Xcode 11.2](https://download.developer.apple.com/Developer_Tools/Xcode_11.2/Xcode_11.2.xip)
- [Xcode 11.2.1](https://download.developer.apple.com/Developer_Tools/Xcode_11.2.1/Xcode_11.2.1.xip)
- [Xcode 11.3](https://download.developer.apple.com/Developer_Tools/Xcode_11.3/Xcode_11.3.xip)
- [Xcode 11.3.1](https://download.developer.apple.com/Developer_Tools/Xcode_11.3.1/Xcode_11.3.1.xip)
- [Xcode 11.4](https://download.developer.apple.com/Developer_Tools/Xcode_11.4/Xcode_11.4.xip)
- [Xcode 11.4.1](https://download.developer.apple.com/Developer_Tools/Xcode_11.4.1/Xcode_11.4.1.xip)
- [Xcode 11.5](https://download.developer.apple.com/Developer_Tools/Xcode_11.5/Xcode_11.5.xip)
- [Xcode 11.6](https://download.developer.apple.com/Developer_Tools/Xcode_11.6/Xcode_11.6.xip)
- [Xcode 11.7](https://download.developer.apple.com/Developer_Tools/Xcode_11.7/Xcode_11.7.xip)
- [Xcode 12](https://download.developer.apple.com/Developer_Tools/Xcode_12/Xcode_12.xip)
- [Xcode 12.0.1](https://download.developer.apple.com/Developer_Tools/Xcode_12.0.1/Xcode_12.0.1.xip)
- [Xcode 12.1](https://download.developer.apple.com/Developer_Tools/Xcode_12.1/Xcode_12.1.xip)
- [Xcode 12.2](https://download.developer.apple.com/Developer_Tools/Xcode_12.2/Xcode_12.2.xip)
- [Xcode 12.3](https://download.developer.apple.com/Developer_Tools/Xcode_12.3/Xcode_12.3.xip)
- [Xcode 12.4](https://download.developer.apple.com/Developer_Tools/Xcode_12.4/Xcode_12.4.xip)
- [Xcode 12.5](https://download.developer.apple.com/Developer_Tools/Xcode_12.5/Xcode_12.5.xip)
- [Xcode 12.5.1](https://download.developer.apple.com/Developer_Tools/Xcode_12.5.1/Xcode_12.5.1.xip)
- [Xcode 13](https://download.developer.apple.com/Developer_Tools/Xcode_13/Xcode_13.xip)

----------

參考資料：

* [如何管理 Xcode 版本才不會害到自己跟團隊](https://13h.tw/2019/11/01/manage-xcode-versions.html)
