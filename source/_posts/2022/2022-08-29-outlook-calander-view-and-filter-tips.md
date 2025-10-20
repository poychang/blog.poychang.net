---
layout: post
title: Outlook 的行事曆使用小技巧
date: 2022-08-29 12:00
author: Poy Chang
comments: true
categories: [SQL, Tools]
permalink: outlook-calander-view-and-filter-tips/
---

Outlook 這套工具不用多作介紹，這篇主要在分享使用 Outlook 行事曆時，一些個人覺得好用但又不容易被發現的使用技巧。

## 顯示行事曆區間

Outlook 行事曆預設可以使用日、工作日、周、月的區間來顯示行事曆，這可以在上方的 View 選單中做點選。

![預設可以使用日、工作日、周、月的區間](https://i.imgur.com/M8ZeL7E.png)

不過有時候這些區間可能和我們想關注的時間區間不同，這時候可以在左側日曆中，用滑鼠去點選區間，就可以改變行事曆的顯示區間。

例如只要顯示某連續三天的行事曆，就可以在日曆中點選連續三天的區間，這樣就可以顯示連續三天的行事曆，如下圖：

![在日曆上用滑鼠選取要顯示的區間](https://i.imgur.com/ZZ5c7kb.png)

## 用類別來顏色標記重要會議和約會

預設行事曆上每個會議和約會都是使用同一個顏色顯示，我們可以使用類別來顏色標記重要的會議和約會，如下圖：

![在會議和約會上按滑鼠右鍵標記顏色](https://i.imgur.com/qmoSBsF.png)

你也可以自訂該顏色的名稱（或意義），也可以設定快捷鍵，方便你直接用鍵盤快速標記顏色，如下圖的設定：

![設定顏色、文字、快捷鍵](https://i.imgur.com/yOK8LNS.png)

## 自訂顯示內容

當行事曆上充滿著團隊的動態時，很容易把自己的會議和約會掩埋在行事曆上，這時候可以自訂行事曆上的顯示內容。

首先在 `Change View` 下點選 `Manage Views`，如下圖：

![在 Change View 下點選 Manage Views](https://i.imgur.com/nBEOxVG.png)

接著新增一個 View，如下圖：

![新增一個 View](https://i.imgur.com/CQAWHuY.png)

在 View 的過濾條件中，我們可以設定只顯示指定的類別，或使用其他設定來篩選出你想要顯示的內容，如下圖：

![在條件中設定過濾，只顯示指定的類別](https://i.imgur.com/67YwmzD.png)

我這裡會在基本條件設定完之後，使用 SQL 來微調過濾條件，這邊所指的 SQL　其實背後是用　DASL 查詢語法，如下圖：

![使用 SQL 的方式來設定過濾條件](https://i.imgur.com/2OjmOPk.png)

以我個人來說，會使用下面這段 SQL 只會顯示行事曆主旨有 `Poy` 關鍵字，以及另外三個類別的會議和約會：

```SQL
(
"http://schemas.microsoft.com/mapi/proptag/0x0037001f" LIKE '%Poy%' OR
"urn:schemas-microsoft-com:office:office#Keywords" = 'Work From Home' OR
"urn:schemas-microsoft-com:office:office#Keywords" = '放假/請假' OR
"urn:schemas-microsoft-com:office:office#Keywords" = '注意！'
)
```

另外，下面這兩個也是推薦使用的過濾條件，可以將`必須出席`和`列席`的會議邀請，以及`需要回覆邀請`的會議顯示出來，個人覺得相當實用：

```SQL
(
"urn:schemas:httpmail:displayto" LIKE '%Poy%' OR
"urn:schemas:httpmail:displaycc" LIKE '%Poy%' OR
"http://schemas.microsoft.com/mapi/response_requested" = 1
)
```

再來，時間一久，行事曆上的資訊越來越滿的時候，會想要將一些不需要關注的項目在視線中移除，這時候我會特別做一個 `不顯示` 的類別，然後設定在另一個段落，專門處理指定不想顯示的會議和約會，：

```SQL
(
-- 這邊放要顯示的過濾條件
-- 略...
) AND
(
-- 這邊放要不顯示的過濾條件
"urn:schemas-microsoft-com:office:office#Keywords" != '不顯示'
)
```

最後，當你要切換檢視的 View 時，只要在 `Change View` 選擇你自訂好的 View，就可以只顯示你關注的內容，呈現結果如下圖：

![呈現結果](https://i.imgur.com/0EzQBOA.png)

----------

參考資料：

* [Finding DASL Property Names](http://philliphoff.github.io/finding-dasl-property-names/)
