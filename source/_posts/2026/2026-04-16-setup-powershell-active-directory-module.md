---
layout: post
title: 如何在 PowerShell 中安裝 Active Directory 模組
date: 2026-04-16 10:17
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: setup-powershell-active-directory-module/
---

如果你經常需要查詢 Active Directory(AD) 資訊，在 PowerShell 環境下可以使用 Rsat.ActiveDirectory 讓 Windows 10/11 可以用 PowerShell 操作 Active Directory（AD）。

## Rsat.ActiveDirectory 是什麼

Rsat.ActiveDirectory 是 Remote Server Administration Tools (RSAT) 裡的一個子模組，正式的全名是：Active Directory Domain Services and Lightweight Directory Services Tools，主要可以用它來做以下事情：

1. 查詢 AD 使用者/群組/電腦
2. 建立/修改/刪除 AD 物件
3. 管理群組成員
4. 查 OU、移動物件
5. 密碼與帳號管理

## 安裝 Rsat.ActiveDirectory

首先，我們可以先確認一下目前系統裡有沒有安裝 Rsat.ActiveDirectory 模組：

```powershell
Get-WindowsCapability -Online | Where-Object Name -like "Rsat.ActiveDirectory*"
# Output:
# -----------------------------------
# Name  : Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0
# State : Installed
```

這時會輸出目前系統裡有沒有安裝 Rsat.ActiveDirectory 模組以及該模組的版本，如果 State 是 Installed 就表示已經安裝了。

在 Windows 10/11 裡，安裝 Rsat.ActiveDirectory 非常簡單，可以用系統管理者權限使用 PowerShell 的 `Add-WindowsCapability` 指令來安裝 Active Directory DS / LDS 工具：

```powershell
Add-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0
```

如果你想要安裝完整的 RSAT 工具包，可以使用以下指令：

```powershell
Get-WindowsCapability -Online |
  Where-Object Name -like "Rsat.*" |
  Add-WindowsCapability -Online
```

## 常用指令

此模組所包含的 PowerShell Cmdlets 總數超過 100 個，這一整套的 AD Cmdlets 指令裡，常用於自動化腳本以及最值得記住的 AD Cmdlets 如下：

| Cmdlet                       | 主要用途                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| **Get-ADUser**               | 查詢 AD 使用者資訊（支援 Filter、LDAPFilter、屬性選取）。    |
| **Set-ADUser**               | 修改使用者屬性（部門、職稱、Email、登入選項…）。             |
| **New-ADUser**               | 建立新使用者帳號，可搭配密碼、OU、群組等初始化設定。         |
| **Remove-ADUser**            | 刪除使用者帳號（通常搭配自動化離職流程）。                   |
| **Get-ADGroup**              | 查詢群組資訊（安全性群組、通訊群組）。                       |
| **Add-ADGroupMember**        | 將使用者/電腦加入群組（最常用於權限授予）。                  |
| **Remove-ADGroupMember**     | 從群組移除成員（常用於權限回收）。                           |
| **Get-ADGroupMember**        | 查詢群組成員清單（支援遞迴）。                               |
| **Get-ADComputer**           | 查詢電腦物件（OU 位置、啟用狀態、OS 版本）。                 |
| **Move-ADObject**            | 將 User/Group/Computer 移動到指定 OU（常用於自動化佈署）。   |
| **Unlock-ADAccount**         | 解鎖被鎖定的使用者帳號。                                     |
| **Set-ADAccountPassword**    | 設定或重設使用者密碼（支援 Reset / Change）。                |
| **Enable-ADAccount**         | 啟用帳號（常用於新進員工流程）。                             |
| **Disable-ADAccount**        | 停用帳號（常用於離職流程）。                                 |
| **Search-ADAccount**         | 搜尋鎖定、過期、停用、密碼過期等帳號狀態。                   |
| **Get-ADOrganizationalUnit** | 查詢 OU 結構與屬性。                                         |
| **Get-ADDomain**             | 查詢網域資訊（功能層級、PDC、RID Master…）。                 |
| **Get-ADForest**             | 查詢樹系資訊（Schema、Domain 列表、GC）。                    |
| **Restore-ADObject**         | 從 AD 回收桶還原被刪除的物件。                               |
| **Get-ADObject**             | 查詢任何 AD 物件（User/Group/OU/Computer/ServiceAccount…）。 |

---

參考資料：

- [安裝PowerShell - Active Directory Module解決AD大小事](https://blog.kkbruce.net/2019/02/setup-powershell-active-directory-module.html)
