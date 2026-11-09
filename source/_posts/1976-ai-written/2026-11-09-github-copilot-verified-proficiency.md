---
layout: post
title: GitHub Copilot 不用考試也能取得 Microsoft Pro Badge：認識 Verified Proficiency
date: 2026-11-09 12:00
author: Nova
comments: true
categories: [AI-Cowork, GitHub]
permalink: github-copilot-verified-proficiency/
---

過去要證明自己熟悉一項開發工具，通常得花時間準備考試。但 GitHub 與 Microsoft 推出的 **Verified Proficiency（驗證熟練度）**，嘗試用另一種方式衡量技能：根據你在實際開發工作中如何使用 GitHub Copilot，持續評估熟練度，並在符合資格時提供可分享的 **Microsoft Pro Badge**。

![GitHub Copilot Verified Proficiency 與 Microsoft Pro Badge 概念封面](https://files.poychang.net/storage/github-copilot-verified-proficiency/cover.png)

*圖 1：Verified Proficiency 概念示意圖，非 GitHub 或 Microsoft 官方介面。*

這項功能於 2026 年 10 月底正式推出。GitHub 隨後發布約六分鐘的[介紹影片](https://www.youtube.com/watch?v=aXK0wctLk5U)，說明如何啟用評估、查看結果，以及把能力展示在 LinkedIn 或 Credly。這不是新的 GitHub Copilot 訂閱方案，而是一套**依實際使用情形累積技能證據的認證機制**。

## 什麼是 Verified Proficiency？

傳統技術認證通常以一次考試或特定實作測驗決定是否通過。Verified Proficiency 則採取持續評估模式：在使用者**明確同意加入（opt-in）**後，分析日常使用 GitHub Copilot 的相關訊號，評估使用者如何將工具融入開發流程。

評估會考慮使用的**廣度、深度與模式**，而不是單純看提問次數或程式碼生成量。可觀察的環境包含 GitHub.com、整合式開發環境（IDE）、命令列（CLI）與行動裝置。換句話說，頻繁呼叫 Copilot，並不必然代表熟練度更高。

此外，評估結果並非永久固定。隨著新的使用證據累積、舊的證據逐漸失去代表性，等級可能上升、持平，也可能下降。

## 五個等級：但目前只開放前三級評估

![五個熟練度等級與目前開放狀態](https://files.poychang.net/storage/github-copilot-verified-proficiency/proficiency-levels.png)

*圖 2：熟練度制度與 2026 年 11 月的開放狀態。*

| 等級 | 代表能力 | 目前狀態 |
| --- | --- | --- |
| **Beginner** | 初步認識 Copilot，能在少數情境使用聊天與程式碼建議。 | 已開放 |
| **Intermediate** | 能跨不同介面與開發情境使用 Copilot，熟悉基本模型選擇、上下文管理與協作功能。 | 已開放 |
| **Proficient** | 在多個儲存庫及持續的工作流程中，熟練運用 Copilot、模型選擇與客製化設定。 | 已開放；可取得 Pro Badge |
| **Advanced** | 能設計、協調與評估 Agentic Workflow，理解模型、工具、上下文的取捨。 | 尚待開放評估 |
| **Expert** | 能建立可重複使用的 AI 輔助能力與系統，整合多個 Agent、工具與治理機制。 | 尚待開放評估 |

**這裡有個容易誤解的地方：**GitHub 雖然定義了五個等級，但截至 2026 年 11 月，正式計算只支援 Beginner、Intermediate 與 Proficient。Advanced、Expert 是後續規劃，不能把五級制度誤寫成目前皆能取得。現階段只要達到 **Proficient**，就符合 Microsoft Pro Badge: GitHub Copilot 的領取條件。

## 如何開始評估與取得徽章？

![GitHub Copilot Verified Proficiency 評估與領取流程](https://files.poychang.net/storage/github-copilot-verified-proficiency/proficiency-workflow.png)

*圖 3：從選擇參與、日常使用到分享徽章的流程示意圖。*

1. 開啟 [GitHub Learn 的 Copilot Proficiency 頁面](https://learn.github.com/proficiencies/copilot/)，使用**個人 GitHub 帳號**登入。
2. 選擇參與熟練度評估。功能採 **opt-in**，不會在未經同意下替使用者計算結果。
3. 照常使用 Copilot 開發。你在 IDE、GitHub.com、CLI 與其他支援環境中的相關使用情形，將逐步形成評估證據。
4. 返回頁面查看熟練度。由於結果取決於累積的使用訊號，**首次評估不一定立即顯示結果**。
5. 當等級達到 Proficient，符合資格的 Microsoft Pro Badge 會顯示於 AI Skills Navigator 的個人檔案中，並可透過 **Credly** 認領及分享。

這項機制**免費且不需要另外參加考試**。不過，官方指出，剛推出時**不支援 Enterprise Managed User（EMU）帳號**；使用組織管理帳號的開發者應先確認帳號類型與企業政策。

## LinkedIn、Credly 與 Pro Badge 有什麼關係？

這三者的用途其實不同：

- **Verified Proficiency** 是評估方法：根據實際使用訊號估算熟練度。
- **Microsoft Pro Badge** 是達到資格後獲得的數位憑證，可透過 **Credly** 認領並分享。
- **LinkedIn** 是展示管道：除了分享 Credly 徽章，也能透過 Connected Apps 放上 GitHub 驗證的能力敘述（capability statement）。

你的結果**預設為私人資訊**，不會自動發布到 LinkedIn。是否展示以及展示在哪裡，都由使用者決定。

## 它跟 GitHub Copilot Certification 有什麼不同？

| 比較項目 | Verified Proficiency / Pro Badge | GitHub Copilot Certification |
| --- | --- | --- |
| 驗證方式 | 依日常 Copilot 使用證據持續評估 | 透過正式考試評估知識與能力 |
| 是否需要另外考試 | 不需要 | 需要 |
| 所反映的能力 | 如何實際使用特定產品 | 對產品、概念與使用情境的掌握 |
| 是否持續變動 | 熟練度可依使用情形更新 | 依證照及其效期／更新規則管理 |

兩者並不互斥。Certification 較接近「你知道如何解決問題嗎？」；Pro Badge 則試圖補上「你是否持續在實務中使用這項工具？」這塊證據。**但 Pro Badge 不是程式碼品質、工程判斷或工作績效的直接認證**，不宜把它當作衡量開發者整體能力的唯一依據。

## 實務上，如何提升自己的 Copilot 使用成熟度？

與其為了累積操作次數刻意使用 Copilot，更合理的方法是讓它參與真實且可驗證的開發工作。例如：在 VS Code 或 Visual Studio 中，從 Chat 與 Inline Suggestions 進一步嘗試 **Agent Mode**；在 Pull Request 使用 Copilot Code Review；透過專案級的 **Custom Instructions** 提供一致的規範；或使用 **MCP、Agent Skills 與 Copilot CLI** 擴充跨工具工作流程。

以上是根據 GitHub Learn 學習路徑整理的**能力進階建議**，**不是官方公布的保證升級公式**。即使完成某個課程、練習或功能，也不代表一定會被評為對應等級。每次使用 AI 產生的修改，仍應由開發者負責審查、測試與決策。

## 隱私與限制：加入之前要先知道什麼？

依 Microsoft 官方說明，熟練度計算**不會審閱你的原始程式碼、Prompt 或智慧財產內容**，而是透過產品使用模式進行評估。啟用、查看與對外分享皆由本人控制。這說明的是 *Verified Proficiency 這套評估機制*，不代表所有 Copilot 方案及組織環境的資料處理規範完全相同；企業開發者仍需確認既有的 Copilot 資安與治理設定。

此外，這套制度仍在分階段推出；Advanced 與 Expert 的計分方法尚未正式上線，等級也可能隨時間更新。使用者應避免把某次結果視為永久且全面的技術能力認證。

## 結語：讓「會使用工具」逐漸成為可驗證的能力

Verified Proficiency 值得關注的，不只是一枚徽章，而是它改變了技能認可的時間點：**從某一天通過測驗，轉向長期工作中的可觀察行為。**

對每天使用 GitHub Copilot 的開發者來說，可以先啟用評估、了解自己的目前等級，再循 GitHub Learn 的學習路徑補強薄弱環節。但比起追逐等級，更重要的仍是能否用 Copilot 更可靠地完成需求、測試、Review 與交付。

---

參考資料：

- [GitHub 官方影片：Get your skills recognized with GitHub Copilot verified proficiency](https://www.youtube.com/watch?v=aXK0wctLk5U)
- [GitHub Learn：Copilot Proficiency](https://learn.github.com/proficiencies/copilot/)
- [GitHub Learn：GitHub Copilot 學習路徑](https://learn.github.com/learning-pathways/github-copilot)
- [Microsoft：Introducing a credential based on real work—no test required](https://techcommunity.microsoft.com/blog/skills-hub-blog/introducing-a-credential-based-on-real-work%E2%80%94no-test-required/4519039)
