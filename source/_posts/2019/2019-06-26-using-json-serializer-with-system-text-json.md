---
layout: post
title: 使用原生 System.Text.Json 命名空間處理 JSON
date: 2019-06-26 12:58
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: using-json-serializer-with-system-text-json/
---

一直以來，當要處理 JSON 的時候 [Json.NET](https://www.newtonsoft.com/json) 是最佳的幫手，有非常順手的 API 和功能，讓開發者輕鬆處理 JSON 的大小事，甚至在 .NET 的各種函示庫、框架中都有用到，但當許多專案相依於此函示庫時，只要版本一更新，很容易造成許多專案要更著變動，造成相依的函示庫版本很難掌握，因此 .NET Team 發展了 `System.Text.Json` 來在 .NET 專案中取代 Json.NET 的依賴。

>如果你是使用 .NET Core 3 以上版本，`System.Text.Json` 此函示庫已經包含在裡面了。當然你也可以自行透過 NuGet 來安裝 Preview 版本的 [System.Text.Json](https://nuget.org/packages/System.Text.Json) 擴充套件來使用。

>2019/07/23 推出了 Preview 7，這版有 Breaking Change，已修正此文章。

Json.NET 最常被使用的功能莫過於 `JsonConvert.SerializeObject()` 將物件序列化，以及 `JsonConvert.DeserializeObject()` 將 JSON 文字反序列化成物件，這兩個功能，我們就先來看看這兩個功能對應到 `System.Text.Json` 該如何使用。

`System.Text.Json` 底下有另一個專門在處理序列化的命名空間 `System.Text.Json.Serialization`，可以參考[官方文件](https://docs.microsoft.com/zh-tw/dotnet/api/system.text.json.serialization?WT.mc_id=DT-MVP-5003022)查看他所提供的 API 方法。

## 將物件序列化

假設我們有個 `Student` 類別如下：

```csharp
class Student {
    public string Name { get; set; }
    public int Age { get; set; }
}
```

可以透過 `JsonSerializer.Serialize()` 這個靜態方法將物件序列化成 JSON 文字，用法如下：

```csharp
var student = new Student {
    Name = "Poy Chang",
    Age = 20
};
var json = JsonSerializer.Serialize<Student>(student);
```

序列化的結果就會是像這樣：

```json
{"Name":"Poy Chang","Age":20}
```

我們成功將物件序列化了，只是輸出的樣式稍微有一點不好看，如果能讓輸出結果排版一下，開發者在閱讀的時候，會比較好讀，這時可以加上 `JsonSerializerOptions` 設定，對輸出的結果做一些調整，透過設定 `WriteIndented` 屬性，可以將 JSON 文字加上縮排，作法如下：

```csharp
var options = new JsonSerializerOptions
{
    WriteIndented = true
};
var json = JsonSerializer.Serialize<Student>(student, options);
```

如此一來輸出的 JSON 就會被格式化，讓我們能輕鬆閱讀。

```json
{
  "Name": "Poy Chang",
  "Age": 20
}
```

## Unicode 編碼

如果 C# 物件的屬性值本身就是 JSON 的時候，使用 `JsonSerializer.Serialize()` 時你會看到輸出的結果會有 Unicode 編碼，例如 `"` 會編碼成 `\u0022`，這是因為 `System.Text.Json` 預設會使用 Unicode 來進行比較安全的序列化作法，因此將字串內的特殊符號編碼成 Unicode，但這樣可能會有兩個問題，第一個是這容易造成 JSON 字串變大，畢盡一個 `"` 字符，會變六個字符 `\u0022`，第二個這編碼後結果比較不容易閱讀，若要解決這問題，可以參考以下做法：

```csharp
var options = new JsonSerializerOptions
{
    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
};
var json = JsonSerializer.Serialize<Student>(student, options);
```

另外一提，`Newtonsoft.Json` 預設也是這種非 Unicode 編碼的模式。

>`JsonSerializerOptions` 還有其他屬性可以做調整，詳請查看[官方文件](https://docs.microsoft.com/zh-tw/dotnet/api/system.text.json.jsonserializeroptions?WT.mc_id=DT-MVP-5003022)。

## 將文字反序列化成物件

反過來，要將 JSON 文字轉換成物件也是經常遇到的情境，可以透過 `JsonSerializer.Deserialize()` 這個靜態方法將物件序列化成 JSON 文字，用法如下：

```csharp
var json = "{\"Name\":\"Poy Chang\",\"Age\":20}";
var student = JsonSerializer.Deserialize<Student>(json);
```

使用起來是不是也非常簡單、順手，也幾乎和原本的 JSON.NET 一樣，看樣子可以很輕鬆的將命名空間直接從 `Newtonsoft.Json` 移轉到 `System.Text.Json`。

## JSON 屬性裝飾器

如果手動調整序列化後的屬性名稱，而不想更動 C# 原本的屬性名稱，`System.Text.Json.Serialization` 有提供屬性裝飾器來讓開發者自行決定序列化後的結果，使用方式只要在屬性上面掛上裝飾器並設定要輸出的名稱即可，方法如下：

```csharp
class Student {
    [JsonPropertyName("studentName")]
    public string Name { get; set; }
    [JsonPropertyName("studentAge")]
    public int Age { get; set; }
}
```

如此一來，透過 `JsonSerializer.Serialize()` 序列化的結過就是變成：

```json
{
  "studentName": "Poy Chang",
  "studentAge": 20
}
```

如果你要轉換的屬性型別是 Enum 了話，可以在使用該 Enum 的屬性上掛上 `[JsonConverter(typeof(JsonStringEnumConverter))]` 屬性裝飾器，用法如下：

```csharp
public enum Type
{
    GoodStudent,
    BadStudent
}

class Student {
    [JsonPropertyName("studentName")]
    public string Name { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    [JsonPropertyName("studentType")]
    public Type Type { get; set; }
}
```

如此一來，透過 `JsonSerializer.Serialize()` 序列化的結過就是變成：

```json
{
    "studentName": "Poy Chang",
    "studentType": "GoodStudent"
}
```

## 後記

`System.Text.Json` 在處理 JSON 的速度以及記憶體的使用方面，都比 Json.NET 來的優秀，再加上 Json.NET 的作者 James Newton-King 也加入 Microsoft，未來這個套件勢必後勢看漲。同時 James 也表示，若是處理基本 JSON 轉換及查詢，使用 `System.Text.Json` 能獲得效能上的提升，但如果有特殊 JSON 處理的需求，Json.NET 仍然會持續開發、修正問題，依舊是一個不錯的解決方案。

----------

參考資料：

* [System.Text.Json!](https://blog.darkthread.net/blog/system-text-json/)
* [.NET API 瀏覽器 - System.Text.Json](https://docs.microsoft.com/zh-tw/dotnet/api/?term=System.Text.Json?WT.mc_id=DT-MVP-5003022)
* [Try the new System.Text.Json APIs](https://devblogs.microsoft.com/dotnet/try-the-new-system-text-json-apis/)
