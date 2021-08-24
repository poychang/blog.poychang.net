---
layout: post
title: C# 9 另一種檢查 Null 的方法
date: 2021-08-9 22:23
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
---

語法糖這東西，懂的人就看得很舒服，不懂的人就看不懂。C# 9 有另一種檢查物件是否為 Null 的方式，很簡單，看過一次之後遇到就不會看不懂了。

過去我們檢查是否為 Null 最常用的方式大改長得像下面這樣：

```csharp
if (name == null)
{
    throw new ArgumentNullException(nameof(name));
}
```

到了 C# 7 的時候，推出了 [`is` 運算子](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/is?WT.mc_id=DT-MVP-5003022)，讓我們可以用可讀性更高的方式來檢查 Null，如下：

```csharp
if (name is null)
{
    throw new ArgumentNullException(nameof(name));
}
```

同時，C# 7 來另外推出了 [`_` 捨棄](https://docs.microsoft.com/zh-tw/dotnet/csharp/fundamentals/functional/discards?WT.mc_id=DT-MVP-5003022)和 [`??` 聯合運算子](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/null-coalescing-operator?WT.mc_id=DT-MVP-5003022)，這讓上面的程式碼可以變得更簡潔，如下：

```csharp
_ = name ?? throw new ArgumentNullException(nameof(name));
```

在 C# 7 就可以有這麼多種變化可以使用了，在 C# 8 的時候對[模式比對(Pattern Matching)](https://docs.microsoft.com/zh-tw/dotnet/csharp/fundamentals/functional/pattern-matching?WT.mc_id=DT-MVP-5003022)的特性有了大幅度的增強，讓我們可以用這樣的方式來檢查某物件是否**不是** Null：

```csharp
if (name is object) { }
```

這個寫法還有另一種比較天書的寫法，長這樣：

```csharp
if (name is {}) { }
```

這兩個運作的原理是 C# 7 的 `is` 有了模式比對的能力之後，進而在 C# 8 的 `is` 運算子擴充了此能力，增加了[屬性比對（Property Pattern）](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/patterns#property-pattern?WT.mc_id=DT-MVP-5003022)能力，因此可以用來判斷某物件是否包含於 `{}` （相當於 `object` 物件），除了 Null 之外的物件都是會被包含於 `{}` 的，所以也就代表該物件**不是** Null，這個判斷式得以成立。

此外，這樣的寫法還可以在後面加上別名，將原本的變數名稱改成另一個名稱，如下面的 `alias` 就是 `name` 的別名：

```csharp
if (name is {} alias) { }
```

到了 C# 9 的時候，對於 `is` 運算子又進行了特性上的擴充，讓我們可以使用 `is not` 這個 [邏輯模式(Logical Patterns)](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/patterns#logical-patterns?WT.mc_id=DT-MVP-5003022)來判斷某物件是否**不是** Null，來看看下面的寫法：

```csharp
if (name is not null) { }
```

不用解釋應該也知道這段判斷式在講什麼吧，可讀性非常的高！

## 後記

每一種做法都相當簡單，稍微讀過一次就會了，只是沒有看過了話，還是滿容易就卡住，不知道這段程式碼到底是在做啥。

這就是語法糖的威力！

----------

參考資料：

* [C#: Different ways to Check for Null](https://www.thomasclaudiushuber.com/2020/03/12/c-different-ways-to-check-for-null/)
* [Different ways to check if a value is null in C#](https://www.meziantou.net/null-check-in-csharp.htm)
* [Check for Null/Not Null with is null and is { }](https://intellitect.com/check-for-null-not-null/)
* [MS Docs - is 運算子](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/is?WT.mc_id=DT-MVP-5003022)
* [MS Docs - _ 捨棄](https://docs.microsoft.com/zh-tw/dotnet/csharp/fundamentals/functional/discards?WT.mc_id=DT-MVP-5003022)
* [MS Docs - ?? 聯合運算子](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/null-coalescing-operator?WT.mc_id=DT-MVP-5003022)
* [MS Docs - Pattern Matching 模式比對](https://docs.microsoft.com/zh-tw/dotnet/csharp/fundamentals/functional/pattern-matching?WT.mc_id=DT-MVP-5003022)
* [MS Docs - Property Pattern 屬性比對](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/patterns#property-pattern?WT.mc_id=DT-MVP-5003022)
* [MS Docs - Logical Patterns 邏輯模式](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/patterns#logical-patterns?WT.mc_id=DT-MVP-5003022)
* [MS Docs - 模式](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/proposals/csharp-8.0/patterns?WT.mc_id=DT-MVP-5003022)
