---
layout: post
title: 如何選擇 ONNX Runtime Generative AI 的 NuGet 套件
date: 2024-06-06 12:00
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, AI]
permalink: how-to-choose-onnx-runtime-gen-ai-nuget-package/
---

C#　版本的　ONNX Runtime 提供了 4 個 Generative AI 相關的 NuGet 套件，這些套件的用途不盡相同，本文將帶你了解這些套件適用情境，了解如何選擇適合的套件。

Onnx Runtime 本身有另外兩個核心套件 `Microsoft.ML.OnnxRuntime` 和 `Microsoft.ML.OnnxRuntime.Gpu`，從名稱就可以看出來，前者是 ONNX Runtime 的通用套件，後者則是針對 GPU 加速的版本，因此在後續的使用上，要根據自己的運行環境需求來選擇 Onnx Runtime 核心套件。

ONNX Runtime 針對 Generative AI 的使用場景，提供了一系列的 NuGet 套件，這些套件主要是針對 Generative AI 的應用場景進行了優化，讓使用者能夠更容易地在 C# 中使用 ONNX Runtime 進行 Generative AI 的應用。

在 [NuGet.org](https://www.nuget.org/) 搜尋 ONNX Runtime 的 Generative AI .NET 函示庫，會找到以下四個套件：

1. [Microsoft.ML.OnnxRuntimeGenAI](https://www.nuget.org/packages/Microsoft.ML.OnnxRuntimeGenAI/)
2. [Microsoft.ML.OnnxRuntimeGenAI.Managed](https://www.nuget.org/packages/Microsoft.ML.OnnxRuntimeGenAI.Managed/)
3. [Microsoft.ML.OnnxRuntimeGenAI.DirectML](https://www.nuget.org/packages/Microsoft.ML.OnnxRuntimeGenAI.DirectML/)
4. [Microsoft.ML.OnnxRuntimeGenAI.Cuda](https://www.nuget.org/packages/Microsoft.ML.OnnxRuntimeGenAI.Cuda/)

第一個套件 `Microsoft.ML.OnnxRuntimeGenAI` 是 ONNX Runtime 針對 Generative AI 所設計的核心套件，提供執行 ONNX 模型所需的推理功能和方法，特別針對大型語言模型（或小型語言模型）、圖像生成等應用場景進行了優化，並且支援多種硬體加速選項，包括 NVIDIA 和 AMD GPU，透過 DirectML 或 CUDA 進行加速。

>如果要使用的模型不是 Generative AI 的模型，而是其他類型的模型，可以考慮使用 `Microsoft.ML.OnnxRuntime` 相關套件來運行。基本上就是模型分類的問題。

其他三個套件則是針對不同的硬體加速需求和運行環境進行做優化，以下是這三個套件的比較。

## Microsoft.ML.OnnxRuntimeGenAI.Managed

這個套件僅依賴於 CPU，適用於無法或不需要使用 GPU 的情境。這個版本的 ONNX Runtime 是可以在任何支援 .NET 的環境中運行，包括 Windows、Linux 和 macOS。基本上就是完全交由 .NET 託管的使用情境，因此此套件可以用在本機開發環境，或是用在雲端部署都可以。

不過由於僅使用 CPU 做計算，性能相對於使用 GPU 的版本會較低落很多，但也因為不需要 GPU，因此在部署和維護上會較為簡單。

比較適合用在小規模或不需要即時性能的應用，甚至應用在嵌入式系統。

## Microsoft.ML.OnnxRuntimeGenAI.DirectML

這個套件是使用 [DirectML](https://learn.microsoft.com/zh-tw/windows/ai/directml/dml) 作為底層，依賴於 Windows 操作系統和 DirectX 12，因此有針對 Windows 平台進行優化，能夠在任何支援 DirectX 12 的硬體上運行，包括 NVIDIA、AMD 和 Intel 的 GPU。沒錯，它可以利用 GPU 來提高計算性能，而且不限於 NVIDIA 的 GPU 唷。

如果應用程式有使用 [Windows AI 或 ML](https://learn.microsoft.com/zh-tw/windows/ai/)，底層就是使用這個技術棧。

![Windows ML 技術棧](https://i.imgur.com/2PKsSw0.png)

> 或許 NPU 的推出，會讓這個技術棧往更蓬勃的發展前進。

## Microsoft.ML.OnnxRuntimeGenAI.Cuda

這個套件則是專為利用 NVIDIA GPU 加速而設計，它依賴於 [CUDA](https://developer.nvidia.com/cuda-toolkit) 和 [cuDNN](https://developer.nvidia.com/cudnn) 這兩個 NVIDIA 的函示庫來加速深度學習模型的推理過程，因此必須先在運行環境中安裝這兩個函示庫，而且要**注意對應的版本**。

關於完整的 ONNX Runtime 與 CUDA 的版本相依性，可以參考 [CUDA-ExecutionProvider](https://onnxruntime.ai/docs/execution-providers/CUDA-ExecutionProvider.html#requirements) 官方文件，這裡僅列出 ONNX Runtime v1.18 版本相依性表格：

| ONNX Runtime | CUDA | cuDNN                                   |
| ------------ | ---- | --------------------------------------- |
| 1.18         | 12.4 | 8.9.2.26 (Linux) 8.9.2.26 (Windows) |
| 1.18         | 11.8 | 8.9.2.26 (Linux) 8.9.2.26 (Windows) |

> ONNX Runtime v1.18 預設是使用 CUDA v11.8，如果想要使用 CUDA v12 的版本，可以參考[此連結](https://onnxruntime.ai/docs/install/#cccwinml-installs)，會教你如何安裝支援 CUDA v12 的 ONNX Runtime。

要下載指定版本的 CUDA Toolkit 和 cuDNN，可以參考 [CUDA Toolkit Archive](https://developer.nvidia.com/cuda-toolkit-archive) 和 [cuDNN Archive](https://developer.nvidia.com/rdp/cudnn-archive)。

如果你的運行環境是 Windows，在安裝完成後，需要在 Windows 的環境變數中，將 `Path` 環境變數加入下面兩個路徑，讓 ONNX Runtime 可以找到 CUDA 和 cuDNN 相關的執行檔和函式庫。

```
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.8\bin
C:\Program Files\NVIDIA GPU Computing Toolkit\cuDNN\v8.9.7\bin
```

>上述路徑會要根據你安裝的版本來做調整。

## 後記

不同的使用情境，選擇不同的 ONNX Runtime Generative AI NuGet 套件，希望這篇文章能夠幫助你更清楚的知道要使用哪個套件，讓你的應用程式在不同的硬體環境中運行的更順暢。

---

參考資料：

* [Extending the Reach of Windows ML and DirectML](https://blogs.windows.com/windowsdeveloper/2020/03/18/extending-the-reach-of-windows-ml-and-directml/)
* [microsoft/onnxruntime-genai](https://github.com/microsoft/onnxruntime-genai/)
* [MS Learn - 開始使用 Windows 應用程式中的 Phi3 和其他語言模型 ONNX Runtime Generative AI](https://learn.microsoft.com/zh-tw/windows/ai/models/get-started-models-genai?WT.mc_id=DT-MVP-5003022)
* [ONNX Runtime Docs](https://onnxruntime.ai/docs/)
