---
layout: post
title: 自動將 Obsidian 筆記備份到 Github 並和行動裝置同步
date: 2022-11-19 00:47
author: Poy Chang
comments: true
categories: [App, Tools, Note]
permalink: obsidian-sync-between-desktop-and-mobile-with-git/
---
[Obsidian](https://obsidian.md/) 是一套相當不錯用的筆記系統，在許多人的推薦下，我也來嘗試使用這套工具來處理四散各地的筆記。在使用的過程中，官方有推出一個 Obsidian Sync 幫你同步電腦和行動裝置上的筆記，收費並不便宜。幾經探索，整理出一套免費的解決方案，雖然方法比較工程師一些，但是會看到這篇文章的，應該滿多都是工程師吧。

整體的架構是這樣，先在 GitHub 上面建立一個私有的版控庫，然後在電腦版 Obsidian 所儲存筆記的 Vault 資料夾中，使用 Git 來將整個資料夾建立版控庫，並和剛剛建立好的 GitHub 私有版控庫做連結。

接著在電腦端的 Obsidian 安裝 [Obsidian Git](https://github.com/denolehov/obsidian-git) 第三方套件，透過這個套件將 Vault 資料夾下的檔案，自動提交到 GitHub 上。

在手機端（這裡以 iPhone 為例），安裝 [iSH](https://ish.app/) 這隻 App，透過他將 iPhone 上的指定資料夾複刻 GitHub 上的私有版控庫，再到 Obsidian 上設定 GitHub 相關的帳號密碼。

## 背後知識

在發展這個解決方案的過程中，有些背後的技術架構可以先了解一下，這樣在後面的步驟中，會比較容易知道為什麼可以這樣做。

首先，最關鍵的程式就是 [Obsidian Git](https://github.com/denolehov/obsidian-git)，這套件背後是使用 [isomorphic-git](https://isomorphic-git.org/) 這項由 JavaScript 重新實作的 Git 套件，因此安裝了這個套件後，在 iOS 中無法安裝標準的 Git，也是可以執行像是 `git commit` `git push` `git pull` 這樣的指令。

其次，[iSH](https://ish.app/) 是一個可以在 iOS 上面執行 Linux 指令的 App，這個 App 背後是使用 [Alpine Linux](https://alpinelinux.org/) 這個輕量級的 Linux 發行版，之所以要使用這個 App，是因為要讓 Obsidian Git 正確運作之前，該 Obsidian Vault 資料夾中必須要有 `.git` 相關的檔案。

當然，或許可以透過打包整個 Git 資料夾的方式，想辦法手動傳到 iOS 上，但我覺得這樣比較繁瑣，不如想辦法在 iOS 上面執行 `git clone` 指令。

前面有提到，iOS 是無法安裝標準的 Git，但藉由 iSH 中的 Alpine Linux，我們可以輕鬆地使用 apk 指令安裝 Git，然後搭配 mount 指令將 iOS 中特定的資料夾掛載到 Linux 中，這樣就可以在 Linux 中執行 `git clone` 指令並將復刻下來的檔案直接存在 iOS 的指定資料夾中。

## 動手做

這裡盡量一步步的帶大家做，過程中或許會因為版本的不同而有些許差異，但概念上應該是一樣的。

### 電腦端

首先，在 GitHub 上面建立一個空的私有版空庫：

![在 GitHub 上面建立一個空的私有版空庫](https://i.imgur.com/UipLVqA.png)

在電腦端，在你想要存放 Obsidian Vault 的地方，執行 `git clone https://github.com/YOUR/REPO.git`，這個資料夾就會是你的 Obsidian Vault 資料夾。

> 全新建立的空版控庫，會需要執行過 `git push -u origin main` 提交到遠端分支的指令，這樣之後 Obsidian Git 才能正確運作。

接著在 Obsidian 開啟資料夾來建立 Vault：

![在 Obsidian 開啟資料夾來建立 Vault](https://i.imgur.com/KIXrtfY.png)

簡單建立一個筆記：

![建立 Hello World 筆記](https://i.imgur.com/XchYUxU.png)

在設定中找到搜尋並安裝社群套件的位置，`Settings` > `Community plugins` > `Browse`

![找到搜尋並安裝社群套件的位置](https://i.imgur.com/zEEFXNw.png)

搜尋 Obsidian Git 並安裝，安裝完成後直接點選 `Enable` 做啟動：

![搜尋 Obsidian Git 並安裝](https://i.imgur.com/Cq3gjZo.png)

在 Obsidian Git 套件中的設定，有幾項建議座椅下設定，提供參考：

- `Vault backup interval` 建議將備份時間設定為 5 分鐘
- `{{hostname}} placeholder replacement` 建議設定電腦名稱以便識別是哪個裝置有提交更新
- `Pull update on startup` 建議開啟每次啟動 Obsidian 就更新所有的變更
- `Push on backup` 確認這項是開啟的，這樣在執行 Backup 的時候才會提交後自動將更新推到 GitHub 上，讓其他裝置可以同步

這樣電腦端的設定就差不多了，如果是要在其他電腦上同步這個 Obsidian Vault，基本的操作差不多就是 `git clone` 之後，然後在 Obsidian 中開啟這個資料夾，剩下的同步動作就交給 Obsidian Git 去處理了。

### 手機端

這裡以 iOS 為例，首先在 App Store 中安裝 [Odsidian](https://apps.apple.com/us/app/obsidian-connected-notes/id1557175442) 和 [iSH](https://apps.apple.com/tw/app/ish-shell/id1436902243) 這兩個 App。

在開始之前，你可以使用 [Files](https://apps.apple.com/us/app/files/id1232058109) 這個 Apple 官方的檔案管理 App，來查看 Obsidian 存放 Vault 的資料夾是否存在：

![查看 Obsidian 存放 Vault 的資料夾是否存在](https://i.imgur.com/jAsrCVT.jpg)

確認好之後，就可以開啟在 iSH 並使用 `apk` 更新當前 Alpine Linux 已安裝的套件，並且安裝 Git 指令工具：

```bash
apk update & upgrade
apk add git
```

接著要在 iSH 中掛載 iOS 的指定資料夾，可以參考這份文件 [Mounting other file providers](https://github.com/ish-app/ish/wiki/Mounting-other-file-providers)，基本的操作指令如下：

```bash
mount -t ios . /mnt/obsidian
```

這指令會開啟 iOS 選擇資料夾的互動視窗，選擇好要掛載的資料夾，也就是 `Obsidian` 資料夾之後，就可以在 `/mnt` 底下看到 `Obsidian` 這個資料夾的內容，在使用 `cd /mnt` 移動到該目錄之後，可以使用 `git clone` 指令將我們存放在 GitHub 上的檔案復刻下來：

![掛載後復刻存放在 GitHub 上的檔案](https://i.imgur.com/MWUuzIo.png)

過程中會需要輸入 GitHub 的帳號密碼，如果你有啟動 2FA 的話，就需要產生一組 Personal Access Token 來使用，這裡有一份文件可以參考 [Creating a personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)。

最後回到 Obsidian App 中，在這裡可以看到稍早復刻下來的資料夾（demo-obsidian-sync）：

![在 Obsidian App 中可以看到稍早復刻下來的資料夾](https://i.imgur.com/PFe6G68.jpg)

開啟這個 Vault 的時候可能會跳出一些錯誤訊息，這是因為還沒有設定好 Git 相關設定，只要到設定頁面中，將 `Authentication/Commit Author` 段落中的設定填妥即可。

![設定好 Git 相關設定](https://i.imgur.com/PCLdVBH.jpg)

這樣就完成了手機端的設定，接下來就可以在電腦端和手機端之間同步資料了。

![打完收工](https://i.imgur.com/zJxlrZz.png)

## 後記

這個解決方案看似很複雜，但是如果你平常就有使用 Git，並且對於指令稍微有一點了解的話，應該不會有太大的困難。

整體自動化同步的效果個人是相當滿意的，也因此才會不厭其煩的落落長寫下這篇文章，希望能夠幫助到有需要的人。

---

參考資料：

* [Sync with git on iOS for free using iSH](https://forum.obsidian.md/t/mobile-sync-with-git-on-ios-for-free-using-ish/20861/17)
* [iSH - Mounting other file providers](https://github.com/ish-app/ish/wiki/Mounting-other-file-providers)
