---
layout: post
title: 查詢 Azure DevOps Pipeline 有使用到特定 Task 的任務
date: 2024-05-07 14:45
author: Poy Chang
comments: true
categories: [Azure, Develop, PowerShell]
permalink: search-azure-devops-pipeline-with-specific-task/
---

當建立了很多 Azure DevOps Pipeline 進行各種持續建置的任務後，有時候我們會想要查詢某個 Pipeline 有沒有使用到特定的 Task，這時候就可以透過 Azure CLI 來查詢，這篇文章將帶你了解如何透過 Azure CLI 查詢 Azure DevOps Pipeline 有使用到特定 Task 的任務。

## 前置作業

首先若電腦還沒有安裝 Azure CLI，可以參考[官方這篇文章](https://docs.microsoft.com/zh-tw/cli/azure/install-azure-cli?WT.mc_id=DT-MVP-5003022)來進行安裝，但如果手邊的電腦只能手動安裝，這時請使用下列連結下載 .msi 安裝檔進行安裝：[https://aka.ms/installazurecliwindows](https://aka.ms/installazurecliwindows)。

接著要安裝 Azure DevOps CLI 擴充功能，請執行 `az extension add --name azure-devops` 進行安裝。

## 查詢 Azure DevOps Pipeline 特定 Task

Azure CLI 提供了 `az pipelines` 這個指令來查詢 Azure DevOps Pipeline，完整的指令清單請參考[官方文件](https://learn.microsoft.com/zh-tw/cli/azure/pipelines?view=azure-cli-latest&WT.mc_id=DT-MVP-5003022)。在這裡我們只會用到 `az pipelines list` 和 `az pipelines show` 這兩個指令。

基本上整個查詢流程的步驟如下：

1. 取得要查詢的 Task ID 或顯示名稱（ID 會比較明確）
2. 使用 `az pipelines list` 取得所有 Pipeline 的列表
3. 使用 `az pipelines show` 取得 Pipeline 的詳細資料
4. 過程中使用 JMESPath 來做查詢

整個查詢過程，我會使用 PowerShell 來協助我處理資料並收集資訊。

## 第一步：取得 Task ID

無論你是要從 Azure DevOps 網站或是透過 `az pipelines show` 去查詢詳細資料，下圖是透過 Azure DevOps 網站，進入到 Pipeline 的編輯畫面，你可以記錄下介面上的 `Display name` 用來後續做查詢，或是點右上角的 `View YAML` 查看這個 Task 的詳細資訊，之後透過這裡所提供的資訊做資料過濾。

![查詢 Task ID 或顯示名稱](https://i.imgur.com/dQmLKQK.png)

不過這裡我建議，先使用 `az pipelines show --name [PIPELINE NAME]` 或 `az pipelines show --id [PIPELINE ID]` 這樣的指令來取得該 Pipeline 的所有詳細資訊，`[PIPELINE NAME]` 很直覺就是該 Pipeline 的名稱，至於 `[PIPELINE ID]` 就比較不好查，最簡單的方式就是直接開啟該 Pipeline 然後看網址，網址會有像是 `pipelineId=212` 這樣的參數，這個就是這裡要用的 `[PIPELINE ID]`。

透過 `az pipelines show` 取得資訊時，你很可能會被超完整的 JSON 資料給淹沒，這時候你可以搭配 `--query` 參數來用 JMESPath 做資料過濾。

> 關於 JMESPath 的使用方式，請參考[輕鬆上手 JMESPath](https://blog.poychang.net/play-with-jmespath/)。

例如，你可以使用類似像 `az pipelines show --id 870 --query "process.phases[].steps[?contains(displayName, 'Build an image')][]"` 這樣的指令來查詢 Pipeline 中的步驟，這裡的 `displayName` 後面就是接你要查詢的 Task 的顯示名稱，這樣就可以找到你要的 Task，

接著關注 `task` 這個屬性，他會長得像下面 JSON：

```json
[
    {
        //...
        "task": {
        "definitionType": "task",
        "id": "e28912f1-0114-4464-802a-a3a35437fd16",
        "versionSpec": "0.*"
        },
        //...
    }
    //...
]
```

這裡的 `id` 值，就是我們要的 Task ID。

## 第二步：取得所有 Pipeline 的列表

由於 `az pipelines show` 一次只能查詢一個 Pipeline，所以我們需要使用 `az pipelines list` 來取得所有 Pipeline 的列表，藉此取得我們所有 Pipeline 的 ID （或是 Name），再逐一查詢每個 Pipeline 的詳細資料，收集那些 Pipeline 有我們關注的 Task。

```powershell
# 獲取所有 Pipelines 的列表
$pipelines = az pipelines list --query "[?contains(name, '$PipelineNameFilter')].{Id:id, Name:name}" | ConvertFrom-Json
```

> 這裡使用到 JMESPath 的過濾和投影操作，詳請參考[輕鬆上手 JMESPath](https://blog.poychang.net/play-with-jmespath/)。

這裡的 `$PipelineNameFilter` 是一個過濾條件，可以用來過濾出你要查詢的 Pipeline，這樣可以避免查詢太多 Pipeline，造成資料量過大，也方便我們再測試的時候能盡快取得回應。

如此一來，我們就取得了所有 Pipeline 的 ID 和 Name，接著就可以逐一查詢每個 Pipeline 的詳細資料。

## 第三步：取得所有有用到特定 Task 的 Pipeline

這裡我們要逐一查詢每個 Pipeline 的詳細資料，並且查詢是否有使用到我們關注的 Task，這裡使用 `az pipelines show` 來查詢 Pipeline 的詳細資料，並且使用 JMESPath 來過濾出我們關注的 Task。

```powershell
$targetPipelineList = @()

# 遍歷匹配的 Pipelines
foreach ($pipeline in $pipelines) {
    # 查詢並顯示每個 Pipeline 是否有使用指定的 Task
    $taskId = "[YOUR_TASK_ID]"
    $task = az pipelines show --id $pipeline.id --query "process.phases[].steps[?contains(task.id, '$($taskId)')].{Id:task.id, VersionSpec:task.versionSpec}" | ConvertFrom-Json
    # 若找到有使用指定 Task 的 Pipeline，就加入到清單中
    if ($task.Length -ne 0) {
        $targetPipelineList += [PSCustomObject] @{ Name = $pipeline.name; Id = $pipeline.id; }
    }
}
# 顯示所有有使用指定 Task 的 Pipeline 名稱和 ID
$targetPipelineList.ForEach( { $_ })
```

## 完整的 PowerShell 腳本

最後將這次的任務寫成一個 PowerShell 函式，方便日後使用。

```powershell
function Search-Task {
    # 搜尋所有 Pipeline 中是否有使用指定的 Task
    param (
        [Alias("Filter")]
        [Parameter(Mandatory = $false)]
        [string]$PipelineNameFilter,
        [Alias("Org")]
        [Parameter(Mandatory = $false)]
        [String]$Organization,
        [Alias("Proj")]
        [Parameter(Mandatory = $false)]
        [String]$Project
    )
    # 設置 Azure DevOps 組織和項目
    az devops configure --defaults organization=$Organization project=$Project

    # 獲取所有 Pipelines 的列表
    $pipelines = az pipelines list --query "[?contains(name, '$PipelineNameFilter')].{Id:id, Name:name, Path:path}" | ConvertFrom-Json

    $targetPipelineList = @()

    # 遍歷匹配的 Pipelines
    foreach ($pipeline in $pipelines) {
        # 查詢並顯示每個 Pipeline 是否有使用指定的 Task
        $taskId = "[YOUR_TASK_ID]"
        $task = az pipelines show --id $pipeline.id --query "process.phases[].steps[?contains(task.id, '$($taskId)')].{Id:task.id, VersionSpec:task.versionSpec}" | ConvertFrom-Json
        # 若找到有使用指定 Task 的 Pipeline，就加入到清單中
        if ($task.Length -ne 0) {
            $targetPipelineList += [PSCustomObject] @{
                Name        = $pipeline.name;
                Id          = $pipeline.id;
                VersionSpec = $task.VersionSpec;
                Path        = "$($organization)$([uri]::EscapeDataString($project))/_apps/hub/ms.vss-ciworkflow.build-ci-hub?_a=edit-build-definition&id=$($pipeline.id)";
            }
        }
    }

    # 顯示所有有使用指定 Task 的 Pipeline 名稱和 ID
    $targetPipelineList.ForEach( { $_ })
}
```

裡面的 `[YOUR_TASK_ID]` 替換成你要查詢的 Task ID，在加入清單的過程中，我刻意組合一個連結，這樣可以從最終結果中，直接點擊連結進入到 Azure DevOps 網站的 Pipeline 編輯畫面，方便進一步查看詳細資訊。

## 後記

當 Azure DevOps Pipeline 的數量越來越多的時候，如果還是使用網站的介面逐一點選查看了話，會花費非常多的時間。透過 Azure CLI 搭配 JMESPath 語法，可以更快速的找到我們想要的 Pipeline，這樣就可以更有效率的進行資訊查詢。

---

參考資料：

* [MS Learn - az pipelines](https://learn.microsoft.com/zh-tw/cli/azure/pipelines?view=azure-cli-latest#az-pipelines-show?WT.mc_id=DT-MVP-5003022)
* [MS Learn - 如何使用 JMESPath 查詢來查詢 Azure CLI 命令輸出](https://learn.microsoft.com/zh-tw/cli/azure/query-azure-cli?WT.mc_id=DT-MVP-5003022)