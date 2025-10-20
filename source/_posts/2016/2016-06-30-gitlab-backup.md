---
layout: post
title: Gitlab 備份筆記
date: 2016-06-30 11:16
author: Poy Chang
comments: true
categories: [Tools]
permalink: gitlab-backup/
---

在使用 [Gitlab](https://about.gitlab.com/) 之後，實現了自由自在的做版控，但隨之而來的就是資料安全問題，深怕哪一天硬碟掛掉不再運作，陷入心血付之一炬的窘境，雖然是使用 VN 來架設 Gitlab 的環境，可以設定 VM 的備份計畫，不過多備一份就多一份安心，不是嗎～

## 環境

----------

 | Gitlab 環境
--- | ---
Name | GitlabServer
OS | Ubuntu 14.04.4 LTS
Gitlab | GitLab Community Edition 8.9.3

----------

 | 備份目的地
--- | ---
Name | BackupServer
OS | Ubuntu 14.04.4 LTS
Protocol | Samba 

## 操作步驟

以下操作是參考[Gitlab 備份/還原設定筆記](http://mycodetub.logdown.com/posts/260395-gitlab-backup-restore-settings-notes)，並加上實作時其他問題的解決方法。

1.將 BackupServer 的分享資料夾掛載到 GitlabServer 上

```bash
MOUNT_POINT=/mnt/BackupServer/gitlab_backup
SHARE_FOLDER=//BackupServer/gitlab_backup
DOMAIN=BackupServer
USERNAME=backupuser
PASSWORD=backup1234

mount -t cifs $SHARE_FOLDER $MOUNT_POINT -o username="$USERNAME",password="$PASSWORD",domain="$DOMAIN",iocharset=utf8,file_mode=0777,dir_mode=0777,guest
// 這裡你也可以不用 guest, 可以使用 gid=xxxx 或 uid=xxxx 來指定給某個群組或個人, guest 只是比較偷懶的作法
// 如果遇到失敗可以檢查一下是否有套件沒裝到，再使用 apt-get install 安裝
// apt-get install nfs-common
// apt-get install cifs-utils
```

2.修改 GitLab 的設定檔 `/etc/gitlab/gitlab.rb`，將備份路徑設定值 `gitlab_rails['backup_path']` 的內容，修改成 `/mnt/BackupServer/gitlab_backup`

3.執行下列指令使設定檔生效

```bash
// 讓 Gitlab 套用新設定
gitlab-ctl reconfigure
// 重新啟動 Gitlab
gitlab-ctl restart
```

4.此時可以使用 `gitlab-rake gitlab:backup:create` 來執行備份程序

5.使用 root 的身份設定 `cron table` 排程，做定時的備份

```
// 切換到 root 身份，修改系統排程設定檔
sudo crontab -e
```

6.開啟編輯氣候，在裡面加上下面這行，使系統每天 02:00 時，會執行 Gitlab 備份程序

```
0 2 * * * /opt/gitlab/bin/gitlab-rake gitlab:backup:create
```

這樣就完成了相關備份手續。

## 實作時遇到的問題

在上述步驟 3 時，執行 `gitlab-ctl reconfigure` 時會出現

```
Error executing action `create` on resource 'directory[/mnt/BackupServer/gitlab_backup]'
```

這個錯誤應該是權限的問題造成無法成功寫入備份資料，但很神奇的是，在 `/mnt/BackupServer/gitlab_backup` 中，我是可以新增、修改、刪除檔案的。

山不轉路轉，於是我將 Gitlab 的備份路徑，改到 user 的家目錄底下，並在 `cron table` 中，增加一個排程

```
0 3 * * * find /home/user/gitlab_backup/ -name "*gitlab_backup.tar" -mtime -1 -exec /bin/cp -a {} /mnt/BackupServer$
```

就是在 02:00 的時候執行 Gitlab 的備份計畫（備份檔存在 user 家目錄下），於 03:00 的時候將該備份檔，複製至掛載的遠端硬碟中，順利解決備份至不同機器的目的。

## 定期清除備份資料

Gitlab 的備份檔案是不會被覆蓋的，依照上述做法，每天都會有一筆新的備份檔，這無形也是造成硬碟空間的耗損，因此可以在 `cron table` 中再增加一個排程，只保留七天內的備份檔。

```
0 3 * * * find /mnt/BackupServer/gitlab_backup/ -name "*gitlab_backup.tar" -mtime +3 -exec rm -rf {} \;
```

## 完整排程程式碼

```
## Gitlab Backup
# Launch Gitlab backup service
0 2 * * * /opt/gitlab/bin/gitlab-rake gitlab:backup:create
# Retain backup data on local folder in 3 days
0 2 * * * find /home/user/gitlab_backup/ -name "*gitlab_backup.tar" -mtime +3 -exec rm -rf {} \;
# Move Gitlab backup file to remote server
0 3 * * * find /home/user/gitlab_backup/ -name "*gitlab_backup.tar" -mtime -1 -exec /bin/cp -a {} /mnt/BackupServer$
# Retain backup data on remote folder in 3 day
0 3 * * * find /mnt/BackupServer/gitlab_backup/ -name "*gitlab_backup.tar" -mtime +3 -exec rm -rf {} \;
```

![](http://i.imgur.com/l9c5L72.png)

----------

參考資料：

* [Gitlab 備份/還原設定筆記](http://mycodetub.logdown.com/posts/260395-gitlab-backup-restore-settings-notes)
* [gitlab部署、配置更改、备份及恢复](http://yangrong.blog.51cto.com/6945369/1659880)
