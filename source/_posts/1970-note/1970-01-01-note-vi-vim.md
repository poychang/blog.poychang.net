---
layout: post
title: vi 指令說明
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Tools]
permalink: note-vi-vim/
---

幾乎所有 Linux 系統都會內建 vi 文字編輯器，之於 Windows 就是 notepad 了，再不想安裝其他編輯器時，或臨時需要修改文件時，vi 絕對是你隨手可得的好幫手。

## vi 指令說明(簡易版)

vi 有兩個 mode ，command mode 與 insert mode 。平常一開啟 vi 時，我們是在 command mode，輸入時則要使用的是 insert mode ，而下特殊指令如複製和刪除則是採用 command mode 。

## Vim 入門圖解說明

<a href="https://i.imgur.com/0Shkhob.png" target="_blank">
  ![Vim Cheat Sheet](https://i.imgur.com/0Shkhob.png)
</a>

[Download PDF Version](https://1drv.ms/b/s!Aiwtjhj5fofriuAwNz7V4Cjro_d_bA)

參考來源：[給程式設計師的 Vim 入門圖解說明](http://blog.vgod.tw/2009/12/08/vim-cheat-sheet-for-programmers/)

### 進入 insert mode

由 command mode 進入 insert mode 有四個常用的指令: i ，a ，o ，跟 O 。

- `i` 是由游標的前面開始做 insert text 的動作
- `a` 是由游標的後面開始做 insert text 的動作
- `o` 則是在游標下方開啟新的一行來編輯
- `O` 是由游標的上方來開啟新的一行來編輯。結束一個編輯動作可以用 `Escap` 來回到 command mode ，此時可以做行動，刪除，複製，搜尋等編輯指令

### 移動游標

vi 的行動一般用上下左右鍵便可達到，然而它也有其自己的指令鍵：

- `h` : 向左移一個字元
- `j` : 向上移一個字元
- `k` : 向下移一個字元
- `l` : 向右移一個字元
- `0` : 移至行首
- `$` : 移至行尾

### 刪除指令

vi 的刪除指令有幾種，如下：

- `x` : 刪除游標上的字元
- `X` : 刪除游標的前一個字元
- `dd`: 刪除該行
- `dw`: 刪除游標所在之單字
- `d0`: 刪除自行首至游標所在之所有字元
- `d$`: 刪除自游標至行尾之所有字元

### 其他指令

vi 可以使用 `yy` 來將游標所在行存起來，然後將游標移至所要貼的行之處按 `p`，則剛才 mark 的行會被複製出現在游標之下。( 如果使用 `P` 則會出現在游標之上。)

在指令模式中，你可以在任何前面提到的指令前面加上大於零的數字 n，則你所做的動做將會被重覆 n 次，如要刪除十行可以按 `10 dd`，要複製十行可以用 `10 yy`，要將同樣的文字重覆寫十次可以用 `10 i`，然後離開 insert mode 之後就會將剩下的九次重覆寫出來。

在 command mode 要存入一個已寫好的檔案可以使用'ZZ' ，則它將會把你編好的檔案寫入後離開 vi .

在 vi 中搜尋一個字串可以使用 `/` ，在斜線後跟上你所要搜尋的字串，它就會找到你所要的字串，如要在搜尋相同字串按 `n` 即可。使用 `?` 來搜尋可以使 vi 往回找出你所需要的字串。

### ex 的指令

在 vi 中亦可使用 ex 的指令，只要在 command mode 時以冒號 `:` 做開頭，即可使用 ex 的指令。常用 ex 指令如下:

- `:l1 ，l2 d` 刪除自行 l1 至行 l2 的文字。
- `:l1 ，l2 s` /patern1/patern2/[g] 將自行 l1 至行 l2 的文字中，有 patern1 的字串改為 patern2 的字串，如無 g 則僅更換每一行所 match 的第一個字串。如有 g 則將每一個字串均做更換。
- `:l1 ，l2 co l3` 將自行 l1 至行 l2 的文字 copy 到行 l3 。
- `:l1 ，l2 mo l3` 將自行 l1 至行 l2 的文字 move 到行 l3 。
- `:w [file]` 將編輯的文字存入檔案中。
- `:n [file]` 引入下一個檔案。
- `:q` 離開

---

參考資料：

- [vi 指令說明(簡易版)](http://www2.nsysu.edu.tw/csmlab/unix/vi_simple.htm)
- [vi 指令說明(完整版)](http://www2.nsysu.edu.tw/csmlab/unix/vi_command.htm)
- [Wiki - vi](https://zh.wikipedia.org/wiki/Vi)
