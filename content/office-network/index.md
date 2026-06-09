---
title: 北理桥办公室连接校园网
path: office-network
description: 2023年3月31日，网协办公室成功桥接校园网，望周知。
contentType: markdown
---

> 2024年9月（或10月），办公室已经可以直连校园网Wi-Fi，此页面提供的方法已经不再使用。
{.is-warning}

> 2023年3月31日，网协办公室成功桥接校园网，望周知。
{.is-success}


从北食堂第一格信号的萌芽开始，到隔壁未知的桥接名称，再到办公室第一次用上移动Wi-Fi，您已经经历了许多。现在，开始您最伟大的探索吧，从桥接校园网到万兆网络！

## 技术细节
  
- 由于桥接的是 BIT-Web，理论上来说您应该在连接到Wi-Fi之后打开 [10.0.0.55](http://10.0.0.55) 来确认网络连接情况。若您发现当前登录的不是您的账号，您应该修改登录信息。

- 由于AP工作于NAT模式，当前所有连接到此Wi-Fi的设备将会消耗当前校园网账号的流量。

  ```mermaid
  flowchart LR
  Web[BIT-Web] -.- NP["BITNP_Local(_5G)<br>斐讯K3C"] -.- 您可以连它
  NP -.- other[办公室的其他人]
  Web -.- 直接连接校园网的人
  %% NP --- TP["BITNP_Local_5G_tp<br>TL-WDR8690"] -.- 您也可以连它
  %% TP -.- other2[办公室的其他人]
  
  subgraph login[登录 10.0.0.55]
    NP
    直接连接校园网的人
  end
  ```

- 请有能力的用户尽量使用局域网代理路由到您的已联校园网的设备上。这可以保护您的隐私，并帮助他人节省流量。

- 斐讯路由器底部有指示灯

  | 指示灯 | 意义 | 该怎么做 |
  |:-:|:-:|:-:|
  | 蓝灯常亮 | 正常 | 冲浪 |
  | 蓝灯闪烁 | 桥接成功，但无互联网 | 尝试登录校园网账号 |
  | 黄灯 | 桥接失败 | BIT-Web 信号太差了，没辙 |

<details>
<summary>绝密☆启用前</summary>
<table>
  <thead>
    <tr>
      <th>AP</th>
      <th>后台</th>
      <th>密码</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>斐讯K3C</td>
      <td><a href='http://p.to'>p.to</a> (192.168.2.1)</td>
      <td>admin</td>
    </tr>
    <tr>
      <td>TL-WDR8690<br><small>现已撤走</small></td>
      <td><a href='http://tplogin.cn'>tplogin.cn</a> (192.168.2.238)</td>
      <td>12345678</td>
    </tr>
  </tbody>
</table>
</details>

