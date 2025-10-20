---
layout: post
title: 製作 Visual Studio Code 擴充套件包
date: 2017-05-11 01:22
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: build-vscode-extension/
---
在官方還沒有提供同步設定檔與套件的功能前，可以透過 [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync) 擴充套件來做同步，最近學習到一種做法，是將推薦的套件包成一個擴充套件包，之後只要安裝這一個套件，其他的也會一起裝起來，感覺超棒的！

## 推薦擴充套件

在團隊開發的時候，你可能常聽到：「你用的是甚麼套件呀？好酷唷！」，然後分享教學就開始了。

在 VS Code 中按下 `ctrl` + `shift` + `P` 開啟 `command palette`，輸入 `Configure Recommended Extensions (Workspace)`，這個指令可以在專案資料夾中建立用來推薦擴充套件的 `extensions.json` 檔。 

![Recommended Extensions](http://i.imgur.com/P1oPmYQ.png)

`extensions.json` 這個檔案內容範例如下：

```json
{
    "recommendations": [
        "Angular.ng-template",
        "abusaidm.html-snippets",
        "msjsdiag.debugger-for-chrome"
    ]
}
```

我們只要維護 `recommendations` 中的套件識別名稱，而該套件的識別名稱可以從下圖中找到：

![套件識別名稱](http://i.imgur.com/hGrRk5a.png)

>例如 `Angular Language Service` 的套件識別名稱就是 `Angular.ng-template`。

這樣其他隊友就可以在該專案中，使用 `Show Workspace Recommended Extensions` 顯示推薦套件了。

## 建立擴充套件包

### 安裝並建立專案

首先你的環境必須要有 [Node.js](https://nodejs.org/en/)，然後執行下列指令安裝 `yeoman` 工具以及擴充套件範本：

```bash
npm install -g yo generator-code
```

接者就可以執行 `yo code` 來產生擴充套件的專案範本了。

![擴充套件範本清單](http://i.imgur.com/sweluaQ.png)

這裡我們選擇第一項 `New Extension Pack`，然後填寫下列問題：

* 是否加入現有套件
* 擴充套件的名稱
* 擴充套件識別名稱，這也會是你專案資料夾名稱
* 專案描述
* 發行者名稱（建立發行者請參考[這篇](../publish-extension-to-visual-studio-marketplace/)）
* 是否建立 Git 版控

![填寫專案描述](http://i.imgur.com/2cVoHU8.png)

### 修改相依套件

擴充套件包範本的檔案少少的，就只有 5 個檔案而已。

![範本檔案架構](http://i.imgur.com/JTcJaAA.png)

這些檔案中最主要是 `package.json`，我們透過修改他的 `extensionDependencies` 內容，把要相依的套件識別名稱加進去就 OK 了，跟上面加入推薦套件的方式很像。

另外，這動作會在之後安裝此套件包的時候，將相依的套件一併做安裝，但請注意這**會因為相依而無法停用、移除**那些擴充套件。

所以如果不是必裝的套件，建議還是用推薦套件的方式，會比較適合。

### 加入 Icon

擴充套件當然要有個漂亮的 Icon 囉，接著你可以在 `package.json` 中增加一個 `icon` 的屬性，然後指向 Icon 圖片的位置即可，這樣該套件就會有你專屬的 Icon了，參考下圖。

![Demo package.json](http://i.imgur.com/YM5VUKK.png)

OK！這樣其實就大功告成了，後續發布和封裝的動作，請參考這篇[發行擴充套件至 Extension Marketplace](../publish-extension-to-visual-studio-marketplace/)。

## 後記

我有把我自己在用的擴充套件包放在 Github 上面，[poychang/poychang-extension-pack](https://github.com/poychang/poychang-extension-pack)，有興趣的朋友們可以下載來看看。

----------

參考資料：

* [Extension Authoring Example - Hello World](https://code.visualstudio.com/docs/extensions/example-hello-world)
* [Workspace Recommended Extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions)
* [五個 Visual Studio Code 的實用工具與技巧 - Editor 編輯者 #9](https://www.youtube.com/watch?v=zzon9KS90Dk)
