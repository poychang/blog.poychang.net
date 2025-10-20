---
layout: post
title: 在 PowerShell 中執行 C# 程式碼或 DLL 檔的方法
date: 2018-11-22 23:11
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, PowerShell, Develop, Tools]
permalink: using-csharp-code-in-powershell-scripts/
---

PowerShell 不僅僅是一種指令碼語言，還是一個可執行命令列的 Shell 工具，而他也和其他 Shell 一樣可以透過撰寫指令碼來執行很複雜的功能，但有時候我們已經有大量用 C# 撰寫好的類別庫，或者想要用熟悉的 C# 程式碼來擴充 PowerShell 的使用情境時，這裡提供兩種讓你在 PowerShell 中執行 C# 程式的方法。

## 直接寫程式碼進行載入

PowerShell 提供了 `Add-Tpye` 命令，[這個命令](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.utility/add-type?view=powershell-6&WT.mc_id=DT-MVP-5003022)的用途在於將 Microsoft .NET Framework 或 .NET Core 的類別載入 PowerShell 執行階段中。

`Add-Type` 有可以參數可以直接接收 C# 程式碼，使用方式基本如下：

```powershell
$Assemblies = ( <# 要加入參考組件 #> )
$CSharpCode = @"要執行的 C# 程式碼"@
Add-Type -ReferencedAssemblies $Assemblies -TypeDefinition $CSharpCode -Language CSharp

# 上述執行後，執行命令的方法
[Namespace.ClassName]::MethodName()
```

上面建立了兩個變數，分別是要程式碼需要的參考，以及要執行的程式碼本身，接著透過 `Add-Type -ReferencedAssemblies $Assemblies -TypeDefinition $CSharpCode -Language CSharp` 將該程式載入到 PowerShell 執行階段使用。

### 實際使用範例

如同上述所提的做法，我們將程式碼加上去。

> PowerShell 預設會參考 `System.dll` 和 `System.Management.Automation.dll` 這兩個組件，若你會用到其他組件時，才需要額外指定下述 `$Assemblies` 變數的內容值。

```powershell
$Assemblies = (
    "System, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089, processorArchitecture=MSIL",
    "System.Linq, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL"
)
$CSharpCode = @"
using System;
using System.Linq;

namespace PSLib
{
    public static class HelloWorld
    {
        public static void Say(string name)
        {
            Console.Write("Hello World, " + name);
        }

        public static void LinqRange(int max)
        {
            var squares = Enumerable.Range(1, max).Select(i => i * i);
            foreach (var num in squares)
            {
                Console.Write(num + "\t");
            }
        }
    }
}
"@
Add-Type -ReferencedAssemblies $Assemblies -TypeDefinition $CSharpCode -Language CSharp
```

> 一個常見的問題是，該如何取得組件的描述，可以[參考這篇](https://docs.microsoft.com/zh-tw/dotnet/framework/app-domains/how-to-view-the-contents-of-the-gac?WT.mc_id=DT-MVP-5003022)，主要透過 Visual Studio 的開發人員命令提示字元，使用 `gacutil -l` 命令就可以取得本機全域組件快取的組件清單。

執行後我們就可以有下面兩個命令可以執行：

```powershell
# 可執行命令
[PSLib.HelloWorld]::Say()
[PSLib.HelloWorld]::LinqRange(600)
```

## 透過載入 DLL 執行

上面的方式看似方便，其實有點不好維護，畢竟要寫純文字的程式碼，有點難寫。

另一種方式相對方便，做法是在 Visual Studio 或 Visual Studio Code 中寫好程式，編譯成 DLL 後，在 PowerShell 中載入該 DLL 並呼叫其方法，看看以下作法。

### 建立 DLL

開啟你習慣使用的 C# 程式碼編輯器，這裡我用 Visual Studio 建立**類別庫專案**，並新增 HelloWorld.cs 檔，然後同樣使用上面的程式碼。

![Hello World 程式瑪](https://i.imgur.com/HDamXmv.png)

建置後會得到一顆 `PSLib.dll` DLL 組件檔案。

![得到一顆 DLL 組件檔案](https://i.imgur.com/89XwP3i.png)

### 載入 DLL 至 PowerShell

這裡我們建立一個資料夾，並將剛剛建置得到的 DLL 檔複製進來，接著建立 `ExecuteCSharpDLL.ps1` 檔，程式碼如下：

> 你可以透過 `Write-Host` 命令來查看變數值，例如：`Write-Host $PSLib`。

```powershell
$CurrentLocation = Get-Location
$PSLib = "$CurrentLocation\PSLib.dll"
$Dlls = (
    $PSLib
)
Add-Type -LiteralPath $Dlls
```

這是透過 `Add-Type` 命令並指定要載入的 DLL 絕對路定，這裡的 `$Dlls` 會是個字串陣列，讓我們可以一次載入多個 DLL 組件，透過這樣的方式來將程式碼載入到 PowerShell 執行階段中。

如此一來我們就可以透過以下方式來執行該 DLL 中所提供的方法，用法如下：

```powershell
# 可執行命令
[PSLib.HelloWorld]::Say("Poy Chang")
[PSLib.HelloWorld]::LinqRange(10)
```

這樣是不是大大提高了使用的彈性，並且可以讓我們使用熟悉的 C# 來擴充功能。

### 替代作法

上面有提到 PowerShell 預設會載入 `System.dll`，因此我們也可以使用 `Reflection` 反射的方式來載入 DLL 組件，用法如下：

```powershell
$CurrentLocation = Get-Location
$PSLib = "$CurrentLocation\PSLib.dll"

# 載入指定檔案路徑的 DLL 檔
[Reflection.Assembly]::LoadFile($PSLib)
```

重點在最後一行，透過 `[Reflection.Assembly]::LoadFile()` 方法，將絕對路徑的 DLL 檔載入到 PowerShell 執行階段中。

## 後記

嚴格來說，這裡提供了 3 種載入組件或程式碼的方法，個人是比較偏好使用 `Add-Type -LiteralPath <String[]>` 這種方法，一來簡潔，二來所提供的彈性更大，以上在 Powershell 中執行 C# 程式碼或 DLL 檔的方法，分享給大家。

---

參考資料：

- [組件版本控制](https://docs.microsoft.com/zh-tw/dotnet/framework/app-domains/assembly-versioning?WT.mc_id=DT-MVP-5003022)
- [檢視全域組件快取的內容](https://docs.microsoft.com/zh-tw/dotnet/framework/app-domains/how-to-view-the-contents-of-the-gac?WT.mc_id=DT-MVP-5003022)
- [Using CSharp (C#) code in Powershell scripts](https://blogs.technet.microsoft.com/stefan_gossner/2010/05/07/using-csharp-c-code-in-powershell-scripts/)
- [PowerShell Docs - Add-Type](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.utility/add-type?view=powershell-6?WT.mc_id=DT-MVP-5003022)
