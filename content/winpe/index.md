---
title: WinPE
path: winpe
description: ""
contentType: markdown
---

# Windows Preinstallation Environment (WinPE)

WinPE是Windows的轻量化版本，常常被用于系统的维护、修复和安装。
WinPE最大的特点之一是加载后可以完全运行于内存(RAM)。这一方面意味着它可以在硬盘失效的情况下发挥作用，从而成为电脑修复的理想工具；另一方面也意味着在WinPE中做出的改动和设置在断电之后无法保存。WinPE通常会被安装在一个便携存储介质上，但也可以通过网络引导启动。
微软官方提供了制作WinPE的官方工具，即[Windows 评估和部署工具包 (Windows ADK)](https://learn.microsoft.com/zh-cn/windows-hardware/get-started/adk-install)。同时，也有开发者将常用的系统维护和部署软件封装到精简后的系统，制成特别的WinPE发行版本。常用的WinPE发行版有[wepe](https://www.wepe.com.cn/)等。
