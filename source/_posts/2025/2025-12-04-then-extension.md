---
layout: post
title: 「然後呢」擴充方法
date: 2025-12-04 00:12
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: then-extension/
---

受到 Fluent API 的啟發，想寫一個「然後呢」的擴充方法，讓程式碼看起來更有語意，就像是在做完一件事之後，接著有人問「然後呢？」。

> Fluent API 是一種程式設計風格，透過「鏈式呼叫」方法讓程式碼更直覺、可讀性更高，利用方法鏈結（method chaining）來設定物件或模型，讓程式碼像自然語言般流暢。

## 直接上程式碼 `ThenExtension.cs`

```csharp
public static class ThenExtension
{
    /// <summary>
    /// "然後呢"擴充方法
    /// </summary>
    /// <typeparam name="T">原始物件型別</typeparam>
    /// <param name="instance">原始物件</param>
    /// <param name="action">接收原始物件後，然後你要執行什麼</param>
    /// <returns>回傳原始物件，本方法不建立新物件</returns>
    public static T Then<T>(this T instance, Action<T> action) { action(instance); return instance; }

    /// <summary>
    /// "然後呢"擴充方法
    /// </summary>
    /// <typeparam name="TSource">原始物件型別</typeparam>
    /// <typeparam name="TResult">不同型別的物件</typeparam>
    /// <param name="instance">原始物件</param>
    /// <param name="fn">接收原始物件後，然後你要執行什麼，完成後回傳結果物件</param>
    /// <returns>回傳結果物件，和原始物件不同</returns>
    public static TResult Then<TSource, TResult>(this TSource instance, Func<TSource, TResult> fn) => fn(instance);

    /// <summary>
    /// "如果這樣然後呢"擴充方法：依條件決定要執行哪個動作
    /// </summary>
    /// <param name="condition">如果...true/false</param>
    /// <param name="trueFn">當條件為 true 時要執行的動作（可省略）</param>
    /// <param name="falseFn">當條件為 false 時要執行的動作（可省略）</param>
    public static void IfThen(this bool condition, Action<bool> trueFn = null, Action<bool> falseFn = null)
    {
        if (condition) trueFn?.Invoke(condition);
        else falseFn?.Invoke(condition);
    }
}
```

## 使用範例

以下示範如何把 `Then` 與 `IfThen` 串在一起，讓物件初始化、後續處理與條件判斷維持在同一段可讀性高的語意流程：

```csharp
var order = new Order
{
    Id = Guid.NewGuid(),
    CustomerName = "Poy",
    Total = 420m
}
.Then(o => Console.WriteLine($"建立訂單：{o.Id}"))
.Then(o =>
{
    // 下單後順便加上 5% 服務費
    o.Total += o.Total * 0.05m;
    return o;
});

(order.Total > 500m).IfThen(
    trueFn: _ => Console.WriteLine("金額超過 500，安排經理審核"),
    falseFn: _ => Console.WriteLine("金額未達 500，照常出貨"));

public record Order
{
    public Guid Id { get; init; }
    public string CustomerName { get; init; }
    public decimal Total { get; set; }
}
```

這樣在閱讀程式碼時就像在描述：建立訂單，**然後**記錄、**然後**加上服務費，**然後**在最後根據金額決定下一步。

透過這個擴充方法，讓程式碼能更貼近語意表達的流程，這樣的做法能比分散在多個方法中更聚焦。

---

參考資料：

- []()
- [MS Learn](?WT.mc_id=DT-MVP-5003022)