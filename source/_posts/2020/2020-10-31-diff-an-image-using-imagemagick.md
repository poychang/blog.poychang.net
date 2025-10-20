---
layout: post
title: 使用 Magick.NET 找出兩張圖片的差異
date: 2020-10-31 17:12
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Tools]
permalink: diff-an-image-using-imagemagick/
---

開發人員熟習的 Git 版控系統有優秀的文字差異，但對於圖片的差異比較就無能為力了，在探索這議題的時候，發現了一個有趣的工具 [ImageMagick](https://imagemagick.org/)，他可以操作超過 200 種以上的圖片格式，例如縮放、旋轉、調整顏色、加上文字等，又剛好他有給 .NET 開發者的套件 [Magick.NET](https://github.com/dlemstra/Magick.NET)，因此想說用這套工具來試試看找出一張圖片的前後差異。

## Magick.NET 簡單介紹

顧名思義這套件是基於 ImageMagick 7 之上開發的，而且此套件的 API 封裝得很簡單，與 GDI+ `System.Drawing` 比起來簡單太多了。在搜尋安裝 Magick.NET 套件的時候，你可能會被他一堆套件名稱給搞暈，一堆 Q8 又一堆 Q16，又分各種 CPU 架構的名稱。其實要看懂他們很簡單，CPU 架構分別就不多提，Q8 和 Q16 分別代表的是像素顏色的深度，Q8 就是 RGB 各有 8bit 來表示，Q16 就是 16bit，而還有一種更高品質的是 Q16-HDRI，這使用了 Q16 兩倍的記憶體來處理像色顏色，品質自然更好。

## 比較圖片前後的改變

ImageMagick 的 CLI 指令中有個 [compare](https://imagemagick.org/script/compare.php) 功能，可以比對兩張圖片的差異，可以藉此功能得到一張有標示修改區域的圖片，在 Magick.NET 函式庫中對應的 API 就是 `MagickImage.Compare()`，是不是很容易對照，而且使用方式也很簡單，我們直接從下面的程式碼來看使用說明。

```csharp
public static void CompareImages()
{
    // 首先準備兩張前後有差異的圖片（參考下圖）
    var beforeImage = new MagickImage(@"C:\before.png");
    var afterImage = new MagickImage(@"C:\after.png");
    // Delta 代表兩張圖之間的變化
    var deltaImage = new MagickImage();
    // 設定判定是否有差異的閥值，若差異太小可以當作無變化，可降低雜訊造成的干擾
    var threshold = 0.01;
    // 比較的設定值
    var compareSetting = new CompareSettings
    {
        HighlightColor = MagickColors.Red,   // 用什麼顏色標示有修改的區域
        LowlightColor = MagickColors.White,  // 用什麼顏色填滿未修改的區域，預設會是淡化的修改前圖案
        Metric = ErrorMetric.Fuzz,
    };
    // 兩張圖之間的差異值
    var deltaRate = beforeImage.Compare(afterImage, compareSetting, deltaImage);
    if (deltaRate > threshold)
    {
        Console.WriteLine($"Threshold: {threshold} compare result: {deltaRate} Does not match.");
        // 將兩張圖差異的地方標示出來並輸出
        deltaImage.Write(@"C:\diff.png");
    }
    else
    {
        Console.WriteLine($"Threshold: {threshold} compare result: {deltaRate} Matched.");
    }
}
```

![修改前後的圖片](https://i.imgur.com/Lh7jzuz.png)

透過 `MagickImage.Compare()` 這個 API 我們可以很容易的算出兩圖之間的差異值是多少，透過這個差異值來判定兩張圖片是否有當然這個差異，像是上面這兩張編輯前後的圖，算出來的差異值就會是下圖：

![差異值](https://i.imgur.com/2KhXmx9.png)

當我們知道兩張圖是有差異之後，隨之而來的問題就是「有圖有真相」！所以上面程式碼中的 `deltaImage.Write(@"C:\diff.png");` 就是將兩張圖差異的地方標示出來並輸出成圖片，以供檢視。

![差異位置](https://i.imgur.com/MeZMbsd.png)

所產出來的差異圖預設會使用淡化的修改前圖案，如果想要乾淨一點的畫面，修改 `CompareSettings` 底下的 `LowlightColor` 就可以囉。

>本篇完整範例程式碼請參考 [poychang/Demo-ImageMagickApp](https://github.com/poychang/Demo-ImageMagickApp/blob/main/ImageMagickApp/Samples/ImageCompare.cs)的 `ImageCompare.cs`。

----------

參考資料：

* [ewanmellor/git-diff-image](https://github.com/ewanmellor/git-diff-image)
* [mudithaa/magic-image-compare](https://github.com/mudithaa/magic-image-compare)
* [Diff an image using ImageMagick](https://stackoverflow.com/questions/5132749/diff-an-image-using-imagemagick)
