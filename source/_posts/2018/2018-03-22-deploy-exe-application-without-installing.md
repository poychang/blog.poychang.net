---
layout: post
title: 在 Visual Studio 中發行不用安裝的 EXE 可執行檔
date: 2018-03-22 23:32
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Tools]
permalink: deploy-exe-application-without-installing/
---
Visual Studio 預設在發行 WPF 專案時，會幫你將專案封裝成可安裝檔，並幫你製作 ClickOnce 安裝精靈，方便你做發布。不過有時候只是做一個簡單的 WPF 桌面應用程式，只想要簡單傳給使用者使用，如果使用者使用時還要跑一段安裝步驟，就顯得相當多餘。

要取得不含 ClickOnce 安裝精靈的 EXE 可執行檔其實相當簡單，編譯後相關的執行檔案就在專案檔(`.csproj`)底下的 `bin\Debug` 資料夾裡面，這裡的輸出資料夾會跟你編譯時所使用的組態設定檔有關（這裡是使用 `Debug` 組態設定檔），接者你可以直接使執行裡面的 EXE 檔，結果會和你預想中的一樣，你可以將該資料夾壓縮起來直接傳給使用者執行即可。

另外，`bin\Debug` 資料夾內有幾個檔案你可以移除：

* `*.vshost.*` 都可以移除
	* `*.vshost.exe` 用於 Visual Studio 改善除錯效能
	* `.vshost.exe.manifest` 用於描述並隔離應用程式綁定的組件，例如 COM 元件，這些信息通常是存儲在系統登錄檔中的
* `.pdb` 程序數據庫文件（Program Database File）是用來保存偵錯狀態信息等
* `app.publish` 資料夾是給 ClickOnce 用的，所以可以移除

>使用 ClickOnce 安裝精靈有個好處，只要你的應用程式沒有特別去動用系統層級的設定或檔案，在安裝時使用者不需要有系統管理者權限也可以執行安裝。

## 後記

要做個單純的 EXE 執行檔的動作很簡單，只是總感覺直接從 Debug 資料夾取用檔案怪怪的，如果你也有這種感覺了話，編譯的時候組態檔換成 Release 吧。另外換成 Release 還有一個好處，就是在編譯的過程會做最佳化的動作，不過這對小型程式是沒啥差別啦 XD

----------

參考資料：

* [Best way to deploy Visual Studio application that can run without installing](https://stackoverflow.com/questions/16946173/best-way-to-deploy-visual-studio-application-that-can-run-without-installing)
* [Visual Studio 不生成.vshost.exe和.pdb文件的方法](http://blog.xieyc.com/vs-disable-create-vshost-exe-and-pdb-file/)

