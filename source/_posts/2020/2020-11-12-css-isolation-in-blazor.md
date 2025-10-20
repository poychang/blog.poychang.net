---
layout: post
title: 在 ASP.NET Core Blazor 應用程式中使用 CSS Isolation
date: 2020-11-12 12:43
author: Poy Chang
comments: true
categories: [Dotnet, Develop]
permalink: css-isolation-in-blazor/
---

這個月迎來了 .NET 5 的同時，Blazor 也開始支援在元件中使用 CSS Isolation，讓你可以自訂某一個元件下的 CSS 樣式，如此一來更能規劃好整個網站程式碼，並且複用元件。

## 基本運作方式

Blazor 的 CSS Isolation 會在編譯時間增加一組 CSS 選擇器並加到 HTML 中，結果像是這樣 `<h1 b-3xxtam6d07>`，後面的 `b-3xxtam6d07` 就是 CSS Isolation 在編譯時期產生的，藉此做到元件內 CSS 樣式。

## 使用 CSS Isolation

假設我們有個 Blazor 專案叫做 `MyBlazorApp` 並且有個元件叫做 `Component.razor`，要加入 CSS Isolation 只要在 `Component.razor` 的所在目錄下，新增一個 `Component.razor.css`，然後就可以在這裡撰寫將該元件內才會用到的 CSS 樣式：

```css
/* In Component.razor.css */
h1 {
    color: red;
}
```

預設這個樣是只會套用在當前的元件中，如果你的元件底下還有其他自訂的 Blazor 元件也要使用父元件所設定的 CSS Isolation 樣式，那你必須在 CSS 選擇器前面加上 `::deep` 使之可以往下套用樣式：

```css
/* In Component.razor.css */
::deep h1 {
    color: red;
}
```

很簡單吧！

不過有一點要稍微注意一下，如果你之前是從 ASP.NET Core Blazor 3.1 的專案範本建立專案的，你還需要在 `_Host.cshtml` 的 `head` 區段中增加下面這行：

```html
<head>
  <link href="MyBlazorApp.styles.css" rel="stylesheet" />
</head>
```

這行是載入 CSS Isolation 編譯後的 CSS 檔案，而這檔案名稱則根據你的專案名稱做調整。

----------

參考資料：

* [ASP.NET Core Blazor CSS isolation](https://docs.microsoft.com/en-us/aspnet/core/blazor/components/css-isolation)

