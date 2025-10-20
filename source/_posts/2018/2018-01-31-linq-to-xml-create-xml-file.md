---
layout: post
title: LINQ to XML - 建立 XML 資料
date: 2018-01-31 00:38
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: linq-to-xml-create-xml-file/
---

接續上篇的基本操作，這篇主要使用 LINQ to XML 來建立 XML 檔案。

目錄：

- [基本操作](https://blog.poychang.net/linq-to-xml-basic-usage/)
- [建立 XML 檔案](https://blog.poychang.net/linq-to-xml-create-xml-file)
- [查詢 XML 資料](https://blog.poychang.net/linq-to-xml-query-xml/)
- [修改 XML 資料](https://blog.poychang.net/linq-to-xml-edit-xml)
- [轉換 XML 資料](https://blog.poychang.net/linq-to-xml-transfom-xml)
- [驗證 XML 資料](https://blog.poychang.net/linq-to-xml-validate-xml)
- [取得 CDATA 資料](https://blog.poychang.net/2018-02-05-linq-to-xml-extract-data-from-cdata)

> 系列文完整範例程式碼請參考 [poychang/Demo-Linq-To-Xml](https://github.com/poychang/Demo-Linq-To-Xml)。

## 建立 XML 檔

LINQ to SQL 使用函數式建構的方式來建立 XML 資料，也就是使用 `XDocument` 建構式來建立整份 XML 資料。

`XDocument` 建構式使用 `params` 使其可以接收多個參數（[params 關鍵字相關文件](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/keywords/params?WT.mc_id=DT-MVP-5003022)），如下面的例子，第一個參數為 XML 宣告，接下來的參數可以接收任意數量的物件，這時我們就可以添加各種 LINQ to XML 類別來組成 XML 資料，例如 `XComment`(XML 註解)、`XElement`(XML 元素)。

另外，`XElement` 本身的建構式也使用了 `params` 讓他可以設定該元素的 `XAttribute`(XML 屬性)或更深的 `XElement`(XML 元素)，一層一層的將 XML 樣貌建置出來。

```csharp
var xmlDocument = new XDocument(
    new XDeclaration("1.0", "utf-8", "yes"),
    new XComment("Creating an XML Tree using LINQ to XML"),
    new XElement("Students",
        new XElement("Student", new XAttribute("Id", 101),
            new XElement("Name", "Mark"),
            new XElement("Gender", "Male"),
            new XElement("TotalMarks", 800)),
        new XElement("Student", new XAttribute("Id", 104),
            new XElement("Name", "John"),
            new XElement("Gender", "Male"),
            new XElement("TotalMarks", 950))));
```

上面的範例就會建立出如下的 XML 資料：

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<!--Creating an XML Tree using LINQ to XML-->
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

建立完 XML 資料後，`XDocument` 實體會有 `save()` 方法可以呼叫，將所建立的 XML 資料儲存成檔案。

> 請參考 `01-CreateXmlDocument` 專案的 [Program.cs](https://github.com/poychang/Demo-Linq-To-Xml/blob/master/01-CreateXmlDocument/Program.cs)

## 資料來源

實務上 XML 的資料可能會從資料庫取得，並暫存在記憶體中，此時資料型態通常會是 `IEnumerable` 的實作，例如 Array、List 等。

這時我們可以透過 LINQ 的方式篩選並組出我們要的 XML 資料內容，進而建立 XML 檔案。

```csharp
var xmlDocument = new XDocument(
   new XDeclaration("1.0", "utf-8", "yes"),
   new XComment("Creating an XML Tree using LINQ to XML"),
   new XElement("Students",
       from student in Student.GetAllStudents()
       select new XElement("Student", new XAttribute("Id", student.Id),
           new XElement("Name", student.Name),
           new XElement("Gender", student.Gender),
           new XElement("TotalMarks", student.TotalMarks))
   ));
```

上述程式碼範例第 5 開始，`Student.GetAllStudents()` 一個資料陣列，這會被當作 LINQ 的資料來源，接著就是使用 LINQ 表示式來操作，並建立我們想要的 XML 元素。

> 請參考 `02-CreateXmlDocument` 專案的 [Program.cs](https://github.com/poychang/Demo-Linq-To-Xml/blob/master/02-CreateXmlDocument/Program.cs)

---

參考資料：

- [LINQ to XML (C#)](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/linq-to-xml?WT.mc_id=DT-MVP-5003022)
- [YouTube - LINQ to XML Tutorial](https://www.youtube.com/playlist?list=PL6n9fhu94yhX-U0Ruy_4eIG8umikVmBrk)
- [LINQ to XML Tutorial](http://csharp-video-tutorials.blogspot.tw/2014/08/linq-to-xml-tutorial.html)
