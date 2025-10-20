---
layout: post
title: 使用 ML.NET 將文字轉成向量
date: 2023-06-08 14:28
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, AI]
permalink: using-ml-net-transform-text-into-vectorvector/
---

現在越來越多場景需要藉助向量分析，最常見的情境莫過於將文字向量化之後，用於搜尋、聚類分析、建議等等，這篇要介紹如何使用 ML.NET 將文字轉成向量。

文字向量化通常可用於以下情境：

- 搜尋（將結果按照查詢字串的相似性做排名）
- 聚類分析（相似性分組）
- 建議（提供相似文字的建議）
- 異常檢測（識別相關性不大的異常值）
- 多樣性測量（分析相似性分佈）
- 分類（以最相似的標籤進行分類）

藉由向量相似度運算，可以比較出兩個向量之間的距離，以此來衡量它們的相關性。當距離越小表示相關性越高，反之，距離越遠表示相關性越低。

![特徵向量的示意圖](https://i.imgur.com/jLQ7Gdj.png)

以上面的示意圖來看，可以用顏色來看出分群，而每個資料點背後的向量值，就是在這個空間的描述，這個空間就是特徵空間（Feature Space），而這個空間的維度，就是特徵向量的維度。

接著，我們來試試看，用 [ML.NET](https://dotnet.microsoft.com/en-us/apps/machinelearning-ai/ml-dotnet) 來實作將文字轉成向量的關鍵功能。

```csharp
// 建立 ML.NET 環境
var mlContext = new MLContext();
// 由於 ApplyWordEmbedding 不需要訓練資料，所以這裡建立一個空的資料集給 pipeline
var emptySamples = new List<TextData>();
var emptyDataView = mlContext.Data.LoadFromEnumerable(emptySamples);
// pipeline 會將文字轉成向量，過程中會將文字規範化、分詞，接著使用內建的 SentimentSpecificWordEmbedding 預訓練模型，將文字轉成 150 維度的向量
var textPipeline = mlContext.Transforms.Text.NormalizeText("Text")
    .Append(mlContext.Transforms.Text.TokenizeIntoWords("Tokens", "Text"))
    .Append(mlContext.Transforms.Text.ApplyWordEmbedding("Features", "Tokens", WordEmbeddingEstimator.PretrainedModelKind.SentimentSpecificWordEmbedding));
// 取得轉換器
var textTransformer = textPipeline.Fit(emptyDataView);
// 建立預測引擎，將文字轉成向量
var predictionEngine = mlContext.Model.CreatePredictionEngine<TextData, TransformedTextData>(textTransformer);

// 使用建立的預測引擎，將文字轉成向量
var data = new TextData()
{
    Text = "Hello World"
};
var prediction = predictionEngine.Predict(data);

// 輸出預測結果，輸出結果的向量維度，並輸出向量內容
Console.WriteLine($"Number of Features: {prediction.Features.Length}");
Console.Write("Features: ");
foreach (var f in prediction.Features) Console.Write($"{f:F4} ");
// 預期輸出：
// Number of Features: 150
// Features: -1.4766 -2.0911 1.1541 -0.4647 -2.7040 0.8588 ...
```

上述程式碼會需要額外建立資料模型如下：

```csharp
public class TextData
{
    public string Text { get; set; }
}

public class TransformedTextData : TextData
{
    public float[] Features { get; set; }
}
```

跑過一次範例程式碼，就可以大致了解實作方式了。

## 後記

在 AI 領域中，向量化是一個很重要的概念與工具，當向量化的維度越多時，就可以越精準的描述資料，但也會造成計算量的增加，所以在實作時，需要權衡維度與計算量的平衡。

ML.NET 的 `ApplyWordEmbedding()` 方法，有許多內建的 Pre-trained Model 可以使用，最多有到 300 個維度的模型。不過這相比 OpenAI Embedding 所提供的 1536 個維度，量級還是相差滿多的。在一般情況下，這樣的維度已經足夠使用了，但如果有需要更高維度的向量化輸出，可以考慮使用 OpenAI Embedding。

---

參考資料：

* [Introducing text and code embeddings](https://openai.com/blog/introducing-text-and-code-embeddings)
* [MS Learn - ML.NET ApplyWordEmbedding 方法](https://learn.microsoft.com/zh-tw/dotnet/api/microsoft.ml.textcatalog.applywordembedding?WT.mc_id=DT-MVP-5003022)