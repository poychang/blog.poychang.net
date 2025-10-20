---
layout: post
title: 如何在檔案總管中預覽資料夾內的 SVG 檔
date: 2018-10-22 22:05
author: Poy Chang
comments: true
categories: [Tools]
permalink: preview-svg-thumbnails-in-in-windows-explorer/
---

最近在做投影片的時候，會大量用到 SVG 圖案，SVG 除了有檔案小的優勢，還具有可縮放的向量特性，不怕放大失真。不過在 Windows 的檔案總管中，只能支援檢視例如 JPG、PNG 等圖檔，遇到 SVG 預設就是顯示 IE 的圖示而不是預覽圖，有點小不方便。

>2019/04/06 Microsoft 官方推出了 [PowerToys](https://github.com/microsoft/PowerToys) 工具，提供了不少有趣的功能，其中一項就是在檔案總管中預覽 SVG 和 Markdown 文件，可以試用看看。

經過一番尋找，找到一個可用的套件，而且還是開源專案 [maphew/svg-explorer-extension](https://github.com/maphew/svg-explorer-extension)，安裝程式可以[從這裡下載](https://github.com/maphew/svg-explorer-extension/releases)。

在還沒有安裝之前，從檔案總管中看到的 SVG 預覽如下圖這樣，除非一個個點開，不會知道內容是什麼。

![安裝 svg-explorer-extension 之前](https://i.imgur.com/M5zEJ5t.png)

安裝之後就美美的了，可以直接看到該圖，超方便！

![安裝之後](https://i.imgur.com/nCAhYaH.png)

>經實際使用，Windows 10 可以正確顯示，但是如果是 OneDrive 裡面的 SVG 檔案，則無法正確顯示預覽圖，有點可惜。

## 如何安裝

[從這裡下載](https://github.com/maphew/svg-explorer-extension/releases)到安裝程式後，可以先直接安裝。

接著使用系統管理者開啟命令提示字元，然後依序執行下列指令：

```bash
TASKKILL /IM explorer* /F
DEL "%localappdata%\IconCache.db" /A
explorer.exe
```

執行的用途是為了強制關閉所有檔案總管 (explorer.exe) 的程序，然後清除預覽站存檔，再重新啟動檔案總管。

這樣就 OK 了！輕鬆寫意～繼續做簡報...

## 後記

如果沒有馬上生效，可以試著切換顯示方式，例如先用清單模式檢視，再換成大圖顯示，讓系統去重新製作縮圖，再不然就重開機看看。

---

參考資料：

- [How to get SVG thumbnails in Windows Explorer?](https://superuser.com/questions/342052/how-to-get-svg-thumbnails-in-windows-explorer)
- [maphew/svg-explorer-extension](https://github.com/maphew/svg-explorer-extension)
