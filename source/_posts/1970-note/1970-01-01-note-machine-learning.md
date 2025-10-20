---
layout: post
title: AI 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, AI]
permalink: note-machine-learning/
---

本篇作為書籤用途，記錄網路上的 AI 參考資料

## LLM Fine-tuning

微調大型語言模型（Large Language Model, LLM）常見的作法：

- 監督式微調（Supervised Fine-tuning, SFT）
- 基於人類反饋強化學習（Reinforcement Learning from Human Feedback, RLHF）
- 直接偏好優化（Direct Preference Optimization, DPO）

DPO 是為了取代 RLHF 而出現的一種訓練方法，那到底該使用 SFT 訓練模型還是該用 DPO 呢？簡單的想法是：要提昇 LLM 回答性能的話該用 SFT、如果要遵守特定價值觀時則用 DPO。

### SFT 與 DPO 的差異

SFT：

- SFT 明確地讓 LLM 訓練在標註資料集上，讓特定的輸入與輸出有著明確的對應
- SFT 用來提高模型的指令遵守能力、正確性
- SFT 相較 DPO 訓練成本較低（DPO 需要有另外一個 reference model）
- SFT 提昇模型對特定領域的理解力和生成能力

DPO：

- DPO 使用 LLM 本身的 base model 作為參考模型（獎勵模型），通過比較模型回應和人類偏好回應來優化回覆策略
- DPO 根據人類偏好調整模型回應，使其更符合標準與期望
- 需要較高的計算資源
- DPO 可以讓 LLM 保持特定的回覆風格或生成特定的倫理標準

---

參考資料：

- [ML.NET](https://www.microsoft.com/net/learn/apps/machine-learning-and-ai/ml-dotnet)
- [Github - dotnet/machinelearning ML.NET Source Code](https://github.com/dotnet/machinelearning)
- [使用 Python 進行資料分析](https://ithelp.ithome.com.tw/users/20107514/ironman/1399)
