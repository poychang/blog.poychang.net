---
layout: post
title: Unit Test 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, CSharp, Dotnet]
permalink: note-unit-test/
---

本篇作為筆記用途，記錄 .NET Unit Test 參考資料

## Test Execution Workflow

```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
namespace MSTestUnitTests
{
    // 包含MSTest單元測試的類（必要）
    [TestClass]
    public class YourUnitTests
    {
        [AssemblyInitialize]
        public static void AssemblyInit(TestContext context)
        {
            // 在測試運行之前執行一次（選用）
        }

        [ClassInitialize]
        public static void TestFixtureSetup(TestContext context)
        {
            // 對測試類執行一次（選用）
        }

        [TestInitialize]
        public void Setup()
        {
            // 在每次測試之前運行（選用）
        }

        [AssemblyCleanup]
        public static void AssemblyCleanup()
        {
            // 測試運行後執行一次（選用）
        }

        [ClassCleanup]
        public static void TestFixtureTearDown()
        {
            // 在執行該類中的所有測試之後運行一次（選用）
            // 不保證在類進行所有測試後立即執行
        }

        [TestCleanup]
        public void TearDown()
        {
            // 在每次測試後運行（選用）
        }

        // 標記這是一種單元測試方法（必要）
        [TestMethod]
        public void YouTestMethod()
        {
            // 您的測試代碼在這裡
        }
    }
}
```

## Attributes

| MSTest v2.x        | NUnit              | xUnit.net 2.x           | 說明                        |
| ------------------ | ------------------ | ----------------------- | -------------------------- |
| [TestMethod]       | [Test]             | [Fact]                  | 標記測試方法                 |
| [TestClass]        | [TestFixture]      | n/a                     | 標記測試班                   |
| [TestInitialize]   | [SetUp]            | Constructor             | 在每個測試用例之前觸發         |
| [TestCleanup]      | [TearDown]         | IDisposable.Dispose     | 在每個測試用例之後觸發         |
| [ClassInitialize]  | [OneTimeSetUp]     | IClassFixture<T>        | 測試用例開始之前的一次性觸發方法 |
| [ClassCleanup]     | [OneTimeTearDown]  | IClassFixture<T>        | 測試用例結束後的一次性觸發方法  |
| [Ignore]           | [Ignore("reason")] | [Fact(Skip="reason")]   | 忽略測試用例                 |
| [TestProperty]     | [Property]         | [Trait]                 | 在測試上設置任意元數據         |
| [DataRow]          | [Theory]           | [Theory]                | 配置數據驅動的測試            |
| [TestCategory("")] | [Category("")]     | [Trait("Category", "")] | 對測試用例或類進行分類         |


## Assertions

```csharp
// 測試指定的值是否相等。
Assert.AreEqual(28, _actualFuel);
// 測試指定的值是否不相等。與數字的AreEqual相同。
Assert.AreNotEqual(28, _actualFuel);
// 測試指定的對像是否都引用相同的對象
Assert.AreSame(_expectedRocket, _actualRocket);
// 測試指定的對像是否引用了不同的對象
Assert.AreNotSame(_expectedRocket, _actualRocket);
// 測試指定條件是否為真
Assert.IsTrue(_isThereEnoughFuel);
// 測試指定條件是否為假
Assert.IsFalse(_isThereEnoughFuel);
// 測試指定的對像是否為null
Assert.IsNull(_actualRocket);
// 測試指定的對像是否為非null
Assert.IsNotNull(_actualRocket);
// 測試指定的對像是否為預期類型的實例
Assert.IsInstanceOfType(_actualRocket, typeof(Falcon9Rocket));
// 測試指定的對像是否不是type的實例
Assert.IsNotInstanceOfType(_actualRocket, typeof(Falcon9Rocket));
// 測試指定的字符串是否包含指定的子字符串
StringAssert.Contains(_expectedBellatrixTitle, "Bellatrix");
// 測試指定的字符串是否以指定的子字符串開頭
StringAssert.StartsWith(_expectedBellatrixTitle, "Bellatrix");
// 測試指定的字符串是否與正則表達式匹配
StringAssert.Matches("(281)388-0388", @"(?d{3})?-? *d{3}-? *-?d{4}");
// 測試指定的字符串是否與正則表達式不匹配
StringAssert.DoesNotMatch("281)388-0388", @"(?d{3})?-? *d{3}-? *-?d{4}");
// 測試指定的集合是否具有相同的元素，並且順序和數量相同。
CollectionAssert.AreEqual(_expectedRockets, _actualRockets);
// 測試指定的集合是否不具有相同的元素，或者元素的順序和數量是否不同。
CollectionAssert.AreNotEqual(_expectedRockets, _actualRockets);
// 測試兩個集合是否包含相同的元素。
CollectionAssert.AreEquivalent(_expectedRockets, _actualRockets);
// 測試兩個集合是否包含不同的元素。
CollectionAssert.AreNotEquivalent(_expectedRockets, _actualRockets);
// 測試指定集合中的所有元素是否為預期類型的實例
CollectionAssert.AllItemsAreInstancesOfType(_expectedRockets, _actualRockets);
// 測試指定集合中的所有項目是否為非null
CollectionAssert.AllItemsAreNotNull(_expectedRockets);
// 測試指定集合中的所有項目是否唯一
CollectionAssert.AllItemsAreUnique(_expectedRockets);
// 測試指定的集合是否包含指定的元素
CollectionAssert.Contains(_actualRockets, falcon9);
// 測試指定的集合是否不包含指定的元素
CollectionAssert.DoesNotContain(_actualRockets, falcon9);
// 測試一個集合是否是另一個集合的子集
CollectionAssert.IsSubsetOf(_expectedRockets, _actualRockets);
// 測試一個集合是否不是另一個集合的子集
CollectionAssert.IsNotSubsetOf(_expectedRockets, _actualRockets);
// 測試委託指定的代碼是否拋出T類型的確切給定異常
Assert.ThrowsException<ArgumentNullException>(() => new Regex(null));
```

## 指定輸入值

MSTest 可以使用在 `[DataRow]` 來對 `[TestMethod]` 加上多筆測試用的輸入資料，裡如下面的用法：

```csharp
[TestMethod]
[DataRow(08, 07)]
[DataRow(12, 11)]
[DataRow(00, 23)]
public void 執行GetLastHourPeriod會取得上一個小時的區間(int hour, int expectedHour)
{
    var date = new DateTime(2020, 01, 01, hour, 00, 00);
    var result = TimeHelper.GetLastHourPeriod(date);

    Assert.AreEqual(result.StartTime.Hour, expectedHour);
    Assert.AreEqual(result.EndTime.Hour, hour);
}
```

## 並行執行單元測試

可以在單元測試的專案資料夾中加入 `.runsettings` 設定檔，並填寫以下設定：

```xml
<RunSettings>
  <MSTest>
    <Parallelize>
      <Workers>4</Workers>
      <Scope>MethodLevel</Scope>
    </Parallelize>
  </MSTest>
</RunSettings>
```

- Workers 設定執行測試的並行處理數量。若要設定成連續的序列執行，設定成 `0` 即可。
- Scope 指執行的程序是使用 Method Level 或 Class Level。若設定為 Method Level 則所有測試方法都會並行執行，若設定成 Class Level 則類別中的測試方法將採序列執行。如果測試方法之間有相依性，則必須採用 Class Level 的方式來處理。

## .NET 單元測試

我會盡可能使用 MSTest 的方式來寫單元測試，只使用 MSTest 的內建功能，不使用第三方套件。

### IOption

在 .NET 的架構下（非 .NET Framework），你會看到大量使用 Options 模式來處理設定值，如果你的專案中也有使用此模式，可以參考下面的方式來將設定注入至測試方法中。

使用 `Microsoft.Extensions.Options` 這個命名空間中的 `Options.Create()` 靜態方法，讓你可以產生出適合的注入設定物件。

.Net Unit Testing - Mock IOptions<T>
https://stackoverflow.com/questions/40876507/net-core-unit-testing-mock-ioptionst

https://stackoverflow.com/questions/41399526/how-to-initialize-ioptionappsettings-for-unit-testing-a-net-core-mvc-service/41399622

```csharp
using using Microsoft.Extensions.Options;

var appSettings = new AppSettings
    {
        Setting1 = "...",
        Setting2 = "...",
    };
var options = Options.Create(appSettings);
var controller = new MyController(options);
```

### ILogger、IMemoryCache、IHttpClient

使用 `ServiceCollection` 來建立 `ServiceProvider`，並透過 `GetService` 取得需要的物件。

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;

[TestClass]
public class SampleUnitTest
{
    private ILoggerFactory loggerFactory;
    private IMemoryCache memoryCache;
    private IHttpClientFactory httpClientFactory;

    [TestInitialize]
    public void Initialize()
    {
        var services = new ServiceCollection();
        // 註冊 ILoggerFactory
        services.AddSingleton<ILoggerFactory, NullLoggerFactory>();
        // 註冊 IMemoryCache
        services.AddMemoryCache();
        // 註冊 HttpClient 和 HttpClientFactory
        services.AddHttpClient();

        // 建立 ServiceProvider
        var serviceProvider = services.BuildServiceProvider();

        // 取得 ILoggerFactory 和 IMemoryCache
        loggerFactory = _serviceProvider.GetService<ILoggerFactory>();
        memoryCache = serviceProvider.GetService<IMemoryCache>();
        memoryCachhttpClientFactory = serviceProvider.GetService<IHttpClientFactory>();
    }

    [TestMethod]
    public void SampleTest()
    {
        var logger = loggerFactory.CreateLogger<MyController>();
        var controller = new MyController(logger, memoryCache);

        controller.TestSomething();
    }
}
```

---

參考資料：

- [指令](https://blog.yowko.com/unit-test-initialize-cleanup/)
- [Most Complete MSTest Unit Testing Framework Cheat Sheet](https://www.automatetheplanet.com/mstest-cheat-sheet/)
- [使用 MSTest 與 .NET Core 為 C# 進行單元測試](https://docs.microsoft.com/zh-tw/dotnet/core/testing/unit-testing-with-mstest?WT.mc_id=DT-MVP-5003022)
- [Multiple Test Data(DataRow) on MSTest](https://blackie1019.github.io/2017/07/21/Multiple-Test-Data-DataRow-on-MSTest/)
- [Most Complete MSTest Framework Tutorial Using .Net Core](https://www.lambdatest.com/blog/most-complete-mstest-framework-tutorial-using-net-core-2/)
