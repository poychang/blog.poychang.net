---
layout: post
title: Polyglot Notebooks 基本玩法
date: 2021-04-01 19:21
author: Poy Chang
comments: true
categories: [Javascript, CSharp, Dotnet, SQL, PowerShell, Tools]
permalink: play-with-dotnet-interactive-notebook/
---

我們已經可以在 [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/notebooks/notebooks-guidance?WT.mc_id=DT-MVP-5003022) 中使用 Jupyter Notebooks，那麼地表上最強的編輯器 Visual Studio Code 能否支援呢？當然可以，只要安裝 [Polyglot Notebooks](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-interactive-vscode) 這個擴充套件，就可以玩 Jupyter Notebooks 囉，來看看 Polyglot Notebooks 怎麼玩吧。

>Polyglot Notebooks 的前身是 .NET Interactive Notebooks，引擎本身仍將稱為 .NET Interactive。[之所以會改名](https://devblogs.microsoft.com/dotnet/dotnet-interactive-notebooks-is-now-polyglot-notebooks/)，只是是為了充分反映 Polyglot Notebooks 能支援的語言非常豐富，不僅是 .NET 家族。
>
>Polyglot Notebooks 的引擎 .NET Interactive，所有相關核心文件都在 [dotnet/interactive](https://github.com/dotnet/interactive) 這個 GitHub 專案中。

## 簡介

像我自己有時候在處理一些流程或筆記會希望能在文件中加入可即時互動的程式碼，即時產生文件所需要的資料，又或者藉由程式碼來幫助工作流程的處理，而且能在程式碼中加上 Markdown，這樣可以更詳盡的說明流程。

Jupyter Notebooks 就相當適用於這種情境，但如果你不想安裝 Jupyter 或 Python 了話，可以安裝 [Polyglot Notebooks](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-interactive-vscode) 這個 VSCode 擴充套件，讓你可以輕鬆玩 Jupyter Notebooks。

## Kernels Overview

![.NET Interactive Architectural Overview](https://i.imgur.com/Cx42MvH.png)

上面這張圖 是 .NET Interactive 的核心架構圖，也就是 Polyglot Notebooks 的引擎，這個架構圖大概有個概念就好，如果想更深入了解這個架構內部是怎麼溝通的，可以參考[這篇文件](https://github.com/dotnet/interactive/blob/main/docs/kernels-overview.md)。

Polyglot Notebooks 現階段支援 7 種 Subkernel，分別是 C#、F#、PowerShell、JavaScript、HTML、Markdown、Mermaid 以及 SQL 和 KQL。

這裡主要會使用 C# Subkernel。

## 基本使用

當你在 VSCode 安裝完 Polyglot Notebooks 擴充套件後，可以按 `ctrl` + `shift` + `P` 並輸入 `notebook`，會列出下圖清單，此時選擇 `Polyglot Notebook: Create new blank notebook` 建立空白的 Notebook 檔案。也可以按 `ctrl` + `shift` + `alt` + `N` 快速建立空白 Notebook。

![建立空白的 Notebook](https://i.imgur.com/6A39nOr.png)

主介面相當單純，基本上只分 Code 和 Markdown 兩種區塊選擇，根據你當前需要做添加即可。

![主介面](https://i.imgur.com/TVdvOJO.png)

如果是 Code 區塊，則可以在右下角選擇該區塊要使用哪個 Subkernel，預設是使用 C# Notebook。

## C# Notebook

C# Notebook 所使用的語法是修改版的 C# Script，也就是使用 `.csx` 腳本的格式，因此跟平常寫的 C# 不一樣，但也差不多。

預設的情況下，會預設載入以下套件參考：

- .NETStandard.Library
- Microsoft.AspNetCore.Html.Abstractions
- Microsoft.DotNet.Interactive
- Microsoft.DotNet.Interactive.Formatting

並且預設使用以下 namespace：

- System
- System.Collections
- System.Collections.Generic
- System.Ling
- System.Threading.Tasks
- System.Text
- Microsoft.DotNet.Interactive
- Microsoft.DotNet.Interactive.Formatting

>雖然預設使用上述 namespace，但建議還是手動寫上像是 `using System;` 的語法在 Code 區塊中，這會讓 IntelliSense 比較不會出問題。

### 呼叫 REST API 範例

下圖是寫一個用 .NET 的 HttpClient 呼叫 REST API 的程式碼：

![呼叫 REST API 範例](https://i.imgur.com/EEzeQ7k.png)

中間的 C# 程式碼，大家應該不陌生，這部分就不解釋了。

你或許會注意到開頭和結尾出現 `#!csharp` 和 `#!time` 這個奇怪的東西。這兩個算是特殊指令，文件叫他們 Magic Commands（稍後的文章內容會再介紹）。那他們主要是做什麼用的呢？

因為 Polyglot Notebooks Extension 預設會使用 C# Subkernel，當然我們可以從右下角手動指定，但重新開啟檔案時，又會跳回預設值了，所以可以使用 `#!csharp` 這 Magic Command 來指定該 Code 區塊要使用 C# Subkernel，其他 Subkernel 則有對應不同的 Magic Command。

>除了預設使用 C# Subkernel 所造成的問題外，有時候會混用 Subkernel 的情況出現，所以建議 Code 區塊都手動加上對應的 Subkernel Magic Command 會比較好。

`#!time` 這個則是會再執行該 Code 區塊後，在下方的執行結果區塊中，顯示此區塊的執行時間，方便我們了解該段程式花了多久使間。

### 安裝並還原 NuGet Package

都用 C# 了，當然免不了要用 NuGet 來安裝第三方套件囉。

要在 C# Notebook 裡面安裝並使用 NuGet 套件，也是需要 Magic Command 幫忙，直接來看範例。

![安裝並還原 NuGet Package](https://i.imgur.com/x4JaU7D.png)

首先要設定 NuGet 套件的來源 URL，這裡使用公開的 NuGet.org 的 URL，當然你也可以設定成你自己架設的私有 NuGet Server，設定的指令需要使用 `#i` Magic Command，如下：

```csharp
// NuGet.org 的套件來源
#i "nuget:https://api.nuget.org/v3/index.json"
// 這組是 dotnet 的 Pre-release NuGet 套件來源
#i "nuget:https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet-tools/nuget/v3/index.json"
// 這組是使用本機環境下的 NuGet 套件來源
#i "nuget:C:\myorg\mypackage\src\bin\Release"
```

有了套件來源後，就可以使用 `#r` Magic Command 來加入參考，後面直接接套件名稱和指定的版本即可，如果在 Polyglot Notebooks 的引擎 .NET Interactive 中找不到該套件，則會嘗試用你所設定的套件來源進行下載及安裝，下面用 Json.NET 來當範例：

```csharp
#r "nuget:Newtonsoft.Json,13.0.1"
```

>請注意，同一個 Notebook 中，同一個套件不能同時安裝不同版本的套件版本。

## Magic Commands

剛剛看到很多 [Magic Commands](https://github.com/dotnet/interactive/blob/main/docs/magic-commands.md) 的使用，看的出來這是 Polyglot Notebooks 中很必學的指令，而這類型的指令在 Jupyter 中也很常被使用到，下面就來看看這些把複雜動作變簡單的神奇指令吧！

Magic Commands 會以 `#!` 或 `#` 作為前綴，通常會用前者，後者則是會用在特定語言的編譯器中，例如同時支援 C# 和 F# 的指令才會用 `#` 前綴，而 Magic Commands 分兩種類型，通用型和特定語言專用，首先我們先來看一下通用型。

### 通用型

這類型的 Magic Commands 適用於所有 Code 區塊，基本上可以再分成兩類，宣告類和功能類。

宣告類主要用於宣告該 Code 區塊是使用哪個 Subkernel，清單如下：

- `#!csharp` 或用 `#!c#`, `#!C#`
- `#!fsharp` 或用 `#!f#`, `#!F#`
- `#!pwsh` 或用 `#!powershell`
- `#!javascript` 或用 `#!js`
- `#!html`
- `#!markdown`

前面也有提到，Polyglot Notebooks 的 Code 區塊預設是使用 C#，但為了明顯提示該區塊的語法是哪種 Subkernel，建議在每個 Code 區塊都手動加上對應的 Subkernel Magic Command 會比較好。

至於功能類則有：

- `#!lsmagic` 列出當前所有可用的 Magic Commands
- `#!log` 開啟詳細執行日誌，可以在執行結果區塊看到更多執行時的日誌資訊
- `#!about` 顯示當前 .NET Interactive 的版本訊息
- `#!time` 測量並顯示該區塊執行時間
- `#!value` 儲存值，需搭配 `#!share` 使用

>以上這些 Magic Commands 大多直接宣告上去即可，部分指令是有參數值可以設定，這部分就去官方文件找找吧。

在 Polyglot Notebooks 中的各個 Code 區塊是可以共享變數的，並且是用 Call by Reference 的方式呼叫，因此變數可以跨 Code 區塊使用，而且在 .NET Interactive 所支援的 3 種語言（C#、F#、PowerShell）中互相共用（可以參考上面 Kernels Overview 的架構圖）。

而上面的 `#!value` 相當特別，許多時候我們會想要直接使用文本，例如 JSON、CSV、XML 這類型的文本，這時候就可以用 `#!value` 來儲存這些文本資料，並用 `#!share` 指令讓該變數可以跨 Code 區塊使用，使用起來如下圖：

![使用 #!value 儲存文本，並用 #!share 跨區塊取得值](https://i.imgur.com/971ZzLV.png)

`#!value` 有三種儲存值的方式：

1. 直接從區塊中取得要儲存的文本
2. 從檔案取得文本
3. 從 URL 取文本

對應順序的操作語法如下：

```csharp
#!value --name 變數名稱
#!value --from-file 檔案位置 --name 變數名稱
#!value --from-url 資料網址 --name 變數名稱
```

然後不管哪種取得文本的方式，都可以在後面加上 `--mime-type` 來指定該文本的 MIME 類型，讓你用更適合的方式顯示該資料。

### 特定語言專用

目前預設只有 C# 和 F# 有特定語言專用的 Magic Commands，而這兩個語言是通用的，所以一起介紹。

- `#i` 設定 NuGet 套件來源
- `#r` 將套件加入參考
- `#!share` 從 `#!value` 取得共享的變數
- `#!who` 顯示頂層變數的名稱（就是最外層 var 的變數）
- `#!whos` 顯示頂層變數的名稱、類型和值

前三個指令在上面文章都有介紹到了，至於 `#!who` 和 `#!whos` 用途相當單純，就是用比較清楚的方式呈現變數資訊，這通常會在開頭的 Code 區塊中用到，因為我們通常會在開頭先處理好幾個初始化用的參數，或者在流程的過程中，想要知道當前變數的狀態，也可以透過此指令來達成。

### 自訂 Magic Commands

除了預設提供的 Magic Commands，你甚至可以撰寫自己的 Magic Commands，方法請參考[這份文件](https://github.com/dotnet/interactive/blob/main/docs/extending-dotnet-interactive.md)，這裡不多作介紹。

## 後記

基本的 Polyglot Notebooks 使用資訊差不多就這樣，光有這些功能就可以玩出很多有趣 Notebook，並且足以讓我可以把一些流程動作，用文件的方式呈現，並且可以邊看邊執行，相當直覺也容易交接給下一個接手的人，歡迎大家分享你們使用 Notebook 的心得和有趣的用法。

----------

參考資料：

* [.NET Interactive is here!](https://devblogs.microsoft.com/dotnet/net-interactive-is-here-net-notebooks-preview-2/)
* [dotnet/interactive](https://github.com/dotnet/interactive)
* [.NET Interactive - Magic Commands](https://github.com/dotnet/interactive/blob/main/docs/magic-commands.md)
