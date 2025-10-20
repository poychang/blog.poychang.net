---
layout: post
title: Synology 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Tools]
permalink: note-synology/
---
本篇作為書籤用途，記錄網路上的 Synology 相關資訊

## 不支援的硬碟

Synology NAS 官方會提供支援硬碟型號的列表，但不是不在支援列表上的硬碟就不能使用，只是在安裝的時候，系統會對他標註不被支援，這時候只要簡單幾個步驟就可以移除這個標誌。

針對 DSM 6.2.4 及以上版本，可以參考以下步驟來處理：

1. 透過 SSH / Telnet 以 root 權限登入 DSM。詳細步驟請參閱[此文章](https://www.synology.com/zh-tw/knowledgebase/DSM/tutorial/General_Setup/How_to_login_to_DSM_with_root_permission_via_SSH_Telnet)。
2. 在命令列介面輸入下列指令，以移除 SAS 硬碟的 **sys_not_support** 註記：
   `rm /run/synostorage/disks/sas*/sys_not_support`
3. 登入 DSM，並開啟 **儲存空間管理員** 。
4. SAS 硬碟的配置狀態應改變為 **未初始化** 。您即可使用硬碟來建立儲存集區，或執行其他操作。

## 當系統持續發出嗶嗶聲

當設備持續發出聲音時，可能是發生硬體設備異常，請前往**控制台** > **硬體 & 電源** > **一般** >  **嗶聲控制** ，查看**目前發出嗶聲的原因**以確認問題來源。

* 若是 **儲存空間降級** ，請參閱[此文章](https://www.synology.com/zh-hk/knowledgebase/DSM/help/DSM/StorageManager/storage_pool_repair)。
* 若是 **儲存空間損毀** ，請參閱[此文章](https://kb.synology.com/zh-hk/DSM/tutorial/What_do_I_do_when_a_volume_crashes)。
* 若是  **SSD 快取異常** ，請參閱[此文章](https://kb.synology.com/zh-hk/DSM/tutorial/Frequently_asked_questions_about_using_Synology_SSD_cache)。
* 若是 **散熱風扇異常** ，請先嘗試清理 Synology NAS 的灰塵，並確保機器放置在一個溫度適宜的環境中。若仍無法解決問題，代表風扇可能已故障，請參閱[此文章](https://kb.synology.com/zh-hk/DSM/tutorial/How_to_make_warranty_claim_for_Synology_NAS)。

要立即關閉嗶嗶聲，前往**控制台** > **硬體 & 電源** > **一般** > **嗶聲控制**，按一下靜音 (DSM 7.0 及以上版本) 或停止嗶聲 (DSM 6.2 及較早版本)。

---

參考資料：

* [Synology 知識中心](https://kb.synology.com/zh-tw)
