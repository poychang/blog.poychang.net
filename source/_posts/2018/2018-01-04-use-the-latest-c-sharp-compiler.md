---
layout: post
title: 使用最新版的 C# 編譯器
date: 2018-01-04 07:52
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Tools]
permalink: use-the-latest-c-sharp-compiler/
---
在 C# 7.1 開始加入了非同步 `Main()` 的寫法，更方便我們寫非同步的程式，而且 Visual Studio 2017 (Version 15.3) 已經內建 C# 7.1 的功能，不過預設專案會使用最新主要版本，也就是 C# 7.0，因此在享用 C# 7.1 新的語法糖前，要先知道如何指定 C# 版本。

## 指定 C# 版本

### 使用介面

在 Visual Studio 中有兩種方式可以指定 C# 版本，一種是使用介面做修改，從工具列中點選**專案** > **屬性**

![專案 > 屬性](https://i.imgur.com/ZbscDtn.png)

在**建置**頁籤中點選**進階**按鈕，會開啟**進階建置設定**的視窗，這裡可以看到，Visual Studio 預設是使用 **C# 最新主要版本**，也就是 C# 7.0，這裡我們可以指定要使用的版本，或是選擇 **C# 最新次要版本**，這選項會使用目前環境中最新的 C# 版本，以下圖為例，就是 C# 7.2。

![進階建置設定](https://i.imgur.com/XbCSxl1.png)

### 修改專案檔

我們也可以透過直接修改 `.csproj` 專案檔來指定版本，從工具列中點選**專案** > **編輯 ConsoleApp.csproj**

![專案 > 編輯專案檔](https://i.imgur.com/Yla5vf8.png)

這裡只需要在 `<PropertyGroup>` 段落中加入 `<LangVersion>latest</LangVersion>` 就會使用目前環境中最新的 C# 版本，或者可以加入 `<LangVersion>7.1</LangVersion>` 來指定要使用的 C# 版本。

![修改專案檔](https://i.imgur.com/AP2GJyt.png)

如此一來，我們就可享受最新的 C# 語法糖囉！

## 非同步 Main()

這裡筆記一下非同步 `Main()` 的知識點。

在 C# 7.0 以前 (包含 C# 7.0)，`Main()` 的函數簽章只有下列 4 種：

```
static void Main()
static void Main(string[])
static int Main()
static int Main(string[])
```

C# 7.1 多了下列的函數簽章：

```
static async Task Main()
static async Task<int> Main()
static async Task Main(string[])
static async Task<int> Main(string[])
```

這樣 `Main()` 就可以變成是非同步的了。

----------

參考資料：

* [C# 7.1 的 Async Main()](https://dotblogs.com.tw/aspnetshare/2017/08/10/asyncmain)
* [3 ways to enable the latest C# features](https://www.meziantou.net/2017/08/24/3-ways-to-enable-the-latest-c-features)

