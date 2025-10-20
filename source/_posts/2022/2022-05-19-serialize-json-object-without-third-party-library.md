---
layout: post
title: 不使用第三方套件來序列化/反序列化 JSON 物件
date: 2022-05-19 03:46
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: serialize-json-object-without-third-party-library/
---

在 .NET 的世界中，有好用的 Newtonsoft.Json 套件以及官方提供的 System.Text.Json 來序列化/反序列化 JSON 物件，但是要使用這兩個套件是需要另外安裝的，也就是說會相依於某個套件，甚至相依某個版本，如果只是要做簡單的 JSON 序列化/反序列化，而不需要 Newtonsoft.Json 的彈性，或是 System.Text.Json 的速度，簡單用內建的函示庫也是可以撰寫出序列化/反序列化 JSON 物件的程式碼。

直接先來看程式碼！

```csharp
using System.Runtime.Serialization.Json;
using System.Text;

public static class DataContractJsonConverter
{
    /// <summary>
    /// 將 JSON 字串反序列化成物件
    /// </summary>
    public static T Deserialize<T>(string json)
    {
        using var stream = new MemoryStream(Encoding.UTF8.GetBytes(json));
        return (T)new DataContractJsonSerializer(typeof(T)).ReadObject(stream)!;
    }

    /// <summary>
    /// 將物件序列化成字串
    /// </summary>
    public static string Serialize<T>(T obj)
    {
        using var ms = new MemoryStream();
        new DataContractJsonSerializer(typeof(T)).WriteObject(ms, obj);
        return Encoding.UTF8.GetString(ms.ToArray());
    }
}
```

上面主要使用 `DataContractJsonSerializer` 類別，這是 .NET Framework 3.5 就存在的類別，可以用他來將物件序列化成 JSON 字串，或者反序列化成物件，雖然所提供的功能相當簡易，但某些時候也相當夠用了。

上面的程式碼特別要注意的是，在處理過程中會透過位元組轉字串的功能，這邊是使用 UTF8 編碼來解析，所以字串如果是使用 Big5 編碼，就會發生錯誤，所以在使用前，最好先確認要解析的字串是使用 UTF-8 編碼或是 Unicode 編碼，再根據你的需求做調整。

而在使用 `DataContractJsonSerializer` 時，物件模型還可以搭配 `DataContractAttribute` 和 `DataMemberAttribute` 來做到自訂屬性名稱、屬性順序、給予型別預設值、以及是否為必要屬性的設定。

>請注意！`DataMemberAttribute` 是可以套用在私有屬性上的，因此即使其為私有的資料也會被序列化和反序列化。使用上有一些特別的注意事項，請參考[官方文件](https://docs.microsoft.com/zh-tw/dotnet/api/system.runtime.serialization.datamemberattribute?WT.mc_id=DT-MVP-5003022)。

為了稍微了解一下執行效能，這裡做了一個稍微複雜的物件，常見的屬性都放在裡面（如下），然後使用 [BenchmarkDotNet](https://benchmarkdotnet.org/articles/overview.html) 來測試這個自製的序列化/反序列化工具，對比 Newtonsoft.Json 和 System.Text.Json 的執行速度，結果如下：

```csharp
var demoObject = new Model
    {
        StringProperty = "string",
        IntProperty = 123,
        ListProperty = new List<string> { "A", "B", "C" },
        ObjectProperty = new Person { ID = 11, Name = "Poy Chang" }
    };
```

```
//|                              Method |     Mean |     Error |    StdDev |
//|------------------------------------ |---------:|----------:|----------:|
//| DataContractJsonConverter_Serialize | 3.108 us | 0.0614 us | 0.1373 us |
//|            JsonSerializer_Serialize | 1.253 us | 0.0278 us | 0.0788 us |
//|     NewtonsoftJsonConvert_Serialize | 2.791 us | 0.0719 us | 0.1933 us |
```

```
//|                                Method |      Mean |     Error |    StdDev |    Median |
//|-------------------------------------- |----------:|----------:|----------:|----------:|
//| DataContractJsonConverter_Deserialize | 12.378 us | 0.4570 us | 1.1959 us | 11.971 us |
//|            JsonSerializer_Deserialize |  2.338 us | 0.0467 us | 0.1015 us |  2.320 us |
//|     NewtonsoftJsonConvert_Deserialize |  4.466 us | 0.0886 us | 0.2089 us |  4.399 us |
```

從報表可知，在序列化的使用，效能的差異不會很大（但還是 1 或 2 倍的差距），而在反序列化的使用，差距就拉大比較多。因此還是要針對你的使用情境來做取捨，如果不講究速度，又想少相依一些套件，這種使用內建的類別，自製 JSON 序列化/反序列化工具，感覺也是挺好的。

>本篇完整範例程式碼請參考 [poychang/JsonConverterBenchmark](https://github.com/poychang/JsonConverterBenchmark)。

----------

參考資料：

* [How to serialize JSON object in C# without Newtonsoft Json](https://anduin.aiursoft.com/post/2020/10/13/how-to-serialize-json-object-in-c-without-newtonsoft-json)
* [How to serialize and deserialize JSON in C#](https://www.c-sharpcorner.com/article/json-serialization-and-deserialization-in-c-sharp/)
* [利用 DataContractJsonSerializer 實現物件序列化與反序列化](https://www.huanlintalk.com/2009/12/datacontractjsonserializer.html)
* [MS Docs - DataContractJsonSerializer 類別](https://docs.microsoft.com/zh-tw/dotnet/api/system.runtime.serialization.json.datacontractjsonserializer?WT.mc_id=DT-MVP-5003022)
* [MS Docs - DataMemberAttribute](https://docs.microsoft.com/zh-tw/dotnet/api/system.runtime.serialization.datamemberattribute?WT.mc_id=DT-MVP-5003022)
* [MS Docs - DataContractAttribute](https://docs.microsoft.com/zh-tw/dotnet/api/system.runtime.serialization.datacontractattribute?WT.mc_id=DT-MVP-5003022)
