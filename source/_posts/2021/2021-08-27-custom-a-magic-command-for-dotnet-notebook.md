---
layout: post
title: 寫一隻自己的 .NET Notebook 的 Magic Command
date: 2021-08-27 17:09
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: custom-a-magic-command-for-dotnet-notebook/
---

.NET Notebook 中的 Magic Command 可以將複雜的動作包裝成一個指令，內建已經有許多好用的指令可以使用，不過有時候我們會想要自己寫一個指令，讓自己的 Notebook 可以更有效的使用。，這篇文章將詳細介紹如何寫一個自己的 Magic Command。

要在 .NET Notebook 中增加新的 Magic Command 主要是透過安裝 NuGet 套件的方式，因此要寫一隻 Magic Command，就相當於寫一個 NuGet 套件，以下用 Visual Studio 來示範如何建立一個 Magic Command 的 NuGet 套件。

首先，在 Visual Studio 中使用 .NET 5　建立一個全新的 Class Library 專案，並命名為 `DotNetNotebook.SampleMagicCommand`。

接著安裝建立 Magic Command 所相依的 NuGet 套件：

- [`Microsoft.DotNet.Interactive`](https://www.nuget.org/packages/Microsoft.DotNet.Interactive/)
- [`Microsoft.DotNet.Interactive.CSharp`](https://www.nuget.org/packages/Microsoft.DotNet.Interactive.CSharp/)

目前這兩個套件還在 beta 版，所以搜尋套件時必須將 `Include prerelease` 選項勾起來。

![要安裝相依的套件，請將 Include prerelease 選項勾起來](https://i.imgur.com/2Vb72G0.png)

## 套件資訊

安裝完相依套件後，我們先來編輯 `.csproj` 專案檔，設定打包 NuGet 套件所需要的一些套件資訊，詳參考下方的 `PropertyGroup` 區段。

在 `PropertyGroup` 區段中，`IncludeBuildOutput` 和 `IsPackable` 這兩個設定值相當重要，前者設定為 `true` 時，才會將建置所輸出的 dll 封裝到 NuGet 套件中，後者設定為 `true` 時，才代表當前這個 Class Library 專案是可以封裝成 NuGet 套件的。

>不過上述這兩個設定值，在 Class Library 專案中，預設都是 `true`，因此不特別設定也沒差。

因為在安 Magic Command 的時候，背後會去 NuGet 套件中的指定資料夾位置去找 `.dll` 檔來安裝，因此在專案檔中要特別指定將建置輸出的 `.dll` 檔案放到 `interactive-extensions/dotnet` 中，設定方式如下：

```xml
<ItemGroup>
    <None Include="$(OutputPath)/DotNetNotebook.EnvMagicCommand.dll" Pack="true" PackagePath="interactive-extensions/dotnet" />
</ItemGroup>
```

如此一來，用於建置 Magic Command 的 `.csproj` 就設定完成了，完整程式碼如下：

```xml
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <OutputType>Library</OutputType>
        <TargetFramework>net5.0</TargetFramework>
        <IncludeBuildOutput>true</IncludeBuildOutput>
        <IsPackable>true</IsPackable>
        <Authors>Poy Chang</Authors>
        <Version>1.0.0</Version>
        <PackageDescription>Is's sample magic command for .NET Interactive Notebook</PackageDescription>
        <PackageProjectUrl>https://github.com/poychang/DotNetNotebook.SampleMagicCommand</PackageProjectUrl>
        <PublishRepositoryUrl>true</PublishRepositoryUrl>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Microsoft.DotNet.Interactive" Version="1.0.0-beta.21404.3" />
        <PackageReference Include="Microsoft.DotNet.Interactive.CSharp" Version="1.0.0-beta.21404.3" />
    </ItemGroup>

    <ItemGroup>
        <None Include="$(OutputPath)/DotNetNotebook.SampleMagicCommand.dll" Pack="true" PackagePath="interactive-extensions/dotnet" />
    </ItemGroup>

</Project>
```

## 撰寫 Magic Command 指令

前置作業完成後，我們要來開始撰寫 Magic Command 指令了，而要製作 Magic Command 其實只需要實作 `IKernelExtension` 介面即可，

.NET Interactive 核心主要使用 [System.CommandLine](https://github.com/dotnet/command-line-api) 這個函示庫來建立 Magic Command，因此在實作的過程中，我們可以使用這個函示庫來實作我們自己的指令。

>[System.CommandLine](https://github.com/dotnet/command-line-api) 也是一套建立 CLI 指令的套件，透過他可以輕鬆的建立好用的指令工具，並且自動幫你產生 `--help` 文件。

因為在 .NET Notebook 中，會將 `#!` 和 `#` 開頭的指令當作 Magic Command，因此我們在設定這個指令的時候，必須使用像是 `#!sample` 這樣的指令名稱，以下是一個簡單的範例：

```csharp
public class SampleMagicCommand : IKernelExtension
{
    public Task OnLoadAsync(Kernel kernel)
    {
        // 建立指令及參數
        var loadEnvCommand = new Command("#!sample", "Say hello to you")
        {
            new Option<string>(new[]{ "-n", "--name" }, "Your name."),
        };
        // 設定指令的行為
        loadEnvCommand.Handler = CommandHandler.Create(
            async (string name, KernelInvocationContext invocationContext) =>
            {
                // 執行的過程中可輸出訊息
                PocketView outputMessage = PocketViewTags.h3($"Magic Command gets your name, {name}");
                invocationContext.Display(outputMessage);
                // 主要行為邏輯
                var command = new SubmitCode($"Console.WriteLine(\"Hello {name}!\");");
                await invocationContext.HandlingKernel.SendAsync(command);
            });
        // 註冊指令到當前 .NET Notebook 的 Kernel 中
        kernel.AddDirective(loadEnvCommand);

        // 安裝完成後的輸出訊息
        if (KernelInvocationContext.Current is { } context)
        {
            PocketView view = PocketViewTags.div(
                PocketViewTags.code(nameof(SampleMagicCommand)), " is loaded.", PocketViewTags.br,
                "Try it: ", PocketViewTags.code("#!sample -n [your-name]")
            );

            context.Display(view);
        }

        return Task.CompletedTask;
    }
}
```

上面的程式碼範例中，主要的行為邏輯會透過 `SubmitCode()` 的方式，將程式碼送到當前的 Kernel 中執行，藉此達到我們想要把原本寫在 Notebook 中的程式碼封裝起來。

另外要特別一提的是，在輸出訊息的時候，你除了可以使用 `Console.WriteLine()` 之外，還可以使用該 KernelContext 下的 `Display()` 方法來輸出，而 `Display()` 方法會要輸入使用 `PocketViewTag` 來組合出的 dynamic 物件，他的處理方式會長得很像 HTML 的方式，一樣有 `div`、`h1`、`hr`、`li`... 等標籤可以組合，甚至還有 `iframe`。

## 在 .NET Notebook 中使用自訂的 Magic Command

寫好自己的 Magic Command 之後要怎麼使用呢？上面有提到 Magic Command 本身是透過 NuGet 的方式來發布、安裝的，因此我們可以在 .NET Notebook 中使用 `#r "nuget:DotNetNotebook.SampleMagicCommand"` 的方式來安裝該指令，如果這個 NuGet 套件沒有發布到 NuGet.org 上了話，例如該套件是放在本機中，那就要另外使用 `#i nuget:C:\你的套件位置\` 來加入 NuGet 套件來源。

這部分你可以參考 [sample-magic-command.ipynb](https://github.com/poychang/DotNetNotebook.SampleMagicCommand/blob/main/sample-magic-command.ipynb) 這個 Notebook 檔。

實際執行的效果畫面如下：

![實際執行的效果畫面](https://i.imgur.com/u5Fdv20.png)

>本篇完整範例程式碼請參考 [poychang/DotNetNotebook.SampleMagicCommand](https://github.com/poychang/DotNetNotebook.SampleMagicCommand)。

----------

參考資料：

* [Magic Commands](https://github.com/dotnet/interactive/blob/main/docs/magic-commands.md)
* [如何在 .NET Notebook 中使用 .env 檔](https://blog.poychang.net/how-to-use-env-file-in-dotnet-interactive-notebook-load-env-file/)
* [.NET Interactive Notebook 基本玩法](https://blog.poychang.net/play-with-dotnet-interactive-notebook/)
