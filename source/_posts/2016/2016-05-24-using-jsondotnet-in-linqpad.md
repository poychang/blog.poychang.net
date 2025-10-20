---
layout: post
title: 在 LINQPad 中使用 Json.NET 
date: 2016-05-24 09:09
author: Poy Chang
comments: true
categories: [CSharp, Tools]
permalink: using-jsondotnet-in-linqpad/
---

在練習使用 LINQPad 來將 JSON 當作 ORM 來處理的時候，因為我買的 LINQPad 不是 DEVELOPER/PREMIUM 版本，所以無法使用內建的 NuGet 功能，必須手動加入所需的 LINQ to JSON 套件，也就是超級好用的 [Newtonsoft.Json](http://www.newtonsoft.com/json)，我此篇的範例程式碼也是從[該網站文件中](http://www.newtonsoft.com/json/help/html/linqtojson.htm)節取出來的。

如果直接將範例程式碼貼上 LINQPad 按 `f5` 去執行，會出現「找不到類型或命名空間名稱 'JObject' (您是否遺漏 using 指示詞或組件參考?)」的錯誤訊息。

![遺漏 using 指示詞](http://i.imgur.com/FfvtyQZ.png)

這是因為程式碼必須引入 Newtonsoft.Json 命名空間，才能使用 JObject 這個型別。我們可以從工具列的 `Query` > `References and Properties` 開啟 `Query Properties`，或直接按快速鍵 `f4`，在 `Additional References` 頁籤中點選 `Add` 加入所需的 `dll` 參考。如果你電腦上沒有 Json.NET 的 `dll`，可以從[這裡](https://github.com/JamesNK/Newtonsoft.Json/releases)下載最新的程式碼。
 
![加入需要的 References](http://i.imgur.com/7z2z5Zk.png)

加入需要的參考後，必須在第二個頁籤 `Additional Namespace Imports` 中輸入所需要命名空間：

```csharp
Newtonsoft.Json
Newtonsoft.Json.Linq
```

這裡的動作相當於 CSharp 程式碼中的 using

```csharp
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
```

![加入需要的 Namespace](http://i.imgur.com/YevxFEn.png)

這樣我們就完成引用 `Newtonsoft.Json` 相關的命名空間，範例程式碼就可以正常運作了

![成功使用 Json.NET 操作 Json 資料](http://i.imgur.com/A9HlCya.png)

----------

參考資料：

* [How does LINQPad reference other classes, e.g. Books in the LINQ in Action samples](http://stackoverflow.com/questions/1222009/how-does-linqpad-reference-other-classes-e-g-books-in-the-linq-in-action-sampl)
