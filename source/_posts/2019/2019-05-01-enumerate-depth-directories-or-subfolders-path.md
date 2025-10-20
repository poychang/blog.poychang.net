---
layout: post
title: 取得又深又多的子目錄路徑
date: 2019-05-01 21:34
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: enumerate-depth-directories-or-subfolders-path/
---

有天在處理網路芳鄰的檔案時，有個需求是要在某一個根目錄下，往下找多層子目錄後，針對路徑名稱及檔案內容做後續處理，通常這時候我們會使用 `Directory` 類別的 `EnumerateDirectories` 方法取得根目錄底下的所有子目錄的路徑，但因為子目錄很深又很多，這種取回所有子目錄路徑的方法會有反應速度很慢的問題（每次要等 5~8 秒才找得到），這時候如果能指定搜尋的子目錄深度，相信會快很多。

## 基本用法

首先提一下 `Directory` 類別提供兩種取得子目錄的方法 `GetDirectories` 和 `EnumerateDirectories`。

`GetDirectories` 回傳的是 `string[]` 型別，也就是一組字串陣列，背後他會將找到的所有子目錄資料都找到後一次回傳。

`EnumerateDirectories` 回傳的是 `IEnumerable<string>`，因此是一組可列舉的字串，和 `GetDirectories` 最大的差別就是不會一開始就載入全部的資料，可以透過延遲載入（Lazy Loading）的方式處理資料，通常會有較好的效能。

> 若只是要取得目錄或檔案的名稱，請使用 `Directory` 類別的列舉方法，如果是要取得目錄或檔案的其他屬性，請使用 `DirectoryInfo` 和 `FileSystemInfo` 類別。

要使用 `Directory.EnumerateDirectories()` 方法取得子目錄清單很簡單，基本用法請參考[官方文件](https://docs.microsoft.com/zh-tw/dotnet/api/system.io.directory.enumeratedirectories?view=netcore-2.2&WT.mc_id=DT-MVP-5003022)，而我這裡用的範例程式碼如下：

```csharp
var path = "D:\\DepthFolder";
Directory.EnumerateDirectories(path, "*", SearchOption.AllDirectories);
```

`Directory.EnumerateDirectories()` 第一個參數是要搜尋的目錄的相對或絕對路徑，第二個參數是比對要搜尋的目錄名稱（這裡不是用正規表示式），第三個參數是一個列舉值，決定是只包含當前目錄還是包含所有子目錄。

- `SearchOption.TopDirectoryOnly` 只包含當前目錄
- `SearchOption.AllDirectories` 包含所有子目錄

用法很簡單，這裡稍微帶過而已。

## 需求：取得指定層數下的子目錄清單

今天的狀況是「所要的檔案在很深的子目錄中」，想當然爾是用上面有提到的 `SearchOption.AllDirectories` 來取得所有子目錄，但這又會造成取得子目錄清單反應速度很慢的問題。

這時候如果我們知道所要的檔案是在「第幾層」子目錄，就可以藉由一些手法，讓整體速度提升，畢竟就不用遍巡所有深度下的子目錄。

但 `Directory` 沒有提供類似的功能，這時候我們只能自己寫了。

<script src="https://gist.github.com/poychang/e3c914c1a58d0848d9e33d9d4b004ef4.js"></script>

這程式是透過遞迴的方式去往下找每一層的目錄清單，由於每次都只看當層的子目錄而已，所以速度上會快很多，當找到指定深度的時候，就把當前的目錄路徑加入清單中，概念上相當簡單。

範例，取得第 2 層的子目錄路徑的效果如下：

![取得第 2 層的子目錄路徑的效果](https://i.imgur.com/yg2z7eO.png)

----------

參考資料：

* [HOW TO：列舉目錄和檔案](https://docs.microsoft.com/zh-tw/dotnet/standard/io/how-to-enumerate-directories-and-files?WT.mc_id=DT-MVP-5003022)
* [Directory.EnumerateDirectories Method](https://docs.microsoft.com/zh-tw/dotnet/api/system.io.directory.enumeratedirectories?view=netcore-2.2&WT.mc_id=DT-MVP-5003022)
* [Directory.GetDirectories Method](https://docs.microsoft.com/zh-tw/dotnet/api/system.io.directory.getdirectories?view=netcore-2.2&WT.mc_id=DT-MVP-5003022)
