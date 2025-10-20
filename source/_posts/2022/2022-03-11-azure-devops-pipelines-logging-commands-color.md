---
layout: post
title: 在 Azure DevOps Pipelines 中輸出有顏色的 Log 訊息
date: 2022-03-11 11:23
author: Poy Chang
comments: true
categories: [Azure, Develop]
permalink: azure-devops-pipelines-logging-commands-color/
---

我們可以透過 Azure DevOps Pipelines 來執行一些 Script 或是 PowerShell 腳本，甚至某些我們寫好的 Console App 應用程式，來完成否些事情，過程中你可能會想輸出訊息到 Log 中，方便事後查看或 Debug，無奈的是，單純的輸出就只是一堆文字，稍微難閱讀些，如果能加上些顏色那就可以大大增可讀性了。

>這篇做法不是讓 Log 上顏色的通用作法，而是使用 Azure DevOps Pipelines 內建的一些機制來達成。

通常在使用 .NET 的 Console App 專案來建立執行檔的時候，當需要輸出 Log 時，可以使用 `Console.WriteLine()` 或是 .NET 泛型主機框架（Host.CreateDefaultBuilder）所提供的 Logger 來輸出，這時候的輸出，在 Azure DevOps 上是沒有顏色變化的，你可以在輸出訊息前面加上下面幾個關鍵字，增加 Log 的可讀性：

```
##[group]Beginning of a group
##[warning]Warning message
##[error]Error message
##[section]Start of a section
##[debug]Debug text
##[command]Command-line being run
##[endgroup]
```

對應的效果如下：

![img](https://i.imgur.com/3ROqNcd.png)

同樣的，如果你是使用 bash 或 PowerShell 來執行某些任務並輸出 Log，也是可以在輸出 Log 訊息之前加上上面的關鍵字，來達到一樣的效果。

個人覺得善用 .NET 泛型主機的 Logger 和 `##[warning]` 和 `##[error]` 這兩個關鍵字，就可以讓輸出的 Log 長的夠漂亮了

## 後記

附上一個實案例效果（Logger 搭配 ##[warning]）：

![案例](https://i.imgur.com/NKo95ew.png)

----------

參考資料：

* [MS Docs - Azure DevOps Pipelines 記錄命令](https://docs.microsoft.com/zh-tw/azure/devops/pipelines/scripts/logging-commands?WT.mc_id=DT-MVP-5003022)
