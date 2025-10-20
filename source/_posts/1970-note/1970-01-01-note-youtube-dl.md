---
layout: post
title: yt-dlp 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Tools]
permalink: note-youtube-dl/
---

本篇作為書籤用途，記錄網路上的 yt-dlp 相關資訊

## yt-dlp

從 GitHub 下載 [yt-dlp](https://github.com/yt-dlp/yt-dlp)，建議也下載 ffmpeg 和 ffprobe （可以從[這裡](https://github.com/BtbN/FFmpeg-Builds/releases)下載建置好的可執行檔），並加入 Windows 的環境變數 `Path` 中，使之可以直接下指令呼叫。

其他網路上的教學資訊：

- [yt-dlp指令使用教學，萬能Youtube影片命令列下載工具](https://ivonblog.com/posts/yt-dlp-usage/)

### 使用登入的的 Cookie 來下載影片

這個方式常用於下載需要帳號密碼的影片，例如 YouTube 上的私人影片，使用上有三種方式：

1. 使用互動方式輸入密碼：`yt-dlp -u XXXXXXX@gmail.com https://www.youtube.com/watch?v=XXXXXXXX`
2. 套用瀏覽器的 Cookie：`yt-dlp --cookies-from-browser chrome https://www.youtube.com/watch?v=XXXXXXXX`
3. 套用 Cookie 檔案：`yt-dlp --cookies ./cookies.txt chrome https://www.youtube.com/watch?v=XXXXXXXX`

一般來說，使用第 2 種是較為便利的。

### 輸出成指定格式

有時候高解析度的影片，可能不是 MP4 的格式，如果系統中有 ffmpeg 了話，可以使用 `--merge-output-format` 參數，在下載完影片和音檔的後期，進行合併的動作，並轉呈指定的影片格式，使用方式 `yt-dlp https://www.youtube.com/watch?v=XXXXXXXX --merge-output-format mp4`

### 指定畫質和音訊品質

使用方式 `yt-dlp https://www.youtube.com/watch?v=XXXXXXXX --format "bestvideo[height<=1440]+bestaudio[ext=m4a]"`

詳細資訊請參考 yt-dlp 官方說明的 [FORMAT SELECTION](https://github.com/yt-dlp/yt-dlp#format-selection) 段落。

## youtube-dl

- youtube-dl 網站 [youtube-dl.org](https://youtube-dl.org/)
- youtube-dl GitHub [ytdl-org/youtube-dl](https://github.com/ytdl-org/youtube-dl)

### 支援下載的清單

詳請參考 [Supported sites](https://ytdl-org.github.io/youtube-dl/supportedsites.html)

以下列出幾個常見的支援下載的網站：

- YouTube
- Pluralsight
- Vimeo

### 指令 - YouTube

直接下載

```
youtube-dl https://www.youtube.com/watch?v=XXXXXXXXXXX
```

查詢影片可支援的畫質清單，注意有些格式是只有純影片或純聲音

```
youtube-dl -F https://www.youtube.com/watch?v=XXXXXXXXXXX
```

上述指令找到 `format code` 後，使用下列指令下載指定的畫質影片

```
youtube-dl -f 137 https://www.youtube.com/watch?v=XXXXXXXXXXX
```

下載成音樂，`--audio-format` 指定輸出格式，可選值：`best`、`aac`、`flac`、`mp3`、`m4a`、`opus`、`vorbis` 和 `wav`，預設值為 `best`

```
youtube-dl -x --audio-format mp3 https://www.youtube.com/watch?v=XXXXXXXXXXX
```

參考資料：

- [用 youtube-dl 優雅下載 YouTube 影片](https://junyussh.github.io/p/use-youtube-dl-to-download-videos/)

### 指令 - Pluralsight

使用下列指令，修改以下參數：

- [USERNAME] 帳號
- [PASSWORD] 密碼
- [C:/下載位置] 儲存位置
- [PLURALSIGHT_COURSES_URL] 課程網址

```
youtube-dl --username "[USERNAME]" --password "[PASSWORD]" -o "[C:/下載位置]/%(playlist)s/%(chapter_number)s - %(chapter)s/%(playlist_index)s - %(title)s.%(ext)s" --min-sleep-interval 30 --max-sleep-interval 60 [PLURALSIGHT_COURSES_URL] --playlist-start 1
```

參考資料：

- [Download courses from learning sites](https://gist.github.com/poychang/74a1ab546a765f341c4b07c7f8cd5149)

----------

參考資料：

* []()
