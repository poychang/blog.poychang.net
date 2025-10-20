---
layout: post
title: LINQ to XML - 查詢 XML 資料
date: 2018-02-01 20:18
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: linq-to-xml-query-xml/
---

接續上篇的基本操作，這篇主要使用 LINQ to XML 來查詢 XML 檔案內的資料。

目錄：

- [基本操作](https://blog.poychang.net/linq-to-xml-basic-usage/)
- [建立 XML 檔案](https://blog.poychang.net/linq-to-xml-create-xml-file)
- [查詢 XML 資料](https://blog.poychang.net/linq-to-xml-query-xml/)
- [修改 XML 資料](https://blog.poychang.net/linq-to-xml-edit-xml)
- [轉換 XML 資料](https://blog.poychang.net/linq-to-xml-transfom-xml)
- [驗證 XML 資料](https://blog.poychang.net/linq-to-xml-validate-xml)
- [取得 CDATA 資料](https://blog.poychang.net/2018-02-05-linq-to-xml-extract-data-from-cdata)

> 系列文完整範例程式碼請參考 [poychang/Demo-Linq-To-Xml](https://github.com/poychang/Demo-Linq-To-Xml)。

## 查詢 XML 資料

要使用 LINQ to XML 來查詢 XML 資料前，先記得一個概念，LINQ 可以對資料集合進行查詢，這個資料集合可以想像成一個 Array 或一串 List，我們只要能建立將這個資料集合，把他當作 LINQ 的資料來源即可。

而 LINQ to XML 裡面有三個作為資料集合的方法：

1. Elements()
2. Descendants()
3. DescendantNodes()

### Elements()

`Elements()` 可以從一個指定節點中，取得底下的所有子元素，作為資料集合。也可以設定想要過濾的元素名稱，只抓符合該名稱的元素，例如：

```csharp
IEnumerable<string> students = XDocument.Load(filePath)
    .Elements("Students")
    .Elements("Student");
```

代表從 XML 文件中找到 `Students` 節點底下，名稱符合 `Student` 的元素，一筆筆的讀出來作為資料集合，這個資料集合會是 `IEnumerable`，因此接著你就可以透過 LINQ 的方式接續處理資料。

### Descendants()

`Descendants()` 跟 `Elements()` 很像，從一個指定節點中，取得底下的所有子元素，但這裡的子元素的收集，是會將 XML 做遞迴拆解，一層一層將資料拆解出來，並存成可列舉的資料型態。

這方法所組成的資料集合比較不容易解釋，建議使用下面程式碼，修改 `filePath` 檔案路徑後，執行看看所產生出的資料會有那些東西，有看到實際產生的資料，會比較有感覺。

```csharp
foreach (var element in XDocument.Load(filePath).Descendants())
{
    Console.WriteLine(element);
    Console.WriteLine("----------");
}
```

> Descendant 這個英文單字是**後代**的意思，泛指從某一來源派生（或傳下）的東西。

`Descendants()` 同樣的也可以設定想要過濾的元素名稱，例如 `XDocument.Load(filePath).Descendants("Student")`。

### DescendantNodes()

`DescendantNodes()` 跟 `Descendants()` 很像，但限縮資料集合只有節點，而沒有元素。

以這個 XML 作為範例說明：

```xml
<Students>
	<Student Id="101">
	    <Name>Mark</Name>
	    <Gender>Male</Gender>
	    <TotalMarks>800</TotalMarks>
	</Student>
	<Student Id="103">
	    <Name>John</Name>
	    <Gender>Male</Gender>
	    <TotalMarks>950</TotalMarks>
	</Student>
</Students>
```

`<Student>` 是一個 XML 節點也是 XML 元素，而 `<Name>` 是一個 XML 元素。

因此 `DescendantNodes()` 會將指定節點底下的所有節點作為資料集合，例如 `XDocument.Load(filePath).DescendantNodes()` 會收集到兩筆 `Student` 節點。

請注意 `DescendantNodes()` 無法設定過濾的名稱（畢竟他的目標是節點，不是元素）。

> 除了 DescendantNodes()，請參考 `03-QueryXmlDocument` 專案的 [Program.cs](https://github.com/poychang/Demo-Linq-To-Xml/blob/master/03-QueryXmlDocument/Program.cs)

---

參考資料：

- [LINQ to XML (C#)](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/linq-to-xml?WT.mc_id=DT-MVP-5003022)
- [YouTube - LINQ to XML Tutorial](https://www.youtube.com/playlist?list=PL6n9fhu94yhX-U0Ruy_4eIG8umikVmBrk)
- [LINQ to XML Tutorial](http://csharp-video-tutorials.blogspot.tw/2014/08/linq-to-xml-tutorial.html)
