---
title: Claude Code 系列教程（一）：如何下载配置
description: "从安装到接入 API，完整走通 Claude Code 的下载与配置流程。"
publishDate: '2026-03-28T13:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 1. 下载 Claude Code

官方的渠道有以下几种：

- Terminal
- VS Code
- 桌面应用程序
- 网站

官网链接：[Claude Code 概述 - Claude Code Docs](https://code.claude.com/docs/zh-CN/overview)

桌面应用程序和网站中使用 Claude Code 需要付费订阅，对于国内用户来说比较麻烦。VS Code 指的是将 Claude Code 集成在编辑器中，除了 VS Code，它还支持 Cursor。

为了可以使用第三方 API 以及更广的应用场景，这里选择在 Terminal 中下载 Claude Code。

首先打开终端：

- macOS 用户：终端
- Windows 用户：PowerShell 或 CMD

### macOS

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows

1. 安装 [Git for Windows](https://git-scm.com/downloads/win)。
2. 如果下载速度慢，可换镜像源：
   [清华大学开源镜像站](https://mirrors.tuna.tsinghua.edu.cn)
   [中国科学技术大学开源镜像站](https://mirrors.ustc.edu.cn/)
3. 安装 Node.js：
   [Node.js 下载页](https://nodejs.org/en/download)
4. 以管理员身份打开终端（PowerShell 或 CMD）安装 Claude Code。

```bash
# 设置国内 npm 镜像（加速下载）
npm config set registry https://registry.npmmirror.com

# 安装 Claude Code
npm install -g @anthropic-ai/claude-code
```

下载成功后，在终端输入：

```bash
claude --version
```

出现类似 `2.1.90` 的版本号就说明安装成功。

## 2. 配置 Claude Code

### 第一步：下载工具 cc-switch

点击下面链接，划到最底下选择合适的安装包下载：

[cc-switch Releases v3.12.3](https://github.com/farion1231/cc-switch/releases/tag/v3.12.3)

### 第二步：获取大模型 API

官方 API 价格较高且不易获得。对于大部分日常任务，国产大模型已经够用。

如果只是尝鲜、轻量使用，可以先用 [硅基流动](https://cloud.siliconflow.cn/i/6kIfYFvB)。实名后送 16 元代金券，缺点是速度相对慢。

如果使用量较大且对速度有要求，可以订阅国产大模型的 coding plan：

- [Kimi](https://www.kimi.com/code?from=kimi_homepage_sidebar&track_id=da7ffd92-20fe-43f9-9334-4f06d0dbd762)
- [智谱-GLM](https://www.bigmodel.cn/glm-coding?ic=HDZTMZ7FVB)
- [MiniMax](https://www.minimaxi.com/)

如果想用 Claude Opus 4.6，可以选择中转站。

下面是常用的中转站（注意：不要一次性充值太多，防止跑路）：

- [AIGoCode](https://aigocode.com/invite/NGS488W3)（按量使用较实惠）
- [AICodeMirror](https://www.aicodemirror.com/register?invitecode=R4MCPX)（包月价格较实惠，也较稳定）

使用代金券或定量 API 时，一定注意不要超额；coding plan 通常没有额度限制。

### 第三步：配置 Claude Code

以硅基流动为例：

1. 打开官网，新建 API 密钥并复制。（注意：API 密钥非常重要，不要泄漏）
2. 打开 cc-switch，点击右上角 `+`。
3. 预设供应商选择 `SiliconFlow`，在 `API Key` 处填入刚才复制的 API 密钥。
4. 模型处在 [硅基流动模型广场](https://cloud.siliconflow.cn/me/models) 挑选并复制模型名（务必填写准确），例如：
   - `Pro/MiniMaxAI/MiniMax-M2.5`
   - `Pro/zai-org/GLM-5`
   - `Pro/moonshotai/Kimi-K2.5`
5. 添加并启用。

### 第四步：打开终端验证

在终端输入 `claude`，看到 Claude Code 的交互界面就说明配置成功了。
