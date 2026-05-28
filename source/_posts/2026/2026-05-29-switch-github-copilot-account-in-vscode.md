---
layout: post
title: 在 VSCode 中切換 GitHub Copilot 帳號
date: 2026-05-28 15:03
author: Poy Chang
comments: true
categories: [AI, Tools]
permalink: switch-github-copilot-account-in-vscode/
---

在使用 GitHub Copilot 的過程中，可能會遇到需要切換帳號的情況，例如從個人帳號切換到公司帳號。這篇快速帶你了解如何在 VSCode 中切換 GitHub Copilot 帳號。

如何在 Visual Studio Code 中切換 GitHub Copilot 帳號的步驟：

首先，在 VSCode 的擴充套件中找到 [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)，然後點擊齒輪圖示開啟設定清單，選擇 **Account Preferences**。

![open extenstion setting](https://files.poychang.net/storage/switch-github-copilot-account-in-vscode/01-open-extensions-setting.png)

接著上方會跳出選單，讓你選擇要透過哪一個認證提供者來處理帳號驗證，通常會選擇 **GitHub**。

![select auth provider](https://files.poychang.net/storage/switch-github-copilot-account-in-vscode/02-select-provider.png)

接著就會跳出帳號選擇的視窗，如果你有多個帳號，你可以在這裡切換 GitHub Copilot 要使用的帳號，或者可以選擇 **Use a new account** 來加入另一個帳號。

![select or add account](https://files.poychang.net/storage/switch-github-copilot-account-in-vscode/03-select-or-add-account.png)

完成帳號切換後，GitHub Copilot 就會使用你選擇的帳號來提供 AI 助手的功能了。

問我為什麼需要這樣切換？

如果不是工作需要，那就是 GitHub Copilot 的 AI Credit 用完了，要換另一個帳號繼續使用囉 😅
