---
layout: post
title: 快速產生空的檔案
date: 2017-01-05 09:43
author: Poy Chang
comments: true
categories: [Tools]
permalink: create-large-empty-file/
---
測試檔案上傳、下載一定會需要測試用的檔案，以前我都隨手找個無關緊要的檔案作測試，但這樣常常搞得測試環境很髒亂（測試環境應該沒差吧...），但過年快到了，在幫測試環境大掃除的時候，真心覺得不應該隨便拿檔案來測試，因為我竟然在測試環境看到，別人拿`大學同學通訊錄.xlsx`來測試上傳功能，是準備要拜年嗎 XD

有時候我們不只是要測試上傳、下載功能，也有可能要做大檔傳輸的測試，這時候去哪找大檔呀，難不成拿電腦裡的壓箱寶來測嗎？

這裡提供兩種產生測試檔案的方式：

## 命令提示字元

在命令提示字元裡有個工具叫做 `fsutil`，可以產生指定大小的檔案，指令如下：

```bash
# fsutil file createnew <filename> <length>
$ fsutil file createnew TestFileName 1000
```

簡單輸入檔名和要產生的檔案長度（單位為 `bytes`，1000 = 1KB），就搞定了。

## 工具：Dummy File Creator

網路上也有免費的工具可以用，有介面操作更顯方便。Dummy File Creator 就是一款可以容易產生指定大小的空文件的工具。

官網位置：[http://www.mynikko.com/dummy/](http://www.mynikko.com/dummy/)

![Dummy File Creator](http://i.imgur.com/5nKvivd.png)

使用方法真的又簡單又直覺，英文也淺顯易懂，甚至可以輕鬆產出 GB 級的大檔案，是不是很值得收藏。

### 快速鍵

這款工具在操作上，設定了很多快速鍵，使用快速鍵操作的方式如下：

1. 開啟 Dummy File Creator
2. 輸入檔案大小
3. `alt` + `B` 選擇儲存檔案位置及名稱
4. `alt` + `R` 啟動隨機檔案大小
5. `alt` + `C` 產生檔案
6. `alt` + `X` 關閉程式

有了快速鍵，是不是變得很程序猿 XD

### 批次產生

如果要產生很多個檔案怎麼辦？產生一次輸入一次也太累了吧！這工具也提供批次產生，只要選擇 `Multiple Files` 然後選擇設定好的批次檔，就可以產生多筆檔案。

![Multiple Files](http://i.imgur.com/SWiba8y.png)

批次檔的範例如下：

![批次檔範例](http://i.imgur.com/hUlcJxL.png)

規則很簡單，像這樣 `FULL_FILENAME` `[tab]` `FILESIZE_IN_BYTES` `[tab]` `RANDOM_SWITCH` `[enter]`，注意中間是用 `tab` 做分隔。

如此一來就可以輕鬆產生多筆測試用的檔案了。

----------

參考資料：

* [Quickly create large file on a windows system?](http://stackoverflow.com/questions/982659/quickly-create-large-file-on-a-windows-system)