---
layout: post
title: Selenium 操作筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Tools]
permalink: note-selenium/
---

在大數據時代中的工程師，一定要學會爬蟲這項技能，透過學習 Selenium 模擬瀏覽器的工具，不僅可以在浩瀚的網際網路中，爬到所需要的數據，更可以學會如何做 E2E 測試，一舉多得。

## 簡介

Selenium 是為瀏覽器自動化（Browser Automation）需求所設計的一套工具集合，讓程式可以直接驅動瀏覽器進行各種網站操作。

許多 Web Test Framework，都是以 Selenium API 作為基礎，藉此操作網頁表單資料、點選按鈕或連結、取得網頁內容並進行檢驗。

Selenium 2.0 帶來 WebDriver 的實作，Selenium WebDriver API 支援 Java、C#、Ruby、Python 及 Perl 等多種語言，而且帶來跨越不同瀏覽器的自動化操作，目前 [WebDriver API](http://www.w3.org/TR/webdriver/) 規範已提交 W3C，若能夠被標準化且在各大瀏覽器實作，執行跨瀏覽器的自動化測試工作將會被簡化許多。

常見的 Web Driver：

- [Mozilla GeckoDriver](https://github.com/mozilla/geckodriver/)
- [Google Chrome Driver](https://sites.google.com/a/chromium.org/chromedriver/)
- [SafariDriver](https://webkit.org/blog/6900/webdriver-support-in-safari-10/)
- [Microsoft Edge Driver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)
- [更多](http://www.seleniumhq.org/download/#thirdPartyDrivers)

## 安裝 & 環境設定

- 安裝 Chocolatey，Windows 的套件管理器
  _ [https://chocolatey.org/](https://chocolatey.org/)
  _ 安裝方法請參考([網頁連結](https://chocolatey.org/install))
- 安裝 Python
  _ `choco install python`
  _ 完成後確認系統環境變數 `path` 是否有將 Pyhon 安裝目錄加進去
  _ 重開機，確認載入新的環境變數
  _ 執行 `python --version` 確認版本
- 安裝 Selenium
  _ [http://www.seleniumhq.org/](http://www.seleniumhq.org/)
  _ 以 Python 作為主要開發的語言 \* `pip install -U selenium`
- 安裝 Web Driver
  _ [https://sites.google.com/a/chromium.org/chromedriver/](https://sites.google.com/a/chromium.org/chromedriver/)
  _ 以 Google Chrome Driver 作為主要測試的瀏覽器

## 設定 IDE 開發環境

使用 [Visual Studio Code](https://code.visualstudio.com/) 做為開發工具

- 建議安裝的 Visual Studio Code 套件
  _ [Python](https://marketplace.visualstudio.com/items?itemName=donjayamanne.python)
  _ [MagicPython](https://marketplace.visualstudio.com/items?itemName=magicstack.MagicPython)
- 設定偵錯
  _ `Ctrl`+`Shift`+`P` 選擇 `Tasks: Configure Task Runner`
  _ 在 `.vscode` 資料夾中建立 `tasks.json` 內容如下
  `{ // See https://go.microsoft.com/fwlink/?LinkId=733558 // for the documentation about the tasks.json format "version": "0.1.0", "command": "python", "isShellCommand": true, "args": ["${file}"], "showOutput": "always" }`

        * `Ctrl`+`Shift`+`B` 來執行程式，結果會輸出於下方
        * 也可開啟偵錯模式進行偵錯

> [PyCharm](https://www.jetbrains.com/pycharm/) 也是一款強大的開發 Python 的 IDE 工具

---

參考資料：

- [使用 Visual Studio Code 作為開發環境](https://oranwind.org/python-vscode/)
- [使用 Selenium 在 Google Chrome 瀏覽器](http://jialin128.pixnet.net/blog/post/114056630-%5Bpython%5D--%E4%BD%BF%E7%94%A8selenium%E5%9C%A8google-chrome%E7%80%8F%E8%A6%BD%E5%99%A8)
- [Python 爬蟲新手筆記](http://pala.tw/python-web-crawler/)
- Selenium 介紹影片
  _ [Selenium Test Automation: Practical Tips & Tricks - with Dave Haeffner](https://www.youtube.com/watch?v=cIevkkD_LB4)
  _ [Selenium Test Automation: Practical Tips & Tricks - with Dave Haeffner (Part 2)](https://www.youtube.com/watch?v=w0pYTX2t0pg)
