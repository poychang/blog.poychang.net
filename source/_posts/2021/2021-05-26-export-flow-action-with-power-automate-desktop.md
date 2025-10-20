---
layout: post
title: 匯出 Power Automate Desktop 所建立的 Flow
date: 2021-05-26 15:37
author: Poy Chang
comments: true
categories: [Azure, Tools]
permalink: export-flow-action-with-power-automate-desktop/
---

[Power Automate Desktop](https://flow.microsoft.com/zh-tw/desktop/) 是 RPA (Robotic Process Automation) 流程自動化的好物，可以透過他建立各種自動化流程，不論是擷取網頁內容、代理操作應用程式動作、檔案處理等事務，都可以透過他來建立一系列的自動化操作，相當方便。不過目前這套工具雖然已經可以穩定使用，但功能選單卻沒有匯出 Flow 流程的選項，要用一個小技巧來處理。

## 匯出流程小技巧

>我相信 Power Automate Desktop 的功能選單最終一定會有匯出功能的，現在還有沒，就先用這個小技巧先頂的用。

這個小技巧的操作其實相當粗暴，首先先開啟你要匯出的流程編輯畫面，如下圖（圖中流程不重要，只是個示意）：

![開啟要匯出的流程編輯畫面](https://i.imgur.com/BKlwnNs.png)

接著按下 <kbd>CTRL</kbd> + <kbd>A</kbd> 全選流程動作，這時會像是下圖這樣，灰色的方框就是被選擇到的流程動作：

![全選要匯出的流程動作](https://i.imgur.com/sgwCvRs.png)

再按下 <kbd>CTRL</kbd> + <kbd>C</kbd> 複製流程動作並貼到記事本中，會得到像下圖這樣的內容

![將複製下來的流程動作貼到記事本中](https://i.imgur.com/aGfRSNJ.png)

接著將這個記事本存檔，然後傳送給要接收此流程的人。

接收的人要匯入流程時，動作也很粗暴，直接在 Power Automate Desktop 建立一個新的流程，然後把檔案的內容複製/貼上即可，下圖的內容不是重點，圖中上面的標題想表達的是，這真的是一個新的流程：

![匯入流程動作]](https://i.imgur.com/h99RZT1.png)

這樣就粗暴地完成匯出/匯入動作了。

### TL;DR;

匯出 Power Automate Desktop 流程

1. <kbd>CTRL</kbd> + <kbd>A</kbd> 全選要匯出的流程動作
2. <kbd>CTRL</kbd> + <kbd>C</kbd> 複製流程動作
3. <kbd>CTRL</kbd> + <kbd>V</kbd> 在記事本中貼上所複製的流程動作
4. <kbd>CTRL</kbd> + <kbd>S</kbd> 儲存記事本並傳送給接收者

匯入 Power Automate Desktop 流程

1. 開啟記事本並複製內容
2. 在 Power Automate Desktop 中建立新的流程
3. <kbd>CTRL</kbd> + <kbd>V</kbd> 貼上記事本中的內容至新的流程
4. 儲存流程

## 正規作法

比較正規的做法是要到 [flow.microsoft.com](https://flow.microsoft.com/) 並登入你的 Microsoft 365 帳號，這上面你會看到所有你組織中分享的流程，包括你自己的，在左側選單中的 `My Flow` 中，點進去後可以看到右邊的上方有 `Desktop Flow` 選項，這裡就是你用 Power Automate Desktop 所建立的流程，如果你看到的是下面的畫面，直接點選 `start a free trial` 即可。

![在 Power Automate 平台上查看 Power Automate Desktop 的流程](https://i.imgur.com/7bun0lD.png)

接著設定要分享給組織內的哪個使用者：

![設定分享給指定的人](https://i.imgur.com/ixfthde.png)

如真的要做匯出/匯入的動作，現在 Power Automate 平台上的 `Desktop Flow` 還是沒有匯出的選項，但你可以將該流程包進 `Solution` 中，再匯出成一包 `.zip` 檔，透過這樣的方式繞路達成這個目的。

----------

參考資料：

* [How to share and export of Power automate desktop](https://powerusers.microsoft.com/t5/Power-Automate-Desktop/How-to-share-and-export-of-Power-automate-desktop-in-production/td-p/785824)
* [MS Docs - Power Automate Desktop 管理桌面流程](https://docs.microsoft.com/zh-tw/power-automate/desktop-flows/manage?WT.mc_id=DT-MVP-5003022)
* [MS Docs - Power Automate Desktop 簡介](https://docs.microsoft.com/zh-tw/power-automate/desktop-flows/introduction?WT.mc_id=DT-MVP-5003022)
