---
layout: post
title: 強迫開啟 Edge/Chrome 記憶密碼功能
date: 2020-12-29 14:38
author: Poy Chang
comments: true
categories: [Tools]
permalink: force-enable-edge-and-chrome-password-manager/
---

組織為了統一瀏覽器設定，可以將一些通用原則設定套用到 Microsoft Edge 或 Chrome 瀏覽器之中，以達到方便管理的需求，不過如果記憶密碼功能順便被停用了，這可是會讓金魚腦的我一時不知所措，好佳在有辦法針對特定功能強迫啟動，有需要的使用者可以參考看看。

如果瀏覽器有被套用組織的群組原則設定，你應該會在瀏覽器的功能清單下方看到 `Managed by your organization`（`你的瀏覽器是由貴機構所管理`）的字樣，如下圖：

![Managed by your organization](https://i.imgur.com/DMl9MKH.png)

點進去你會開啟 `edge://management/` 這個頁面，然後告訴你下面這句話：

```
Microsoft Edge 由您的組織管理
如果您在工作場所或學校使用 Microsoft Edge，可能會受到您的組織控管，或是受組織設定與維護。您的組織可以設定或限制特定功能、安裝並封鎖擴充功能、監視活動，並控制您的使用方式。

如果 Microsoft Edge 受到控管，您可以在 edge://policy 頁面上檢視您的組織設定的原則。
```

這時候想要看看到底有哪些 Policy 原則被套用，於是又點選了 `edge://policy` 看到以下畫面：

![Microsoft Edge Policy 套用原則清單](https://i.imgur.com/hvxO94N.png)

這裡看到一個關鍵字 `PasswordManagerEnabled` 被設定成 `false`，猜想就是因為這個設定，所以記憶密碼功能被停用了。

這時候我們無法從介面設定上面去修改這個設定，但是我們可以從登陸檔中下手，啟動 `regedit.exe` 工具，接著開啟指定瀏覽器的登陸檔位置：

* Microsoft Edge 使用者 `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge`
* Google Chrome 使用者 `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome`

接著在對應的路徑下建立一個 `PasswordManagerEnabled` DWORD 設定值，並設定為 `1`。

重新啟動瀏覽器後，你就可以發現記憶密碼的功能被打開囉！

![修改登陸檔](https://i.imgur.com/B1kNV2g.png)

>修改登陸檔有風險，如果你不知道你在做什麼，就別做了。

----------

參考資料：

* [Google Chrome: This setting is enforced by your administrator](https://stackoverflow.com/a/32875825/3803939)
