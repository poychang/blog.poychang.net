---
layout: post
title: 使用 DosKey 簡化操作遠端 Docker 的指令
date: 2018-08-24 12:34
author: Poy Chang
comments: true
categories: [Container, Tools]
permalink: use-doskey-to-alias-docker-command/
---
其實這篇不僅僅可以用在 Docker，而是適用於各種*長指令*的情境，這裡的情境是使用 Docker 對遠端伺服器上的 Docker 做指令操作時，會透或 `-H` 的參數指定遠端伺服器，而這個參數值會讓指令變得很常，不好打之外又不好看，透過 DosKey 來簡化操作指令。

例如要執行像這樣的指令：

```powershell
docker -H=docker.server.com logs --tail 100 WebApp
```

這指令是要顯示遠端 `docker.server.com` 伺服器的 Docker 裡面的 WebApp 容器最後 100 行的 log，原本簡單的指令因為要加上 `-H` 變得要打很多字，而且變得很長，此時我們可以寫一個 cmd 指令檔如下：

```powershell
;= @echo off
;= rem Call DOSKEY and use this file as the macrofile
;= %SystemRoot%\system32\doskey /listsize=1000 /macrofile=%0%
;= rem In batch mode, jump to the end of the file
;= goto:eof
;= Add aliases below here
remote-docker=docker -H=docker.server.com $*
```

假設這個指令檔叫做 `docker-alias.cmd`，在終端機中執行完此指令檔後，我們的指令就可以改成如下：

```powershell
remote-docker logs --tail 100 WebApp
```

是不是變得易讀又簡單了。

## DosKey 指令介紹

透過呼叫 DosKey 來編輯終端機命令列，或者建立巨集。

指令詳解：

```powershell
DOSKEY [/REINSTALL] [/LISTSIZE=size] [/MACROS[:ALL | :exename]]
       [/HISTORY] [/INSERT | /OVERSTRIKE] [/EXENAME=exename] [/MACROFILE=filename]
       [macroname=[text]]
```

| 參數                  | 說明                                           |
| --------------------- | ---------------------------------------------- |
| `/REINSTALL`          | 安裝另一份 Doskey                              |
| `/LISTSIZE=size`      | 設定命令歷程緩衝區的大小                       |
| `/MACROS`             | 顯示所有的 Doskey 巨集                         |
| `/MACROS:ALL`         | 顯示所有執行檔中含有 Doskey 巨集的 Doskey 巨集 |
| `/MACROS:exename`     | 顯示指定的執行檔中的所有 Doskey 巨集           |
| `/HISTORY`            | 顯示存在記憶體中的所有命令                     |
| `/INSERT`             | 指定您所鍵入的新文字插入在舊的文字中           |
| `/OVERSTRIKE`         | 指定您所鍵入的新文字覆蓋舊的文字               |
| `/EXENAME=exename`    | 指定執行檔                                     |
| `/MACROFILE=filename` | 指定要安裝的巨集檔案                           |
| `macroname`           | 為您建立的巨集指定名稱                         |
| `text`                | 指定您要記錄的命令                             |

啟動 DosKey.exe 後，可以使用下列操作：

- 向上與向下鍵叫回以前的指令
- `ESC` 清除命令列
- `F7` 顯示命令歷程
- `ALT` + `F7` 清除命令列歷程
- `F8` 尋找命令歷程
- `F9` 以號碼選擇命令
- `ALT` + `F10` 清除巨集定義

以下是在 Doskey 巨集定義中的特殊碼：

- `$T` 命令分隔字元。允許在一個巨集中使用多個命令。
- `$1` - `$9` 批次檔參數。相當於批次檔中的 `%1` 到 `%9`。
- `$*` 這個符號代表在命令列中巨集名稱後的所有文字。

----------

參考資料：

* [BAT批次指令： DOSKEY　的功能介紹](http://forum.twbts.com/thread-10210-1-1.html)
* [How to set an alias in Windows Command Line?](https://superuser.com/questions/560519/how-to-set-an-alias-in-windows-command-line)
* [Microsoft Docs - Windows Commands](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/doskey?WT.mc_id=DT-MVP-5003022)
