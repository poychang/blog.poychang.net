---
layout: post
title: Node.js 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Develop]
---

本篇作為筆記用途，記錄 Node.js 參考資料

## 設定 npm init 預設值

npm 會使用你家目錄下的 `~/.npmrc` 檔案內容作為預設初始化的設定，你也可以使用 `npm config` 指令來設定，如下：

```bash
npm config set init-author-name "Poy Chang"
npm config set init-license "MIT"
```

初始化 npm 專案請使用 `npm init`，若想要全部套用預設值，可使用 `npm -y` 指令。

---

參考資料：

- [Change Default NPM License](https://jaketrent.com/post/change-default-npm-license/)
