---
layout: post
title: ChatGPT 網站的 Query String 參數
date: 2026-07-14 10:40
author: Poy Chang
comments: true
categories: [AI, Tools]
permalink: chatgpt-url-query-parameters/
---

有些搜尋引擎網站可以直接在網址後面附加 `?q=xxx` 的方式直接帶入搜尋關鍵字，我在使用 ChatGPT 時也發現它的網頁前端可以辨識部分 Query String 參數，這篇文章整理了我觀察到的 ChatGPT 網址參數，並提供一些使用範例。

一般使用 ChatGPT 時，我們會先開啟 `chatgpt.com`，再輸入提示詞、切換暫時聊天或選擇搜尋功能。

不過，ChatGPT 網頁前端其實可以辨識部分 URL Query String，例如 `prompt`、`temporary-chat`、`hints` 與 `model` 等參數，這些參數可以直接在網址中帶入，讓使用者在開啟 ChatGPT 時就能自動帶入提示詞或開啟特定功能。

透過這些參數可以用來建立超連結、書籤、瀏覽器自訂搜尋引擎、外掛，或整合至個人的自動化流程。

但在使用前必須先理解一件事：

> OpenAI 目前沒有發布完整的 `chatgpt.com` URL Query String 規格，所以參數的行為都可能隨 ChatGPT 前端更新而改變。

在 OpenAI 公開的 ChatGPT 說明文件中，可以找到 Temporary Chat、ChatGPT Search、模型選擇等功能的操作說明，但沒有一份正式文件保證 `prompt`、`hints` 或 `model` 等網址參數會長期維持相同行為。

因此，本文介紹的是截至 **2026 年 7 月**可觀察到的 ChatGPT 網頁前端行為，而不是穩定的公開 API。

## `prompt`：預先帶入提示詞

最實用的參數是 `prompt`，可以將提示詞放進 ChatGPT 的新對話頁面。

```text
https://chatgpt.com/?prompt=請說明什麼是prompt%20engineering
```

提示詞包含中文、空白、網址或特殊符號時，應先進行 URL Encoding。

在 JavaScript 中，可以使用 `URLSearchParams` 建立網址，避免自行處理編碼：

```javascript
const parameters = new URLSearchParams({
  prompt: "請說明什麼是prompt engineering"
});

const url = `https://chatgpt.com/?${parameters.toString()}`;

console.log(url);
```

也可以直接使用 `encodeURIComponent`：

```javascript
const prompt = "請說明什麼是prompt engineering";
const url = `https://chatgpt.com/?prompt=${encodeURIComponent(prompt)}`;
```

## `q`：`prompt` 的相容形式

ChatGPT 網頁也可以辨識 `q`，基本上就是把 `q` 自動轉換成 `prompt`，如果你偏好使用較短的參數名來帶入提示詞，可以嘗試這個方式。

## `temporary-chat=true`：開啟暫時聊天

許多時候，我們希望 ChatGPT 不要記錄對話歷史，也不要將對話內容用於改善模型，或者不想在登入狀態下使用，這時候可以使用 Temporary Chat。

透過 `temporary-chat=true`，可以直接開啟 Temporary Chat：

```text
https://chatgpt.com/?temporary-chat=true
```

Temporary Chat 具有以下特性：

- 不會顯示在聊天歷史紀錄。
- 不會讀取或建立記憶。
- 不會用於改善或訓練 OpenAI 模型。
- OpenAI 基於安全目的，仍可能保留對話副本最多 30 天。

這些行為有列在 OpenAI 的 Temporary Chat FAQ 與資料控制文件中。

可以將它與 `prompt` 組合：

```text
https://chatgpt.com/?prompt=分析以下程式碼&temporary-chat=true
```

適合使用 Temporary Chat 的情境包括：

- 不希望對話出現在歷史紀錄。
- 不希望目前問題影響 ChatGPT 記憶。
- 希望從不包含過往對話脈絡的空白狀態開始。
- 建立每次都應相互隔離的自動化捷徑。

需要注意的是，Temporary Chat 仍會套用帳號設定的自訂指示；它不是完全沒有任何帳號設定的匿名執行環境。

## `hints=search`：預先提示使用網路搜尋

另一個可觀察到的參數是：

```text
hints=search
```

例如：

```text
https://chatgpt.com/?prompt=今天有哪些.NET相關新聞&hints=search
```

這個參數用來向 ChatGPT 前端提示目前對話應使用 Search 功能。

![使用網路搜尋](https://files.poychang.net/storage/chatgpt-url-query-parameters/use-web-search.png)

OpenAI 官方文件確認 ChatGPT Search 可以搜尋網路、取得即時資訊並附上來源，也可以透過工具選單、搜尋圖示或 `/Search` 指令啟動。

但是，官方文件沒有將 `hints=search` 定義為正式且穩定的 URL 介面。

因此，應將它理解成：

> ChatGPT 網頁前端目前可以辨識的提示，而不是保證一定執行搜尋的指令。

ChatGPT 仍可能根據帳號權限、工具可用性、對話內容或前端版本決定是否啟用搜尋。

它也可以與 Temporary Chat 組合：

```text
https://chatgpt.com/?prompt=今天有哪些.NET相關新聞&hints=search&temporary-chat=true
```

這種組合適合建立「每次都從空白狀態開始，並查詢最新資料」的書籤。

## 尚未確認的 `hints` 值

除了 `search`，ChatGPT 前端程式或 HTML 元素中可能出現其他功能名稱，例如：

```text
research
picture_v2
agent
```

但前端內部出現某個名稱，不代表它一定可以作為 URL Query String。

因此，不應直接推論以下參數受到正式支援：

```text
hints=research
hints=picture_v2
hints=agent
```

即使某個參數目前偶爾有效，也可能只是功能實驗、A/B 測試或短期相容行為。

## 常用網址組合

整理一下幾個常用的網址組合，方便建立書籤或捷徑。

- 預先帶入提示詞
  ```text
  https://chatgpt.com/?prompt=<URL編碼後的提示詞>
  ```
- 開啟暫時聊天
  ```text
  https://chatgpt.com/?temporary-chat=true
  ```
- 在暫時聊天中帶入提示詞
  ```text
  https://chatgpt.com/?prompt=<URL編碼後的提示詞>&temporary-chat=true
  ```
- 提示 ChatGPT 使用搜尋
  ```text
  https://chatgpt.com/?prompt=<URL編碼後的提示詞>&hints=search
  ```
- 暫時聊天加上網路搜尋
  ```text
  https://chatgpt.com/?prompt=<URL編碼後的提示詞>&hints=search&temporary-chat=true
  ```

## 結論

截至目前為止，值得關注的 `chatgpt.com` Query String 包括：

| 參數                  | 用途                | 建議程度         |
| --------------------- | ------------------- | ---------------- |
| `prompt`              | 預先帶入提示詞      | 適合個人捷徑     |
| `q`                   | `prompt` 的相容形式 | 不建議新工具使用 |
| `temporary-chat=true` | 開啟暫時聊天        | 適合個人捷徑     |
| `hints=search`        | 提示使用網路搜尋    | 可實驗，不保證   |

這些網址參數很適合改善個人工作流程，但它們的本質仍是 ChatGPT 前端實作細節。建立工具時，應保留失效處理與定期驗證機制，避免將它們視為具有長期相容性保證的公開 API。

---

參考資料：

- [OpenAI Community - Query parameters in chatgpt](https://community.openai.com/t/query-parameters-in-chatgpt/1027747)
