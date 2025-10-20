---
layout: post
title: LINQ to XML - 取得 CDATA 資料
date: 2018-02-05 00:00
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: linq-to-xml-extract-data-from-cdata/
---

接續上篇的基本操作，這篇主要使用 LINQ to XML 來取得 CDATA 標籤內的資料內容。

目錄：

- [基本操作](https://blog.poychang.net/linq-to-xml-basic-usage/)
- [建立 XML 檔案](https://blog.poychang.net/linq-to-xml-create-xml-file)
- [查詢 XML 資料](https://blog.poychang.net/linq-to-xml-query-xml/)
- [修改 XML 資料](https://blog.poychang.net/linq-to-xml-edit-xml)
- [轉換 XML 資料](https://blog.poychang.net/linq-to-xml-transfom-xml)
- [驗證 XML 資料](https://blog.poychang.net/linq-to-xml-validate-xml)
- [取得 CDATA 資料](https://blog.poychang.net/2018-02-05-linq-to-xml-extract-data-from-cdata)

> 系列文完整範例程式碼請參考 [poychang/Demo-Linq-To-Xml](https://github.com/poychang/Demo-Linq-To-Xml)。

XML 標準中提供了 CDATA 區段，做為一種通知剖析器的方法，當 XML 剖析器遇到開頭的 `<![CDATA[` 時，會將接下來的內容當成字元，而不會嘗試將其解譯成 XML 標籤實體。

此外，CDATA 區段的內容不能出現 `]]>`，因為這個字串引發 CDATA 的結束訊號。

## 取得 CDATA 資料

混和前面幾篇文章的操作技巧，載入檔案後，先使用 `DescendantNodes()` 取得所有 XML 的節點資料，透過 LINQ 方式找到節點類類型 `XmlNodeType.CDATA` 的節點(更多節點類型請[參考這裡](https://docs.microsoft.com/zh-tw/dotnet/api/system.xml.xmlnodetype?view=netframework-4.7.1&WT.mc_id=DT-MVP-5003022))，再將內容取出來即可。

```csharp
var queryCData = from element in XDocument.Load(filePath).DescendantNodes()
                 where element.NodeType == System.Xml.XmlNodeType.CDATA
                 select element.Parent?.Value.Trim();
foreach (var data in queryCData)
{
    Console.WriteLine(data);
}
```

這個使用方式很常會遇到，在使用 XML 作為通訊格式時，為了清楚標示傳輸的"文字內容"在哪裡，就會使用 CDATA 區段作為標識，因此這個技巧一定要知道。

> 請參考 `08-ExtractDataFromCData` 專案的 [Program.cs](https://github.com/poychang/Demo-Linq-To-Xml/blob/master/08-ExtractDataFromCData/Program.cs)

---

參考資料：

- [LINQ to XML (C#)](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/linq-to-xml?WT.mc_id=DT-MVP-5003022)
- [MSDN - XCData 類別](https://msdn.microsoft.com/zh-tw/library/system.xml.linq.xcdata.aspx)
