---
layout: post
title: 處理型別為介面的 JSON 序列化行為
date: 2021-03-08 12:41
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: json-serialize-with-interface-derived-property/
---

前陣子我的套件在 GitHub 收到一個 [Issue](https://github.com/poychang/MessageCardModel/issues/4)，在使用裡面 `ToJson()` 這個方法的時候，因為目標屬性是個介面型別，造成原物件的屬性值不會被序列化出來，所以就造成產生出來的 Json 字串無法正確使用了。這裡試著還原當時遇到的情境。

這邊假設我有以下的物件結構，`People` 類別中有個 `Card` 是使用 `ITag` 介面作為屬型型別，這個 `ITag` 有兩種實作，分別有不同的"樣貌"。

```csharp
public class People
{
    public ITag Card { get; set; }
}
public interface ITag
{
    public string Name { get; set; }
}
public class ATag : ITag
{
    public string Name { get; set; }
    public int Age { get; set; }
}
public class BTag : ITag
{
    public string Name { get; set; }
    public string Gender { get; set; }
}
```

當我建立了兩個分別使用不同 `ITag` 實作的物件 `John` 和 `Mary`，並使用 `System.Text.Json` 的 `JsonSerializer` 序列化輸出時，實際上輸出的結果和希望得到的有了落差，因為序列化時，會使用 `ITag` 做處理，造成使用 `ATag` 實作的輸出少了 `Age` 屬性，使用 `BTag` 實作的輸出少了 `Gender` 屬性。

```csharp
var john = new People();
john.Card = new ATag
{
    Name = "John",
    Age = 20,
};
var mary = new People();
mary.Card = new BTag
{
    Name = "Mary",
    Gender = "Female",
};

JsonSerializer.Serialize(john);
// 希望得到的輸出：{"Card":{"Name":"John","Age":20}}
// 但實際上是輸出：{"Card":{"Name":"John"}}
JsonSerializer.Serialize(mary);
// 希望得到的輸出：{"Card":{"Name":"Mary","Gender":"Female"}}
// 但實際上是輸出：{"Card":{"Name":"Mary"}}
```

要怎麼處理呢？

其實我沒有完美的處理方案（如果你以想法請告訴我），我想到我能做的就只是增加一個客製的 `JsonConverter`，讓 `JsonSerializer` 序列化到 `ITag` 這個型別的時候，用我客製的規則來處理。

客製的規則其實是靠 [Pattern Matching 型別模式比對](https://docs.microsoft.com/zh-tw/dotnet/csharp/pattern-matching?WT.mc_id=DT-MVP-5003022)來達成，在序列化時若發現進來的型別是 `ATag` 則使用 `ATag` 來做序列化，反之亦然。

```csharp
public class ITagConverter : JsonConverter<ITag>
{
    public override ITag Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
    public override void Write(Utf8JsonWriter writer, ITag value, JsonSerializerOptions options)
    {
        switch (value)
        {
            case ATag tag:
                JsonSerializer.Serialize(writer, tag, options);
                break;
            case BTag tag:
                JsonSerializer.Serialize(writer, tag, options);
                break;
            default:
                throw new ArgumentException(message: "It is not a recognized type.", paramName: nameof(value));
        }
    }
}
```

寫出來的程式碼感覺精簡，但是是靠寫死的方式來做，無法做到通用處理，畢竟會有那些實作該介面的型別，只有自己才知道。

## 完整的程式碼

這裡提供用 LinqPad 寫的完整、可執行程式碼，提供給想要玩玩看的人。

```csharp
void Main()
{
    var john = new People();
    john.Card = new ATag
    {
        Name = "John",
        Age = 20,
    };
    var mary = new People();
    mary.Card = new BTag
    {
        Name = "Mary",
        Gender = "Female",
    };
    var option = new JsonSerializerOptions();
    option.Converters.Add(new ITagConverter());
    
    JsonSerializer.Serialize(john, option).Dump();
    JsonSerializer.Serialize(mary, option).Dump();
}

public class ITagConverter : JsonConverter<ITag>
{
    public override ITag Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
    public override void Write(Utf8JsonWriter writer, ITag value, JsonSerializerOptions options)
    {
        switch (value)
        {
            case ATag tag:
                JsonSerializer.Serialize(writer, tag, options);
                break;
            case BTag tag:
                JsonSerializer.Serialize(writer, tag, options);
                break;
            default:
                throw new ArgumentException(message: "It is not a recognized type.", paramName: nameof(value));
        }
    }
}

public class People
{
    public ITag Card { get; set; }
}
public interface ITag
{
    public string Name { get; set; }
}
public class ATag : ITag
{
    public string Name { get; set; }
    public int Age { get; set; }
}
public class BTag : ITag
{
    public string Name { get; set; }
    public string Gender { get; set; }
}
```

----------

參考資料：

* [如何在 .NET 中撰寫 JSON 序列化的自訂轉換器](https://docs.microsoft.com/zh-tw/dotnet/standard/serialization/system-text-json-converters-how-to?WT.mc_id=DT-MVP-5003022)
* [模式比對](https://docs.microsoft.com/zh-tw/dotnet/csharp/pattern-matching?WT.mc_id=DT-MVP-5003022)

