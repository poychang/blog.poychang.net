---
layout: post
title: 序列化 Stream 格式的 JSON 資料
date: 2022-09-27 12:00
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI, Develop]
permalink: efficiently-streaming-large-http-responses-with-httpclient/
---

使用 API 的方式來取得 JSON 資料是現代化系統常見的方式，在接到 JSON 字串資料後，序列化成強型別的物件能讓後續處理變得容易，不過這樣的處理方式在大量資料的情境下，容易因為 JSON 字串資料的關係，造成記憶體耗用的比較兇，畢竟儲存字串本身會佔據記憶體空間。這時候如果在取回 HTTP Response 的時候，直接使用 Stream 的格式來處理 JSON 資料，就能有效的降低記憶體的使用量，這篇文章將會介紹如何使用 Stream 的方式來處理 JSON 資料。

假設我們有個 API 可以取得 JSON 資料，如下：

```csharp
var jsonFileUrl = "https://blog.poychang.net/apps/mock-json-data/json-array-data-10.json";
```

並假設我們已經有一個 `DataModel` 對應上述 API 所提供的 JSON 資料的格式。

## 過去的處理方式

過去我們會使用 `HttpClient` 來取得 JSON 資料字串，再交由 [Newtonsoft.Json](https://www.newtonsoft.com/json) 或 [System.Text.Json](https://docs.microsoft.com/en-us/dotnet/api/system.text.json) 來處理反序列化的動作，將 JSON 字串轉換成強型別的物件，程式碼如下：

```csharp
var httpClient = new HttpClient();
var httpRequest = new HttpRequestMessage(HttpMethod.Get, jsonFileUrl);
using var response = await httpClient.SendAsync(httpRequest);
var dataString = await response.Content.ReadAsStringAsync();
var data = JsonConvert.DeserializeObject<IEnumerable<DataModel>>(dataString);
```

也就是說，`HttpClient` 取得 `HttpResponseMessage` （也就是上述程式碼的 `response.Content`）的之後，使用 `ReadAsStringAsync()` 將內容以字串的方式讀出來，再使用 `JsonConvert.DeserializeObject()` 做反序列化成強行別物件。

## 使用 Stream 的處理方式

然而 `HttpClient` 有提供另一個讀取資料的方法 `ReadAsStreamAsync()`，可以將 `HttpResponseMessage` 的內容以 `Stream` 的方式讀出來，這樣就能有效的降低記憶體的使用量，程式碼如下：

```csharp
var httpClient = new HttpClient();
var httpRequest = new HttpRequestMessage(HttpMethod.Get, jsonFileUrl);
using var response = await httpClient.SendAsync(httpRequest, HttpCompletionOption.ResponseHeadersRead);
var dataStream = await response.Content.ReadAsStreamAsync();
```

### HttpClient 讀取技巧

由於我們是想要使用 Stream 資料流的方式來讀取資料，在讀取的過程中是邊讀邊處理，而非一次取得完整的資料後再進行操作。

因此在過程中，我們可以在 `SendAsync()` 中加上 `HttpCompletionOption.ResponseHeadersRead` 參數，讓 `HttpClient` 在取得 `HttpResponseMessage` 的 Header 後就表示已經完成呼叫，讓後續要處理的動作可以立刻接續進行，而不用等到 HttpClient 收到完整的回應後再進行後續處理，這樣的好處是效能會稍微好一些，同時因為 HttpClient 不需要對回應內容做 buffer 因此也能降低一些記憶體的使用量。

`HttpCompletionOption` 有以下兩個列舉值，詳細內容請參考 [HttpCompletionOption 列舉](https://learn.microsoft.com/zh-tw/dotnet/api/system.net.http.httpcompletionoption?WT.mc_id=DT-MVP-5003022)官方文件。

- `ResponseContentRead` 在讀取包括內容的完整回應之後，即完成操作。
- `ResponseHeadersRead` 在讀取到可使用的回應 Header 標頭後，就代表完成作業。請注意，這尚未讀取回應內容。

### 對 Stream 做 JSON 反序列化

在取得到回應的 Stream 資料之後，我們可以使用 [Newtonsoft.Json](https://www.newtonsoft.com/json) 來對 Stream 的資料做反序列化，程式碼如下：

```csharp
TResult ReadJsonStream<TResult>(Stream stream)
{
    using var reader = new StreamReader(stream);
    using var jsonReader = new Newtonsoft.Json.JsonTextReader(reader);

    return new Newtonsoft.Json.JsonSerializer().Deserialize<TResult>(jsonReader)!;
}
```

這邊我們使用 `Newtonsoft.Json.JsonSerializer()` 來對 Stream 的資料做反序列化，這裡會將整個 Stream 視為一個合法的 JSON 物件（Object 或 Array），例如：

```json
{ "id": 1, "name": "Poy" }
// 或是
[{ "id": 1, "name": "Poy" }, { "id": 2, "name": "Chang" }]
```

而有些情況下，這個 Stream 的資料是會串流多個 JSON 物件，仔細看下面的範例，他們個別都有兩個合法的 JSON 物件，但合併在一起看卻是不合法的 JSON 格式：

```json
{ "id": 1, "name": "Poy" }{ "id": 2, "name": "Chang" }
// 或是
[{ "id": 1, "name": "Poy" }, { "id": 2, "name": "Chang" }][{ "id": 3, "name": "Foo" }, { "id": 4, "name": "Bar" }]
```

像這樣的 JSON 資料流格式，還是可以使用 `Newtonsoft.Json.JsonTextReader` 來讀取 Stream 的資料，只要將 `JsonTextReader` 的 `SupportMultipleContent` 設定為 `true`，並且搭配使用 `yield return` 來回傳反序列化的結果，就能讓 `JsonTextReader` 連續讀取到多筆資料，範例程式碼如下：

```csharp
IEnumerable<TResult> ReadJsonStreamMultipleContent<TResult>(Stream stream)
{
    using var reader = new StreamReader(stream);
    using var jsonReader = new Newtonsoft.Json.JsonTextReader(reader)
    {
        SupportMultipleContent = true
    };
    var serializer = new Newtonsoft.Json.JsonSerializer();

    while (jsonReader.Read())
    {
        yield return serializer.Deserialize<TResult>(jsonReader)!;
    }
}
```

>請注意，因為回傳的是"多個" JSON 物件，因此回傳的型別是 `IEnumerable<TResult>`，而不是 `TResult`。

除了使用 Newtonsoft.Json 來處理 Stream 的 JSON 資料外，我們也可以使用 .NET 內建的 [System.Text.Json](https://docs.microsoft.com/en-us/dotnet/api/system.text.json) 來對 Stream 做相同的反序列化操作，程式碼如下：

```csharp
TResult ReadJsonStream<TResult>(Stream stream)
{
    return System.Text.Json.JsonSerializer.DeserializeAsync<TResult>(stream).GetAwaiter().GetResult()!;
}
```

>你可能會注意到在 `return` 的最後有加上 `!` 符號，這是因為範例專案有開啟 `Nullable` 因此會對回傳 null 的值做出警告，這時候可以使用[! 寬恕運算子](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/operators/null-forgiving)來忽略警告。

## 效能比較

這裡我們做 4 種效能測試，分別是使用 Newtonsoft.Json 或 System.Text.Json 分別對 String 或 Stream 做反序列化，並且使用 [BenchmarkDotNet](https://benchmarkdotnet.org/) 來計算執行時間與記憶體占用量，測試結果如下：

![效能與記憶體使用量的測試結果](https://i.imgur.com/4AfuWMA.png)

可以看到，使用 Stream 的方式來做反序列化，效能與記憶體使用量都比較好，而使用 `System.Text.Json` 的效能與記憶體使用量都比較好，因此在使用 `HttpClient` 讀取大量的 JSON 資料時，可以考慮使用 Stream 的方式來讀取，並且使用 `System.Text.Json` 來做反序列化。

>本篇完整範例程式碼請參考 [poychang/JsonStreamDeserializeBenchmark](https://github.com/poychang/JsonStreamDeserializeBenchmark)。

## 後記

透過這篇所提到的技巧，在接收並處理大尺寸的 JSON 資料時，可以有效的降低記憶體使用量，並且提升效能，這對於呼叫並處理大量資料的應用程式來說，是相當好用。

----------

參考資料：

* [ASP.NET Core IAsyncEnumerable 與 yield return 實測](https://blog.darkthread.net/blog/iasyncenumerable-in-mvc/)
* [Efficiently Streaming Large HTTP Responses With HttpClient](https://www.tugberkugurlu.com/archive/efficiently-streaming-large-http-responses-with-httpclient)
* [What is the correct way to use JSON.NET to parse stream of JSON objects?](https://stackoverflow.com/questions/26601594/what-is-the-correct-way-to-use-json-net-to-parse-stream-of-json-objects)
* [MS Docs - HttpCompletionOption 列舉](https://learn.microsoft.com/zh-tw/dotnet/api/system.net.http.httpcompletionoption?WT.mc_id=DT-MVP-5003022)
