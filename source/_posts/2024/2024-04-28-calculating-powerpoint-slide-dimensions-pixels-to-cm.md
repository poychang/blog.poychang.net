---
layout: post
title: 計算 PowerPoint 版面尺寸：pixels to cm
date: 2024-04-27 19:23
author: Poy Chang
comments: true
categories: [Tools, App]
permalink: calculating-powerpoint-slide-dimensions-pixels-to-cm/
---

PowerPoint 作為一個製作簡報的工具相當好用，其實作為一個排版工具也很不錯，但缺點就是他的版面尺寸只能用公分 (cm, centimeters) 和英吋 (in, inches)，而基本上的數位版面還是以像素 (px, pixels) 作為基本單位比較好用，這篇分享一些處理方式。

## 其實可以設定 Pixels

對，在 PowerPoint 的版面設定中雖然預設是 cm 和 in，但其實是可以用 px 來設定的。

只要在長或寬的設定欄位中，直接輸入你要的尺寸大小，最後補上一個 `px`，PowerPoint 就會自動幫你計算對應的尺寸是多少 cm 或 in。

![使用 px 來設定版面尺寸](https://i.imgur.com/wFCfP2Q.png)

> 這個技巧其實在官方的[PowerPoint 變更投影片大小](https://support.microsoft.com/zh-tw/office/%E8%AE%8A%E6%9B%B4%E6%8A%95%E5%BD%B1%E7%89%87%E5%A4%A7%E5%B0%8F-040a811c-be43-40b9-8d04-0de5ed79987e)支援文件有提到，只是它的標題命名為「選擇自訂尺寸 (英吋、公分或圖元)」，沒人知道「圖元」這東西是甚麼。
>
> 不過我在測試的時後，這種方式可能會發生計算錯誤，或許是有 Bug。

## 數學計算

由於 `1 inch = 2.54 cm`，通常我們螢幕的 dpi 或 ppi 會設定成 `96 px/in`，這相當於 `96 px / 2.54 cm`。

因此我們可以得知 `1 px = 2.54 cm / 96` 也就是 `1 px = 0.026458333 cm`，這裡的 `0.026458333` 就是我們用來將相素轉換成公分的重要常數。

這樣就可以透過簡單計算，來自行轉換，或者使用下面的計算器來操作。

<div id="app"></div>

<script>
    // 獲取 div 容器的引用
    const appDiv = document.getElementById('app');

    // 建立 Width 欄位
    const widthLabel = document.createElement('label');
    widthLabel.textContent = 'Width: ';
    const widthInput = document.createElement('input');
    widthInput.type = 'text';
    widthInput.placeholder = 'Width';
    widthLabel.appendChild(widthInput);
    appDiv.appendChild(widthLabel);

    // 間隔
    appDiv.appendChild(document.createElement('br'));

    // 建立 Height 欄位
    const heightLabel = document.createElement('label');
    heightLabel.textContent = 'Height: ';
    const heightInput = document.createElement('input');
    heightInput.type = 'text';
    heightInput.placeholder = 'Height';
    heightLabel.appendChild(heightInput);
    appDiv.appendChild(heightLabel);

    // 間隔
    appDiv.appendChild(document.createElement('br'));

    // 顯示處理
    const widthOutput = document.createElement('h2');
    const heightOutput = document.createElement('h2');
    appDiv.appendChild(widthOutput);
    appDiv.appendChild(heightOutput);

    // 處理輸入改變的事件函數
    function handleInput() {
        const rate = 0.026458333;
        const width = parseFloat(widthInput.value);
        const height = parseFloat(heightInput.value);

        // 確保兩個值都是數字
        if (!isNaN(width)) {
            widthOutput.textContent = `Width: ${width * rate} cm`;
        } else {
            widthOutput.textContent = '';
        }
        if (!isNaN(height)) {
            heightOutput.textContent = `Height: ${height * rate} cm`;
        } else {
            heightOutput.textContent = '';
        }
    }

    // 為兩個輸入欄位添加輸入事件監聽器
    heightInput.addEventListener('input', handleInput);
    widthInput.addEventListener('input', handleInput);
</script>

## 常用尺寸

這裡記錄一下比較常用的尺寸，以便後續使用：

| 尺寸          | Width (px) | Height (px) | Width (cm) | Height (cm) |
| ------------- | ---------- | ----------- | ---------- | ----------- |
| 4K (Ultra HD) | 3840       | 2160        | 101.6      | 57.15       |
| FHD           | 1920       | 1080        | 50.8       | 28.575      |
| HD            | 1280       | 720         | 33.867     | 19.05       |
|               | 1024       | 768         | 27.093     | 20.32       |

---

參考資料：

* [How to convert pixels to cm](https://www.youtube.com/watch?v=tlQ9Sh1jYAA)
* [How to export PowerPoint slides to a 4K resolution File](https://www.youtube.com/watch?v=ME0HN8Q8TE4)
* [Change the size of your slides](https://support.microsoft.com/en-us/office/change-the-size-of-your-slides-040a811c-be43-40b9-8d04-0de5ed79987e)