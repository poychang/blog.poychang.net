---
layout: post
title: 系統命令筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, PowerShell, Tools]
permalink: note-command-line/
---

Windows 叫做命令提示字元（cmd.exe, Command Line），Unix-like OS 叫做終端機（Terminal），這是一個以文字為主的應用程式，可以查看、處理並且控制你電腦裡的檔案，系統原生提供了很多好用的指令和用法，隨手筆記之。

## 命令列也有快捷鍵

![命令列快捷鍵](https://i.imgur.com/WSiW3Eb.png)

個人覺得必學的有：

- `Ctrl` + `←` 或 `→` 以字組作為跳動距離來移動游標
- `Ctrl` + `A` 移動游標至最前面
- `Ctrl` + `E` 移動游標至最後面
- `Alt` + `B` 移動游標至該字組的最前面
- `Alt` + `F` 移動游標至該字組的最後面

REF:[Moving efficiently in the CLI](https://clementc.github.io/blog/2018/01/25/moving_cli/)

## 清除本機的路由快取

```bash
ipconfig /flushdns
arp -d
nbtstat -RR
```

## 使用指令啟動 Windows 管理工具

副檔名 `.cpl` 的也可以執行喔,自己用 `dir *.cpl /s` 找找有哪些可以用，像 `desk.cpl` 是桌面內容，`sysdm.cpl` 是系統內容

| 指令                    | 說明                          |
| ----------------------- | ----------------------------- |
| control                 | 控制台                        |
| explorer                | 開啟檔案總管                  |
| eventvwr.msc            | 事件檢視器                    |
| mstsc                   | 遠端桌面連接                  |
| mem.exe                 | 顯示記憶體使用情況            |
| gpedit.msc              | 群組原則                      |
| nslookup                | IP 位址偵測器                 |
| logoff                  | 登出指令                      |
| tsshutdn                | 60 秒倒計時關機指令           |
| rononce -p              | 15 秒關機                     |
| lusrmgr.msc             | 本地機用戶和組                |
| services.msc            | 本機服務設定                  |
| notepad                 | 開啟記事本                    |
| cleanmgr                | 磁碟垃圾整理                  |
| compmgmt.msc            | 電腦管理                      |
| net stop messenger      | 停止信使服務                  |
| conf                    | 啟動                          |
| charmap                 | 啟動字元對應表                |
| diskmgmt.msc            | 磁牒管理實用程序              |
| calc                    | 啟動電子計算器                |
| dfrg.msc                | 磁碟重組工具                  |
| chkdsk.exe              | 磁牒檢查                      |
| devmgmt.msc             | 裝置管理員                    |
| drwtsn32                | 系統醫生                      |
| dxdiag                  | 檢查 DirectX 資訊             |
| regedt32                | 註冊表編輯器                  |
| msconfig.exe            | 系統配置實用程序              |
| rsop.msc                | 群組原則結果集                |
| regedit.exe             | 註冊表                        |
| progman                 | 程序管理器                    |
| winmsd                  | 系統資訊                      |
| perfmon.msc             | 電腦效能監測程序              |
| winver                  | 檢查 Windows 版本             |
| sfc.exe                 | 系統檔案檢查器                |
| sfc /scannow            | 掃瞄錯誤並復原                |
| taskmgr                 | 工作管理器                    |
| secpol.msc              | 本機安全性設定                |
| rsop.msc                | 原則的結果集                  |
| wmimgmt.msc             | 開啟 Windows 管理體系結構WMI) |
| wupdmgr                 | Windows 更新程序              |
| wscript                 | Windows 指令碼宿主設定        |
| magnify                 | 放大鏡實用程序                |
| mmc                     | 開啟控制台                    |
| mobsync                 | 同步指令                      |
| dfrg.msc                | 磁碟重組程式                  |
| dcomcnfg                | 開啟系統元件服務              |
| ddeshare                | 開啟 DDE 共享設定             |
| nslookup                | 網路管理的工具向導            |
| ntbackup                | 系統制作備份和還原            |
| narrator                | 螢幕「講述人」                |
| ntmsmgr.msc             | 移動存儲管理器                |
| ntmsoprq.msc            | 移動存儲管理員操作請求        |
| netstat -an             | (TC)指令檢查連接              |
| syncapp                 | 新增一個公文包                |
| sysedit                 | 系統配置編輯器                |
| sigverif                | 文件簽名驗證程序              |
| shrpubw                 | 新增共用資料夾                |
| secpol.msc              | 本機安全原則                  |
| Sndvol32                | 音量控制程序                  |
| eudcedit                | 造字程序                      |
| packager                | 對像包裝程序                  |
| regsvr32 /u *.dll       | 停止 dll 文件執行             |
| regsvr32 /u zipfldr.dll | 取消 ZIP 支持                 |
| certmgr.msc             | 證書管理實用程序              |
| compmgmt.msc            | 電腦管理                      |
| ciadv.msc               | 索引服務程序                  |
| fsmgmt.msc              | 共用資料夾管理器              |
| osk                     | 開啟螢幕小鍵盤                |
| utilman                 | 協助工具管理器                |
| clipbrd                 | 剪貼板檢視器                  |

## 驗證當前環境是否有系統管理員權限

https://stackoverflow.com/a/16285248/3803939

This trick only requires one command: type `net session` into the command prompt.

If you are **NOT an admin**, you get an access is denied message.

```
System error 5 has occurred.
Access is denied.
```

If you **ARE an admin**, you get a different message, the most common being:

```
There are no entries in the list.
```

## Net Use

NET 指令是 Windows NT 中的一個功能強大的工具，可以管理網路環境、各種服務程序的執行和配置、進行用戶和登入管理等。

在使用 NET 指令時需要注意，它有一些指令是會馬上產生作用並永久儲存的，使用的時候要慎重。

下面對 NET 指令的不同參數的基本用法做一些初步的介紹：

- NET VIEW 作用：顯示域列表、電腦列表或指定電腦的共享資源列表
- NET USER 作用：增加或更改用戶帳號或顯示用戶帳號信息。該指令也可以寫為 `net users`
- NET USE 作用：連接電腦或中斷連線電腦與共享資源的連接，或顯示電腦的連接信息
- NET TIME 作用：使電腦的時鐘與另一台電腦或域的時間同步
- [Net 指令教學](http://ocean2002n.pixnet.net/blog/post/88734895-%5B%E6%95%99%E5%AD%B8%5D-net%E6%8C%87%E4%BB%A4%E6%95%99%E5%AD%B8)

## 使用 UNC 路徑

在命令提示字元中無法用 `cd` 來取得 UNC（Universal Naming Convention，通用命名慣例）的路徑，可以使用 `pushd` 和 `popd` 來執行

- `pushd <UNC path>` will create a temporary virtual drive and get into it.
- `popd` will delete the temporary drive and get you back to the path you were when you entered pushd.

範例：

```bash
C:\a\local\path> pushd \\network_host\a\network\path
U:\a\network\path> REM a temporary U: virtual drive has been created
U:\a\network\path> popd
C:\a\local\path> REM the U: drive has been deleted
C:\a\local\path>
```

## 刪除 Mac OS 自動生成隱藏檔案（.\_DS_Store）

Mac OS 會自動為每個可以由 GUI 圖像界面瀏覽的資料夾生成隱藏檔案 `._DS_Store`，用來記往資料夾的個別設定。

每次把隨身碟借給 Mac OS 的使用者後，在 Windows 就會看到一堆這種檔案，這時候就可以透過以下指令，一次把所有指定的檔案刪除掉。這指令當然也可以用來刪除 Windows 上的快取縮圖 `Thumbs.db`。

```bash
del /s /q /f /a .DS_STORE
```

## 其他待整理指令

```bash
# 清除登入帳密
# 清除所有連線
net use * /del /y
# 清除指定連線
net use \\IP\FileShare /del /y
```

```bash
# 指定帳號密碼登入
net use \\IP /USER:帳號 密碼
```

```bash
# 顯示每個處理程序中的服務
tasklist /svc
```

```bash
# 查看 c 槽磁碟空間
fsutil volume diskfree c:
```

- `wmic` 整台電腦的資訊都可以用此工具來取得，包含所安裝的軟體、Licence
- `runas` 用不同的身分去執行命令
  _ 執行範例 `runas /user:USER_NAME program.exe`
  _ `PSEXEC` 功能很強，可以取代 `runas`
- `refreshenv` 不重新啟動 cmd 下，更新環境變數（似乎不是每台機器都可以用）
- `set` 列出所有環境變數，讀取指定環境變數方法如下
  _ cmd 可使用 `%VARIABLES_NAME%`
  _ PowerShell 可使用 `$Env:VARIABLES_NAME`
- `df [OPTION] [FILE]` 檢查 Linux 檔案系統的磁碟空間佔用情況
  _ 如果沒有檔案名被指定，則所有當前被掛載的檔案系統的可用空間將被顯示
  _ 常用命令參數
  _ `-a` 全部檔案系統清單
  _ `-h` 方便閱讀方式顯示
  _ `-H` 等於“-h”，但是計算式，1K=1000，而不是 1K=1024
  _ `-l` 只顯示本地檔案系統
  _ `-T` 檔案系統類型
  _ 使用實例 `df -h` 可以查看各個硬碟剩餘空間

## 修改 Windows 路由表

- 使用 `ipconfig /all` 查看網卡信息
- 使用 `route print` 命令查看路由表信息
  _ Active Routes ：活動的路由
  _ Network destination ：目的網段
  _ Netmask ：子網掩碼
  _ Gateway ：閘道
  _ Interface: 接口，接口定義了針對特定的網絡目的地址，本地計算機用於發送數據包的網絡接口
  _ Metric: 計量（跳數），用於指出路由的成本，通常情況下代表到達目標地址所需要經過的跳躍數量，一個計量代表經過一個路由器。跳數越低，代表路由成本越低，優先級越高 \* Persistent Routes ：手動配置的靜態固化路由

Metric 說明

一個路由為一個計量。數據傳輸過程中需要經過多個網絡，每個被經過的網絡設備點（有能力路由的）叫做一個計量，地址就是它的 IP。

計量數是經過了多少個計量的累加器，為了防止無用的數據包在網上流散。

為路由指定所需計量數必須是整數值（範圍是 1 ~ 9999），用來在路由表中表裡的多個路由中選擇與轉發包中的目標地址最為匹配的路由，所選的路由具有最少的計量數。

計量數能夠反映通過網路設備的數量、路徑的速度、路徑可靠性、路徑吞吐量以及管理屬性。

## 雙網卡設定案例

網路環境：

- 有線：可連接公司內網，不能連接 Internet，預設閘道為 172.21.91.1
- 無線：可連接 Internet，不能連接公司內網，預設閘道為 192.168.101.1

可以先使用 `route PRINT` 指令檢視目前路由設定。

目標：同時連接兩個網路，並自動選擇路由，實現內外網都可以存取

```bash
# 刪除預設設定
route delete 0.0.0.0

# 外網路由全走無線
route -p add 0.0.0.0 mask 0.0.0.0 192.168.101.1

# 公司內網全部在 172.21.*.* 網段，增加此路由設定
route -p add 172.21.0.0 mask 255.255.0.0 172.21.91.1

# 重新啟動電腦
shutdown -r -t 0
```

- route 指令加上 `-p` 代表加入永久的路由設定，不會因為重開機而清除

假設執行完上面的指令後，執行 `route PRINT` 指令的路由表如下，有兩個 `0.0.0.0` 的路由：

```
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0      172.21.91.1    172.21.10.50     10
          0.0.0.0          0.0.0.0    192.168.101.1   192.168.10.50     35
```

而我們要修改 Metric 來調整優先權，優先使用走外網的 Gateway 來上網，可以使用下面方法來設定那一張網卡有較高的優先權（其實不是優先權，是匹配程度）：

1. Windows **控制台** > **網路和網際網路**
2. 希望優先走外網，因此需要修改內網網卡的設定，在內網網卡上點選右邊選單**變更介面卡設定**
3. 點選網卡的圖樣右鍵選**內容** > **網際網路** > 選擇 **TCP/IPv4** > 點選下方的**內容**
4. 點選**進階**
5. 下面的**自動計量** (Metric) 不要勾，自己輸入數字 `100`，這個數字越大優先權越低，請不要設超過 `200` 以免輸給廣播的權重

Metric 是用來**表示傳送成本的參考數字**，系統會依此做優先順序的加權計算，來選擇適合的路由，所以基本上只要內網的 Metric 輸給走外網的即可。

>順帶一提，永久的路由設定值會被儲存在 Windows 機碼中，路徑為 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\`。

## curl 指令用法

參考資料：[curl 指令用法](http://evelynnote.blogspot.tw/2011/03/curl.html)

curl 是 Linux 下一個很強大的 http 命令列工具

1. 取得網頁內容，螢幕輸出
   `$ curl http://www.linuxidc.com`
2. `-o`: 取得網頁內容，檔案輸出
   `$ curl -o page.html http://www.linuxidc.com`
3. `-O`: 使用伺服器上的檔案名，存在本地
   `$ curl -O http://cgi2.tky.3web.ne.jp/~zzh/screen1.JPG`
4. 可使用 Regular Expression 抓取所有 match 的檔案，指定 match 的群組內容為新檔名
   `$ curl -O http://cgi2.tky.3web.ne.jp/~zzh/screen[1-10].JPG`
   `$ curl -o #2-#1.jpg http://cgi2.tky.3web.ne.jp/~{zzh,nick}/[001-201].JPG`
   原來： ~zzh/001.JPG -> 下載後：001-zzh.JPG
   原來： ~nick/001.JPG -> 下載後：001-nick.JPG
5. `-c`: 續傳 (只能用在原本是 curl 傳輸的檔案)
   `$ curl -c -O http://cgi2.tky.3wb.ne.jp/~zzh/screen1.JPG`
6. `-u`: 指定 FTP 帳號密碼
   `$ curl -u name:passwd ftp://ip:port/path/file`
   `$ curl ftp://name:passwd@ip:port/path/file`
7. `-T`: 上傳檔案
   `$ curl -T localfile -u name:passwd ftp://upload_site:port/path/`
   `$ curl -T localfile http://cgi2.tky.3web.ne.jp/~zzh/abc.cgi`
   (注意這時候使用的協定是 HTTP 的 PUT method)

8. Http GET 與 POST 模式
   GET 模式什麼 option 都不用，只需要把變數寫在 url 裡面就可以了比如：
   `$ curl http://www.linuxidc.com/login.cgi?user=nickwolfe&password=12345`
   而 POST 模式的 option 則是 -d
   `$ curl -d "user=nickwolfe&password=12345" http://www.linuxidc.com/login.cgi`
   到底該用 GET 模式還是 POST 模式，要看對面伺服器的程式設定。比如 POST 模式下的文件上傳
   `<form action="http://cgi2.tky.3web.ne.jp/~zzh/up_file.cgi" enctype="multipar/form-data" method="POST"> <input name="upload" type="file"/> <input name="nick" type="submit" value="go"/></form>`
   這樣一個 HTTP 表單，我們要用 curl 進行模擬，就該是這樣的語法：
   `$ curl -F upload=@localfile -F nick=go http://cgi2.tky.3web.ne.jp/~zzh/up_file.cgi`

9. https 使用本地認證
   `$ curl -E localcert.pem https://remote_server`

10. 通過 dict 協定去查字典
    `$ curl dict://dict.org/d:computer`

## Unix 與 MS-DOS 指令對照表

REF: [Unix 與 MS-DOS 指令對照表](https://market.cloud.edu.tw/content/primary/info_edu/cy_sa/LinuxY/cmd/dos2unixcmd.htm)

| Unix           | MS-DOS          | 說明              |
| -------------- | --------------- | ----------------- |
| `cd`           | `cd`            | 進入目錄          |
| `mkdir`        | `md`            | 開子目錄          |
| `pwd`          | `cd`            | 顯示目前目錄      |
| `env`          | `set`           | 顯示目前環境變數  |
| `setenv`       | `set`           | 設定環境變數      |
| `rm`           | `del`           | 殺檔案            |
| `cat` / `more` | `type`          | 顯示檔案內容      |
| `ls`           | `dir`           | 顯示檔案          |
| `lp`           | `print`         | 列印檔案          |
| `cp`           | `copy`          | 複製檔案          |
| `date`         | `date` / `time` | 時間顯示.設定     |
| `mv`           | `ren`           | 移動,重新命名檔案 |
| `man`          | help`           | 線上指令查詢      |

---

參考資料：

- [命令列也有快捷鍵](#%e5%91%bd%e4%bb%a4%e5%88%97%e4%b9%9f%e6%9c%89%e5%bf%ab%e6%8d%b7%e9%8d%b5)
- [驗證當前環境是否有系統管理員權限](#%e9%a9%97%e8%ad%89%e7%95%b6%e5%89%8d%e7%92%b0%e5%a2%83%e6%98%af%e5%90%a6%e6%9c%89%e7%b3%bb%e7%b5%b1%e7%ae%a1%e7%90%86%e5%93%a1%e6%ac%8a%e9%99%90)
- [Net Use](#net-use)
- [使用 UNC 路徑](#%e4%bd%bf%e7%94%a8-unc-%e8%b7%af%e5%be%91)
- [刪除 Mac OS 自動生成隱藏檔案（.\_DS_Store）](#%e5%88%aa%e9%99%a4-mac-os-%e8%87%aa%e5%8b%95%e7%94%9f%e6%88%90%e9%9a%b1%e8%97%8f%e6%aa%94%e6%a1%88dsstore)
- [其他待整理指令](#%e5%85%b6%e4%bb%96%e5%be%85%e6%95%b4%e7%90%86%e6%8c%87%e4%bb%a4)
- [修改 Windows 路由表](#%e4%bf%ae%e6%94%b9-windows-%e8%b7%af%e7%94%b1%e8%a1%a8)
- [雙網卡設定案例](#%e9%9b%99%e7%b6%b2%e5%8d%a1%e8%a8%ad%e5%ae%9a%e6%a1%88%e4%be%8b)
- [curl 指令用法](#curl-%e6%8c%87%e4%bb%a4%e7%94%a8%e6%b3%95)
- [Unix 與 MS-DOS 指令對照表](#unix-%e8%88%87-ms-dos-%e6%8c%87%e4%bb%a4%e5%b0%8d%e7%85%a7%e8%a1%a8)
