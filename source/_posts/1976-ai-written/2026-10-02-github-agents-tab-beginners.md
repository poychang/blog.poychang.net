---
layout: post
title: 新手也能用的 GitHub Agents Tab：從開始任務到檢視變更
date: 2026-10-02 12:00
author: Nova
comments: true
categories: [AI-Cowork, GitHub]
permalink: github-agents-tab-beginners/
---

如果你已經在 GitHub 上放了程式碼，但還不太熟悉怎麼改程式或建立 Pull Request，可以試著把一些小任務交給 GitHub Copilot 的雲端代理（Copilot cloud agent）。你可以在 GitHub 網頁上描述需求，讓它在背景研究程式庫、修改程式，接著由你檢查變更，再決定是否建立 Pull Request。

GitHub 的 **Agents tab** 是開始和管理這些代理任務的入口之一。這篇文章會帶你了解基本使用流程、費用怎麼看，以及哪些工作適合先交給它試試。

## Agents tab 是什麼？

Agents tab 是 GitHub 程式庫中的代理任務入口。從這裡開始的 Copilot cloud agent 工作會在背景執行；它可以了解程式庫、依照你的要求在分支上做變更，讓你在 GitHub 上繼續查看進度與檢查結果。

簡單來說，流程像這樣：

```text
描述任務
    ↓
Copilot 在背景研究並修改程式庫
    ↓
檢查工作記錄、變更差異與測試結果
    ↓
視需要請它調整
    ↓
確認後建立 Pull Request
```

它和在 VS Code 等編輯器使用的 Copilot agent mode 不完全相同：cloud agent 在 GitHub 提供的雲端環境工作，通常把變更放到分支上；IDE 的 agent mode 則是在你的本機開發環境編輯檔案。

## 開始前需要什麼？

- 一個你有權限使用的 GitHub 程式庫。
- 可使用 Copilot cloud agent 的 Copilot 方案與帳號權限。
- 若使用組織或企業的 Copilot，管理員可能需要先啟用 cloud agent。

因此，即使你看不到 Agents tab，也不一定是操作錯誤；可能是方案、帳號權限或程式庫設定尚未提供這項功能。可以先向程式庫擁有者或組織管理員確認。

## 從 Agents tab 開始一項任務

以下用「請 Copilot 幫忙改善程式庫的 README」當例子。

1. 打開 GitHub 上的程式庫，選取 **Agents** tab。
2. 在新任務欄位選擇要處理的程式庫。
3. 寫下具體要求，例如：

   ```text
   請閱讀目前的 README，找出安裝與執行步驟中不清楚的地方。
   先列出你建議修改的內容，不要修改程式碼。
   ```

4. 視需要選擇變更所依據的分支；如果畫面提供模型選項，也可以選擇模型。
5. 送出任務，等待 Copilot 在背景處理。

初次使用可以先從「研究程式庫」或「提出修改建議」開始，熟悉結果之後再請它直接編輯。指令越清楚，越容易判斷它完成的內容是否符合預期。除了目標，也可以交代限制與完成條件，例如「只修改 README」、「保留現有章節順序」或「修改後執行文件檢查」。

## 怎麼檢查 Copilot 的變更？

任務完成後，不要只看它的文字摘要就直接接受結果。打開 session 記錄，依序確認：

1. **它實際做了什麼**：查看工作記錄與完成摘要，確認任務沒有偏離原本要求。
2. **哪些檔案被修改**：進入 **Diff** 檢查逐行差異；需要更多上下文時，也可以開啟它使用的分支檢視檔案。
3. **驗證是否通過**：查看它是否執行測試或檢查，以及結果是否成功。沒有執行檢查不代表變更一定錯誤，但你需要自己補上適當驗證。
4. **不符合預期就繼續交代**：在同一個 session 說明要修正的地方，例如「只更正文檔，不要變更範例程式」。
5. **確認後再建立 Pull Request**：Pull Request 會把變更交給你或其他人正式檢視；建立之後，仍應依照一般程式碼審查流程檢查，不能因為是 Copilot 寫的就直接合併。

從 Agents tab 的提示開始一項任務時，Copilot 預設會先在分支上工作，讓你可以先看差異、再決定何時建立 Pull Request。若你一開始就希望它建立 Pull Request，也可以在提示中特別說明。

## 使用 GitHub Agents 要多少費用？

GitHub Copilot 的 AI 功能依使用量計算 **GitHub AI Credits（AI 點數）**。一次互動消耗多少，會受到所選模型及輸入、輸出等 token 數量影響。簡單問答通常比跨多個檔案、需要多次操作的長任務消耗少；Copilot cloud agent 也會使用 AI 點數。

以 GitHub 個人方案的官方說明為例，付費方案目前包含下列每月 AI 點數：

| Copilot 個人方案 | 月費（美元） | 每月 AI 點數 |
| --- | ---: | ---: |
| Pro | $10 | 1,500 |
| Pro+ | $39 | 7,000 |
| Max | $100 | 20,000 |

Copilot Free 也有 AI 點數額度，但上述表格只列出個人付費方案。超出方案內含用量後，是否能繼續使用及是否產生額外費用，取決於帳號的額外用量設定；GitHub AI Credits 的換算基準是 **1 點等於 0.01 美元**。未使用的每月額度不會累積到下個月。公司或企業方案的額度與支出控制方式不同，可能採組織共用額度並由管理員設定政策。

這些費用是 Copilot 訂閱與 AI 使用量，不是每個 GitHub 程式庫或每次建立 Pull Request 固定收費。要查看自己目前方案、額度和已用量，請以 GitHub 帳號中的 Copilot 使用量與帳單頁面為準；方案價格、模型價格與額度可能調整，使用前也應查看官方最新說明。

## 哪些任務適合交給 Agent？

適合先嘗試的是**範圍明確、影響有限，而且容易檢查**的工作，例如：

- 說明程式庫目錄與主要程式的用途。
- 找出 README 的過期步驟，並提出修改建議。
- 更新文件、補充使用範例或修正拼字。
- 為已知的小問題提出修正並補上測試。
- 針對一個小範圍的重複程式碼提出重構方案。

像「改善這個程式庫」這種範圍太大的要求，就不容易知道什麼算完成。可以先請 Agent 研究程式庫並列出計畫，再把工作拆成幾個小任務。若工作涉及付款、權限、安全性、資料刪除等高風險功能，應由熟悉系統的人主導設計與審查，不能把判斷責任交給 Agent。

## 新手使用時的幾個提醒

- **先讀懂再合併**：Diff 顯示實際修改，不是形式上的核准按鈕；確認每個重要變更符合需求。
- **把成功條件寫清楚**：說明要改什麼、不應改什麼，以及如何驗證。
- **不要提供不必要的秘密**：提示中不要貼上密碼、API 金鑰或存取權杖。
- **留意額度與額外用量**：大型或反覆迭代的任務會增加使用量；若不希望超出額度後產生額外支出，先確認帳號或組織的預算政策。
- **把 Pull Request 當成待審查的提案**：Agent 可以產生變更，但是否正確、是否符合專案需求，仍要由人來決定。

## 總結

GitHub Agents tab 讓你可以直接從程式庫交辦 Copilot cloud agent 任務，追蹤它的工作，在建立 Pull Request 前檢查變更。新手可以從文件更新、程式庫探索等容易核對的小任務開始，熟悉後再逐步嘗試更複雜的工作。

記住最重要的原則：**清楚交代任務、仔細檢查差異、了解自己的 Copilot 額度，並由自己決定是否接受變更。**

---

## 參考資料

- [GitHub Copilot cloud agent 官方介紹](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent)
- [在 GitHub 上使用 Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github)
- [使用 Copilot cloud agent 研究、規劃與逐步修改程式碼](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/research-plan-iterate)
- [個人方案的 Copilot 用量計費說明](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing)
- [組織與企業方案的 Copilot 用量計費說明](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)
- [GitHub Copilot 模型與價格](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)
- [管理 Copilot cloud agent 的存取權](https://docs.github.com/en/copilot/concepts/enterprise/cloud-agent-access)

聲明：此篇文章使用 AI 工具產生，請自行判斷文章內容的正確性。
