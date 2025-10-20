---
layout: post
title: 讓 WPF 也可以有 Material Design 樣式
date: 2018-06-24 21:12
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, App]
permalink: developing-wpf-or-uwp-with-material-desing/
---
有時候我們還是要寫一些 WinForm 的程式，但是總覺得 WinForm 預設的樣式不夠現代化，如果能像 Web 一樣有 Material Design 的控制項，讓開發者能夠輕鬆做出友善的 UI 介面該有多好，[MaterialDesignInXamlToolkit](https://github.com/ButchersBoy/MaterialDesignInXamlToolkit) 這個專案就是讓你開開心心建置優良 UX 的好套件，而且還支援 UWP 和 WPF 兩種框架唷。

>Material Design 是一種視覺語言，可以有很多實作，例如 [Angular Material](https://material.angular.io/)、[Materialize](https://materializecss.com/)，這篇講的 [MaterialDesignInXamlToolkit](https://github.com/ButchersBoy/MaterialDesignInXamlToolkit) 也是一種實作。

## 快速使用

使用 MaterialDesignInXamlToolkit 的前置作業很簡單，建立好 WPF 專案後，只需要三個步驟，即可快速設定好專案。

### 步驟 1：使用 NuGet 安裝 MaterialDesignThemes 套件。

![安裝 MaterialDesignThemes 套件](https://i.imgur.com/CLJxhXg.png)

這裡你可以 NuGet CLI `Install-Package MaterialDesignThemes` 進行安裝，或是透過 Visual Studio 的 NuGet Package Manager 搜尋並安裝。

### 步驟 2：修改 App.xaml

![修改 App.xaml](https://i.imgur.com/DevBsrF.png)

在 `Application.Resources` 中加入 `ResourceDictionary.MergedDictionaries` 資源目錄，載入預先建置好的 Material Design 的基本樣式

```xml
<ResourceDictionary>
    <ResourceDictionary.MergedDictionaries>
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Light.xaml" />
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Defaults.xaml" />
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignColors;component/Themes/Recommended/Primary/MaterialDesignColor.DeepPurple.xaml" />
        <ResourceDictionary Source="pack://application:,,,/MaterialDesignColors;component/Themes/Recommended/Accent/MaterialDesignColor.Lime.xaml" />
    </ResourceDictionary.MergedDictionaries>
</ResourceDictionary>
```

上面的 `MaterialDesignTheme.Light.xaml` 提供 Light 樣式，我們可以改成 `MaterialDesignTheme.Dark.xaml` 來套用 Dark 樣式。

甚至可以修改上面 `Primary` 和 `Accent`，分別代表主要和次要的顏色樣式，裡如上面主要顏色使用 DeepPurple，次要顏色使用 Lime。

>預先建置的顏色樣式，可以到[此套件原始碼的這個資料夾中](https://github.com/ButchersBoy/MaterialDesignInXamlToolkit/tree/master/MaterialDesignColors.Wpf/Themes)找到可以套用的顏色檔名。

### 步驟 3：修改 MainWindow.xaml

![修改 MainWindow.xaml](https://i.imgur.com/6DyZpvt.png)

在 `Window` 元素中加入 `xmlns:materialDesign="http://materialdesigninxaml.net/winfx/xaml/themes"` 命名空間，讓你可以開始使用設計好的 Material Design 控制項

這裡除了加入需要的命名空間外，還放了一個 Material Design 卡片的控制項在畫面中。

```xml
<Window x:Class="DemoMaterialDesignWpfApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:DemoMaterialDesignWpfApp"
        xmlns:materialDesign="http://materialdesigninxaml.net/winfx/xaml/themes"
        mc:Ignorable="d"
        Title="MainWindow" Height="450" Width="800">
    <Grid>
        <!-- Material Design Card Component - START -->
        <materialDesign:Card Padding="32" Margin="16">
            <TextBlock Style="{DynamicResource MaterialDesignTitleTextBlock}">My First Material Design App</TextBlock>
        </materialDesign:Card>
        <!-- Material Design Card Component - END -->
    </Grid>
</Window>
```

![包含 Card 控制項的視窗應用程式](https://i.imgur.com/twaAn35.png)

如此一來就完成了基本設定了，可以按 F5 執行視窗應用程式。

## 瀏覽可用的控制項

![Material Design In Xaml Toolkit](https://i.imgur.com/Gln2co8.png)

要瀏覽這個套件所提供的所有控制項，除了在此套件的 Github 專案 [ButchersBoy/MaterialDesignInXamlToolkit](https://github.com/ButchersBoy/MaterialDesignInXamlToolkit) 上看圖片介紹外，你也可以下載原始碼，裡面的 `MainDemo.Uwp` 和 `MainDemo.Wpf` 這兩個專案資料夾，就是所有控制項的範例程式，在本機建置一下就可以玩玩看，還可以學一下該控制項的使用方法。

>本篇完整範例程式碼請參考 [poychang/Demo-Material-Design-WPF-App](https://github.com/poychang/Demo-Material-Design-WPF-App)。

----------

參考資料：

* [Material Design In XAML Website](http://materialdesigninxaml.net/)
* [Material Design In XAML Github](https://github.com/ButchersBoy/MaterialDesignInXamlToolkit)
* [Material Design In XAML - Super Quick Start](https://github.com/ButchersBoy/MaterialDesignInXamlToolkit/wiki/Super-Quick-Start)

