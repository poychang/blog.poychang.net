---
layout: post
title: System.Text.Json 反序列化/序列化轉換 TimeSpan 型別
date: 2020-02-05 01:40
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: system-text-json-custom-jsonconverter-for-timespan/
---

`System.Text.Json` 目前無法反/序列化轉換 `TimeSpan` 型別，但從 .NET 5 的 [Milestone](https://github.com/dotnet/runtime/milestone/7)可以知道，這功能將會包含在 .NET 5 之中，在此之前，如果真的要對 `TimeSpan` 做反/序列化轉換，可以自行實作 JsonConverter 來處理。

>根據官方[時程表](https://github.com/dotnet/core/blob/master/roadmap.md)，.NET 5 將會在 2020 年 11 月發布，所以這篇作法很可能到那時候，就再也不需要了。

## 實作 JsonTimeSpanConverter

直接在 `System.Text.Json.Serialization` 命名空間底下，實作 `JsonConverter<TimeSpan>` 來建立一個可以用來轉換 `TimeSpan` 的 `JsonConverter`，程式碼參考如下：

```csharp
using System.Globalization;

namespace System.Text.Json.Serialization
{
    /// <summary>
    /// <see cref="JsonConverter"/> to convert TimeSpan to and from strings.
    /// </summary>
    public class JsonTimeSpanConverter : JsonConverter<TimeSpan>
    {
        public override TimeSpan Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.String)
                throw new NotSupportedException();
            if (typeToConvert != typeof(TimeSpan))
                throw new NotSupportedException();

            // 使用常量 "c" 來指定用 [-][d.]hh:mm:ss[.fffffff] 作為 TimeSpans 轉換的格式
            return TimeSpan.ParseExact(reader.GetString(), "c", CultureInfo.InvariantCulture);
        }

        public override void Write(Utf8JsonWriter writer, TimeSpan value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("c", CultureInfo.InvariantCulture));
        }
    }
}
```

## 使用方式

假設我們有下面 `DemoClass` 這個類別，只要在型別為 `TimeSpan` 的屬性上面，加上 `[JsonConverter(typeof(JsonTimeSpanConverter))]`，這樣 `JsonSerializer` 在做反/序列化轉換時，就會使用我們自行實作的 `JsonTimeSpanConverter` 來做轉換。

```csharp
public class DemoClass
{
    [JsonConverter(typeof(JsonTimeSpanConverter))]
    public TimeSpan TimeSpan { get; set; }
}
```

這樣下面的程式就可以正常反/序列化轉換了，而不會出現 `System.Text.Json.JsonException: The JSON value could not be converted to System.TimeSpan.` 這樣的錯誤了。

```csharp
var obj = new DemoClass
{
    TimeSpan = new TimeSpan(1, 0, 0)
};
Console.WriteLine(JsonSerializer.Serialize(obj));
// 輸出： {"TimeSpan":"01:00:00"}

var jsonString = "{\"TimeSpan\": \"01:00:00\"}";
Console.WriteLine(JsonSerializer.Deserialize<DemoClass>(jsonString).TimeSpan);
// 輸出： 01:00:00
```

## 如果是用 Json.NET

如果是使用 [Json.NET](https://www.newtonsoft.com/json) 了話，就不需要自己寫 `JsonConverter`，他內建的 `SerializeObject` 和 `DeserializeObject` 就可以直接反序列化/序列化 TimeSpan 型別，只能說 Json.NET 功能還是比較完整呀。

以上面的測試範例改用 `Newtonsoft.Json`，直接寫這樣就搞定：

```csharp
var obj = new DemoClass
{
    TimeSpan = new TimeSpan(1, 0, 0)
};
Console.WriteLine(JsonConvert.SerializeObject(obj));
// 輸出： {"TimeSpan":"01:00:00"}

var jsonString = "{\"TimeSpan\": \"01:00:00\"}";
Console.WriteLine(JsonConvert.DeserializeObject<DemoClass>(jsonString).TimeSpan);
// 輸出： 01:00:00
```

----------

參考資料：

* [System Text JsonSerializer Deserialization of TimeSpan](https://stackoverflow.com/questions/59557138/system-text-jsonserializer-deserialization-of-timespan)
* [JsonSerializer support for TimeSpan in 3.0? #29932](https://github.com/dotnet/runtime/issues/29932)
* [Macross Software JSON Extensions - TimeSpans](https://github.com/Macross-Software/core/blob/develop/ClassLibraries/Macross.Json.Extensions/README.md)
* [ASP.NET Core 3.0 - Custom JsonConverter For The New System.Text.Json](https://www.thinktecture.com/asp-net/aspnet-core-3-0-custom-jsonconverter-for-the-new-system_text_json/)
