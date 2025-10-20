---
layout: post
title: HTTP 狀態碼一覽表
date: 2017-04-19 08:20
author: Poy Chang
comments: true
categories: [Develop]
permalink: http-status-code/
---

HTTP 狀態碼指的是從伺服器端回應(HTTP Response)的狀態，對於狀態的分類可區分三個層級，分別用三個數字表示，第一個數字為大類、第二個數字為中類、第三個數字為小類。完整的狀態碼定義可以參考 [RFC 2616 Hypertext Transfer Protocol -- HTTP/1.1 的 10 Status Code Definitions](https://tools.ietf.org/html/rfc2616#section-10)，裡面有完整且詳盡的標準說明。

在 RFC 2616 所定義的 HTTP/1.1 中，狀態碼可以分成 5 類

1. [1xx Informationa - 參考資訊](#1xx-informational-參考資訊)
2. [2xx Successful - 成功](#2xx-successful-成功)
3. [3xx Redirection - 重新導向](#3xx-redirection-重新導向)
4. [4xx Client Error - 用戶端錯誤](#4xx-client-error-用戶端錯誤)
5. [5xx Server Error - 伺服器錯誤](#5xx-server-error-伺服器錯誤)

以下就根據 RFC 2616 標準中的這五類來做說明。

> IIS 基於此標準上設計了自己的 HTTP 狀態碼，可以參考[這裡](https://support.microsoft.com/zh-tw/help/943891/the-http-status-code-in-iis-7-0--iis-7-5--and-iis-8-0)

## 1xx Informational 參考資訊

這些狀態碼代表主機先暫時回應用戶端一個狀態，所以在接收一般的回應之前，用戶端應準備接收一個或多個 1xx 的回應。

- `100` Continue - 繼續執行所發出的請求。
  - 根據 [RFC 2616 Sec8.2.3](http://www.w3.org/Protocols/rfc2616/rfc2616-sec8.html#sec8.2.3) 描述，當 POST 的資料大於 1024 時，請求會分兩步，第一步發送 `Expect:100-continue` 詢問伺服器是否接受此資料，確認接受後，第二步才 POST 資料給伺服器。
- `101` Switching Protocols - 切換通訊協定。

## 2xx Successful 成功

這類的狀態碼表示伺服器成功接收到用戶端的要求、理解用戶端要求、以及接受用戶端要求。

- `200` OK - 確定。用戶端要求成功。
- `201` Created - 已建立。
- `202` Accepted - 已接受。
- `203` Non-Authoritative Information - 非授權資訊。
- `204` No Content - 無內容。
- `205` Reset Content - 重設內容。
- `206` Partial Content - 部分內容。

## 3xx Redirection 重新導向

用戶端瀏覽器必須採取更多動作才能完成要求。例如瀏覽器可能必須重新發出 HTTP Request 要求伺服器上的不同頁面。

- `300` Multiple Choices
- `301` Moved Permanently - 要求的網頁已經永久改變網址。此狀態要求用戶端未來在連結此網址時應該導向至指定的 URI。
- `302` Found - 物件已移動，並告知移動過去的網址。
- `303` See Other - 通知用戶端使用 GET 連到另一個 URI 去查看。
- `304` Not Modified - 未修改。用戶端要求該網頁時，其內容並沒有變更。
- `305` Use Proxy - 要求的網頁必須透過 Server 指定的 proxy 才能查看(需透過 Location 標頭)。
- `306` (Unused)- (未使用) 此代碼僅用來為了向前相容而已。
- `307` Temporary Redirect - 暫時重新導向。要求的網頁只是「暫時」改變網址而已。

## 4xx Client Error 用戶端錯誤

這代表錯誤發生，且這錯誤的發生的原因跟「用戶端」有關。例如：用戶端可能連結到不存在的頁面、用戶端的權限不足、或可能未提供有效的驗證資訊(輸入的帳號、密碼錯誤)。下次看到 4xx 的回應千萬不要傻傻的一直查程式哪裡寫錯誤了(不過也有可能是程式造成的)。

- `400` Bad Request - 錯誤的要求。
- `401` Unauthorized - 拒絕存取。
- `402` Payment Required
- `403` Forbidden - 禁止使用。
- `404` Not Found - 找不到。
- `405` Method Not Allowed - 用來存取這個頁面的 HTTP 動詞不受允許 (方法不受允許)。
- `406` Not Acceptable - 用戶端瀏覽器不接受要求頁面的 MIME 類型。
- `407` Proxy Authentication Required - 需要 Proxy 驗證。
- `408` Request Timeout - 請求逾時。
- `409` Conflict - 資源狀態衝突。
- `410` Gone - 資源已不存在且無轉址資訊。
- `411` Length Required - 要求的 Content-Length 沒有定義。
- `412` Precondition Failed - 指定條件失敗。
- `413` Request Entity Too Large - 要求的實體太大。
- `414` Request-URI Too Long - 要求 URI 太長。會因伺服器或瀏覽器而異，建議 2048 字元以下比較保險。
- `415` Unsupported Media Type - 不支援的媒體類型。
- `416` Requested Range Not Satisfiable - 無法滿足要求的範圍。
- `417` Expectation Failed - 執行失敗。

## 5xx Server Error 伺服器錯誤

這代表錯誤發生，且這錯誤發生的原因跟「伺服器」有關。伺服器因為發生錯誤或例外狀況(Exception)而無法完成要求(Request)時，就會回應 5xx 的錯誤，且這肯定跟伺服器有關。

- `500` Internal Server Error - 內部伺服器錯誤。
- `501` Not Implemented – 標頭值指定未實作的設定。
- `502` Bad Gateway - Web 伺服器在作為閘道或 Proxy 時收到無效的回應。
- `503` Service Unavailable - 服務無法使用。 這是 IIS 6.0 專用的錯誤碼。
- `504` Gateway Timeout - 閘道逾時。
- `505` HTTP Version Not Supported - 不支援的 HTTP 版本。

## 後記

網路上有人畫出了 HTTP 狀態的決策流程圖，詳細可看看這個專案 [for-GET/http-decision-diagram](https://github.com/for-GET/http-decision-diagram)，或是直接點開下圖：

<a href="https://i.imgur.com/xnHCY8H.png" target="_blank">
  ![HTTP Decision Diagram](https://i.imgur.com/xnHCY8H.png)
</a>

畫出這決策流程的人，真的很強大耶！

---

參考資料：

- [HTTP/1.1: Status Code Definitions](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)[英文]
- [IIS 狀態碼說明](http://support.microsoft.com/kb/318380/zh-tw)
- [HTTP 狀態碼](http://vincent119.blogspot.com/2008/06/100-continue-client-client-client.html)
- [HTTP 狀態碼代表什麼意義？](http://www.dmedia.centerbbs.com/blog/index.php?load=read&id=246)
- [HTTP Extensions for Distributed Authoring -- WEBDAV](http://www.webdav.org/specs/rfc2518.html)
- [List of HTTP status codes - Wikipedia, the free encyclopedia](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
- [ASP.NET Core - How to return a specific status code and no contents from Controller?](http://stackoverflow.com/questions/37690114/asp-net-core-how-to-return-a-specific-status-code-and-no-contents-from-control)
- [保哥：網頁開發人員應瞭解的 HTTP 狀態碼](http://blog.miniasp.com/post/2009/01/16/Web-developer-should-know-about-HTTP-Status-Code.aspx)
- [!false 技術客 - HTTP 狀態碼 (Status Codes)](https://notfalse.net/48/http-status-codes)
