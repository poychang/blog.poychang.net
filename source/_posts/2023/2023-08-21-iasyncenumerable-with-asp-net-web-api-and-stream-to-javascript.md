---
layout: post
title: 在 ASP.NET Web API 使用 IAsyncEnumerable 並串流至 JavaScript
date: 2023-08-21 14:34
author: Poy Chang
comments: true
categories: [Javascript, CSharp, Dotnet, WebAPI, Develop, AI]
permalink: iasyncenumerable-with-asp-net-web-api-and-stream-to-javascript/
---

在玩 ChatGPT 的時候，對於如何將聊天機器人的回應，即時的一字字依序輸出在網頁上，這樣的互動體驗非常有沉浸感，讓人真的有在和 AI 對話的感覺。當我們想要使用 ASP.NET Core WebAPI 以及 JavaScript 來呈現這樣的體驗時，如何讓後端 API 串流的輸出內容，並讓 JavaScript 在呼叫該 API 後能依序接受這樣的資料流，這時候問題就來了，兩者之間要如何串流資料呢？這篇提供一種處理方法。

## API 端

在 ASP.NET Core 5 的時候，MVC 框架就開始支援輸出 `IAsyncEnumerable<T>` 類別，到了 ASP.NET Core 6 的時候，開始使用 `System.Text.Json` 格式化，從這時候開始，ASP.NET Core 可以用較少的記憶體使用量來處理串流資料。

由於 ASP.NET Core 已經在內部完成了相對應的處理，因此要在 WebAPI 中使用 `IAsyncEnumerable<T>` 並不困難，只要在回傳值的地方，使用 `yield return` 就可以了。

這裡透過 `Task.Delay` 來模擬依序回傳資料，在真實案例中，這段程式碼可以是你使用 `Azure.AI.OpenAI` 套件呼叫 `GetChatCompletionsStreamingAsync()`，取得 GPT 的串流回應。下面是個簡單的模擬範例：

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

## JavaScript 端

至於前端該如何呼叫這個 API 並接收串流的資料呢？

這裡我使用 `fetch` 來呼叫 API，這部分的操作方式和以前一樣。不同的是，接收到回傳值的時候，由於是資料流的形式，因此要使用 `getReader()` 方法來取得 `response.body` 的可讀取資料流 `ReadableStream`（詳參考 MDN - [ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 和 [Using readable streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)），在依序接收串流資料時，我們可以根據每一段收到的資料，額外進行處理。

至於要做甚麼處理，這裡我寫成 `callback` 的方式，讓使用者可以自行定義處理方式，這樣就可以達到更大的彈性。

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
                callback(tolerantParse(data));

                // 讀取下一段資料區塊
                return reader.read().then(pump);
            });
        })
        .catch((error) => console.log('error', error));
}
```

眼尖的你可能會發現，在執行 `callback` 的時候，有先將每個區塊的資料通過 `tolerantParse()` 方法做處理，這是因為 ASP.NET Core WebAPI 在 `IAsyncEnumerable<T>` 的回傳值中，整體來說是一個陣列，因此第一筆區塊會是以 `[` 開頭，中間的區塊則會以 `,` 開頭，最後一筆還用 `]` 做結尾，你可以想像成下面的資料範例每一行就是一個區塊：

```json
[{"id":0,"name":"8acab337-5065-4879-be66-01a3ca46fb3d"}
,{"id":1,"name":"8ba7d07b-aff6-4aaf-9de5-483c9797fab1"}
,{"id":2,"name":"e87fa3b0-9e6b-47f5-b8ea-c964d7bc5eef"}
,{"id":3,"name":"b17e4839-2a71-4699-a483-c6cb0565ca2f"}]
```

因此必須對這些區塊值做處理，才能正確的轉成正確的 JSON 格式，再交給 `callback` 函式處理。

```javascript
function tolerantParse(str) {
    // 移除開頭的逗號和 [ 符號
    if (str.startsWith(',') || str.startsWith('[')) str = str.slice(1).trim();
    // 移除結尾的 ] 符號
    if (str.endsWith(']')) str = str.slice(0, -1);
    return `[${str}]`;
}
```

最後則是前端 JavaScript 的呼叫使用，看你要怎麼對這些資料做處理，這裡我只是單純的將資料印在網頁上。

```javascript
stream((data) => {
    console.log(data);
    document.getElementById('response').innerHTML += data + '<br>';
});
```

![執行效果](https://i.imgur.com/QFJQjKt.gif)

> 本篇完整範例程式碼請參考 [poychang/demo-AsyncEnumerableApi](https://github.com/poychang/demo-AsyncEnumerableApi)。

## 後記

這篇的作法為了處理 `IAsyncEnumerable<T>` JSON 序列化後的格式，在前端做了一些妥協，不得不額外做特別的處理。後來針對這件事情重新思考了一下，在針對「模擬聊天情境，即時的一字字依序輸出在網頁上」這個目標下，重新設計 API 的回傳方式，讓前端可以更容易的處理串流資料。

關於這件事，請詳閱[在 ASP.NET Web API 使用 IAsyncEnumerable 並串流至 JavaScript - PART 2](../iasyncenumerable-with-asp-net-web-api-and-stream-to-javascript-part-2/)的內容及範例程式碼，請先參考這篇文章。

---

參考資料：

* [MDN - Using readable streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)
* [MDN - ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)
* [Clarification on how IAsyncEnumerable works with ASP.NET Web API](https://stackoverflow.com/questions/58876817/clarification-on-how-iasyncenumerable-works-with-asp-net-web-api)
* [ChatGPT 聊天程式練習 - 使用 .NET + Azure OpenAI API](https://blog.darkthread.net/blog/chatgpt-console-chat/)
* [MS Learn - IAsyncEnumerable](https://learn.microsoft.com/zh-tw/dotnet/api/system.collections.generic.iasyncenumerable-1?WT.mc_id=DT-MVP-5003022)

