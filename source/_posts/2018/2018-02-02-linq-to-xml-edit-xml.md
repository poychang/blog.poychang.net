---
layout: post
title: LINQ to XML - 修改 XML 資料
date: 2018-02-02 00:00
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: linq-to-xml-edit-xml/
---

接續上篇的基本操作，這篇主要使用 LINQ to XML 來修改 XML 資料。

目錄：

- [基本操作](https://blog.poychang.net/linq-to-xml-basic-usage/)
- [建立 XML 檔案](https://blog.poychang.net/linq-to-xml-create-xml-file)
- [查詢 XML 資料](https://blog.poychang.net/linq-to-xml-query-xml/)
- [修改 XML 資料](https://blog.poychang.net/linq-to-xml-edit-xml)
- [轉換 XML 資料](https://blog.poychang.net/linq-to-xml-transfom-xml)
- [驗證 XML 資料](https://blog.poychang.net/linq-to-xml-validate-xml)
- [取得 CDATA 資料](https://blog.poychang.net/2018-02-05-linq-to-xml-extract-data-from-cdata)

> 系列文完整範例程式碼請參考 [poychang/Demo-Linq-To-Xml](https://github.com/poychang/Demo-Linq-To-Xml)。

LINQ to XML 已經幫我們內建了新增、 修改、刪除所需要的方法，我們只要簡單的調用他們，就可以輕鬆完成修改 XML 資料的的目的。

## 新增 XML 資料

使用 `Add()` 可以在既有的 XML 資料中新增一筆元素資料，這筆資料會被加在 XML 資料中的最後面，另外也可使用 `AddFirst()` 將資料加在最前面，請見以下範例：

```csharp
xmlDocument.Element("Students")?.Add(
    new XElement("Student", new XAttribute("Id", 105),
        new XElement("Name", "Todd"),
        new XElement("Gender", "Male"),
        new XElement("TotalMarks", 980)
    ));
// OUTPUT:
// ------------------------------
// <Students>
//     <Student Id="105">
//         <Name>Todd</Name>
//         <Gender>Male</Gender>
//         <TotalMarks>980</TotalMarks>
//     </Student>
// </Students>
```

如果想要將資料加在指定元素的前面或後面，可以使用 `AddBeforeSelf()` 或 `AddAfterSelf()` 將要新增的資料加在指定的序列位置，請見以下範例：

```csharp
xmlDocument.Element("Students")?.Elements("Student")
    .First(x => x.Attribute("Id")?.Value == "103")
    .AddBeforeSelf(
        new XElement("Student", new XAttribute("Id", 106),
            new XElement("Name", "Todd"),
            new XElement("Gender", "Male"),
            new XElement("TotalMarks", 980)));
// OUTPUT:
// ------------------------------
// <Students>
//     <Student Id="106">
//         <Name>Todd</Name>
//         <Gender>Male</Gender>
//         <TotalMarks>980</TotalMarks>
//     </Student>
//     <Student Id="103">
//         <Name>Pam</Name>
//         <Gender>Female</Gender>
//         <TotalMarks>850</TotalMarks>
//     </Student>
// </Students>
```

## 修改 XML 資料

更新 XML 既有元素可先透過 LINQ 找到目標元素後，使用 `SetElementValue()` 或是 `SetValue()` 方法，修改該元素的值，請見以下範例：

```csharp
xmlDocument.Element("Students")?.Elements("Student")
    .FirstOrDefault(x => x.Attribute("Id")?.Value == "106")?.SetElementValue("TotalMarks", 999);
```

```csharp
xmlDocument.Element("Students")?.Elements("Student")
	.Where(x => x.Attribute("Id")?.Value == "106")
    .Select(x => x.Element("TotalMarks")).FirstOrDefault()?.SetValue(999);
```

上面兩段程式碼會是等價的，但查詢方式不同，所以調用不同的修改方法，第一種方式會先找到 `Student` 這個元素後，修改底下的指定的屬性值，第二種則是找到 `Student` 這個元素後，針對 TotalMarks 這個屬性去修改設定值。

## 刪除 XML 資料

刪除的動作相當簡單，請見以下範例：

```csharp
// 刪除篩選到的 XML 元素
xmlDocument.Root?.Elements().Where(x => x.Attribute("Id")?.Value == "106").Remove();

// 刪除根元素底下的所有 XML 元素，以範例來說，為刪除根元素下 Students 元素
xmlDocument.Root?.Elements().Remove();
```

這裡的 `xmlDocument.Root` 等價於 `xmlDocument.Element("Students")`，也就是整份 XML 文件的根結點。若是要表示 XML 文件的起始，建議使用 `xmlDocument.Root` 來操作會比較符合語意且直覺。

> 請參考 `04-ModifyXmlDocument` 專案的 [Program.cs](https://github.com/poychang/Demo-Linq-To-Xml/blob/master/04-ModifyXmlDocument/Program.cs)

---

參考資料：

- [LINQ to XML (C#)](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/linq-to-xml?WT.mc_id=DT-MVP-5003022)
- [YouTube - LINQ to XML Tutorial](https://www.youtube.com/playlist?list=PL6n9fhu94yhX-U0Ruy_4eIG8umikVmBrk)
- [LINQ to XML Tutorial](http://csharp-video-tutorials.blogspot.tw/2014/08/linq-to-xml-tutorial.html)
