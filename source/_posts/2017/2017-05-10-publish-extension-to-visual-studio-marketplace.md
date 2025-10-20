---
layout: post
title: 發行擴充套件至 Extension Marketplace
date: 2017-05-10 22:13
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: publish-extension-to-visual-studio-marketplace/
---
在[建立了 VS Code 擴充套件](../build-vscode-extension/)後，你可以選擇發行至官方的 [Extension Marketplace](https://marketplace.visualstudio.com)，或者封裝成 `.vsix` 做分享，本篇就來介紹發行擴充套件至 Extension Marketplace 的動作。

## 安裝

首先你的環境必須要有 [Node.js](https://nodejs.org/en/)，然後執行下列指令安裝 `vsce` 工具：

```bash
npm install -g vsce
```

## 產生 Personal Access Tokens

Extension Marketplace 上的擴充套件是透過 Visual Studio Team Services 來做認證和管理的，因此要發佈前必須先在 Visual Studio Team Services 上建立一個 Personal Access Tokens。

首先你必須要有 Visual Studio Team Services 帳號（可以參考[這篇文件](https://www.visualstudio.com/zh-tw/docs/setup-admin/team-services/sign-up-for-visual-studio-team-services)建立），例如 `poycode.visualstudio.com`，登入後點選右上角的選項然後選擇 `Security`（如下圖），會進入安全性設定頁面。

![進入安全性設定](http://i.imgur.com/gc7SAvx.png)

在 `Personal Access Tokens` 選單中點選 `Add` 新增一個 Token。

![選擇新增 Token](http://i.imgur.com/ymh6XZ4.png)

接著請輸入該 Token 的描述及有效期。

>要注意 `Accounts` 欄位要選擇 `All accessible accounts`，然後 `Authorized Scopes` 要選擇 `All scopes`，這樣才能順利使用。

![新增 Token](http://i.imgur.com/gmDKr6d.png)

完成後，畫面會顯示這次建立的 Personal Access Token，**請注意！**此 Token 只會顯示這一次，請妥善保存！

## 建立發行者

我們必須建立一個 Extension Marketplace 的發行者，指令如下：

```
vsce create-publisher (publisher name)
```

建立的過程中，會提示你輸入對應的 Token 作為驗證。

>這動作也可以在這裡 [https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage) 建立，然後再從本機透過 `vsce login (publisher name)` 來登入。

## 執行發行

如果都設定好了，可以使用下列指令執行發行：

```bash
vsce publish
```

發行成功了話會有下圖的訊息。

![發行成功](http://i.imgur.com/BgQfveD.png)

發行時要注意 `package.json` 裡面的 `version` 版號要更新，不然會報錯如下圖。

![版本重複](http://i.imgur.com/Bdxnnzm.png)

因此 `vsce` 有一個自動增加版號的指令，搭配[語意化版本](http://semver.org/lang/zh-TW/)，摘要如下：

1. **主版號 major**：當你做了不相容的 API 修改
2. **次版號 minor**：當你做了向下相容的功能性新增
3. **修訂號 patch**：當你做了向下相容的問題修正

這樣就可以在發行的時候使用 `vsce publish minor` 來自動增加次版號，依此類推。

如果想要手動指定板號，也可以用 `vsce publish 1.0.1` 將發行的板號改成 `1.0.1` 

## 封裝

如果不想要發佈到 Extension Marketplace，只想要留在自己本機自己使用了話，可以執行 `vsce package` 將寫好的擴充套件封裝成 `.vsix` 檔，當然，你也可以將此封裝檔分享給你的朋友們。

在 Visual Studio Code 中如何手動安裝 `.vsix` 檔，可以參考此段官方文件 [Install from a VSIX](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)。

## 上架囉！

完成上面一系列的動作，你就可以從 [Extension Marketplace](https://marketplace.visualstudio.com) 搜尋到你的擴充套件囉！

![擴充套件上架圖](http://i.imgur.com/cV14NIN.png)

這篇發行的擴充套件包在此 [PoyChang Extension Pack](https://marketplace.visualstudio.com/items?itemName=PoyChang.poychang-extension-pack)，有興趣的朋友們可以下載來看看。

----------

參考資料：

* [Publishing Extensions](https://code.visualstudio.com/docs/extensions/publish-extension)
