---
layout: post
title: 修改 VSCode 預設的程式碼高亮樣式
date: 2021-01-18 12:10
author: Poy Chang
comments: true
categories: [Tools]
permalink: edit-default-dark-theme-for-visual-studio-code/
---

Visual Studio Code 的功能相當強大，也是我平時拿來寫筆記、寫文件的工具之一，但他預設的程式碼高亮在 Markdown 文件有個小問題，就是沒有將斜體標上顏色，所以這篇打算來修改一下 VSCode 預設的程式碼高亮樣式。

![修改前樣式](https://i.imgur.com/LcQ02Xj.png)

修改之前 VSCode 的 Dark 樣式會像這樣，對 Markdown 的斜體沒有標上顏色，這讓閱讀或編寫的時候，會不容易識別。我們來修改他吧！

首先，VSCode 內建的樣式檔放在這裡：

```
C:\users\{username}\AppData\Local\Programs\Microsoft VS Code\resources\app\extensions\theme-defaults\themes
```

上述路徑中的 `{username}` 修改成你的使用者名稱，接著開啟 Visual Studio Code 內建的樣式檔 `dark_vs.json` 進行修改。

下圖我們可以看到在 `markup.bold` 是有標上顏色的，但是 `markup.italic` 卻沒有加上顏色，所以造成 Markdown 在使用 `*標註斜體*` 這寫法時，不會出現程式碼高亮效果。

![修改前](https://i.imgur.com/z8dUN80.png)

這邊我們將 `markup.italic` 補上顏色：

```json
// 略...
{
    "scope": "markup.italic",
    "settings": {
        "fontStyle": "italic",
        "foreground": "#569cd6"
    }
},
```

修改完後，重新啟動 VSCode 就會重新載入樣式檔，這樣我們用預設的 VSCode 樣式來看 Markdown 檔就漂亮多了。

![修改後樣式](https://i.imgur.com/EgBfuLr.png)

當然裡面你還可以根據你自己的需要適度地做調整，如果改很大，就自己另外[開發一個樣式套件](https://code.visualstudio.com/docs/getstarted/themes#_creating-your-own-color-theme)吧！

----------

參考資料：

* [How to edit default dark theme for Visual Studio Code?](https://stackoverflow.com/questions/35165362/how-to-edit-default-dark-theme-for-visual-studio-code)
* [Visual Studio Code- Color Themes](https://code.visualstudio.com/docs/getstarted/themes)
