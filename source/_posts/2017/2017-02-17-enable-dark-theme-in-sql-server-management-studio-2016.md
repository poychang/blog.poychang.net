---
layout: post
title: 啟用 SSMS 2016 的黑色佈景主題
date: 2017-02-17 21:58
author: Poy Chang
comments: true
categories: [SQL, Tools]
permalink: enable-dark-theme-in-sql-server-management-studio-2016/
---
現在越來越多的開發工具或使用者介面都有黑色主題，從 [Visual Studio](https://blogs.msdn.microsoft.com/visualstudio/2012/05/29/visual-studio-dark-theme/) 到 [Google Chrome Web DevTools](https://developers.google.com/web/updates/2016/02/devtools-digest-devtools-go-dark) 也有了黑色主題，那我們常用的 SQL Server Management Studio 資料庫管理工具呢？有個方法可以讓你搶先享受！

微軟的開發團隊是有聽到大家想要黑色主題的[聲音](https://connect.microsoft.com/SQLServer/feedback/details/2540194/sql-server-management-studio-dark-black-theme)，而且這功能也在 SSMS 2016 中有些蛛絲馬跡，照著下列步驟，就可以開啟這尚未開放的黑色主題。

1. 用管理者權限開啟記事本
2. 開啟 `C:\Program Files (x86)\Microsoft SQL Server\130\Tools\Binn\ManagementStudio` 底下的 `ssms.pkgundef` 檔案
3. 尋找文件中 `Remove Dark theme` 關鍵區段，將該區段的程式碼全部註解並儲存

![Remove Dark theme section](http://i.imgur.com/10o13Qw.png)

4. 接著在 `Tools` > `Options` > `Color Theme` 中選擇 `Dark` 佈景主題，就大功告成了！ 

![SSMS options](http://i.imgur.com/nOXvHnZ.png) 

當我發現這做法而且實作成功的時候，真的是開心的去買鹹酥雞了！最後讓我留下這見證 SSMS 也有黑色主題的歷史一刻 XD

![SSMS 2016 with dark them](http://i.imgur.com/RDeut95.png)

## 後記

- 在安裝 SSMS 2017 時發現也有同樣的設定區塊，位置一模一樣，這個功能什麼時候才會全面開放呢，期待呀！

----------

參考資料：

* [Enable "Dark" Theme in SQL Server Management Studio 2016](https://community.spiceworks.com/how_to/136505-enable-dark-theme-in-sql-server-management-studio-2016)