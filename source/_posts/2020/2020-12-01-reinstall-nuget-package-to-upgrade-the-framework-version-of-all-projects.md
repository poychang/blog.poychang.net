---
layout: post
title: 快速重新安裝並更正 .NET Framework 專案中的套件版本資訊
date: 2020-12-01 17:17
author: Poy Chang
comments: true
categories: [Dotnet]
permalink: reinstall-nuget-package-to-upgrade-the-framework-version-of-all-projects/
---

開發 .NET Framework 專案的時候，仔細看專案中的套件版本，你會發現在 `app.config` 或 `web.config` 這些檔案中的 `AssemblyBinding` 區段，會註明該套件是給哪一個 .NET Framework 版本用的，有時這會造成一些問題，這裡有個小技巧，可以讓我們快速更新這套件版本資訊。

一般來說，我們只要在 Visual Studio 中開啟 Package Manager Console 視窗，然後執行下列指令，即可將該方案下的所有專案的套件資訊都更新到指定的 .NET Framework 版本：

```ps1
Get-Project -All | Add-BindingRedirect
```

不過我通常會使用下列指令，順便重新安裝一下相關套件：

```ps1
Get-Project -All | % { Get-Package -ProjectName $_.ProjectName | % { update-package $_.Id -reinstall -ProjectName $_.ProjectName -ignoreDependencies } }
```

重新安裝的好處呢，是還可以順便修正套件相對位置的問題。有時候為了方便，可能會建立兩個方案檔（`.sln` 檔），如果這兩個方案檔是在不同的資料夾階層時，例如下面的 `SolutionName.sln` 和 `ProjectSln.sln` 都有包含 `ProjectB.csproj` 時：

```
│  SolutionName.sln
├─ProjectFolderA
│      ProjectrA.csproj
│      ...
└─ProjectFolderB
       ProjectSln.sln
       ProjectB.csproj
       ...
```

這時候開 `SolutionName.sln` 方案檔並安裝套件，會和開 `ProjectSln.sln` 並安裝套件，兩者所產生的 Nuget 套件位置會是不同的，這樣可能在之後的建置上發生錯誤，特別是發生在 CI （持續整合）的時候。

因此如果有需要更正專案中套件的 .NET Framework 版本資訊，我都會使用第二個方式，重新安裝套件。

----------

參考資料：

* [Could not load file or assembly System.Runtime](https://stackoverflow.com/questions/48503930/could-not-load-file-or-assembly-system-runtime-version-4-1-2-0/58406377#58406377)
