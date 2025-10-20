---
layout: post
title: C# 中 IndexOf 和 Contains 的差別
date: 2024-02-01 12:00
author: Poy Chang
comments: true
categories: [AI-Written, CSharp, Develop]
permalink: difference-between-indexof-and-contains-in-csharp/
---

> 聲明：此篇文章使用 AI 工具產生，請自行判斷文章內容的正確性。

```csharp
// 解釋這兩行程式碼的差別
str.IndexOf(" (") != -1
// 
str.Contains(" (", StringComparison.CurrentCulture)
```

這兩行程式碼都是在檢查一個字串 `str` 是否包含子字串 `" ("`。但是，它們的主要差異在於它們處理這個問題的方式和性能。

1. `str.IndexOf(" (") != -1`：這行程式碼使用 `IndexOf` 方法來找出子字串 `" ("` 在 `str` 中首次出現的位置。如果 `IndexOf` 返回 `-1`，那麼表示 `str` 不包含子字串 `" ("`。否則，`str` 包含子字串 `" ("`。這種方法的性能取決於 `str` 的長度，因為 `IndexOf` **需要遍歷整個字串來尋找子字串**。
2. `str.Contains(" (", StringComparison.CurrentCulture)`: 這行程式碼使用 `Contains` 方法來檢查 `str` 是否包含子字串 `" ("`。這種方法的性能通常比 `IndexOf` 更好，因為一旦找到子字串，它就會立即返回，而不需要遍歷整個字串。此外，這種方法還允許你指定一種 `StringComparison` 來控制比較的行為。在這個例子中，我們使用 `StringComparison.CurrentCulture`，這意味著比較會考慮當前文化設定的規則，例如大小寫和排序規則。

總的來說，如果你只是想檢查一個字串是否包含另一個字串，並且不需要知道子字串的位置，那麼 `Contains` 方法通常是一種更好的選擇，因為它的性能通常更好，並且它提供了更多的靈活性來控制比較的行為。

---

參考資料：

* [GitHub Copilot](https://github.com/features/copilot)
