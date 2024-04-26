---
layout: post
title: 關於 Roslyn Analyzers 規則與 SonarQube
date: 2024-04-26 15:34
author: Poy Chang
comments: true
categories: [Typescript, Javascript, Python, CSharp, Dotnet, Blazor, SQL, App, Angular, WebAPI, Azure, Develop, Bot, IoT, AI, Container, PowerShell, Tools, Test, Note, Uncategorized]
---

在寫[在 CI 流程中忽略 SonarQube 的特定分析規則](https://blog.poychang.net/ignore-sonarqube-rule-in-ci-process)這篇文章的時候，發現了一個有趣的資訊，SonarQube Scanner for MSBuild v2.0 這個版本支援第三方 Roslyn 分析器，這對於我們來說是一個很好的消息，因為這樣我們就可以在 SonarQube 上使用第三方的 Roslyn 分析器。

緣由是這樣的，當我在查看某專案的分析結果，在透過 `Why is this an issue` 的時候，像是 `roslyn:CA1822` 這個 `Roslyn` 所提出的建議中，在詳細說明中沒有提供**規則連結**，也就是像下圖 `csharpsquid:S3776` 規則旁邊的連結符號。

![csharpsquid:S3776](https://i.imgur.com/LMEEdq4.png)

![roslyn:CA1822](https://i.imgur.com/lv5zMnM.png)

因此就納悶這個分析規則是怎麼來的，才發覺有一些分析規則是來自於第三方的 Roslyn 分析器，而這些 Roslyn 分析器如何判斷的作法也放在 [dotnet/roslyn-analyzers](https://github.com/dotnet/roslyn-analyzers) GitHub 上，有興趣的人可以去看看。

由於這些規則不是 SonarQube 平台上的內建規則，而是從 SonarQube Scanner 中透過第三方的 Roslyn 分析器來提供建議，因此這些分析規則無法在 SonarQube 上直接關閉，因此若要調整所提供的建議，則需要自己製作 Roslyn plugin 來微調，詳細資訊參考 [SonarSource/sonarqube-roslyn-sdk - Customizing the rules.xml file](https://github.com/SonarSource/sonarqube-roslyn-sdk?tab=readme-ov-file#configuring-nuget-feeds) 和 [SonarQube Scanner for MSBuild v2.0 released: support for third-party Roslyn analyzers](https://devblogs.microsoft.com/devops/sonarqube-scanner-for-msbuild-v2-0-released-support-for-third-party-roslyn-analyzers/?WT.mc_id=DT-MVP-5003022) 這篇的介紹。

---

參考資料：

* [SonarQube Scanner for MSBuild v2.0 released: support for third-party Roslyn analyzers](https://devblogs.microsoft.com/devops/sonarqube-scanner-for-msbuild-v2-0-released-support-for-third-party-roslyn-analyzers/?WT.mc_id=DT-MVP-5003022)
