---
layout: post
title: 使用 AutoHotKey 將視窗固定在螢幕最上層
date: 2022-11-01 10:15
author: Poy Chang
comments: true
categories: [Tools]
permalink: make-a-window-always-on-top-on-windows/
---

將視窗固定在螢幕最上層，可以讓視窗不會被其他視窗遮住，在需要持續查看某些資訊的時候，這功能會非常好用，但不是每個應用程式都有這樣的設定，不過如果你有使用 [AutoHotkey](https://www.autohotkey.com/) 了話，可以簡單設定一行指令，讓需要這功能的應用程式也有同樣的功能。

設定的方式相當簡單，只要在 AutoHotkey 的腳本中加入以下指令即可：

```ahk
#IfWinActive, ahk_exe YOUR_APP.exe
    ^SPACE::  Winset, Alwaysontop, , A
return
```

其中 `YOUR_APP.exe` 是你要設定的應用程式的執行檔名，例如我要設定的是 [Visual Studio Code](https://code.visualstudio.com/)，所以執行檔名就是 `Code.exe`，當然，如果你要讓所有程式都有這樣的功能了話，可以將 `#IfWinActive` 這行註解掉，就會對所有視窗都有這樣的功能。

設定好後，只要按下 `Ctrl + Space` 即可將視窗固定在螢幕最上層，再按一次就會取消固定，非常方便。

## 後記

![PowerToy - Always on Top](https://i.imgur.com/XjhiHRe.png)

如果你有使用 [PowerToy](https://learn.microsoft.com/zh-tw/windows/powertoys/?WT.mc_id=DT-MVP-5003022) 了話，這工具也有一樣的功能，在 PowerToy 內有一個 [Always on Top](https://learn.microsoft.com/zh-tw/windows/powertoys/always-on-top?WT.mc_id=DT-MVP-5003022)的設定，也可以設定使用快速鍵來將視窗固定在螢幕最上層，不過他是使用負向表列的方式來限定可以使用此功能的應用程式，也就是說預設是給所有視窗程式使用，而你可以將不需要此功能的程式在列表上做排除。

因此我覺得 AutoHotkey 的方式比較符合我的使用情境。

---

參考資料：

* [在指定的程式下使用 AutoHotKey 執行快速鍵](https://blog.poychang.net/use-auto-hot-key-in-specific-program/)
* [PowerToy - Always on Top](https://learn.microsoft.com/zh-tw/windows/powertoys/always-on-top?WT.mc_id=DT-MVP-5003022)
