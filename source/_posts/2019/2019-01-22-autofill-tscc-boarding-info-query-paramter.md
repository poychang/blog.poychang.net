---
layout: post
title: 在台灣高鐵搭乘資訊查詢系統自動填入常用的悠遊卡號碼
date: 2019-01-21 22:12
author: Poy Chang
comments: true
categories: [Javascript]
permalink: autofill-tscc-boarding-info-query-paramter/
---

如果你經常搭乘台灣高鐵出差了話，你應該會辦一張悠遊聯名卡來自動扣款，方便你快速進出站，然後再報支差旅費的時候，透過[台灣高鐵悠遊聯名卡搭乘資訊查詢系統](https://queryweb.easycard.com.tw/thsrc_web/)查詢搭查紀錄，列印相關搭乘紀錄做為申請出差費的報銷憑證，但每次查詢的過程中都要輸入一樣的悠遊卡號碼和生日，有點累，透過這篇的小技巧，可以加速查詢搭查紀錄的作業時間。

## 安裝方式

我的目標是自動輸入前兩個欄位`卡號`和`持卡人生日`，所以我寫了一隻 JavaScript 書籤小程式 (bookmarklet)，以下是安裝方式：

![台灣高鐵悠遊聯名卡搭乘資訊查詢系統](https://i.imgur.com/rT4YRKl.png)

>各個瀏覽器大同小異，主要就是開啟書籤列並修改網址即可，下面的圖示我用 Edge 作範例，其他瀏覽器請參考內文做對應。

### 步驟一

第一個步驟開啟瀏覽器，並打開瀏覽器的書籤工具列或我的最愛列：

- Google Chrome 瀏覽器請按下 `Ctrl` + `Shift` + `B` 開啟書籤列
- Internet Explorer 瀏覽器請點選主選單的 [檢視] / [工具列] / [我的最愛列] 進行切換
- Edge 瀏覽器點選網址列右側的星星圖示

![將台灣高鐵查詢系統網站加入 Edge 的我的最愛](https://i.imgur.com/uQru4Jk.png)

### 步驟二

請你先修改下列程式碼中的 `YOUR_CARD_ID` (悠遊聯名卡卡號)和 `YOUR_BIRTHDAY` (持卡人生日 4 碼)改成您的查詢資訊。

```js
javascript:!function(){var t="https://queryweb.easycard.com.tw/thsrc_web/";if(location.href===t){var e=document.getElementById("txtCardID"),c=document.getElementById("txtBirth");e.value="YOUR_CARD_ID",c.value="YOUR_BIRTHDAY"}else location.href=t}();
```

### 步驟三

對步驟一所加入的書籤點擊滑鼠右鍵，修改該書籤的網址，並貼上步驟二的程式碼後，`Enter` 儲存即可。

![編輯書籤網址](https://i.imgur.com/ouqutum.png)

## 使用方式

使用方式非常簡單，第一次點選書籤時，會開啟[台灣高鐵悠遊聯名卡搭乘資訊查詢系統](https://queryweb.easycard.com.tw/thsrc_web/)。

再點選一次書籤，會自動輸入你所設定的悠遊聯名卡卡號及持卡人生日。

接著手動輸入驗證碼以及要查詢搭乘紀錄的日期區間，即可下載搭乘紀錄的 PDF 了。

## 程式碼

這個小功能的原理可以參考 [WiKi 上對 JavaScript 書籤小程式 (bookmarklet)的說明](https://zh.wikipedia.org/wiki/%E5%B0%8F%E4%B9%A6%E7%AD%BE)，如果對這篇的程式碼有興趣請參考這裡 [poychang/tscc-query-autofill-bookmarklet](https://github.com/poychang/tscc-query-autofill-bookmarklet)。

----------

參考資料：

* [Wiki - 小書籤（bookmarklet）](https://zh.wikipedia.org/wiki/%E5%B0%8F%E4%B9%A6%E7%AD%BE)
