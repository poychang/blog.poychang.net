---
layout: post
title: 傳遞參數來啟動 Windows Service （使用 Topshelf 實作）
date: 2020-03-18 12:40
author: Poy Chang
comments: true
categories: [Dotnet, Develop]
permalink: pass-arguments-to-windows-service-with-topshelf/
---

使用 [Topshelf](https://github.com/topshelf/topshelf) 框架來開發 Windows Service 專案，是一個相當不錯的選擇，他解決的版本更新總是又要用 [sc.exe](https://docs.microsoft.com/zh-tw/windows-server/administration/windows-commands/sc-create) 重新安裝 Windows Service 以及 Debug 不易的問題。然而 Topshelf 框架本質是一個 Console 應用程式，這隻程式最終安裝到 Windows 服務控制管理器（SCM）中，而有時候我們會希望傳遞參數，然後根據參數值來啟動應用程式，但這樣的行為在 SCM 卻無法直接處理，因此要做到此功能，處理方式要稍微有點不一樣。

>本篇作法將會修改 Windows 登陸檔，修改啟動 Windows Service 的執行參數，此方法不僅適用於 Topshelf 框架，也適用於其他開發 Windows Service 的方法。

舉個例子來說，我們要開發一個根據環境變數來切換商業邏輯的 Windows Service，但安裝該 Windows Service 的主機又不能設定環境變數時，很自然的想法就是透過啟動程式時，給他一個參數值，讓後續的商業邏輯能根據該參數值做調整。

在開發時期，我們要測試啟動時傳遞參數這件事情很簡單，可以在 Visual Studio 中設定 `Application arguments` 就好了（參考下圖設定 `-env:Debug` 的地方），但當你將程式安裝成 Windows Service 之後，你是無法直接在介面上手動設定啟動時的相關參數。

![在 Visual Studio 中設定啟動參數](https://i.imgur.com/5xhi94Z.png)

## Topshelf 基本樣貌

先來看看 Topshelf 的基本樣貌，這邊我建立了一個 `App` 類別，將主要的服務邏輯放在這裡面，方便之後管理：

```csharp
public class App
{
    public void Start() { Console.WriteLine("執行服務主要邏輯"); }
    public void Stop() { Console.WriteLine("關閉服務"); }
}
```

接著在 `Main()` 裡面設定該服務的啟動邏輯及相關資訊：

```csharp
public static void Main(string[] args)
{
    HostFactory.Run(configurator =>
    {
        // 設定啟動的主要邏輯程式
        configurator.Service<App>(settings =>
        {
            settings.BeforeStartingService(service => { Console.WriteLine("BeforeStart"); });
            settings.WhenStarted(app => app.Start());
            settings.BeforeStoppingService(service => { service.Stop(); });
            settings.WhenStopped(app => app.Stop());
        });

        // 設定服務名稱及描述
        var serviceName = "Demo Service";
        configurator.SetServiceName($"{serviceName}");
        configurator.SetDisplayName($"{serviceName}");
        configurator.SetDescription($"{serviceName}");

        // 設定發生例外時的處理方式
        configurator.OnException((exception) => { Console.WriteLine(exception.Message); });
    });
}
```

這邊算是起手式，更多關於 Topshelf 框架的使用說明，請參考該[專案網站](http://topshelf-project.com/)。

## 啟動時傳遞參數

有了基礎架構後，我們要先來處理傳入啟動參數這件事，首先要先在 `HostFactory.Run()` 裡面去定義所傳入的參數名稱，這邊假設我們會傳入 `env` 這個參數，相當於啟動該程式時，會是這樣執行的 `DemoService -env:Debug`，後面帶的 `-env:Debug` 就是 Topshelf 所接受的參數格式。

>這邊要注意傳入參數的名稱，名稱大小寫會被視為不同的參數。

```csharp
// 設定執行時所傳入的啟動參數
var env = string.Empty;
configurator.AddCommandLineDefinition(nameof(env), value => { env = value; });
configurator.ApplyCommandLine();
```

這樣我們就可以在 Topshelf 中使用所傳進來的參數值。

## 執行 Windows Service 時加入啟動參數

前面有提到，安裝成 Windows Service 後，Windows 服務控制管理器會直接把該執行檔當作啟動指令，因此無法在後面添加參數，而且 Windows 服務控制管理器沒有介面讓我們去修改相關設定。

但 Windows 服務控制管理器會將啟動的路徑寫到 Windows 登陸檔裡面，以 `DemoService` 來說，登陸檔的路徑會是長這樣 `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\DemoService`，而啟動路徑會放在這底下的 `ImagePath` 屬性中，你可以手動將啟動參數加進去裡面，這樣會讓 Windows 服務控制管理器在啟動該服務時，具有附加啟動參數的效果。

![Windows Service 的執行路徑放在登陸檔中的 ImagePath 屬性中](https://i.imgur.com/W0Vualh.png)

>`ImagePath` 這個屬性值是修改的關鍵！

在 Topshelf 框架中，我們可以這個行為寫在 `AfterInstall()` 這個階段中，讓該服務被安裝完後，由程式去修改啟動時要使用的啟動參數，一樣在 `HostFactory.Run()` 裡面，加入下面這段程式碼，使用 `Microsoft.Win32` 命名空間下的 `Registry` 物件，去修改指定路徑下的登陸檔：

```csharp
// 安裝之後將啟動時所需要的引數寫入 Windows 註冊表中，讓下次啟動時傳遞同樣的引數
configurator.AfterInstall(installHostSettings =>
{
    using (var system = Registry.LocalMachine.OpenSubKey("System"))
    using (var currentControlSet = system.OpenSubKey("CurrentControlSet"))
    using (var services = currentControlSet.OpenSubKey("Services"))
    using (var service = services.OpenSubKey(installHostSettings.ServiceName, true))
    {
        const string REG_KEY_IMAGE_PATH = "ImagePath";
        var imagePath = service?.GetValue(REG_KEY_IMAGE_PATH);
        service?.SetValue(REG_KEY_IMAGE_PATH, $"{imagePath} -env:{env}");
    }
});
```

## 完整範例程式碼

這篇完整的程式碼如下：

```csharp
using System;
using Topshelf;

namespace TopshelfWithArguments
{
    public class App
    {
        public void Start() { Console.WriteLine("執行服務主要邏輯"); }
        public void Stop() { Console.WriteLine("關閉服務"); }
    }

    public class Program
    {
        public static void Main(string[] args)
        {
            HostFactory.Run(configurator =>
            {
                // 設定執行時所傳入的啟動參數
                var env = string.Empty;
                configurator.AddCommandLineDefinition(nameof(env), value => { env = value; });
                configurator.ApplyCommandLine();

                // 設定啟動的主要邏輯程式
                configurator.Service<App>(settings =>
                {
                    settings.BeforeStartingService(service => { Console.WriteLine("BeforeStart"); });
                    settings.WhenStarted(app => app.Start());
                    settings.BeforeStoppingService(service => { service.Stop(); });
                    settings.WhenStopped(app => app.Stop());
                });

                // 設定服務名稱及描述
                var serviceName = "DemoService";
                configurator.SetServiceName($"{serviceName}");
                configurator.SetDisplayName($"{serviceName}");
                configurator.SetDescription($"{serviceName}");

                // 設定發生例外時的處理方式
                configurator.OnException((exception) => { Console.WriteLine(exception.Message); });

                // 安裝之後將啟動時所需要的引數寫入 Windows 註冊表中，讓下次啟動時傳遞同樣的引數
                configurator.AfterInstall(installHostSettings =>
                {
                    using (var system = Registry.LocalMachine.OpenSubKey("System"))
                    using (var currentControlSet = system.OpenSubKey("CurrentControlSet"))
                    using (var services = currentControlSet.OpenSubKey("Services"))
                    using (var service = services.OpenSubKey(installHostSettings.ServiceName, true))
                    {
                        const string REG_KEY_IMAGE_PATH = "ImagePath";
                        var imagePath = service?.GetValue(REG_KEY_IMAGE_PATH);
                        service?.SetValue(REG_KEY_IMAGE_PATH, $"{imagePath} -env:{env}");
                    }
                });
            });
        }
    }
}
```

----------

參考資料：

* [使用 Topshelf 取代 Windows Service 專案](https://dotblogs.com.tw/yc421206/2019/08/30/use_topshelf_replace_windows_service_project)
* [使用 Topshelf 搭配 Quartz.Net 撰寫 Windows Service 排程執行工作](https://blog.yowko.com/topshelf-quartznet-windows-service/)
* [How to pass arguments to windows service while service start using framework Topshelf](https://medium.com/@tocalai/how-to-pass-arguments-to-windows-service-while-service-start-using-framework-topshelf-83da3bde0e64)
* [Topshelf - starting threads based on custom parameters](https://stackoverflow.com/questions/29837596/topshelf-starting-threads-based-on-custom-parameters#29841660)

