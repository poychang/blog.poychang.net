---
layout: post
title: youtube-dl 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Tools]
---

本篇作為書籤用途，記錄網路上的 youtube-dl 相關資訊

- youtube-dl 網站 [youtube-dl.org](https://youtube-dl.org/)
- youtube-dl GitHub [ytdl-org/youtube-dl](https://github.com/ytdl-org/youtube-dl)

## 支援下載的清單

詳請參考 [Supported sites](https://ytdl-org.github.io/youtube-dl/supportedsites.html)

以下列出幾個常見的支援下載的網站：

- YouTube
- Pluralsight
- Vimeo

## 指令

### YouTube

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

### Pluralsight

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
