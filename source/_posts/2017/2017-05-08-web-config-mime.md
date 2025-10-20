---
layout: post
title: 如何在 web.config 中設定 MIME
date: 2017-05-08 11:30
author: Poy Chang
comments: true
categories: [Develop]
permalink: web-config-mime/
---
IIS 中已經幫我們設定好基本的 MIME 類型，但總有些特殊的 MIME 必須我們手動加入，除了在 IIS 上，使用介面做新增外，我們可以透過設定 web.config 檔的方式，將應用程式所需要的 MIME 指定上去，這樣就不用一直去更新 IIS 了。

開啟 web.config 檔案後，一般來說 MIME 的設定是放在 `system.webServer` 節點中的 `staticContent` 裡面，加入 `mimeMap` 節點，並設定 `fileExtension` 和 `mimeType` 這兩個屬性即可。

加入後 web.config 程式碼如下（以 json 類型做示範）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <staticContent>
            <mimeMap fileExtension=".json" mimeType="application/json" />
        </staticContent>
    </system.webServer>
</configuration>
```

>常用的 MIME 類型可以參考[此連結](https://blog.poychang.net/note-mime-type/)

另外，為了避免 IIS 在根據你的 web.config 做設定的時候，出現類似`在唯一金錀屬性'value'設為'xxxx'的情況下，無法新增類型'add'的重複集合項目`的錯誤訊息，可以使用 `remove` 將該設定移除然後再新增，程式碼如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <staticContent>
            <remove fileExtension=".json" />
            <mimeMap fileExtension=".json" mimeType="application/json" />
        </staticContent>
    </system.webServer>
</configuration>
```

這樣可以防止重複新增 MIME 類型導致網站抱錯，如果你的網站不會出現此錯誤訊息，或者確定該 IIS 上沒有設定該屬性，那 `remove` 這個節點就不用加了。

----------

參考資料：

* [IIS 7.5/Win2008 R2 部署ASP.net Web Site問題集合](https://dotblogs.com.tw/shadow/archive/2011/06/17/28958.aspx)
* [如何快速查詢 web.config 中各項設定參數的預設值](https://blog.miniasp.com/post/2009/06/19/check-webconfig-default-settings-and-options-with-ease.aspx)