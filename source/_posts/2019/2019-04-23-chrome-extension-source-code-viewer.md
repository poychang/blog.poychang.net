---
layout: post
title: 查看 Chrome 擴充套件的程式碼
date: 2019-04-23 12:43
author: Poy Chang
comments: true
categories: [Tools]
permalink: chrome-extension-source-code-viewer/
---

Chrome 的擴充套件非常的豐富，可以將我們的瀏覽器增加很多好用的功能，例如將 GitHub 網站黑化的 [GitHub Dark Theme](https://chrome.google.com/webstore/detail/github-dark-theme/odkdlljoangmamjilkamahebpkgpeacp)，基本上 Chrome 擴充套件都是用 JavaScript 寫的，如果你想要查看某一個擴充套件的程式碼是怎麼寫的，可以透過下面介紹的方式來觀看。

## 查看擴充套件的 ID

如果你要查看已安裝在本機的 Chrome 擴充套件程式碼，必須要找到該擴充套件的 Extension ID，每個 Chrome 擴充套件建立時，Google 都會發一個獨一無二的 Extension ID 作為識別，我們也可以透過他來鎖定要查看的擴充套件位置。

最簡單的方是就是到 Chrome Web Store 找到你的擴充套件，網址上面會有個 32 字元的字串（如下圖），那個就是 Extension ID 了。

![在 Chrome Web Store 查看擴充套件 Extension ID](https://i.imgur.com/YTk14dF.png)

或者你也可以透過 Chrome 選單的 [更多工具] > [擴充功能] 中去找，位置如下圖：

![Chrome 擴充功能選單位至](https://i.imgur.com/1SNoDiW.png)

可以透過搜尋的方式去找指定的擴充套件，如下：

![Chrome 擴充功能搜尋結果](https://i.imgur.com/UACN7gV.png)

找到指定的擴充套件後，可以從畫面上看到 `ID` 資訊，這就是該擴充套件的 Extension ID。

## 擴充套件程式碼

有了擴充套件的 Extension ID，我們可以到下面這個路徑去找已安裝在本機的擴充套件程式碼：

`C:\Users\[LOGIN_NAME]\AppData\Local\Google\Chrome\User Data\Default\Extensions\`

在這個目錄底下你會看到很多用 Extension ID 命名的資料夾，這就對應到每個擴充套件，而該資料夾底下又會再用擴充套件的版本做分類，在版本的資料夾底下，你就可以看到該擴充套件的程式碼資源了。

![本機 Chrome 擴充套件資料夾](https://i.imgur.com/sluj1JH.png)

## 用擴充套件查看擴充套件程式碼

如果你經常想要查看 Chrome 擴充套件的程式碼，[Chrome extension source viewer](https://chrome.google.com/webstore/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin) 這個工具就很方便了，安裝完 Chrome extension source viewer 擴充套件，只要到 Chrome Web Store 找到想要查看的擴充套件頁面按下滑鼠右鍵，點選 `View extension source` 後會在背景下載，再開一個新的頁籤讓我們查看該擴充套件的程式碼，相當方便。

## Microsoft Edge (Dev) 也可以

基於 Chromium 的 [Microsoft Edge](https://www.microsoftedgeinsider.com/en-us/) 瀏覽器，也可以透過這樣的方式找到安裝在本機的擴充套件程式碼，但僅限 Microsoft Edge Dev 版本，而且他的檔案路徑有點不一樣，如下：

`C:\Users\[LOGIN_NAME]\AppData\Local\Microsoft\Edge Dev\User Data\Default\Extensions\`

----------

參考資料：

- [How to Find & View the Files Installed by a Chrome Extension](https://www.bleepingcomputer.com/tutorials/how-to-view-files-installed-by-a-chrome-extension/)
- [How to Find the ID for a Chrome Extension](https://www.bleepingcomputer.com/tutorials/how-to-find-id-for-chrome-extension/)
- [Chrome Extension Manifest - Key](https://developer.chrome.com/apps/manifest/key)
