---
layout: post
title: 使用 URL 開啟 Windows 應用程式
date: 2020-06-20 09:54
author: Poy Chang
comments: true
categories: [Dotnet, App, Develop]
permalink: registering-and-open-an-app-with-custom-uri-scheme/
---

在使用 Zoom 和別人進行會議的時候，會議主持者會發送一個網址連結，讓與會者可以用網頁瀏覽器開啟該連結，進一步啟動本機的 Zoom 應用程式，並進入指定的會議室，而作業是統是如何知道該網址是要開啟哪個桌面應用程式呢？背後的關鍵就在於 URL Protocol 的註冊。

>Zoom 安裝之後會在 Windows 登錄檔中的 `HKEY_CLASSES_ROOT` 之下註冊一組 `zoommtg` URL Protocol，這部分你可以去 Windows 登錄檔搜尋看看。

## 註冊自定的 URL Protocol

要註冊一組 URL Protocol 並設定呼叫該 URL 時啟動指定的程式，所需要的登錄設定如下：

```yml
HKEY_CLASSES_ROOT
   YourAppProtocol
      (Default) = "URL:Your App Protocol"
      URL Protocol = ""
      DefaultIcon
         (Default) = "YourAppName.exe,1"
      shell
         open
            command
               (Default) = "C:\YourAppNamePath\YourAppName.exe" "parameter=%1"
```

寫成註冊檔了話，可以參考下面的寫法：

```yml
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\YourAppProtocol]
@="URL:Your App Protocol"
"URL Protocol"=""

[HKEY_CLASSES_ROOT\YourAppProtocol\DefaultIcon]
@="\"YourAppName.exe\",1"

[HKEY_CLASSES_ROOT\YourAppProtocol\shell]

[HKEY_CLASSES_ROOT\YourAppProtocol\shell\open]

[HKEY_CLASSES_ROOT\YourAppProtocol\shell\open\command]
@="\"C:\\YourAppNamePath\\YourAppName.exe\" \"parameter=%1\""
```

這程式碼有些地方你需要修改成你的設定，例如 `YourAppProtocol` 這是要使用的協定名稱，註冊後就可以使用 `YourAppProtocol:` 此協定來呼叫你的應用程式，另一個重點是 `shell\open\command` 這個設定下的參數，這是你應用程式的所在位置，如果你需要接收參數，可以在後面加上一些參數資訊，例如以上面的程式碼來說，我使用 `parameter=%1` 來接收 `%1` 這個傳入的資訊。

你可以複製上面的程式碼，修改成你所需要的設定，另存成副檔名為 `reg` 的檔案並執行，即可完成註冊，註冊後可以使用 `regedit.msc` 這隻 Windows 程式查看登錄檔內容，就可以看到該設定，如下圖：

![註冊後可以在登錄檔中看到該設定](https://i.imgur.com/wLDU3j3.png)

## 測試程式

光看登錄檔的設定其實沒甚麼感覺，我們來寫一個測試用的 `YourAppName.exe` 來試試看。

這隻程式動作簡單，就只是把所接收到的參數資訊轉成 JSON 格式，然後印在終端機上，程式碼如下：

```csharp
static void Main(string[] args)
{
    Console.WriteLine("Launch App!");

    Console.WriteLine("Received Arguments: ");
    var arguments = args
        .Select(argument => argument.Split('='))
        .Where(split => split.Length == 2)
        .ToDictionary(split => split[0], split => split[1]);
    Console.WriteLine(JsonSerializer.Serialize(arguments));
    Console.ReadKey();
}
```

發行程 EXE 可執行檔後，複製到登錄檔所設定的位置 `C:\YourAppNamePath\YourAppName.exe`，接者在瀏覽器的網址列輸入 `YourAppProtocol:YourParameter`，瀏覽器會詢問你是否要啟動 `YourAppName` 應用程式：

![瀏覽器詢問是否開啟 YourAppName 應用程式](https://i.imgur.com/ZKBqYjA.png)

點選 Open 開啟應用程式後，可以看到以下的輸出畫面：

![啟動應用程式後將所接收到參數後印出來](https://i.imgur.com/QCk0pcQ.png)

我們可以清楚的看到所接收到的參數長甚麼樣子，如此一來就可以再去思考要如何和本機所安裝的應用程式如何互動了。

## 移除登錄檔

整個測試完成後，可以使用下面的程式來移除登錄檔：

```yml
Windows Registry Editor Version 5.00

[-HKEY_CLASSES_ROOT\YourAppProtocol]
```

>你可以複製上面的程式碼，修改 `YourAppProtocol` 成你所需要的設定，另存成副檔名為 `reg` 的檔案並執行，即可完成移除登錄檔

## 後記

這篇測試範例所用到的程式都放在 [poychang/demo-register-app-custom-url-protocol](https://github.com/poychang/demo-register-app-custom-url-protocol) 這裡，有相關需求的開發者可以直接取用。

- `YourAppName.sln` 主控台應用程式
- `register-custom-url-protocol.reg` 註冊登錄檔
- `delete-custom-url-protocol.reg` 移除登錄檔

----------

參考資料：

* [Registering an Application to a URI Scheme](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa767914(v=vs.85))
* [從網頁呼叫使用者電腦應用程式](https://kmmr.pixnet.net/blog/post/34454099)
* [如何使用 .reg 檔案新增、修改或刪除登錄子機碼和值](https://support.microsoft.com/zh-tw/help/310516/how-to-add-modify-or-delete-registry-subkeys-and-values-by-using-a-reg)
