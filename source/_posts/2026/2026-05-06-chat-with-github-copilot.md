---
layout: post
title: 如何更精確地和 GitHub Copilot 溝通
date: 2026-05-06 19:31
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: chat-with-github-copilot/
---

你可以直接和 GitHub Copilot 說你想要做的事，不過如果你熟練一些操作方式，可以讓 GitHub Copilot 更精確地理解你的需求，甚至是讓它在特定情境下有特定的行為，這樣就能更有效率地使用這個工具。這篇文章會介紹一些和 GitHub Copilot 溝通的方式，讓你可以更好地利用這個 AI 助手。

在和 GitHub Copilot Chat 的視窗中，可以利用 `@` `#` `/` 這些特殊關鍵字來呼叫一些特定的功能，或者是直接輸入指令來讓 GitHub Copilot 執行特定的任務，這些都是可以幫助你更精確地和 GitHub Copilot 溝通的方式。

| 關鍵字                  | 簡稱 | 用途             |
| ----------------------- | ---- | ---------------- |
| `@` (Chat participants) | 叫人 | 要跟誰說話       |
| `#` (Chat Variables)    | 餵料 | 要給他看什麼資訊 |
| `/` (Slash Commands)    | 下令 | 要他做什麼動作   |

## 叫人 @

`@` 這個用途像是找一個具有特定專長的領域專家，在特定領域中協助你，可以把這功能看成呼叫某位 Agent。

在 Visual Studio Code 中常見的用法有：

- `@workspace` 專案空間，可以叫他去檢索你整個專案的檔案。例如叫他查詢專案中處理使用者登錄的邏輯在哪裡
- `@terminal` 終端機，可以叫他去查看終端機中的上下文。例如叫他從終端機中的報錯訊息去找解決方案。
- `@vscode` 編輯器，可以叫他去操作 Visual Studio Code 的功能。

在 Visual Studio 中常見的用法有：

- `@debugger` 偵錯器。不只讀取錯誤訊息還可以利用呼叫堆疊、變數狀態和診斷工具，系統性地在解決方案中逐步進行錯誤診斷。
- `@profiler` 效能分析器。連接 Visual Studio 的效能分析基礎設施，找出瓶頸並根據你的程式碼庫提出針對性的優化建議。
- `@test` 測試。它會產生符合你專案框架和模組的單元測試。

## 餵料 \#

`#` 讓你在提示詞中加入特定脈絡，根據這些資訊來產生更符合你需求的回應。

- `#file` 精準餵食檔案。輸入 `#` 後選檔案，讓他能直接知道你要處理的相關檔案是那些。
- `#selection` 精準餵食程式碼段落。取得你選取到的程式碼段落，讓他知道你要處理的段落在哪裡。
- `#codebase` 明確的告訴他去翻閱你的程式碼庫。

## 下令 /

`/` 可以避免為常見情境撰寫複雜 Prompt，透過指令的方式套用該複雜的提示。

- `/fix` 修復程式碼錯誤。
- `/explain` 解釋程式碼。
- `/tests` 產生單元測試。
- 自訂指令，搭配 `.prompt.md` 檔案，可以定義自己的指令來套用特定的提示。

## 後記

不同的 IDE 或編輯器，可以透過 `@` `#` `/` 所使用的功能略有不同，例如 Visual Studio Code 和 Visual Studio 就各自有不同的功能，但呼叫方式是一樣的。因此，建議可以針對不同 IDE 去參考官方文件的說明來使用。

---

參考資料：

- [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- [Using keywords in your prompt](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide#using-keywords-in-your-prompt)
- [Getting started with prompts for GitHub Copilot Chat in your IDE](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/get-started-with-chat-in-your-ide)
- [MS Learn - 使用內建及自訂代理程式搭配 GitHub Copilot](https://learn.microsoft.com/zh-tw/visualstudio/ide/copilot-specialized-agents?WT.mc_id=DT-MVP-5003022)
