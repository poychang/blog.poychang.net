---
layout: post
title: 如何開啟 Microsoft Teams 開發人員模式
date: 2019-05-17 12:41
author: Poy Chang
comments: true
categories: [Develop, Bot]
permalink: how-to-debug-inside-microsoft-teams/
---

Microsoft Teams 是一款團隊協作工具，全球已有超過 50 萬家組織採用，對於開發者而言，要開發出滿足組織所提出的需求，試必須要開啟開發人員模式，只是要開啟 Teams 的開發人員模式，沒有這麼直接...

我們知道 Teams 有一部分是用 Electron 來開發的，從官方文件 [DevTools for the Microsoft Teams Desktop Client](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/dev-preview/developer-preview-tools?WT.mc_id=DT-MVP-5003022) 中也可以找到開啟開發者工具的方式，動作相當簡單。

點選應用程式右上角的個人圖片來開啟選單後，在 `About` 選單下會有個 `Developer preview` 的選項，點選後就可以切換到開發人員模式。

![在 Teams 開啟 Developer Preview](https://i.imgur.com/KsvR0DN.png)

![切換至 Developer Preview 模式](https://i.imgur.com/h6Phjbx.png)

接著在右下角的系統列中找到 Teams 圖示，滑鼠右鍵點選開啟選單，就會看到 `Open DevTools` 這個選項，如果沒有了話，請將 Teams 完整關閉後，重新開啟看看。

![從系統列的 Teams 選單中點選 Open DevTools](https://i.imgur.com/wINuXgz.png)

但是我發現，即使完全關閉 Teams 並且重開，點選 `Open DevTools` 依然沒效果，這時候你只要點選系統列的 Teams 圖示 7 下以上，神奇的事情就會發生了！

這時候從系統列開啟 Teams 的選單，你會看到出現超多功能的！這個功能表真的超長...

![從系統列的 Teams 選單出現超多功能](https://i.imgur.com/qnnd7UU.png)

接著點選 `Open DevTools (All WebContents)` 就可以開啟 DevTools 開發者工具囉！

![開發者工具](https://i.imgur.com/f37jewe.png)

這個關鍵的 7 下還真不容易發現呀，而且這麼多功能，也是讓人覺得意外，接下來就讓各位開發者們細細玩玩這些選項吧 😎

## 後記

感謝 Dino 大神補充，如果你是 Teams for Mac 的開發人員，要開啟開發人員模式，則是點擊 Dock 上的 Teams 圖示 4 下，就可以開啟下圖的超長功能選單 😝

![MacOS 的開發人員模式](https://i.imgur.com/ylllE14.jpg)

----------

參考資料：

* [How to debug JavaScript code executed inside Microsoft Teams tab?](https://stackoverflow.com/questions/49857361/how-to-debug-javascript-code-executed-inside-microsoft-teams-tab)
* [DevTools for the Microsoft Teams Desktop Client](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/dev-preview/developer-preview-tools?WT.mc_id=DT-MVP-5003022)
