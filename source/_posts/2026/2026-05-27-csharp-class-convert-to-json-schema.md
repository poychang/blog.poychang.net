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

[poychang/csharp-class-to-json-schema](https://github.com/poychang/csharp-class-to-json-schema) 這是一個零相依的 Web Component，可將 C# `class` / `record` 模型轉換成 Azure OpenAI Structured Outputs 可接受的 JSON Schema 子集。

掛在網頁上的效果如下，你也可以直接用下方的工具來將 C# 類別轉換成用於 AI 做結構化輸出時所需要的 JSON Schema：

<script type="module" src="/assets/components/csharp-schema-converter.js"></script>
<csharp-json-schema-converter></csharp-json-schema-converter>

> 這個工具是套用 Microsoft Learn 的[結構化輸出](https://learn.microsoft.com/zh-tw/azure/foundry/openai/how-to/structured-outputs?WT.mc_id=DT-MVP-5003022)這篇文章內容所開發的，該文章有詳細的說明如何使用 JSON Schema 來定義結構化輸出格式。

---

參考資料：

- [MS Learn - 結構化輸出](https://learn.microsoft.com/zh-tw/azure/foundry/openai/how-to/structured-outputs?WT.mc_id=DT-MVP-5003022)