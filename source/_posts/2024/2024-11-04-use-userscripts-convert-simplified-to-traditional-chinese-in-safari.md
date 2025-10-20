---
layout: post
title: 在行動裝置的 Safari 中自動執行簡體轉繁體
date: 2024-11-04 15:53
author: Poy Chang
comments: true
categories: [Javascript]
permalink: use-userscripts-convert-simplified-to-traditional-chinese-in-safari/
---

在行動裝置的 Safari 瀏覽器中，有時候會遇到簡體中文的網頁，這時候如果你是繁體中文的使用者，可能會覺得閱讀起來不是很親切，這時候你可以透過使用 Userscripts 搭配本篇所提供的 Script，讓瀏覽器自動幫你轉換簡體中文為繁體中文。

如果你是使用桌面版的 Microsoft Edge、Google Chrome 和 Firefox 瀏覽器，我會推薦你使用[新同文堂](https://github.com/tongwentang/tongwentang-extension)擴充套件，非常的方便好用。

不過如果是要在**行動裝置**的 Safari 瀏覽器上進行簡繁轉換，就沒有現成的擴充套件可以使用了。這時候就可以使用 [Userscripts](https://apps.apple.com/tw/app/userscripts/id1463298887) 來達成，這套開源的 Safari 指令碼管理工具，使用方式跟 [Tampermonkey](https://www.tampermonkey.net/) 差不多，在網頁開啟時去執行特定的指令碼，進行我們額外想要執行的動作。

> 這裡所提供的 Script 同樣可以用在 Tampermonkey 上。

這裡我借用新同文堂背後所使用的字詞轉換字典，[TongWen Dict](https://github.com/tongwentang/tongwen-dict)，在開啟網頁的時候，透過 Userscripts 去取得該字典，並進行網頁內容的簡繁轉換。

以下是我所提供的 Userscripts 範例程式碼：

```javascript
// ==UserScript==
// @name         簡繁轉換
// @description  將網站中的簡體字詞轉換成繁體字詞
// @license      MIT
// @author       Poy Chang
// @homepage     https://blog.poychang.net
// @version      0.2.4
// @updateURL    https://raw.githubusercontent.com/poychang/userscripts/main/src/convert-to-zhtw.user.js
// @match        *://*/*
// @exclude      http://*.tw/*
// @exclude      https://*.tw/*
// 更多關於簡繁轉換的資料可以參考同文堂所提供的資料：https://github.com/tongwentang/tongwen-dict
// ==/UserScript==

let s2tChar = {};
let s2tPhrase = {};
// 使用同文堂 v1.0.1 版的轉換字典
const url = (filename) =>
    `https://www.unpkg.com/tongwen-dict@1.0.1/dist/${filename}`;
const loadDict = () =>
    fetch(url("manifest.json"))
        .then((res) => res.json())
        // 取得 manifest.json 中所提供的檔案列表，僅取得 s2t （簡轉繁）的字典
        .then((manifest) =>
            Promise.all(
                manifest.dicts
                    .filter((d) => d.min)
                    .filter((d) => d.filename.substring(0, 3) === "s2t")
                    .map((d) => url(d.filename))
            )
        )
        // 將取得的 URL 所回傳的 json 資料，並且保存到 s2tChar 和 s2tPhrase
        .then((urls) =>
            Promise.all(urls.map((url) => fetch(url).then((res) => res.json())))
        )
        .then(([s2t_char, s2t_phrase]) => {
            s2tChar = s2t_char;
            s2tPhrase = s2t_phrase;
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });

// 詞彙轉換
function toTrad(itxt) {
    var txt = "",
        s = "",
        bol = true,
        leng = 5;
    for (var i = 0, c = itxt.length; i < c; ) {
        bol = true;
        for (var j = leng; j > 1; j--) {
            s = itxt.substr(i, j);
            if (s in s2tPhrase) {
                txt += s2tPhrase[s];
                i += j;
                bol = false;
                break;
            }
        }

        if (bol) {
            s = itxt.substr(i, 1);
            txt += s in s2tChar ? s2tChar[s] : s;
            i++;
        }
    }
    if (txt != "") itxt = txt;

    return itxt;
}

function convert(node) {
    var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    var textNode;
    while ((textNode = treeWalker.nextNode())) {
        // console.log(textNode.nodeValue)
        textNode.nodeValue = toTrad(textNode.nodeValue);
    }
}

(function () {
    "use strict";
    loadDict().then(() => {
        convert(window.document.body);

        const callback = (mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (
                    mutation.type == "childList" &&
                    mutation.addedNodes.length > 0
                ) {
                    Array.from(mutation.addedNodes).find((node) => {
                        convert(node);
                    });
                }
            });
        };
        const observer = new MutationObserver(callback);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
```

> 本篇完整範例程式碼請參考 [poychang/userscripts](https://github.com/poychang/userscripts/blob/main/src/convert-to-zhtw.user.js)。

## 使用方式

1. 安裝 [Userscripts](https://apps.apple.com/tw/app/userscripts/id1463298887) 應用程式
2. 開啟 Userscripts，點擊 `Set Userscripts Directory` 設定 Userscripts 所使用的資料夾
3. 打開 iPhone 的 `Setting` > `Apps` > `Safari` > `Extensions` > `Userscripts`，啟用此擴充套件並將權限設定成允許存取所有網站
4. 之後點選 Safari 網址列左邊的小圖示，裡面的選單就會有 `Userscripts`
5. 使用 Safari [開啟上面的指令碼檔案](https://raw.githubusercontent.com/poychang/userscripts/main/src/convert-to-zhtw.user.js)（你也可以用下載的方式存到 Userscripts 所使用的資料夾中），然後點選網址列左邊的小圖示裡面的 `Userscripts` 選單，就會出現安裝指令碼的選項
    ![安裝指令碼](https://i.imgur.com/e4dqEfw.png)

> 由於我已經安裝過了，所以會變成 `Tap to re-install`，如果你是第一次安裝，會是 `Tap to install`。

這樣就可以在 Safari 瀏覽器上，自動將網頁中的簡體字詞轉換成繁體字詞了。

## 後記

這裡要再一次感謝新同文堂的開發者們，提供了這麼好用的字詞轉換字典，讓我可以開心的完成這個指令碼，輕鬆的進行簡繁轉換。

---

參考資料：

* [Mobile Safari 簡繁轉換](https://scott0228.blogspot.com/2022/01/mobile-safari.html)
* [App Store - Userscripts](https://apps.apple.com/tw/app/userscripts/id1463298887)
* [GitHub - Userscripts](https://github.com/quoid/userscripts)
* [GitHub - TongWen Dict](https://github.com/tongwentang/tongwen-dict)
