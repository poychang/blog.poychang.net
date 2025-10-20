---
layout: post
title: 使用 PowerShell 建立修改檔案內容的指令
date: 2021-01-19 11:45
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: powershell-replace-file-content-function/
---

今天遇到一個奇妙的情況，同事上傳的檔案內容出現一個奇妙的字元亂碼，上傳的程式修正了，但已經上傳的檔案內容需要移除那個奇妙的字元，因此想用 PowerShell 寫一隻指令來處理看看，順便也補充一下 PowerShell 知識。

## 前情提要

該檔案使用 UCS-2 LE BOM 編碼，其實這相當於 UTF-16 編碼（兩者的關係[參考這裡](https://zh.wikipedia.org/wiki/UTF-16#UTF-16.E8.88.87UCS-2.E7.9A.84.E9.97.9C.E4.BF.82)），再加上使用 little-endian 的排序方式。

之所以會出現奇妙的字元，是因為每此 Append 內容進檔案的時候，把編碼標頭也 Append 上去，這就造成了亂碼。

![亂碼 \ufeff](https://i.imgur.com/sCFOiJ0.png)

>這個亂碼其實是個 `\ufeff` 字元，只是它顯示不出來。

## 處理幾件小事情

要調整的檔案數量不在少數，要修改成千上百個檔案可不是開玩笑的。

第一步當然就是取得所有檔案的路徑，在 PowerShell 的環境中取得指定資料夾底下的所有檔案路徑算簡單的，`Get-ChildItem -Path "YOUR_FOLDER_PATH" -File` 一行搞定。

第二步就是逐一打開前一步取得的檔案內容，然後替換掉指定的字元，這裡稍微不好處理，PowerShell 沒有提供直接取代檔案內容的 Cmdlet，為了讓指令盡可能單純，我選擇這樣的解法：

```powershell
(Get-Content -path "FILE_PATH" -Raw) -replace "SEARCH_TARGET", "REPLACE_VALUE"
```

先將該檔案內容用 `Get-Content` 取出，然後這個值當然就是個字串，這時再使用字串的 Replace 功能，這樣指令就相當簡潔了。

第三步就是把還存在記憶體中的修改後字串，存進原本的檔案中，這只需要用到 `Set-Content` 這支 Cmdlet 就搞定了！不過有一點要注意的是，預設會使用 UTF-8 without BOM 的編碼，前情提要有講到編碼要用 UCS-2 LE BOM，因此要再指定 `Set-Content` 的 `-Encoding` 參數為 `unicode`。

把二、三部的指令用 `|` 管線符號串起來，就差不多完成囉！

```powershell
(Get-Content -path "FILE_PATH" -Raw) -replace "SEARCH_TARGET", "REPLACE_VALUE" | Set-Content -Path "FILE_PATH" -Encoding unicode
```

## 完整的 Function

寫成 PowerShell Function 就是下面這樣囉，開放三個參數以便後續使用，其中第三個 Replace 的參數要稍微注意一下，因為有可能是要替換成空字串，因此這個參數需要掛上 `[AllowEmptyString()]` 讓它可以接受空字串，不然執行的時候可是會報錯的。

```powershell
function Update-FileContent {
    Param(
        [Parameter(
            Mandatory = $true,
            Position = 0,
            HelpMessage = "Folder path"
        )]
        [string]$Path,
        [Parameter(
            Mandatory = $true,
            Position = 1,
            HelpMessage = "Search content"
        )]
        [string]$Search,
        [Parameter(
            Mandatory = $true,
            Position = 2,
            HelpMessage = "Replace to"
        )]
        [AllowEmptyString()]
        [string]$Value
    )

    $files = Get-ChildItem -Path $Path -File
    foreach ($file in $files) {
        Write-Verbose -Message "Replace From: $file.FullName"
        ((Get-Content -path $file.FullName -Raw) -replace $Search, $Value) | Set-Content -Path $file.FullName -Encoding unicode
    }
}
```

在 Function 裡面用到了 `Write-Verbose` 這個 Cmdlet，這是當執行此指令時，有加上 `-Verbose` 參數才會輸出該段訊息。

----------

參考資料：

* [Use PowerShell to Replace Text in Strings](https://devblogs.microsoft.com/scripting/use-powershell-to-replace-text-in-strings/)
* [PowerShell - Set-Content](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/set-content?WT.mc_id=DT-MVP-5003022)
* [How to validate PowerShell Function Parameters allowing empty strings?](https://stackoverflow.com/questions/6403342/how-to-validate-powershell-function-parameters-allowing-empty-strings)
* [PowerShell functions with -Verbose and -Debug](https://markgossa.blogspot.com/2017/08/powershell-functions-with-verbose-and.html)
* [How to check if file has a BOM in utf-8 text](https://unix.stackexchange.com/questions/170775/how-to-check-if-file-has-a-bom-in-utf-8-text)
