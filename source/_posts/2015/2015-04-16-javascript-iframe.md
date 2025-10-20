---
layout: post
title: 使用 JS 根據內容來自動調整 iframe 高度
date: 2015-04-16 11:30
author: Poy Chang
comments: true
categories: [Develop, Javascript]
permalink: javascript-iframe/
---

有些時候我們會使用 iframe 來嵌入其他頁面，但 iframe 的高度無法根據內容來自動擴展，這時候我們可以使用下面的方法 Javascript 來讓 iframe 自動調整高度。

## 方法一︰

先加入iframe的語法。（Ex︰A.html）

```html
 <iframe src="./sourcePage.html" name="mainframe" id="mainframe"
    width="100%" marginwidth="0" marginheight="0" scrolling="No" frameborder="0">
</iframe> 
```

在到欲連結的網頁（Ex︰sourcePage.html）裡，在 head 下面加入以下程式碼

```html
<head>
    <script>
        function resize() {
        parent.document.getElementById("mainframe").height = document.body.scrollHeight; //將子頁面高度傳到父頁面框架
    }
    </script>
</head>
```

最後在body（Ex︰sourcePage.html）裡加入︰

```html
<body onload="resize();">
```

## 方法二︰

在同一個檔案內編寫就可以了。

```html
<script type="text/javascript">
function SetCwinHeight() {
    var iframeid = document.getElementById("mainframe"); //iframe id  
    if (document.getElementById) {
        if (iframeid && !window.opera) {
            if (iframeid.contentDocument && iframeid.contentDocument.body.offsetHeight) {
                iframeid.height = iframeid.contentDocument.body.offsetHeight;
            } else if (iframeid.Document && iframeid.Document.body.scrollHeight) {
                iframeid.height = iframeid.Document.body.scrollHeight;
            }
        }
    }
}
</script>
```

再加入iframe的語法。

```html
<iframe src="./sourcePage.html" name="mainframe" id="mainframe"
    width="100%" marginwidth="0" marginheight="0"
    scrolling="No" frameborder="0"
    onload="Javascript:SetCwinHeight()">
</iframe>
```
