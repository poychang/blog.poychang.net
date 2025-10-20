---
layout: post
title: 連線 FTP 出現 530 Valid Hostname is expected
date: 2016-04-20 06:41
author: Poy Chang
comments: true
categories: [Tools]
permalink: ftp-530-valid-hostname-is-expected/
---

想要在同一台 IIS 網頁伺服器中同時架設多個站台，同時又想讓各個站台都使用預設的 80 埠時，可以透過 IIS 的站台繫結來達成，而且此功能也適用於 FTP 站台，你唯一要設定的，就是不同站台使用不一樣的主機名稱或網域名稱

![IIS 站台繫結](http://i.imgur.com/dWxV46U.png)

這樣的設定完成後，使用 FTP 登入時，卻出現 **530 Valid Hostname is expected** 的連線錯誤訊息，這是因為同一組 IP, Port 號有兩個站台在執行，因此伺服器無法判定你所登錄的帳號、密碼，是適用於哪個站台。

解決辦法就是在你登錄的帳號前面加上主機名稱或網域名稱，例如你的網域名稱是 `ftp.site.com`，登錄帳號是 `user`，那你登錄 FTP 的帳號就改成`ftp.site.com|user`，注意中間是`|`(pipeline)，這樣就可以順利登錄了。
