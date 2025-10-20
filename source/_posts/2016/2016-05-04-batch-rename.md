---
layout: post
title: 使用 batch 批次修改檔案名稱（更名工具）
date: 2016-05-4 14:46
author: Poy Chang
comments: true
categories: [Develop]
permalink: batch-rename/
---

在 Windows 中整理檔案名稱的時候，可以將要修改的檔案全選，按 `F2` ，或滑鼠右鍵選擇`重新命名`，使用批次命名，快速將修改檔案名稱，並且在後面加上序號。

但上面的處理方式，個人覺得有點醜陋，下面這段批次程式碼，可以把檔名變成看起來比較順眼的 `001.jpg`, `002.jpg`, `010.jpg`, `011.jpg` ...等。這裡有[完整程式碼](code)。

```bash
@echo off
setlocal EnableDelayedExpansion
set i=0
rem 依序重新命名
for %%a in (*.jpg) do (
    set /a i+=1
    ren "%%a" "!i!.new"
)
ren *.new *.jpg

rem 針對一位數的 jpg 檔前面補 2 個 0
for /F %%G in ('dir /b ?.jpg') do ( ren %%G 00%%G )
rem 針對二位數的 jpg 檔前面補 1 個 0
for /F %%G in ('dir /b ??.jpg') do ( ren %%G 0%%G )
```

第一段，依序重新命名，會將該資料夾內的 `jpg` 檔案重新命名為，如：`1.jpg`, `2.jpg`, `10.jpg`, `11.jpg` ...等。

第二段則是利用一些檔名規則，去做補零的動作，如果需要 4 位數的補零，則修改成下面一段程式碼，即可。

```bash
rem 針對一位數的 jpg 檔前面補 3 個 0
for /F %%G in ('dir /b ?.jpg') do ( ren %%G 000%%G )
rem 針對二位數的 jpg 檔前面補 2 個 0
for /F %%G in ('dir /b ??.jpg') do ( ren %%G 00%%G )
rem 針對三位數的 jpg 檔前面補 1 個 0
for /F %%G in ('dir /b ???.jpg') do ( ren %%G 0%%G )
```

## 完整程式碼

<script src="https://gist.github.com/poychang/aacfd0742e2ac0b351154a29f85b629c.js"></script>

## 後記

發現一個小工具程式也滿好用的，[ReNamer](http://www.den4b.com/?x=products&product=renamer)，可以使用介面去控制你的命名規則，而且免費板就超好用，可以收藏 :)

----------

參考資料：

* [使用 awk sprintf 修改 檔案名稱](http://blog.longwin.com.tw/2009/04/awk-sprintf-mv-rename-filename-2009/)
