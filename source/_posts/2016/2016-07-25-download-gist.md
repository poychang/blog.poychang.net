---
layout: post
title: 使用 curl 下載特定 Gist
date: 2016-07-25 17:31
author: Poy Chang
comments: true
categories: [Develop]
permalink: download-gist/
---

[GitHub](https://github.com) 有個好用的服務，[Gist](https://gist.github.com)，最基本的用法就是分享程式碼，相較於 GitHub，這裡所分享的程式碼通常以檔案為單位，或是小型的程式專案。

但小歸小，所能提供的功能並不少，例如一樣擁有版本控制的功能、私有的存取限制，更還有 API 可以呼叫，更詳細的資訊，就移駕至官網 [About Gist](https://help.github.com/articles/about-gists/) 了。

我覺得 Gist 的服務很適合拿來儲存設定檔，例如通用的 `.gitidnore`，隨時專案有需要，馬上就可以下載下來用，只是每次都要使用網頁下載，個人覺得麻煩的，如果能有一鍵下載，那就完美了，這時候 `curl` 就派上用場了！

首先，你要知道你的下載連結長怎樣，格式主要長的如下：

`https://gist.githubusercontent.com/<OwnerID>/<GistID>/raw/<FileName>`

其中 `<OwnerID>` 和 `<FileName>` 顯而易見，就是 GitHub 的帳號和對應的檔案名稱，而 `<GistID>` 是在哪呢？

其實答案就在網址上：

![Gist ID](http://i.imgur.com/ScJZZMU.png)

為了確認他真的是 Gist ID，你可以透過 GitHub 所提供的 [Gists API](https://developer.github.com/v3/gists/) 來取得你 Gist 的相關資訊。

例如，呼叫 `https://api.github.com/users/<OwnerID>/gists` 就可以得到該擁有者底下所有的 Gist 資訊。

![Gist API JSON](http://i.imgur.com/BcEuEfq.png)

這裡就可以找到對應的 Gist ID。

有了 `<OwnerID>`、`<FileName>` 以及 `<GistID>` 資訊，就可以使用 `curl` 來下載囉～

----------

## code

```bash
# 樣式
curl -O https://gist.githubusercontent.com/<OwnerID>/<GistID>/raw/<FileName>

# 範例
curl -O https://gist.githubusercontent.com/poychang/128d62787f1bf5a60fcdafcb5d223b70/raw/.gitignore
```

----------

參考資料：

* [Github Developer](https://developer.github.com/)
