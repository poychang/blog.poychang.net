---
layout: post
title: 盡量用正斜線(/)作為路徑分隔符
date: 2025-03-11 11:12
author: Poy Chang
comments: true
categories: [Develop]
permalink: try-to-use-forward-slash-as-the-path-separator/
---

在 Windows 環境下，我們習慣使用反斜線（`\`）作為路徑分隔符，但在跨平台的情況下，建議使用正斜線（`/`）作為路徑分隔符，特別是在 Windows 與 Linux 正在共榮的狀況底下。

- `\` 稱為反斜線，呈現上左下右，一般位於鍵盤 Enter 鍵上方
- `/` 稱為斜線，或叫正斜線，呈現上右下左，一般位於鍵盤 Shift 鍵左方

Windows 之所以使用反斜線（`\`）作為檔案路徑的分隔符，主要是出於歷史上的設計考量。在早期的 MS-DOS 系統中，正斜線（`/`）已經被用作命令列選項的前綴，例如在命令中常見的 `/p` 或 `/w`。因此，為了避免衝突，系統設計者選擇使用反斜線作為目錄之間的分隔符。這一傳統隨後延續到了 Windows 系統中，最終成為 Windows 特有的檔案路徑格式。

反觀，在 Linux 中，檔案路徑的分隔符使用的是正斜線（`/`），而不是反斜線（`\`）。反斜線在 Linux 系統中主要作為逸出字元，用來取消或改變後面字元的特殊意義。例如，在命令列中，如果你想在一個帶有空格或特殊字元的檔案名稱中保持這些字元的字面意義，就需要在它們前面加上反斜線進行轉義。

因此，如果你嘗試像在 Windows 中那樣使用反斜線作為路徑分隔符，Linux 會將它誤解為轉義符，而不會按照你期望的方式解析檔案路徑，從而導致命令執行錯誤或路徑無法識別。正確的做法是使用正斜線來表示路徑。

不過實際上，在 Windows 中你是可以使用正斜線（`/`）作為路徑分隔符的，只是 Windows 會自動轉換為反斜線（`\`）來處理。

![在 PowerShell 中使用正斜線作為路徑分隔符](https://i.imgur.com/EAQJyDT.png)

從上圖可以看出，要在 Windows 使用正斜線（`/`）作為路徑分隔符，是沒有問題的。特別是第二個例子，字串中的路徑分隔符是我手動更改成正斜線（`/`）的。

## 後記

如果是在 Windwos 上做 .NET 開發的工程師，建議你在寫路徑時，特別是寫死路徑的時候，盡量使用正斜線（`/`）作為路徑分隔符，這樣可以讓你的程式碼更具跨平台性。

當然，你也可以使用 `System.IO.Path` 類別的 `Combine` 方法來組合路徑，這樣也不用擔心路徑分隔符的問題了。

---

參考資料：

* [20 year old cloud native apps with .NET - Scott Hanselman - NDC London 2025](https://www.youtube.com/watch?v=w6tRA8qWKQc&t=2336s)
* [MS Learn - System.IO.Path Class](https://learn.microsoft.com/en-us/dotnet/api/system.io.path?WT.mc_id=DT-MVP-5003022)
