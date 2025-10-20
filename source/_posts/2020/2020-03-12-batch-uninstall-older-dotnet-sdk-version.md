---
layout: post
title: 批次移除舊版本 .NET Core SDK
date: 2020-03-12 15:16
author: Poy Chang
comments: true
categories: [Dotnet, Tools]
permalink: batch-uninstall-older-dotnet-sdk-version/
---

當使用 .NET Core 開發一段時間後，會發現你的作業系統安裝了很多版本的 .NET Core SDK 或 Runtime，因為在 Visual Studio 2019 16.3 版之前，每次更新 Visual Studio，Visual Studio 安裝程式會安裝相依版本的 .NET Core SDK，因此在控制台的 [新增或移除程式] 中，會看到很多版本的 .NET Core SDK，官方推出了一個小工具，幫助我們快速移除這些不會再用到的 SDK。

![控制台的新增或移除程式有很多 .NET Core SDK 版本](https://i.imgur.com/mMkkuiV.png)

在你電腦控制台的 [新增或移除程式] 中，可能會看到如上圖，一堆版本的 .NET Core SDK （我已經移除過一輪了...），如果使用這裡的移除程序，除了解除安裝的時間很久之外，還要用滑鼠一直點下一步，非常麻煩。

想必官方也是有同樣的困擾，寫了一支 `dotnet-core-uninstall` 工具來處理這件事情，同時也是個開放原始碼專案 [dotnet/cli-lab](https://github.com/dotnet/cli-lab)，有興趣寫類似工具的開發者可以去看看。

安裝檔也就在 [dotnet/cli-lab](https://github.com/dotnet/cli-lab) 這個專案的 Release 中，你也可以[點此下載 v1.0.115603 版](https://github.com/dotnet/cli-lab/releases/download/1.0.115603/dotnet-core-uninstall-1.0.115603.msi)。

這支工具的功能及使用方式相當簡單，基本上就三個功能：

1. 清單列表 `dotnet-core-uninstall list`
2. 測試執行 `dotnet-core-uninstall dry-run`
3. 解除安裝 `dotnet-core-uninstall remove`

>每個功能底下有滿多細項設定的，這部分可以參考官方文件 [.NET Core 解除安裝工具](https://docs.microsoft.com/zh-tw/dotnet/core/additional-tools/uninstall-tool)

## 試試看

首先，先查看本機有安裝那些版本的 .NET Core，你可以執行下面指令來列出 SDK、Runtime 甚至 Hosting Bundle 的安裝版本，如果你只想看到特定類別了話，可以在後面加上 `--sdk`、`--runtime` 或是 `--hosting-bundle` 來過濾。

```powershell
dotnet-core-uninstall list
```

執行結果如下：

![列表](https://i.imgur.com/Uv9GEfR.png)

你會發現有些版本後面會標註 `Used by Visual Studio` 這些版本是你本機的 Visual Studio 所相依的版本，請不要移除，不然你的 Visual Studio 就會有問題了。

如果你有些專案有使用 `global.json` 來指定特定的 .NET Core SDK 版本（詳參考此[連結](https://docs.microsoft.com/zh-tw/dotnet/core/tools/global-json?tabs=netcore3x)），請注意有用到的 SDK 版本也不要移除，不然下次你編譯該專案的時候，還是要重新裝回去。

以我這次為案例，我只想保留最新版本的 .NET Core SDK (`--sdk`)，因此我可以使用下面這個指令，只保留最新版本 (`--all-but-latest`)，但為了避免移除不開移除的，可以使用 `dry-run` 指令來先行測試，看看有那些版本會被移除：

```powershell
dotnet-core-uninstall dry-run --sdk --all-but-latest
```

執行結果如下：

![測試執行](https://i.imgur.com/QriMXbQ.png)

確認所列出來的版本是我們要移除的之後，就可以改用 `remove` 來正式移除那些不需要的版本，移除各個版本的過程中，程式會一直問你是否真的要移除，若你想避免一直打 `Yes`，可以再指令後面加上 `--yes` 讓他直接往下去執行。

```powershell
dotnet-core-uninstall remove --sdk --all-but-latest --yes
```

最後執行結果如下：

![最後結果](https://i.imgur.com/GwOypkH.png)

## 後記

[官方文件表示](https://docs.microsoft.com/en-us/dotnet/core/versions/remove-runtime-sdk-versions)，從 Visual Studio 2019 16.3 版開始，Visual Studio 會有自己本版相依的 .NET Core SDK 複本，因此我們就不會在 [新增或移除程式] 中看到這些 SDK 版本，也就是說不會因為更新 Visual Studio 而安裝了一堆 SDK 了。

----------

參考資料：

* [.NET Core 解除安裝工具](https://docs.microsoft.com/zh-tw/dotnet/core/additional-tools/uninstall-tool)
* [Announcing the .NET Core Uninstall Tool 1.0!](https://devblogs.microsoft.com/dotnet/announcing-the-net-core-uninstall-tool-1-0/)
