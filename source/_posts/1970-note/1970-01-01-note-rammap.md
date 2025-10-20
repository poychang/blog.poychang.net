---
layout: post
title: RAMMap 指令筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Tools]
permalink: note-rammap/
---

本篇作為筆記用途，記錄 RAMMap 參考資料。

# 下載位置

[https://docs.microsoft.com/en-us/sysinternals/downloads/rammap](https://docs.microsoft.com/en-us/sysinternals/downloads/rammap)

# 指令模式

```
Rammap [[outputfile]] | [[-run32] -o <inputfile.rmp>]]
```

- `outputfile` Has RAMMap dump scan output to a file and exit.
- `inputfile` Has RAMMap open the specified log file.

```
Rammap -E[wsmt0]
```

- `-Ew` Empty Working Sets
- `-Es` Empty System Working Sets
- `-Em` Empty Modified Page List
- `-Et` Empty Standby List
- `-E0` Empty Priority 0 Standby List

---

參考資料：

- []()
