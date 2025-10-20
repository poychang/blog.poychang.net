---
layout: post
title: System.Text.Json 忽略名稱大小寫做序列化/反序列化
date: 2020-02-03 21:11
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: system-text-json-use-case-honor-serializer/
---

使用 `System.Text.Json` 做序列化/反序列化的時候，如果看起來程式沒有錯，但不知道為甚麼序列化一直失敗，或是反序列化一直拿到 `null` 而無法取得所設定的值，很有可能就是你中了**尊重名稱大小寫**這個雷，解法就是將 `JsonSerializerOptions` 的 `PropertyNameCaseInsensitive` 屬性設定成 `true` 就可以了。

過去在使用 Json.NET 的 `JsonConverter` 做序列化/反序列化的時候，我們很少會去在意 JSON 屬性名稱大小寫的問題，例如下面的 JSON 和物件的轉換：

```json
{
    "id": 123,
    "name": "Poy Chang"
}
```

```csharp
public class Demo
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```

不管怎麼轉都沒問題，但你轉到使用 `System.Text.Json` 的 `JsonSerializer` 的時候，你會發現會在使用 `Deserialize<T>()` 反序列化的時候，一直無法正確轉換，如下圖：

![無法正確做反序列化](https://i.imgur.com/VD6f1bc.png)

明明程式沒錯，卻無法正確反序列化，原因是 `JsonSerializer` 預設是**尊重名稱大小寫** (Case Insensitive)，所以要將 JSON 的 `id` 對應到 C# 的 `Id` 時，就對應不到了，而這時會用該型別的 `default` 值來回應。

>通常 Case Insensitive 會翻譯成**不區分大小寫**，但我這邊用**尊重名稱大小寫**來強調，因為常見於 JavaScript (Lower Camel Case) 和 C# (Pascal Case) 兩者的命名習慣不同，然而不總是這樣的開發環境配對，因此尊重開發者所設計的名稱大小寫，其實是一件得宜的設計。

## 解法一：使用 JsonPropertyName

如果確定 JSON 的名稱一定是使用 Lower Camel Case 的命名習慣，你可以直接在對應的 C# 物件屬性上使用 `JsonPropertyName` 來設定對應的名稱。

```csharp
public class Demo
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; }
}
```

這不僅是可以用命名習慣的不同，你甚至可以取一個完全不同的名字來做對應。

## 解法二：設定 PropertyNameCaseInsensitive

使用 `JsonSerializer` 的時候，我們可以透過 `JsonSerializerOptions` 設定，告訴 `JsonSerializer` 在做序列化/反序列化的時候，忽略名稱大小寫，參考下述使用方式：

```csharp
var json = "{\"id\":123,\"name\":\"Poy Chang\"}";
var options = new JsonSerializerOptions
{
    // 設定在做序列化/反序列化時，尊重名稱大小寫
    PropertyNameCaseInsensitive = true
};
JsonSerializer.Deserialize<Demo>(json, options);
```

如此一來就可以正確地將 JSON 字串反序列化成 C# 物件了。

![正確地將 JSON 字串反序列化成 C# 物件](https://i.imgur.com/zcEB9sD.png)

----------

參考資料：

* [System.Text.Json JsonSerializerOptions 類別](https://docs.microsoft.com/zh-tw/dotnet/api/system.text.json.jsonserializeroptions)
