---
layout: post
title: 在指定的程式下使用 AutoHotKey 執行快速鍵
date: 2021-02-02 00:12
author: Poy Chang
comments: true
categories: [Tools]
permalink: use-auto-hot-key-in-specific-program/
---

一直久聞 [AutoHotKey](https://www.autohotkey.com/) 的強大，但沒有真的下去玩玩看，最近遇到一些情境滿適合的，就稍微來研究看看這套使用 C++ 撰寫的自由軟體，看看他能否解決我所遇到的狀況。

## 簡介

[AutoHotKey](https://www.autohotkey.com/) 可以讓我們自訂各種快速鍵或巨集程式，來控制鍵盤和滑鼠的動作，藉由寫一隻副檔名為 `.ahk` 的指令檔，建立各種快速鍵，加速我們的操作。

有了 `.ahk` 指令檔，你可以直接執行該檔案來啟動 AutoHotKey，或者可以使用安裝目錄中 `Compiler` 資料夾下的 `Ahk2Exe.exe`，將指令檔封裝成一個可執行的 `.exe` 檔，讓你可以拿到沒有安裝 AutoHotKey 的電腦上執行。

常用的兩種基本模式：

- Hot String
- Hot Key

下面來看看幾個簡單範例。

## Hot String

Hot String 是輸入一組特定的文字，然後自動帶出完整文字，像是寫程式時常用的 Code Snippet 一樣。

```ahk
; Hot String 範例
:*:poy@::poypost@gmail.com
```

| 關鍵字                   | 觸發符號 | 說明                                                                            |
| ------------------------ | -------- | ------------------------------------------------------------------------------- |
| `:O:YOUR_HOT_STRING::`   | 空白     | `:O:` 表示必須按觸發符號以替換文字，但不輸出觸發符號；O 代表 Omit（忽略）的意思 |
| `:*:YOUR_HOT_STRING::`   | 無       | `:*:` 表示不需要觸發符號，完成輸入後立刻替換內容                                |
| `:B0:YOUR_HOT_STRING::`  | 空白     | `:B0:` 可取消 AutoHotkey 預設觸發後自動刪除關鍵字的功能                         |
| `:*B0:YOUR_HOT_STRING::` | 無       | 再多加一個星號就能不使用觸發符號，且不會多出一個空白                            |

>預設觸發符號可以是`空白鍵`、`Tab` 或 `Enter`。

## Hot Key

Hot Key 就是我們常聽到的快捷鍵，設定方式也很簡單，只是要先知道怎麼使用對應的特殊鍵，像是下面這個例子就是設定 `Ctrl` + `K` 這組快速鍵，當偵測到這組快速鍵的時候，就會執行 `Send` 這個命令，輸入 `Hello{Tab}World{Enter}{#}1` 字串，而這字串中夾雜了一些按鍵，例如 `{Tab}` 就是輸出 `Tab`、`{Enter}` 就是輸出 `Enter`（這段像是廢話...）。

要注意的是，當我們要輸出一些特殊符號像是 `#` 時，要用大括號包起來，也就是用 `{#}` 替代。

```ahk
^k::Send Hello{Tab}World{Enter}{#}1
```

| 特殊鍵 |                                                                      |
| ------ | -------------------------------------------------------------------- |
| `^`    | Ctrl 鍵                                                              |
| `!`    | Alt 鍵                                                               |
| `+`    | Shift 鍵                                                             |
| `#`    | Win 鍵                                                               |
| `&`    | 用 & 可組合兩個按鍵，例如：LButton & a 表示按左鈕不放，同時再按 a 鍵 |

| 按鍵                                  |                      |
| ------------------------------------- | -------------------- |
| `{Enter}`                             | Enter鍵              |
| `{Escape}` 或 `{Esc}`                 | Escape鍵             |
| `{Tab}`                               | Tab鍵                |
| `{Backspace}` 或 `{BS}`               | 倒退鍵               |
| `{Delete}`                            | 刪除鍵               |
| `{Insert}`                            | 插入鍵               |
| `{Up}`、`{Down}`、`{Left}`、`{Right}` | 方向鍵               |
| `{PgUp}`、`{PgDn}`                    | 換頁鍵               |
| `{CapsLock}`                          | 大寫鍵               |
| `{NumLock}`                           | 數字鎖定鍵           |
| `{Ctrl}`、`{LCtrl}`、`{RCtrl}`        | 控制鍵與左、右控制鍵 |
| `{Alt}`、`{LAlt}`、`{RAlt}`           | Alt鍵與左、右Alt鍵   |
| `{LButton}`、`{MButton}`、`{RButton}` | 滑鼠左、中、右鈕     |
| `{WheelDown}`、`{WheelUp}`            | 滑鼠滾輪向下與向上   |

## 在指定程式下運作

這裡就是我想要的重頭戲，主要有兩個功能：

1. 變數
2. 指定程式

下面範例建立了兩個變數，並用 `:=` 來設定該變數的值，並使用 `#IfWinActive` 這個標示出下面區塊的設定只會在 Notepad 這支程式下才生效。

`#IfWinActive` 會去檢查當前的視窗是否是你想要執行的目標視窗，那他是怎麼檢查的呢？他會根據你所設定的 [WinTitle](https://wyagd001.github.io/zh-cn/docs/misc/WinTitle.htm) 去檢查是否符合你設定的目標，常用 `ahk_class`（視窗類別，用此檢查視窗名稱）和 `ahk_exe`（程序名稱或路徑）來指定，參考列表如下：

| 參數      | 行為           |
| --------- | -------------- |
| A         | 當前視窗       |
| ahk_class | 視窗類別       |
| ahk_id    | 唯一的 ID/HWND |
| ahk_pid   | 程序 ID        |
| ahk_exe   | 程序名稱/路徑  |
| ahk_group | 視窗群組       |

這樣我們就可以寫出像下面這樣的指令碼：

```ahk
account:="MY_ACCOUNT"
password:="MY_PASSWORD"

#IfWinActive, ahk_class Notepad
^l::
    Send %account%{Tab}%password%{Tab}{Enter}
return
```

簡單說明一下，上面的指令碼建立了兩個變數，帳號和密碼，然後在特定的程式下（Notepad）可以使用 `Ctrl` + `L` 快速輸入 `%account%{Tab}%password%{Tab}{Enter}` 這個動作，也就是`輸入帳號` > `按 Tab 換到下個欄位` > `輸入密碼` > `按 Tab 換到下個按鈕` > `按 Enter 送出`。

## 其他

### 自動啟動

要設定開機自動啟動指定的 `.ahk` 的指令檔，只需要在下面這個資料夾中，將你的指令檔複製進去，或是在裡面建立指定檔的捷徑，這樣開機時就會自動啟動了。

`C:\Users\username\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

上述路徑記得將 `username` 改成你自己的帳戶名稱。

如果想要將指令檔放在其他地方管理，也可以建立一個捷徑，然後將捷徑放到上述資料夾中，這樣也可以達到開機自動啟動的效果。

### 測試

編輯指令檔後必須重新啟動或載入才有辦法測試，這邊我通常會從系統列中的 AutoHotKey 的圖示上按右鍵，執行 `Reload This Scrip` 來重新載入指令檔。

![Reload This Scrip](https://i.imgur.com/X6TuKAx.png)

----------

參考資料：

* [AutoHotkey 官方文件](https://www.autohotkey.com/docs/AutoHotkey.htm)
* [AutoHotkey 簡體中文文件](https://wyagd001.github.io/zh-cn/docs/AutoHotkey.htm)
* [輕鬆學會彈指神功－揭露AutoHotkey絕技](http://jdev.tw/blog/734/autohotkey-introduction-chinese)
