---
layout: post
title: 更新成符合 .gitignore 設定的追蹤狀態
date: 2018-02-12 00:12
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: gitignore-and-delete-untracked-files/
---
如果開發到一半，你才加入 `.gitignore` 了話，之前被加入 Git 版控的檔案將不會被排除，這些已經加入的檔案將持續被 Git 追蹤，這時候我們可以怎麼做，才能把不再需要被版控的檔案移除，並請不再被 Git 追蹤呢？

`.gitignore` 可以告訴 Git 版控系統不要處理指定規則下的檔案，但只要檔案有被提交過，就會持續被 Git 所追蹤，因此再建立 `.gitignore` 之前，就已經提交檔案了話，那麼即使再從 `.gitignore` 內加入新規則，也無法排除已經被追蹤的檔案。

>簡單說，`.gitignore` 只能忽略那些沒有被追蹤的檔案 (Untracked Files)。

如果想要讓新增或更新後的 `.gitignore` 設定生效，並且排除已經被追蹤過的檔案時，可以參考以下步驟：

1. 清除本機 Git 的快取，相當於將所有檔案移除，但沒有刪除檔案
2. 重新加入 Git 追縱，這時會套用 `.gitignore` 設定
3. 提交，這個提交內容會是將排除的檔案刪除

```bash
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

>`git rm -r --cached .` 中的 `-r` 代表遞迴 (Recursive)，用來遞迴搜尋每個資料夾下的檔案。

## .gitignore 大全

GitHub 上面有提供各種專案的 `.gitignore` 範本，請參考這個專案 [Github - A collection of useful .gitignore templates](https://github.com/github/gitignore)

以下為部分 `.gitignore` 範本：

* [Visual Studio](https://github.com/github/gitignore/blob/master/VisualStudio.gitignore)
* [Python](https://github.com/github/gitignore/blob/master/Python.gitignore)
* [Node](https://github.com/github/gitignore/blob/master/Node.gitignore)
* [Jekyll](https://github.com/github/gitignore/blob/master/Jekyll.gitignore)

----------

參考資料：

* [git取消文件跟踪](http://www.cnblogs.com/zhuchenglin/p/7128383.html)