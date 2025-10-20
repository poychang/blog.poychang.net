---
layout: post
title: ML.NET 0.2 Release Notes 中文版
date: 2018-06-05 12:00
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, AI]
permalink: ml-dotnet-release-0.2-cht/
---
從 ML.NET 0.2 Release Notes 發行說明來了解在 .NET 生態中，機器學習的發展。如有翻譯錯誤，請指正，謝謝！

# ML.NET 0.2 Release Notes

感謝社群的貢獻，幫助我們打早更完善的 ML.NET。

今天我們釋出 ML.NET 0.2。此次的版本側重於以下幾點：

* 處理已知問題及 issues
* 支援聚類的機器學習任務
* 允許使用記憶體中的數據來訓練模型
* 更容易驗證模型

### Installation

ML.NET 支援 Windows, MacOS, and Linux，詳細請參考 [.NET Core2.0 支援的作業系統版本](https://github.com/dotnet/core/blob/master/release-notes/2.0/2.0-supported-os.md)。

您可以使用 .NET Core CLI 來安裝 ML.NET NuGet 套件:
```
dotnet add package Microsoft.ML
```

或透過 NuGet 套件管理器進行安裝:
```
Install-Package Microsoft.ML
```

### Release Notes

以下為本次釋出的部分重點。

* 支援聚類的機器學習任務

    * 聚類(Clustering)是一種非監督學習任務，透過樣本中共同的特徵進行分群，藉此識別出該群的樣本關聯性是高於其他樣本的。如果你的情境類似於根據主題將新聞文章組織成群組、根據用戶的購物習慣細分用戶，或根據觀眾對電影的品味進行分組，聚類任務對於這些情境是相當有用的。

    * ML.NET 0.2 提供 `KMeansPlusPlusClusterer` 任務，此任務使用 [K-Means++ clustering](http://theory.stanford.edu/~sergei/papers/vldb12-kmpar.pdf) 和 [Yinyang K-means acceleration](https://www.microsoft.com/en-us/research/publication/yinyang-k-means-a-drop-in-replacement-of-the-classic-k-means-with-consistent-speedup/?from=http%3A%2F%2Fresearch.microsoft.com%2Fapps%2Fpubs%2Fdefault.aspx%3Fid%3D252149) 理論進行實作。請參考[這項測試](https://github.com/dotnet/machinelearning/blob/78810563616f3fcb0b63eb8a50b8b2e62d9d65fc/test/Microsoft.ML.Tests/Scenarios/ClusteringTests.cs)學習如何使用(from [#222](https://github.com/dotnet/machinelearning/pull/222))。

* ML.NET 0.1 提供 `CollectionDataSource` 從文字檔中載入數據，ML.NET 0.2 開始，除了可以從文字檔中載入外，還可以直接使用記憶體內的數據作為輸入來源，進行訓練，請參考[這個範例](https://github.com/dotnet/machinelearning/blob/78810563616f3fcb0b63eb8a50b8b2e62d9d65fc/test/Microsoft.ML.Tests/CollectionDataSourceTests.cs#L133)(from [#106](https://github.com/dotnet/machinelearning/pull/106))。

* 透過訓練和測試(Train-test)，以及交叉驗證(Cross-validation)使模型驗證更輕鬆地進行

    * [交叉驗證(Cross-validation)](https://en.wikipedia.org/wiki/Cross-validation_(statistics))是一種統計學上將樣本切割成多個小子集的做測試與訓練，評量你的模型的執行表現。它不需要單獨的測試數據，而是使用您的訓練數據來測試模型。它會對數據進行分區，分出用於訓練和測試的數據，多次執行此操作進行驗證。請參考[這個交叉驗證範例](https://github.com/dotnet/machinelearning/blob/78810563616f3fcb0b63eb8a50b8b2e62d9d65fc/test/Microsoft.ML.Tests/Scenarios/SentimentPredictionTests.cs#L51)(from [#212](https://github.com/dotnet/machinelearning/pull/212))。

    * 訓練和測試(Train-test)是在單獨的數據集上進行測試模型的捷徑。請參考[這個範例](https://github.com/dotnet/machinelearning/blob/78810563616f3fcb0b63eb8a50b8b2e62d9d65fc/test/Microsoft.ML.Tests/Scenarios/SentimentPredictionTests.cs#L36)。

    * 請注意，在訓練和測試兩種情況下，`LearningPipeline` 都要以相同的方式準備。
      
* 改進預測的速度：藉由不為只有一個元素的數據視圖建議併行處理的指標，可以顯著的加快預測速度(請參考 [#179](https://github.com/dotnet/machinelearning/issues/179) 了解測量方法)。

* 更新 `TextLoader` API：此 API 現在是程式碼生成的，並且已更新為對數據中的列進行顯式聲明。請參考 [#142](https://github.com/dotnet/machinelearning/pull/142)。

* ML.NET 專案的每日建置 NuGet 套件版本請參考[這裡](https://dotnet.myget.org/feed/dotnet-core/package/nuget/Microsoft.ML)。

此里程碑中的額外更新請參考[這裡](https://github.com/dotnet/machinelearning/milestone/1?closed=1)。

----------

以下為原文：

# ML.NET 0.2 Release Notes

We would like to thank the community for the engagement so far and helping us
shape ML.NET.

Today we are releasing ML.NET 0.2. This release focuses on addressing
questions/issues, adding clustering to the list of supported machine learning
tasks, enabling using data from memory to train models, easier model
validation, and more.

### Installation

ML.NET supports Windows, MacOS, and Linux. See [supported OS versions of .NET
Core
2.0](https://github.com/dotnet/core/blob/master/release-notes/2.0/2.0-supported-os.md)
for more details.

You can install ML.NET NuGet from the CLI using:
```
dotnet add package Microsoft.ML
```

From package manager:
```
Install-Package Microsoft.ML
```

### Release Notes

Below are some of the highlights from this release.

* Added clustering to the list of supported machine learning tasks

    * Clustering is an unsupervised learning task that groups sets of items
      based on their features. It identifies which items are more similar to
      each other than other items. This might be useful in scenarios such as
      organizing news articles into groups based on their topics, segmenting
      users based on their shopping habits, and grouping viewers based on
      their taste in movies. 

    * ML.NET 0.2 exposes `KMeansPlusPlusClusterer` which implements [K-Means++
      clustering](http://theory.stanford.edu/~sergei/papers/vldb12-kmpar.pdf)
      with [Yinyang K-means
      acceleration](https://www.microsoft.com/en-us/research/publication/yinyang-k-means-a-drop-in-replacement-of-the-classic-k-means-with-consistent-speedup/?from=http%3A%2F%2Fresearch.microsoft.com%2Fapps%2Fpubs%2Fdefault.aspx%3Fid%3D252149).
      [This
      test](https://github.com/dotnet/machinelearning/blob/78810563616f3fcb0b63eb8a50b8b2e62d9d65fc/test/Microsoft.ML.Tests/Scenarios/ClusteringTests.cs)
      shows how to use it (from
      [#222](https://github.com/dotnet/machinelearning/pull/222)).

* Train using data objects in addition to loading data from a file using
  `CollectionDataSource`. ML.NET 0.1 enabled loading data from a delimited
  text file. `CollectionDataSource` in ML.NET 0.2 adds the ability to use a
  collection of objects as the input to a `LearningPipeline`. See sample usage
  [here](https://github.com/dotnet/machinelearning/blob/78810563616f3fcb0b63eb8a50b8b2e62d9d65fc/test/Microsoft.ML.Tests/CollectionDataSourceTests.cs#L133)
  (from [#106](https://github.com/dotnet/machinelearning/pull/106)). 

* Easier model validation with cross-validation and train-test

    * [Cross-validation](https://en.wikipedia.org/wiki/Cross-validation_(statistics))
      is an approach to validating how well your model statistically performs.
      It does not require a separate test dataset, but rather uses your
      training data to test your model (it partitions the data so different
      data is used for training and testing, and it does this multiple times).
      [Here](https://github.com/dotnet/machinelearning/blob/78810563616f3fcb0b63eb8a50b8b2e62d9d65fc/test/Microsoft.ML.Tests/Scenarios/SentimentPredictionTests.cs#L51)
      is an example for doing cross-validation (from
      [#212](https://github.com/dotnet/machinelearning/pull/212)).

    * Train-test is a shortcut to testing your model on a separate dataset.
      See example usage
      [here](https://github.com/dotnet/machinelearning/blob/78810563616f3fcb0b63eb8a50b8b2e62d9d65fc/test/Microsoft.ML.Tests/Scenarios/SentimentPredictionTests.cs#L36).

    * Note that the `LearningPipeline` is prepared the same way in both cases.
      
* Speed improvement for predictions: by not creating a parallel cursor for
  dataviews that only have one element, we get a significant speed-up for
  predictions (see
  [#179](https://github.com/dotnet/machinelearning/issues/179) for a few
  measurements).

* Updated `TextLoader` API: the `TextLoader` API is now code generated and was
  updated to take explicit declarations for the columns in the data, which is
  required in some scenarios. See
  [#142](https://github.com/dotnet/machinelearning/pull/142).

* Added daily NuGet builds of the project: daily NuGet builds of ML.NET are
  now available
  [here](https://dotnet.myget.org/feed/dotnet-core/package/nuget/Microsoft.ML).

Additional issues closed in this milestone can be found [here](https://github.com/dotnet/machinelearning/milestone/1?closed=1).

### Acknowledgements

Shoutout to tincann, rantri, yamachu, pkulikov, Sorrien, v-tsymbalistyi, Ky7m,
forki, jessebenson, mfaticaearnin, and the ML.NET team for their contributions
as part of this release! 

----------

參考資料：

* [ML.NET 0.2 Release Notes](https://github.com/dotnet/machinelearning/blob/master/docs/release-notes/0.2/release-0.2.md)
