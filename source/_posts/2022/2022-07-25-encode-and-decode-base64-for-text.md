---
layout: post
title: 使用 C# 和 JavaScript 處理 Base64 編碼和解碼
date: 2022-07-25 15:30
author: Poy Chang
comments: true
categories: [Typescript, Javascript, CSharp, Dotnet, PowerShell]
permalink: encode-and-decode-base64-for-text/
---

Base64 編碼格式的使用經常出現在各個開發平台中，這種編碼格式有著演算法簡單、幾乎不會造成效能影響、甚至解碼也相當方便，這篇記錄一下在 C# 和 JavaScript 中使用 Base64 編碼的方法。

## 為什麼使用 Base64

Base64 編碼是將二進位的值轉換到 64 個 ASCII 特定字元的編碼過程，藉由這個文字串來傳輸資料內容，可以不用擔心在傳輸過程中，因為編解碼的過程中，造成檔案損壞。也因為是使用 ASCII 來傳輸資料，而基本上這世界上的所有電腦都支援 ASCII，因此這個編碼方式適用的平台就極為廣泛。

其中這 64 個 ASCII 字元就是小寫字母 `a`-`z`、大寫字母 `A`-`Z`、數位 `0`-`9`、以及符號 `+`、`/` 一共 64 個字符的字元集。

不過實際使用上你會發現，Base64 的編碼還會使用到 `=` 符號，這是因為執行編碼演算法時，為了補足編碼字節，會在最後加上 `=` 符號，這樣就可以在編解碼時，讓解碼字節的數量等於演算法設計的字節數量。

那麼在 C# 和 JavaScript 中，如何使用原生提供的 API 來處理 Base64 編碼呢？

## 在 C# 中使用 Base64 編碼

編碼：

```csharp
public static string Base64Encode(string plainText) {
  var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
  return System.Convert.ToBase64String(plainTextBytes);
}
```

解碼：

```csharp
public static string Base64Decode(string base64EncodedData) {
  var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
  return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
}
```

## 在 JavaScript 中使用 Base64 編碼

編碼：

```javascript
const encodedData = window.btoa(stringToEncode);
```

解碼：

```javascript
const decodeData = window.atob(encodedData)
```

----------

參考資料：

* [How do I encode and decode a base64 string?](https://stackoverflow.com/questions/11743160/how-do-i-encode-and-decode-a-base64-string)
* [MDN Docs - btoa()](https://developer.mozilla.org/en-US/docs/Web/API/btoa)
* [MDN Docs - atob()](https://developer.mozilla.org/en-US/docs/Web/API/atob)
* [透過瀏覽器瀏覽網站時到底 URL 長度有沒有一定的限制](https://blog.miniasp.com/post/2022/07/19/Maximum-length-of-URL-in-browsers-and-servers)
