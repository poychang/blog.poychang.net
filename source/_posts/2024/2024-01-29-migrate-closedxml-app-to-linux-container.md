---
layout: post
title: 遷移有使用 ClosedXML 的應用程式到 Linux 容器
date: 2024-01-29 13:48
author: Poy Chang
comments: true
categories: [Dotnet, App, Develop, Container, PowerShell, Tools, Test, Note, Uncategorized]
permalink: migrate-closedxml-app-to-linux-container/
---

在 .NET 開發應用程式中遇到要處理 Excel 檔案的時候，可以使用微軟官方提供的 [Open XML SDK](https://github.com/dotnet/Open-XML-SDK)，或使用第三方套件的 [NPOI](https://github.com/nissl-lab/npoi)、[EPPlus](https://github.com/EPPlusSoftware/EPPlus)、[MiniExcel](https://github.com/mini-software/MiniExcel) 或是這篇會使用到的 [ClosedXML](https://github.com/ClosedXML/ClosedXML)。當我們需要將應用程式遷移至容器時，使用這些套件的應用程式可能會遇到底層繪圖 GDI+ API 的不支援而造成問題，這篇分享一個實際案例。

## libgdiplus

過去在 Windows 中運行有使用 ClosedXML 的應用程式，基本上不會有太多問題，但當我們想要將應用程式遷移到 Container 的時候，有些事情必須要特別考量了。

由於 ClosedXML 在 0.96 版以前，是相依於 `System.Drawing.Common` 這個套件中的 GDI+ API，因此要遷移到 Container 了話，基本上只能選擇 Windows Container。不過在 [Mono](https://www.mono-project.com/) 社群的努力下，釋出了[libgdiplus](https://github.com/mono/libgdiplus) 函式庫，讓我們有機會在 Linxu Container 中執行相依於 `System.Drawing.Common` 的應用程式，只是這個 Container 要特別處理過，主要就是在 Linux Base Image 上加裝 `libgdiplus` 及依賴的套件，Dockerfile 如下：

```bash
FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libc6-dev \
    libgdiplus \
    libx11-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY /app/ /app/
WORKDIR /app
ENTRYPOINT ["dotnet", "App.dll"]
```

`libgdiplus` 是 `System.Drawing.Common` 跨平臺的實作，實際上 libgdiplus 是 Windows 的部分重新實作，這意味著這是一個非常複雜的組件。而 `libgdiplus` 本身還有許多外部依賴，這讓維護此組件的工作日漸困難。

因此這樣的解決方案還算可行，在沒有特殊操作的狀況下，都可以運作良好。直到 .NET 6 推出。

## .NET 6

.NET 6 推出時，大部分的應用程式都只要做一些些的異動變更，就可以順利升級，有個重大更新。在 .NET 6 這個版本之後， `System.Drawing.Common` 僅支援 Windows，在應用程式要編譯成非 Windows 環境的檔案時，會直接發出警告，這讓使用 0.97 版以前的 ClosedXML 的應用程式無法正常編譯。

因此，如果要維持讓有使用 ClosedXML 的應用程式能繼續在 Linux Container 上運作，必須要將應用程式升級到 .NET 6，且將 ClosedXML 升級到 0.97 以上版本。

升級到 .NET 6 之後，Linux Container 不能再使用 `System.Drawing.Common`，而 ClosedXML 升級到 0.97 以上版本之後，移除了 `System.Drawing.Common` 的依賴（[note](https://github.com/ClosedXML/ClosedXML/releases/tag/0.97.0)），在雙雙都升級之後，要在 Linux Container 執行有 ClosedXML 套件的應用程式就此豁然開朗。

> 要脫離 `System.Drawing.Common` 的依賴是相當棘手的，但為了支援越來越多的非 Windows 限定環境的應用，這步棋勢必還是要走。官方文件也有提供一些 [System.Drawing 替代方案](https://learn.microsoft.com/en-us/dotnet/api/system.drawing?view=dotnet-plat-ext-6.0#remarks)，ClosedXML 團隊對此也評估了很[多項方案](https://github.com/ClosedXML/ClosedXML/issues/1805)，如果你手邊有這樣的需求，可以參考一下這些文件和討論。

## 後記

要將 ClosedXML 版本從 0.96 升過 0.97，甚至到最新版，過程中是會有許多 Breaking Change 的，但這也沒辦法，唯有這樣做，應用程式才有辦法繼續往下走升級，走更遠的路，撐更久。

---

參考資料：

* [ClosedXML Migration Document](https://docs.closedxml.io/en/latest/migrations/migrate-to-0.100.html)
* [ClosedXML 0.97 System.Drawing.Common removal](https://github.com/ClosedXML/ClosedXML/releases/tag/0.97.0)
* [MS Learn - 重大變更：Windows 僅支援 System.Drawing.Common](https://learn.microsoft.com/zh-tw/dotnet/core/compatibility/core-libraries/6.0/system-drawing-common-windows-only?WT.mc_id=DT-MVP-5003022)
* [MS Learn - .NET 6 從套件卸載的舊版架構版本](https://learn.microsoft.com/zh-tw/dotnet/core/compatibility/core-libraries/6.0/older-framework-versions-dropped?WT.mc_id=DT-MVP-5003022)
* [MS Learn - .NET 的重大變更](https://learn.microsoft.com/zh-tw/dotnet/core/compatibility/breaking-changes?WT.mc_id=DT-MVP-5003022)
