---
layout: post
title: ML.NET 0.3 Release Notes 中文版
date: 2018-07-03 01:03
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, AI]
permalink: ml-dotnet-release-0.3-cht/
---
從 ML.NET 0.3 Release Notes 發行說明來了解在 .NET 生態中，機器學習的發展。如有翻譯錯誤，請指正，謝謝！

# ML.NET 0.3 Release Notes

今天我們釋出 ML.NET 0.3。此次的版本側重於以下幾點：

* 增加 ML.NET 內部組件，例如 Factorization Machines、LightGBM、Ensembles 和 LightLDA
* 支援匯出 ONNX 格式的模型
* 修正臭蟲

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

* 增加 Field-Aware Factorization Machines (FFM) 作為二元分群學習器 (#383)

    * FFM 適用於大型且疏鬆的數據集，特別是用在推薦或點擊預測等領域。已被用於許多點擊預測的比賽並獲得勝利，例如 [Criteo Display Advertising Challenge on Kaggle](https://www.kaggle.com/c/criteo-display-ad-challenge)。你可以從[這裡](https://www.csie.ntu.edu.tw/~r01922136/kaggle-2014-criteo.pdf)了解更多獲勝的解決方案。
    * FFM 是串流型學習器，因此他不需要將整個數據集載入記憶體才能進行學習。
    * 你可以從[這裡](http://www.csie.ntu.edu.tw/~cjlin/papers/ffm.pdf)學習到更多關於 FFM 的做法，以及從[這裡](https://github.com/wschin/fast-ffm/blob/master/fast-ffm.pdf)學到一些在 ML.NET 中使用的加速方法。

* 增加 [LightGBM](https://github.com/Microsoft/LightGBM) 演算法框架作為二元分群、多類分群以及迴歸之學習器 (#392)

    * LightGBM 基於樹狀資料結構的梯度增強機。由 Microsoft [DMTK](http://github.com/microsoft/dmtk) 專案所發展的演算法。
    * LightGBM 的儲存庫中展示了許多[比較實驗](https://github.com/Microsoft/LightGBM/blob/6488f319f243f7ff679a8e388a33e758c5802303/docs/Experiments.rst#comparison-experiment)，用來呈現其計算的準確度與速度。這是很值得嘗試看看的優秀學習器。已被用於許多[機器學習的比賽](https://github.com/Microsoft/LightGBM/blob/a6e878e2fc6e7f545921cbe337cc511fbd1f500d/examples/README.md)並獲得勝利。
    * LightGBM 已在此次的 ML.NET 釋出中公開。
    * 請注意，LightGBM 也可以用於排名情境，但排名評估器尚未在 ML.NET 中公開。

* 增加整體學習器 (Ensemble Learner) 作為二元分群、多類分群以及迴歸之學習器 (#379)

    * [整體學習器](https://en.wikipedia.org/wiki/Ensemble_learning)可以在一個模型中啟動多個學習器。舉例來說，整體學習器可以同時訓練 `FastTree`、`AveragedPerceptron` 以及兩者的平均預測，作為最終的預測結果。
    * 結合多個具有相似統計性能的模型，有機會比單獨處理每個模型擁有更好的性能。

* 增加 LightLDA 主題模型的數據轉換器 (#377)

    * LightLDA 是 [Latent Dirichlet Allocation](https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation) 的實作，用來從數據中推斷主題結構。
    * 在 ML.NET 中的 LightLDA 是基於[這篇論文](https://arxiv.org/abs/1412.1576)的實作。LightLDA 的實作在[這裡](https://github.com/Microsoft/lightlda)發行。

* 增加 One-Versus-All (OVA) 作為多類分群學習器 (#363)

    * [OVA](https://en.wikipedia.org/wiki/Multiclass_classification#One-vs.-rest) (One-Versus-Rest) 用來處理多類分群問題所使用的二元分群器。
    * 雖然 ML.NET 中有一些二元分群學習器本身支援多類分群（例如 Logistic Regression），但還有一些是不支援的（例如 Averaged Perceptron）。OVA 允許用在在二元分群處理之後，進行多類分群。

* 啟動將 ML.NET 模型匯出成 [ONNX](https://onnx.ai/) 格式 (#248)

    * ONNX 是深度學習模型的通用格式，它讓開發人員能夠在不同的機器學習工具中，使用同一個模型格式做預測。
    * ONNX 模型可以用在 Windows ML 中，例如可以用在 Windows 10 的設備上進行評估，並利用硬件加速等功能提升執行效率。
    * 目前為止只有一部分 ML.NET 元件可以將模型轉換為 ONNX 做使用。

此里程碑中的額外更新請參考[這裡](https://github.com/dotnet/machinelearning/milestone/2?closed=1)。

Field-Aware Factorization Machines 自動特徵分類
One-Versus-All (OVA) 為每一個類建立一個唯一的分類器


----------

以下為原文：

# ML.NET 0.3 Release Notes

Today we are releasing ML.NET 0.3. This release focuses on adding components
to ML.NET from the internal codebase (such as Factorization Machines,
LightGBM, Ensembles, and LightLDA), enabling export to the ONNX model format,
and bug fixes.

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

* Added Field-Aware Factorization Machines (FFM) as a learner for binary
  classification (#383)

    * FFM is useful for various large sparse datasets, especially in areas
      such as recommendations and click prediction. It has been used to win
      various click prediction competitions such as the [Criteo Display
      Advertising Challenge on
      Kaggle](https://www.kaggle.com/c/criteo-display-ad-challenge). You can
      learn more about the winning solution
      [here](https://www.csie.ntu.edu.tw/~r01922136/kaggle-2014-criteo.pdf).
    * FFM is a streaming learner so it does not require the entire dataset to
      fit in memory.
    * You can learn more about FFM
      [here](http://www.csie.ntu.edu.tw/~cjlin/papers/ffm.pdf) and some of the
      speedup approaches that are used in ML.NET
      [here](https://github.com/wschin/fast-ffm/blob/master/fast-ffm.pdf).

* Added [LightGBM](https://github.com/Microsoft/LightGBM) as a learner for
  binary classification, multiclass classification, and regression (#392)

    * LightGBM is a tree based gradient boosting machine. It is under the
      umbrella of the [DMTK](http://github.com/microsoft/dmtk) project at
      Microsoft.
    * The LightGBM repository shows various [comparison
      experiments](https://github.com/Microsoft/LightGBM/blob/6488f319f243f7ff679a8e388a33e758c5802303/docs/Experiments.rst#comparison-experiment)
      that show good accuracy and speed, so it is a great learner to try out.
      It has also been used in winning solutions in various [ML
      challenges](https://github.com/Microsoft/LightGBM/blob/a6e878e2fc6e7f545921cbe337cc511fbd1f500d/examples/README.md).
    * This addition wraps LightGBM and exposes it in ML.NET.
    * Note that LightGBM can also be used for ranking, but the ranking
      evaluator is not yet exposed in ML.NET.

* Added Ensemble learners for binary classification, multiclass
  classification, and regression (#379)

    * [Ensemble learners](https://en.wikipedia.org/wiki/Ensemble_learning)
      enable using multiple learners in one model. As an example, the Ensemble
      learner could train both `FastTree` and `AveragedPerceptron` and average
      their predictions to get the final prediction. 
    * Combining multiple models of similar statistical performance may lead to
      better performance than each model separately.

* Added LightLDA transform for topic modeling (#377)

    * LightLDA is an implementation of [Latent Dirichlet
      Allocation](https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation)
      which infers topical structure from text data. 
    * The implementation of LightLDA in ML.NET is based on [this
      paper](https://arxiv.org/abs/1412.1576). There is a distributed
      implementation of LightLDA
      [here](https://github.com/Microsoft/lightlda).

* Added One-Versus-All (OVA) learner for multiclass classification (#363)

    * [OVA](https://en.wikipedia.org/wiki/Multiclass_classification#One-vs.-rest)
      (sometimes known as One-Versus-Rest) is an approach to using binary
      classifiers in multiclass classification problems. 
    * While some binary classification learners in ML.NET natively support
      multiclass classification (e.g. Logistic Regression), there are others
      that do not (e.g. Averaged Perceptron). OVA enables using the latter
      group for multiclass classification as well.

* Enabled export of ML.NET models to the [ONNX](https://onnx.ai/) format
  (#248)

    * ONNX is a common format for representing deep learning models (also
      supporting certain other types of models) which enables developers to
      move models between different ML toolkits.
    * ONNX models can be used in [Windows
      ML](https://docs.microsoft.com/en-us/windows/uwp/machine-learning/overview?WT.mc_id=DT-MVP-5003022)
      which enables evaluating models on Windows 10 devices and taking
      advantage of capabilities like hardware acceleration.
    * Currently, only a subset of ML.NET components can be used in a model
      that is converted to ONNX. 

Additional issues closed in this milestone can be found
[here](https://github.com/dotnet/machinelearning/milestone/2?closed=1).

### Acknowledgements

Shoutout to [pkulikov](https://github.com/pkulikov),
[veikkoeeva](https://github.com/veikkoeeva),
[ross-p-smith](https://github.com/ross-p-smith),
[jwood803](https://github.com/jwood803),
[Nepomuceno](https://github.com/Nepomuceno), and the ML.NET team for their
contributions as part of this release! 

----------

參考資料：

* [ML.NET 0.3 Release Notes](https://github.com/dotnet/machinelearning/blob/master/docs/release-notes/0.3/release-0.3.md)
* [Announcing ML.NET 0.3](https://blogs.msdn.microsoft.com/dotnet/2018/07/09/announcing-ml-net-0-3/)
