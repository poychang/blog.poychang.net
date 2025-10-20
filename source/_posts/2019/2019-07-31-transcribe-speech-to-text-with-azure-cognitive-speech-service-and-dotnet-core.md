---
layout: post
title: 使用 Azure Cognitive Service 認知服務將語音即時轉譯為文字
date: 2019-07-31 00:12
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Azure]
permalink: transcribe-speech-to-text-with-azure-cognitive-speech-service-and-dotnet-core/
---

Azure 認知服務平台提供了 AI as a Platform 的一站式服務，其中提供了多種認知服務，例如電腦視覺、語音服務、文字分析、異常偵測等等，官方也提供了多種程式語言的 SDK，讓開發者可以更容易地使用 SDK 來呼叫認知服務的 REST API，輕鬆應用 AI 讓應用程式變得更智能。這篇來玩玩**將語音即時轉譯為文字**的 Speech Cognitive Service。

Speech Cognitive Service 語音服務可以將語音轉成文字，像是聽寫員一樣，把收到的語音資料，透過 AI 語音模型做辨識，然後轉成文字輸出，更多介紹可以參考[官方的語音服務介紹](https://docs.microsoft.com/zh-tw/azure/cognitive-services/Speech-Service/?WT.mc_id=AZ-MVP-5003022)。

## 申請 API 金鑰

Azure 認知服務是一個 AI 平台服務，要使用之前要先到 Azure Portal 去建立認知服務資源，在建立資源的頁面中搜尋一下`認知服務`或 `Cognitive Service` 就可以找到他，簡單設定名字和資源群組位置就差不多了。

![在 Azure Portal 上建立認知服務的資源](https://i.imgur.com/0PHCkRN.png)

有了這項資源後，所有的認知服務都可以使用此資源的 Endpoint 來使用。至於費用每項服務都不一樣，就參考[官網的說明](https://azure.microsoft.com/zh-tw/pricing/details/cognitive-services/)。

不過如果只是要試用看看，可以使用這個連結 [https://azure.microsoft.com/zh-tw/try/cognitive-services/my-apis/](https://azure.microsoft.com/zh-tw/try/cognitive-services/my-apis/) ，申請 30 天試用金鑰，每項認知服務都可以申請一次唷！語音服務的試用額度為每月 5000 筆呼叫，每分鐘最多 20 次，拿來測試相當夠用了。

![申請試用金鑰](https://i.imgur.com/AXPgCzq.png)

申請完成後，你會得到 API `端點`和`金鑰`，從端點的 URL 中可以得知，這個試用的資源，他的服務區域在美西 `westus`，這個資訊很重要，等一下會用到，將金鑰和服務區域這兩組資訊記下來後，就可以開始寫隻呼叫語音服務的程式。

## 使用 C# 開發

官方提供了很多平台和程式語言的 SDK，這裡用 Windows 10 和 C# 來做範例，關於 C# 的語音服務 SDK 文件可以參考這個連結 [https://docs.microsoft.com/zh-tw/dotnet/api/overview/azure/cognitiveservices/client/speechservice](https://docs.microsoft.com/zh-tw/dotnet/api/overview/azure/cognitiveservices/client/speechservice?WT.mc_id=DT-MVP-5003022)。

使用 SDK 的整個程式運作流程如下：

1. 設定使用語音服務所需要的`金鑰`和`服務區域`
2. 建立語音辨識器
3. 設計辨識後的結果動作

範例程式碼如下：

```csharp
public static async Task RecognitionWithMicrophoneAsync()
{
    // 建立語音辨識的設定，這裡必須提供 Azure Cognitive Service 的訂閱金鑰和服務區域
    var config = SpeechConfig.FromSubscription(YourSubscriptionKey, YourServiceRegion);
    // 預設使用 en-us 的美式英文作為辨識語言
    config.SpeechRecognitionLanguage = "en-us";

    // 建立語音辨識器，並將音訊來源指定為機器預設的麥克風
    using (var recognizer = new SpeechRecognizer(config, AudioConfig.FromDefaultMicrophoneInput()))
    {
        Console.WriteLine("Say something...");

        // 開始進行語音辨識，會在辨別出句子結束時，返回語音辨識的結果。
        // 會藉由句子說完後，所產生的靜默時間作為辨識依據，或者語音超過 15 秒，也會處理成斷句。
        var result = await recognizer.RecognizeOnceAsync().ConfigureAwait(false);

        // 輸出語音辨識結果
        switch (result.Reason)
        {
            case ResultReason.RecognizedSpeech:
                Console.WriteLine($"RECOGNIZED: {result.Text}");
                break;
            case ResultReason.NoMatch:
                Console.WriteLine($"NOMATCH: Speech could not be recognized.");
                break;
            case ResultReason.Canceled:
            default:
                var cancellation = CancellationDetails.FromResult(result);
                Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");

                if (cancellation.Reason == CancellationReason.Error)
                {
                    Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
                    Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
                    Console.WriteLine($"CANCELED: Did you update the subscription info?");
                }
                break;
        }
    }
}
```

注意到上面的程式碼使用 `RecognizeOnceAsync()` 這個方法來執行辨識，此方法會根據語音的靜默頓點來判斷是否說完，或是語音超過 15 秒也會被強制斷句，執行結果如下圖：

![執行結果](https://i.imgur.com/mcmYe5b.png)

如果你需要辨識的語音超過 15 秒，可以改用 `StartContinuousRecognitionAsync()` 這個方法，他可以持續收聽並辨識語音資訊，你也可以設定辨識過程中的事件，使其做出你想要的動作，相關程式碼你可以參考[範例程式碼](https://github.com/poychang/Demo-Speech-Recognition-App/blob/master/Demo-Speech-Recognition-App/Program.cs#L91) 的 `ContinuousRecognitionWithMicrophoneAsync()` 方法。

>本篇完整範例程式碼請參考 [poychang/Demo-Speech-Recognition-App](https://github.com/poychang/Demo-Speech-Recognition-App)。

## 後記

你知道 Office 365 的 PowerPoint 可以在簡報模式開啟即時字幕，這功能就是透過像這樣的認知服務，將演講者的演說及時轉換成字幕，更厲害的是，他還可以即時翻譯成其他語系，而同樣的功能，我們可以使用本篇所使用到的語音認知服務加上[語音翻譯服務](https://azure.microsoft.com/zh-tw/services/cognitive-services/translator-speech-api/)，達成同樣的效果。

想要試試看在 PowerPoint 中顯示即時、自動輔助字幕或翻譯字幕，可以參考[這篇文章](https://support.office.com/zh-tw/article/%E5%9C%A8-powerpoint-%E4%B8%AD%E9%A1%AF%E7%A4%BA%E5%8D%B3%E6%99%82%E3%80%81%E8%87%AA%E5%8B%95%E8%BC%94%E5%8A%A9%E5%AD%97%E5%B9%95%E6%88%96%E7%BF%BB%E8%AD%AF%E5%AD%97%E5%B9%95-68d20e49-aec3-456a-939d-34a79e8ddd5f)來嘗試看看。

----------

參考資料：

* [使用適用於 .NET Core 的語音 SDK 來辨識語音](https://docs.microsoft.com/zh-tw/azure/cognitive-services/speech-service/quickstart-csharp-dotnetcore-windows?WT.mc_id=AZ-MVP-5003022)
* [Sample code for the Microsoft Cognitive Services Speech SDK](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
