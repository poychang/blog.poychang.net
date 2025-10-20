---
layout: post
title: 在 ASP.NET Web API 使用 IAsyncEnumerable 並串流至 JavaScript - PART 2
date: 2023-10-04 11:34
author: Poy Chang
comments: true
categories: [Javascript, CSharp, Dotnet, WebAPI, Develop, AI]
permalink: iasyncenumerable-with-asp-net-web-api-and-stream-to-javascript-part-2/
---

前陣子在[在 ASP.NET Web API 使用 IAsyncEnumerable 並串流至 JavaScript](../iasyncenumerable-with-asp-net-web-api-and-stream-to-javascript/)分享到使用 `IAsyncEnumerable<T>` 來處理串流資料，但是當時的範例的回傳值是 JSON 物件，這造成前端在解析資料時，必須處理 `IAsyncEnumerable<T>` 被 JSON 序列化後的格式，這讓前端不得不做一些額外處理。這篇將重新思考這段處理方式，在針對「模擬聊天情境，即時的一字字依序輸出在網頁上」這個目標下，重新設計 API 的回傳方式，讓前端可以更容易的處理串流資料。

> 本篇基於[在 ASP.NET Web API 使用 IAsyncEnumerable 並串流至 JavaScript](../iasyncenumerable-with-asp-net-web-api-and-stream-to-javascript/)的內容及範例程式碼，請先參考這篇文章。

## API 端

```csharp
[ApiController]
[Route("[controller]")]
public class StreamController : ControllerBase
{
    [HttpGet]
    [Route("object")]
    public async IAsyncEnumerable<Demo> GetObject()
    {
        for (int i = 0; i < 10; i++)
        {
            await Task.Delay(TimeSpan.FromSeconds(1));
            yield return new Demo { Id = i, Name = Guid.NewGuid().ToString() };
        }
    }
}
```

上面的程式碼是原本的做法，在 API 回傳資料的時候 `IAsyncEnumerable<Demo>` 經過 ASP.NET Core WebAPI 的序列化程序，將回傳值進行 JSON 序列化，這樣的做法會造成前端在接收資料時，必須要處理 `IAsyncEnumerable<Demo>` 被 JSON 序列化後的格式，這讓前端不得不做一些額外處理（詳閱上篇文章）。

這引發了一次思考，為了達到「模擬聊天情境，即時的一字字依序輸出在網頁上」的目標，我們真的需要將物件類型的資料嗎？如果我們將資料改成純文字，這樣的話，前端就不需要再處理 `IAsyncEnumerable<Demo>` 被 JSON 序列化後的格式，而是直接處理純文字即可。

不過如果在既有架構下，當我們直接改用 `IAsyncEnumerable<string>` 作為回傳類型，這樣是沒有用的，如下的程式碼：

```csharp
[HttpGet]
[Route("string")]
public async IAsyncEnumerable<string> GetString()
{
    for (int i = 0; i < MAX; i++)
    {
        await Task.Delay(TimeSpan.FromSeconds(1));
        yield return Guid.NewGuid().ToString();
    }
}
```

這樣的寫法不會脫離回傳值被 ASP.NET Core WebAPI 進行 JSON 序列化的動作，回傳的結果會像下面這樣，一行是一次傳送到前端的資料。

```
["c97eed80-0948-42c9-85e4-0a30bb9df613"
,"ae09674e-b706-4a69-9505-43be9f04e112"
,"2f8d6fe4-cb2d-4796-925a-a875e8b61adf"
,"ca15f991-7091-4529-be1a-f2b06abd8fc7"]
```

> 在原本的寫法中，回傳值有可能不會一筆一筆回傳，而是一次回傳 n 筆，這取決於 Yield 的內部處理。

我們需要一個做法來避免回傳值被進行 JSON 序列化的動作。

要達成這點，我們可以使用 `IActionResult` 作為回傳類型，並在回傳時，使用 `Response.WriteAsync()` 來逐筆將資料加到回應內容中，這樣的做法，我可以完全掌控回傳值的長相。

再搭配呼叫某個回傳值是 `IAsyncEnumerable<string>` 的方法（如下的 `Streaming()`），將每次 `yield return` 的資料寫入 `Response` 內容中，並在全部資料完成寫入後，告訴 `Response` 我完成了。

如此一來，前端就可以在同一個 HTTP 連線中持續獲得資料，直到回應結束。

程式碼如下：

```csharp
[HttpGet]
[Route("just-string")]
public async Task<IActionResult> GetJustString()
{
    // 設定回應的 Content-Type
    Response.Headers.Append("Content-Type", "text/plain");
    // 逐筆將資料加到回應內容中
    await foreach (var item in Streaming())
    {
        if (item is null) continue;
        await Response.WriteAsync(item);
    }
    // 完成回應
    await Response.CompleteAsync();
    // 最終返回一個空結果
    return new EmptyResult();

    async IAsyncEnumerable<string> Streaming()
    {
        for (int i = 0; i < MAX; i++)
        {
            await Task.Delay(TimeSpan.FromSeconds(1));
            yield return Guid.NewGuid().ToString();
        }
    }
}
```

這樣的做法，回傳的結果會像下面這樣，一行是一次傳送到前端的資料：

```
c97eed80-0948-42c9-85e4-0a30bb9df613
ae09674e-b706-4a69-9505-43be9f04e112
2f8d6fe4-cb2d-4796-925a-a875e8b61adf
ca15f991-7091-4529-be1a-f2b06abd8fc7
```

## JavaScript 端

先前在 JavaScript 這邊需要針對 JSON 的格式做一些處理，但是現在我們改用純文字的方式，因此前端就不需要再額外的處理，也就是在執行 `callback()` 的時候不需要呼叫 `tolerantParse()` 來將收到的資料洗乾淨。

```javascript
function stream(callback) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };
    fetch('http://localhost:5213/stream/object', requestOptions)
        .then((response) => {
            const reader = response.body.getReader();
            // 處理資料流中的每個資料區塊
            reader.read().then(function pump({ done, value }) {
                // "done" 是布林值，代表該資料流是否結束
                // "value" 是 Uint8Array，代表每個資料區塊的內容值
                // 當收到資料流結束的訊號，則關閉此資料流
                if (done) return;

                // 將 Uint8Array 轉成 string，然後交給 callback 函式處理
                let data = new TextDecoder().decode(value);
                callback(data);

                // 讀取下一段資料區塊
                return reader.read().then(pump);
            });
        })
        .catch((error) => console.log('error', error));
}
```

> 本篇完整範例程式碼請參考 [poychang/demo-AsyncEnumerableApi](https://github.com/poychang/demo-AsyncEnumerableApi)。

## 後記

這篇的重點在於 API 端，以及思考回傳的內容應該長什麼樣。

在 API 端，我們透過直接將所要提供的文字資料寫入 HTTP Response，來達到避免資料被 ASP.NET Core 內建的序列化機制處理，讓前端可以更單純的處理串流文字的內容即可。

而之所以會延伸出這樣的做法，是因為在思考串流類型的資料該如何呈現。在網路上看到一些對 OpenAI 界接 Stream 的對話回應資料的分享，不少人都是特別寫一段解析純文字成 JSON 的方法，不論是透過正規表達式或是其他方式，這樣的做法讓我覺得**奇怪**，也不是不對，只是這樣除了會增加前端處理內容的負擔，而且 OpenAI 的 Completion API 所回應的內容中，許多資訊是前端不需要知道的，例如回應的 ID、建立時間、所使用的模型名稱，等等這類的資訊。

像是 LLM 的對話應用，呼叫的內容重點應該擺在**回應的內容**上，也就對話中的文字內容。至於其他資訊如果真的需要，就透過其他方式取得吧。

---

參考資料：

* [MS Learn - HttpResponse 類別](https://learn.microsoft.com/zh-tw/dotnet/api/microsoft.aspnetcore.http.httpresponse?WT.mc_id=DT-MVP-5003022)
* [在 ASP.NET Core 用 Response.Body.FlushAsync 實現簡易即時進度回報](https://blog.darkthread.net/blog/resp-body-flushasync/)