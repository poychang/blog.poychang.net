---
layout: post
title: 推薦 Windows 使用者使用 Python Install Manager 管理 Python 版本
date: 2026-05-08 09:15
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: recommend-to-use-python-install-manager/
---

過去 Windows 使用者要使用 python.exe 通常會到 python.org 下載傳統安裝檔，或透過 Microsoft Store、Chocolatey、WinGet 等工具安裝，但這樣容易造成電腦同時存在多個 Python 版本，進而造成各種問題，例如不知道 `python` 到底指向哪一版、`py` 是新版還是舊版 launcher、`pip` 裝到哪個環境、PATH 是否被污染。現在 Python 官方檔案現在明確建議，Windows 使用者要從 CPython 團隊取得 Python，應使用 Python Install Manager。

## Python Install Manager 是什麼

Python Install Manager 可以視為 Windows 環境中新一代的 Python 安裝與版本管理入口。安裝後，會提供 `python`、`py`、`pymanager` 這幾個主要指令，並且會使用目前電腦上最新的 Python runtime 來執行。

所以，Python Install Manager 並不是一種套件管理器，它的目的不在於取代 `pip`、`uv`、`poetry`、`pipenv` 等指令。它主要的功能是管理 Python runtime，而不是專案相依套件。

強烈推薦使用 Python Install Manager 來安裝 Python，不僅是因為這是官方推薦的做法，而且這還能確保你在一般使用下會使用最新版本的 Python，避免了多版本共存帶來的混亂，如此一來就讓 `python` 指令的語意變得更穩定。

也就是說它解決了 Python runtime 層級的混亂問題：要安裝哪個版本、啟動哪個版本、列出哪些版本、移除哪些版本、如何避免舊版 launcher 與 PATH 衝突。

> 官方表示，Windows 版的 Python Install Manager 是主要的安裝與管理執行環境的工具，而傳統的可執行安裝程式將自 Python 3.16 版本起停止發行。

## 如何安裝

你可以從 Python Software Foundation 在 [GitHub 釋出的安裝檔](https://github.com/python/pymanager/releases)進行下載安裝，或是直接從 Microsoft Store 中找到 [Python Install Manager 應用程式](https://apps.microsoft.com/detail/9NQ7512CXL7T)進行安裝，或是使用 WinGet 安裝，執行指令為 `winget install 9NQ7512CXL7T`。

安裝完成後，可以手動透過 `py install --configure` 或 `pymanager install --configure` 啟動，過程中會檢查環境中的各種設定，例如會提示你需要移除舊版的 Python Lanucher 避免 `py` 指令衝突、檢查系統 `PATH` 變數、確認是否有安裝最新版的本的 Python。

## 使用情境

以下是常用的指令：

```bash
# 列出已安裝的 Python 版本
py list
# 列出線上可用的 Python 版本
py list --online
# 安裝指定的 Python 版本
py install 3.14
py install 3.13
# 指定 Python 版本執行指令
py -V:3.14 --version
# 移除指定的 Python 版本
py uninstall 3.13
# 移除所有 Python 版本
py uninstall --purge
```

建議的使用模式可以採用以下規則。

全域下使用 `py` 指令來管理 Python runtime，例如：

```bash
py list
py install 3.14
py uninstall 3.13
```

在專案內一律建立虛擬環境來使用：

```bash
py -V:3.14 -m venv .venv
.venv\Scripts\Activate.ps1
```

並且在安裝套件時，不直接使用 `pip`，而是改用 `python -m pip install <package>` 在目前環境中安裝套件，這樣能確保 `pip` 對應目前啟動的 Python，而不是 `PATH` 中其他版本的 `pip`。

## 什麼情境特別適合

Python Install Manager 特別適合以下 Windows 使用者：

- 同時維護多個 Python 專案。
- 需要測試 Python 3.12、3.13、3.14 等不同版本。
- 曾經遇過 python、py、pip 指向錯誤版本。
- 需要在 CI、開發機或教學環境中建立一致安裝流程。
- 想跟隨 Python 官方在 Windows 上的新安裝方向。

對一般使用者來說，它降低了第一次安裝 Python 的不確定性。對開發者來說，它讓 runtime 管理、版本切換、環境清理更集中。對團隊來說，它讓安裝流程更容易檔案化與自動化。

---

參考資料：

- [python/pymanager](https://github.com/python/pymanager)
- [Python install manager 26.1](https://www.python.org/downloads/release/pymanager-261/)