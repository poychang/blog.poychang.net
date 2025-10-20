---
layout: post
title: C# 字串對齊格式化：讓 Console 輸出整齊
date: 2025-5-05 00:04
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: aligning-strings-in-console-writeline/
---

在撰寫 C# 程式時，是否曾經希望 `Console.WriteLine()` 輸出的格式能更整齊？特別是在顯示日誌、表格或訊息列表時，畢竟老是用空白鍵對其文字，只會把輸出內容變得更亂七八糟。其實，C# 有一個簡潔有力的解決方案來處理這個問題：欄位寬度格式化（Field Width Formatting）。這個功能可以讓你輕鬆控制輸出時的字串對齊方式與欄位寬度，讓你的 Console 看起來既對齊又清爽。

稍有經驗的 C# 開發者應該都知道，在字串的處理上，可以使用[字串插補](https://learn.microsoft.com/zh-tw/dotnet/csharp/tutorials/string-interpolation?WT.mc_id=DT-MVP-5003022)（string interpolation）來輕鬆將字串與變數做組合。

而字串插補有一個特性就可以幫助我們實現對齊的需求，語法結構如下：

```csharp
{變數[,對齊寬度][:格式字串]}
```

其中「對齊寬度」如果是**正數**則代表：右對齊，**負數**則代表：左對齊。

「格式字串」則是用在處理日期、數字等格式。

## 範例

來看一段簡單的範例，馬上就能理解用法了。

我們有一組訊息清單要依序顯示，要讓訊息中角色和內容更容易閱讀，程式可以這樣寫：

```csharp
var messages = new[]
{
    new { CreatedAt = DateTime.Now, Role = "user", Content = "Hello" },
    new { CreatedAt = DateTime.Now, Role = "assistant", Content = "Hi, how can I help?" },
    new { CreatedAt = DateTime.Now, Role = "system", Content = "Session started" }
};

foreach (var msg in messages)
{
    Console.WriteLine($"{msg.CreatedAt:yyyy-MM-dd HH:mm:ss} - {msg.Role,10}: {msg.Content}");
}
```

輸出的效果如下：

```log
2025-05-11 14:30:00 -       user: Hello
2025-05-11 14:30:00 -  assistant: Hi, how can I help?
2025-05-11 14:30:00 -     system: Session started
```

透過將角色字串做**向右對齊**，這樣一來，角色和內容的排版效果就變得相當容易閱讀了。

## 後記

這種對齊格式化技巧非常適和用在命令列工具（CLI）輸出、日誌記錄（Log）、排版整齊的對話內容。

雖然這只是 C# 格式化功能中的一小部分，但透過這個小技巧，能讓你產生的 Console 輸出更容易閱讀唷。

---

參考資料：

- [MS Learn - C# 中的字串插補](https://learn.microsoft.com/zh-tw/dotnet/csharp/tutorials/string-interpolation?WT.mc_id=DT-MVP-5003022)
