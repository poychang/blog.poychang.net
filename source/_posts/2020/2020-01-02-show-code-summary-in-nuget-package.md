---
layout: post
title: 在 NuGet 套件中加入 XML 文件註解
date: 2020-01-02 21:12
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: show-code-summary-in-nuget-package/
---

寫程式的時候要養成寫好註解的習慣，讓後續接手的開發者能容易的知道該段程式碼在做甚麼，開發通用的套件時也是一樣，讓開發者能在使用你所打造的 API 時，能透過 XML 文件註解（C# XML Documentation Comments）來清楚知道該 API 的用途是什麼，這樣可以提升軟體品質，且有助於開發效率。

在開發 .NET 應用程式時，你可以在屬性、方法、類別上面使用 `<summary>` 標籤來撰寫註解（如下程式碼），如果你在 Visual Studio 中開發並參考到有這樣寫註解的方法，你會清楚的這個註解。

```csharp
public class HelloWorld
{
    /// <summary>
    /// 和世界說哈囉
    /// </summary>
    public void SayHello()
    {
        Console.WriteLine($"Hello World");
    }
}
```

這個種格式的註解可以用來產生 XML 註解文件，讓支援讀取該註解文件的 IDE 顯示更多相關資訊，例如讓 Visual Stdio 強大的 [IntelliSense](https://docs.microsoft.com/zh-tw/visualstudio/ide/using-intellisense) 藉此讀取並列出成員、參數資訊等相關資訊，讓之後的使用更加方便。

不過單純只是這樣寫註解，就直接將該類別庫封裝成 NuGet 套件是不會產生 XML 註解文件的。

## 使用介面

之前的資料通常會說到要產生 XML 註解文件，可以在專案檔上按滑鼠右鍵，開啟專案檔設定的視窗，然後將 `XML documentation file` 選項打勾（如下畫面），讓 Visual Studio 在建置的時候，將所撰寫的 XML 註解文件給產生出來。

![使用 Visual Studio 設定產生 XML 註解文件](https://i.imgur.com/N64ilVG.png)

但你開啟 `csproj` 專案檔會發現，使用介面設定所產生的程式碼會是寫死的路徑，如下圖：

![使用介面設定所產生的結果](https://i.imgur.com/ja93Syn.png)

`C:\Users\poychang\Code\demo\DemoSampleSets\GDFCommonLibrary\GDFCommonLibrary.xml` 使用像是這樣的設定可就不好了，畢竟在多人開發，或是透過 DevOps 的 CI/CD 工具，大家的建置環境都可能不一樣，這樣寫死的路徑絕對是死路一條。

如果你使用介面來設定，務必在設定後，手動修改 `.csproj` 專案檔內的設定，改成相對路徑。

## 建議作法

除此之外，你還可以使用 MSBuild 的屬性來設定是否要產生 XML 註解文件，做法很簡單，只需要在 `.csproj` 專案檔中加入 `GenerateDocumentationFile` 屬性並設定為 `true` 即可，如下程式碼：

```xml
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
  </PropertyGroup>
```

設定完後，打開 Visual Studio 的專案設定視窗，你會看到 `XML documentation file` 選項已經被打勾，且產生 XML 註解文件的路徑會是像這樣 `obj\Debug\netstandard2.0\GDFCommonLibrary.xml`，但你不用擔心這個路徑會不會在其他開發者的電腦或是 CI/CD 環境造成問題，因為這個路徑是動態產生出來的，且是用相對路徑來表示。

![使用所產生的路徑](https://i.imgur.com/NpbVtri.png)

透過這樣的設定所封裝的 NuGet 套件，就會包含相關的說明資訊，讓之後參考該套件的開發者，能更清楚的知道該方法、屬性是做甚麼用的了。

----------

參考資料：

* [使用 XML 註解記錄您的程式碼](https://docs.microsoft.com/zh-tw/dotnet/csharp/codedoc)
* [Show comments in nuget package](https://stackoverflow.com/questions/43305578/show-comments-in-nuget-package)
