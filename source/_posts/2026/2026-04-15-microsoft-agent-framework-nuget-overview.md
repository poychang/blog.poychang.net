---
layout: post
title: Microsoft Agent Framework 套件概覽
date: 2026-04-15 21:12
author: Poy Chang
comments: true
categories: [Dotnet, Develop, AI]
permalink: microsoft-agent-framework-nuget-overview/
---

Microsoft Agent Framework 是用於構建智能代理 (AI Agent) 的框架，於 4 月正式發布了 1.0.0 版，這版本的發布對企業來說非常重要，因為代表這個框架已經準備好可用於企業環境，也就是說除非有非常充分的理由，否則不會再有破壞性變更。

# 簡介

簡單介紹一下，Microsoft Agent Framework 是支援 Python 和 C# 開發框架，這裡主要會以 C# 版本為主來探討。這框架會是由多個 C# 的 NuGet 套件所集合而成，用來定義 Agent 並與 AI 進行互動。

因此，你可以用它來：

- 定義 Agent
- 撰寫 Prompt
- 操作資料與事件（包含使用者事件）
- 提供工具（Tool），用來取得額外資料或執行動作

同時此框架也提供一個工作流程引擎（Workflow Engine），可以定義預先規劃好的操作序列，並建立 Agent 型的工作流程模式（agentic workflow patterns）。

# 套件概覽

整體來說，Microsoft Agent Framework 包含 28 個 NuGet 套件，涵蓋不同領域，這裡我分成以下幾個類別來說明：

- 核心與抽象層
- 模型與擴充
- 平台整合
- 工作流程
- 協定與互通
- 執行環境與 Hosting
- 資料與儲存
- 舊版與淘汰

方便使用，這裡先列出目前 (2026/04/15) 已經 GA 的套件：

- [Microsoft.Agents.AI](https://www.nuget.org/packages/Microsoft.Agents.AI)
- [Microsoft.Agents.AI.Abstractions](https://www.nuget.org/packages/Microsoft.Agents.AI.Abstractions)
- [Microsoft.Agents.AI.OpenAI](https://www.nuget.org/packages/Microsoft.Agents.AI.OpenAI)
- [Microsoft.Agents.AI.Workflows](https://www.nuget.org/packages/Microsoft.Agents.AI.Workflows)
- [Microsoft.Agents.AI.Workflows.Generators](https://www.nuget.org/packages/Microsoft.Agents.AI.Workflows.Generators)
- [Microsoft.Agents.AI.Foundry](https://www.nuget.org/packages/Microsoft.Agents.AI.Foundry)

> 原則上只要底層技術還在 Preview 或 RC 階段，就不會將該套件正式上線。

## 核心與抽象層

* [Microsoft.Agents.AI](https://www.nuget.org/packages/Microsoft.Agents.AI)
  * 用途：提供 Agent Framework 的核心執行邏輯與基本能力
  * 備註：作為主要開發基礎

* [Microsoft.Agents.AI.Abstractions](https://www.nuget.org/packages/Microsoft.Agents.AI.Abstractions)
  * 用途：定義各種 Agent 相關介面（interface）供擴充與實作
  * 備註：開發擴充套件時使用

## 模型與擴充

* [Microsoft.Agents.AI.OpenAI](https://www.nuget.org/packages/Microsoft.Agents.AI.OpenAI)
  * 用途：整合 OpenAI 模型（如 GPT）進入 Agent Framework
  * 備註：屬於主要 AI 能力入口

* Microsoft.Agents.AI.Anthropic
  * 用途：整合 Anthropic 模型（如 Claude）
  * 備註：技術上接近穩定，但尚未 GA，目前狀態為 RC

## 平台整合

* [Microsoft.Agents.AI.Foundry](https://www.nuget.org/packages/Microsoft.Agents.AI.Foundry)
  * 用途：與 Microsoft Foundry 平台整合，建立與管理 agents
  * 備註：GA，現代 agent 開發的主要入口

* Microsoft.Agents.AI.Purview
  * 用途：整合 Microsoft Purview（資料治理與合規）
  * 備註：仍在早期階段，目前狀態為 RC

* Microsoft.Agents.AI.CopilotStudio
  * 用途：整合 Copilot Studio
  * 備註：Preview，平台尚未成熟

* Microsoft.Agents.AI.GitHub.Copilot
  * 用途：與 GitHub Copilot SDK 整合
  * 備註：Preview

## 工作流程

* [Microsoft.Agents.AI.Workflows](https://www.nuget.org/packages/Microsoft.Agents.AI.Workflows)
  * 用途：定義與執行 Agent 的流程（workflow orchestration）
  * 備註：提供程式化的工作流程定義與執行引擎

* [Microsoft.Agents.AI.Workflows.Generators](https://www.nuget.org/packages/Microsoft.Agents.AI.Workflows.Generators)
  * 用途：協助產生 workflow 定義（程式化生成工作流程）
  * 備註：

* Microsoft.Agents.AI.Workflows.Declarative
  * 用途：以 YAML 定義 workflow（Declarative 模式）
  * 備註：功能尚未完全成熟（not fully baked），目前狀態為 RC

* Microsoft.Agents.AI.Workflows.Declarative.Foundry
  * 用途：以 YAML 定義 workflow（Declarative 模式）
  * 備註：功能尚未完全成熟（not fully baked），目前狀態為 RC

## 協定與互通

* Microsoft.Agents.AI.DevUI
  * 用途：展示 Agent 的 UI 範例
  * 備註：Preview，僅示範用途

* Microsoft.Agents.AI.A2A
  * 用途：Google agent-to-agent 協定，做不同 Agent 間互通
  * 備註：Preview，尚未完成

* Microsoft.Agents.AI.AGUI
  * 用途：支援串流回應的 Agent-User Interface （AG-UI）
  * 備註：Preview，協定仍在演進

## 執行環境與 Hosting

* Microsoft.Agents.AI.Hosting
* Microsoft.Agents.AI.Hosting.OpenAI
* Microsoft.Agents.AI.Hosting.AGUI.AspNetCore
  * 用途：將 Agent 部署於 ASP.NET Core
  * 備註：依賴尚未穩定的協定（如 AGUI、A2A），目前狀態為 Preview

* Microsoft.Agents.AI.Hosting.A2A
* Microsoft.Agents.AI.Hosting.A2A.AspNetCore

* Microsoft.Agents.AI.Hosting.AzureFunctions
  * 用途：Serverless 方式執行 Agent
  * 備註：目前狀態為 Preview

## 資料與儲存

* Microsoft.Agents.AI.FoundryMemory
  * 用途：Agent 記憶體與上下文管理
  * 備註：目前狀態為 Preview

* Microsoft.Agents.AI.DurableTasks
  * 用途：長流程與狀態管理（Durable Functions）
  * 備註：目前狀態為 Preview

* Microsoft.Agents.AI.CosmosNoSQL
  * 用途：使用 Cosmos DB 作為儲存 backend
  * 備註：與 Spectre Data 相關，目前狀態為 Preview

## 舊版與淘汰

* Microsoft.Agents.AI.AzureAI
  * 用途：不建議使用
  * 備註：已被 Microsoft.Agents.AI.Foundry 套件取代

* Microsoft.Agents.AI.Workflows.Declarative.AzureAI
  * 用途：不建議使用
  * 備註：已改名成 Microsoft.Agents.AI.Workflows.Declarative.Foundry

* Microsoft.Agents.AI.AzureAI.Persistence
  * 用途：不建議使用
  * 備註：已被 Microsoft.Agents.AI.Foundry 套件取代

---

參考資料：

- [Microsoft Agent Framework Version 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/?WT.mc_id=DT-MVP-5003022)
- [NuGet Packages for Microsoft Agents AI](https://www.nuget.org/packages?q=Microsoft.Agents.AI&includeComputedFrameworks=true&prerel=true)
