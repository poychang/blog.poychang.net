---
layout: post
title: 如何編譯早期版本的 Windows Terminal
date: 2019-05-08 12:45
author: Poy Chang
comments: true
categories: [Tools]
permalink: how-to-build-early-version-of-new-windows-terminal/
---

Microsoft Build 2019 發表了全新的 Windows Terminal 終端機工具，預計在今年夏天在 Windows 10 的 Microsoft Store 推出預覽版，並在冬天的時候推出正式版本，不過對於開發者而言，看到這全新的終端機工具，想必躍躍欲試，很想早點玩玩這支援多頁籤、使用 GPU 加速、等現代化功能的終端機，這裡就帶大家親自 Build 起來！

## 環境需求

建置環境請參考下列項目：

1. Visual Studio S2017
2. Git command-line tool
3. nuget.exe
4. Windows 10 1903 (根據 [#437](https://github.com/microsoft/Terminal/issues/437)).

## 建置步驟

Windows Terminal 是個使用 C++ 寫的開源專案，專案程式碼當然放在 GitHub 上囉，首先到這裡 [microsoft/Terminal](https://github.com/microsoft/Terminal) 將整個專案 Clone 到自己的本機電腦吧。

```bash
git clone https://github.com/microsoft/Terminal.git
```

目前這個專案只能使用 Visual Studio 2017 來進行建置，且必須安裝以下兩個工作負載：

1. 使用 C++ 的桌面開發 (Desktop Development with C++)
2. 通用 Windows 平台開發 (Universal Windows Platform development)

![安裝 Visual Studio 2017 工作負載](https://i.imgur.com/CqYr51F.png)

安裝完成後，請在專案目錄下，使用以下指令下載專案相依的子專案：

```bash
cd .\Terminal
git submodule update --init --recursive
```

接者使用 nuget.exe 還原相依的套件，這裡你可以使用你系統本身的 nuget 或者你可以使用專案內附帶的 nuget.exe 程式，下列指令使用專案內自帶的工具程式：

```bash
.\Dep\nuget\nuget.exe  restore OpenConsole.sln
```

完成 nuget 套件安裝後，使用 Visual Studio 2017 開啟專案中的 `OpenConsole.sln`，先修改方案的組態及目標平台，因為會動到的專案很多，這邊建議透過組態管理員來調整，請參考下圖將組態設定為 `Release` 建置平台設定為 `x64` 或 `x86`：

![修改方案的組態及目標平台](https://i.imgur.com/jFKKum9.png)

![組態管理員](https://i.imgur.com/ZpVQc4h.png)

設定完成後再建置方案：

![建置方案](https://i.imgur.com/4UfhhD3.png)

建置方案的過程中，可能會遇到一些問題（畢竟是早期版本，有問題很正常），這裡我列出我遇到的狀況，及解法：

#### 遇到 C2220 的編碼警告

有些檔案的編碼有問題，造成無法成功建置，將下列檔案（你可能需要修改你遇到的）編碼修改成 UTF-8 BOM

1. `.\Terminal\src\renderer\base\thread.cpp`
2. `.\Terminal\src\renderer\base\thread.hpp`
3. `.\Terminal\src\terminal\parser\ut_parser\InputEngineTest.cpp`
4. `.\Terminal\src\tools\vtpipeterm\main.cpp`
5. `.\Terminal\src\host\ut_host\ClipboardTests.cpp`
6. `.\Terminal\src\inc\test\CommonState.hpp`

#### 遇到字串編碼問題

`.\Terminal\src\tools\vtpipeterm\main.cpp` 這個檔案有多國語系的字串，請將此檔案中的 `395`、`398`、`401`、`404` 行的字串前面加上 `u8` 前綴，如下圖：

![加入 u8 前綴](https://i.imgur.com/YAOl5dY.png)

因為這是早期自行建置的版本，所以不會有相關的憑證，所以必須要開啟 Windows 系統的開發者模式，從 `Windows Settings` > `Upgrade & Security` > `For Developers` 中開啟 `Developer mode`，請參考下圖位置：

![開啟 Windows 開發者模式](https://i.imgur.com/QOSnal9.png)

因為這是早期自行建置的版本，所以不會有相關的憑證，所以必須透過 Visual Studio 進行佈署安裝，你可以在方案中的 `Terminal` 資料夾中找到 `CascadiaPackage`，可以點選這個檔案並從滑鼠右鍵的清單中找到 `Delpoy` 功能進行佈署安裝，請參考下圖位置：

![從 Visual Studio 進行佈署安裝](https://i.imgur.com/r7cGjxK.png)

接著你就可以在系統的開啟清單中找到 Windows Terminal (Preview) 程式囉！🎉🎉🎉

![Windows Terminal (Preview) 出現了！](https://i.imgur.com/VDROLOP.png)

![Windows Terminal (Preview) 出現了！](https://i.imgur.com/Xd4mDgE.png)

----------

參考資料：

* [A new Console for Windows - It's the open source Windows Terminal](https://www.hanselman.com/blog/ANewConsoleForWindowsItsTheOpenSourceWindowsTerminal.aspx)
* [Windows 全新终端 Windows Terminal](https://www.oschina.net/p/windows-terminal)
* [新版Windows終端機可以自訂介面了](https://www.ithome.com.tw/news/130461)
* [microsoft/Terminal issues #489](https://github.com/microsoft/Terminal/issues/489)
