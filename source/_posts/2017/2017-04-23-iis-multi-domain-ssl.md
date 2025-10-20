---
layout: post
title: 在 IIS 架設多個 HTTPS 網站
date: 2017-04-23 21:23
author: Poy Chang
comments: true
categories: [WebAPI, Develop, Tools]
permalink: iis-multi-domain-ssl/
---
這是個講求 CP 值的時代，如何在一個 IIS 裡架設多個網站，而且是多個 HTTPS 的網站，提供安全及充分利用系統資源，是這次的主題。

## 基本設定

在 IIS 裡，每個網站都必須具有唯一的標籤，而這個標籤由下列三項組成：

* IP 位址
* Port 埠號
* Host Header 主機名稱

因此如果要架設多個網站就在這三者玩把戲，對應的使用時機如下：

* 一台伺服器有多個 IP 時
	* 例如有 `192.168.1.10` 和 `192.168.2.20` 兩個 IP，就可以分別分派給不同的站台
* 如果只有一個 IP 時
	* 可開額外的 Port 給其他網站
	* 預設是 80 Port，可以開 8080 或其他非系統常用 Port 給不同的站台
* 以上都不喜歡時
	* 透過指定 `Host Header` 主機名稱來區分站台
	* 這裡會用該站台的網址來做設定

而這三者的設定在 IIS 裡面的**站台繫結**裡面可以處理大部分的設定。

![IIS 站台繫結](http://i.imgur.com/dWxV46U.png)

## HTTPS 簡介

再要求安全性的地方，我們會加上 SSL 來提供傳出加密，尤其是在 Google Chrome 瀏覽器 v58 之後的版本，對於 Https 的要求變得更嚴格，必須使用 2048 位密鑰的證書，這不僅直接影響到 SEO 的排名，更讓使用者在網址列前看到**不安全**三個紅字警示標示，讓使用者感覺怕怕的。

![Not Secure](http://i.imgur.com/tSjeyhn.png)

要使用 HTTPS 必須要搭配部署證書，也就是憑證檔，主要分三種類型

* 單域名證書
	* 例如頒發給 www.example.com 的證書
* 多域名證書
	* 例如頒發給 ap1.example.com 和 ap2.example.com 的證書
	* 會在證書中的**主體別名**（Subject Alternative Name）中標示
* 通配符證書
	* 例如頒發給 *.example.com 的證書

**多域名證書**和[**通配符證書**](https://zh.wikipedia.org/zh-tw/%E9%80%9A%E9%85%8D%E7%AC%A6%E8%AF%81%E4%B9%A6)是最貴的，他可以用於多個網域或站台。

## HTTPS 設定

如果有手上有的是**通配符證書**了話，可以直接在 IIS 裡面的**站台繫結**去指定證書，如下圖，在主機名稱裡設定要使用 HTTPS 的站台名稱。

![](http://i.imgur.com/cYOWEvG.png)

如果是使用**多域名證書**，IIS 預設是無法修改主機名稱的，因此在**站台繫結**裡會無法修改主機名稱欄位，此時需要透過修改 `applicationHost.config` 設定檔來達成目的，步驟如下：

1. 停止 IIS 服務
2. 開啟 `C:\Windows\system32\inetsrv\config\applicationHost.config`
3. 找到 `<system.applicationHost>` 底下的 `<sites>` 段落
	* 此段落是 IIS 裡各站台的設定
4. 修改 `binding` 屬性，輸入主機名稱
5. 重新啟動 IIS 服務

範例如下：

```xml
<site name="AP1" id="1" serverAutoStart="false">
    <application path="/">
        <virtualDirectory path="/" physicalPath="%SystemDrive%\inetpub\ap1" />
    </application>
    <bindings>
        <binding protocol="http" bindingInformation="*:80:ap1.example.com" />
        <binding protocol="https" bindingInformation="*:443:ap1.example.com" />
    </bindings>
</site>
<site name="AP2" id="2" serverAutoStart="false">
    <application path="/">
        <virtualDirectory path="/" physicalPath="%SystemDrive%\inetpub\ap2" />
    </application>
    <bindings>
        <binding protocol="http" bindingInformation="*:80:ap2.example.com" />
        <binding protocol="https" bindingInformation="*:443:ap2.example.com" />
    </bindings>
</site>
```

範例中有兩個站台 AP1 和 AP2，使用同一個 IP，同一個 Port，差別在於主機名稱不同，IIS 會自己去挑選適合的 SSL 憑證來使用，如此一來我們就有兩個 HTTPS 的站台了。

----------

參考資料：

* [SSL Host Headers in IIS 7](https://www.sslshopper.com/article-ssl-host-headers-in-iis-7.html)
* [如何架設多個網站](https://shazi.info/iis7-%E5%A6%82%E4%BD%95%E6%9E%B6%E8%A8%AD%E5%A4%9A%E5%80%8B%E7%B6%B2%E7%AB%99/)
* [SNI: 如何讓虛擬主機上多個網域名稱使用單一 IP 安裝 SSL/TLS 憑證](https://blog.pumo.com.tw/archives/815)
* [Google 對 HTTPS / SSL 網站進行優先排名](https://kknews.cc/tech/vm3z4lq.html)
* [多域名 SSL 證書](http://www.baike.com/wiki/%E5%A4%9A%E5%9F%9F%E5%90%8DSSL%E8%AF%81%E4%B9%A6)