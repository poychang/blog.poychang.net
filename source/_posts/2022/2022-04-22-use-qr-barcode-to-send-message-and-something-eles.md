---
layout: post
title: 使用 QR Code 發送簡訊、加入 Wi-Fi、遞名片
date: 2022-04-22 17:13
author: Poy Chang
comments: true
categories: [Develop]
permalink: use-qr-barcode-to-send-message-and-something-eles/
---

疫情期間要進入商店或餐廳，第一件事除了量體溫、噴酒精之外，就是要完成實聯制登記，大多數的店家都會提供 QR Code 讓民眾掃描，加速登記速度，而這背後的運作原理是什麼呢？你可以把 QR Code 看作訊息的載體，而內容是透過 URI Scheme 來表達，讓讀取到此內容的系統，可以對應做出特定的動作。這篇來記錄一下，一些常見的 URI Scheme，以及如何使用。

![掃描實聯制(圖片來自 https://www.businesstoday.com.tw/article/category/183015/post/202106020006/)](https://i.imgur.com/cjev8Kl.png)

這個我們實聯制登記的動作，背後是傳送簡訊的延伸（參考[這裡](https://g0v.hackmd.io/@au/HkmyoS-Fu#%E9%96%8B%E7%99%BC%E8%80%85-QampA)），如果你用 QR Code 讀取器來查看這圖片的內容，你會看到類似這樣的文字 `smsto:1922:場所代碼：111121314151617 本次實聯簡訊限防疫目的使用。`，這個格式就是 URI Scheme 的一種表現方式。

一般來說，我們常使用的系統會支援以下幾種 URI Scheme：

- URL
- E-mail
- 電話號碼
- Contact information
- SMS/MMS/FaceTime
- Maps, Geographic information
- Calendar Events
- Wi-Fi Network

以下記錄部分 URI Scheme 比較特別的地方。

## URL

這個 URI 就是我們最常看到的網址，例如 `https://blog.poychang.net/` 就代表你現在看到的這個網站，一般來說 QR Code 掃描器一讀到這樣的內容就會開啟預設的瀏覽器並開啟所指定的網頁。而這個 URI 還有一種格式，比較少用到，一般來說系統會支援，你可以試試看，就是 `URLTO:blog.poychang.net`，這樣的效果會是一樣的。

另外，這裡有個小技巧很有趣，在 QR Code 的編碼原則中，如果內容是由**大寫**英文字母、數字、符號所組成，這樣的條件下，可以讓編碼器使用更具讀取能力的編碼模式，因此如果你的網站可以正確解析全大寫的網址，那麼使用 `HTTPS://BLOG.POYCHANG.NET/` 來進行 QR Code 編碼，會比小寫的網址更具有優勢。但請注意，前提是你網站可以接受不區分大小寫的網址。

>不過區分大小寫的 URL 是一種網路標準（[HTML and URLs](https://www.w3.org/TR/WD-html40-970708/htmlweb.html)），大多數的網站伺服器都會遵循這項標準。

## E-mail

這個 URI 應該很常遇到，基本用法是像這樣 `mailto:someone@yoursite.com`，然後可以再後面加上 `?` 再給定特定的參數，用來指定一些資訊，例如主旨（`subject`）、副本（`cc`）、密件副本（`bcc`）、內容（`body`）。

各個參數彼此之間用 `&` 串聯，這樣一來可以組合出這樣的 URI：

```
# 發送電子郵件
mailto:someone@yoursite.com?cc=john@abc.com,marry@abc.com&bcc=tom@abc.com&subject=Mail%20Subject&body=Here%20Is%20Mail%20Body.
```

特別要注意的是 `body`的內容必須是經過 URL Encode 的，例如 ` ` 空白字元要被編碼成 `%20`。

>更多關於此 URI 的規格，可以參考 [RFC 6068](https://tools.ietf.org/html/rfc6068)。

## SMS/MMS/FaceTime

這個 URI 就是疫情期間簡訊實聯制的關鍵角色了，基本用法是 `sms:+8865555500000`，然後可以在後面加上 `:` 再給定訊息內容，這樣就可以建立一組帶有預設訊息的 SMS/MMS 簡訊了。

```
# 發送簡訊
sms:+8865555500000

# 發送帶有預設訊息的簡訊
sms:+8865555500000:這是一段預先寫好的訊息
```

FaceTime 語音或影像電話則有點不一樣，主要是要用 FaceTime 自己的協定，兩種通訊方式是使用不同的協定，方法如下

```
# FaceTime 語音電話
facetime:+8865555500000
facetime:someone@icloud.com

# FaceTime 影像電話
facetime-audio:+8865555500000
facetime-audio:someone@icloud.com
```

>更多關於此 URI 的規格，可以參考 [RFC 5724](https://datatracker.ietf.org/doc/html/rfc5724)。

## Wi-Fi Network

這個 URI 的 QRcode 很適合放在公共環境下，讓大家掃描取得 Wi-Fi 聯網資訊，基本用法是像這樣 `WIFI:T:WPA;S:MY WIFI;P:PASSWORD;;`。

| Parameter | Example      | Description                                                                             |
| --------- | ------------ | --------------------------------------------------------------------------------------- |
| T         | `WPA`        | 驗證類型，可設定成 `WEP`、`WPA`、`WPA2-EAP`，不設定密碼可設定成 `nopass` 或直接密碼留空 |
| S         | `MY WIFI`    | Wi-Fi 網路的 SSID 設別碼                                                                |
| P         | `PASSWORD`   | Wi-Fi 密碼                                                                              |
| H         | `true`       | 如果 SSID 設定成隱藏模式，則此參數必須設定成 `true`                                     |
| E         | `TTLS`       | (WPA2-EAP only) 設定值有 `TTLS` 或 `PWD`                                                |
| A         | `anon`       | (WPA2-EAP only) 設定匿名識別碼                                                          |
| I         | `myidentity` | (WPA2-EAP only) 設定識別碼                                                              |
| PH2       | `MSCHAPV2`   | (WPA2-EAP only)                                                                         |

參數的順序沒有影響，如果有內容中有 `\`、`;`、`,`、`"`、`:` 特殊字元了話，要用 `\` 跳脫字元來處理。

## 後記

QR Code 除了單純當一些文字內容的載體，搭配 URI 的玩法滿有趣的，有機會可以嘗試玩玩看。

----------

參考資料：

* [Barcode Contents](https://github.com/zxing/zxing/wiki/Barcode-Contents)
* [We can connect to a Wi-Fi network on our iPhone using a QR code](https://medium.com/@jp_pancake/we-can-connect-to-a-wi-fi-network-on-our-iphone-with-qr-codes-e33d7e0f04b5)
* [QR Code Recognition on iOS 11](https://developer.apple.com/videos/play/tech-talks/206/)
* [WiFi Card](https://wificard.io/)
