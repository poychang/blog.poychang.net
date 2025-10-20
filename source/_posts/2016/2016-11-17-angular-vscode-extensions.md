---
layout: post
title: 推薦開發 Angular 的 VS Code 擴充套件
date: 2016-11-17 10:22
author: Poy Chang
comments: true
categories: [Javascript, Angular, Develop, Tools]
permalink: angular-vscode-extensions/
---

[台灣 AngularJS 社群](https://www.facebook.com/groups/Angular2.tw/)於 2016/10/19 舉辦的小聚時，看到好多神奇的擴充套件，[保哥](http://blog.miniasp.com)更發起了[開發 Angular 2 必備 VSCode 擴充套件](https://paper.dropbox.com/doc/-Angular-2-VSCode--Kh2w3saOyZtJSHawFoBem)的共筆，讓各位先進們一同分享好用的擴充套件。內文為共筆的備份。

## 開發 Angular 2 必備 VSCode 擴充套件

* [Angular v4 TypeScript Snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)
    * [ [GitHub](https://github.com/johnpapa/vscode-angular-snippets) ]
    * 開發 Angular 2 的時候經常有許多**語法糖**，對初學者來說經常會打錯，有了這些 Code Snippets 就可以降低打錯字的機會。
* [Auto Import](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport)
    * [ [GitHub](https://github.com/soates/Auto-Import) ]
    * 在開發 TypeScript 的時候由於會經常用到 ES2015 的 import 語法匯入另一個模組的型別，透過 Auto Import 可以將許多型別自動化載入，大幅縮短開發時間。
* [TypeScript Import Assistance](https://marketplace.visualstudio.com/items?itemName=Sammons.ts-import-assistance)
    * [ [GitHub](https://github.com/Sammons/ts-import-assistance) ]
    * 有些專案中的 TypeScript 型別透過 [Auto Import](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport) 無法自動解析時，用這個套件幾乎都可以正確解析。
    * 使用方法：在尚未 import 的變數上按下 Ctrl-Shift-P 之後輸入 Resolve and import symbol 就可以自動匯入完成。
* [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
    * [ [GitHub](https://github.com/ChristianKohler/PathIntellisense) ]
    * 只要是在程式碼中輸入「路徑」或「檔名」時，會自動提供輸入建議，並且有路徑檔名的自動完成功能，可以少打一些字。
* [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
    * [ [GitHub](https://github.com/editorconfig/editorconfig-vscode) ]
    * 統一程式碼撰寫的排版格式，適合運用在多人開發上，有些人習慣 tab 縮排，有些則習慣 space 縮排，或是斷行類型( CRLF or LF )的設定，或著當存檔的時候最後一行要留空白，以及檔案的編碼類型、縮排的單位大小、把多餘的空白移除…等相關設定，改善程式碼排版的一致性並有效提升程式碼可讀性。
    * 透過 Angular CLI 進行專案開發時，會有預設的 editorcofig 的設定檔，檔名為 .editorconfig，因此套件安裝完成之後 reload window 立即生效，設定方式可[參考連結](http://editorconfig.org/#overview)
* [Relative Path](https://marketplace.visualstudio.com/items?itemName=jakob101.RelativePath)
    * [ [GitHub](https://github.com/jakob101/RelativePath) ]
    * 有時資料夾結構深，要Import時路徑可能會很多層，這個套件只要用`Ctrl+Shift+H` (Mac: `Cmd+Shift+H`) ，直接輸入檔名關鍵字，會以當前的檔案位置，直接將該檔案相對路徑加入。
* [AngularDoc for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=AngularDoc.angulardoc-vscode&showReviewDialog=true) 
    * Visual Studio Code版本的Augury. 
    * - Full integration of [angular-cli](https://github.com/angular/angular-cli) generate commands (e.g. `ng g component`) on the explorer's context menu
    * - Automatic metadata submission & synchronization to [angulardoc.io](http://angulardoc.io/) for analysis
    * - "AngularDoc" editor for visualizing the architecture, classes, modules, routes, and imports.

## 個人覺得好用的擴充套件

* VS Color Picker
* Quokka.js
* Code Spellchecker

如果想要製作屬於自己的 Visual Studio Code 擴充套件包，可以參考這篇[文章](../build-vscode-extension/)。

----------

參考資料：

* [The Will Will Web - 如何用Visual Studio Code 開發AngularJS 應用程式](http://blog.miniasp.com/post/2015/06/07/Using-Visual-Studio-Code-with-AngularJS.aspx)
* [黑暗執行緒 - 使用Visual Studio Code開發Angular 2專案](http://blog.darkthread.net/post-2016-09-16-vscode-ng2-tutorial.aspx)
