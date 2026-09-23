---
layout: post
title: Scriptable：用 JavaScript 打造自己的 iPhone／iPad 自動化工具與 Widget
date: 2026-09-23 12:00
author: Nova
comments: true
categories: [AI-Cowork]
permalink: scriptable-widget-introduction/
---

如果你會寫 JavaScript，又經常使用 iPhone 或 iPad，那麼 [Scriptable](https://scriptable.app/) 是一個相當值得認識的 App。它可以把 iPhone 或 iPad 變成一個小型的 JavaScript 執行環境，讓我們直接在裝置上撰寫程式，存取部分 iOS 原生功能、呼叫 Web API、處理檔案，甚至建立自己的桌面 Widget。

Scriptable 官方對自己的定位非常直接：

> Automate iOS using JavaScript.

也就是：**用 JavaScript 自動化 iOS。**

Scriptable 使用 JavaScriptCore 執行 JavaScript，支援 ECMAScript 6，並提供大量封裝好的 iOS Native API，讓 JavaScript 可以直接操作檔案、行事曆、提醒事項、通知、剪貼簿等功能。

對熟悉 JavaScript 的開發者來說，它某種程度上可以理解成：**JavaScript + iOS API + Widget + Shortcuts**

## Scriptable 是什麼？

Scriptable 是由 Simon B. Støvring 開發的 iPhone／iPad 自動化工具。

你可以直接在 Scriptable 裡建立 `.js` JavaScript 程式，Scriptable 會在 iOS 上執行這些程式。

程式可以：

- 呼叫 REST API
- 讀寫檔案
- 操作 iCloud Drive
- 存取 Calendar
- 存取 Reminder
- 發送 Notification
- 讀寫 Clipboard
- 開啟 URL
- 顯示 WebView
- 顯示 UITable
- 使用 Keychain
- 取得裝置資訊
- 建立 Home Screen Widget
- 建立 Lock Screen Widget
- 從 Shortcuts 執行
- 從 Share Sheet 接收資料

官方 API 文件目前包含 `Calendar`、`FileManager`、`Keychain`、`ListWidget`、`Notification`、`Request`、`WebView`、`UITable`、`Photos`、`Reminder` 等大量 API。

換句話說，它並不只是「手機上的 JavaScript Editor」。

真正重要的是：**Scriptable 在 JavaScript 與 iOS 之間建立了一層 Bridge。**

## 最有趣的地方：Widget

Scriptable 最受歡迎的用途之一，就是製作自己的 iOS Widget。

一般 App 的 Widget 能顯示什麼，完全取決於 App 開發者提供什麼。

但 Scriptable 不一樣，你可以自己決定 Widget 顯示的內容與行為。

你可以自己決定：

- 顯示什麼資料
- 資料從哪裡來
- 如何排版
- 使用什麼字型
- 顯示什麼圖片
- Widget 點擊後做什麼
- 多久之後希望系統重新整理

Scriptable 提供 `ListWidget` API，可以加入：

```text
WidgetText
WidgetImage
WidgetDate
WidgetStack
WidgetSpacer
```

然後透過 Stack 組合出自己的版面。官方同時支援 Small、Medium、Large、iPad Extra Large，以及 iPhone Lock Screen 的 Inline、Circular、Rectangular 等 Widget 形式。

例如最簡單的 Widget：

```javascript
const widget = new ListWidget();

widget.addText('Hello Scriptable');
widget.addText(new Date().toLocaleString());

Script.setWidget(widget);
Script.complete();
```

把這支 Script 指定給 Scriptable Widget，就可以直接把程式執行結果放到 iPhone 或 iPad 桌面。這也是 Scriptable 與一般 JavaScript Runtime 最大的差別之一。

## 從 Web API 獲取資訊的 Widget

真正有趣的情境通常不是顯示固定文字，而是：**從 Internet 取得資料，再把資料呈現在 Widget 上。**

Scriptable 提供 `Request` API，可以直接發送 HTTP Request，因此非常適合串接 REST API。

概念上可以像這樣：

```javascript
const request = new Request('https://api.example.com/status');

const data = await request.loadJSON();

const widget = new ListWidget();

widget.addText('Service Status');
widget.addText(data.status);

Script.setWidget(widget);
Script.complete();
```

這樣就可以把任何有 API 的服務變成自己的 Widget。

例如：

- GitHub 專案狀態
- Azure DevOps Build Status
- Server Health Check
- 股票資訊
- 匯率
- 天氣
- IoT Sensor
- NAS 狀態
- API Usage
- AI Token Usage
- CI/CD Build Status
- 家中設備狀態

只要資料能透過 HTTP API 取得，通常都有機會搬到 Scriptable Widget 上。

## Scriptable + Shortcuts

Scriptable 另一個很重要的能力，就是與 Apple **Shortcuts（捷徑）** 整合。

Scriptable Script 可以從 Shortcuts 執行，因此可以把兩種自動化方式組合在一起。

例如：

```text
Shortcuts
    ↓
取得目前位置
    ↓
Scriptable
    ↓
呼叫 API
    ↓
JavaScript 處理資料
    ↓
回傳結果
    ↓
Shortcuts
    ↓
顯示通知
```

官方也明確支援從 Siri Shortcuts 執行 Scriptable Script。

因此可以把兩者理解成不同層次的工具。

| Shortcuts          | Scriptable          |
| ------------------ | ------------------- |
| Visual Programming | JavaScript          |
| 適合流程串接       | 適合複雜邏輯        |
| 上手容易           | 彈性較高            |
| Apple 提供 Action  | 可自行寫演算法      |
| 適合 Automation    | 適合 API 與資料處理 |
| Debug 能力有限     | 可使用 console      |

兩者並不是競爭關係。

實務上反而是：**Shortcuts 負責 Workflow，Scriptable 負責 Code。**

通常會得到最好的效果。

## Scriptable 可以讀寫檔案

Scriptable 提供完整的 `FileManager` API，可以讀取與寫入檔案，而且同時提供：

```javascript
FileManager.local();
```

以及：

```javascript
FileManager.iCloud();
```

因此可以操作 Scriptable Local Storage 或 iCloud 中的檔案。

例如可以：

```javascript
const fm = FileManager.iCloud();

const path = fm.joinPath(fm.documentsDirectory(), 'config.json');

const content = fm.readString(path);
const config = JSON.parse(content);
```

這讓 Scriptable 可以把設定與程式分離。

例如：

```text
MyWidget.js
config.json
cache.json
```

對比較複雜的 Script 特別有用。

## 用 Keychain 存取 API Token

寫 API Client 時，通常會遇到：

```text
API Key
Access Token
Refresh Token
Password
```

這類敏感資訊。

Scriptable 提供 `Keychain` API，因此可以將一些秘密資料存進 iOS Keychain，而不是直接 Hard Code 在 JavaScript 裡。

概念上：

```javascript
Keychain.set('github-token', 'YOUR_TOKEN');
```

之後：

```javascript
const token = Keychain.get('github-token');
```

這比：

```javascript
const token = 'ghp_xxxxxxxxxxxxxxxxxx';
```

直接把 Token 寫在 Script 裡合理許多。

尤其如果 Script 本身會放進 GitHub，更應該避免直接把 Credential 寫入原始碼。

## Widget 並不是即時更新

使用 Scriptable Widget 時，有一個非常重要的觀念：**Widget 不是背景常駐程式。**

Scriptable 提供：

```javascript
widget.refreshAfterDate;
```

這段程式碼可以告訴系統：這個時間之後可以重新整理。

例如：

```javascript
widget.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);
```

代表希望 15 分鐘之後重新整理。

但是官方文件特別強調：**這並不代表 15 分鐘後一定會執行。**

Widget 實際更新頻率主要仍由 iOS／iPadOS 決定，例如低電量、Widget 很少被查看等情況，都可能讓更新延後。Widget 執行時也存在記憶體限制。

所以 Scriptable Widget 比較適合：

```text
Dashboard
Status
Summary
Monitoring
```

而不是：

```text
Realtime Monitoring
秒級更新
背景持續執行
```

如果需要真正即時的 Dashboard，Web App 通常會比 Widget 合適。

## 點一下 Widget 也可以執行動作

Widget 不只是顯示資料，Scriptable 的 Widget 可以設定 URL，例如：

```javascript
widget.url = 'https://example.com';
```

點擊 Widget 後就會開啟網址。

搭配 Scriptable URL Scheme 或 Shortcuts，也可以做出：

```text
點 Widget
    ↓
執行 Shortcut
```

甚至：

```text
點 Widget
    ↓
重新執行 Scriptable Script
    ↓
重新取得 API
    ↓
顯示最新資料
```

因此可以建立帶有一定互動能力的小型 Dashboard。

## Scriptable 和一般 JavaScript 不完全一樣

第一次使用 Scriptable 時，很容易犯的一個錯誤，就是把它當成 Browser JavaScript。

Scriptable 使用 Apple JavaScriptCore，支援 ECMAScript 6，但是：

**它不是 Browser。**

因此一般 Browser 中常見的：

```javascript
document;
window;
localStorage;
```

並不存在。

官方文件也特別提醒，很多 JavaScript 教學是假設程式在 Browser 執行，因此會使用 `document` 等 Browser API，而 Scriptable 沒有這些物件。

另一方面，Scriptable 擁有一般 Browser JavaScript 沒有的 API：

```text
FileManager
ListWidget
Keychain
Notification
Calendar
Reminder
Photos
UITable
```

所以比較精確的理解應該是：

```text
JavaScript
+
Scriptable Runtime
+
iOS Native API Bridge
```

而不是：

```text
Safari 裡面的 JavaScript
```

## 最適合的使用情境

Scriptable 特別適合開發一些：**只有我自己需要，而且需求非常客製化的小工具。**

例如你可能想知道：

```text
GitHub API Usage
ChatGPT / AI API Usage
Server Status
NAS Storage
Home Assistant 狀態
Azure DevOps Build
GitHub Actions
網站是否在線
匯率
投資資訊
每天剩餘額度
某個 API Reset 時間
```

如果為了這種需求自己寫一個完整 iOS App，就必須處理：

```text
Xcode
Swift
SwiftUI
App Signing
Provisioning Profile
Widget Extension
App Group
Deployment
```

只是為了一個自己使用的小工具，這樣的成本往往太高。

透過 Scriptable 則可能只需要 100～300 行 JavaScript，就可以完成需求。

這正是它最有價值的地方。

## 典型的 Scriptable 架構

如果開始寫比較完整的 Script，我會推薦把程式拆成幾個概念：

```text
┌─────────────────────┐
│       Widget        │
│       UI Layer      │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│     Business Logic  │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│       API Client    │
│       Request       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Cache / Config    │
│ FileManager/Keychain│
└─────────────────────┘
```

也就是：

```text
Request
   ↓
取得資料
   ↓
資料整理
   ↓
Cache
   ↓
Widget Rendering
```

而不是把所有東西全部塞進 Widget Rendering Code。

這樣 Scriptable Script 即使逐漸變成數百行程式，也還是容易維護。

## 費用

目前 Scriptable 在 App Store 是**免費下載**，並提供開發者贊助性質的 App 內購買；台灣 App Store 列出的項目為 Small／Medium／Large Tip。

因此如果只是自己開發 Script、Widget 或搭配 Shortcuts 使用，基本上不需要額外訂閱服務。

這對「只想做一個自己使用的小工具」的情境尤其有吸引力。

## 隱私

根據目前台灣 App Store 顯示的開發者隱私權聲明：**Scriptable 開發者表示 App 不收集資料。**

不過這裡要區分兩件事。

Scriptable 本身不收集資料，不代表你寫的 Script 不會傳送資料。

例如：

```javascript
const request = new Request('https://api.example.com');
```

這時資料自然會與 `api.example.com` 通訊。

因此真正的資料流向仍取決於：**你自己的 Script 做了什麼。**

## Scriptable、Shortcuts 與 PWA 該怎麼選？

這三種技術其實非常適合搭配使用。

| 技術       | 最適合                            |
| ---------- | --------------------------------- |
| Shortcuts  | 系統 Automation、串接不同 App     |
| Scriptable | JavaScript、API、Widget、資料處理 |
| PWA        | 複雜 UI、互動介面、大量資訊       |

因此一個很實用的個人工具架構可能是：

```text
PWA
 │
 │ 複雜操作介面
 │
 ├───────────────┐
 │               │
 ▼               ▼
Shortcuts    Scriptable
 │               │
 │ Automation    │ Widget
 │               │ API
 │               │
 └───────┬───────┘
         │
         ▼
       Web API
```

PWA 負責完整介面。

Scriptable 負責 Widget 與 JavaScript。

Shortcuts 負責系統自動化。

三者組合之後，就可以在不開發完整 Native App 的前提下，做出相當完整的個人工具。

# 結語

Scriptable 並不是一個要取代 Swift 或 SwiftUI 的工具，如果要開發正式上架 App，Native Development 當然仍然比較合適。

但如果需求是：

> 「我只是想在自己的 iPhone 或 iPad 上做一個小工具。」

Scriptable 剛好落在一個非常有趣的位置：

```text
Shortcuts
    ↓
Scriptable
    ↓
Native App Development
```

它比 Shortcuts 更自由，又比完整開發 Native App 輕量非常多。

尤其對本來就會 JavaScript、REST API 的開發者而言，幾乎不用學習一套全新的開發技術，就可以開始寫：**真正能放在 iPhone／iPad 桌面上的個人化工具。**

這也是我認為 Scriptable 最迷人的地方。

---

## 參考資料

- [Scriptable 官方網站](https://scriptable.app/)
- [Scriptable API Documentation](https://docs.scriptable.app/)
- [Scriptable 台灣 App Store](https://apps.apple.com/tw/app/scriptable/id1405459188)
