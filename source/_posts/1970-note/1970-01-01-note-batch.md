---
layout: post
title: batch 指令筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Tools]
permalink: note-batch/
---

想要將指令集合起來並且自動化執行，批次檔絕對是你不可或缺的技能之一。

在 StackOverflow 上有個回答包含了很完整的批次檔樣板，[template.bat](https://stackoverflow.com/a/45070967/3803939)，可以從這個樣版上學到很多技巧，值得一看。

## 批次檔基本介紹與語法

將命令提示字元(Command Prompt)中輸入的指令集結起來，輸入在文字檔中，用以批次執行，稱之為批次(Batch file)檔。

**請注意！**命令提示字元預設的字碼頁為 ANSI/BIG5 編碼，因此檢視 UTF-8 編碼檔案時會出現亂碼，所以批次檔的編寫應盡量使用 ANSI 的編碼方式。

### 副檔名

預設有下面這 2 種，在 DOS 與 Windows 9x 時代副檔名為 `.bat`，在 Windows NT 之後則改用 `.cmd`，表示在視窗模式下的命令提示字元(`cmd.exe`)執行。

- bat
- cmd

### 註解方式

標準是使用 `rem`，大小寫沒差別，另外可使用 2 個冒號來當註解符號。

- `rem`
- `::`

### 顯示訊息

用來顯示訊息的指令是 `echo`，其後可加上字串或變數(可混搭)，在正常的情況下，批次檔中的每道指令執行前都會先出現螢幕上，使用 `echo off` 指令，就可以關閉顯示指令，通常在不需要互動的批次檔中都一定會出現。

```
@echo off
set /P myname=Please input your name:
echo Hello %myname%
echo.
echo Today is %date% %time%
pause
```

- 停止下達的指令顯示在螢幕上 => `echo off`
- 空一行 => `echo.`
- 顯示當前目錄 => `echo %cd%`
- 顯示日期 => `echo %date%`
- 顯示時間 => `echo %time%`

後面三個指令主要是使用 Windows 環境變數來輸出資訊。

### 判斷(if)

直接參考 `if /?`

### 暫停

- `pause` 程式暫停，提示按任意鍵繼續

```
echo This Program is running...
pause
```

- `timeout [/T | time]`，程式暫停指定的秒數

```
echo Please wait for a while...
timeout 6
```

### 回傳值

無論是在 Linux 下撰寫 shell script 或是在 Windows 下撰寫批次檔，最近一次程式執行的回傳值判斷，在撰寫工作自動化的 Script 檔時，是非常重要的技巧。

在 Windows 環境中的慣例是，若指令成功時傳回 `0`，若錯誤時，依據錯誤的狀況會傳回 1 或以上的值，代表不同的錯誤狀況。

但並非所有指令都會根據正確或錯誤而有不同的回傳值，要用來判斷前請先測試一下。

```
ping 168.95.192.1
echo %errorlevel%
REM 成功,回傳 1

ping 123.123.123.123
echo %errorlevel%
REM 失敗,回傳 0
```

### 命令列參數

假設在命令列鍵入了下列指令

```
test.cmd c:\windows\notepad.exe c:\windows\write.exe
```

此時批次檔內部自動將命令列上的參數視為特別的變數如下表：

<table class="table table-striped">
<thead>
  <tr>
    <th>%0 (命令)</th>
    <th>%1 (參數1)</th>
    <th>%2 (參數2)</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>test.cmd</td>
    <td>c:\windows\notepad.exe</td>
    <td>c:\windows\write.exe</td>
  </tr>
</tbody>
</table>

### 擴充字元參數

若在批次檔內的命令列參數加上擴充字元之後，可額外得知參數的許多資訊，請參考下表

<table class="table table-striped">
<thead>
  <tr>
    <th>%1</th>
    <th>%~d1 (取得磁碟機代號)</th>
    <th>%~p1 (取得路徑)</th>
    <th>%~n1 (取得檔名)</th>
    <th>%~x1 (取得副檔名)</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>c:\windows\notepad.exe</td>
    <td>c:</td>
    <td>\Windows\</td>
    <td>notepad	</td>
    <td>.exe</td>
  </tr>
</tbody>
</table>

### 跳行與結束程式

- `goto 標籤` (須定義標籤，標籤須單獨一行，並以冒號開頭，例如 `:header`)
- `goto :eof` (無須定義標籤，直接結束程式之意)
- `exit /b [回傳值]`

使用 `exit /b` 可停止批次檔或副程式的執行，若結束後需要提供回傳值讓 `if` 指令檢查 `errorlevel` 變數，可於其後面加上想要的回傳數值。

## 命令列特性

### 多行指令合併

要將分開多行的指令寫成一行，可利用 `&`

```
dir & pause
```

### 切換目錄：CD

- 路徑中含有空白字元時，請使用雙引號括起來

```
cd "\winnt\profiles\username\programs\start menu"
```

- 切換工作目錄至批次檔所在目錄

```
cd /d "%~dp0"
```

- 顯示目前工作目錄

```
echo %CD%
```

- 顯示目前磁碟機

```
echo %CD:~0,3%
```

### 黑洞：nul

一般用來將指令的正常訊息導向至黑洞 `nul`，使正常訊息不要顯示在螢幕上，然後配合判斷 `errorlevel` 或 `%errorlevel%` 變數，寫入 log 檔

```
ping 168.95.192.1 > nul
if errorlevel 1 echo ping target fail >> pinglog.txt
```

---

參考資料：

- [批次檔的精要學習手冊](https://www.gitbook.com/book/peterju/cmddoc)
- [How do I pass command line parameters to a batch file?](https://stackoverflow.com/questions/26551/how-do-i-pass-command-line-parameters-to-a-batch-file)
- [命令列的藝術](https://github.com/jlevy/the-art-of-command-line/blob/master/README-zh-Hant.md)
