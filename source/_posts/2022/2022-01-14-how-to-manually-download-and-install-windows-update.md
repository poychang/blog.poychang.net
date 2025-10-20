---
layout: post
title: 如何手動下載 Windows Update 安裝檔
date: 2022-01-14 12:12
author: Poy Chang
comments: true
categories: [Tools]
permalink: how-to-manually-download-and-install-windows-update/
---

有時候作業系統遇到需要緊急安裝更新檔，等不急每台電腦一台一台執行 Windows Update，或是有些環境會造成 Windows Update 的 WSUS 更新機制失敗，這時候可以使用手動下載更新檔，並且安裝。這篇文章將說明如何手動下載 Windows Update 安裝檔並進行安裝。

![執行 Windows Update 失敗畫面](https://i.imgur.com/l3QifUe.png)

如果你曾經在想要更新 Windows 的時候，WSUS (Windows Server Update Services) 卻給你上面這個 `Update failed` 畫面，而你又想趕緊安裝更新，這時候可以到 [https://www.catalog.update.microsoft.com/](https://www.catalog.update.microsoft.com/) 這個網站，搜尋你要更新的更新檔 KB (Knowledge Base) 號碼，然後根據你要安裝的 `Product` 下載適合你的更新檔。

![搜尋更新檔](https://i.imgur.com/V8P2DBq.png)

>除了 GDR 之外，還有另一個分隻 LDR (limited distribution release)，更多資訊請參考 [Windows Hotfixes and Updates - How do they work?](https://docs.microsoft.com/en-us/archive/blogs/ntdebugging/windows-hotfixes-and-updates-how-do-they-work) 官方文件。

如此一來，就輕鬆拿到要更新的安裝檔，讓我們可以手動離線更新囉。

----------

參考資料：

* [How to Manually Download and Install Windows 11 Updates from Microsoft Catalog](https://allthings.how/how-to-manually-download-and-install-windows-11-updates-from-microsoft-catalogue/)
* [WSUS difference between Windows 10 and Windows 10 GDR-DU Products](https://serverfault.com/questions/823055/wsus-difference-between-windows-10-and-windows-10-gdr-du-products)
* [Windows Hotfixes and Updates - How do they work?](https://docs.microsoft.com/en-us/archive/blogs/ntdebugging/windows-hotfixes-and-updates-how-do-they-work)
