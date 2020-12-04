---
layout: post
title: 更新本機 Git 到最新版
date: 2020-03-24 15:23
author: Poy Chang
comments: true
categories: [Develop, Tools]
---

不管是修補[安全漏洞](https://www.ithome.com.tw/news/123526)或是[提供新功能](https://www.ithome.com.tw/news/128961)，Git 版控工具一直在進步，要升級 Git 其實相當單純，解除安裝然後下載新版本的安裝檔，重新安裝一下就好了，但如果你有安裝 Git for Windows，那麼你有更方便的指令來更新 Git。

## Git for Windows

首先，先確認目前電腦 Git 的版本，可使用 `git version` 來查詢。

如果目前的版本是早於 2.14.1 版，請到 Git 官網[下載新版](https://git-scm.com/)，解除安裝本機的 Git 後手動安裝新版，因為這之前的版本沒有提供更新的指令。

如果目前的版本是介於 2.14.2 和 2.16.1 之間，可以使用 `git update` 進行升級。

如果目前的版本是 2.16.1 以上，請使用 `git update-git-for-windows` 進行升級，不管是使用哪個指令進行升級，他背後其實也是幫你解除安裝，然後下載新版安裝，如是而已，但至少不用打開瀏覽器自己去網頁下載 😀

## Git for Mac

Mac 的使用者通常會使用像是 [Homebrew](https://brew.sh/) 套件管理器來管理，因此通常就是用你所使用的套件管理器來安裝新版，以 Homebrew 來說，就是你可以用 `brew install git` 安裝 Git，以及使用 `brew update && brew upgrade` 更新當前 Git 版本。

----------

參考資料：

* [How to upgrade to the latest version of Git on Windows? Still showing older version](https://stackoverflow.com/questions/13790592/how-to-upgrade-to-the-latest-version-of-git-on-windows-still-showing-older-vers)
* [How to upgrade Git (Mac OSX)](https://medium.com/@katopz/how-to-upgrade-git-ff00ea12be18)
