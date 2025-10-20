---
layout: post
title: 在 PowerShell 中使用 Measure-Command 測量程式或指令的執行時間
date: 2024-03-18 13:39
author: Poy Chang
comments: true
categories: [Dotnet, Develop, PowerShell]
permalink: powershell-measure-command /
---

要分析某些指令或動作所需要花費的執行時間，在 PowerShell 中，您可以使用 `Measure-Command` 這個 Cmdlet 來測量，以下是使用 `Measure-Command` 的使用方式。

> 以下範例主要會以測量建置 .NET 專案所需要花費的時間，因此你可能需要自行建立一個 .NET 專案和安裝 dotnet CLI。

## 測量程式執行時間

若要測量程式的執行時間，請將要測量的程式或指令內容包在大括號中，例如下面這個範例，測量了 `dotnet build` 這個指令在建置專案時的執行時間。

```powershell
# 測量程式執行時間
Measure-Command { dotnet build }
```

![執行結果](https://i.imgur.com/mu4mobj.png)

如果你的指令是寫在 PowerShell 指令檔中，也就是 `.ps1` 檔，則可以用下面這樣的方式來測量該檔案的執行時間：

```powershell
# 測量程式執行時間
Measure-Command { .\my_script.ps1 }
```

如果只想關注測量的秒數，可以這寫執行指令，讓最後的輸出只有測量結果的 `TotalSeconds` 屬性值：

```powershell
# 測量程式執行時間
(Measure-Command { dotnet build }).TotalSeconds
```

## 同時觀看程式輸出

在執行上面的動作時，會發現它只會輸出結果，因為預設情況下 `Measure-Command` 不會輸出程式本身的輸出訊息。如果想要同時查看程式的輸出，可以將該程式的輸出導向至 `Out-Default`，這樣就可以同時看到程式輸出以及測量的結果。

```powershell
# 顯示程式輸出
Measure-Command { dotnet build | Out-Default }
```

## 測量多行指令

以「測量建置 .NET 專案所需要花費的時間」這個情境來說，我們會希望每一次的測量都是重新建置，因此可以在 `dotnet build` 之前加上 `dotnet clean` 這個指令，先清空先前建置的成果，完整的使用方式如下：

```powershell
# 顯示程式輸出
Measure-Command { dotnet clean | Out-Default; dotnet build | Out-Default }
```

由於要測量的內容有兩個動作指令，因此上面會使用 `;` 來分隔兩個動作指令。

這個方式可以運用在測量多行指令的情境，當然你也可以寫在一個 PowerShell 指令擋做複雜指令的測量。

---

參考資料：

* [MS Learn - Measure-Command](https://learn.microsoft.com/zh-tw/powershell/module/microsoft.powershell.utility/measure-command?WT.mc_id=DT-MVP-5003022)
