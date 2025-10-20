---
layout: post
title: 試試看管線導向程式設計 (Pipeline-oriented programming)
date: 2024-07-31 14:16
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: try-to-pipeline-oriented-programing/
---

NDC Porto 2023 有一場議程在講管線導向程式設計 (Pipeline-oriented programming)，和平常常見的程式設計方法不同，雖然我不會完全改用這樣的設計方法，但有時間的時候嘗試看看，可以讓思考方法變得更多元一些。

> 這裡不做解釋，想了解關於管線導向程式設計，請直接看這個影片：[Pipeline-oriented programming - Scott Wlaschin - NDC Porto 2023](https://www.youtube.com/watch?v=ipceTuJlw-M)。

下面的程式碼，是在看完影片之後隨手寫的簡單範例，這個範例是在 C# 中實作管線導向程式設計，透過 `Pipe` 方法，將數字依序經過不同的方法處理，並透過 `Show` 方法顯示處理結果，透過 `Log` 方法輸出處理過程中的備註訊息。

你可以自行把這整段程式碼貼到 [dotnetfiddle](https://dotnetfiddle.net/) 或是 LINQPad 上執行看看，感受一下管線導向的運作。

```csharp
public void Main()
{
    // Demo number operate with Pipe extensino
    5
        .Show()
        .Pipe(Math.Double)
        .Log("It shoould double the number.")
        .Show()
        .Pipe(Math.Add, 1)
        .Pipe(Math.Square)
        .Show();
        
    Console.WriteLine("----------");

    // Using a LINQ pipeline with a "strategy" parameter
    var list = new List<int> { 1, 2, 3 };
    var fn = (IEnumerable<int> p) => p.Select(Math.Square);
    list
        .Pipe(fn)
        .Show();
}

// You can define other methods, fields, classes and namespaces here
public static class PipeExtension
{
    public static TOut Pipe<TIn, TOut>(this TIn input, Func<TIn, TOut> fn) => fn(input);
    public static TOut Pipe<TIn, TParam, TOut>(this TIn input, Func<TIn, TParam, TOut> fn, TParam p1) => fn(input, p1);

    public static T Log<T>(this T t, string message)
    {
        Console.WriteLine($"[{DateTime.Now.ToUniversalTime():yyyy-MM-dd:HH:mm:ss}] {message}");
        return t;
    }
    public static T Show<T>(this T t)
    {
        switch (t)
        {
            case ValueType:
            case string:
                Console.WriteLine($"[{DateTime.Now.ToUniversalTime():yyyy-MM-dd:HH:mm:ss}] {t}");
                break;
            default:
                Console.WriteLine($"[{DateTime.Now.ToUniversalTime():yyyy-MM-dd:HH:mm:ss}] {JsonSerializer.Serialize(t)}");
                break;
        }
        return t;
    }
}

public static class Math
{
    public static int Add(int i, int j) => i + j;
    public static int Mult(int i, int j) => i * j;
    public static int Double(int i) => i * 2;
    public static int Square(int i) => i * i;
}
```

---

參考資料：

* [Pipeline-oriented programming - Scott Wlaschin - NDC Porto 2023](https://www.youtube.com/watch?v=ipceTuJlw-M)
* <a hidden href="https://www.youtube.com/watch?v=i7h2bft5Gck">管線導向程式設計 (Pipeline-oriented programming) - Scott Wlaschin - NDC Porto 2023</a>
