---
layout: post
title: 玩 WebNN 之前將幫 Microsoft Edge 啟用高效能 GPU
date: 2024-08-06 23:13
author: Poy Chang
comments: true
categories: [Develop, AI, Tools]
permalink: enable-high-performance-gpu-for-microsoft-edge/
---

WebNN（Web Neural Network API）是一個正在開發中的 Web 標準，它為瀏覽器提供了一個統一的 API，讓我們能在網頁中執行深度學習模型。在嘗試 WebNN 的應用時，你可能會想要為 Microsoft Edge 啟用高效能 GPU，這樣可以讓你在使用 Edge 瀏覽器時，獲得更好的推理效能，這篇文章將告訴你如何進行設定。

![WebNN](https://i.imgur.com/wbWPf9p.png)

我的電腦有兩個 GPU，一個是 Intel 的內建 GPU，另一個是 NVIDIA 的獨立 GPU。預設的情況下，瀏覽器會使用 Intel 的內建 GPU 來執行，這樣可以節省電力，但是在執行機器學習模型時，效能可能不夠。因此，我想要為 Edge 啟用高效能 GPU，這樣可以在執行機器學習模型時，獲得更好的效能。

設定方式如下：

開啟 Windows 設定，選擇 `System` > `Display` > `Graphics`，在這裡我們可以手動為每一個應用程式設定要使用哪種顯示設定。

![System > Display > Graphics](https://i.imgur.com/ZIFC1vY.png)

首先，我們要先將 Microsoft Edge 的執行檔加入到清單中，這樣才能對 Edge 進行顯示設定。點選 `Browse`，找到 Edge 的執行檔，通常在 `C:\Program Files (x86)\Microsoft\Edge\Application` 中，選擇 `msedge.exe` 執行檔。

加入完成後，可以在下方搜尋到 Microsoft Edge 應用程式，點選 `Options` 進行設定，這裡有三個選項可以選擇：

- Let Windows decide
- Power saving
- High performance

這裡我們選擇 `High performance` 選項，如此一來 Edge 就會使用高效能 GPU 來執行網頁。

![choose High performance option](https://i.imgur.com/cETazUs.png)

這樣就完成了為 Microsoft Edge 啟用高效能 GPU 的設定，這樣在執行機器學習模型時，就可以獲得更好的效能。這個設定方式也可以用在其他應用程式上，例如遊戲或是其他需要高效能 GPU 的應用程式。

> 這是一種效能與電力消耗之間的權衡，將瀏覽器設定使用高效能的 GPU 是可以帶來更好的效能，但同時也會消耗更多的電力。

## 後記

在 AI PC 的時代，未來每位使用者的電腦雖然未必都會有高效能的 GPU，但至少會有一顆能夠執行 AI 模型的 NPU，因此這設定在未來應該會直接由 Windows 自行決定，不用使用者自行手動設定。

如果你也想嘗試看看 WebNN 的應用，可以開啟 [WebNN Samples](https://webmachinelearning.github.io/webnn-samples/) 這個由 WebNN 團隊提供的網站，裡面有很多 WebNN 的範例可以讓你嘗試。

---

參考資料：

* [How to enable high-performance GPU for Microsoft Edge browser](https://www.thewindowsclub.com/enable-high-performance-gpu-edge)
* [WebNN - Web Neural Network](https://webmachinelearning.github.io/webnn-intro/)
