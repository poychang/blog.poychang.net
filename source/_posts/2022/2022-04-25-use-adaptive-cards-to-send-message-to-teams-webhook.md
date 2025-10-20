---
layout: post
title: 使用 Adaptive Cards 發送訊息到 Microsoft Teams Webhook
date: 2022-04-25 17:44
author: Poy Chang
comments: true
categories: [Javascript, CSharp, Dotnet, Bot]
permalink: use-adaptive-cards-to-send-message-to-teams-webhook/
---

過去要透過 Microsoft Teams Webhook 發送訊息，僅能使用 MessageCard 格式，功能和 [Adaptive Cards](https://adaptivecards.io/) 相比，略遜了許多，現在 Microsoft Teams Webhook 終於支援 Adaptive Cards 格式了，讓我們看看如何使用吧。

過去要透過 Teams Webhook 發送訊息所使用的 JSON 範例格式如下：

```json
{
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "themeColor": "0076D7",
    "summary": "Larry Bryant created a new task",
    "sections": [{
        "activityTitle": "Larry Bryant created a new task",
        "activitySubtitle": "On Project Tango",
        "activityImage": "https://teamsnodesample.azurewebsites.net/static/img/image5.png",
        "facts": [
            { "name": "Assigned to", "value": "Unassigned" },
            { "name": "Status", "value": "Not started" }
        ]
    }]
}
```

以前我為了要方便自己使用 C# 來產生這樣的 JSON 資料，做了一個 [MessageCardModel](https://www.nuget.org/packages/MessageCardModel) NuGet 套件。當 [Adaptive Cards](https://adaptivecards.io/) 推出之後，他所提供的功能以及提供的 SDK，讓我一直心繫這訊息框架，如果能用官方提供的 SDK 來建立訊息，就能更有效率地處理各種情境了，不過直到最近，Teams Webhook 才支援 Adaptive Cards 格式，讓我一解心頭之結。

要在 Teams Webhook 中使用 Adaptive Cards 的 JSON 格式，基本如下：

```json
{
    "type": "message",
    "attachments": [
        {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "contentUrl": null,
            "content": {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.2",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "AdaptiveCard Samples for Teams Webhook",
                    }
                ]
            }
        }
    ]
}
```

但這個 JSON 無法直接使用 Adaptive Cards SDK 產生出來，Adaptive Cards SDK 只能產生 `content` 屬性底下的內容，因此我們在使用上，必須分兩段來做，以下以 C# 來做示範如何產生像上面這樣的 JSON 內容。

1. 使用 Adaptive Cards SDK 產生訊息內容
2. 建立 Team Webhook for Adaptive Cards 的基本樣板
3. 合併兩段訊息內容

在專案中安裝 [AdaptiveCards](https://www.nuget.org/packages/AdaptiveCards/) NuGet 套件後：

```
Install-Package AdaptiveCards -Version 2.7.3
```

接著建立 AdaptiveCard 物件，並使用內建的 `ToJson()` 方法，將該物件轉換成 JSON 字串，如下：

```csharp
var card = new AdaptiveCard(new AdaptiveSchemaVersion(1, 2));
card.Body.Add(new AdaptiveTextBlock("AdaptiveCard Samples for Teams Webhook"));
var contentJson = card.ToJson();
```

然後將上述的 AdaptiveCard JSON 資料（`contentJson`）塞到下面這個固定 JSON 內容的 `content` 屬性中：

```json
{
    "type": "message",
    "attachments": [
        {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "contentUrl": null,
            "content": {}
        }
    ]
}
```

這個 JSON 內容要特別注意以下幾點，才能被 Teams Webhook 所接受：

- `type` 欄位值必須是 `message`
- `attachments` 欄位可包含多組 AdaptiveCard 格式的物件
- `contentType` 欄位必須設定成 AdaptiveCard 類型，也就是 `application/vnd.microsoft.card.adaptive`
- `content` 此屬性為 AdaptiveCard 格式的 JSON 物件，主要的內容訊息就在這裡

C# 的寫法可能是像這樣處理，將 `contentJson` 塞進固定的 JSON 之中：

{% raw %}
```csharp
var content = $@"{{
    ""type"":""message"",
    ""attachments"":[
        {{
            ""contentType"":""application/vnd.microsoft.card.adaptive"",
            ""contentUrl"":null,
            ""content"":{contentJson}
        }}
    ]
}}";
```
{% endraw %}

這樣的的 JSON 內容就可以讓 Teams Webhook 接受，併發訊息到指定頻道了。

## 簡單說 Teams Webhook 的使用

在 Teams 的頻道上按滑鼠右鍵可以看到 `Connectors` 選項，在這裏面可以找到 `Incoming Webhook`，這就是建立該頻道的 Webhook 連結。

產生後你會得到一個 URL，接著我們只要使用類似下面的方式，將上面我們所產生的 JSON 並使用 HTTP POST 發送到這個 Webhook URL 就可以了：

{% raw %}
```csharp
const string TEAMS_CHANNEL = "https://YOUR_WEBHOOK_URL";

var client = new HttpClient(new HttpClientHandler { UseProxy = false });
client.DefaultRequestHeaders.Accept.Clear();
client.DefaultRequestHeaders.Add("cache-control", "no-cache");
client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
client.DefaultRequestHeaders.AcceptCharset.Add(new StringWithQualityHeaderValue("utf-8"));
client.DefaultRequestHeaders.ConnectionClose = false;
var content = $@"{{
    ""type"":""message"",
    ""attachments"":[
        {{
            ""contentType"":""application/vnd.microsoft.card.adaptive"",
            ""contentUrl"":null,
            ""content"":{contentJson}
        }}
    ]
}}";
{% endraw %}

await client.PostAsync(new Uri(TEAMS_CHANNEL), new StringContent(content, Encoding.UTF8, "application/json"));
```

## 後記

Teams Webhook 的功能真的非常好用，介接各系統的訊息到 Teams 這個平台上，讓團隊中的人可以第一時間取得相關資訊，一定要學起來！

----------

參考資料：

* [MS Docs - Create and send messages](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using?tabs=cURL#send-adaptive-cards-using-an-incoming-webhook?WT.mc_id=DT-MVP-5003022)
