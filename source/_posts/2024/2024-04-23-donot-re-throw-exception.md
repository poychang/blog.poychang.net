---
layout: post
title: 直接 throw exception，不要重擲例外
date: 2024-04-23 09:08
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: donot-re-throw-exception/
---

在 .NET 程式開發中，我們有時會遇到要處理例外的情況，這時候我們會使用 `try...catch` 來捕捉例外，但有時候我們會遇到要將例外往外拋出的情況，這時候我們應該要直接拋出例外，而不是重新拋出例外。

在 Exception 物件中，`InnerException` 屬性可能會引用另一個 Exception，形成一種鏈接，這樣的設計是故意的，目的是為了提供更完整的錯誤追蹤，以及提供層次化的例外訊息。

當一個 Exception 被捕捉後，可能會發生另一個相關的 Exception。例如，當一個方法因為某個原因失敗並拋出 Exception，而處理這個 Exception 時，又發生了另一個 Exception。此時，第二個 Exception 可以將第一個 Exception 作為其 `InnerException`，這樣可以更清晰地看到事件的發展過程並追蹤錯誤。

這樣的設計不僅帶來清晰的錯誤堆疊，也形成層次化的 Exception 訊息，這種設計允許開發者了解 Exception 的起源和背景，進一步幫助他們定位和修復錯誤，特別是在處理復雜系統或多層應用架構中。

這樣的 Exception 經由多層次的傳遞避免了例外訊息在過程中遺失，但關鍵是，必須直接 `throw;` Exception，而不是 `throw exception;`。

## 驗證

這裡準備了一個遞迴呼叫的方法，會傳入一個要執行的方法，並遞迴指定的次數 (`time`)。

```csharp
void ShowExMessageAndStackTrace(Action<int> action, int time)
{
    try
    {
        action(time);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);
    }
}
```

接者準備了兩種方法，一個是直接拋出例外的方法，另一個是重新拋出例外的方法。

```csharp
var justThrowEx = (int time) =>
{
    try
    {
        RecursiveFunction(time);
    }
    catch (Exception)
    {
        throw; // 直接拋出例外
    }
};
var reThrowEx = (int time) =>
{
    try
    {
        RecursiveFunction(time);
    }
    catch (Exception ex)
    {
        throw ex; // 重新拋出例外
    }
};
```

分別將這兩個方法傳入 `ShowExMessageAndStackTrace` 方法中，並遞迴 3 次，觀察例外訊息和堆疊，輸出的結果附帶在註解中。

```csharp
ShowExMessageAndStackTrace(justThrowEx, 3);
/* Output
This is exception in RecursiveFunction (0)
   at Program.<<Main>$>g__RecursiveFunction|0_3(Int32 count) in C:\ThrowExSampleApp\Program.cs:line 47
   at Program.<<Main>$>g__RecursiveFunction|0_3(Int32 count) in C:\ThrowExSampleApp\Program.cs:line 49
   at Program.<<Main>$>g__RecursiveFunction|0_3(Int32 count) in C:\ThrowExSampleApp\Program.cs:line 49
   at Program.<<Main>$>g__RecursiveFunction|0_3(Int32 count) in C:\ThrowExSampleApp\Program.cs:line 49
   at Program.<>c.<<Main>$>b__0_0(Int32 time) in C:\ThrowExSampleApp\Program.cs:line 8
   at Program.<<Main>$>g__ShowExMessageAndStackTrace|0_2(Action`1 action, Int32 time) in C:\ThrowExSampleApp\Program.cs:line 36
 */

ShowExMessageAndStackTrace(reThrowEx, 3);
/* Output
This is exception in RecursiveFunction (0)
   at Program.<>c.<<Main>$>b__0_1(Int32 time) in C:\ThrowExSampleApp\Program.cs:line 25
   at Program.<<Main>$>g__ShowExMessageAndStackTrace|0_2(Action`1 action, Int32 time) in C:\ThrowExSampleApp\Program.cs:line 36
 */
```

從註解中的輸出訊息可以發現，當直接拋出例外時，例外訊息中會包含所有的呼叫堆疊，而重新拋出例外時，只會包含重新拋出的堆疊，這樣會造成錯誤訊息的遺失。

## 結論

在處理例外時，如果要將例外往外拋出，請使用 `throw;` 而不是 `throw exception;`，這樣可以保持例外訊息的完整性，並提供更清晰的錯誤追蹤。

> 本篇完整範例程式碼請參考 [poychang/ThrowExceptionSampleApp](https://github.com/poychang/ThrowExceptionSampleApp)。

---

參考資料：

* [MS Learn - 例外狀況的最佳做法](https://learn.microsoft.com/zh-tw/dotnet/standard/exceptions/best-practices-for-exceptions?WT.mc_id=DT-MVP-5003022)
* [MS Learn - 例外狀況處理陳述式 throw、try-catch、try-finally 和 try-catch-finally](https://learn.microsoft.com/zh-tw/dotnet/csharp/language-reference/statements/exception-handling-statements?WT.mc_id=DT-MVP-5003022)
