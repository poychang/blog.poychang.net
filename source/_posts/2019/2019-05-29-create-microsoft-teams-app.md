---
layout: post
title: 在 Microsoft Teams App 中建立 Teams App
date: 2019-05-29 22:23
author: Poy Chang
comments: true
categories: [Develop, Bot, Tools]
permalink: create-microsoft-teams-app/
---

使用 Bot Framework 搭配 Azure Bot Service 開發完聊天機器人後，要如何加入 Microsoft Teams 之中呢？除了在 Azure Bot Service 上開通 Teams 頻道之外，在 Teams 應用程式中，必須要將所開發的 Bot 包成一個自訂應用程式，而要做到這一點，Teams 還提供了 App Studio 應用程式來幫我們快速達成這個目標。

其實一個 Teams App 應用程式他背後並沒有太多的程式，他主要靠 `manifest.json` 這個檔案來描述這個 App 具有哪些功能以及相關的資訊，他的內容大致上長的像這樣：

```json
{
    "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.3/MicrosoftTeams.schema.json",
    "manifestVersion": "1.3",
    "version": "1.0.0",
    "id": "ef369ee7-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "packageName": "tw.com.your-domain.app-name",
    "developer": {
        "name": "Poy Chang",
        "websiteUrl": "https://blog.poychang.net",
        "privacyUrl": "https://blog.poychang.net",
        "termsOfUseUrl": "https://blog.poychang.net"
    },
    "icons": {
        "color": "color.png",
        "outline": "outline.png"
    },
    "name": {
        "short": "MessageBot",
        "full": "MessageBot"
    },
    "description": {
        "short": "Sending proactive message to member of teams.",
        "full": "It's KTCMessage Bot for sending proactive message. It's develop only version."
    },
    "accentColor": "#FFFFFF",
    "validDomains": [
        "www.kingston.com",
        "www.kingston.com.tw"
    ]
}
```

這份 JSON 檔中詳述了這個 Teams App 會如何整合至 Teams 之中，詳細的屬性說明可以參考這份 [Manifest schema for Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema?WT.mc_id=DT-MVP-5003022) 屬性說明官方文件。

如果你要點開上面 `manifest.json` 這個檔案的屬性說明文件，你一定會想：怎麼那麼多屬性，誰記的得呀！而且如果要手動一個個輸入完畢，那要花多久時間...

Teams 開發小組也明白這件事情，所以製作了 App Studio 這款 Teams App，專門用來幫助開發者建立 Teams App 的 Manifest 工具，讓我們不用寫 Code 也能自動產出 Teams App 的 `manifest.json` 檔，更能快速部屬到 Teams 中做測試。

首先先在 Teams 的市集中，尋找並安裝 App Studio 應用程式。

![在 Teams 市集中搜尋並安裝 App Studio](https://i.imgur.com/ofVqWwL.png)

安裝完成後，App Studio 提供以下五個主要功能：

- `Conversation` 提供用對話的方式和這個 App 互動
- `Manifest editor` 提供開發 Teams App 的 Manifest 編輯器
- `Card editor` 提供開發這建立訊息卡片，提供 Hero Card、Thumbnail Card、Adaptive Card 的編輯工具（如同[這個](https://acdesignerbeta.azurewebsites.net/)官方的線上設計工具）
- `Control library` 提供給 React 開發者的元件函示庫，讓你更容易開發 Teams 上面的介面

在 `Manifest editor` 這個我們主要使用的頁籤中，左邊是建立或上傳 Teams App 的功能，右邊則是管理開發中的 Teams App：

![建立或管理 Teams App](https://i.imgur.com/VGUPDHK.png)

點選左側的 `Create a new app` 建立新的 Teams App，這裡就可以開發輸入一些建立 Teams App 必要的資訊：

![建立 Teams App](https://i.imgur.com/yCuqDQ6.png)

第一次使用的時後，會覺得要填的資料很多，但其實可以分成三大類：

1. `Details` Teams App 的基本資訊，如 App 識別碼、描述、圖示
2. `Capabilities` Teams App 的主要功能，如 Tabs、Bots、Connector、Messaging Extension
3. `Finish` Teams App 的部屬設定，設定可使用的網域位置，以及測試與部屬的功能

## Details

在 Details 裡面，要填的東西比較多，大多是為了定義你的應用程式，這包含應用程式的名稱、描述、視覺圖示等。除了 App ID 要使用 GUID 格式，以及 Package Name 要用域名反解的命名規則外，最需要注意的就是品牌圖示了。

Teams 需要兩個圖示，一個是整個 Teams 在使用的 Color 圖示，必須要 192 x 192 像素，另一個是 Outline 圖示，主要用於用於收藏夾中使用，必須要是 32 x 32 像素，且盡量貼邊，不要留間隙，可以參考下圖的尺寸規範，或參考這份 [Create an app package for your Microsoft Teams app](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/apps/apps-package?WT.mc_id=DT-MVP-5003022) 官方文件。

![Icon 圖示的建議尺寸和規範](https://i.imgur.com/GA0xLQy.png)

## Capabilities

Teams App 主要有 4 種功能：

Tabs 可以將某個網頁應用程式包在裡面，讓使用者能更快速的方式取得與你 Teams App 相關的服務。

![Tabs](https://i.imgur.com/TkC5rgI.png)

Bots 聊天機器人，讓你透過對話的方式來與系統互動。

![Bots](https://i.imgur.com/igUy7I8.png)

Connector 是指我們建立的 Office 365 連接器，藉此可以將我們客製的訊息內容，推送到安裝這個 Teams App 的地方，例如 GitHub Connector 就可以將所連結的版控庫，若有新增 issue 時，發送相關資訊到 Teams 中。

Messaging Extension 則是在聊天對話框下方的功能，擴充你聊天時能使用的"特殊功能"，例如傳送 Gif 動畫，就是 Messaging Extension 的一種範例。

![Messaging Extension](https://i.imgur.com/XH44Vvn.png)

## Finish

這個段落可以將所設定好的資訊，轉成 `manifest.json` 檔，並和 Teams App 的識別圖示打包成 Zip 檔，接著 App Studio 提供我們安裝到個人或團隊（或稱頻道）中，做為測試使用，也可以透過下載 zip 做備存或到 Teams 的市集上傳提供給整個組織或團隊使用。

![上傳 App](https://i.imgur.com/eqUaibp.png)

在市集裡面有兩種上傳方式：

- **為我或我的團隊上傳**
- **為 PoyChang 上傳**

第一項只會安裝給自己或團隊（或稱頻道）中，通常做為測試用途，第二項則是你必須要有 Teams 管理者的權限才會看到，他可以上傳給整個組織使用，圖中的 `PoyChang` 就是我目前所在的（測試用）組織名稱，上傳完成之後，使用者就可以在市集或 Teams 上方的搜尋欄中輸入關鍵字搜尋囉。

## 後記

整個建立 Microsoft Teams App 的流程不複雜，只是小地方多了一些，畢竟 Teams 定位為將所有事務集中到共用的工作區，讓你可以隨時隨地工作、與團隊交談、進行協作等等，包山包海的團隊溝通 Portal 提供最大的彈性，背後勢必也需要很多設定來支持。

>如果想要開發 Teams App 像要請微軟幫忙推廣，可以參考這個網站[Teamwork Solutions Accelerator initiative](https://www.microsoft.com/microsoft-365/partners/teamwork/solutions-accelerator)。

----------

參考資料：

* [Quickly develop apps with App Studio for Microsoft Teams](https://docs.microsoft.com/zh-tw/microsoftteams/platform/get-started/get-started-app-studio?WT.mc_id=DT-MVP-5003022)
* [Microsoft Teams Community](https://developer.microsoft.com/en-us/microsoft-teams/docs)
* [Build the ultimate team hub with Microsoft Teams](https://www.slideshare.net/MSTechCommunity/build-the-ultimate-team-hub-with-microsoft-teams)
