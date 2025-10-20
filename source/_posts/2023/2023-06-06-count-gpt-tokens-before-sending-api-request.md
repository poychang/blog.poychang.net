---
layout: post
title: 使用 C# 來計算發送 OpenAI GPT 請求會使用到的 Token 數量
date: 2023-06-06 11:35
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, AI]
permalink: count-gpt-tokens-before-sending-api-request/
---

不管你是直接使用 OpenAI 的 API 還是使用 Azure OpenAI 的 API，在呼叫 AI 模型的時候，都是按照請求的 Token 數量來計算費用的，雖然在呼叫之後所回應的內容會告訴你這次請求使用了多少 Token，不過一般來說，我們還是會希望在發送請求之前，先計算這次請求會用到多少 Token，一方面控制使用量，二方面可以確保所發出的請求不會超過該模型能接受的上線。

要比較精確的計算 Token 使用量了話，可以用 OpenAI 官方網站上的工具 [Tokenizer](https://platform.openai.com/tokenizer) 來查詢，或參考 OpenAI 的 [How to count tokens with tiktoken](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) Jupyiter notebook 來測試，不過這是使用 Python 的 [tiktoken](https://github.com/openai/tiktoken) 函示庫來處理就是了。

> Token 的計費方式請參考 OpenAI 官網上的[計費表](https://openai.com/pricing)。

在 .NET 開發環境中，我們可以使用 [SharpToken](https://github.com/dmitry-brazhenko/sharptoken) 這個開放原始碼專案來幫助我們計算 Token 數量。

在使用之前，要先了解一下不同的 AI 模型所對應的 Token 計算方式是不同的，可以參考下表：

| Encoding name           | OpenAI models                                          |
| ----------------------- | ------------------------------------------------------ |
| `cl100k_base`           | `gpt-4`, `gpt-3.5-turbo`, `text-embedding-ada-002`     |
| `p50k_base`             | Codex models, `text-davinci-002`, `text-davinci-003`   |
| `r50k_base` (or `gpt2`) | GPT-3 models like `davinci`, `curie`, `babbage`, `ada` |
| `p50k_edit`             | `text-davinci-edit-001`, `code-davinci-edit-001`       |

接著在 SharpToken 的使用上則相當簡單，而且支援這四種編碼模型 `cl100k_base`、`p50k_base`、`r50k_base`、`p50k_edit`，基本使用方法如下：

```csharp
using SharpToken;

// 使用模型名稱來取得計算 Token 的方法
var encoding = GptEncoding.GetEncodingForModel("gpt-4");
// 或者，使用編碼名稱來取得計算 Token 的方法
var encoding = GptEncoding.GetEncoding("cl100k_base");

// 接著使用 Encode 和 Decode 方法來處理文字內容
var encoded = encoding.Encode("Hello, world!"); // Output: [9906, 11, 1917, 0]
var decoded = encoding.Decode(encoded); // Output: "Hello, world!"
```

要計算所使用的到 Token 數量，只要計算 Encode 後的結果長度就可以了，如下：

```csharp
encoded.Count; // Output: 4
```

> 建議直接使用 `Count` 屬性取得長度數量，也就是 Token 數量。不要使用 `Count()` 方法來計算，因為前者是直接取得屬性值，後者則是使用 LINQ 的 `Count()` 方法來計算，會比較耗時。

## 補充

除了 [SharpToken](https://github.com/dmitry-brazhenko/sharptoken) 這個套件之外，還有其他套件也可以做到計算 Token 這任務，不過這套件有提供一些特殊功能，`Allowed Sets` 和 `Disallowed Sets`。

`Allowed Sets` 是允許我們對像是 `<|endofprompt|>` 或 `<|endoftext|>"` 這種 Special Token（特殊令牌）做計算 Token 數量，因為在預設情況下，當我們使用官方的 [tiktoken](https://github.com/openai/tiktoken) 的 [encode](https://github.com/openai/tiktoken/blob/main/tiktoken/core.py#L75) 函數時，遇到 Special Token 的時候是會引發錯誤的。

Special Token 是用於啟用模型的特定功能（例如中間填充）的人工令牌，必須小心地處理這些 Special Token，防止意外地將它們編碼進內容之中，因為這可能導致模型執行我們不希望它執行的操作。

---

參考資料：

* [OpenAI API: How do I count tokens before(!) I send an API request?](https://stackoverflow.com/questions/75804599/openai-api-how-do-i-count-tokens-before-i-send-an-api-request)
* [Azure OpenAI Service 02 - 深入探討 Token 和計算](https://dotblogs.com.tw/anyun/2023/03/12/180209)
* [SharpToken](https://github.com/dmitry-brazhenko/sharptoken)
