---
layout: post
title: 關於 Roslyn Analyzers 規則與 SonarQube
date: 2024-04-26 15:34
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, Tools]
permalink: roslyn-analyzers-rule-with-sonarqube/
---

在寫[在 CI 流程中忽略 SonarQube 的特定分析規則](https://blog.poychang.net/ignore-sonarqube-rule-in-ci-process)這篇文章的時候，發現了一個有趣的資訊，SonarQube Scanner for MSBuild v2.0 這個版本支援第三方 Roslyn 分析器，這對於我們來說是一個很好的消息，因為這樣我們就可以在 SonarQube 上使用第三方的 Roslyn 分析器。

緣由是這樣的，當我在查看某專案的分析結果，在透過 `Why is this an issue` 的時候，像是 `roslyn:CA1822` 這個 `Roslyn` 所提出的建議中，在詳細說明中沒有提供**規則連結**，也就是像下圖 `csharpsquid:S3776` 規則旁邊的連結符號。

![csharpsquid:S3776](https://i.imgur.com/LMEEdq4.png)

![roslyn:CA1822](https://i.imgur.com/lv5zMnM.png)

因此就納悶這個分析規則是怎麼來的，才發覺有一些分析規則是來自於第三方的 Roslyn 分析器，而這些 Roslyn 分析器如何判斷的作法也放在 [dotnet/roslyn-analyzers](https://github.com/dotnet/roslyn-analyzers) GitHub 上，有興趣的人可以去看看。

由於這些規則不是 SonarQube 平台上的內建規則，而是從 SonarQube Scanner 中透過第三方的 Roslyn 分析器來提供建議，因此這些分析規則無法在 SonarQube 上直接關閉，因此若要調整所提供的建議，則需要自己製作 Roslyn plugin 來微調，詳細資訊參考 [SonarSource/sonarqube-roslyn-sdk - Customizing the rules.xml file](https://github.com/SonarSource/sonarqube-roslyn-sdk?tab=readme-ov-file#configuring-nuget-feeds) 和 [SonarQube Scanner for MSBuild v2.0 released: support for third-party Roslyn analyzers](https://devblogs.microsoft.com/devops/sonarqube-scanner-for-msbuild-v2-0-released-support-for-third-party-roslyn-analyzers/?WT.mc_id=DT-MVP-5003022) 這篇的介紹。

## 後記

後來再查 Microsoft 的 Code Analysis 文件的時候，發現了 [CA1822: Mark members as static](https://learn.microsoft.com/zh-tw/dotnet/fundamentals/code-analysis/quality-rules/ca1822) 這個規則文件中有提到如何忽略這項警告，這邊列出 3 種比較有機會用到的方式。

第一種，當要抑制警告的範圍很小，只有在特定檔案或是只有幾行程式碼了話，可以使用**前置處理器指示詞** (preprocessor directive) 的方式處理，如下範例中的 `#pragma warning disable CA1822`。

```csharp
    try { ... }
    catch (Exception e)
    {
#pragma warning disable CA2200 // Rethrow to preserve stack details
        throw e;
#pragma warning restore CA2200 // Rethrow to preserve stack details
    }
```

第二種，範圍很大，需要在整個專案中忽略這個警告，可以使用 `SuppressMessageAttribute` 的方式來隱藏專案或檔案特定部分的警告，此方法的詳細作法請參考[官方文件](https://learn.microsoft.com/zh-tw/dotnet/fundamentals/code-analysis/suppress-warnings#use-the-suppressmessageattribute)。

第三種是我比較喜歡的做法，同樣是處理範圍很大，需要在整個專案中忽略這個警告，我們可以使用 EditorConfig 或 AnalyzerConfig 設定檔來將該 Roslyn Analyzers 規則做調整，這樣除了不用在程式碼中加入額外的註解，也可以將規則集中在一個設定檔中管理。

使用 EditorConfig 設定檔的作法很簡單，只要在專案資料夾中（就是包含 `.csproj` 專案檔的資料夾中），新增一個 `.editorconfig` 檔案，並加入以下設定寫法：

```ini
[*.{cs,vb}]
dotnet_diagnostic.<rule-ID>.severity = none
```

此設定會針對 `.cs` 和 `.vb` 檔案（可以根據你的需求做調整），將 `<rule-ID>` 的規則設定為 `none`，這樣就可以在整個專案中忽略這個警告，例如我要忽略 CA1822 這個規則，可以這樣寫：

```ini
[*.{cs,vb}]
dotnet_diagnostic.CA1822.severity = none
```

不過一般來說，EditorConfig 主要是會用在編輯版面的通用配置，因此如果是針對特定的分析器規則，我會更推薦建議使用 AnalyzerConfig 設定檔，他的設定方式和 EditorConfig 大致相同。

使用 AnalyzerConfig 設定檔，只要在專案資料夾或是方案資料夾中（就是包含 `.csproj` 專案檔或是 `.sln` 方案檔的資料夾中），新增一個 `.globalconfig` 檔案，並加入以下設定寫法：

```ini
is_global = true
<option_name> = <option_value>
```

`is_global` 的設定值，顧名思義就是套用至整個專案，接著設定規則的部分和 EditorConfig 一樣，例如我要忽略 CA1822 這個規則，可以這樣寫：

```ini
is_global = true
dotnet_diagnostic.CA1822.severity = none
```

如此一來，就可以忽略 Roslyn Analyzers 所提出的 CA1822 警告了，而且這樣的設定方式除了可以集中管理規則，SonarQube 也會讀取這些設定檔，因此在 SonarQube 上也不會再看到這些警告了。

---

參考資料：

* [SonarQube Scanner for MSBuild v2.0 released: support for third-party Roslyn analyzers](https://devblogs.microsoft.com/devops/sonarqube-scanner-for-msbuild-v2-0-released-support-for-third-party-roslyn-analyzers/?WT.mc_id=DT-MVP-5003022)
* [MS Learn - 如何隱藏程式碼分析警告](https://learn.microsoft.com/zh-tw/dotnet/fundamentals/code-analysis/suppress-warnings?WT.mc_id=DT-MVP-5003022)
* [MS Learn](?WT.mc_id=DT-MVP-5003022)
