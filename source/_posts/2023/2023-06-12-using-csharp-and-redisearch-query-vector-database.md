---
layout: post
title: 使用 C# 和 OpenAI Embedding 搭配 RediSearch 查詢向量資料庫
date: 2023-06-12 15:06
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, Container, Tools, AI]
permalink: using-csharp-and-redisearch-query-vector-database/
---

在開發 OpenAI 的 Embedding 相關的功能時，勢必會需要使用到向量資料庫來儲存向量資料，常見的教學會使用 [Pinecone](https://www.pinecone.io/) 這個 SaaS 的向量資料庫，不過在企業內的環境，使用 [Redis](https://redis.io/) 搭配 [RediSearch](https://redis.com/modules/redis-search/) 模組來建構解決方法，是一個不錯的選擇，這篇來實作這個解決方案。

## 環境建置

這個解決方案有兩個關鍵資源。

首先是 OpenAI 的 `text-embedding-ada-002` 模型，不論你是使用 OpenAI 或是 [Azure OpenAI](https://azure.microsoft.com/zh-tw/products/cognitive-services/openai-service/) 都可以，之後需要這個模型幫我們產生 Embedding 的向量資料。

接著是 Redis 資料庫並且要安裝 [RediSearch](https://redis.io/docs/stack/search/) 模組，這邊我們使用 Docker 來建立一個 Redis 且已經安裝好 RediSearch 模組的容器。這部分你可以從 Docker Hub 下載 [Redis Search](https://hub.docker.com/r/redislabs/redisearch/) 的容器映像檔，相關操作指令如下：

```bash
# 下載 Redis Search 映像檔
docker pull redislabs/redisearch:latest
# 在背景執行容器，並設定對應的 6379 Port
docker run --detach --name redis-stack -p 6379:6379 redislabs/redisearch:latest
```

如此一來，你就可以使用任一套 Redis 工具來連線到 `localhost:6379` 來連線到 Redis 資料庫。為了方便查看 Redis 上儲存的內容，可以使用 [Another Redis Desktop Manager](https://github.com/qishibo/AnotherRedisDesktopManager) 這套開放原始碼的工具，藉此來查看 Redis 運作狀況。或者，也可以使用由 Redis 官方所製作的 [RedisInsight](https://redis.com/redis-enterprise/redis-insight/)，兩者都是相當好用的操作工具。

## 開發套件

過程中我們會使用到 OpenAI 的 Embedding API，這裡使用由 Microsoft 開發的 [Azure.AI.OpenAI](https://www.nuget.org/packages/Azure.AI.OpenAI/) NuGet 套件，方便我們使用 OpenAI 的 API。

>這個套件雖然目前還在預覽，不過已經可以使用，在安裝時記得要加上 `-prerelease` 參數，才能安裝到預覽版。

要在 .NET 開發環境中操作 Redis，許多人會想到由 StackExchange 所開發的 [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) NuGet 套件，不過要用他來操作 RediSearch 模組有點不夠友善，因此我使用由 Redis 組織所製作的 [NRedisStack](https://github.com/redis/NRedisStack) 進行開發，使用上比較直覺。

## 實作

前置作業準備得差不多了，接下來要實作。基本上會分成 4 個段落：

1. 準備資料集
2. 產生向量值
3. 建立向量索引
4. 寫入和查詢向量

當這些都完成之後，要使用 OpenAI Embedding 和 OpenAI GPT 來開發知識庫問答系統，就呼之欲出了，基本上就是把使用者輸入的文字轉成向量，然後拿去向量資料庫做向量相似度查詢，找出最相似的向量，再把對應的文字和使用者所輸入的內容，交給 OpenAI GPT 去產生人類閱讀友善的回應內容，就完成了。

最後這部分，這裡不會帶到，交給需要實作的時候自行處理，以下只會針對前面 4 個段落進行說明。

### 取得資料集

這一步是最耗費精神力的。

首先我們要先整理好資料集，這會跟你的使用目的有關，例如你想要做電影評論的問答系統，那你就要找電影評論的資料集，並整理好資料，將資料清洗乾淨。

這裡我以 STUDY4 所舉辦過的 [.NET Conf Taiwan](https://dotnetconf.study4.tw/) 研討會議程資料當作資料集。

詳細程式碼請直接參考 [poychang/Demo-EmbeddingVectorSearch](https://github.com/poychang/Demo-EmbeddingVectorSearch)，基本上就是呼叫 API 然後處理一下資料而已。

### 產生向量值

接下來，我們要將所得到的文字內容資料集逐一轉成對應的向量值，這部分你可以使用 ML.NET 的 `ApplyWordEmbedding()` 方法，有許多內建的 Pre-trained Model 可以使用，詳細用法請參考[使用 ML.NET 將文字轉成向量](https://blog.poychang.net/using-ml-net-transform-text-into-vectorvector/)這篇文章。

不過使用 ML.NET 內建的預訓練模型最多只有 300 維度的向量值，而透過 OpenAI Embedding API 則可以產生 1536 維度的向量值，因此這裡我們使用 OpenAI Embedding API 來產生向量值。

因此這裡使用 OpenAI 的 Embedding API，搭配 [Azure.AI.OpenAI](https://www.nuget.org/packages/Azure.AI.OpenAI/) NuGet 套件，來進行操作。

這個步驟有幾點需要注意，首先 OpenAI 官方建議 Embedding Model 的選擇上，建議使用 `text-embedding-ada-002`，這個模型的處理速度以及效果都不錯，詳請參考官方的[說明文章](https://openai.com/blog/new-and-improved-embedding-model)。

> 關於可用於產生 Embedding 向量值得模型清單，可以參考[這篇](https://learn.microsoft.com/zh-tw/azure/cognitive-services/openai/concepts/models#embeddings-models)內嵌模型清單。

另外，在向量化之前，建議將資料中的換行符號置換成空白字元，因為資料包含換行符號可能會造成異常，建議將換行符號置換成空白字元。

在呼叫 OpenAI Embedding API 的時候，其回應的 JSON 會長得像這樣：

```json
{
    "HasValue": true,
    "Value": {
        "Data": [
            {
                "Embedding": [
                    -0.011380639, -0.007935797, -0.010034685, -0.0036947096,
                    // 略...
                    -0.0066398163, -0.022054985, -0.006326649
                ],
                "Index": 0
            }
        ],
        "Model": "ada",
        "Usage": { "PromptTokens": 4, "TotalTokens": 4 }
    }
}
```

基於上面這個 JSON，我們可以把向量值(`Embedding`)和原始文字內容同時一起記錄下來，並且也將該向量所耗用的 Token 數（`TotalTokens`）也記錄下來，方便之後使用。

> 詳細程式碼請參考[OpenAIEmbeddingActionAsync()](https://github.com/poychang/Demo-EmbeddingVectorSearch/blob/main/EmbeddingVectorSearch/VectorSearchService.cs)。

### 建立向量索引

在將向量寫入向量資料庫之前，必須要先建立向量索引，這裡我們使用 [NRedisStack](https://github.com/redis/NRedisStack) 來建立索引。

```csharp
var ft = _redisDatabase.FT();
try
{
    var vectorAlgorithm = VectorField.VectorAlgo.FLAT;
    var vectorAttributes = new Dictionary<string, object>
    {
        ["TYPE"] = "FLOAT32", // 設定向量的資料型態為 FLOAT32，可為 FLOAT32、FLOAT64
        ["DIM"] = "1536", // 用於優化向量檢索功能，OpenAI Embedding 回傳的向量維度為 1536
        ["DISTANCE_METRIC"] = "COSINE", // 用 COSINE 距離進行向量比較，可為 L2、IP、COSINE
    };
    await ft.CreateAsync(
        indexName,
        new FTCreateParams().On(IndexDataType.HASH).Prefix(prefix),
        new Schema()
            .AddTextField("text")
            .AddVectorField("vector", vectorAlgorithm, vectorAttributes)
            .AddNumericField("usage")
    );
}
catch (Exception)
{
    // 當相同名稱的索引已經存在會無法再次建立
    var info = ft.Info(new RedisValue(indexName));
    Console.WriteLine($"'{info.IndexName}' index already exists");
}
```

在建立向量索引的時候有個關鍵，是需要設定該索引內會有那些欄位，以上面的程式碼來說，我們建立了三個欄位，分別是 `text` 原始文字、`vector` 向量值、`usage` 向量所耗用的 Token 數。

其中在設定向量值欄位的時候，需要選擇向量資料型態，又或者說是該向量之間的關聯演算法，這裡我們選擇 `FLAT` 演算法，這種演算法準確率較高，但當資料量大時則會變得比較慢。如果是大量資料的情境下，則可以選擇 `HNSW` 演算法。

另外，我們還需要設定向量欄位的屬性：

- `TYPE` 可設定向量的資料型態為 `FLOAT32`、`FLOAT64`
- `DIM` 用於優化向量檢索功能，OpenAI Embedding 回傳的向量維度為 `1536`
- `DISTANCE_METRIC` 設定要用哪種計算向量相似度的距離演算法，可設定為 `L2`、`IP`、`COSINE`

> 演算法 `FLAT` 和 `HNSW` 所可以微調的參數不同，詳細參數說明請[參考 RediSearch 說明文件](https://redis.io/docs/stack/search/reference/vectors/#creation-attributes-per-algorithm)

基本上，這裡的設定只需要設定一次就好了，這相當於我們在資料庫中建立資料表的概念。

> 詳細程式碼請參考[CreateIndexAsync()](https://github.com/poychang/Demo-EmbeddingVectorSearch/blob/main/EmbeddingVectorSearch/VectorSearchService.cs)。

### 寫入和查詢向量

這時候我們設定好了向量索引，也有了向量值、原始文字內容、以及該向量所耗用的 Token 數，接下來就可以實作寫入向量和查詢。

寫入向量值的操作相當簡單，需要特別注意的是，通常在程式中操作的 `vector` 變數會是一個 `float[]` 陣列，但是在寫入時，需要將其轉換成 `byte[]` 陣列，這裡我們使用 `BitConverter.GetBytes()` 來轉換，然後將資料寫入指定的 Key 值（下方的 `$"{prefix}{docId}"`）即可，範例程式碼如下。

```csharp
var upsertData = new HashEntry[]
{
    new("text", data.Text),
    new("vector", data.Vector.SelectMany(BitConverter.GetBytes).ToArray()),
    new("usage", data.Usage),
};
await _redisDatabase.HashSetAsync($"{prefix}{docId}", upsertData);
```

> 詳細程式碼請參考[AddAsync()](https://github.com/poychang/Demo-EmbeddingVectorSearch/blob/main/EmbeddingVectorSearch/VectorSearchService.cs)。

這時可以先使用 RedisInsight 可以查看寫入的向量資料及相關欄位，如下圖：

![使用 RedisInsight 可以查看寫入的向量資料及相關欄位](https://i.imgur.com/RUuiWzQ.png)

接著要實作查詢功能，向量查詢的背景知識比較複雜一些，要先知道 RediSearch 的基本查詢語法，這邊以 KNN 的向量搜尋語法為範例。

基本的 KNN 向量查詢語法為 `*=>[KNN num_relevant @vector $query_vector AS vector_score]`，這裡面有幾個關鍵要點：

- `*` 表示搜索所有資料
- `=>` 映射操作符，將資料映射到新的搜索結果
- `KNN` 特殊聚合函數，用於計算查詢向量與索引中的向量之間的相似度
- `num_relevant` 是一個整數，表示要取得最相似的資料數量
- `@vector` 表示索引中的 `vector` 欄位
- `AS vector_score` 將相似度得分存儲在名為 `vector_score` 的欄位中

因此，這句語法用中文解釋就是：使用 `KNN` 函數查詢索引中，`@vector` 與 `$query_vector` 查詢向量最接近的前 `num_relevant` 筆資料，並將相似分數存放在 `vector_score` 欄位中做回傳。

接著根據我們的需求，完成如下的程式碼：

```csharp
var ft = _redisDatabase.FT();
var queryVector = vector.SelectMany(BitConverter.GetBytes).ToArray();
var query = new Query($"*=>[KNN {topN} @vector $query_vector AS vector_score]")
                .AddParam("query_vector", queryVector)
                .SetSortBy("vector_score")
                .Dialect(2);
var result = await ft.SearchAsync(indexName, query);

if (result.TotalResults == 0) return new List<QueryEmbeddingData>();

var records = result.Documents.Select(doc => new QueryEmbedd    ingData
{
    Text = doc["text"].ToString(),           // 原始文字內容
    Usage = (int)doc["usage"],               // Token 使用量
    Score = 1 - (float)doc["vector_score"],  // 相似百分比
});
```

這裡有個地方要特別注意，向量搜尋出的 `vector_score` 相似分數是越接近 `0` 越相似，因此我們在程式中使用 `1` 減相似分數，這樣比較符合我們容易認知的相似百分比（分數越高越相似）。

> 詳細程式碼請參考[QueryAsync()](https://github.com/poychang/Demo-EmbeddingVectorSearch/blob/main/EmbeddingVectorSearch/VectorSearchService.cs)。

## 測試

經過一番努力，我們完成了 Embedding 向量搜尋的功能，接下來就來測試看看吧！

完整的範例程式碼在 [poychang/Demo-EmbeddingVectorSearch](https://github.com/poychang/Demo-EmbeddingVectorSearch)，要測試執行之前，需要先修改以下參數，使用你自己的 OpenAI 呼叫位置和金鑰，以及已安裝 RediSearch 的 Redis 之連線字串。

```csharp
static readonly string OpenAIEndpoint = "[OPENAI_ENDPOINT]";
static readonly string OpenAIKey = "[OPENAI_KEY]";
static readonly string RedisConnectionString = "[REDIS_CONNECTION_STRING]";
```

請注意，在執行程式的過程中，會先移除以預設的索引名稱（`embeddings`）和相關資料（`item:` 開頭的 key）。

接著會將原始文字透過 OpenAI Embedding API 轉成向量並存入 Redis。

最後我們模擬使用者查詢一段文字，測試看看會得到哪組相似的原始文字內容

```csharp
// 模擬使用者查詢
var userInput = "關於 .NET 在跨平台開發的相關議程";
var userInputVector = await vectorSearchService.OpenAIEmbeddingActionAsync(userInput);
var queryResult = await vectorSearchService.QueryAsync(userInputVector.Vector);
Console.WriteLine($"User Input: {userInput}");
queryResult.OrderByDescending(p => p.Score).ToList().ForEach(result =>
{
    Console.WriteLine($"Embedding Score: {result.Score}\tText: {new string(result.Text.Take(20).ToArray())}...");
});
```

基本上會看到以下的輸出結果：

```text
User Input: 關於 .NET 在跨平台開發的相關議程
Embedding Score: 0.8752357      Text: .NET 是一個跨平台，跨應用場景的開源...
Embedding Score: 0.8492645      Text: 在現代化部署實現後我們的下一步是什麼？當...
Embedding Score: 0.8488804      Text: Agenda<br/>● 升級前的前置作...
```

> 本篇完整範例程式碼請參考 [poychang/Demo-EmbeddingVectorSearch](https://github.com/poychang/Demo-EmbeddingVectorSearch)。

## 補充

Redis Vector Similarity Search 有兩種索引方式，分別是 FLAT（全平面暴力搜索）和 HNSW（層次節點搜索），這兩個都是在向量相似度搜索中常用的技術。

- `FLAT`：是一種基本的搜索方法，它使用 brute force approach 的方式對所有向量進行線性搜索。藉由計算每個向量之間的距離，找到最相似的向量
  - 優點：結果準確，因為它考慮了所有的向量
  - 缺點：當向量數量非常大時，搜索速度變慢，因為需要對每個向量進行計算
- `HNSW`：是一種更快速且近似的搜索方法，它在搜索速度和搜索質量之間取得平衡。此方法使用層次結構和隨機樣本選擇，將向量劃分為不同的層級。在搜索時，通過跳躍和連結不同層級的節點來快速找到相似的向量。
  - 優點：搜索速度非常快，特別適用於大規模的向量數據集
  - 缺點：由於是一種近似搜索方法，所以搜索結果可能不夠準確

因此，如果在 Redis 存放非常大量的向量資料時進行搜尋，可以在設定 `Schema` 時，在設定向量欄位時使用 `AddVectorField()` 搭配 `VectorField.VectorAlgo.HNSW` 來建立 HNSW 搜尋索引。如此一來會比用 FLAT（`VectorField.VectorAlgo.FLAT`）來的快速，但是相對的，在建置過程中會耗費更多資源且結果會稍微不夠準確。

---

參考資料：

* [Using Redis as a Vector Database with OpenAI](https://github.com/openai/openai-cookbook/blob/main/examples/vector_databases/redis/getting-started-with-redis-and-openai.ipynb)
* [MS Learn - 教學課程：探索 Azure OpenAI 服務內嵌和檔搜尋](https://learn.microsoft.com/zh-tw/azure/cognitive-services/openai/tutorials/embeddings?WT.mc_id=DT-MVP-5003022)
* [MS Learn - 使用 Redis 模組搭配 Azure Cache for Redis](https://learn.microsoft.com/zh-tw/azure/azure-cache-for-redis/cache-redis-modules?WT.mc_id=DT-MVP-5003022)
* [NRedisStack - Advanced Querying](https://github.com/redis/NRedisStack/blob/master/Examples/AdvancedQueryOperations.md)
* [RediSearch 魔法：輕松實現 K 近鄰查詢](https://www.jianshu.com/p/b4a1efe0cd21)
* [Redis 官方 KNN Search](https://redis.io/docs/stack/search/reference/vectors/#knn-search)
