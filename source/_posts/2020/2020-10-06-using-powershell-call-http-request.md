---
layout: post
title: 使用 PowerShell 呼叫 Web API 請求
date: 2020-10-06 12:10
author: Poy Chang
comments: true
categories: [Develop, PowerShell]
permalink: using-powershell-call-http-request/
---

呼叫 HTTP 請求對開發者來說是非常稀鬆平常的，使用 PowerShell 來發送 HTTP 請求官方提供了兩種 Cmdlet`Invoke-WebRequest` 和 `Invoke-RestMethod`，前者主要用於想要取得 HTML 網頁內容，後者的使用情境偏向呼叫 Web API，這裡介紹一下我們可以怎麼使用 `Invoke-RestMethod`。

>這篇文章程式碼使用 [Postman TODO LIST API](https://documenter.getpostman.com/view/8858534/SW7dX7JG) 當作呼叫端點。

呼叫一個 Web API 基本上有 4 要素，端點（Endpoint）、動作（HTTP Method）、標頭（HTTP Header）、內容（HTTP Body），如果只是單純呼叫的動作，可以參考下面的程式碼：

```ps1
Invoke-RestMethod 'https://api-nodejs-todolist.herokuapp.com/user/login' `
    -Method 'POST' `
    -Headers @{ "Content-Type" = "application/json"; } `
    -Body "{`"email`": `"muh.nurali43@gmail.com`",`"password`": `"12345678`"}"
```

這邊注意到兩個地方，第一個是 Header 的參數使用 PowerShell 匿名物件的方式來提供，第二是 Body 的參數是用字串的方式來提供，當然你也可以都用匿名物件的方式來做，只是 Body 的參數要記得轉成 JSON 字串就是了，請參考下列做法：

```ps1
Invoke-RestMethod 'https://api-nodejs-todolist.herokuapp.com/user/login' `
    -Method 'POST' `
    -Headers @{ "Content-Type" = "application/json"; } `
    -Body (@{"email" = "muh.nurali43@gmail.com"; "password" = "12345678"; } | ConvertTo-Json)
```

你會發現上面所得到的結果，其實沒有那麼好閱讀，長的會像這樣：

[呼叫 Web API 後，使用 PowerShell 輸出物件資訊的樣式](https://i.imgur.com/1cD8SDr.png)

這是 PowerShell 輸出物件資訊的標準樣式，這樣的顯示方式很容易把後半段的資訊截斷，所以這裡建議，如果要查看呼叫 Web API 所拿到的回應 JSON 資料，可以使用 `|` 管線號，配上一個剛剛我們其實已經有用到的 Cmdlet `ConvertTo-Json`，

```ps1
Invoke-RestMethod 'https://api-nodejs-todolist.herokuapp.com/user/login' `
    -Method 'POST' `
    -Headers @{ "Content-Type" = "application/json"; } `
    -Body (@{"email" = "muh.nurali43@gmail.com"; "password" = "12345678"; } | ConvertTo-Json)
| ConvertTo-Json
```

這樣的輸出結果，就比較容易閱讀了：

[使用 ConvertTo-Json 格式化呼叫 Web API 後的回應結果](https://i.imgur.com/rl1OHJR.png)

## 我通常這樣寫

有時候程式會比較複雜，會需要很多地方彈性調整，所以通常我會用下面這樣的寫法：

```ps1
try {
    $EndPoint = "https://api-nodejs-todolist.herokuapp.com/user/login"
    $Headers = @{ 'Content-Type' = 'application/json'; }
    $Body = (@{"email" = "muh.nurali43@gmail.com"; "password" = "12345678"; } | ConvertTo-Json)
    $Response = Invoke-RestMethod $EndPoint -Method 'POST' -Headers $Headers -Body $Body
    Write-Output $Response | ConvertTo-Json
}
catch {
    Write-Output $Error[0]
}
```

基本上和上面提到的使用方式都一樣，但這裡加上 `try...catch` 來捕捉例外，捕捉到的例外錯誤訊息會被加到 PowerShell 的 `$Error` 變數中，幫助我們更快速的調查是哪裡發生錯誤。

>關於更多 `try...catch` 捕捉錯誤訊息，以及什麼資訊會存放進 `$Error` 變數中，請參考[這篇文章](./using-exception-messages-with-try-catch-in-powershell/)。

----------

參考資料：

* [無法在 Windows Server 中使用 Invoke-WebRequest PowerShell 指令](./invoke-webrequest-response-cannot-be-parsed-because-ie-engine-is-not-available/)
* [在 PowerShell 中使用 Try/Catch 捕捉錯誤訊息](./using-exception-messages-with-try-catch-in-powershell/)
