---
layout: post
title: 如何在 .NET 程式中執行外部 EXE 可執行檔
date: 2020-10-26 17:28
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: how-to-run-external-exe-file-in-dotnet/
---

有時候我們必須在 .NET 的程式中執行外部的 EXE 可執行檔，方便我們調用一些別人已經寫好的功能，這聽起來相當實用，一起來看看吧。

在 .NET 程式環境中要做到這件事情，其實很簡單，過程中你只需要用到 `System.Diagnostics` 底下的 `Process` 類別，然後給他一些啟動資訊就可以了。

`ProcessStartInfo` 啟動資訊的詳細內容，直接[參考官方文件](https://docs.microsoft.com/zh-tw/dotnet/api/system.diagnostics.processstartinfo?WT.mc_id=DT-MVP-5003022)，就有很清楚的說明，下面的範例設定，我想應該適用於大部分的使用情境：

```csharp
var process = new Process
{
    StartInfo = new ProcessStartInfo
    {
        FileName = pathToExe,                    // 執行檔路徑
        Arguments = "--name Poy",                // 執行時傳入的引數
        UseShellExecute = false,                 // 是否要使用作業系統 shell 來啟動處理程序
        CreateNoWindow = false,                  // 是否要在新視窗中啟動處理程序
        WindowStyle = ProcessWindowStyle.Hidden, // 新視窗的顯示方式
        RedirectStandardOutput = true,           // 應用程式的文字輸出是否寫入至 StandardOutput 資料流
        RedirectStandardError = true,            // 應用程式的錯誤輸出是否寫入至 StandardError 資料流
    },
};
```

上面範例的最後兩個設定 `RedirectStandardOutput` 和 `RedirectStandardError` 可以特別注意一下，這關係於是否將該執行檔的輸出，輸出到當前執行視窗的資料流中。但只是這樣設定，你還是看不到輸出資訊的，你必須再使用 `process.StandardOutput.ReadToEnd()` 和 `process.StandardError.ReadToEnd()` 來取得相關輸出。

不過我這邊建議使用非同步的事件處理方式來操作，會比較符合資料流的特性，方法如下：
```csharp
//* Set your output and error (asynchronous) handlers
process.OutputDataReceived += new DataReceivedEventHandler(OutputHandler);
process.ErrorDataReceived += new DataReceivedEventHandler(OutputHandler);
//* Start process and handlers
process.Start();
process.BeginOutputReadLine();
process.BeginErrorReadLine();
process.WaitForExit();
```

```csharp
static void OutputHandler(object sendingProcess, DataReceivedEventArgs outLine)
{
    // Write to console
    Console.WriteLine(outLine.Data);
}
```

前兩行設定該資料流會交由 `OutputHandler` 來處理相關的輸出資料，當然你也可以在這邊多做一些處理，例如將輸出存到 log 存放區去。

基本上常用的操作差不多就這樣囉。

>本篇完整範例程式碼請參考 [poychang/Demo-ExecuteExternalExeApp](https://github.com/poychang/Demo-ExecuteExternalExeApp)。

----------

參考資料：

* [How to run external program via a C# program?](https://stackoverflow.com/questions/3173775/how-to-run-external-program-via-a-c-sharp-program)
* [System.Diagnostics 的 Process 類別使用範例](https://docs.microsoft.com/zh-tw/dotnet/api/system.diagnostics.process?WT.mc_id=DT-MVP-5003022)
