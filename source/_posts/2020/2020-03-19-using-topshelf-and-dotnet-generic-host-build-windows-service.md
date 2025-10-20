---
layout: post
title: 使用 Topshelf 與 .NET 泛型主機建立 Windows Service 專案架構
date: 2020-03-19 00:12
author: Poy Chang
comments: true
categories: [Dotnet, Develop]
permalink: using-topshelf-and-dotnet-generic-host-build-windows-service/
---

[上一篇](./pass-arguments-to-windows-service-with-topshelf/)使用 [Topshelf](https://github.com/topshelf/topshelf) 處理了啟動 Windows Service 時要環境參數的問題，為了讓之後用 Topshelf 寫 Windows Service 時，有更一致的寫法，這篇將使用使用 Topshelf 與 .NET 泛型主機架構，來建立專案架構。

之所以想搭配 .NET 泛型主機的架構來建立專案，除了這是個規劃優良的 Builder Pattern 建造者模式，這個架構支援相依性注入、組態設定以及紀錄器等方便後續開發的核心功能，而且 ASP .NET Core 的架構也是使用這樣的架構，因此可以用同樣的思維來開發專案，這個專案架構規劃好之後用起來一定會很順手。

## 起手式 Console 專案

用 Topshelf 開發的 Windows Service 本質是個 Console 應用程式，當然就直接建立一個 Console 專案，這邊主要處理兩件事：

第一件事就是安裝 `Microsoft.Extensions.Hosting` 和 `Topshelf` 套件，前者用來打造泛型主機架構，後者就是開發 Windows Service 囉。

第二件事則是建立設定檔，通常我們會根據環境來套用不同的設定檔，因此這裡我們建立兩個設定檔 `appsettings.json` 和 `appsettings.Development.json`，前者是通用的設定檔，我通常把它當成範本，而後者是當 `DOTNET_ENVIRONMENT` 環境變數是 `Development` 時，會套用此設定檔。

>為什麼是看 `DOTNET_ENVIRONMENT` 這個環境變數，主要是因為等一下用 `Microsoft.Extensions.Hosting` 所提供的預設泛型主機架構時，他預設就會抓 `DOTNET_` 開頭的環境變數，因此會將使用這個環境變數做為來取用不同"環境"（Environment）的設定檔。

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp3.1</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Hosting" Version="3.1.2" />
    <PackageReference Include="Topshelf" Version="4.2.1" />
  </ItemGroup>

  <ItemGroup>
    <None Update="appsettings.json">
      <CopyToOutputDirectory>Always</CopyToOutputDirectory>
    </None>
    <None Update="appsettings.Development.json">
      <CopyToOutputDirectory>Always</CopyToOutputDirectory>
      <DependentUpon>appsettings.json</DependentUpon>
    </None>
  </ItemGroup>

</Project>
```

## 建立 .NET 泛型主機架構

首先我們先建立 `CreateHostBuilder()` 方法，方便之後使用，在這個方法中使用 `Microsoft.Extensions.Hosting` 命名空間中所提供的 `Host` 泛型主機類別，這個類別預先提供了 `CreateDefaultBuilder()` 建立預設設定好哦的泛型主機架構，預先作了以下這些事：

1. 設定泛型主機的預設跟目錄為 `Directory.GetCurrentDirectory()`
2. 泛型主機載入執行環境中 `DOTNET_` 開頭的環境變數
3. 泛型主機載入執行時傳入的啟動參數，也就是 `Main()` 的 `args`
4. 應用程式載入 `appsettings.json` 和 `appsettings.Environment.json` 設定檔，後者的 `Environment` 會去抓 `DOTNET_ENVIRONMENT` 這個環境變數設定值
5. 應用程式載入 `secrets.json` 使用者機密設定，詳請參考[如何使用 Secret Manager 保護 .NET Core 專案的機密設定](./microsoft-user-secret-manager-with-dotnet-core/)
6. 應用程式載入環境變數
7. 應用程式載入啟動參數
8. 設定 `ILoggerFactory` 紀錄器

有了預設的設定，我們還是要稍微修改一些東西：

1. 將啟動參數 `env` 當作 `DOTNET_ENVIRONMENT` 環境變數
2. 設定根目錄

第一點是因為我希望啟動 Windows Service 時，能使用參數來設定環境變數，因為我這邊有些環境不能調整伺服器上的環境變數，程式碼如下（`GetArgumentValue()` 是我另外寫的解析方法，完整內容請參考最下面的範例專案連結）：

```csharp
Environment.SetEnvironmentVariable("DOTNET_ENVIRONMENT", GetArgumentValue(args, "env"));
```

第二點是避免遠端啟動服務時，應用程式抓錯根目錄，造成設定檔載入失敗的問題，因此再設定一次跟目錄位置，程式碼如下：

```csharp
config.SetBasePath(AppContext.BaseDirectory);
```

設定完之後，就可以在 `ConfigureServices()` 裡面設定依賴注入了，基本上我通常至少會注入兩個東西，`AppSettings` 設定檔實體和 `App` 主要邏輯程式。

而 `App` 類別會做為下一階段 Topshelf 所使用的主要邏輯程式，所以這類別會提供 `Start()` 和 `Stop()` 做為 Topshelf 執行或停止主要邏輯程式的動作。

最後一步就是在 `Main()` 中呼叫泛型主機建造者的 `Build()` 方法，將剛剛設定的東西實體化，這階段完整的程式碼如下：

```csharp
public static void Main(string[] args)
{
    var host = CreateHostBuilder(args).Build();
}

public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureHostConfiguration((config) =>
        {
            Environment.SetEnvironmentVariable("DOTNET_ENVIRONMENT", GetArgumentValue(args, "env"));
        })
        .ConfigureAppConfiguration((hostContext, config) =>
        {
            config.SetBasePath(AppContext.BaseDirectory);
        })
        .ConfigureServices((hostContext, services) =>
        {
            services.Configure<AppSettings>(hostContext.Configuration);
            services.AddTransient<App>();
        });
```

## 建立 Windows Service

這篇的另一個重點，使用 Topshelf 建立 Windows Service，這裡我建立了 `Startup` 類別做為 Windows Service 程式架構的核心，`ActivateTopshelf()` 是 Topshelf 架構 Windows Service 的重點部分，這邊你可以根據你 Windows Service 的需要做調整，下面的程式碼已經根據[傳遞參數來啟動 Windows Service （使用 Topshelf 實作）](./pass-arguments-to-windows-service-with-topshelf/)這篇文章，做了使用啟動參數做為環境變數設定的調整。

這樣主程式呼叫 `RunWindowsServiceWithHost()` 靜態方法的時候，就會透過 Topshelf 來執行安裝或是啟動 Windows Service，另外 Topshelf 在執行時，會返回狀態碼，這部分也做了相對應的判斷，讓之後的判斷能方便些。

在 Topshelf 的 `HostFactory.Run()` 裡面，我們會使用前面泛型主機所註冊的 `App` 做為主要邏輯的進入點，使用 `Host.Services.GetRequiredService<App>()` 來調用。

>`GetRequiredService<T>()` 是 .NET Core 內建 DI 容器的方法，這方法確保了該類別已經完成實體化，並且是可以調用的狀態。

```csharp
public class Startup
{
    private static IHost Host { get; set; }
    private static string ServiceName { get; set; }

    public static void RunWindowsServiceWithHost(IHost host)
    {
        Host = host;
        ServiceName = "DemoService";

        switch (ActivateTopshelf())
        {
            case TopshelfExitCode.Ok:
                Console.WriteLine($"{ServiceName} status: Ok");
                break;
            // 略...
            default:
                Console.WriteLine($"{ServiceName} status: Unsupported status...");
                break;
        }
    }

    private static TopshelfExitCode ActivateTopshelf() =>
        HostFactory.Run(configurator =>
        {
            // 設定執行時所傳入的啟動參數
            var env = string.Empty;
            configurator.AddCommandLineDefinition(nameof(env), value => { env = value; });
            configurator.ApplyCommandLine();

            // 設定啟動的主要邏輯程式
            var app = Host.Services.GetRequiredService<App>();
            configurator.Service<App>(settings =>
            {
                settings.ConstructUsing(() => app);
                settings.WhenStarted(app => app.Start());
                settings.BeforeStoppingService(service => { service.Stop(); });
                settings.WhenStopped(app => { app.Stop(); });
            });

            // 設定啟動 Windows Service 的身分
            configurator.RunAsLocalSystem()
                .StartAutomaticallyDelayed()
                .EnableServiceRecovery(rc => rc.RestartService(5));

            // 設定服務名稱及描述
            configurator.SetServiceName($"{ServiceName}");
            configurator.SetDisplayName($"{ServiceName}");
            configurator.SetDescription($"{ServiceName}");

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
```

## 完整的專案架構

最後在回到 `Main()` 中，將 Topshelf 的使用加上去，這樣就完成整個專案架構了，而如果執行時有指定環境變數，執行時可以傳入 `-env:Debug` 像這樣的參數來設定執行環境。

```csharp
public static void Main(string[] args)
{
    var host = CreateHostBuilder(args).Build();
    Startup.RunWindowsServiceWithHost(host));
}
```

最後回顧一下整個專案架構，可分成 3 部分：

1. `CreateHostBuilder()` 這是 .NET 泛型主機的主要部分，會在這裡設定相依性注入，所依賴的服務也會在這邊註冊
2. `Startup` 類別是 Topshelf 安裝和啟動 Windows Service 的主要部分，這裡設定完後不太會更動，因為主要執行的邏輯已經抽到 `App` 這個類別裡面
3. `App` 這裡就是我們設計、開發主要商業邏輯的地方

>本篇完整範例程式碼請參考 [poychang/Demo-Topshelf-With-Generic-Host](https://github.com/poychang/Demo-Topshelf-With-Generic-Host)。

----------

參考資料：

* [.NET 泛型主機](https://docs.microsoft.com/zh-tw/aspnet/core/fundamentals/host/generic-host)
* [Topshelf](http://topshelf-project.com/)
