---
title: 系统蓝屏
path: clinic/bsod
description: ": ( Oops..."
contentType: markdown
---

# 系统蓝屏

## `INACCESSIBLE_BOOT_DEVICE`

> 摘录自[组织部芝士虾](https://cheesy-shrimp.bitnp.net/2019-01-01-RAID/)
> 作者 `everything411 and LoveCatC`

一些型号的电脑允许用户修改磁盘控制器模式。如笔者的 Dell 电脑，在 BIOS 的 SATA Operation 中，可以选择 SATA 的控制模式为 AHCI 或 RAID。其它的一些 BIOS 可能还支持 IDE 模式。

> IDE、AHCI、NVME，这些都是硬盘的接口标准。其中IDE是一种相对落后的标准。它也可以叫做 ATA/PATA。而 AHCI 则是 Intel 发明的相对先进的标准。显著的特点之一便是支持热插拔。

接口标准的不同造成的一个重要影响是对应的驱动不同。对于 Windows 10 而言，虽然其对上述标准都有支持，但在安装过程中，Windows 10 安装程序会自动检测硬盘控制模式并 **只** 安装对应的驱动。这就造成了一个后果——如果用户已安装了 Windows 10，但某一次切换了硬盘控制模式，这时就会造成无法引导 Windows 的情况，并提示：`INACCESSIBLE_BOOT_DEVICE`。

这种情况下，可以考虑通过以下方式解决：

1. 切换回原本的磁盘控制器模式
2. 进入系统，保证下一次能够进入安全模式
3. 进入安全模式前，切换到需要的新磁盘控制模式
4. 进入安全模式，等待驱动安装完成。

事实上，问题的关键就在于在新的磁盘控制模式下进入安全模式。

> 那么应该如何操作呢?  ——wm

如果是在迁移系统中遇到的问题

1. 检查 BIOS，一般是 DELL 的电脑才有 RAID On 模式。
   在 BIOS 的 Storage 里找到设置，有 `AHCI/NVMe` 和 `RAID On` 两种选项，默认是 `RAID On`；

2. 插回原来的系统盘（恢复原来能正常启动的状态），启动原来的系统；

3. 开机后 <kbd>Win</kbd> + <kbd>R</kbd>，在运行窗口里输入 `msconfig`，引导-安全引导，选 `最小`；

4. 重启，一般这时候重启就自动进了安全模式了；

5. 进 BIOS，在 Storage 里将模式切换到 `AHCI/NVMe`，然后再重启，重启不需要按什么东西；

6. 观察是否能继续进入安全模式，若能（一般都可以），再重启一次进入安全模式（可选，感觉保险）；

7. 进安全模式后，在 `msconfig` 里取消勾选安全引导，应用-保存后重启，看是否能正常进系统；

8. 若正常进系统，则模式切换完成，再按照正常迁移系统流程（拷盘 - 修复引导）即可。

如果是在重装系统过程中遇到此问题，重装完直接在 BIOS 里改成 NVMe 一般就能进系统，或者在 NVMe 模式下再重新装一次就能进了。

## `netwtw12.sys` 或类似 `netwtw xx.sys`

> 常见于使用 Intel 网卡的机器，一般是网卡驱动导致的，可能是 OEM 后台更新驱动，重启触发
> 最多的时候一晚上来了五六个都是蓝屏这个的 ——wm

其实处理这个问题也很简单，大致就是

1. 多蓝两次然后进安全模式
2. 在安全模式里禁用 Intel 网卡驱动
3. 重启就能正常进系统了，再在设备管理器卸载 Intel 网卡设备（同时删除驱动）
4. 扫描检测硬件改动，如果还出现再卸载一次（一般卸两次就扫不出来了），可以再清一下注册表（一般也不用）
5. 在 Intel 官网下载新版本网卡驱动，直接安装即可（可以用其他电脑下载好拷过来安装）

## `WHQL` 或 `LESS_OR_EQUAL` 或 `SECURITY`

> 2020-2022年期间，由于主流供应商大量使用低温焊锡，加上部分厂家广泛使用 “黑胶” 安装方式，大量设备出现 CPU 虚焊现象。

主要症状为：

- 无规律的死机；
- 屏幕冻结；
- 声音卡死，听感类似电噪音；
- 频繁蓝屏，且蓝屏代码多不相同；
    常见的蓝屏代码有：
    - `WHQL`
    - `LESS_OR_EQUAL`
    - `SECURITY`

一般处理方法为：

- 未过保的机器，直接建议送修；
- 过保的机器，建议前往良乡小学隔壁的[海兴电脑维修](https://j.map.baidu.com/d5/WiDi)，或 B 站 Up 主寄修。

## `BAD_SYSTEM_CONFIG_INFO`

这段由25诊所汪航飞编写。

[参考文章](https://www.bilibili.com/opus/993295974168264712)

主要症状为：

- 进入系统时黑屏无反应或者蓝屏，蓝屏代码显示 `Bad_system_config_info`
- 安全模式无法进入
- 进入pe，引导修复无效果，dism++无法正常读取系统分区，提示格式错误

这种情况一般是系统的关键注册表出了问题，解决方案就是检查哪个注册表有问题并进行修复。

处理方法：

先在恢复环境中，用命令行检查注册表。批量检测注册表损坏的命令：

```
for /f %i in ('dir /a:-d-h /b') do echo %i && reg Load HKLM\a %i & reg unLoad HKLM\a
```

bbi、userdiff、vsmidk这些损坏不用管，重要的注册表是：`COMPONENTS`、`default`、`SAM`、`SECURITY`、`SOFTWARE`、`SYSTEM`这些。

已知：

1. default、drivers文件损坏可以备份后用恢复环境注册表替换。
2. software损坏，可以用相同版本系统的software文件在PE里替换（成功率较高），替换后开机自动重建用户配置。
3. security损坏，用工具修复好的概率很大。
4. 提示数据错误（循环冗余检查）的，假设系统盘是c盘，则执行chkdsk /f c:，还是同样错误的话，把/f换成/r再执行一遍。

**一个参考解决方法**：
对于SOFRWARE等注册表的非重度损坏（从几十MB变成几百KB那种），找一个正常的注册表，需要来自同版本内核的系统（如Win10，21h2的找内核为NT10的任意版本），复制正常注册表的**前512左右字节**覆盖到损坏注册表，几乎可以完美修复!

大部分上述损坏情况的注册表都可以这么修。如用户注册表损坏（具体表现为重启后所有桌面文件丢失）在其他电脑上创建同名称（大小写也要相同）用户后覆盖好的用户注册表前512左右字节到坏的注册表有概率修复。

> 通过实践操作，发现 `SECURITY` 注册表也可以使用该方法完成修复
>
> 原理参考libregf项目给出的说明，注册表文件格式前512左右字节为注册表的状态检测/校验数据，同版本NT内核的定义是一致的，有很大可能成功交换。

参考python代码（这里写到fix.py里）：

```python
def repair_registry(corrupt_file, good_file, output_file, bytes_to_replace=512):
    try:
        # 读取好的注册表文件前 bytes_to_replace 字节
        with open(good_file, 'rb') as gf:
            good_data = gf.read(bytes_to_replace)
        
        # 读取损坏的注册表文件
        with open(corrupt_file, 'rb') as cf:
            corrupt_data = cf.read()

        # 替换损坏文件的前 bytes_to_replace 字节
        repaired_data = good_data + corrupt_data[bytes_to_replace:]

        # 将修复后的数据写入新文件
        with open(output_file, 'wb') as of:
            of.write(repaired_data)

        print(f"Successfully repaired {corrupt_file} and saved as {output_file}")
    
    except Exception as e:
        print(f"An error occurred: {e}")

# 使用示例
corrupt_file = 'SECURITY_bad'
good_file = 'SECURITY_good'
output_file = 'SECURITY'

repair_registry(corrupt_file, good_file, output_file)
```

将正常的注册表重命名为 `SECURITY_good` ，有问题的注册表重命名为 `SECURITY_bad`，把这个代码的py文件和两个注册表文件放在同一文件夹下，并在终端运行 `python fix.py` ，用输出的 `SECURITY` 文件替换损坏系统中的原文件，重启即可。
