---
layout: post
title: 如何使用 C# 單元測試 internal 類別
date: 2021-05-20 17:55
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, Test]
permalink: c-sharp-unit-testing-with-internal-access-modifier/
---

在用 C# 開發的方法或類別時，可以用存取修飾詞來限制存取範圍層級，例如用 `internal` 來修飾某個類別只能讓相同專案的程式碼使用，而不開放給其他專案使用，不過 `internal` 也造成了無法讓單元測試專案直接使用該方法或類別，這時候可以怎麼處理呢？

## 存取修飾詞

先來簡單複習一下存取修飾詞的用法，詳請參考[官方說明文件](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers)。

![C# Class 存取範圍](https://i.imgur.com/CN7lJVb.png)

| 已宣告存取範圍       | 意義                                                               |
| -------------------- | ------------------------------------------------------------------ |
| `public`             | 未限制存取                                                         |
| `private`            | 存取限於包含類型                                                   |
| `protected`          | 存取限於包含類別或衍生自包含類別的類型                             |
| `internal`           | 存取限於目前組件                                                   |
| `protected internal` | 存取限於目前組件或衍生自包含類別的類型                             |
| `private protected`  | 存取限於目前組件內包含類別或衍生自包含類別的類型(自 C# 7.2 起可用) |

## 如何測試 internal 的類別

`internal` 的存取範圍僅限於當前的組件，也就是該程式碼所在的專案下，而在撰寫單元測試的時候，都會額外建立一個單元測試專案，再將要測試的對象參考近來，這也就讓單元測試專案"看不見"有標示 `internal` 的存取類別或方法。

若要讓這個有 `internal` 類別或方法的測試對象，讓它能讓單元測試專案"看見"，方法其實很簡單，開啟測試對象的 `.csproj` 專案檔，在裡面加上下列這段程式碼：

```xml
<ItemGroup>
    <AssemblyAttribute Include="System.Runtime.CompilerServices.InternalsVisibleTo">
      <_Parameter1>MyUnitTestProject.Test</_Parameter1>
    </AssemblyAttribute>
</ItemGroup>
```

這段是設定要開放被標示為 `internal` 存取範圍的類別或方法，要給 `MyUnitTestProject.Test` 這個專案存取，因此這裡我們只要改成我們的單元測試專案名稱即可。

大多時候，單元測試專案會和測試對象名稱長很像，通常專案名稱就後面加個 `.Test` 後綴，為了讓這段程式碼更為通用，你可以使用 `$(MSBuildProjectName)` 這個 [MSBuild 保留的屬性變數](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/msbuild-reserved-and-well-known-properties)，讓建置時自動去使用編譯專案名稱去替換，較為通用的程式碼如下：

```xml
<ItemGroup>
    <AssemblyAttribute Include="System.Runtime.CompilerServices.InternalsVisibleTo">
      <_Parameter1>$(MSBuildProjectName).Test</_Parameter1>
    </AssemblyAttribute>
</ItemGroup>
```

### 詳細一點

上面對 `.csproj` 專案檔的修改，在建置時會產生一個 `AssemblyInfo.cs` 檔案，並且包含以下內容：

```csharp
[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("MyUnitTestProject.Test")]
```

這段的作用是影響 CLR （Common Language Runtime) 在處理 `internal` 存取範圍時，讓 `MyUnitTestProject.Test` 可以看的到那些類別，更多資訊可以參考 [System.Runtime.CompilerServices 官方文件](https://docs.microsoft.com/zh-tw/dotnet/api/system.runtime.compilerservices?WT.mc_id=DT-MVP-5003022)。

了解背後的運作後，我們其實也可以手動加入 Assembly Information File，也就是 `AssemblyInfo.cs` 檔案到專案中，手動加入上面的程式碼內容，也會有一樣的效果。

另外，如果你發現加了上面的設定還是沒有效果了話，可以檢查看看 `.csproj` 專案檔中，是否做了下面這種設定，這會設定建置時不產生 `AssemblyInfo.cs` 檔案。

```xml
<PropertyGroup>
    <GenerateAssemblyInfo>false</GenerateAssemblyInfo>
</PropertyGroup>
```

----------

參考資料：

* [C# "internal" access modifier when doing unit testing](https://stackoverflow.com/questions/358196/c-sharp-internal-access-modifier-when-doing-unit-testing)
* [How to Test Your Internal Classes in C#](https://improveandrepeat.com/2019/12/how-to-test-your-internal-classes-in-c/)
* [Unit testing private methods in C#](https://stackoverflow.com/questions/9122708/unit-testing-private-methods-in-c-sharp)
* [MS Docs - 存取修飾詞 (C# 程式設計手冊)](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers?WT.mc_id=DT-MVP-5003022)
* [MS Docs - MSBuild 保留和已知屬性](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/msbuild-reserved-and-well-known-properties?WT.mc_id=DT-MVP-5003022)
