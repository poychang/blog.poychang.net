---
layout: post
title: 移除 Git 歷史紀錄
date: 2016-04-23 01:15
author: Poy Chang
comments: true
categories: [Tools, Develop]
permalink: git-how-to-remove-file-and-commit-from-history/
---

做版控很重要，但版控的內容也非常關鍵，如果不小放把不該放上去的資訊（例如帳號、密碼或個人玉照）給 commit 了話，那麼大家都會看的到唷！

如何修改 commit 歷史紀錄，把不該出現的紀錄移除，可以參考下列情境：

假設我們的版控歷史紀錄如下：
>R–A–B–C–D–E–HEAD

接下來要移除 B 跟 C 的 commit tree，變成

>R–A–D’–E–HEAD

依序執行下列指令可以移除 B & C

```bash
# detach head and move to D commit
git checkout <SHA-for-D>
 
# move HEAD to A, but leave the index and working tree as for D
git reset --soft <SHA-for-A>
 
# Redo the D commit re-using the commit message, but now on top of A
git commit -C <SHA-for-D>
 
# Re-apply everything from the old D onwards onto this new place 
git rebase --onto HEAD <SHA-for-D> master
 
# push it
git push --force
```

指令裡面的 `<SHA-for-X>` 是該 commit 紀錄的前7個字元，如果你用sourcetree了話，可以從下圖找到相關資訊。

![Here is Git SHA](http://i.imgur.com/hKtGY8N.png)

在做版控的過程中，注意每次的 commit 內容和說明是必須的，而 push 到 remotes 前將版控紀錄整理好，讓 commit tree 長的漂漂亮亮是可以讓之後看的人身心愉悅的，可以參考[Git 版本控制系統(3) 還沒 push 前可以做的事](https://ihower.tw/blog/archives/2622)，學習如何整理你的版控歷史紀錄。

注意！這裡提到的方法，**可刪除並更新遠端的歷史紀錄**，但是會造成其他人 repository 的歷史紀錄變的怪怪的，這時候建議砍掉重新從遠端下載一份，會比較"乾淨"。

## 補充

如果是要刪除最後一次的 commit，並請更新至遠端，可以透過下列方式：

```bash
# move HEAD to previous commit, and discard all working copy changes
git reset HEAD^

# push it
git push --force
```

其中 `HEAD` 後面的 `^` 是指前一版本的意思。

----------

參考資料：

* [Removing selected commit log entries for a Git repository](http://stackoverflow.com/questions/495345/removing-selected-commit-log-entries-for-a-git-repository)
