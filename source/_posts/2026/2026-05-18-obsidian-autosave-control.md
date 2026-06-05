---
layout: post
title: 控制 Obsidian 自動儲存的行為
date: 2026-05-18 10:27
author: Poy Chang
comments: true
categories: [Tools]
permalink: obsidian-autosave-control/
---

我會使用 Obsidian 來管理我的筆記，一直以來在我的環境中經常遇到一個問題，它的自動儲存經常會造成檔案衝突，進而產生多個檔案，問題的根本原因和我的環境有關：Windows + iCloud 進行多裝置同步。最近找到了一個套件，可以有效控制 Obsidian 自動儲存的機制，讓它更符合我的使用習慣。

先說明一下問題，由於 Obsidian 是沒有介面讓使用者去控制它的自動儲存行為的，當你在編輯檔案時，它會根據執行事件不斷地自動儲存，這在大多數情況下是很方便的，但在我的環境中，由於使用 iCloud 的同步機制，而 iCloud 和 Obsidian 的儲存機制對不上，就會造成檔案正在同步至 iCloud 的過程中，又再一次被自動儲存，造成檔案衝突，此時 iCloud 就會產生一個新的檔案，這樣就會出現多個檔案，造成管理上的困擾。

問題不是只有我會遇到，需多人都有這樣樣配置，也有這樣的困擾。

個人覺得最簡單的解決方案，就是讓我手動儲存或是控制自動儲存的行為，但是這兩種方案 Obsidian 都沒有提供，幸好有社群的開發者開發了一個套件，叫做 [Autosave Control](https://github.com/mihasm/obsidian-autosave-control)，它可以讓使用者控制 Obsidian 的自動儲存行為。

> [Autosave Control](obsidian://show-plugin?id=autosave-control) 已經上架到 Obsidian 的社群外掛程式商店了，可以直接在 Obsidian 的社群外掛程式商店中搜尋 `Autosave Control` 來安裝使用。

不過由於這個套件目前沒有上架到 Obsidian 的社群外掛程式商店（**已上架**），不過有在 GitHub 開源，所以我們可以到 [Release](https://github.com/mihasm/obsidian-autosave-control/releases) 中下載 `obsidian-autosave-control.zip` 檔，然後解壓縮到你的 Obsidian Vault 的套件資料夾中，通常是 `your-vault/.obsidian/plugins/autosave-control`，最後在 Obsidian 的 `Community Plugins` 中啟用這個套件就可以了。

![obsidian autosave control setting](https://files.poychang.net/storage/obsidian-autosave-control/obsidian-autosave-control-setting.png)

從設定頁面可以看到，這個套件主要提供兩種模式：

- 關閉自動儲存：完全關閉 Obsidian 的自動儲存機制，只有在使用者按下 `Ctrl + S` 時才會儲存檔案
- 延遲自動儲存：在使用者停止編輯一段時間後才會自動儲存，預設是 10 秒，可以根據需要調整

在 Obsidian 介面的右下角，你可以看到目前的儲存狀態，當變更的內容尚未儲存時，會出現藍色的燈號，反之，如果檔案已經儲存，則會顯示綠色的燈號，這樣你就可以很清楚地知道目前的檔案狀態。

![saved status color on bottom right corner](https://files.poychang.net/storage/obsidian-autosave-control/saved-status-color.png)

有了這個套件的幫忙，我就可以更好地控制 Obsidian 的自動儲存行為，避免了檔案衝突的問題，也讓我的筆記管理更加順暢了。

---

參考資料：

- [Obsidian Autosave Control](https://github.com/mihasm/obsidian-autosave-control)
