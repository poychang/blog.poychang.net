---
layout: post
title: 在 Visual Studio 中看見完整 Repository 檔案結構
date: 2026-05-17 16:22
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: view-repository-files-in-visual-studio/
---

Visual Studio 是 .NET 開發的主要 IDE，但它的 Solution Explorer 傾向於只顯示被方案或專案納入管理的檔案。這對 C# 專案來說很合理，但對現代 repository-based 開發流程來說，會產生一個明顯落差：許多重要檔案其實不屬於任何 `.csproj`，卻又對開發來說是很重要的設定。

現代的專案中，Repository 內常常包含以下檔案：

```text
.github/
.editorconfig
.gitignore
docs/
scripts/
global.json
Directory.Build.props
Directory.Packages.props
README.md
```

這些檔案通常位於 repository root，但在 Visual Studio 的傳統 Solution Explorer 中卻不容易被看見。特別是當專案有使用 GitHub Actions、GitHub Copilot instructions 等設定檔時，這種落差會變得更明顯。

這時候可以使用 [File Explorer](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WorkflowBrowser) 這個 Visual Studio 擴充套件。

## File Explorer 是什麼

**File Explorer** 是 Mads Kristensen 開發的 Visual Studio 擴充套件，主要功能是在 Solution Explorer 中直接呈現 repository root 或 solution root 底下的實體檔案與資料夾。

它解決的問題很直接：

```text
Visual Studio 原本偏向「方案 / 專案」視角
File Explorer 補上「檔案系統 / Repository」視角
```

這讓 Visual Studio 更接近現代 repository-based 開發工具的使用方式。

## 為什麼需要它

除了 CI/CD 的設定腳本之外，現在許多專案都會使用 GitHub Copilot 之類的 AI 協作工具，這些工具通常需要一些 repository-level 的設定檔，例如在 `.github` 資料夾會包含到以下檔案：

```text
.github/
  workflows/
    build.yml
    release.yml
  instructions/
    csharp.instructions.md
    testing.instructions.md
  prompts/
    code-review.prompt.md
  copilot-instructions.md
```

這些檔案不是 C# 專案的一部分，但它們會影響 CI/CD、AI 協作、開發規範與團隊流程。如果每次要修改這些檔案都必須切到 Windows 檔案總管或 VS Code，就會造成工具切換成本。

File Explorer 的價值就在於：讓 Visual Studio 同時保留「專案導向」與「Repository 導向」兩種視角。

## 後記

File Explorer 補上了 Visual Studio 長期以來在 repository-level 檔案管理上的缺口。

它不是用來取代 Solution Explorer，而是讓 Solution Explorer 從「只看方案與專案」擴展成「同時看見完整 repository」。對於需要管理 `.github`、GitHub Actions、GitHub Copilot instructions、Markdown 文件、建置設定、腳本與基礎設施檔案的 .NET 專案，這個套件能讓 Visual Studio 更接近完整開發工作區。

---

參考資料：

- [madskristensen/WorkspaceFiles](https://github.com/madskristensen/WorkspaceFiles)
- [Visual Studio Marketplace: File Explorer](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WorkflowBrowser)
