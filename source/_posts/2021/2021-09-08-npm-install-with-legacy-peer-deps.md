---
layout: post
title: 安裝 NPM 套件時使用 --legacy-peer-deps 解決套件相依性問題
date: 2021-09-08 00:15
author: Poy Chang
comments: true
categories: [Typescript, Javascript]
permalink: npm-install-with-legacy-peer-deps/
---

NPM v7 預設會安裝 `peerDependencies`，這可能會導致有些套件出現相依性問題，這時可以在 `npm install` 的時候加上 `--legacy-peer-deps` 參數來解決，這篇來了解一下為什麼會發生這問題。

>如果你是使用 NPM v3 到 v6 的版本，應該不會出現這問題，因為預設不自動執行安裝 `peerDependencies` 套件，而是將擴充套件各自相依的套件安裝在各自的目標資料夾中。

## 甚麼是 peerDependencies

我們在 `package.json` 中應該都看過 `dependencies` 和 `devDependencies` 這兩種設定相依套件的屬性，分別是用於專案相依和開發階段相依的套件，但實際上 NPM 有以下 5 種相依到件的設定：

- [dependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies) 相依套件
- [devDependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#devdependencies) 開發階段套件
- [peerDependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#peerdependencies) 對等套件
- [bundledDependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bundleddependencies) 綑綁套件
- [optionalDependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#optionaldependencies) 可選套件

`bundledDependencies` 是用於發布套件時要綑綁的套件，藉此在執行 `npm pack` 的時候，將相關的套件綑綁在一個封裝中。

`optionalDependencies` 則是可選的套件，當你安裝套件時如果該套件不存在，就會跳過這個套件而不會發生錯誤。

而 `peerDependencies` 會用在當多個對等（或稱平行）的套件都需要同一個套件時，就可以透過此屬性來設定套件的相依套件。

在舉例之前，先定義一下兩個名詞，擴充套件（plugin）是專案所需要的外掛功能，而擴充套件本身需要另一個套件（package）來實作。有了這樣的定義，後續的說明會比較容易理解。

舉個例子，當我們有個專案需要 plugin1 和 plugin2 兩個擴充套件時，我們可以使用 `npm install` 來進行安裝，而這兩個擴充套件都相依於 packageA 這個套件，此時下載安裝後的 `node_modules` 結構會長得像這樣：

```
├── Project
│   └── node_modules
│       ├── packageA
│       ├── plugin1
│       │   └── nodule_modules
│       │       └── packageA
│       └── plugin2
│       │   └── nodule_modules
│       │       └── packageA
```

此時如果 plugin1 和 plugin2 的 `package.json` 中，有在 `peerDependencies` 屬性中加入 packageA，如下

```json
{
    // 略
    "peerDependencies": {
        "packageA": "1.0.0"
    }
}
```

此時在專案中執行 `npm install` 安裝擴充套件時，`node_modules` 結構會長得像這樣：

```
├── Project
│   └── node_modules
│       ├── packageA
│       ├── plugin1
│       └── plugin2
```

這時你會發現，原本 packageA 要下載安裝 3 次，但現在只需要安裝 1 次，也因為這樣安裝速度變得更快，`node_modules` 的資料夾結構也更為扁平了。

## 套件相依性問題

`peerDependencies` 的立意良善，但對於一些專案來說，可能會造成套件相依性問題。

延續上面的例子，如果 plugin1 和 plugin2 所相依的 packageA 是**不同版本**時，就會發生版本衝突！

這狀況很容易發生在舊的專案中，這時該怎麼處理呢？當然，如果能對齊所有的相依的套件版本當，絕對是上選。但很多時候，要對齊版本要花上很多力氣，尤其是大量使用第三方套件時。

這時候我們就可以在執行 `npm install` 的時候，加上 `--legacy-peer-deps` 參數，明確的告訴 NPM 不要自動安裝 `peerDependencies` 套件，進而忽略不同擴充套件因為相依的套件版本所造成的問題，讓各自的擴充套件使用自己所相依的套件版本。

也就是讓 NPM v7 用舊的（v3~v6）的處理方式來安裝相依套件。

----------

參考資料：

* [npm install xxxx --legacy-peer-deps到底做了些什么？](https://juejin.cn/post/6971268824288985118)
* [What are peer dependencies in a Node module?](https://flaviocopes.com/npm-peer-dependencies/)
* [What does npm install --legacy-peer-deps do exactly? When is it recommended / What's a potential use case?]([?WT.mc_id=DT-MVP-5003022](https://stackoverflow.com/questions/66239691/what-does-npm-install-legacy-peer-deps-do-exactly-when-is-it-recommended-wh))
