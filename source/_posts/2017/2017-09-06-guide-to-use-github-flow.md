---
layout: post
title: 如何使用 GitHub Flow 來參與開源專案
date: 2017-09-06 21:12
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: guide-to-use-github-flow/
---
GitHub 是開發人員都知道的程式碼代管平台，大多數的開放原始碼專案都放在這個平台上，這上面也營造出許多開源社群，當有開發者對某項專案有興趣時，可以在這研究其背後的寫作方式，有能力了話，還可以貢獻所長，改善或增強開源專案。那麼要如何參與開源專案呢？GitHub 提供了一套流程，讓開源協助變得簡單。

![GitHub Flow](https://i.imgur.com/gns2luN.png)

>GitHub 上的開源專案大多使用 GitHub Flow 做管理，這是一套基於分支的管理流程，藉由分支管理功能的開發或來自社群的貢獻。
>
>其中 `master` 分支代表著隨時可佈署正式環境（Production Ready）的狀態。
>
>上面這張圖表現出協同開發的過程中，版控及討論的行為。

## Fork

在 GitHub 上想要參與開源專案的第一步，就是從專案頁上使用 `Fork` 按鈕，將整個專案複製一份到你的帳號底下成為自己的專案，之後的任何修改都在你自己的專案中執行。

## Branch

![Branch](https://i.imgur.com/YxNhiqA.png)

在將專案 `git clone [YOUR_PROJECT]` 到本機後，第一件事就是開分支 `git checkout -b [BRANCH_NAME]`，之後的修改和討論都會以此 `[BRANCH_NAME]` 分支作為基準。

## Commit

![Commit](https://i.imgur.com/ehEeTyx.png)

接著就是貢獻所長了。

在修改之前這裡有個 Git 建議設定。

開啟命令提示字元並移至該專案下，執行 `git remote -v` 查看 Git 的遠端設定，你會看到像下圖的設定，有分 `fetch` 和 `push` 兩種。

![設定前](https://i.imgur.com/ieAQcE5.png)

在這裡我們可以將 fetch 的遠端位置，改成原始專案的位置，步驟如下：

1. `git remote set-url origin [UPSTREAM]`，其中 `[UPSTREAM]` 為原始專案的位置
2. `git remote set-url --push origin [YOUR_PROJECT]`

>`git remote set-url` 只有修改 `push` 的參數可以用，所以要執行這兩段命令。

設定完成後如下圖，`poychang` 是我自己，`chgc` 則是來源專案。

![設定後](https://i.imgur.com/iS8FGoP.png)

這樣設定可以達到以下好處：

* 之後會從原始專案中取得最新的專案資料（`fetch`），保持專案的一致性
* 所修改的資料只會推送到自己的專案中（`push`），不會影響其他人

完成設定後的基本版控操作就不贅述了，就是修改然後 `git commit`，直到完成。

## Pull Request

![Pull Request](https://i.imgur.com/1XdLZa1.png)

當修改都完成後，我們就可以發送 PR (Pull Request) 合併請求，給原始專案，請專案負責人確認你的貢獻是否符合專案的要求。

這邊特別說明一件事，每個專案可能都有自己的規範，通常會寫在專案的 `README.md` 或 `CONTRIBUTING.md`，請**務必**在修改或提交前，閱讀專案的規範，維持開源專案的品質。有些大型的專案甚至會請你簽署 CLA (Contributor License Agreement)，確保有法源保護。

## Discuss And Review

![Discuss And Review](https://i.imgur.com/ser2wXQ.png)

專案負責人在確認你所貢獻的程式碼時，可以在該 PR 中進行討論，討論程式碼內容或關於修改的建議，過程中如果有需要修正的地方，可以直接在該分支中做修改，因為 PR 是看分支的，所以該分支於 PR 合併確認前，都可以新增提交，並納入合併請求中。

在討論的過程中，可以利用 GitHub 的 `@` 提及系統，請某個開發者或團隊進行回饋。

<!--
## Deploy
![Deploy](https://i.imgur.com/45MMzLH.png)
-->

## Merge

![Merge](https://i.imgur.com/IYJgbY5.png)

當所貢獻的程式碼經過一連串的檢閱、測試後，具有來源專案合併權限的人，就可以將你的貢獻合併到來源專案中了。

恭喜你成為開源專案的一員！

更多詳細的 GitHub Flow 內容，請參考 [GitHub Guides](https://guides.github.com/)。

----------

參考資料：

* [Understanding the GitHub Flow](https://guides.github.com/introduction/flow/)
* [Git 工作流程](http://www.ruanyifeng.com/blog/2015/12/git-workflow.html)
* [了解 GitHub Flow](http://calvert.logdown.com/posts/2014/09/21/understanding-the-github-flow)