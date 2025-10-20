---
layout: post
title: 在 ASP.NET Core WebAPI 使用 Entity Framework Core 存取資料庫
date: 2017-10-8 16:55
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, SQL, WebAPI]
permalink: asp-net-core-webapi-with-entity-framework-core/
---
後端程式存取資料庫是稀鬆平常的事，透過 Entity Framework Core 來存取資料庫，不僅可以享受 ORM 的開發效率，還可以搭配[擴充套件達成 Unit of Work](https://docs.microsoft.com/zh-tw/ef/core/extensions/unitofwork?WT.mc_id=DT-MVP-5003022) 的效果，本篇將介紹 ASP.NET Core WebAPI 搭配 Entity Framework Core 來處理存取資料庫的作業。

>完整範例程式碼請參考 [poychang/DemoEFCore](https://github.com/poychang/DemoEFCore)。

## 建立專案

建立專案前，先確認一下工具及環境：

* Visual Studio 2017 ([下載頁面](https://www.visualstudio.com/downloads/)) 
* Dotnet Core SDK 2.0 ([下載頁面](https://www.microsoft.com/net/download/core))

我使用 Visual Studio 2017 來建立 ASP.NET Core Web 應用程式，並命名為 `DemoEFCore`。

![建立 ASP.NET Core Web 應用程式 DemoAngularDotnet](https://i.imgur.com/07iiFUz.png)

新增時選擇 Web API 專案範本，執行這個範本時，不會產生任何前端頁面的程式碼，這樣讓我們專注在後端的發展。

![使用 Web API 專案範本](https://i.imgur.com/IgYfDxs.png)

## 安裝套件

Entity Framework Core 可以介接多種資料庫，從 Microsoft SQL Server 大型資料庫到 PostgreSQL NoSQL 資料庫，甚至連 SQLite 都可以支援，更多支援清單請參考[官網文件](https://docs.microsoft.com/zh-tw/ef/core/providers?WT.mc_id=DT-MVP-5003022)。

這裡我們使用 SQLite 做示範。

使用前要先安裝 `Microsoft.EntityFrameworkCore.Sqlite` NuGet 套件，加入 SQLite 資料庫的 Provider，讓 Entity Framework Core 能支援 SQLite 。

>如果要使用其他資料庫，請安裝對應的 Provider，例如要使用 SQL Server 資料庫，請安裝 `Microsoft.EntityFrameworkCore.SqlServer` 套件。

![安裝 Microsoft.EntityFrameworkCore.Sqlite 套件 NuGet](https://i.imgur.com/jOJGN1I.png)

>在 Dotnet Core 2.0 的專案範本中，已參考 `Microsoft.AspNetCore.All`，其中已經包含 `Microsoft.EntityFrameworkCore.Sqlite` 就不需要另外安裝了。

## 建立資料庫模型

這裡會在我們的應用程式中建立一個應用程式層級的資料庫模型，這個資料庫模型會對應到實體資料庫，其中包含資料表、資料欄位設定。

再往下繼續前，須先了解兩個關鍵類別 [DbContext](https://msdn.microsoft.com/zh-tw/library/system.data.entity.dbcontext%28v=vs.113%29.aspx) 和 [DbSet](https://msdn.microsoft.com/zh-tw/library/gg696460%28v=vs.113%29.aspx)。

### DbContext

應用程式主要透過 `DbContext` 物件與資料庫進行連線溝通，對資料庫進行查詢、新增、修改等動作。

首先我們會建立自己的資料庫模型 `MyDbContext`，程式碼很簡短，只做兩件事：

1. 繼承 `DbContext` 使之有連線資料庫等能力
2. 在建構式中接收 `options` 資料庫設定，並由父類別，也就是 `DbContext`，產生實體

```csharp
public class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }
}
```

### DbSet

資料庫裡面最主要的物件就是資料表了，這部分是利用 `DbSet` 物件封裝要處理的資料表，因此每個 `DbSet` 會對應到特定的資料表結構，並包含該資料表的實體資料集合。

程式碼也短短的，做兩件事：

1. 建立對應至資料表結構的資料模型，如 `Employee`
2. 接續 `MyDbContext`，加入 `DbSet` 並指定其型別為 `Employee`

在建立資料模型時，對應的資料型別是我們需要特別注意的，錯誤的型別會造成資料存取失敗，詳細的對照表請參考[官方文件](https://docs.microsoft.com/zh-tw/dotnet/framework/data/adonet/sql-server-data-type-mappings?WT.mc_id=DT-MVP-5003022)。

另外，資料表欄位有些特性是資料庫中特有的，例如 Primary Key、資料長度，這些可以透過 `Data Annotations` 來做設定，詳細資料請參考[官方文件](https://msdn.microsoft.com/zh-tw/library/system.componentmodel.dataannotations.aspx)或[查看原始碼](https://github.com/Microsoft/referencesource/tree/master/System.ComponentModel.DataAnnotations/DataAnnotations)。

這裡使用 Key 來設定 Id 為 Primary Key，並且會自動遞增。

```csharp
public class Employee
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}
```

```csharp
public class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }
    public DbSet<Employee> Employee { get; set; }
}
```

### 小結

使用 Entity Framework Core 建立資料庫模型非常容易上手，但在建立的過程中我們希望要符合以下慣例：

1. `DbContext` 類別名稱為資料庫名稱
2. `DbSet` 屬性名稱為資料表名稱
3. 資料模型的屬性名稱為資料表欄位名稱
4. 資料模型中使用 `Id` 作為主鍵

慣例是可以透過 `Data Annotations` 打破的，使用 `Data Annotations` 來手動指定資料表名稱、欄位名稱等特性。

>除此之外，還可以使用 Fluent API 的方式來設定。

## 設定及注入

建立完資料庫模型後，要和實體資料庫建立連線，在 `appsettings.json` 中增加資料庫連線字串。

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=Data\\MyDatabase.db;"
  }
}
```

>每種資料庫的連線字串都不一樣，可以參考 [The Connection Strings Reference](https://www.connectionstrings.com/) 這個網站查詢連線字串的寫法。

接者在 `Startup.cs` 中的 `ConfigureServices` 注入 `MyDbContext` 服務，並將 `DefaultConnection` 連線字串設定給資料庫模型。

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddDbContext<MyDbContext>(options =>
        options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
    services.AddMvc();
}
```

在應用程式啟動時，呼叫 `dbContext.Database.EnsureCreated()` 確保資料庫模型的初始化是成功的。在這個範例中是使用 SQLite，因此在第一次執行此方法時，會建立一個全新的 `MyDatabase.db` 資料庫。

```csharp
public void Configure(IApplicationBuilder app, MyDbContext dbContext)
{
    app.UseMvc();
    dbContext.Database.EnsureCreated();
}
```

這裡推薦使用 [SQLite Database Browser](http://sqlitebrowser.org/) 來檢視 SQLite 資料庫的變化，非常好用且有免安裝版。透過 SQLite Database Browser 查看 Employee 資料表的畫面如下圖：

![SQLite Database Browser 查看資料表的畫面](https://i.imgur.com/H89CexZ.png)

## 實作 CRUD 的 API

完成了 Entity Framework Core 的主要建置，接下來實作透過 WebAPI 來對資料庫進行 CRUD 動作。

### 注入 DbContext

上一步驟中，已將 MyDbContext 注入到我們的應用程式中，因此可以直接在建構式中注入 MyDbContext 服務，進行資料庫讀寫動作。

```csharp
public class EmployeeController : Controller
{
    private readonly MyDbContext _dbContext;

    public EmployeeController(MyDbContext dbContext)
    {
        _dbContext = dbContext;
    }
	// ...
}
```

### 讀取

```csharp
[HttpGet("{id}")]
public IActionResult Get(int id)
{
    return new JsonResult(_dbContext.Employee.SingleOrDefault(p => p.Id == id));
}
```

### 新增

```csharp
[HttpPost]
public IActionResult Post([FromBody]Employee entity)
{
    _dbContext.Employee.Add(entity);
    _dbContext.SaveChanges();
    return Get(entity.Id);
}
```

### 修改

```csharp
[HttpPut("{id}")]
public IActionResult Put([FromBody]Employee entity)
{
    var oriEmployee = _dbContext.Employee.SingleOrDefault(c => c.Id == entity.Id);
    if (oriEmployee != null)
    {
        _dbContext.Entry(entity).CurrentValues.SetValues(entity);
        _dbContext.SaveChanges();
        return Ok();
    }
    return BadRequest();
}
```

### 刪除

```csharp
[HttpDelete("{id}")]
public IActionResult Delete(int id)
{
    var oriEmployee = _dbContext.Employee.SingleOrDefault(c => c.Id == id);
    if (oriEmployee != null)
    {
        _dbContext.Employee.Remove(oriEmployee);
        _dbContext.SaveChanges();
        return Ok();
    }
    return BadRequest();
}
```

到這裡 Entity Framework Core 的基本使用已做完了，這段 Controller 完整的程式碼請參考[這裡](https://github.com/poychang/DemoEFCore/blob/master/DemoEFCore/Controllers/EmployeeController.cs)。

## 測試 WebAPI

由於本篇是使用 WebAPI 來實作，沒有前端畫面可以操作，這裡推薦使用 [Postman](https://www.getpostman.com/) 來測試 API。

![使用 Postman 測試 API](https://i.imgur.com/ZjkFobW.png)

Entity Framework Core 提供了非常便利的使用方法來存取資料庫，並且透過 ORM 及 LINQ 的優秀特性，讓我們能輕鬆的篩選、查詢資料。 

>本篇完整範例程式碼請參考 [poychang/DemoEFCore](https://github.com/poychang/DemoEFCore)。

----------

參考資料：

* [Getting started with ASP.NET Core MVC and Entity Framework Core using Visual Studio](https://docs.microsoft.com/en-us/aspnet/core/data/ef-mvc/intro?WT.mc_id=DT-MVP-5003022)
* [掀起你的盖头来：Unit Of Work-工作单元](http://www.cnblogs.com/xishuai/p/3750154.html)
* [ASP.NET Core + Angular 4 教學 - Entity Framework Core](https://blog.johnwu.cc/article/asp-net-core-angular-4-%E6%95%99%E5%AD%B8-entity-framework-core.html)
