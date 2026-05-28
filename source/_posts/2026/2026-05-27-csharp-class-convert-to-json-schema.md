---
layout: post
title: 將 C# 物件轉成 JSON Schema 用於 AI 結構化輸出
date: 2026-05-27 22:42
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, AI, Tools, App]
permalink: csharp-class-convert-to-json-schema/
---

在開發 AI 結構化輸出功能時，常常需要將 C# 物件轉換成 JSON Schema，以便讓 AI 模型能夠理解和使用這些結構化資料。本文將提供一個簡單的工具來實現這個轉換過程。

[poychang/csharp-class-to-json-schema](https://github.com/poychang/csharp-class-to-json-schema) 提供兩個 Web Component，可將 C# `class` / `record` 模型轉換成 Azure OpenAI Structured Outputs 可接受的 JSON Schema 子集。

## 標準結構化輸出的 JSON Schema

將 `csharp-json-schema-converter` 掛在網頁上的效果如下，你也可以直接用下方的工具來將 C# 類別轉換成用於 AI 做結構化輸出時所需要的 JSON Schema：

<script type="module" src="/assets/components/csharp-json-schema-converter.js"></script>
<csharp-json-schema-converter></csharp-json-schema-converter>

> 這個工具是套用 Microsoft Learn 的[結構化輸出](https://learn.microsoft.com/zh-tw/azure/foundry/openai/how-to/structured-outputs?WT.mc_id=DT-MVP-5003022)這篇文章內容所開發的，該文章有詳細的說明如何使用 JSON Schema 來定義結構化輸出格式。

## 適用於 MAF Response Format 的 JSON Schema

如果是要在 Microsoft Foundry 的 Agent Service 中使用，則需要符合 Agent Service 的 JSON Schema 格式規範，也就是使用 `csharp-json-schema-maf-converter` ，這時可以使用下方的工具來進行轉換，再將生成的 JSON Schema 貼到 Agent 的 JSON 結構描述中即可：

<script type="module" src="/assets/components/csharp-json-schema-maf-converter.js"></script>
<csharp-json-schema-maf-converter></csharp-json-schema-maf-converter>

> 此格式是來自 Microsoft Agent Framework (MAF) 的[程式碼](https://github.com/microsoft/agent-framework/blob/e532ced9509a416e72a14120421e85e8c017b693/dotnet/src/Microsoft.Agents.AI.Hosting.OpenAI/Responses/Models/TextConfiguration.cs#L74)中所定義的格式規範，與一般的 JSON Schema 有些許不同。

---

參考資料：

- [poychang/csharp-class-to-json-schema](https://github.com/poychang/csharp-class-to-json-schema)
- [MS Learn - 結構化輸出](https://learn.microsoft.com/zh-tw/azure/foundry/openai/how-to/structured-outputs?WT.mc_id=DT-MVP-5003022)
- [Microsoft Agent Framework - TextConfiguration](https://github.com/microsoft/agent-framework/blob/e532ced9509a416e72a14120421e85e8c017b693/dotnet/src/Microsoft.Agents.AI.Hosting.OpenAI/Responses/Models/TextConfiguration.cs#L74)
