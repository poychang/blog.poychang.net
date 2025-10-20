---
layout: post
title: NVIDIA 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, AI]
permalink: note-nvidia/
---

本篇作為書籤用途，紀錄網路上的 NVIDIA 參考資料

## CUDA

CUDA 全名為 Compute Unified Device Architecture，是 NVIDIA 推出的通用平行計算架構。相關的開發工具可透過安裝 [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit) 來取得，若需要舊的版本，可在 [CUDA Toolkit Archive](https://developer.nvidia.com/cuda-toolkit-archive) 下載。

CUDA Toolkit 的 `bin` 資料夾內會包含 `nvcc` 編譯器，和 profiler、debuggers 等工具。`lib` 資料夾內有各種科學計算和工具的函示庫。`samples` 資料夾內有各種使用 CUDA 和 library API 的程式碼範例程式。

### nvcc

`nvcc` 就是 CUDA 的編譯器。CUDA 程式有兩種程式碼，一種是在 CPU 上執行的 host 程式碼，一種是在 GPU 上執行的 device 程式碼，所以 `nvcc` 編譯器要保證兩部分程式碼能夠編譯成二進制檔案，並在不同的機器上執行。n

`nvcc` 涉及到的檔案及說明如下`:


| 副檔名             | 說明                                                   |
| ------------------ | ------------------------------------------------------ |
| `.cu`              | CUDA 原始檔，包含 host 和 device 程式碼                |
| `.cup`             | 經過預處理的 CUDA 原始檔，編譯選項 `--preprocess` `-E` |
| `.c`               | C 原始檔                                               |
| `.cc` `.cxx` `cpp` | C++ 原始檔                                             |
| `.gpu`             | GPU 中間檔，編譯選項 `--gpu`                           |
| `.ptx`             | 類似於組合語言的程式碼，編譯選項 `--ptx`               |
| `.o` `.obj`        | 目標檔，編譯選項 `--compile` `-c`                      |
| `.a` `.lib`        | 函示庫文件，編譯選項 `--lib` `-lib`                    |
| `.res`             | 資源檔                                                 |
| `.so`              | 共享目標檔，編譯選項 `--shared` `-shared`              |
| `.subin`           | CUDA 的二進制檔，編譯選項 `-cubin`                     |

```bash
# 可以使用 nvcc 查詢 NVIDIA CUDA Compiler Driver 版本
nvcc --version

# 使用範例程式測試 CUDA 頻寬
C:\"Program Files\NVIDIA GPU Computing Toolkit"\CUDA\v11.8\extras\demo_suite\bandwidthTest.exe
```

### CUDA Driver 和 CUDA Runtime

CUDA 有兩個主要的 API，Driver API 和 Runtime API，在開發過程中只能選擇其中一種 API。

![CUDA App to Driver](https://i.imgur.com/ieJeMTH.png)

CUDA Driver API 和 CUDA Runtime API 都是用來存取 GPU 的 API。

CUDA Driver API 是一個底層的 API，提供對 GPU 硬體的底層訪問，以及 GPU 硬體的直接控制。使用 Driver API 需要編寫更多的底層程式碼，例如手動管理 GPU 記憶體分配、執行 GPU kernel 等。它對於需要更細粒度控制 GPU 的應用程式非常有用。

CUDA Runtime API 則是一個更高層次的 API，提供對 GPU 硬體更簡單的訪問和控制。CUDA Runtime API 隱藏了大部分底層細節，例如記憶體管理、調度和執行緒同步等。讓開發人員可以更容易地開發出 GPU 加速的應用程式。

REF:
- [深度學習部署筆記(八): CUDA RunTime API-2.1Hello CUDA](https://blog.csdn.net/bobchen1017/article/details/129418236)

## cuDNN

cuDNN 全名為 CUDA Deep Neural Network library，是 NVIDIA 推出的深度神經網路函式庫，加速機器學習推理和訓練。此函示庫可以從[這裡下載](https://developer.nvidia.com/cudnn)若需要舊的版本，可在 [cuDNN Archive](https://developer.nvidia.com/cudnn-archive) 下載。


---

參考資料：

- [NVIDIA 深度學習機構](https://www.nvidia.com/zh-tw/training/)
- [NVIDIA Developer Program](https://developer.nvidia.com/nvidia-developer-program)
- [NVIDIA CUDA 文件](https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/contents.html)
