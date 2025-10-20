---
layout: post
title: 實作 Line Notify 通知服務 (1)
date: 2017-04-20 22:23
author: Poy Chang
comments: true
categories: [Develop]
permalink: line-notify-1-basic/
---
ChatBot 真的好紅，網路上多了很多文章和討論，最近看到 Line Notify 這功能時，覺得超棒的！雖然他不像 ChatBot 可以搭配 AI 做對話然後下指令，單純的只是發送訊息，但我覺得這點就很棒了，因為在台灣企業中，使用 Line 還是大宗，所以我想透過 Line Notify 來發送企業內部系統的自動化通知，應該會有很多應用可以玩，這篇來做個基本實作。

## 簡單介紹甚麼是 Line Notify

在 LINE Taiwan TechPulse 的新聞稿中有說明：

>第三方服務提供商可以利用 LINE Notify 套件開發通知型的應用，讓外部網站的服務和應用能透過 LINE Notify 官方帳號傳送純文字、貼圖或圖片式的服務通知給用戶，例如天氣預報、貨到超商請取貨、匯款成功、交易完成等。LINE Notify 就像一般的聊天機器人一樣可以加入一對一的對話視窗中，也能加入群組中。

重點只有一句：開發者可透過 Line 來傳純文字、貼圖或圖片通知給用戶。

對！這麼簡單～

## 實作

### 建立 Line Notify 服務

首先先到 [Line Notify 的介紹網站](https://notify-bot.line.me/zh_TW/)點選**登錄服務**，用來申請一個 Line Notify 的使用憑證。

![登錄服務](http://i.imgur.com/Pu4l83e.png)

接者使用 Line 帳號登入後，輸入要註冊的服務相關資訊，最重要的是 `Callback URL` 這個欄位，因為 Line Notify 之後會透過 oAuth2 的來取得授權的 Authorize Code，然後返回到這個 `Callback URL`。這個欄位最多可以填寫 5 組。

![Callback URL](http://i.imgur.com/32rMZuH.png)

登錄完成後會取得 `Client ID` 和 `Client Secret`，這是此服務重要的識別碼，等一下就會用到了！

![取得 Client ID 和 Secret](http://i.imgur.com/vnEU2vJ.png)

### 連動使用者並取得 Authorize Code

接著我們來建立一個簡單的網頁，裡面只包含一個連結按鈕，會轉址到連動該 Line Notify 的設定頁面。

相關參數說明如下：

<table class="table table-striped">
<thead>
  <tr>
    <th>參數</th>
    <th>是否必填</th>
    <th>型別</th>
    <th>說明</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>response_type</td>
    <td>YES</td>
    <td>string</td>
    <td>指定為 `code`</td>
  </tr>
  <tr>
    <td>client_id</td>
    <td>YES</td>
    <td>string</td>
    <td>服務的 Client ID</td>
  </tr>
  <tr>
    <td>redirect_uri</td>
    <td>YES</td>
    <td>string</td>
    <td>產生 Authorize Code 之後要轉跳的網址，建議使用 HTTPS</td>
  </tr>
  <tr>
    <td>scope</td>
    <td>YES</td>
    <td>string</td>
    <td>指定為 `notify`</td>
  </tr>
  <tr>
    <td>state</td>
    <td>YES</td>
    <td>string</td>
    <td>設計用來避免 CSRF 攻擊，做狀態驗證用</td>
  </tr>
  <tr>
    <td>response_mode</td>
    <td>NO</td>
    <td>string</td>
    <td>可指定為 `form_post` 讓 redirect_uri 轉跳時使用 `POST` 方法傳遞參數</td>
  </tr>
</tbody>
</table>

>實作時，記得底下程式碼中的 `[YOUR_CLIENT_ID]` 要換成你的 `Client ID`，`[YOUR_CALLBACK_URL]` 換成你的 `Callback URL`。

>在應用情境下，可以透過 `state` 來包含身分資訊，讓企業內應用更如魚得水

<script src="https://gist.github.com/poychang/61e48339d95f11fe94b86b136f87521f.js"></script>

這裡我們還需要一個可執行的網頁伺服器環境，讓我們在 `Callback URL` 有設定 http://localhost:3000/ 可以正常運作，這裡有很多種工具可以達成，例如 Visual Studio、[http-server](https://github.com/indexzero/http-server)、[browser-sync](https://www.browsersync.io/)、[usbwebserver](http://www.usbwebserver.net/en/) 都可以輕鬆達成。

使用者點擊按鈕後，會先需要登入 Line 帳號，然後就會轉跳到下面這個設定連動的畫面。

![連動畫面](http://i.imgur.com/Usj3dxl.png)

使用者連動完後，網頁會轉跳到你設定的 Callback URL 中，並且你可以在網址列上看到 Line 發給我們的 Authorize Code。

![取得 Authorize Code](http://i.imgur.com/JMlN383.png)

### 取得發訊息的 Access Token

有了 Authorize Code 之後，我們就可以拿這組 code 去呼叫 Line 的 API 來換 Access Token，而這部分的操作會要用 HTTP 的 `POST` 方法來執行，建議可以用 [Postman](https://www.getpostman.com/) 來測試，這工具拿來測試 API 超好用的！

Postman 裡面的操作步驟如下：

1. 設定為 `POST` 方法，並輸入 `https://notify-bot.line.me/oauth/token` 取得 Token 的服務網址
2. 傳遞相關參數
    * `grant_type` 授權的類別。請指定 `authorization_code`
    * `code` 對象的暫時識別碼，也就是剛剛取得的 Authorize Code
    * `redirect_uri` Callback URL
    * `client_id` 此通知服務的識別碼
    * `client_secret` 此通知服務的密鑰
3. 送出請求
4. 若驗證成功會返回發訊息所需要的 Access Token（`access_token`）

![取得 Access Token](http://i.imgur.com/30Gs7rz.png)

### 發送文字訊息

前置作業都完成了，接著就是要透過取到的 Access Token 去發訊息。

Postman 裡面的操作步驟如下：

1. 設定為 `POST` 方法，並輸入 `https://notify-api.line.me/api/notify` 發送訊息的服務網址
2. 在 `Header` 裡面設定 `Authorization`
3. 並輸入剛剛取得的 Access Token `Bearer YOUR_ACCESS_TOKEN`
4. 在 `Body` 裡面傳遞相關參數 `message`
5. 並輸入要傳送的問字訊息，例如 `HelloWorld`
6. 送出請求
7. 若發送成功會返回成功訊息，使用這的 Line 也會收到所傳送的訊息了

![設定 Access Token](http://i.imgur.com/orYbmUS.png)

![輸入要發送的訊息](http://i.imgur.com/jEti3nj.png)

![使用者收到的訊息](http://i.imgur.com/96yXFFM.png)

## 小結

看到這裡應該會覺得，要使用 Line Notify 的訊息服務，要做的事情有好多，感覺很複雜，應該會有股即使他免費（對！他免費！）卻不想玩他的感覺吧。

不過其實裡面很多步驟，可以透過程式幫我們處理掉，讓我們的操作變的單純。[下一篇](https://blog.poychang.net/line-notify-2-use-web-api/)我打算利用 ASP.NET Web API 來整合上面的流程，讓這一切操作變得輕鬆些。

## 補充

![](http://i.imgur.com/9wS3Q7a.jpg)

Line Notify 服務除了發送文字訊息之外，還可以發送貼圖訊息、圖片訊息，讓你的應用可以更廣泛。在官方部落格的[文章](https://engineering.linecorp.com/en/blog/detail/94)裡裏面還有搭配 IoT 去觸發相關的服務，然後再去傳 Line Notify 訊息，這種應用感覺就超酷的！

----------

參考資料：

* [關於 LineBot(6) - 不用申請 Bot 也能發訊息的 Line Notify](http://studyhost.blogspot.tw/2016/12/linebot6-botline-notify.html)
* [channel9: 使用 Line Notify 免費發送 Line 通知訊息](https://channel9.msdn.com/Shows/NET-Walker-5/Line-NotifyLine)
* [LINE Notify / LINE Login 實作小問題整理](http://blog.darkthread.net/post-2017-03-30-linenotify-linelogin-tips.aspx)
* [LINE Notify API Document](https://notify-bot.line.me/doc/en/)
* [Using LINE Notify to send stickers and upload images](https://engineering.linecorp.com/en/blog/detail/94)