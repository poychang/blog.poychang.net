---
layout: post
title: Visual Studio 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Tools]
permalink: note-visual-studio/
---

本篇作為書籤用途，記錄網路上的 Visual Studio 相關資訊

## 維持 Visual Studio 2019 跑得又快又好的技巧

1. 載入方案時不要重新開啟文件
   - 預設可能會開啟大量文件，會拖慢整體載入速度。
   - 工具 > 選項 > 專案和方案 > 一般 > 在解決方案載入時重新開啟文件
2. 載入方案時不要還原專案階層狀態
   - 這會記憶大量狀態，且每個都需要還原，因次可以設定預設不還原專案階層狀態。
   - 工具 > 選項 > 專案和方案 > 一般 > 還原解決方案載入上的方案總管專案階層狀態
![載入方案時不要重新開啟文件及還原專案階層狀態](https://i.imgur.com/ZpFQU3w.png)
3. 預設關閉所有不需要的工具窗格
   - 因為有許多窗格預設就會開啟 (Team Explorer, Error, Output, ...) 且無法設定預設關閉，所以可安裝 [Reset Tool Windows](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.ResetToolWindow) 擴充套件，它會在 VS 開啟時自動關閉這些一定會被開啟的工具窗格，節省載入時間。
   - 工具 > 選項 > 環境 > 啟動 > Reset Tool Window
![預設隱藏所有不需要的工具窗格](https://i.imgur.com/nFt25tj.png)

## 快捷鍵

<table class="table table-striped">
<thead>
  <tr>
    <th>快速鍵</th>
    <th>說明</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><kbd>Ctrl</kbd> + <kbd>]</kbd> , <kbd>S</kbd></td>
    <td>可快速跳到 Solution Explorer 該檔的所在位置</td>
  </tr>
  <tr>
    <td><kbd>Alt</kbd> + <kbd>上下的方向鍵</kbd></td>
    <td>快速將程式碼上、下搬動</td>
  </tr>
  <tr>
    <td><kbd>Ctrl</kbd> + <kbd>K</kbd>, <kbd>D</kbd></td>
    <td>格式化文件</td>
  </tr>
  <tr>
    <td><kbd>Ctrl</kbd> + <kbd>Space</kbd></td>
    <td>IntelliSense 程式碼自動完成</td>
  </tr>
  <tr>
    <td><kbd>Ctrl</kbd> + <kbd>K</kbd>, <kbd>C</kbd></td>
    <td>註解程式碼</td>
  </tr>
  <tr>
    <td><kbd>Ctrl</kbd> + <kbd>K</kbd>, <kbd>U</kbd></td>
    <td>取消註解程式碼</td>
  </tr>
  <tr>
    <td><kbd>Ctrl</kbd> + <kbd>R</kbd>, <kbd>R</kbd></td>
    <td>重新命名</td>
  </tr>
  <tr>
    <td><kbd>F9</kbd></td>
    <td>移至定義設定中斷點</td>
  </tr>
  <tr>
    <td><kbd>F12</kbd></td>
    <td>移至定義</td>
  </tr>
  <tr>
    <td><kbd>Ctrl</kbd> + <kbd>F12</kbd></td>
    <td>移至實作</td>
  </tr>
  <tr>
    <td><kbd>Ctrl</kbd> + <kbd>-</kbd></td>
    <td>搭配 `F12` 移至定義，此為返回至原位置</td>
  </tr>
  <tr>
    <td><kbd>F8</kbd></td>
    <td>移至下一個錯誤位置</td>
  </tr>
  <tr>
    <td><kbd>Shift</kbd> + <kbd>Delete</kbd></td>
    <td>刪除整行</td>
  </tr>
  <tr>
    <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + Click</td>
    <td>選取多個游標位置</td>
  </tr>
</tbody>
</table>

## 必裝套件

- [Visual Studio Spell Checker](https://marketplace.visualstudio.com/items?itemName=EWoodruff.VisualStudioSpellCheckerVS2017andLater)
  - 檢查程式碼英文拼寫是否正確
  - [介紹文](https://blog.poychang.net/visual-studio-spell-checker/)
- [GitLineCodeLens](https://marketplace.visualstudio.com/items?itemName=jotting89.GitLineCodeLens)
  - 在該行程式碼的後面顯示最後一次修改該行程式碼的 Commit 訊息

## 關注套件

- [Whack Whack Terminal](https://marketplace.visualstudio.com/items?itemName=DanielGriffen.WhackWhackTerminal)
  - 終端機模擬器，讓你可以在 Visual Studio 中開啟各種終端機，如 command prompt、powershell、WSL bash
  - 快速鍵 `Ctrl` + `\`, `Ctrl` + `\`
- [BuiltinCmd](https://marketplace.visualstudio.com/items?itemName=lkytal.BuiltinCmd)
  - 終端機模擬器
  - 快速鍵 `Ctrl` + `Shift` + `T`
- [CodeMaid](https://marketplace.visualstudio.com/items?itemName=SteveCadwallader.CodeMaid)
  - 自動程式排版，快速鍵 `Ctrl` + `M`, `空白鍵`
  _ 檢視各個 Method 的循環複雜度
- [Web Essentials](http://vswebessentials.com/)
  - Web Essentials 是增強 Visual Studio 在 Web、CSS、JavaScript 開發上的方便性
  - 再加裝 [Web Extension Pack](https://visualstudiogallery.msdn.microsoft.com/f3b504c6-0095-42f1-a989-51d5fc2a8459?SRC=Home) 裡面包含很多好用的工具
  - Browser Sync for Visual Studio 可以使用 `CTRL` + `Alt` + `Enter` 來啟動
- [C# Essentials](https://visualstudiogallery.msdn.microsoft.com/a4445ad0-f97c-41f9-a148-eae225dcc8a5)
- [SideWaffle Templates for Visual Studio 2015](http://sidewaffle.com/)
- [Productivity Power Tools](https://visualstudiogallery.msdn.microsoft.com/d0d33361-18e2-46c0-8ff2-4adea1e34fef)
  - 可以取代已經不維護的 VSCommands for Visual Studio
- [Developer Assistant](https://visualstudiogallery.msdn.microsoft.com/a1166718-a2d9-4a48-a5fd-504ff4ad1b65)
  - 寫程式時，IntelliSense 列出 Method 外，還會列出 Sample Code
- [tangible T4 Editor 2.3.0 plus modeling tools](http://t4-editor.tangible-engineering.com/T4-Editor-Visual-T4-Editing.html)
  - 程式碼產生器編輯器
- [Force UTF8](https://visualstudiogallery.msdn.microsoft.com/d94a3ad9-0549-4641-89b7-d858407bd6e9)
  - 存檔時自動轉 UTF8 with BOM
- [Snippet Designer](https://github.com/mmanela/SnippetDesigner)
  - 用更人性化的方式管理我們常用的或內建的 Code Snippet 程式碼片段
- [Glyphfriend](https://visualstudiogallery.msdn.microsoft.com/5fd24afb-b3b2-4cec-9b03-1cfcec6123aa?SRC=Home)
  - 讓 Intellisense 顯示方便辨識的圖示
- [JavaScript Snippet Pack](https://visualstudiogallery.msdn.microsoft.com/423eb4a3-215f-4a8f-9287-1512618ffda3?SRC=Home)
  - JavaScript 的 Code Snippet
- [Macros for Visual Studio ](https://marketplace.visualstudio.com/items?itemName=VisualStudioPlatformTeam.MacrosforVisualStudio)
  - [介紹文](http://demo.tc/post/833#.WGomoFFb9cM.facebook)
  - 由於巨集腳本沒有同步功能，建議參考介紹文的設定，透過 OneDrive 同步
- [Snippet Designer](https://marketplace.visualstudio.com/items?itemName=vs-publisher-2795.SnippetDesigner)
  - 自己寫一個 Code Snippets Template 來產生自己要的程式碼區段
  - [介紹文 - Code Snippets 產生常用程式碼 Template](http://limitedcode.blogspot.tw/2015/10/visual-studio-code-snippetstemplate.html)
- [Output Enhancer](https://marketplace.visualstudio.com/items?itemName=NikolayBalakin.Outputenhancer)
  - 幫你的輸出內容加上顏色，方便閱讀

## 圖示描述

[類別檢視和物件瀏覽器圖示](https://msdn.microsoft.com/zh-tw/library/y47ychfe.aspx)

Visual Studio 2017 完整的 Icon 圖示請[下載此連結的 PDF 檔案](https://docs.microsoft.com/en-us/visualstudio/designers/the-visual-studio-image-library?WT.mc_id=DT-MVP-5003022)

[類別檢視] 和 [物件瀏覽器] 會顯示代表程式碼實體 (Entity) 的圖示，例如：命名空間 (Namespace)、類別 (Class)、函式和變數。下表說明這些圖示：

![Visual Studio 圖示描述](http://i.imgur.com/GkxBvNG.jpg)

在方案總管中識別版本控制項目狀態：

![Visual Studio 版控項目狀態的圖示描述](https://i.imgur.com/Ghc8EmI.png)

## 輕量型載入

[官方文件](https://docs.microsoft.com/zh-tw/visualstudio/ide/optimize-visual-studio-startup-time?WT.mc_id=DT-MVP-5003022)提到 Visual Studio 2017 15.5 版和更新版本不再提供這項功能。

Visual Studio 2017 的方案屬性頁中，有個`輕量型載入`的選項，可以讓你在開啟方案時，不用一次把底下所有的專案都開啟

![輕量型載入](http://i.imgur.com/kpWaP6S.png)

等到你真的要開啟該專案的時候，才會真的去載入專案，藉此可以加快開啟方案的速度

![開啟專案時](http://i.imgur.com/W6LATdB.png)

## 關閉 npm 套件自動還原

當使用 Visual Studio 開啟前端專案的時候，Visual Studio 會很貼心的自動幫你把 bower 和 npm 套件自動還原，不過這些套件通常都很多，下載安裝會需要一段時間，如果你想要關閉這個行為了話，可以參考下面步驟：

1. 工具列上的 [工具] > [選項]
2. [專案和方案] > [Web Package Management] > [套件還原]
3. 將 [在專案開啟時還原] 改成 `false` (參考下圖)

![套件還原](https://i.imgur.com/xRgrLqI.png)

## NuGet

Source: https://api.nuget.org/v3/index.json
API: https://www.nuget.org/api/v2/

### NuGet 設定 Proxy

REF: [NuGet Behind Proxy](https://stackoverflow.com/questions/9232160/nuget-behind-proxy)

使用 NuGet.exe 來設定，指令如下：

```bash
nuget.exe config -set http_proxy=http://my.proxy.address:port
nuget.exe config -set http_proxy.user=mydomain\myUserName
nuget.exe config -set http_proxy.password=mySuperSecretPassword
```

> 如果需要設定帳號、密碼，需要用指令來加入，因為此方式會將密碼加密。

所執行的相關設定會儲存至 `C:\Users\{username}\AppData\Roaming\NuGet\NuGet.Config` 檔案中，當然你也可以直接修改該設定檔，只要加入以下設定：

```xml
<configuration>
    <config>
        <add key="http_proxy" value="http://my.proxy.address:port" />
    </config>
</configuration>
```

上述的路徑會是全域的，如果只想針對某個專案或方案來設定，可以再該資料夾下加入 `NuGet.Config` 檔案即可。

> 設定完成後，要重新開啟 Visual Studio 使其設定生效。

---

參考資料：

- [維持 Visual Studio 2019 跑得又快又好的技巧](#維持-visual-studio-2019-跑得又快又好的技巧)
- [快捷鍵](#快捷鍵)
- [必裝套件](#必裝套件)
- [關注套件](#關注套件)
- [圖示描述](#圖示描述)
- [輕量型載入](#輕量型載入)
- [關閉 npm 套件自動還原](#關閉-npm-套件自動還原)
- [NuGet](#nuget)
  - [NuGet 設定 Proxy](#nuget-設定-proxy)
