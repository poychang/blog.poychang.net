---
layout: post
title: .NET 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, CSharp, Dotnet]
permalink: note-dotnet/
---

本篇作為筆記用途，記錄 .NET 參考資料

真正跨平台之前，還是多利用 .NET Portability Analyzer 分析你的專案是否用到了不支援的 API 比較保險

## 指令

- [dotnet 命令列介面 (CLI) 工具](https://docs.microsoft.com/zh-tw/dotnet/core/tools/?WT.mc_id=DT-MVP-5003022)

### 常用指令

- `dotnet run --verbosity normal`
  - 開發時執行程式，並輸出相關執行的資訊
  - `--verbosity` 設定命令的詳細資訊層級。允許的值為 q[uiet]、m[inimal]、n[ormal]、d[etailed] 及 diag[nostic]

## 執行位置

- `AppDomain.CurrentDomain.BaseDirectory`：獲得的是執行的應用程式在哪裡
- `System.Reflection.Assembly.GetExecutingAssembly().Location`：獲得的是目前執行的組件在哪裡
- `System.IO.Directory.GetCurrentDirectory()`：獲得的是在哪裡下執行指令

REF:[檔案目前位置取得方法的不同，而不是不同的檔案目前位置取得方法](https://dotblogs.com.tw/supershowwei/2019/02/04/153701)

## Entity Framework

### Code First

- 教學文(en)：[使用 EF Core 在 Console App 建立 新資料庫](https://docs.microsoft.com/zh-tw/ef/core/get-started/netcore/new-db-sqlite?WT.mc_id=DT-MVP-5003022)
  - 執行以下指令安裝所需套件
  - `dotnet add package Microsoft.EntityFrameworkCore.Sqlite`
  - `dotnet add package Microsoft.EntityFrameworkCore.Design`
  - `dotnet add tool Microsoft.EntityFrameworkCore.Tools.DotNet`
  - 目前還不支援，要手動在 `.csproj` 中增加
  - `<ItemGroup><DotNetCliToolReference Include="Microsoft.EntityFrameworkCore.Tools.DotNet" Version="2.0.0" /></ItemGroup>`
  - 用程式碼表達資料庫及資料表結構，即建立 DbContext
  - 執行以下指令建立資料庫及其資料表
  - `dotnet ef migrations add InitialCreate` 產生 migrations 程式碼
  - `dotnet ef database update` 執行 migrations 程式碼至資料庫

### Data Annotations

教學文(cht)：[建立複雜的 EF Core 資料模型](https://docs.microsoft.com/zh-tw/aspnet/core/data/ef-mvc/complex-data-model?WT.mc_id=DT-MVP-5003022)

- `[Key]` 主鍵
- `[Required]` 必要的屬性
- `[DataType(DataType.Date)]` 用來指定比資料庫內建類型更特殊的資料類型
- `[DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]` 屬性用來明確指定日期格式 \* `[DisplayFormat(NullDisplayText = "No grade")]`
- `[StringLength(50, MinimumLength = 3)]`
- `[Range(0, 5)]`
- `[RegularExpression(@"^[A-Z]+[a-zA-Z''-'\s]*$")]`
- `[Column("FirstName")]`

## Http StatusCode

你可以使用 `StatusCode(???)` 回傳任何 HTTP status code。或者可以使用以下方法：

- Success
  - return `Ok()` ← Http status code 200
  - return `Created()` ← Http status code 201 \* return `NoContent()` ← Http status code 204
- Client Error:
  - return BadRequest()` ← Http status code 400
  - return Unauthorized()`← Http status code 401 * return NotFound()` ← Http status code 404
- 更多方法請參考
  - [ControllerBase](https://docs.microsoft.com/en-us/aspnet/core/api/microsoft.aspnetcore.mvc.controllerbase#Microsoft_AspNetCore_Mvc_ControllerBase?WT.mc_id=DT-MVP-5003022)
  - [StatusCodes.cs](https://github.com/aspnet/HttpAbstractions/blob/dev/src/Microsoft.AspNetCore.Http.Abstractions/StatusCodes.cs)

參考資料：[How to return a specific status code and no contents from Controller?](https://stackoverflow.com/questions/37690114/how-to-return-a-specific-status-code-and-no-contents-from-controller)

## 佈署至 IIS

參考資料：[在使用 IIS 的 Windows 上裝載 ASP.NET Core](https://docs.microsoft.com/zh-tw/aspnet/core/publishing/iis?tabs=aspnetcore2x?WT.mc_id=DT-MVP-5003022)

重點：

- 至 [.NET 網站](https://www.microsoft.com/net/download/windows)下載相關安裝檔
- 下載並安裝 .NET Core Runtime ([v2.0.6 載點](https://www.microsoft.com/net/download/thank-you/dotnet-runtime-2.0.6-windows-x64-installer))
- 下載並安裝 .NET Core Windows Server Hosting 模組
  - 在 .NET 網站中先點選[All Downloads](https://www.microsoft.com/net/download/all)
  - 選擇你的 .NET Core Runtime \* 選擇並下載 Windows 的 Server Hosting Installer ([v2.0.6 載點](https://www.microsoft.com/net/download/thank-you/dotnet-runtime-2.0.6-windows-server-hosting-installer))

## 開發時自動編譯

使用 `dotnet watch`，他會監測檔案是否有異動，並自動為我們編譯專案，[官方 README 文件](https://github.com/aspnet/DotNetTools/blob/dev/src/Microsoft.DotNet.Watcher.Tools/README.md)。

將 `Microsoft.DotNet.Watcher.Tools` 加入 `.csproj` 檔案中，程式碼如下；

```xml
<ItemGroup>
  <DotNetCliToolReference Include="Microsoft.DotNet.Watcher.Tools" Version="2.0.0" />
</ItemGroup>
```

設定後執行 `dotnet resotre` 還原相依套件，接著就可以使用 `dotnet watch` 指令來監測專案，基本執行令對照如下：

<table class="table table-striped">
<thead>
  <tr>
    <th>Command</th>
  <th>Command with watch</th>
  </tr>
</thead>
<tbody>
  <tr>
  <td>dotnet run</td>
  <td>dotnet watch run</td>
  </tr>
  <tr>
  <td>dotnet run -f net451</td>
  <td>dotnet watch run -f net451</td>
  </tr>
  <tr>
  <td>dotnet test</td>
  <td>dotnet watch test</td>
  </tr>
</tbody>
</table>

參考資料：

- [Developing ASP.NET Core apps using dotnet watch](https://docs.microsoft.com/en-us/aspnet/core/tutorials/dotnet-watch?WT.mc_id=DT-MVP-5003022)

## ASP.NET Core 教學 - Middleware

Blog：[ASP.NET Core 教學 - Middleware](https://blog.johnwu.cc/article/asp-net-core-middleware.html)

1. 建立 Middleware
2. 註冊 Middleware

參考 Gist

- [ASP.NET Core Middleware 存取 SPA 網頁資源](https://gist.github.com/poychang/c98f5b35e11f56ad22ff6de6ab09974d)
- [ASP.NET Core Middleware 限制未授權的 API 呼叫](https://gist.github.com/poychang/60570f178dfb1e4566b45b5b83589b01)

## ASP.NET Core 框架揭秘 by Artech

[http://www.cnblogs.com/artech/p/inside-asp-net-core-1.html](http://www.cnblogs.com/artech/p/inside-asp-net-core-1.html)

## ASP.NET Core 原始碼閱讀筆記 by Bill Shooting

- [ASP.NET Core 源码阅读笔记(1) ---Microsoft.Extensions.DependencyInjection](http://www.cnblogs.com/bill-shooting/p/5540665.html)
- [ASP.NET Core 源码阅读笔记(2) ---Microsoft.Extensions.DependencyInjection 生命周期管理](http://www.cnblogs.com/bill-shooting/p/5550198.html)
- [ASP.NET Core 源码阅读笔记(3) ---Microsoft.AspNetCore.Hosting](http://www.cnblogs.com/bill-shooting/p/SourceCode_Hosting.html)
- [第四篇本来准备写 Server 的，后来发现功力不够，就搁置了](#)
- [ASP.NET Core 源码阅读笔记(5) ---Microsoft.AspNetCore.Routing 路由](http://www.cnblogs.com/bill-shooting/p/5562066.html)

## 計算程式執行時間

需要測量程式執行時間時，可以使用 .NET 提供的 Stopwatch 物件，參考以下寫法：

```csharp
/* 使用 Stopwatch 測量的程式執行時間 */
System.Diagnostics.Stopwatch sw = new System.Diagnostics.Stopwatch();
// ========================================
sw.Reset(); // 碼表歸零
sw.Start(); // 碼表開始計時
/* 要測量的程式區段 */
sw.Stop(); // 碼錶停止
System.Diagnostics.Debug.WriteLine("程式區段執行時間");
System.Diagnostics.Debug.WriteLine(sw.Elapsed.TotalMilliseconds.ToString());    // 輸出執行時間(毫秒)
System.Diagnostics.Debug.WriteLine(sw.Elapsed.TotalSeconds.ToString());         // 輸出執行時間(秒)
// ========================================
```

## .NET 實作支援

參考資料：[.NET Standard](https://docs.microsoft.com/zh-tw/dotnet/standard/net-standard?WT.mc_id=DT-MVP-5003022)

下表列出所有 .NET Standard 版本和支援的平台：
<table class="table table-striped">
  <thead>
    <tr>
      <th>.NET Standard</th>
      <th>1.0</th>
      <th>1.1</th>
      <th>1.2</th>
      <th>1.3</th>
      <th>1.4</th>
      <th>1.5</th>
      <th>1.6</th>
      <th>2.0</th>
      <th>2.1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>.NET Core</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>2.0</td>
      <td>3.0</td>
    </tr>
    <tr>
      <td>.NET Framework</td>
      <td>4.5</td>
      <td>4.5</td>
      <td>4.5.1</td>
      <td>4.6</td>
      <td>4.6.1</td>
      <td>4.6.1</td>
      <td>4.6.1</td>
      <td>4.6.1</td>
      <td>不適用</td>
    </tr>
  </tbody>
</table>

>請注意！.NET Framework 不支援 .NET Standard 2.1 或更新版本。

開發多目標架構的程式時，可以透過 [C# 前置處理器指示詞](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/preprocessor-directives/index?WT.mc_id=DT-MVP-5003022)來設定該段程式碼只會在指定的目標架構下進行編譯，用法參考如下：

```csharp
public class MyClass
{
    static void Main()
    {
#if NET40
        WebClient _client = new WebClient();
#else
        HttpClient _client = new HttpClient();
#endif
    }
    //...
}
```

更多目標架構的前置處理器指示詞，請參考[#if (C# 參考)](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/preprocessor-directives/preprocessor-if)這篇官方文件，常用的前置處理器指示詞，請參考下表：

| 目標架構        | 前置處理器指示詞                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------- |
| .NET Framework | `NETFRAMEWORK`, `NET40`, `NET452`, `NET46`, `NET462`, `NET47`, `NET472`, `NET48`                  |
| .NET Standard  | `NETSTANDARD`, `NETSTANDARD1_6`, `NETSTANDARD2_0`, `NETSTANDARD2_1`                               |
| .NET Core      | `NETCOREAPP`, `NETCOREAPP1_0`, `NETCOREAPP1_1`, `NETCOREAPP2_0`, `NETCOREAPP2_2`, `NETCOREAPP3_0` |

>記憶方式：基本上就是 [TFM 目標 Framework](https://docs.microsoft.com/zh-tw/dotnet/standard/frameworks?WT.mc_id=DT-MVP-5003022) 的符號轉成大寫，並將 `.` 改成 `_` 就是了。

## 執行(發佈)模式

- 設定 `<TargetFramework>` 區段的設定值參考資料：[TFM 目標 Framework](https://docs.microsoft.com/zh-tw/dotnet/standard/frameworks?WT.mc_id=DT-MVP-5003022)
- 設定 `<RuntimeIdentifiers>` 區段的設定值參考資料：[.NET Core RID Catalog](https://docs.microsoft.com/zh-tw/dotnet/core/rid-catalog?WT.mc_id=DT-MVP-5003022)

### Framework Dependent Deployment(FDD)

程式碼編譯出來的是 dll，不是預期中的 exe 檔案，必須由電腦安裝的 Dotnet Runtime 去執行對應的程式。

- [官方介紹 Framework Dependent Deployment](https://docs.microsoft.com/en-us/dotnet/core/deploying/deploy-with-vs#framework-dependent-deployment?WT.mc_id=DT-MVP-5003022)
- [Alan Tsai 的學習筆記 - 了解 Framework Dependent Deployment(FDD) 執行(發佈)模式](https://blog.alantsai.net/posts/2017/10/event-net-conf-workshop-02-1-net-core-console-with-fdd-publish)

### Self Contained Deployment(SCD)

要做到自封式部署，可透過修改專案檔 `.csproj` 將裡面的 `PropertyGroup` 改成如下：

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.0</TargetFramework>
    <RuntimeIdentifiers>win-x64;linux-x64</RuntimeIdentifiers>
  </PropertyGroup>
</Project>
```

主要是加上 `RuntimeIdentifiers` 這個設定，上述範例會產生出 Windows x64 和 Linux x64 環境適用的可執行檔。

更多 Runtime IDentifiers 請參考官方文件 [.NET Core RID Catalog](https://docs.microsoft.com/en-us/dotnet/core/rid-catalog?WT.mc_id=DT-MVP-5003022)。

- [官方介紹 Self Contained Deployment](https://docs.microsoft.com/en-us/dotnet/core/deploying/deploy-with-vs#simpleSelf?WT.mc_id=DT-MVP-5003022)
- [Alan Tsai 的學習筆記 - 了解 Self Contained Deployment(SCD) 執行(發佈)模式](http://blog.alantsai.net/2017/10/event-net-conf-workshop-02-2-net-core-console-with-SCD-publish.html)

## 開啟 Dotnet 專案時效能低落的問題

使用 Dotnet CLI 時，如果遇到 `dotnet run` 很慢的情形，通常是該專案下有類似 `node_modules` 資料夾存在，這時需要將 `csproj` 內設定排除 `node_modules` 資料夾，這樣才能讓 `dotnet run` 或 `dotnet build` 速度正常
設定項目如下：

```xml
<PropertyGroup>
  <DefaultItemExcludes>$(DefaultItemExcludes);YOUR_PATH\node_modules\**\*</DefaultItemExcludes>
</PropertyGroup>
```

上面程式碼中請修改 `YOUR_PATH` 成你要的路徑。

從[這個提交](https://github.com/aspnet/websdk/commit/771888b40c9947b86af443238ca9427a10bf23a5#diff-81c6e234d77bce12b4c645c597b860cb)可以看出來上述的問題，是因為斜線打反了 所以會抓到 node_modules 資料夾，造成效能低落。

## Web Depoly

- [下載 Web Deploy 安裝檔](https://www.microsoft.com/zh-tw/download/details.aspx?id=43717)
- [ASP.NET MVC - 使用 Web Deploy 佈署 MVC 應用程式到 IIS](http://blog.sanc.idv.tw/2014/08/aspnet-web-deploymvciis.html)

## 判斷 Windows 目前安裝的 .NET Framework 版本

REF: [如何：判斷安裝的 .NET Framework 版本](https://docs.microsoft.com/zh-tw/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed?WT.mc_id=DT-MVP-5003022)

1. `regedit.exe`
2. `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full`
3. 查看 `Release` 的 DWORD 值

| Release DWORD 的值                | 版本                                                                      |
| -------------------------------- | ------------------------------------------------------------------------- |
|378389                            | .NET Framework 4.5                                                        |
|378675                            | 隨 Windows 8.1 或 Windows Server 2012 R2 安裝的 .NET Framework 4.5.1        |
|378758                            | Windows 8、Windows 7 SP1 或 Windows Vista SP2 上安裝的 .NET Framework 4.5.1 |
|379893                            | .NET Framework 4.5.2                                                      |
|僅限 Windows 10 系統：393295<br /><br /> 所有其他作業系統版本：393297                       | .NET Framework 4.6   |
|僅限 Windows 10 11 月更新系統：394254<br /><br /> 所有其他作業系統版本：394271               | .NET Framework 4.6.1 |
|Windows 10 年度更新版及 Windows Server 2016：394802<br /><br /> 所有其他作業系統版本：394806 | .NET Framework 4.6.2 | 
|僅限 Windows 10 Creators Update：460798<br/><br/> 所有其他作業系統版本：460805              | .NET Framework 4.7   |
|僅限 Windows 10 Fall Creators Update：461308<br/><br/> 所有其他作業系統版本：461310         | .NET Framework 4.7.1 |
|僅限 Windows 10 2018 4 月更新：461808<br/><br/> 所有其他作業系統版本：461814                 | .NET Framework 4.7.2 |

## 單元測試命名方法

http://teddy-chen-tw.blogspot.com/2016/05/blog-post_12.html

- 待測函數名稱加上測試狀態與預期行為
  - `MethodName_StateUnderTest_ExpectedBehavior`
  - 函數名稱（method name）、執行測試案例的狀態（state under test），以及預期行為（expected behavior）
  - 開發人員比較容易從測試案例的名字去推敲這個測試案例的用途，有助於縮短除錯的時間。
- GWT 格式
  - `Given_StateUnderTest_When_ActionUnderTest_Then_ExpectedOutcomes`
  - 行為驅動開發（Behavior-Driven Development；BDD） 普遍使用的 Given-When-Then 格式做為單元測試案例的名稱
  - 接近口語但是寫起來卻是一長串

> C# 的測試名稱可以用中文來寫，更容易閱讀。

## Class 類別

在 C# 中，所有的程式碼都必須寫在 class 裡面，並放置於副檔名為 `*.cs` 的檔案中。

![C# Class 存取範圍](https://i.imgur.com/CN7lJVb.png)

<table class="table">
<thead>
  <tr>
    <th>已宣告存取範圍</th>
    <th>意義</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>public</td>
    <td>未限制存取</td>
  </tr>
  <tr>
    <td>protected</td>
    <td>存取限於包含類別或衍生自包含類別的類型</td>
  </tr>
  <tr>
    <td>internal</td>
    <td>存取限於目前組件</td>
  </tr>
  <tr>
    <td>protected internal</td>
    <td>存取限於目前組件或衍生自包含類別的類型</td>
  </tr>
  <tr>
    <td>private</td>
    <td>存取限於包含類型</td>
  </tr>
  <tr>
    <td>private protected</td>
    <td>存取限於目前組件內包含類別或衍生自包含類別的類型(自 C# 7.2 起可用)</td>
  </tr>
</tbody>
</table>

REF: [存取範圍層級 (C# 參考)](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/keywords/accessibility-levels?WT.mc_id=DT-MVP-5003022)

<table class="table table-striped">
    <thead>
        <tr>
            <th>Package 組件</th>
            <th colspan="4">內部組件 Inside Assembly</th>
            <th colspan="3">外部組件 Outside Assembly</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>修飾詞</td>
            <td>基礎類別</td>
            <td>繼承類別</td>
            <td>繼承成員</td>
            <td>其他類別</td>
            <td>繼承類別</td>
            <td>繼承成員</td>
            <td>其他類別</td>
        </tr>
        <tr>
            <td>public</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
        </tr>
        <tr>
            <td>protected internal</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
            <td>X</td>
            <td>X</td>
        </tr>
        <tr>
            <td>internal</td>
            <td>O</td>
            <td>O</td>
            <td>X</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
            <td>O</td>
        </tr>
        <tr>
            <td>protected</td>
            <td>O</td>
            <td>O</td>
            <td>X</td>
            <td>X</td>
            <td>O</td>
            <td>X</td>
            <td>X</td>
        </tr>
        <tr>
            <td>private</td>
            <td>O</td>
            <td>X</td>
            <td>X</td>
            <td>X</td>
            <td>X</td>
            <td>X</td>
            <td>X</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th>private protected (C# 7.2)</th>
            <th>O</th>
            <th>O</th>
            <th>X</th>
            <th>X</th>
            <th>X</th>
            <th>X</th>
            <th>X</th>
        </tr>
    </tfoot>
</table>

## 取得當前名稱空間、類名和方法名稱

```csharp
public string GetMethodInfo()
{
    var info = string.Empty;

    // 取得當前方法命名空間
    info += "命名空間名:" + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Namespace + "\n";
    // 取得當前方法類全名，包括命名空間
    info += "類名:" + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.FullName + "\n";
    // 取得當前方法名
    info += "方法名:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\n";
    info += "\n";

    // 父方法
    System.Diagnostics.StackTrace ss = new System.Diagnostics.StackTrace(true);
    System.Reflection.MethodBase mb = ss.GetFrame(1).GetMethod();
    // 取得父方法命名空間
    info += mb.DeclaringType.Namespace + "\n";
    // 取得父方法類名
    info += mb.DeclaringType.Name + "\n";
    // 取得父方法類全名
    info += mb.DeclaringType.FullName + "\n";
    // 取得父方法名
    info += mb.Name + "\n";

    return info;
}
```

## LINQ

- REF: [依據執行方式將標準查詢運算式分類](https://docs.microsoft.com/zh-tw/previous-versions/visualstudio/visual-studio-2008/bb882641(v=vs.90)?WT.mc_id=DT-MVP-5003022)
- REF: [Enumerable Class](https://docs.microsoft.com/zh-tw/dotnet/api/system.linq.enumerable?view=netcore-2.1&WT.mc_id=DT-MVP-5003022)

幾乎所有返回類型為 `IEnumerable<T>` 或 `IOrderedEnumerable<TElement>` 的標準查詢運算符都以延遲方式執行。如下表我們可以看到 `where` 時，返回的IEnumerable是延遲加載的。

標準查詢運算子                  | 傳回型別                      | 立即執行 | 延後資料流執行 | 延後非資料流執行
----------------------------- | ---------------------------- | ------ | ------------ | -------------
`Aggregate`                   | TSource                      | √      |              |
`All<TSource>`                | Boolean                      | √      |              |
`Any`                         | Boolean                      | √      |              |
`AsEnumerable<TSource>`       | IEnumerable<T>               |        | √            |
`Average`                     | 單一數值                      | √      |              |
`Cast<TResult>`               | IEnumerable<T>               |        | √            |
`Concat<TSource>`             | IEnumerable<T>               |        | √            |
`Contains`                    | Boolean                      | √      |              |
`Count`                       | Int32                        | √      |              |
`DefaultIfEmpty`              | IEnumerable<T>               |        | √            |
`Distinct`                    | IEnumerable<T>               |        | √            |
`ElementAt<TSource>`          | TSource                      | √      |              |
`ElementAtOrDefault<TSource>` | TSource                      | √      |              |
`Empty<TResult>`              | IEnumerable<T>               | √      |              |
`Except`                      | IEnumerable<T>               |        | √            | √
`First`                       | TSource                      | √      |              | 
`FirstOrDefault`              | TSource                      | √      |              | 
`GroupBy`                     | IEnumerable<T>               |        |              | √
`GroupJoin`                   | IEnumerable<T>               |        | √            | √
`Intersect`                   | IEnumerable<T>               |        | √            | √
`Join`                        | IEnumerable<T>               |        | √            | √
`Last`                        | TSource                      | √      |              |
`LastOrDefault`               | TSource                      | √      |              |
`LongCount`                   | Int64                        | √      |              |
`Max`                         | 單一數值、TSource 或 TResult  | √       |              |
`Min`                         | 單一數值、TSource 或 TResult  | √       |              |
`OfType<TResult>`             | IEnumerable<T>               |        | √            |
`OrderBy`                     | IOrderedEnumerable<TElement> |        |              | √
`OrderByDescending`           | IOrderedEnumerable<TElement> |        |              | √
`Range`                       | IEnumerable<T>               |        | √            |
`Repeat<TResult>`             | IEnumerable<T>               |        | √            |
`Reverse<TSource>`            | IEnumerable<T>               |        |              | √
`Select`                      | IEnumerable<T>               |        | √            |
`SelectMany`                  | IEnumerable<T>               |        | √            |
`SequenceEqual`               | Boolean                      | √      |              |
`Single`                      | TSource                      | √      |              |
`SingleOrDefault`             | TSource                      | √      |              |
`Skip<TSource>`               | IEnumerable<T>               |        | √            |
`SkipWhile`                   | IEnumerable<T>               |        | √            |
`Sum`                         | 單一數值                      | √      |              |
`Take<TSource>`               | IEnumerable<T>               |        | √            |
`TakeWhile`                   | IEnumerable<T>               |        | √            |
`ThenBy`                      | IOrderedEnumerable<TElement> |        |              | √
`ThenByDescending`            | IOrderedEnumerable<TElement> |        |              | √
`ToArray<TSource>`            | TSource 陣列                 | √       |             |
`ToDictionary`                | Dictionary<TKey, TValue>     | √      |              |
`ToList<TSource>`             | IList<T>                     | √      |              |
`ToLookup`                    | ILookup<TKey, TElement>      | √      |              |
`Union`                       | IEnumerable<T>               |        | √            |
`Where`                       | IEnumerable<T>               |        | √            |

## Threads vs. Tasks 

### Thread
Thread 類別產生的是一個 OS-level thread 擁有自己的堆疊和內容，擁有比較高的控制權，可對執行緒停止、暫止、恢復執行等等......。可指定為前台執行緒或是背景執行緒。還可指定堆疊大小，各執行緒的文化特性。問題在於 Thread 類別產生的執行緒，是屬於 OS 層級，所以成本消耗比較大。

### ThreadPool
.NET 執行緒池，是指由 CLR 管理的執行緒池，當一個執行緒被使用完畢後並不會立刻銷毀，所以在執行緒池當中會存在一些沒有被銷毀的執行緒，而當應用程式需要一個新的執行緒時，就可以從執行緒池中直接獲取一個已經存在的執行緒。

.NET 執行緒池你可以控制執行緒池的大小，但是沒辦法控制執行緒池何時開始執行工作。並且執行緒池所有執行緒，都是屬於背景執行緒。

### Task
執行緒池的使用還是有些許缺點，例如並不知道操作什麼時候會結束，無法有回傳值。所以 .NET Framework 提供了一個 Task 的概念，Task 可以知道工作什麼時候結束，而且結束的時候可以回傳一個 Result。  Task 雖然是一個非同步的概念，但是依然可以使用 wait() 的方法，讓程式停在 Wait 的地方同步執行。當 Tasks 執行在 ThreadPool 時，如果執行的時間太長，且工作量又很多，也會導致執行緒池滿載 (基本上不太可能)，因此 Task 有提供 LongRunning option，讓 TaskScheduler 知道這是一件很長的工作，所以會建立一個新的執行緒，而不會從執行緒池中取得執行緒。

>Task 幾乎是非同步執行的最好選擇，提供了很多強而有力的 API，且可避免 OS-level Thread 的成本消耗。

參考來源：http://blog.slaks.net/2013-10-11/threads-vs-tasks/

## HttpClient

REF:
- [使用 HttpClient 來存取 GET,POST,PUT,DELETE,PATCH 網路資源](https://blog.yowko.com/httpclient/)
- [探討 HttpClient 可能的問題](https://blog.yowko.com/httpclient-issue/)

### GET

```csharp
var client = new HttpClient() { BaseAddress= new Uri("http://xxx/") };
// 使用 async 方法從網路 url 上取得回應
using (var response = await client.GetAsync("posts"))
// 將網路取得回應的內容設定給 httpcontent，可省略，直接使用 response.Content
using (var content = response.Content)
{
    // 將 httpcontent 轉為 string
    var result = await content.ReadAsStringAsync();
    // linqpad 顯示資料用
    if (result != null)
        result.Dump();
}
```

```csharp
var client = new HttpClient() { BaseAddress = new Uri("xxx/") };
//使用 async 方法從網路 url 上取得回應
var response = await client.GetAsync("posts");
//如果 httpstatus code 不是 200 時會直接丟出 exception
response.EnsureSuccessStatusCode();
// 將 response 內容 轉為 string
string result = await response.Content.ReadAsStringAsync();
// linqpad 顯示資料用
result.Dump();
```

使用 `SendAsync` 的寫法：

```csharp
var client = new HttpClient() { BaseAddress = new Uri("xxx/") };
//指定 request 的 method 與 detail url
using (var request = new HttpRequestMessage(HttpMethod.Get, "posts"))
{
    // 發出 post 並將回應內容轉為 string 再透過 linqpad 輸出
    await client.SendAsync(request)
        .ContinueWith(responseTask =>
        {
            responseTask.GetAwaiter().GetResult().Content.ReadAsStringAsync().Dump();
        });
}
```

### POST

```csharp
var client = new HttpClient(){BaseAddress=new Uri("https://xxx/")};
// 指定 authorization header
client.DefaultRequestHeaders.Add("authorization", "token {api token}");
    
// 準備寫入的 data (自己建立的型別)
var postData = new PostData() { userId = 123422, title = "data 中文", body = "data test body 中文" };
// 將 data 轉為 json
var json = JsonConvert.SerializeObject(postData);
// 將轉為 string 的 json 依編碼並指定 content type 存為 httpcontent
var contentPost = new StringContent(json, Encoding.UTF8, "application/json");
// 發出 post 並取得結果
var response = client.PostAsync("test", contentPost).GetAwaiter().GetResult();
// 將回應結果內容取出並轉為 string 再透過 linqpad 輸出
response.Content.ReadAsStringAsync().GetAwaiter().GetResult().Dump();
```

使用 `SendAsync` 的寫法：

```csharp
HttpClient client = new HttpClient();
// 指定 base url 
client.BaseAddress = new Uri("https://xxx/");
// 指定 authorization header
client.DefaultRequestHeaders.Add("authorization", "token {api token}");
// 指定 request 的 method 與 detail url
HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "data/test");
// 準備寫入的 data
PostData postData = new PostData() { userId = 1, title = "data 中文", body = "data test body 中文" };
// 將 data 轉為 json
string json = JsonConvert.SerializeObject(postData);
// 將轉為 string 的 json 依編碼並指定 content type 存為 httpcontent
request.Content = new StringContent(json, Encoding.UTF8, "application/json");
// 發出 post 並將回應內容轉為 string 再透過 linqpad 輸出
await client.SendAsync(request)
    .ContinueWith(responseTask =>
    {
        responseTask.GetAwaiter().GetResult().Content.ReadAsStringAsync().Dump();
    });
```

### Proxy

```csharp
// 建立 HttpClientHandler
var handler = new HttpClientHandler()
{
    // 指定 proxy uri
    Proxy = new WebProxy("http://127.0.0.1:8888"),
    // 指定 proxy Credentials
    Credentials = new NetworkCredential("{username}", "{password}"),
    // 使用 proxy
    UseProxy = true,
};
//建立 HttpClient
var client = new HttpClient(handler) { BaseAddress = new Uri("https://jsonbin.org/yowko/") };
// 指定 authorization header
client.DefaultRequestHeaders.Add("authorization", "token {api token}");
// 準備寫入的 data
var postData = new PostData() { userId = 1, title = "yowko1", body = "yowko test body 中文" };
// 將 data 轉為 json
var json = JsonConvert.SerializeObject(postData);
// 將轉為 string 的 json 依編碼並指定 content type 存為 httpcontent
var contentPost = new StringContent(json, Encoding.UTF8, "application/json");
// 發出 post 並取得結果
var response = await client.PostAsync("test", contentPost);
// 將回應結果內容取出並轉為 string 再透過 linqpad 輸出
response.Content.ReadAsStringAsync().GetAwaiter().GetResult().Dump();
```

## DateTime

注意 `2019/06/20 13:20:30` 這個時間格式為 `yyyy/MM/dd HH:mm:ss` 的格式，其中"小時"容易搞混，`hh` 表示 12 小時制的時間，應該要用 `HH` 表示 24 小時制。

使用時間格式的通用轉換方法：

```csharp
var dateString = "2019/06/20";
var date = DateTime.ParseExact(sDate , "yyyy/MM/dd", null, System.Globalization.DateTimeStyles.AllowWhiteSpaces);
```

| 時間格式 | 說明               |
| ------ | ------------------ |
| y      | 年份                |
| M      | 月份                |
| d      | 日期                |
| h / H  | 12 小時制 / 24 小時制 |
| m      | 分鐘                |
| s      | 秒                  |



---

參考資料：

- [指令](#指令)
  - [常用指令](#常用指令)
- [執行位置](#執行位置)
- [Entity Framework](#entity-framework)
  - [Code First](#code-first)
  - [Data Annotations](#data-annotations)
- [Http StatusCode](#http-statuscode)
- [佈署至 IIS](#佈署至-iis)
- [開發時自動編譯](#開發時自動編譯)
- [ASP.NET Core 教學 - Middleware](#aspnet-core-教學---middleware)
- [ASP.NET Core 框架揭秘 by Artech](#aspnet-core-框架揭秘-by-artech)
- [ASP.NET Core 原始碼閱讀筆記 by Bill Shooting](#aspnet-core-原始碼閱讀筆記-by-bill-shooting)
- [計算程式執行時間](#計算程式執行時間)
- [.NET 實作支援](#net-實作支援)
- [執行(發佈)模式](#執行發佈模式)
  - [Framework Dependent Deployment(FDD)](#framework-dependent-deploymentfdd)
  - [Self Contained Deployment(SCD)](#self-contained-deploymentscd)
- [開啟 Dotnet 專案時效能低落的問題](#開啟-dotnet-專案時效能低落的問題)
- [Web Depoly](#web-depoly)
- [判斷 Windows 目前安裝的 .NET Framework 版本](#判斷-windows-目前安裝的-net-framework-版本)
- [單元測試命名方法](#單元測試命名方法)
- [Class 類別](#class-類別)
- [取得當前名稱空間、類名和方法名稱](#取得當前名稱空間類名和方法名稱)
- [LINQ](#linq)
- [Threads vs. Tasks](#threads-vs-tasks)
  - [Thread](#thread)
  - [ThreadPool](#threadpool)
  - [Task](#task)
- [HttpClient](#httpclient)
  - [GET](#get)
  - [POST](#post)
  - [Proxy](#proxy)
- [DateTime](#datetime)
