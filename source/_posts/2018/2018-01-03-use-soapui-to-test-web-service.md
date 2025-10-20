---
layout: post
title: 簡單使用 SoapUI 來測試 Web Service
date: 2018-01-03 21:12
author: Poy Chang
comments: true
categories: [Tools]
permalink: use-soapui-to-test-web-service/
---
要測試 REST API 時，[Postman](https://www.getpostman.com/) 絕對是你的好幫手，但如果是要測試 SOAP 協議的 Web Service 的時候呢？有個工具叫做 [SoapUI](https://www.soapui.org/)，提供介面讓我們輕鬆測試 Web Service 是否能成功的被呼叫。

SoapUI API 測試工具有 Open Source 的版本，[從這裡下載](https://www.soapui.org/downloads/soapui.html)，可以測試呼叫 SOAP 及 REST API，也包含匯入 WSDL 來建立 API 清單，另外還可以建立測試案例、LoadTest等進階功能，相當強大。

>這裡只簡單介紹如何透過 SoapUI 來匯入 WSDL 並測試執行 SOAP Web Service。

從工具列的 File > New > Project 建立新專案

![建立專案](https://i.imgur.com/AXeZXpm.png)

1. 建立時選擇使用描述檔，**Description File**
2. 點選使用 SOAP 協議 WSDL 描述檔，**WSDL definition(SOAP)**
3. 編輯專案名稱
4. 加入 WSDL 檔案或是使用 WSDL URL 來取得描述檔

![設定 WSDL 來源](https://i.imgur.com/Iqqvz7H.png)

點選 OK 後，會跳出自動根據 WSDL 的動作(Operations) 來產生執行案例，這裡你可以挑選你想要測試執行的 API，通常我都是直接使用預設值，全選。

![產生執行案例](https://i.imgur.com/3nWP3kw.png)

產生玩執行案例後，在這個畫面的左邊，Navigator，可以瀏覽所有可執行的案例，裡面有對應的 API，點選後左側會有執行該 API 所需要輸入的參數，以及檢視執行後的 XML 結果。

![執行測試](https://i.imgur.com/FmoBn9c.png)

這裡就簡單介紹如何使用 SoapUI 來測試 SOAP 的 Web Service，有遇到更進階的使用，再來分享給大家。

----------

參考資料：

* [維基百科 - WSDL](https://zh.wikipedia.org/zh-tw/WSDL)
* [SoapUI Open Source Overview](https://www.soapui.org/open-source.html)

