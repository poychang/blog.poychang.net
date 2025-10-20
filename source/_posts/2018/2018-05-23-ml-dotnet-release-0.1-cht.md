---
layout: post
title: ML.NET 0.1 Release Notes 中文版
date: 2018-05-23 12:00
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, AI]
permalink: ml-dotnet-release-0.1-cht/
---
從 ML.NET 0.1 Release Notes 發行說明來了解在 .NET 生態中，機器學習的發展。如有翻譯錯誤，請指正，謝謝！

# ML.NET 0.1 Release Notes

ML.NET 0.1 是首發預覽版 ML.NET，您可以試著應用在您的應用程式中，進行訓練、分群或使用機器學習模型，我們感謝您的嘗試，並期待來自您的回饋！

### Installation

ML.NET 可以在跨平台的 [.NET Core 2.0](https://www.microsoft.com/net/learn/get-started/windows) 框架中執行，同時也可以正確地在 .NET Framework 中執行。

您可以使用 .NET Core CLI 來安裝 ML.NET NuGet 套件:
```
dotnet add package Microsoft.ML
```

或透過 NuGet 套件管理器進行安裝:
```
Install-Package Microsoft.ML
```

也可以使用 Visual Studio 內建的 NuGet 套件管理器進行安裝。

### Release Notes

首發的預覽版包含啟動機器學習管道的 ML.NET 核心元件：

* 機器學習數據結構 (例如 `IDataView`、`LearningPipeline`)

* 文字載入器 (從指定的文字檔中載入數據至 `LearningPipeline`)

* 數據轉換器 (用來將數據轉換成可供訓練的正確數據格式):
    * 處理文字並進行特徵化工具: `TextFeaturizer`
    * 數據模式修改工具: `ColumnConcatenator`、`ColumnSelector` 和 `ColumnDropper`
    * 使用分類功能: `CategoricalOneHotVectorizer` 和 `CategoricalHashOneHotVectorizer`
    * 處理遺失數據: `MissingValueHandler`
    * 過濾器: `RowTakeFilter`、`RowSkipFilter`、`RowRangeFilter`
    * 特徵選擇器: `FeatureSelectorByCount` 和 `FeatureSelectorByMutualInformation`
    
* 適用於各種任務的學習器 (用來訓練機器學習的模型):
    * 二元分群(Binary classification)
        * `FastTreeBinaryClassifier`
        * `StochasticDualCoordinateAscentBinaryClassifier`
        * `AveragedPerceptronBinaryClassifier`
        * `BinaryLogisticRegressor`
        * `FastForestBinaryClassifier`
        * `LinearSvmBinaryClassifier`
        * `GeneralizedAdditiveModelBinaryClassifier`
    * 多類分群(Multiclass classification)
        * `StochasticDualCoordinateAscentClassifier`
        * `LogisticRegressor`
        * `NaiveBayesClassifier`
    * 迴歸(Regression)
        * `FastTreeRegressor`
        * `FastTreeTweedieRegressor`
        * `StochasticDualCoordinateAscentRegressor`
        * `OrdinaryLeastSquaresRegressor`
        * `OnlineGradientDescentRegressor`
        * `PoissonRegressor`
        * `GeneralizedAdditiveModelRegressor`
    
* 評估器 (檢測模型是否運作良好):
    * `BinaryClassificationEvaluator` 可用於二元分群(Binary classification)
    * `ClassificationEvaluator` 可用於多類分群(Multiclass classification)
    * `RegressionEvaluator` 可用於迴歸(Regression)

其他包含在儲存庫的組件，尚不能在 `LearningPipeline` 中使用，但將會在以後的版本中更新。

----------

以下為原文：

# ML.NET 0.1 Release Notes

ML.NET 0.1 is the first preview release of ML.NET. Thank you for trying it out and we look forward to your feedback! Try training, scoring, and using machine learning models in your app and tell us how it goes.

### Installation

ML.NET works on any platform that supports [.NET Core 2.0](https://www.microsoft.com/net/learn/get-started/windows). It also works on the .NET Framework.

You can install ML.NET NuGet from the .NET Core CLI using:
```
dotnet add package Microsoft.ML
```

From package manager:
```
Install-Package Microsoft.ML
```

Or from within Visual Studio's NuGet package manager.

### Release Notes

This initial release contains core ML.NET components for enabling machine learning pipelines:

* ML Data Structures (e.g. `IDataView`, `LearningPipeline`)

* TextLoader (loading data from a delimited text file into a `LearningPipeline`)

* Transforms (to get data in the correct format for training):
    * Processing/featurizing text: `TextFeaturizer`
    * Schema modifcation: `ColumnConcatenator`, `ColumnSelector`, and `ColumnDropper`
    * Working with categorical features: `CategoricalOneHotVectorizer` and `CategoricalHashOneHotVectorizer`
    * Dealing with missing data: `MissingValueHandler`
    * Filters: `RowTakeFilter`, `RowSkipFilter`, `RowRangeFilter`
    * Feature selection: `FeatureSelectorByCount` and `FeatureSelectorByMutualInformation`
    
* Learners (to train machine learning models) for a variety of tasks:
    * Binary classification: `FastTreeBinaryClassifier`, `StochasticDualCoordinateAscentBinaryClassifier`, `AveragedPerceptronBinaryClassifier`, `BinaryLogisticRegressor`, `FastForestBinaryClassifier`,  `LinearSvmBinaryClassifier`, and `GeneralizedAdditiveModelBinaryClassifier`
    * Multiclass classification: `StochasticDualCoordinateAscentClassifier`, `LogisticRegressor`, and`NaiveBayesClassifier`
    * Regression: `FastTreeRegressor`, `FastTreeTweedieRegressor`, `StochasticDualCoordinateAscentRegressor`, `OrdinaryLeastSquaresRegressor`, `OnlineGradientDescentRegressor`, `PoissonRegressor`, and `GeneralizedAdditiveModelRegressor`
    
* Evaluators (to check how well the model works):
    * For Binary classification: `BinaryClassificationEvaluator`
    * For Multiclass classification: `ClassificationEvaluator`
    * For Regression: `RegressionEvaluator`

Additional components have been included in the repository but cannot be used in the `LearningPipeline` yet (this will be updated in future releases).

----------

參考資料：

* [ML.NET 0.1 Release Notes](https://github.com/dotnet/machinelearning/blob/master/docs/release-notes/0.1/release-0.1.md)
