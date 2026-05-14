---
layout: post
title: 在 Visual Studio 中使用 GitHub Copilot 和 Agent Skills
date: 2026-05-12 16:01
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, AI, Tools]
permalink: using-agent-skills-with-github-copilot-in-visual-studio/
---

上一篇文章我們介紹了在 Visual Studio 中使用 *.instructions.md 等 Markdown 檔案來輔助 GitHub Copilot，這篇文章則是要介紹 GitHub Copilot 的 Agent 搭配 Skills 的功能，特別是使用 .NET 10 推出的 File-Based Apps 特性，撰寫單個 `.cs` 檔案來做為 Agent Skills 的指令功能，讓 GitHub Copilot 的 Agent 可以呼叫這些 Skills 來完成特定的任務。

## Agent Skills 規範

Agent Skills 是一種輕量級、開放的格式，用於擴展 AI Agent 的能力，而實際上，Agent Skills 是由一系列的檔案組成，這些檔案定義了 Agent 的行為、功能和與外部系統的互動方式，並放在以 Skill 名稱為名的資料夾中，例如 `skill-name`，這個資料夾名稱會是未來使用的識別名稱。一個最簡單的 Skill 只需要包含 `SKILL.md` 檔案：

```bash
skill-name/
└── SKILL.md          # 必要：技能描述和使用說明
```

如果有比較複雜的需求，可以使用以下檔案來延伸能力：

```bash
skill-name/
├── SKILL.md          # 必要：技能描述和使用說明
├── scripts/          # 可選：可執行指令碼
│   └── tool.cs
├── references/       # 可選：詳細參考文件
│   └── REFERENCE.md
└── assets/           # 可選：靜態資源
    └── template.json
```

### SKILL.md 的結構

`SKILL.md` 是最主要的檔案，內容包含兩段：YAML Frontmatter 和 Markdown。

Frontmatter 是用來定義技能的基本資訊和規範，必要包含 `name` 和 `description` 兩個欄位，這些資訊會在 Agent 啟動時被載入，幫助 Agent 識別這個技能的功能和適用場景。如下範例：

```markdown
---
name: skill-name
description: 描述技能功能和使用場景的文字，應包含幫助 Agent 識別相關任務的關鍵詞
---
```

除了兩個必要欄位之外，還可以包含一些可選欄位，例如 `license`、`compatibility`、`metadata` 等等，這些欄位可以提供更多關於技能的資訊，但不會影響技能的基本識別和使用。

```markdown
---
name: pdf-processing
description: Extract PDF text, fill forms, merge files. Use when handling PDFs.
license: Apache-2.0
metadata:
  author: example-org
  version: "1.0"
---
```

詳細的 YAML frontmatter 欄位說明可以參考官方文件：[Agent Skills - Specification](https://agentskills.io/specification)。

### Skills 核心價值

Skill 具有非常彈性的使用方式，我們可以藉由 Skills 來實現以下幾個目標：

- 專業知識封裝：將特定領域的過程序性知識（procedural knowledge）和特定的上下文打包
- 按照需求載入：啟動時只載入 Skill 的 `name` 和 `description`，發現適合的任務時才載入完整指令
- 可執行能力：可以包含指令碼、工具程式，擴展 Agent 的實際操作能力
- 版本化管理：Skills 本身就是檔案的集合，易於編輯、版本控制和分享

> 現代認知心理學家普遍認為知識有兩大類，一類為陳述性知識，另一類是知識是`程序性知識`(procedural knowledge)，其為個體沒有明確提取線索，是借助某種活動形式間接推測出來其存在的知識。

因此簡單來說，Skills 的核心價值在於：知識的封裝、能力的重複使用、提升執行準確度。

## .NET File-Based Apps

Agent Skills 本身是支援各種指令碼的，例如常見的 Python、JavaScript、Shell Script 等等，但在 .NET 10 中推出的 File-Based Apps 特性，讓熟習 .NET 生態系的開發者可以直接使用 C# 來撰寫 Agent Skills 的指令碼，這對於 .NET 開發者來說是一個非常友善的選擇。

.NET 10 推出的 File-Based Apps 特性允許開發者將單個 `.cs` 檔案作為完整的應用程式來運行，而不需要傳統的 `.csproj` 專案檔。

因此我們可以撰寫出如下的簡單指令碼，來做為 Agent Skills 的指令功能：

```csharp
#!/usr/bin/env dotnet

#:package Humanizer@3.0.10
#:package Spectre.Console@0.55.2
#:property PublishAot=true

using Humanizer;
using Spectre.Console;

try
{
    var dotNet10Released = DateTimeOffset.Parse("2025-11-11");
    var since = DateTimeOffset.Now - dotNet10Released;
    AnsiConsole.MarkupLine($"[green]✅ 距離 .NET 10 發布已經 {since.Humanize()}[/]");
    return 0;
}
catch (Exception ex)
{
    AnsiConsole.MarkupLine($"[red]❌ 錯誤: {ex.Message}[/]");
    return 1;
}

/* Output:
✅ 距離 .NET 10 發布已經 26 周
*/
```

> 第一行是 Shebang，在 Unix-like 系統中，會用此來指定這個檔案是哪個執行檔執行，`#!/usr/bin/env dotnet` 這裡代表用 dotnet 來執行。

> 這裡是用 `#:property PublishAot=true` 來指定這個 File-Based App 要使用 AOT 編譯模式，這樣在執行時就會有更好的效能表現。

![run cs file-based app](https://files.poychang.net/storage/using-agent-skills-with-github-copilot-in-visual-studio/run-cs-file-based-app.png)

### 使用優勢

選用 .NET File-Based Apps 來撰寫 Agent Skills 的指令碼，有幾項特別的優勢，第一個是這樣的開發方式可以是漸進式的，就像常見的指令檔一樣。我們不需要額外的編譯、建置動作，就可以直接使用，而且我們可以在檔案內直接編輯內容，即時調整處理邏輯和功能，因此從原型到正式版本的過程可以快速迭代。

第二個優勢是在單一檔案中包含了執行相關的所有資訊。這裡我們來和 Python 的 Skill 比較一下。一般來說，用 Python 來寫指令檔的時候，主要處理邏輯會在 `tool.py` 中，但如果需要使用到第三方套件，就需要在 `requirements.txt` 中定義，這樣除了有兩個檔案需要維護，也會讓 Agent 可能多理解一個檔案來源。

```bash
my-skill/
├── scripts/
│   ├── requirements.txt # Agent 需要讀取
│   └── tool.py          # Agent 需要讀取
└── SKILL.md             # Agent 需要讀取
```

使用 .NET File-Based Apps 的話，我們可以直接在同一個 `.cs` 檔案中定義好所有的套件依賴 ()`#:package`)、處理邏輯、以及執行相關的運作細節 (`#:property`)，自然也就不需要額外的檔案來管理套件，讓整體的維護更為簡單。

第三個優勢則是可靠度和效能。由於 .NET 是一個成熟的生態系，擁有豐富的函式庫和工具支援，特別是對企業來說，採用 .NET File-Based Apps 來撰寫 Agent Skills 的指令碼，可以享受到 .NET 生態系帶來的穩定性。

而且雖然 .NET File-Based Apps 看起來是指令檔（或者說腳本）的形式，但實際上它是被 JIT 編譯成 IL 來執行的，因此在多次執行的效能上會比傳統的指令檔更好，而且 .NET 也支援 Native AOT 編譯模式，讓 .NET 程式能接近原生 C++ 性能。

另外，由於 .NET 編譯時就能發現部分錯誤，而不是要等到執行階段才發現，因此在開發 Skill 過程中也能更快地發現問題，提升開發效率及執行可靠度。

## Visual Studio 實戰

要建立在 Visual Studio 中使用 GitHub Copilot 的 Agent Skills 功能，首先需要在正確的路徑中建立 Skill 的資料夾結構（請參考[設定層級](https://blog.poychang.net/using-markdown-to-assist-github-copilot-in-visual-studio/#%E8%A8%AD%E5%AE%9A%E5%B1%A4%E7%B4%9A)），接著撰寫 `SKILL.md` 和 File-Based App 指令碼。

以下用一個簡單的範例來說明，假設我們要建立一個查詢 .NET 最新版本的發布日期 `latest-dotnet-release` Skill。

### 步驟 1：建立目錄結構

首先在專案根目錄下建立 `.github/agents/latest-dotnet-release/` 資料夾：

```
mkdir -p .github/agents/latest-dotnet-release/scripts
cd .github/agents/latest-dotnet-release
```

這裡用的 `mkdir -p` 是一次建立多層資料夾的指令，這樣就會同時建立 `latest-dotnet-release` 和 `scripts` 兩個資料夾。

### 步驟 2：編寫 SKILL.md

`SKILL.md` 是 Agent Skill 的核心，包含指令的中繼資料以及和使用說明。

撰寫中繼資料時請特別注意：

- `name` 必須與目錄名 `latest-dotnet-release` 完全一致
- `description` 包含關鍵詞 "dotnet", ".NET", "latest release" 可以幫助 Agent 識別場景

```markdown
---
name: latest-dotnet-release
description: Query the latest .NET release version and its release date. Use when needing to know about .NET releases.
license: MIT
---

# Latest .NET Release
查詢最新的 .NET 發布版本及其發布日期。

## 使用場景
- 查詢最新的 .NET 發布版本
- 需要了解最新的 .NET 發布日期

## 使用方法
使用 `dotnet ./scripts/tool.cs` 指令碼進行查詢。

## 執行步驟
1. 確認已安裝 .NET SDK 10 以上（支援 .NET File-based App 功能）。
2. 在終端機切換到此 skill 目錄，並執行以下指令：
    ````
    powershell
    dotnet ./scripts/tool.cs
    ````
3. 取得輸出並將該文字原樣回覆給呼叫者。

## 依賴項
- Spectre.Console 美化的控制台輸出

## 注意事項
- 若 `dotnet` 執行失敗（例如 SDK 版本過舊），請告知使用者需升級 .NET SDK 到 10 以上。
```

### 步驟 3：編寫 File-Based App 指令碼

在 `scripts/` 目錄下建立 .NET File-Based App 指令碼 `tool.cs`：

```csharp
#:package Spectre.Console@0.55.2
#:property PublishAot=true

using Spectre.Console;
using System.Net.Http.Json;
using System.Text.Json.Serialization;

try
{
    var dotNetReleaseIndexUrl = "https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/releases-index.json";
    var http = new HttpClient();
    var index = await http.GetFromJsonAsync(dotNetReleaseIndexUrl, NativeAOTJsonContext.Default.Index);
    var latest = index?.ReleasesIndex
        .Where(x => x.SupportPhase.ToLower() == "active")
        .OrderByDescending(x => Version.Parse(x.ChannelVersion))
        .First() ?? new ReleasesIndex();

    AnsiConsole.MarkupLine($"[green]✅ .NET 最新版本為 {latest.LatestRelease}[/]");
    AnsiConsole.MarkupLine($"[green]✅ .NET 最新版本發布日期為 {latest.LatestReleaseDate}[/]");

    return 0;
}
catch (Exception ex)
{
    AnsiConsole.MarkupLine($"[red]❌ 錯誤: {ex.Message}[/]");
    return 1;
}

[JsonSerializable(typeof(Index))]
[JsonSerializable(typeof(ReleasesIndex))]
public partial class NativeAOTJsonContext : JsonSerializerContext { }

public class Index
{
    [JsonPropertyName("releases-index")]
    public ReleasesIndex[] ReleasesIndex { get; set; } = [];
}

public class ReleasesIndex
{
    [JsonPropertyName("support-phase")]
    public string SupportPhase { get; set; } = string.Empty;
    [JsonPropertyName("channel-version")]
    public string ChannelVersion { get; set; } = string.Empty;

    [JsonPropertyName("latest-release")]
    public string LatestRelease { get; set; } = string.Empty;

    [JsonPropertyName("latest-release-date")]
    public string LatestReleaseDate { get; set; } = string.Empty;

    [JsonPropertyName("eol-date")]
    public string EolDate { get; set; } = string.Empty;
}
```

這程式碼會呼叫 .NET 官方提供的 Release Metadata API 來查詢最新的 .NET 發布版本和發布日期，並使用 Spectre.Console 來美化輸出。另外，因為有開啟 Native AOT 編譯模式，因此要特別處理執行時期 JSON 反序列化的型別處理，這裡使用了 .NET 10 的 Source Generator 來生成 JSON 反序列化的程式碼，也就是 `NativeAOTJsonContext` 這段。

### 執行結果

當我們把這個 Agent Skill 的資料夾結構和檔案放在正確的位置後，在 Visual Studio 中使用 GitHub Copilot 會立即偵測到新的 Skill，你可以從 GitHub Copilot 的對話視窗右下角的工具圖示中，切換到`技能`分頁，就會看到當前所有可用的 Agent Skills，這裡就會看到我們剛剛建立的 `latest-dotnet-release` 這個技能。

![載入 Agent Skill](https://files.poychang.net/storage/using-agent-skills-with-github-copilot-in-visual-studio/show-agent-skill.png)

當我們在 Visual Studio 中呼叫這個 Agent Skill 的時候，GitHub Copilot 的 Agent 就會根據 `SKILL.md` 中的描述來識別這個技能的功能，並且執行 `tool.cs` 這個指令碼來完成查詢最新 .NET 發布版本的任務，最後將輸出結果回覆給呼叫者。

![執行 Agent Skill](https://files.poychang.net/storage/using-agent-skills-with-github-copilot-in-visual-studio/execute-agent-skill.png)

## 後記

Agent Skills 是一個非常強大的功能，可以讓我們以非常彈性的方式來擴展 GitHub Copilot 的能力，特別是對於 .NET 開發者來說，使用 .NET File-Based Apps 來撰寫 Agent Skills 的指令碼是一個非常友善的選擇，這樣不僅可以享受到 .NET 生態系帶來的穩定性和效能表現，也能夠更快速地開發和迭代 Agent Skills。

---

參考資料：

- [Agent Skills 官方網站](https://agentskills.io/home)
- [GitHub - agentskills/agentskills](https://github.com/agentskills/agentskills)
- [MS Learn- 檔案型應用程式](https://learn.microsoft.com/zh-tw/dotnet/core/sdk/file-based-apps?WT.mc_id=DT-MVP-5003022)
- [使用 .NET File-Based Apps 編寫高效 Agent Skills 指令碼指南](https://www.cnblogs.com/sheng-jie/p/19381647)
