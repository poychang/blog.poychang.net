---
layout: post
title: 安裝 Ubuntu 虛擬機並調整終端機螢幕解析度
date: 2015-11-12 11:30
author: Poy Chang
comments: true
categories: [Tools]
permalink: change-ubuntu-screen-resolution-host-on-virtualbox/
---

使用 Virtual Box 虛擬機安裝 Linux 後，終端機畫面解析度是 640x480，小小的螢幕總是看不舒服，如果沒有打算使用其他連線軟體來操作了話（畢竟是本地端的虛擬機，不需要開機後特意另外開 PuTTY 去連），可以調整 `/etc/default/grub` 這個檔案，來變更你想要的終端機解析度，詳細操作如下。

```
$ cd /etc/default/
$ sudo vi grub
```

找到 #GRUB_GFXMODE=640x480 這一行，將註解#拿掉，並修改成你要的解析度後儲存，例如：800x600

```
$ sudo update-grub
$ sudo reboot
```

重開機完成後，就大功告成囉～

測試環境： Windows 10 + VirtualBox 5，安裝 Ubuntu Server 14.03 LTS
