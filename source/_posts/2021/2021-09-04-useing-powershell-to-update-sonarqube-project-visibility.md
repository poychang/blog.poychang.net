---
layout: post
title: 使用 PowerShell 快速修改 SonarQube 專案的 Public/Private 權限
date: 2021-09-04 10:22
author: Poy Chang
comments: true
categories: [PowerShell, Tools]
permalink: useing-powershell-to-update-sonarqube-project-visibility/
---

在大量使用 SonarQube 來做 Code Review 之後，陸續有其他團隊也想使用這個工具來強化程式碼品質，但之前在 SonarQube 上的專案都是設定成 Public 的狀態，而且又已經有很多專案在上面了，要如何快速將這些原本是 Public 的專案改成 Private 呢？這篇有個 PowerShell 腳本可以幫你快速修改。

因為要讓其他團隊也使用 SonarQube 平台，而所以所有有帳號的成員都可以看的到 Public 的專案內容，為了避免不同團隊看到不屬於他們的專案，可以將 SonarQube 專案設定成 Private 並套用適當的權限樣板，要在介面上手動修改成 Private 可以參考下圖：

![修改 SonarQube 專案的 Public/Private 設定](https://i.imgur.com/Fjexubr.png)

主要就是進到該專案，點選右上方的 `Project Settings` > `Permission`，然後點選 `Private` 即可。

但每個專案都要這樣用滑鼠點，也太花時間了，如果有上百個專案，那會很累。

SonarQube 其實有提供 [WebAPI](https://docs.sonarqube.org/latest/extend/web-api/) 介面，讓你有機會程式化一些動作，像上面的需求，這時候你可以使用下面這個 PowerShell 腳本：

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$user = "<admin_user>"
$securedValue = Read-Host "Please Enter Password " -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securedValue)
$value = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
$combocred = "$($user):$($value)"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($combocred))
$headers = @{"Authorization" = "Basic "+$encodedCreds}
Invoke-RestMethod -Uri "https://<sonarqubeurl>/api/projects/update_visibility?project=<Project_Key>&visibility=private" -Method Post -Headers $headers -ContentType "application/json"
```

這個腳本需要修改以下 3 個值

- `<admin_user>` 具有管理者權限的帳號
- `<sonarqubeurl>` SonarQube 的網址
- `<Project_Key>` 要修改的 SonarQube 專案的 Project Key

執行過程中會要你輸入 `<admin_user>` 這個帳號的密碼，當然你也可以直接寫死在腳本中（如最下面的腳本），方便使用。

最後，你可以搭配下面的寫法，來將所有專案都跑過一遍：

```powershell
$list = `
    ([PSCustomObject]@{ ProjectKey="A1"; Visibility="private" }), `
    ([PSCustomObject]@{ ProjectKey="B1"; Visibility="private" }), `
    ([PSCustomObject]@{ ProjectKey="C1"; Visibility="public" });

$list.ForEach({ 
    # 上面修改專案狀態的 PowerShell Script 來處理
})

$list.ForEach({ 
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $user = "<admin_user>"
    $value = "<admin_user_passward>"
    $combocred = "$($user):$($value)"
    $encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($combocred))
    $headers = @{"Authorization" = "Basic "+$encodedCreds}
    Invoke-RestMethod -Uri "https://<sonarqubeurl>/api/projects/update_visibility?project=$($_.ProjectKey)&visibility=$($_.Visibility)" -Method Post -Headers $headers -ContentType "application/json"
})
```

----------

參考資料：

* [How to set all existing projects to private in SonarQube?](https://community.sonarsource.com/t/how-to-set-all-existing-projects-to-private-in-sonarqube/4320/21)
* [SonarQube Docs - Web API](https://docs.sonarqube.org/latest/extend/web-api/)
