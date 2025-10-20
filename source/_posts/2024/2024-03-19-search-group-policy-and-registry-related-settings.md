---
layout: post
title: 搜尋群組原則和註冊表相關設定
date: 2024-03-19 10:33
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: search-group-policy-and-registry-related-settings/
---

群組原則 (Group Policy) 的設定通常會關聯到註冊表 (Windows Registry) 中的特定鍵值，當我們在 Group Policy 中設定某些原則時，它們會影響到註冊表中相對應的設定。例如，如果在 Group Policy 中禁用某個功能，它可能會在註冊表中更改相應的設定，以確保該功能不可用。不過要如何找到這個對應的特定鍵值，相當不容易，這篇來記錄可以怎麼做。

微軟官方提供了幾個方法讓我們去找 Group Policy 和 Registry 對應的設定鍵值：

1. 下載 [Group Policy Settings Reference](https://www.microsoft.com/en-us/download/details.aspx?id=25250) 的 Excel 檔案
2. 到 Microsoft Learn 中查詢 [Group Policy Registry Table](https://learn.microsoft.com/en-us/previous-versions/ms815238(v=msdn.10)?WT.mc_id=DT-MVP-5003022)
3. 使用 PowerShell 的 [Get-GPRegistryValue](https://learn.microsoft.com/en-us/powershell/module/grouppolicy/get-gpregistryvalue?WT.mc_id=DT-MVP-5003022) 做查詢

不過這些查詢方式都沒有這一個網站友善：[Group Policy Search (GPS) service](https://gpsearch.azurewebsites.net)

這是由微軟員工自行製作的查詢網站，背後主要是根據 [Administrative Templates (.admx)](https://www.microsoft.com/en-us/download/details.aspx?id=104593) 所提供的資訊，使用方式也非常簡單，從下圖就可以看出來，Group Policy Search 和 Group Policy Editor 兩者的階層是互相對應的。

![Group Policy Search 和 Group Policy Editor 的對照](https://i.imgur.com/0amAyZO.png)

在找到想要了解的 Group Policy 後，可以從右側資訊欄中看到更多關於此 Group Policy 所對應的 Registry 位置與說明，真的是非常方便！

![查詢結果](https://i.imgur.com/uGUSWyA.png)

---

參考資料：

* [How to find the Registry key for the corresponding Group Policy setting](https://www.thewindowsclub.com/find-the-registry-key-for-the-corresponding-group-policy-setting)
* [Group Policy Search (GPS) service](https://gpsearch.azurewebsites.net)
