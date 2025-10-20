---
layout: post
title: 設定 .NET Notebook 預設的 display 筆數限制
date: 2021-10-15 16:34
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Tools]
permalink: set-dotnet-notebook-display-record-limit/
---

在使用 .NET Notebook 的時候，有個內建的 `display()` 功能很方便，可以快速將資料呈現出來，不過在呈現大量資料的時候你會發現，他只會輸出少少的 20 筆資料，這時候我們可以怎麼擺脫這個限制呢？

舉個例子，當我們用 `HttpClient` 去呼叫一個 API，取得一組資料清單，然後用 `display()` 將資料輸出，你可以把下面這段程式碼放到 .NET Notebook 去跑看看：

```csharp
using System.Net.Http;
using System.Text.Json;

public class Post
{
    public int userId { get; set; }
    public int id { get; set; }
    public string title { get; set; }
    public string body { get; set; }
}

var client = new HttpClient() { BaseAddress= new Uri("https://jsonplaceholder.typicode.com/") };
var result = client.GetAsync("posts").GetAwaiter().GetResult().Content.ReadAsStringAsync();
var data = JsonSerializer.Deserialize<List<Post>>(result.Result).Select(p=> new { User = p.userId });

display(data);
```

你會看到最下方的 `(80 more)`，告訴你還有 80 筆資料沒有輸出。

https://i.imgur.com/Xl8QPA3.png


這時候你要怎麼將剩下的資料輸出呢？

因為輸出區塊主要是透過 HTML 去呈現的，避免過多的資料造成效能問題，所以預設限制只會顯示 20 筆資料，但我們可以手動修改這個預設值，修改下面這個靜態屬性即可：

```csharp
Microsoft.DotNet.Interactive.Formatting.Formatter.ListExpansionLimit = 100;
```

這樣就可以用 `display()` 來顯示 100 筆資料囉。

## 後記

如果你想要看看原始碼在哪裡了話，可以點[這裡](https://github.com/dotnet/interactive/blob/main/src/Microsoft.DotNet.Interactive.Formatting/Formatter.cs#L122)去 GitHub 上看看這個預設值是在哪裡被設定的。

----------

參考資料：

* [.NET Interactive Notebook - Formatting](https://github.com/dotnet/interactive/blob/main/docs/formatting.md)
