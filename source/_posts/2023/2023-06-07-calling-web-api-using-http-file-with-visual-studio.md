---
layout: post
title: 在 Visual Studio 中使用 HTTP 檔案呼叫 Web API
date: 2023-06-07 15:03
author: Poy Chang
comments: true
categories: [Dotnet, WebAPI, Develop, Tools]
permalink: calling-web-api-using-http-file-with-visual-studio/
---

在開發 Web API 的應用程式時，經常會需要測試 API 的呼叫，這時候可以使用功能齊全的 [Postman](https://www.postman.com/) 來協助我們測試。如果你是使用 Visual Studio 來開發的時候，在 2022 的版本中，內建了 HTTP 檔案功能，我們可以在 Visual Studio 中直接執行這個檔案來測試 Web API 的呼叫。

使用 HTTP 檔案來測試 API 的呼叫，好處除了是可以在一個開發工具中就可以完成開發與測試呼叫的動作，藉由撰寫 HTTP 檔案（`.http`），我們可以將這個用於測試呼叫的檔案提交到版本庫中，如此一來就可以跟著專案的進行而直接使用，不需要另外安裝其他工具。

使用上其實相當簡單，只要使用 Visual Studio 2022 17.5 以上版本，在專案中新增一個副檔名為 `.http` 的 HTTP 檔案，然後在檔案中撰寫 HTTP 語法，就可以點選畫面左側的綠色箭頭，就可以執行該段 HTTP 呼叫。

![點選 Visual Studio 畫面中左側綠色箭頭，即可執行該段 HTTP 呼叫](https://i.imgur.com/02y4Yh6.png)

至於 HTTP 語法，其實只要掌握幾個重點就可以了。

## 變數

該行開頭為 `@` 的設定，就會被視為變數，語法為 `@Name = Value`，你可以在檔案的開頭會之中宣告變數，但必須先宣告之後，才能在檔案中任何地方使用。

使用時使用 `{{` 和 `}}` 來參考變數，如下：

```http
@hostname=localhost
@port=7025
GET https://{{hostname}}:{{port}}/weatherforecast
```

## 發出請求

要發出 HTTP 請求的語法為 `HTTPMethod URL HTTPVersion`，開頭的 `HTTPMethod` 是使用標準的 HTTP 動詞，例如 `GET`、`POST`、`PUT`、`DELETE` 等，然後接著 `URL` 是要呼叫的網址，最後 `HTTPVersion` 可寫可不寫，這是用來設定呼叫時所使用的 HTTP 版本，如 `HTTP/1.1`、`HTTP/2` 或 `HTTP/3`。範例如下：

```http
GET https://localhost:7025/weatherforecast HTTP/1.1

###

POST https://localhost:7025/weatherforecast HTTP/1.1

###
# 或是使用上面所提到的變數用法

POST https://{{hostname}}:{{port}}/weatherforecast HTTP/1.1
```

另外要注意的是，一個檔案內是可以包含多個 HTTP 呼叫，只是呼叫間需要用 `###` 來做分隔。

我們也可以在這個分隔後面寫上註解，說明這個段落的用途，也可以在任一行開頭使用 `#` 和 `//` 來寫註解。

## Header 和 Body

在呼叫 HTTP 的時候，有時候需要設定 HTTP Header，例如 `Content-Type` 要設定成 `application/json`，或是身分驗證用的 `Authorization`，這部分參考下方範例。

而 HTTP Body 也是經常會用到的，例如 `POST` 呼叫時，就需要在 Body 中帶入要傳送的資料，這部分也是參考下方範例。

```http
@value = Sweltering

POST https://{{hostname}}/weatherforecast HTTP/1.1
Content-Type: application/json

{
    "summary": "{{value}}"
}
```

這個範例可以發現，變數的使用也可以放在 HTTP Body 中，相當方便。

學會這些簡單的操作，我們就可以非常便利在 Visual Studio 中使用 HTTP 檔案來測試 Web API 的呼叫了。

## 呼叫逾時的問題

當呼叫的 API 反應都很快的時候，你可能不會注意到下面這個問題，在 Visual Studio 中執行 HTTP 的呼叫時，預設是有 20 秒的限制，也就是當這個呼叫超過 20 秒沒有回應，就會被視為逾時並回傳給你以下訊息。

```
Response time: 20003 ms
Status code: RequestTimeout (408)
```

我們可以從選單列中選擇 `Tools` > `Options`，接著在 `Text Editor` > `Rest` > `Advanced` 修改 `Request timeout` 的設定值，如下圖：

![在 Visual Studio 的設定中修改 HTTP 呼叫逾時的預設值](https://i.imgur.com/sz2EkI2.png)

---

參考資料：

* [Calling Web APIs using the dotnet CLI and HTTP Files with Visual Studio](https://csharp.christiannagel.com/2023/03/21/httptools/)
* [MS Learn - Use .http files in Visual Studio 2022](https://learn.microsoft.com/en-us/aspnet/core/test/http-files?WT.mc_id=DT-MVP-5003022)