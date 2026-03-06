---
layout: post
title: FFmpeg 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-ffmpeg/
---

本篇作為書籤用途，紀錄網路上的 FFmpeg 參考資料。

## FFmpeg 簡介

[FFmpeg](https://ffmpeg.org/) 的全名是 Fast Forward MPEG (Moving Picture Experts Group)，是一個用 C 語言所撰寫的開源多媒體處理框架，可以用來將影音解碼、編碼、編碼轉換、混合、抽取、串流、過濾等功能，而且幾乎支援從古至今的任何影音格式。

## 如何選擇 FFmpeg 下載版本

GitHub 上的 [BtbN/FFmpeg-Builds](https://github.com/BtbN/FFmpeg-Builds) 提供多種 Windows 版本，名稱看起來複雜，但實際只要掌握三個選項就能選到正確版本。

### 版本分支：master vs n7.1 / n8.0

- master：每日自動編譯，功能最新，但偶爾不穩定。
- n7.1 / n8.0：對應 FFmpeg 官方穩定版，功能固定、較可靠。

一般使用者建議選擇 穩定版（n7.1 或 n8.0）；若需要測試最新功能，再額外下載 master。

### 授權：gpl vs lgpl

- gpl：包含 x264、x265、fdk-aac 等常用編碼器，功能最完整。
- lgpl：授權較寬鬆，但缺少部分編碼器。

大多數情況都建議選 gpl。

### 是否需要 shared

- non-shared（建議）：所有功能都在可執行檔內，解壓即可使用。
- shared：需要額外 DLL，通常只有在程式開發需要動態載入時才會用到。

### 建議下載組合

依一般 Windows 使用情境（轉檔、壓縮、搭配 yt-dlp），建議下載：ffmpeg-n7.1-latest-win64-gpl-7.1.zip

理由：

- 穩定版，適合長期使用與寫筆記
- 64 位元、完整編碼器
- 解壓即可使用，不需 DLL
- 與 yt-dlp 等工具相容性佳

若需要最新功能，可下載：ffmpeg-master-latest-win64-gpl.zip

## 多個音頻合併/擷取/拆分

1. 多個 MP3 合併成一個檔案

方法一：直接合併

```bash
ffmpeg64.exe -i "concat:123.mp3|124.mp3" -acodec copy output.mp3
```

* `-i` 代表輸入參數
  * `contact:123.mp3|124.mp3` 代表需要合併到一起的檔案，用 `|` 串聯
* `-acodec copy output.mp3` 重新編碼並複製到新檔案中

方法二：混音

```
ffmpeg64.exe -i 124.mp3 -i 123.mp3 -filter_complex amix=inputs=2:duration=first:dropout_transition=2 -f mp3 remix.mp3
```

* `-i` 代表輸入參數
* `-filter_complex` 使用 ffmpeg 濾鏡功能
  * `amix` 混合多個音頻到單個音頻輸出
  * `inputs=2` 代表 2 個音頻檔案
  * `duration` 確定最終輸出的檔案長度
  * `longest`(最常) | `shortest`（最短） | `first`（第一個檔案）
  * `dropout_transition` The transition time, in seconds, for volume renormalization when an input stream ends. The default value is 2 seconds.
* `-f mp3` 輸出檔案格式

1. 擷取音頻的指定時間部分

```bash
ffmpeg64.exe -i 124.mp3 -vn -acodec copy -ss 00:00:00 -t 00:01:32 output.mp3
```

* `-i` 代表輸入參數
* `-acodec copy output.mp3` 重新編碼並複製到新檔案中
* `-ss` 開始擷取的時間點
* `-t` 擷取音頻的時間長度

1. 音頻的格式轉換

```bash
ffmpeg64.exe -i null.ape -ar 44100 -ac 2 -ab 16k -vol 50 -f mp3 null.mp3
```

* `-i` 代表輸入參數
* `-acodec copy output.mp3` 重新編碼並複製到新檔案中
* `-acodec aac` 使用 AAC 編碼
* `-ar` 設定音頻採樣頻率
* `-ac` 設定音頻通道數
* `-ab` 設定音頻 bit rate
* `-vol` 設定音量百分比


---

參考資料：

- [FFmpeg](https://ffmpeg.org/)
