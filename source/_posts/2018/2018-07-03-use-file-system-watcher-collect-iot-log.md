---
layout: post
title: 傳統機台也可以 IoT：使用 FileSystemWatcher 監看檔案或資料夾變化
date: 2018-07-03 01:07
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, IoT]
permalink: use-file-system-watcher-collect-iot-log/
---

工業 4.0 最早從 2011 年德國的漢諾瓦工業博覽會提出，台灣在 2014 年也提出[生產力 4.0 發展方案](https://1drv.ms/b/s!Aiwtjhj5fofrk_wBNT0wgz6f84dPBw?e=oCGVqM)，不管是哪個 4.0 都會出現 IoT 物聯網的概念，然而大多數現行的機台上，即便有感測器去蒐集資料，但往往只是單純的做 Log 儲存成**檔案**，供後續有心人接續利用，離我們自動化蒐集感測資料，連網上傳資料進行分析作業，有一段不知如何跨越的距離，但其實我們只要做到持續監看 Log 的變化，並轉交由分析系統，傳統的機台也是可以沾點工業 4.0 的光，.NET 提供的 FileSystemWatcher 類別正是讓傳統機台發光的黑魔法。

![使用 FileSystemWatcher 監看機台 Log 檔案的變化](https://i.imgur.com/sEu107A.jpg)

## FileSystemWatcher 基本用法

要做到監看檔案系統的變化，可以透過 `System.IO` 這個命名空間之下的 `FileSystemWatcher` 物件來幫我們簡單達成。

`FileSystemWatcher` 物件使用上有幾個比較重要的屬性：

<table class="table table-striped">
<thead>
  <tr>
    <th>FileSystemWatcher 屬性</th>
    <th>說明</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Path</td>
    <td>設定要監看的資料夾</td>
  </tr>
  <tr>
    <td>NotifyFilter</td>
    <td>設定要監看的變更類型</td>
  </tr>
  <tr>
    <td>Filter</td>
    <td>設定要監看的檔案類型</td>
  </tr>
  <tr>
    <td>IncludeSubdirectories</td>
    <td>是否監看子目錄</td>
  </tr>
  <tr>
    <td>EnableRaisingEvents</td>
    <td>開始或停止監看</td>
  </tr>
</tbody>
</table>

其中 `NotifyFilter` 這個屬性又可以設定監看以下這幾種變更類型：

<table class="table table-striped">
<thead>
  <tr>
    <th>NotifyFilter 選項值</th>
    <th>說明</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>FileName</td>
    <td>檔案名稱的變更</td>
  </tr>
  <tr>
    <td>DirectoryName</td>
    <td>資料夾名稱的變更</td>
  </tr>
  <tr>
    <td>Attributes</td>
    <td>檔案或資料夾的屬性變更</td>
  </tr>
  <tr>
    <td>Size</td>
    <td>檔案或資料夾的尺寸變更</td>
  </tr>
  <tr>
    <td>LastWrite</td>
    <td>檔案或資料夾的最後修改時間變更</td>
  </tr>
  <tr>
    <td>LastAccess</td>
    <td>檔案或資料夾的存取時間變更</td>
  </tr>
  <tr>
    <td>CreationTime</td>
    <td>檔案或資料夾的建立時間變更</td>
  </tr>
  <tr>
    <td>Security</td>
    <td>檔案或資料夾的安全性變更</td>
  </tr>
</tbody>
</table>

`FileSystemWatcher` 物件還有以下四種重要的監看事件，作為驅動我們處理邏輯的觸發：

<table class="table table-striped">
<thead>
  <tr>
    <th>FileSystemWatcher 事件</th>
    <th>說明</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Created</td>
    <td>指定的路徑中，發生檔案或資料夾新增的事件</td>
  </tr>
  <tr>
    <td>Changed</td>
    <td>指定的路徑中，發生檔案或資料夾修改的事件</td>
  </tr>
  <tr>
    <td>Deleted</td>
    <td>指定的路徑中，發生檔案或資料夾刪除的事件</td>
  </tr>
  <tr>
    <td>Renamed</td>
    <td>指定的路徑中，發生檔案或資料夾重新命名的事件</td>
  </tr>
  <tr>
    <td>Error</td>
    <td>發生 FileSystemWatcher 無法監看或內部緩存異常的事件</td>
  </tr>
</tbody>
</table>

知道上述的設定用法後，要寫一隻監看檔案系統變化的程式碼其實就呼之欲出了，直接用程式碼來說明：

```csharp
    public static void Run()
    {
        // 建立一個 FileSystemWatcher 實體，並設定相關屬性
        var watcher = new FileSystemWatcher
        {
            // 設定要監看的資料夾
            Path = "C:\MonitoringFolder",
            // 設定要監看的變更類型，這裡設定監看最後修改時間與修改檔名的變更事件
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName,
            // 設定要監看的檔案類型
            Filter = "*.CSV",
            // 設定是否監看子資料夾
            IncludeSubdirectories = false,
            // 設定是否啟動元件，必須要設定為 true，否則監看事件是不會被觸發
            EnableRaisingEvents = true
        };

        // 設定監看事件對應的處理邏輯
        watcher.Changed += new FileSystemEventHandler(OnChanged);
        watcher.Created += new FileSystemEventHandler(OnChanged);
        watcher.Deleted += new FileSystemEventHandler(OnChanged);
        watcher.Renamed += new RenamedEventHandler(OnRenamed);

        Console.ReadLine();
    }

    // 定義處理邏輯
    private static void OnChanged(object source, FileSystemEventArgs e)
    {
       Console.WriteLine("檔案變更: " +  e.FullPath + " " + e.ChangeType);
    }

    private static void OnRenamed(object source, RenamedEventArgs e)
    {
        Console.WriteLine("檔名變更: {0} 重新命名為 {1}", e.OldFullPath, e.FullPath);
    }
```

## 模擬持續寫入資料

接著我們來模擬一個 IoT 情境，假設我們有一個機台約 1 秒的時間間隔會產生一筆資料，並將資料持續寫進檔案，因此我們先寫一隻作為模擬機台感測到資料，並將資料寫入 Log 中的程式。

這裡假設欄位結構會像這樣：`序號`,`日期`,`數值1`,`數值2`,`數值3`。

```csharp
private static void AppendTextSimulator(string filePah)
{
    var rand = new Random();
    var date = DateTime.Now;
    for (var i = 0; i < 1000; i++)
    {
        Thread.Sleep(rand.Next(1000, 1200));
        using (var sw = File.AppendText(filePah))
        {
            sw.WriteLine($@"{i},{date.ToShortDateString()},{rand.Next(1, 10)},{rand.Next(50, 100)},{(float)rand.Next(1, 10) / 10}");
        }
    }
}
```

上面的程式執行如下：

![產生亂數資料的執行畫面](https://i.imgur.com/AmqlfAd.png)

所產生的資料會長得像這樣：

```
0,7/2/2018,8,79,0.1
1,7/2/2018,9,87,0.3
2,7/2/2018,8,94,0.4
3,7/2/2018,5,63,0.8
```

>完整程式碼請參考 [poychang/Demo-FileSystemWatcher](https://github.com/poychang/Demo-FileSystemWatcher) 中的 ContinuousWriteFileApp 專案。

## 監看檔案變化程式

這裡自己建立了一個 `Watcher` 類別，並在建構式中設定好要監看的相關屬性，參考以下程式碼：

```csharp
public class Watcher
{
    private readonly FileSystemWatcher _watch;
    public Watcher(string watchFolder)
    {
        _watch = new FileSystemWatcher
        {
            // 設定要監看的資料夾
            Path = watchFolder,
            // 設定要監看的變更類型
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName | NotifyFilters.DirectoryName,
            // 設定要監看的檔案類型
            Filter = "*.CSV",
            // 設定是否監看子資料夾
            IncludeSubdirectories = false,
            // 設定是否啟動元件，必須要設定為 true，否則事件是不會被觸發
            EnableRaisingEvents = true
        };
    }
    /// <summary>
    /// 設定監看新增檔案的觸發事件
    /// </summary>
    public Watcher WatchCreated()
    {
        _watch.Created += new FileSystemEventHandler(_Watch_Created);
        return this;
    }
    /// <summary>
    /// 設定監看修改檔案的觸發事件
    /// </summary>
    public Watcher WatchChanged()
    {
        _watch.Changed += new FileSystemEventHandler(_Watch_Changed);
        return this;
    }
    /// <summary>
    /// 設定監看重新命名的觸發事件
    /// </summary>
    public Watcher WatchRenamed()
    {
        _watch.Renamed += new RenamedEventHandler(_Watch_Renamed);
        return this;
    }
    /// <summary>
    /// 設定監看刪除檔案的觸發事件
    /// </summary>
    public Watcher WatchDeleted()
    {
        _watch.Deleted += new FileSystemEventHandler(_Watch_Deleted);
        return this;
    }
    /// <summary>
    /// 當所監看的資料夾有建立文字檔時觸發
    /// </summary>
    private static void _Watch_Created(object sender, FileSystemEventArgs e)
    {
        var sb = new StringBuilder();
        var dirInfo = new DirectoryInfo(e.FullPath);
        sb.AppendLine($"新建檔案於：{dirInfo.FullName.Replace(dirInfo.Name, "")}");
        sb.AppendLine($"新建檔案名稱：{dirInfo.Name}");
        sb.AppendLine($"建立時間：{dirInfo.CreationTime}");
        sb.AppendLine($"目錄下共有：{dirInfo.Parent?.GetFiles().Length} 檔案");
        sb.AppendLine($"目錄下共有：{dirInfo.Parent?.GetDirectories().Length} 資料夾");
        Console.WriteLine(sb.ToString());
    }
    /// <summary>
    /// 當所監看的資料夾有文字檔檔案內容有異動時觸發
    /// </summary>
    private static void _Watch_Changed(object sender, FileSystemEventArgs e)
    {
        var sb = new StringBuilder();
        var dirInfo = new DirectoryInfo(e.FullPath);
        sb.AppendLine($"被異動的檔名為：{e.Name}");
        sb.AppendLine($"檔案所在位址為：{e.FullPath.Replace(e.Name, "")}");
        sb.AppendLine($"異動內容時間為：{dirInfo.LastWriteTime}");
        sb.AppendLine($"最後一筆內容：{File.ReadLines(e.FullPath).Last()}");
        Console.WriteLine(sb.ToString());
    }
    /// <summary>
    /// 當所監看的資料夾有文字檔檔案重新命名時觸發
    /// </summary>
    private static void _Watch_Renamed(object sender, RenamedEventArgs e)
    {
        var sb = new StringBuilder();
        var fileInfo = new FileInfo(e.FullPath);
        sb.AppendLine($"檔名更新前：{e.OldName}");
        sb.AppendLine($"檔名更新後：{e.Name}");
        sb.AppendLine($"檔名更新前路徑：{e.OldFullPath}");
        sb.AppendLine($"檔名更新後路徑：{e.FullPath}");
        sb.AppendLine($"建立時間：{fileInfo.LastAccessTime}");
        Console.WriteLine(sb.ToString());
    }

    /// <summary>
    /// 當所監看的資料夾有文字檔檔案有被刪除時觸發
    /// </summary>
    private static void _Watch_Deleted(object sender, FileSystemEventArgs e)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"被刪除的檔名為：{e.Name}");
        sb.AppendLine($"檔案所在位址為：{e.FullPath.Replace(e.Name, "")}");
        sb.AppendLine($"刪除時間：{DateTime.Now}");
        Console.WriteLine(sb.ToString());
    }
}
```

其實主要的程式邏輯和第一段的基本用法沒有甚麼不同，只是封裝成一個自訂的類別，然後加入了鏈接設定的技巧，這鏈接的處理方式，讓我在使用次類別時，能更簡單的調用想要監看的事件：

```csharp
static void Main(string[] args)
{
    var monitoringPath = @"C:\TestFileWatcher\";
    Console.WriteLine("Monitoring file changed in target folder.");
    Console.WriteLine($"Target Folder: {monitoringPath}");

    // 透過鏈接的技巧可以一路用 . 的方式來加入要監看的事件
    new Watcher(monitoringPath)
        .WatchCreated()
        .WatchChanged();

    Console.ReadLine();
}
```

>完整程式碼請參考 [poychang/Demo-FileSystemWatcher](https://github.com/poychang/Demo-FileSystemWatcher) 中的 FileSystemWatcherConsoleApp 專案。

最後可以先執行 ContinuousWriteFileApp 專案，模擬持續寫入資料到指定檔案，再執行 FileSystemWatcherConsoleApp 專案，監看檔案的變化，並只輸出檔案中最後一筆紀錄。

![執行 ContinuousWriteFileApp 專案](https://i.imgur.com/yFK1fU4.png)

透過這樣的模擬情境，對於早就有感測器，也早就會吐出相關的資料出來的老舊機台，我們只要持續監控 Log 的變化，回拋分析系統，老機台也可以 4.0 唷。

>本篇完整範例程式碼請參考 [poychang/Demo-FileSystemWatcher](https://github.com/poychang/Demo-FileSystemWatcher)。

----------

參考資料：

* [Wiki - 工業 4.0](https://zh.wikipedia.org/wiki/%E5%B7%A5%E6%A5%AD4.0)
* [Wiki - 電腦整合製造](https://zh.wikipedia.org/wiki/%E9%9B%BB%E8%85%A6%E6%95%B4%E5%90%88%E8%A3%BD%E9%80%A0)
* [FileSystemWatcher Class](https://docs.microsoft.com/zh-tw/dotnet/api/system.io.filesystemwatcher?view=netcore-2.0&WT.mc_id=DT-MVP-5003022)
* [C# - 使用 FileSystemWatcher 來監控資料夾下的文件](https://dotblogs.com.tw/dc690216/archive/2010/09/18/17801.aspx)
* [Github - dotnet/corefx - FileSystemWatcher.cs](https://github.com/dotnet/corefx/blob/master/src/System.IO.FileSystem.Watcher/src/System/IO/FileSystemWatcher.cs#L19:26)
