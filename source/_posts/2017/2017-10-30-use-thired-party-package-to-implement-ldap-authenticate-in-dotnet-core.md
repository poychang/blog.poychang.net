---
layout: post
title: 在 Dotnet Core 中使用第三方套件處理 LDAP 驗證
date: 2017-10-30 23:35
author: Poy Chang
comments: true
categories: [Dotnet, Develop]
permalink: use-thired-party-package-to-implement-ldap-authenticate-in-dotnet-core/
---
截至 Dotnet Core 2.0 尚未移轉 `System.DirectoryServices`，因此以前寫的 LDAP 驗證程式碼無法移轉到 Dotnet Core 中使用，在官方尚未提供對應的解法時，可以使用 `Novell.Directory.Ldap.NETStandard` 第三方套件來處理。

>LDAP 對很多公司來說是非常常用的驗證技術，大家可以到這個 [#2089 issues](https://github.com/dotnet/corefx/issues/2089) 加一，讓微軟知道您的想法。

>更新！[System.DirectoryServices](https://www.nuget.org/packages/System.DirectoryServices) 已經支援 Dotnet Core 囉！使用前請先確認您的目標框架是符合 .NET Standard 2.0 的 Dotnet 框架。

LDAP 的簡介請參考[這篇](/ldap-introduction/)。

## 測試環境

如果手邊沒有可以測試的 LDAP 伺服器，可以利用 [forumsys 提供的測試環境](http://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/)，相關資訊如下：

* 所提供的 LDAP 資料都是唯讀的
* 伺服器連線資訊
	* Server: `ldap.forumsys.com`  
	* Port: `389`
* 管理者資訊
	* Bind DN: `cn=read-only-admin,dc=example,dc=com`
	* Bind Password: `password`
* 帳戶資訊
	* 所有帳戶的密碼都是 `password`
	* 使用 `uid` 來識別帳戶
	* 使用 `ou` 來歸類群組
* 帳戶群組一
	* Group CN：`ou=mathematicians,dc=example,dc=com`
	* UID：
		* riemann
		* gauss
		* euler
		* euclid
* 帳戶群組二
	* Group CN：`ou=scientists,dc=example,dc=com`
	* UID：
		* einstein
		* newton
		* galieleo
		* tesla

>[IDMWORKS/DirEx](https://github.com/IDMWORKS/DirEx) 這個開源專案提供線上查看 LDAP 目錄的功能，[點此可查看](https://direx.azurewebsites.net/home/connect?host=ldap.virginia.edu&port=389&baseDn=o=University)上列 forumsys 的目錄內容。

## 實作驗證

使用 [Novell.Directory.Ldap.NETStandard](https://github.com/dsbenghe/Novell.Directory.Ldap.NETStandard) 第三方套件來實現 LDAP 驗證還滿簡單的，下面我們用 Dotnet CLI 和 VS Code 來實作看看。

>Dotnet CLI 命令請參考[.NET Core 命令列介面工具的官方文件](https://docs.microsoft.com/zh-tw/dotnet/core/tools/?tabs=netcore2x&WT.mc_id=DT-MVP-5003022)

透過 `dotnet new --list` 可以列出目前的範本清單，這裡使用主控台應用程式 `console`，執行下列指令建立專案：

```
dotnet new console -n DemoNovellLdapAuth
```

![建立專案](https://i.imgur.com/goduskI.png)

接著使用 VS Code 開啟專案目錄，並開啟內建的終端機功能，執行下列指令加入 Novell.Directory.Ldap.NETStandard 套件，接著執行 `dotnet restore` 還原套件。

```
dotnet add package Novell.Directory.Ldap.NETStandard
```

![安裝套件](https://i.imgur.com/4Oz3vdm.png)

修改 `Main` 主程式：

```scharp
static void Main(string[] args)
{
    var User = new { username = "tesla", password = "password" };

    var result = SimpleLdapAuth(User.username, User.password);
    Console.WriteLine($"LDAP Auth Result: {result}");
}
```

並建立 `SimpleLdapAuth` 方法：

```csharp
public static bool SimpleLdapAuth(string username, string password)
{
    var Host = "ldap.forumsys.com";
    var BindDN = "cn=read-only-admin,dc=example,dc=com";
    var BindPassword = "password";
    var BaseDC = "dc=example,dc=com";

    try
    {
        using (var connection = new LdapConnection())
        {
            connection.Connect(Host, LdapConnection.DEFAULT_PORT);
            connection.Bind(BindDN, BindPassword);

            var searchFilter = $"(uid={username})";
            var entities = connection.Search(BaseDC, LdapConnection.SCOPE_SUB, searchFilter, null, false);

            string userDn = null;
            while (entities.hasMore())
            {
                var entity = entities.next();
                var account = entity.getAttribute("uid");
                if (account != null && account.StringValue == username)
                {
                    userDn = entity.DN;
                    break;
                }
            }
            if (string.IsNullOrWhiteSpace(userDn)) return false;

            connection.Bind(userDn, password);
            return connection.Bound;
        }
    }
    catch (LdapException e)
    {
        throw e;
    }
}
```

執行 `dotnet run` 運行此應用程式。

![執行結果](https://i.imgur.com/tsmCf8a.png)

程式碼少少的，也滿簡單的，大致提一下關鍵方法：

* `connection.Connect(string host, int port)`
	* 建立連線
	* Port 可直接使用 `LdapConnection.DEFAULT_PORT`，即為 389 埠
* `connection.Bind(string dn, string password)`
	* 主要藉此連結管理者帳號，再進行查詢的動作
	* 順便一提，`connection.Bound` 會回傳布林值，作為判斷是否連結成功
* `connection.Search(string base, int scope, string filter, string[] attrs, bool typesOnly)`
	* base 為要開始查詢的 DN 位置
	* scope 搜尋的範圍
		* `SCOPE_BASE` 只查詢目前 DN 的項目
		* `SCOPE_ONE` 只查詢目前 DN 及下層 DN 的項目 
		* `SCOPE_SUB` 查詢目前 DN 下的樹（通常會使用此設定）
	* filter 過濾條件，查詢語法請參考[這篇](/ldap-introduction/)
	* attrs 要取回的屬性清單，可設定成 `null` 將所有屬性取回
	* typesOnly `true` 只返回名稱，`false` 返回名稱及屬性

上面的方法需要一個管理者帳號做發動，如果你可以確定你的 LDAP 目錄結構，並且寫出鎖定某位使用者帳號的查詢語法，帳號驗證的程式碼可以精簡成如下：

```csharp
public static bool SelfLdapAuth(string username, string password)
{
    var Host = "ldap.forumsys.com";
    var BaseDC = "dc=example,dc=com";

    try
    {
        using (var connection = new LdapConnection())
        {
            connection.Connect(Host, LdapConnection.DEFAULT_PORT);
            connection.Bind($"uid={username},{BaseDC}", password);
            return connection.Bound;
        }
    }
    catch (LdapException e)
    {
        throw e;
    }
}
```

重點只要擺在 `connection.Bind(string dn, string password)` 中 `dn` 的設定即可。

>本篇完整範例程式碼請參考 [poychang/DemoDotnetCoreNovellLdap](https://github.com/poychang/DemoDotnetCoreNovellLdap)。

----------

參考資料：

* [來自 ASP .NET 的 Active Directory 網域服務驗證](http://msdn.microsoft.com/zh-tw/library/ms180890.aspx)
* [Online LDAP Test Server](http://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/)
* [.NET Core LDAP](https://long2know.com/2017/06/net-core-ldap/)
* [aspnet-core-ad-authentication](https://github.com/chsword/aspnet-core-ad-authentication)
* [Novell.Directory.Ldap.NETStandard](https://github.com/dsbenghe/Novell.Directory.Ldap.NETStandard)
* [ASP.NET Core 2.0 LDAP Active Directory Authentication](https://stackoverflow.com/questions/49682644/asp-net-core-2-0-ldap-active-directory-authentication)
