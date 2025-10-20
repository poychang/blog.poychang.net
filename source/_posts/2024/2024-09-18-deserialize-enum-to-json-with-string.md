---
layout: post
title: 用簡單的方法讓 WebAPI 將 Enum 用自訂的文字輸出
date: 2024-09-18 11:34
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI]
permalink: deserialize-enum-to-json-with-string/
---
使用 Enum 的好處很多，可以有強型別又有 intellisense 提示，還可以增加閱讀性，但在 WebAPI 中要將 Enum 的值輸出時，有點不如期待，他會用數字代碼來當作 JSON 的值，這樣有點不方便閱讀，這裡提供 3 種方法，讓你用簡單的方式，把 Enum 用有意義的文字做輸出。

假設你有個 Enum 來標示產品狀態，產品模型和 Enum 狀態的程式碼長得像下面這樣：

```csharp
public class Product
{
    public string Name { get; set; }
    public Status Status { get; set; }
}

public enum Status
{
    Normal,
    Warning,
    Error
}
```

如果透過下面的 Controller 把一群產品狀態丟回前端時：

```csharp
public class ValueController : ControllerBase
{
    // GET api/value
    [HttpGet]
    public IActionResult Get()
    {
        var productList = new List<Product>()
        {
            new Product(){ Name= "A", Status = Status.Normal},
            new Product(){ Name= "B", Status = Status.Warning},
            new Product(){ Name= "C", Status = Status.Error}
        };

        return new JsonResult(productList);
    }
}
```

會得到的回應資料會長這樣：

```json
[
  {
    "name": "A",
    "status": 0
  },
  {
    "name": "B",
    "status": 1
  },
  {
    "name": "C",
    "status": 2
  }
]
```

這樣的狀態資訊是不容易閱讀的，這時候你可能會想到拿到的有意義的文字，而不是用數字代碼來表達。

## 解法一：在 `Startup.cs` 設定 JSON 序列化

這時候你可以在 `Startup.cs` 檔案中，在 `AddMvc` 加入 JSON 的序列化設定，下面的程式碼會將 Enum 轉成 JSON 時用名稱替代，並且忽略 JSON 中 Null 的屬性值。

```csharp
public class Startup
{
    public IServiceProvider ConfigureServices(IServiceCollection services)
    {
      services.AddMvc()
          .AddJsonOptions(options =>
              {
                  options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
                  options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
              });
    }
}
```

## 解法二：在 Enum 上加上 JsonConverter (Newtonsoft.Json)

不過上面這個解法我沒有很喜歡，我喜歡下面這一種，不在這麼頂層的地方處理，而是在靠近模型的地方操作，這樣對我來說比較容易記憶用途。

因此在不修改 `Startup.cs` 檔案的前提下，Enum 可以使用 Json.NET 的 `JsonConverter` 搭配內建的 `StringEnumConverter` 處理，參考下面的寫法：

```csharp
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace API.Models
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Status
    {
        Normal,
        Warning,
        Error
    }
}
```

會得到的回應資料會長這樣：

```json
[
  {
    "name": "A",
    "status": "Normal"
  },
  {
    "name": "B",
    "status": "Warning"
  },
  {
    "name": "C",
    "status": "Error"
  }
]
```

是不是變得比較容易閱讀了。

## 解法三：在 Enum 上加上 JsonConverter (System.Text.Json)

後來 `System.Text.Json` 也有推出相同的處理方式，只是要使用 `JsonStringEnumConverter` 來處理，參考下面的寫法：

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;

namespace API.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Status
    {
        Normal,
        Warning,
        Error
    }
}
```

最後一種方式，是我最喜歡的。

## 自訂輸出文字

如果你想要自訂輸出的文字，`Enum` 可以加上 `System.Runtime.Serialization` 的 `EnumMemberAttribute` 來做覆寫，參考下面的寫法：

```csharp
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace API.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Status
    {
        [EnumMember(Value = "It's Normal")]
        Normal,
        [EnumMember(Value = "It's Warning")]
        Warning,
        [EnumMember(Value = "It's Error")]
        Error
    }
}
```

這樣結果就變成：

```json
[
  {
    "name": "A",
    "status": "It's Normal"
  },
  {
    "name": "B",
    "status": "It's Warning"
  },
  {
    "name": "C",
    "status": "It's Error"
  }
]
```

----------

參考資料：

* [Deserialize json character as enumeration](https://stackoverflow.com/questions/18551452/deserialize-json-character-as-enumeration)
* [ASP.NET Core - Json serializer settings Enum as string and ignore null values](https://gist.github.com/regisdiogo/27f62ef83a804668eb0d9d0f63989e3e)
