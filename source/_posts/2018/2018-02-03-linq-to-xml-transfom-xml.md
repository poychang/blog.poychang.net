---
layout: post
title: LINQ to XML - 轉換 XML 資料
date: 2018-02-03 00:00
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: linq-to-xml-transfom-xml/
---

接續上篇的基本操作，這篇主要使用 LINQ to XML 來轉換 XML 資料。

目錄：

- [基本操作](https://blog.poychang.net/linq-to-xml-basic-usage/)
- [建立 XML 檔案](https://blog.poychang.net/linq-to-xml-create-xml-file)
- [查詢 XML 資料](https://blog.poychang.net/linq-to-xml-query-xml/)
- [修改 XML 資料](https://blog.poychang.net/linq-to-xml-edit-xml)
- [轉換 XML 資料](https://blog.poychang.net/linq-to-xml-transfom-xml)
- [驗證 XML 資料](https://blog.poychang.net/linq-to-xml-validate-xml)
- [取得 CDATA 資料](https://blog.poychang.net/2018-02-05-linq-to-xml-extract-data-from-cdata)

> 系列文完整範例程式碼請參考 [poychang/Demo-Linq-To-Xml](https://github.com/poychang/Demo-Linq-To-Xml)。

## 轉換 XML 資料

### 轉換成 CSV

如何將 XML 資料轉換成 CSV 格式，這個轉換其實就是在玩字串組合的遊戲，將 XML 的資料內容讀取出來後，組成我們想要的格式，下面的範例將轉換成 `,` 當作分隔符號的 CSV 格式：

```csharp
const string delimiter = ",";
xmlDocument.Descendants("Student")
    .ToList().ForEach(element =>
    {
        Console.WriteLine(element);
        stringBuilder.Append(
            $@"{element.Attribute("Id")?.Value}{delimiter}" +
            $@"{element.Element("Name")?.Value}{delimiter}" +
            $@"{ element.Element("Gender")?.Value}{delimiter}" +
            $@"{ element.Element("TotalMarks")?.Value}{delimiter}{"\r\n"}"
        );
    });
```

> 請參考 `05-TransformXmlToCsv` 專案的 [Program.cs](https://github.com/poychang/Demo-Linq-To-Xml/blob/master/05-TransformXmlToCsv/Program.cs)

### 轉換成 HTML

如果要將 XML 　資料轉換成同樣是標記式語言的 HTML 格式，玩法就可以改變一下，因為 HTML 本身符合 XML 格式，因此我們可以藉由 LINQ to XML [建立 XML 文件的方法](https://blog.poychang.net/linq-to-xml-create-xml-file)，來協助我們進行轉換，請見以下範例：

```csharp
var result = new XDocument(
    new XElement("table", new XAttribute("border", 1),
    new XElement("thead",
        new XElement("tr",
            new XElement("th", "Name"),
            new XElement("th", "Gender"),
            new XElement("th", "TotalMarks"))),
    new XElement("tbody",
        from student in xmlDocument.Descendants("Student")
        select new XElement("tr",
            new XElement("td", student.Element("Name")?.Value),
            new XElement("td", student.Element("Gender")?.Value),
            new XElement("td", student.Element("TotalMarks")?.Value))))
    );
```

簡單來看，就是把 `table`、`thead`、`tbody` 當作 XML 的元素名稱，並在讀取完 XML 資料後，依據想要呈現的資料格式將值給塞進這些 HTML 元素中。

> 請參考 `06-TransformXmlToHtml` 專案的 [Program.cs](https://github.com/poychang/Demo-Linq-To-Xml/blob/master/06-TransformXmlToHtml/Program.cs)

---

參考資料：

- [LINQ to XML (C#)](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/linq-to-xml?WT.mc_id=DT-MVP-5003022)
- [YouTube - LINQ to XML Tutorial](https://www.youtube.com/playlist?list=PL6n9fhu94yhX-U0Ruy_4eIG8umikVmBrk)
- [LINQ to XML Tutorial](http://csharp-video-tutorials.blogspot.tw/2014/08/linq-to-xml-tutorial.html)
