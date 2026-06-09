---
title: 服务器运维
path: clinic/server
description: ""
contentType: markdown
---

# 网协主服务器
内网 IP `10.1.139.200`，SSH 端口 `8022`

## 应用
服务均运行在 `podman` 容器中，可通过 `podman ps` 查看。

### 配置文件
各容器的 `docker-compose.yml` 及挂载目录均位于 `/root/` 文件夹。

### 路由结构
由 `traefik` 容器监控 `443` 端口并路由至各服务容器。

## 证书管理
证书由 `acme.sh` 管理，会在到期前一个月自动更新并安装至 `/root/traefik/certs/` 目录，同时 `touch /root/traefik/config/certs.toml` 以触发 `traefik` 热重载。


# 诊所 Lib
`cf.bitnp.net`，内网 IP `10.1.139.180`，SSH 端口 `8022`，带宽 `1Gbps` (`IPv4 Only`)。
