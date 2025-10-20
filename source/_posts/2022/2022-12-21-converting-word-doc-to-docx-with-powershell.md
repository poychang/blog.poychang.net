---
layout: post
title: 使用 PowerShell 將 doc 轉檔成 docx 格式
date: 2022-12-21 09:40
author: Poy Chang
comments: true
categories: [Develop, PowerShell, Tools]
permalink: converting-word-doc-to-docx-with-powershell/
---

在整理過去的文件時，發現有大量的 Word 文件是使用舊的 `.doc` 格式，為了能夠在新的系統上使用，需要將這些文件轉換成新的 `.docx` 格式，這篇文章將介紹如何使用 PowerShell 來批次轉換。

在執行此 PowerShell 的時候，除了電腦上要安裝 Microsoft Word 之外，還要準備一個關鍵的 `Microsoft.Office.Interop.Word.dll`，我們我藉由此 DLL 來操作 Word 來進行轉換文件的操作。

如果電腦有安裝 Visual Studio 了話，您應該在目錄下 `%ProgramFiles(x86)%\Microsoft Visual Studio\Shared\Visual Studio Tools for Office\PIA\` 找到所需要的 Office 主要 Interop 組件（PIA）。

如果電腦沒有安裝 Visual Studio 的話，您可以從 NuGet 網站上下載所需要的 [Microsoft.Office.Interop.Word](https://www.nuget.org/packages/Microsoft.Office.Interop.Word)，在使用解壓縮工具，將這個 NuGet 套件中的 `Microsoft.Office.Interop.Word.dll` 複製到您的專案資料夾中。

最後則是使用 PowerShell 來執行轉換的動作。

```powershell
$path = "C:\Users\poychang\[YOUR_FILE_FOLDER]"
$word_app = New-Object -ComObject Word.Application
$Format = [Microsoft.Office.Interop.Word.WdSaveFormat]::wdFormatXMLDocument

Get-ChildItem -Path $path -Filter *.doc | ForEach-Object {
    $document = $word_app.Documents.Open($_.FullName)
    $docx_filename = "$($_.DirectoryName)\$($_.BaseName).docx"
    $document.SaveAs([ref] $docx_filename, [ref]$Format)
    $document.Close()
}
$word_app.Quit()
```

這段 PowerShell 的動作就像是我們開啟 Word 檔，然後執行另存新檔的動作，最後關閉 Word 應用程式。

同樣的操作方式，你可以已用來轉換其他的文件格式，例如：`.xls` 轉換成 `.xlsx`，只是所需要的 PIA 要換成 `Microsoft.Office.Interop.Excel.dll`。

---

參考資料：

* [Converting Word document format with PowerShell](https://steveknutson.blog/2021/06/09/converting-word-document-format-with-powershell/)
* [MS Learn - WdSaveFormat enumeration (Word)](https://learn.microsoft.com/en-us/office/vba/api/word.wdsaveformat?WT.mc_id=DT-MVP-5003022)
* [MS Learn - Office 主要 Interop 組件](https://learn.microsoft.com/zh-tw/visualstudio/vsto/office-primary-interop-assemblies?WT.mc_id=DT-MVP-5003022)
