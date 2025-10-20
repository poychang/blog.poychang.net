---
layout: post
title: 取得 HttpClient 的回應時間
date: 2023-01-11 11:11
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: get-httpclient-response-time/
---

在開發 Web API 時，有時候會需要知道每次呼叫該 API 時的網路狀況，例如：網路速度、網路狀況等等，如果想要知道該次呼叫的回應時間，可以搭配使用 `Stopwatch` 來計算，這篇是段簡短的範例程式碼，讓我們使用 `HttpClient` 的時候，同時取得回應訊息以及回應時間。

```csharp
void Main()
{
    var urls = new List<string> { "https://google.com", "https://twitter.com", "https://blog.poychang.net" };
    urls.ForEach(async url => {
        var info = await GetHttpWithTimingInfo(url);
        Console.WriteLine($"Request to '{url}' took {info.Item2}{Environment.NewLine}Response message: {info.Item1}");
        Console.WriteLine();
    });
}

private async Task<Tuple<HttpResponseMessage, TimeSpan>> GetHttpWithTimingInfo(string url)
{
    var stopWatch = Stopwatch.StartNew();
    using var client = new HttpClient();    
    return new Tuple<HttpResponseMessage, TimeSpan>(await client.GetAsync(url), stopWatch.Elapsed);
}
```

---

參考資料：

* [How to get HttpClient response time when running in parallel](https://stackoverflow.com/questions/14177725/how-to-get-httpclient-response-time-when-running-in-parallel/14177766)
