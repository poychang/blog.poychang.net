---
layout: post
title: 比較使用 Native AOT 與標準方式的差異
date: 2023-12-01 16:22
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: compare-native-aot-with-standard-way/
---

Native AOT 是一種令人興奮的發行 .NET 應用程式的方法，相較於標準的 JIT 編譯方式，Native AOT 可以讓應用程式啟動更快、使用更少的記憶體和更小的磁碟大小，但是 Native AOT 究竟能讓啟動變多快、記憶體使用量減少多少、磁碟大小縮小多少呢，數據會說話，就讓我們來看看官方比較使用 Native AOT 與標準方式的差異。

![Native AOT Benchmarks](https://i.imgur.com/lQikUqS.png)

.NET 開發團隊對於性能的追求可是非常認真且相當極致的，認真到還使用 PowerBI 特別做一個儀表板來追蹤每天測試的數據，而本篇文章的內容主要就是來自官方的測試數據，完整的儀表板可以參考 [Native AOT Benchmarks](https://aka.ms/aspnet/nativeaot/benchmarks)。眼尖的你可能還會發現，這個連結過去雖然是 Native AOT 的效能追蹤儀表板，但是從右下角可以看到，這只是許多儀表板的其中一個，還有許多像是 SingalR、MVC、gRPC、Containers 或是 Blazor Wasm 等追蹤性能的儀表板，有興趣的人可以自行研究。

這邊我勾選使用 Intel Windows 為測試平台，比較 Stage1 和 Stage1Aot 兩個情境，這分別就是標準方式和 Native AOT 的差異。

![Request Per Second & Latency](https://i.imgur.com/53gRiZY.png)

上面這張圖可以看出來，在每秒能處理的 Request 數量上，Native AOT 略為少於標準方式，可能的主要原因是標準做法在多次執行過後，會有 JIT 編譯的優化效果，但是 Native AOT 則是維持一樣的處理方式。

至於 Latency 延遲的部分，基本上就沒有明顯的差異了。

![Startup Time & Time to First Response](https://i.imgur.com/ckrjHnf.png)

在啟動所需的時間以及第一次回應的時間上，Native AOT 有著明顯的優勢，由於 Native AOT 在編譯時期就已經完成編譯成機器碼的工作，以及做一定程度的優化，啟動時受惠於不需要使用 JIT 處理 IL 編譯，因此省下了不少時間。在第一次回應所需時間，也基於同樣的原因，讓 Native AOT 有著明顯的優勢。

這兩點優勢也是為甚麼 Native AOT 非常適合拿來作為 Serverless、Container 或 Cloud Native 的運行方式，因為這兩種情境都需要快速冷啟動的特性。

> 冷啟動是指應用程式完全重新啟動，需要從零開始初始化所有資源，因此需要較長時間。熱啟動則是應用程式保留部分狀態後重新啟動，可以更快速地恢復運行狀態。

![Memory & CPU](https://i.imgur.com/nZnkg2o.png)

接著比較記憶體和 CPU 的使用，CPU 的使用率基本上沒有差距，都能充分使用 CPU 資源，然而在記憶體的使用量上（圖中的 Working Set），Native AOT 少了約 1/3，這意味著執行環境所需要的記憶體資源更少，而這原因其實也跟前者有關，Native AOT 在編譯時期就成編譯成機器碼，不需要 JIT 編譯器，自然就不需要額外的記憶體空間。

![App Size & Build Time](https://i.imgur.com/BDplEZt.png)

最後比較的是應用程式的大小和建置時間，前面說了很多次 Native AOT 會再編譯時間編譯成機器碼，自然產出的應用程式大小會比較小，在 .NET 開發團隊持續的優化下，這個容量大小有了相當大的差距，Native AOT 所產出的檔案大小約為標準方式的 1/10，這點非常優秀。以圖中的範例來看，標準方式（設定 `SelfContained` 和 `PublishSingleFile`）的產出檔案大小約為 95MB，而 Native AOT 的產出檔案大小約為 9MB。

檔案大小直接影響到佈署所需要的時間，以及執行環境的磁碟空間，這是 Native AOT 的絕對優勢之一。

有絕對優勢，也勢必要付出一些代價，這個代價就是建置時間會必較久。以圖中的範例來看，標準方式所需要的建置時間約為 3 秒，而 Native AOT 則需要 26 秒才能建置完畢。

## 後記

Native AOT 可說是效能上的聖杯，但也未必適合所有情境，如果你有以下需求，那 Native AOT 可能不適合你：

- 執行時期產生程式碼動態執行
- 使用 `Assembly.Load()` 載入額外的組件
- 使用 `Expression` 動態編譯程式碼
- 使用 `Reflection.Emit` 動態執行程式碼

而且截至目前為止 Native AOT 還有一些開發框架的限制，例如 MVC、Blazor Server、SignalR 等，或許未來會陸續完成支援。

---

參考資料：

* [MS Learn - ASP.NET Core support for native AOT](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/native-aot?WT.mc_id=DT-MVP-5003022)
* [Tiny, fast ASP.NET Core APIs with native AOT](https://www.youtube.com/watch?v=FpQXyFoZ9aY)

