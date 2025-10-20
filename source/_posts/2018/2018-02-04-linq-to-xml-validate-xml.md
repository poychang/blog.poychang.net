---
layout: post
title: LINQ to XML - 驗證 XML 資料
date: 2018-02-04 00:00
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: linq-to-xml-validate-xml/
---

接續上篇的基本操作，這篇主要使用 LINQ to XML 來驗證 XML 資料。

目錄：

- [基本操作](https://blog.poychang.net/linq-to-xml-basic-usage/)
- [建立 XML 檔案](https://blog.poychang.net/linq-to-xml-create-xml-file)
- [查詢 XML 資料](https://blog.poychang.net/linq-to-xml-query-xml/)
- [修改 XML 資料](https://blog.poychang.net/linq-to-xml-edit-xml)
- [轉換 XML 資料](https://blog.poychang.net/linq-to-xml-transfom-xml)
- [驗證 XML 資料](https://blog.poychang.net/linq-to-xml-validate-xml)
- [取得 CDATA 資料](https://blog.poychang.net/2018-02-05-linq-to-xml-extract-data-from-cdata)

> 系列文完整範例程式碼請參考 [poychang/Demo-Linq-To-Xml](https://github.com/poychang/Demo-Linq-To-Xml)。

## 驗證 XML 資料

XML 本身的彈性很大，可以自由地建立你想要的元素名稱及屬性，而彈性太大時，我們就需要一種機制來規範這個彈性，XSD(XML Schema Definition) 就是其中一種描述 XML 的 XML Schema 語言，幫助我們規範 XML 檔案，讓 XML 必須遵守 XSD 所規範的規則，才算是合法的 XML 文件。

### 建立 XSD

> 這裡只用範例簡單介紹 XSD 的寫法。

請參考 `sample.xsd` 程式碼範例，裡面建立了以下規則：

1. 根元素為 `Students`
2. 根元素包含至少 1 個 `Student` 元素(`minOccurs="1"`)，且無上限(`maxOccurs="unbounded"`)
3. `Student` 元素必須設定 `Id` 屬性
4. 每個元素必須包含以下 3 個子元素
   - `Name`
   - `Gender`
   - `TotalMarks`

```xml
<?xml version="1.0" encoding="utf-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="Students">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Student" minOccurs="1" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="Name" minOccurs="1" maxOccurs="1"/>
              <xs:element name="Gender" minOccurs="1" maxOccurs="1"/>
              <xs:element name="TotalMarks" minOccurs="1" maxOccurs="1"/>
            </xs:sequence>
            <xs:attribute name="Id" type="xs:integer" use="required"/>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

### 驗證

驗證的方式很簡單，基本上就三個步驟：

1. 建立一個 `XmlSchemaSet` 物件，並載入你的 XSD 檔案
2. 建立你的 `xmlDocument` 物件，並載入想要驗證 XML 檔案
3. 透過 `Validate()` 方法，並指定要透過哪個 XmlSchemaSet 物件做驗證

下程式碼中，另外建了一個 `isInvalid` 幫助我們簡單判斷驗證是否成功。

```csharp
var schema = new XmlSchemaSet();
const string xsdFilePath = "../sample.xsd";
schema.Add("", xsdFilePath);

const string xmlFilePath = "../sample.xml";
var xmlDocument = XDocument.Load(xmlFilePath);
var isInvalid = false;

xmlDocument.Validate(schema, (sender, event) =>
{
    Console.WriteLine(event.Message);
    isInvalid = true;
});
```

`Validate()` 會有兩個參數，第一個是要載入的 XmlSchemaSet 驗證物件，第二個是 `ValidationEventHandler`，後者比較需要多說明一些。

後者 `ValidationEventHandler` 是一個委派([詳細資訊](https://docs.microsoft.com/zh-tw/dotnet/api/system.xml.schema.validationeventhandler?view=netframework-4.7.1&WT.mc_id=DT-MVP-5003022))，可以有兩個參數，sender 和 event，sender 代表所驗證的物件本身，event 代表驗證過程中發生的事件，通常拿來顯示驗證的錯誤訊息。

而 `ValidationEventHandler` 這個委派在驗證過程中，如果有發生錯誤才會被執行，而這個委派參數如果設定成 null，則會在驗證發生錯誤時，會吐出執行例外。

> 請參考 `07-ValidateWithXSD` 專案的 [Program.cs](https://github.com/poychang/Demo-Linq-To-Xml/blob/master/07-ValidateWithXSD/Program.cs)

---

參考資料：

- [Wiki - XML Schema](https://zh.wikipedia.org/wiki/XML_Schema)
- [LINQ to XML (C#)](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/linq-to-xml?WT.mc_id=DT-MVP-5003022)
- [YouTube - LINQ to XML Tutorial](https://www.youtube.com/playlist?list=PL6n9fhu94yhX-U0Ruy_4eIG8umikVmBrk)
- [LINQ to XML Tutorial](http://csharp-video-tutorials.blogspot.tw/2014/08/linq-to-xml-tutorial.html)
- [XML Schema Tutorial](https://www.liquid-technologies.com/xml-schema-tutorial/xsd-elements-attributes)
