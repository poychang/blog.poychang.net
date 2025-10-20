---
layout: post
title: 偏好的 Visual Studio Code 設定檔
date: 2017-09-04 17:14
author: Poy Chang
comments: true
categories: [Tools]
permalink: my-vscode-config/
---

Visual Studio Code 提供了極大的彈性讓我們自訂想要的編輯器樣式，端看使用者設定（User Setting）中，就超過 800 項設定可以讓開發者自由調整，而且還有擴充套件能夠增強 VS Code 的開發能力。

> 這篇主要是我個人偏好的設定，完整 `setting.json` 請參考 [gist](https://gist.github.com/poychang/095621b4dfeb5cbd2b2ca210b0999be0)。

首先可以使用快速鍵 <kbd>Ctrl</kbd> + <kbd>,</kbd> 開啟 `settings.json` 使用者設定檔，或從選單列中點選`檔案` > `喜好設定` > `設定`。

## Global 常用設定

### editor

- `editor.fontFamily` 設定字型偏好
  - 唯一選擇 [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)
  - 連字符號字型可選擇 [FiraCode](https://github.com/tonsky/FiraCode) 或 [Hasklig](https://github.com/i-tu/Hasklig) 擇一使用(個人偏好 FiraCode)
  - 設定值：`"editor.fontFamily": "'Fira Code', 'Source Code Pro', Consolas, 'Microsoft JhengHei', 'Courier New', monospace",`
- `"editor.fontLigatures": true` 開啟連字符號
  - FiraCode 字型有提供連字符號的功能，例如 `=>` 會變成箭頭符號
- `"editor.formatOnSave": false` 存檔時不進行自動排版
  - 可用 `Alt` + `Shift` + `F` 手動執行自動排版
- `"editor.minimap.enabled": true` 在捲軸上開啟 MiniMap 功能
- `"editor.minimap.renderCharacters": false` MiniMap 不渲染實際字元
- `"editor.renderWhitespace": "boundary"` 顯示空白字元
- `"editor.renderIndentGuides": true` 顯示縮排線
- `"editor.wordWrap": "on"` 斷行顯示

### files

- `"files.autoSave": "onWindowChange"` 離開視窗焦點時自動儲存
- `"files.autoGuessEncoding": true` 猜測檔案編碼
  - 解決 VS Code 不支援判讀檔案是 ASCII 編碼的問題
- `"files.defaultLanguage": "markdown"` 設定預設文件語言類型
  - 想要把 VS Code 當作預設的 Markdown 編輯器，一定不能錯過這個設定
- `"files.insertFinalNewline": true` 新增一行作為檔案結束
  - 開發 Python 時建議開啟([PEP 8](https://www.python.org/dev/peps/pep-0008/#id21))

### others

- `"explorer.openEditors.visible": 0` 設定**已開啟的編輯器**預設是否顯示
  - 已經有「頁籤」可以看已開啟的檔案，用 `Ctrl+E` 也可以快速找檔案，這個功能想的多餘，建議設成 `0` 關閉他
- `terminal.integrated.shell.windows` 指定使用哪種終端機
  - CMD `"C:\\Windows\\sysnative\\cmd.exe"`
  - PowerShell `"C:\\Windows\\sysnative\\WindowsPowerShell\\v1.0\\powershell.exe"`
  - Bash on Ubuntu `"C:\\Windows\\sysnative\\bash.exe"`
- `"window.titleBarStyle": "custom"` 讓你的 VSCode 變得漂亮一點 :)

### git

- `"git.autofetch": true` 讓 VSCode 在背景自動執行 `git fetch`
- `"git.enableSmartCommit": true` 如果所有變更都還沒有 `git add` ( Stage ) 的話，預設會自動全部 Commit，不會再先問過
- `"git.confirmSync": false` 當要同步 Git 遠端儲存庫時，不需要再提問

### language

- `"typescript.referencesCodeLens.enabled": true` 開啟超好用的 TypeScript 專案 Code Review 工具，CodeLens
- `"typescript.updateImportsOnFileMove.enabled": "always"` 當檔案移動時，自動更新匯入的路徑
- `"tslint.enable": true` 開啟 TS-Lint
- `"tslint.autoFixOnSave": true` 自動修復所有能修復的 TSLint 問題
- `"html.suggest.angular1": false`
- `"html.suggest.ionic": false`
  - 不寫 AngularJS 1.x 與 Ionic 的人，建議可以把內建的 Code Snippets 關閉。

### extension

- `"prettier.singleQuote": true` 這是使用 Prettier 擴充套件一定要設定的

## Workspace 常用設定

我們也可以針對工作目錄下做額外的設定

- `files.exclude` 排除指定檔案
  - `.spec` 是前端專案常見的測試檔，可藉此設定暫時隱藏，讓工作目錄乾淨一些
  - 設定值：`"files.exclude": { "**/*.spec.*": true },`

## Code Snippet

自訂程式碼片段（snippet）能夠幫助我們在寫程式時，快速產生程式碼，加速寫程式的速度。

- Windows 版，自訂程式碼片段的功能位置：`檔案` > `喜好設定` > `使用者程式碼片段`
  - 自訂程式碼片段會放在 `C:\Users\12258\AppData\Roaming\Code\User\snippets`
- Mac 版，自訂程式碼片段的功能位置：`Code` > `喜好設定` > `使用者程式碼片段`

程式碼基本架構如下：

```json
"程式碼片段名稱": {
  "prefix": "程式碼片段的縮寫",
  "body": [
    "程式碼片段內容",
    "（使用 $1 表示插入後游彪停留的位置）"
  ],
  "description": "描述程式碼片段的用途"
}
```

> 官方說明文件請參考[Creating your own Snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets)。

---

參考資料：

- [Visual Studio Code User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings)
- [Customize VS Code - Vedio](https://code.visualstudio.com/docs/introvideos/configure)
- [Will 保哥的 VSCode 使用者設定檔](https://gist.github.com/doggy8088/6539a140f28924d3a1f053a8d3a9f49e)
