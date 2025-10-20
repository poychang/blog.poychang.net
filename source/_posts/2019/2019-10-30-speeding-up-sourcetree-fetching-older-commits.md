---
layout: post
title: 加速 SourceTree 讀取 Commits 的速度
date: 2019-10-30 12:43
author: Poy Chang
comments: true
categories: [Tools]
permalink: speeding-up-sourcetree-fetching-older-commits/
---

程式碼的版本控制是專案很重要的一個環節，當專案越長越大，歷時也越來越悠久的時候，你會發現 Git 的版本紀錄 (Commits) 會非常多，除非你用 Git 指令來操作，否則用有介面的版本控制工具都很容易卡在讀取過多 Commits，或是在繪製 Commits Tree 的時候卡很久，如果你剛好是使用 [SourceTree](https://www.sourcetreeapp.com/) 作為版本控制工具， 這裡有個設定你可以參考一下。

SourceTree 團隊知道操作速度所帶來的體驗很重要，所以很早之前就透過簡化介面，以及使用純 C 語言打造的 [libgit2](https://libgit2.org/) 來操作本地端 Git.exe，讓整個操作流程能更順暢。

但遇到超大、超多 Commits 的專案時，要讀取所有 Commits 並繪製 Commits Tree 還是會花很多時間，因此 SourceTree 預設只抓取前 300 個 Commits，但如果你只在乎最近期的 Commits，你大可以降低這個數值，例如改成 50，使 SourceTree 可以更快的讀取並繪製 Commits Tree。

這個設定值可以從工具列上的 `Tools` > `Options` 開啟 SourceTree 設定視窗，在 `General` 頁籤下 找到 `Log rows to fetch per load` 位置，修改這裡的數值即可。

![工具列上的 Tools > Options](https://i.imgur.com/xQGBWL4.png)

![General > Log rows to fetch per load](https://i.imgur.com/HMqvVeq.png)

減少等待，就有更多時間看更多程式碼 😀

----------

參考資料：

* [Speeding up "Fetching older commits"](https://community.atlassian.com/t5/Sourcetree-questions/Speeding-up-quot-Fetching-older-commits-quot/qaq-p/587217)

