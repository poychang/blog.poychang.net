---
layout: post
title: PowerShell 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, PowerShell, Tools]
permalink: note-powershell/
---

Windows PowerShell 是以 .NET Framework 為基礎所建置，而且是以工作為基礎的命令列殼層和指令碼語言；專為系統管理員和進階使用者所設計，可快速自動化管理多個作業系統 (Linux、OSX、Unix 和 Windows)，以及與在這些作業系統上執行之應用程式相關的程序。

## 版本

PowerShell 的執行環境是有分版本的，結至 2018 年最新版本為 6.1，你可以在 PowerShell 中執行 `Get-Host` 命令來確認您的本機 PowerShell 版本。

最原始的設計中，指令檔的副檔名是會區分版本的，例如 `.ps1`、`.ps2`，但為了讓之後的使用上能兼容舊版本，所以全部統一使用 `.ps1` 作為 PowerShell 的指令檔附檔名。

版本不同所提供的功能或指令就會有些不同，因此如果你要確保指令檔是在某特定版本下執行時，在撰寫 `.ps1` 檔的時候，建議在開頭加上 `#REQUIRES` 並註明該指令碼所使用的版本，例如：

```powershell
#REQUIRES -Version 2

param([string]$BasePath="", [string]$FolderName="")
$location="D:\" + $BasePath + "\" + $FolderName
Set-Location $location
# ignore...
<# Version 2 Comment #>
```

REF: [CTP: PowerShell Versioning](https://blogs.msdn.microsoft.com/powershell/2007/11/02/ctp-versioning/)

## 註解

```powershell
# 單行註解
```

```powershell
<#
多行註解 1
多行註解 2
#>
```

若要針對指令撰寫完整的註解，請參考[註解型說明的範例](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/help/examples-of-comment-based-help)官方文件。

## 好用的指令碼

- 階段執行，按任意鍵繼續
   ```powershell
   Write-Host -NoNewLine 'Press any key to continue...';
   $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown');
   ```
- 查詢資料夾空間用量
  ```powershell
  (Get-ChildItem $Path -Recurse -File | Measure-Object -property length -sum).SUM / 1GB
  ```

## 物件與陣列

```powershell
# HashTable 資料結構
$HashTable = @{ 'Key1' = 'Value'; 'Key2' = 'Value'; }
# 在前面加 [PSCustomObject] 就變成物件
$Object = [PSCustomObject]@{ 'Key' = 'Value'; }

# 轉成 JSON 字串
ConvertTo-Json $Object
# 或這樣寫
$Object | ConvertTo-Json


$Array = @(
  @{ 'Key' = 'Value1'; },
  @{ 'Key' = 'Value2'; }
)
ConvertTo-Json $Array # 轉成 JSON 字串
```

## 快速鍵

REF: [Windows PowerShell ISE 的鍵盤快速鍵](https://docs.microsoft.com/zh-tw/powershell/scripting/core-powershell/ise/keyboard-shortcuts-for-the-windows-powershell-ise?view=powershell-6&WT.mc_id=DT-MVP-5003022)

| 動作                     | 鍵盤快速鍵 |
| ------------------------ | ---------- |
| 顯示/隱藏指令碼窗格      | CTRL + R   |
| 將指令碼窗格移至上方     | CTRL + 1   |
| 將指令碼窗格移至右方     | CTRL + 2   |
| 最大化指令碼窗格         | CTRL + 3   |
| 關閉 PowerShell 索引標籤 | CTRL + W   |
| 新增 PowerShell 索引標籤 | CTRL + T   |

## 常用指令

- `$PSVersionTable.PSVersion` 查看 PowerShell 版本
- `Get-ChildItem Env:` 查看環境變數 \* `$Env:USERPROFILE` 查看環境變數中 USERPROFILE 的內容值
- `Format-List` 透過這個指令來格式化輸出的資訊，例如 `Get-EventLog -Log System -Newest 10 | Format-List -Property *` 列出最新 10 筆系統事件紀錄，並將所有屬性格式化成表單作呈現，方便閱讀。

## 發送 HTTP Requesting

要透過 Powershell 發送 HTTP Request 來測試 API 主要透過 `Invoke-WebRequest` 命令，參考下列做法：

```powershell
$JSON = @'
{"name":"PoyChang","email":"","message":"Okay, I'm here.","property":{"key1":"value1","key2":"value2"}}
'@

Invoke-WebRequest -UseBasicParsing [YOUR_URL] -ContentType "application/json" -Method POST -Body $JSON
```

## 載入設定檔

PowerShell 會自動從以下這 4 個檔名路徑依序載入設定檔，如果找不到檔案也會自動跳過：

1. `%windir%\system32\WindowsPowerShell\v1.0\profile.ps1`
   - 這個設定檔 `profile.ps1` 會載入到所有使用者與所有 shell 執行環境
2. `%windir%\system32\WindowsPowerShell\v1.0\Microsoft.PowerShell_profile.ps1`
   - 這個設定檔 `Microsoft.PowerShell_profile.ps1` 會載入到所有使用者，但僅限於使用 Microsoft.PowerShell 的 shell 執行環境
3. `%UserProfile%\Documents\WindowsPowerShell\profile.ps1`
   - 這個設定檔 `profile.ps1` 會載入到目前登入的使用者，且會套用到該使用者所有 shell 執行環境
4. `%UserProfile%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
   - 這個設定檔 `Microsoft.PowerShell_profile.ps1` 會載入到目前登入的使用者，但僅限於使用 Microsoft.PowerShell 的 shell 執行環境

從上面路徑可以分成兩類：

- `%windir%` 套用至所有使用者
- `%UserProfile%` 套用至當前使用者

如果你有使用 OneDrive，可以將 `%UserProfile%` 改使用 OneDrive 下的設定檔，使設定檔可以透過雲端共用。

## 推薦安裝的套件

安裝時注意安裝的環境設定，如果要安裝給當前登入者使用，請在後面加上 `-Scope CurrentUser` 參數設定，若是要給所有使用者使用，則使用 `-Scope AllUsers`，一般建議安裝給當前登入者即可。

- `posh-git` 在 PowerShell 命令列上呈現 Git 狀態資訊
  _ [dahlbyk/posh-git](https://github.com/dahlbyk/posh-git)
  _ 安裝指令：`Install-Module posh-git -Scope CurrentUser`
- `Get-ChildItemColor` 輸出帶有顏色標示的目錄資訊
  _ [joonro/Get-ChildItemColor](https://github.com/joonro/Get-ChildItemColor)
  _ 安裝指令：`Install-Module Get-ChildItemColor -Scope CurrentUser` \* 建議別名：`Set-Alias ll Get-ChildItemColor -option AllScope`

PowerShell ISE 有 Add-On 可以安裝，[這篇文章](https://social.technet.microsoft.com/wiki/contents/articles/2969.windows-powershell-ise-add-on-tools.aspx)提供了很多資訊，社群提供的 Add-On 到如何自己寫一個 Add-On。

## 比較運算子

PowerShell 的比較運算子有分**字串**及**數字**的比較，字串又分為**限制大小寫**及**不限制大小寫**的比較，若是要限制比較字串的大小寫時，則在運算子前面加上 `c` 字元，如 `-cle` 即可。

| 運算子       | 說明       | 範例                                | 備註                                    |
| ------------ | ---------- | ----------------------------------- | --------------------------------------- |
| -le          | 小於或等於 | `10 -le 10` true                    | 字串不限大小寫                          |
| -lt          | 小於       | `10 -lt 10` false                   | 字串不限大小寫                          |
| -ge          | 大於或等於 | `10 -ge 10` true                    | 字串不限大小寫                          |
| -gt          | 大於       | `10 -ge 10` false                   | 字串不限大小寫                          |
| -eq          | 等於       | `10 -eq 10` true                    | 字串不限大小寫                          |
| -ne          | 不等於     | `10 -en 10` false                   | 字串不限大小寫                          |
| -like        | 相似       | `"ABC" -like "abc"` true            | 字串可用 `＊` 和 `?` 替代，並不限大小寫 |
| -notlike     | 不相似     | `"ABC" -notlike "abc"` false        | 字串可用 `＊` 和 `?` 替代，並不限大小寫 |
| -match       | 符合       | `"ABC" -match "[AE]"` true          | 字串不限大小寫，並不限大小寫            |
| -notmatch    | 不符合     | `"ABC" -notmatch "A"` true          | 字串不限大小寫，並不限大小寫            |
| -contains    | 包含       | `"A","B","C" -contains "A"` true    | 運算子的左邊含有右邊的值，並不限大小寫  |
| -notcontains | 不包含     | `"A","B","C" notcontains "A"` false | 運算子的左邊含有右邊的值，並不限大小寫  |

## 常用符號的用途

| 符號 | 用途                   | 範例                                                                                        |
| ---- | ---------------------- | ------------------------------------------------------------------------------------------- |
| `$`  | 宣告變數               | `$a`                                                                                        |
| `=`  | 賦值給變數             | `$a = get-date`                                                                             |
| `""` | 使用雙引號來顯示文字   | 當變數 `$a = Monday` 則 `"DayOfTheWeek: $a"` 的輸出為 `DayOfTheWeek: Monday`                |
| `+`  | 串接                   | 當變數 `$a = November` 則 `"DayOfTheWeek: " + $a.Dayofweek` 的輸出為 `DayOfTheWeek: Monday` |
| `()` | 建立子表達式、內嵌變數 | `(get-date).day`、`"Hello, $(Get-Date)"`                                                     |

---

參考資料：

- [官方教學文件](https://docs.microsoft.com/zh-tw/powershell/scripting/powershell-scripting?WT.mc_id=DT-MVP-5003022)
- [強而有力的 Windows PowerShell 系列](http://ithelp.ithome.com.tw/users/20005121/ironman/54)
- [如何在 Powershell 開啟時自動引入常用的 ps1 指令檔](https://msdn.microsoft.com/zh-tw/library/dn464004.aspx)
