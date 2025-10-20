---
layout: post
title: 在 Teams Webhook 訊息中 @ 標註某個人或頻道
date: 2022-04-26 15:52
author: Poy Chang
comments: true
categories: [Javascript, CSharp, Dotnet,Bot]
permalink: mention-someone-in-teams-webhook/
---

當我們要在 Microsoft Teams 中提到某個人或頻道時，可以用 `@` 來標註某個人或頻道，更直接的提醒某人這裡有屬於他的訊息。然而我們要如何在透過 Teams Webhook 發送訊息時達成這樣的提醒呢？這篇來解決這個問題。

這是一個相當多人敲碗的功能。在自動化的驅動之下，我們很多系統的運作訊息會透過通訊軟體 Microsoft Teams 來發送及時訊息，為了能更容易的被特定人士察覺，用 `@` 來標註特定人是通訊軟體常見且方便的功能。

要在 Teams Webhook 訊息中標註某個人或頻道，需要基於[使用 Adaptive Cards 發送訊息到 Microsoft Teams Webhook](https://blog.poychang.net/use-adaptive-cards-to-send-message-to-teams-webhook/)的基礎之下做延伸，如此一來，我們可以產生出像是下面這樣的 JSON 內容：

```json
{
    "type": "message",
    "attachments": [
        {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.2",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "Hi <at>mention</at> in Teams Webhook",
                    }
                ]
            }
        }
    ]
}
```

在訊息的內容中，可以注意到 `<at>mention</at>` 這個用 `<at>` 標籤包住的內容，這個關鍵字串很重要（裡面 `mention` 字串可以自行修改），接下來的操作會需要搭配這串做對應，讓標註的人能被標註在指定的位置中。

接著，要在 `content` 這個屬性之中，附加上 `msteams` 屬性，這個屬性是專屬給 Microsoft Teams 解析的，而裡面的 `entities` 則是要標註的人有哪些，每個人都需要對應到一組 `<at>` 標籤內容。因此如果你要標註多人的時候，要加入多組 `<at>` 標籤，不然會標註失敗。

至於標註誰的關鍵，則是在於 `id` 的設定值，這個值必須要是**當前 Teams 組織內的成員的 Email**，`name` 則是要標註的人的顯示名稱（對！可以修改標註的顯示名稱），效果如下：

![修改標註的顯示名稱](https://i.imgur.com/1ckgQoK.png)

而 `msteams` 這個屬性的 JSON 內容大致上會是像下面這樣：

```json
{
    // 略...
    "msteams": {
        "width": "Full",
        "entities": [
            {
                "type": "mention",
                "text": "<at>mention</at>",
                "mentioned": {
                    "id": "poychang@YOUR_ORG_DOMAIN.com",
                    "name": "poychang"
                }
            }
        ]
    }
    // 略...
}
```

如果你想要標註的是某個頻道，則需要在該頻道右邊的 `...` 選項中，點選 `Get email address` 取得頻道的專用 Email，再將頻道的專用 Email 填入 `id` 值中，這樣就可以標註頻道了。

![取得頻道的專用 Email](https://i.imgur.com/Ua4g2MQ.png)

最後來看一下完整的 JSON 內容會長的怎樣：

```json
{
    "type": "message",
    "attachments": [
        {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.2",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "Hi <at>mention</at> in Teams Webhook",
                    }
                ],
                "msteams": {
                    "width": "Full",
                    "entities": [
                        {
                            "type": "mention",
                            "text": "<at>mention</at>",
                            "mentioned": {
                                "id": "poychang@YOUR_ORG_DOMAIN.com",
                                "name": "poychang"
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```

![標註 poychang 的訊息效果](https://i.imgur.com/HJMeEYc.png)

## 後記

眼尖的你，可能會注意到 `msteams` 屬性中，我多加了一個 `width`　並設定成 `Full`，這個屬性是讓 Webhook 訊息能把內容區域撐大，不然預設會是行動裝置適合的大小，而在電腦上看該訊息的時候，就會感覺很奇怪。

----------

參考資料：

* [MS Docs - Format cards in Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-format?tabs=adaptive-md%2Cconnector-html#user-mention-in-incoming-webhook-with-adaptive-cards?WT.mc_id=DT-MVP-5003022)
