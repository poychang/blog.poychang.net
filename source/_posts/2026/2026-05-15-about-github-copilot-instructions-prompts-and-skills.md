---
layout: post
title: 關於 GitHub Copilot 的 Instructions、Prompts 和 Skills 差異說明
date: 2026-05-15 08:11
author: Poy Chang
comments: true
categories: [Develop, AI, Tools]
permalink: about-github-copilot-instructions-prompts-and-skills/
---

在[在 Visual Studio 中使用 Markdown 檔輔助 GitHub Copilot](https://blog.poychang.net/using-markdown-to-assist-github-copilot-in-visual-studio/)這篇內容中，我們介紹了 GitHub Copilot 的 Instructions、Prompts、Skills 基本用法，這篇將補充這三者的差異。

Instructions、Prompts 和 Skills 這三者都是用來客製化 GitHub Copilot 行為的機制，但定位有所不同：

## 1. Instructions（指令）

- 主要用途：定義 Copilot 在特定情境下**應該遵守的規則**，會自動套用到對話中。
- 主要檔案：`copilot-instructions.md`、`.instructions.md`，透過 `applyTo` 設定生效範圍（例如只對 `**/*.cs` 生效）
- 觸發機制：**被動套用**，每次對話自動帶入，不需要手動觸發
- 上下文管理：會在每次對話開始時載入相關的 instructions，並根據 `applyTo` 規則決定哪些指令生效，並且會持續影響整個對話過程
- 適合場景：程式風格、命名規則、專案慣例、Commit Message 格式

> 例：你的 copilot-instructions.md 規定 Commit 必須使用 Conventional Commits。

## 2. Prompts（提示）

- 主要用途：可重複使用的**任務模板**，由使用者主動呼叫。
- 主要檔案：`.prompt.md`
- 觸發機制：**主動觸發**，在 Chat 中用 `/prompt-name` 呼叫
- 上下文管理：呼叫時會載入對應的 prompt，執行完畢後不會持續影響後續對話，除非再次呼叫
- 適合場景：常用任務指令，例如產生 PR 描述、為這段程式寫單元測試

## 3. Skills（技能）

- 主要用途：封裝**特定領域的專業知識與工作流程**，讓 Copilot 在判斷需要時自動載入使用。
- 主要檔案：`SKILL.md`，包含描述（description）、觸發時機、操作步驟，常搭配工具呼叫
- 觸發機制：**智慧觸發**，Copilot 根據使用者請求與 skill description 判斷是否載入
- 上下文管理：三級載入：初始載入技能描述 → 根據需求載入詳細指令 → 根據情境載入相關文件或資源
- 適合場景：處理需要複雜的多步驟、指令碼執行、文件查詢任務，例如部署至 Azure Web Service、執行診斷及測試流程

## 三者比較

| 特性       | Instructions         | Prompts              | Skills                   |
| ---------- | -------------------- | -------------------- | ------------------------ |
| 主要用途   | 定義編碼規範和準則   | 建立可復用的任務提示 | 賦予專業領域能力         |
| 主要檔案   | `.instructions.md`   | `.prompt.md`         | `SKILL.md`               |
| 觸發機制   | 自動應用到所有對話   | 按需手動呼叫         | 根據任務自動啟動         |
| 可包含內容 | 僅文字指令           | 文字指令和參數       | 指令、指令碼、文件、資源 |
| 上下文管理 | 始終載入             | 單次呼叫             | 漸進式披露（三級載入）   |
| 適合場景   | 程式碼風格、命名規範 | 生成元件、程式碼審查 | 測試流程、資料分析       |

**簡單記憶**：
- **Instructions** = 「你必須這樣做」（規則）
- **Prompts** = 「幫我做這件事」（範本）
- **Skills** = 「遇到這類問題時請這樣處理」（專家知識）
