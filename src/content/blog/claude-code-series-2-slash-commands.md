---
title: Claude Code 系列教程（二）：斜杠命令
description: "从内置命令到 Skills 与 MCP，快速掌握 Claude Code 的斜杠命令体系。"
publishDate: '2026-03-28T17:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

斜杠命令是在交互式会话中控制 Claude 行为的快捷方式，主要分为以下几类：

- 内置命令：由 Claude Code 提供（`/help`、`/clear`、`/model`）
- Skills：用户以 `SKILL.md` 文件定义的命令（`/optimize`、`/pr`）
- 插件命令：来自已安装插件的命令（`/frontend-design:frontend-design`）
- MCP 提示词命令：来自 MCP 服务器的命令（`/mcp__github__list_prs`）

## 1. 内置命令

常用的内置命令如下。

目前有超过 55 个内置命令和 5 个捆绑技能可供使用。以下是一些高频命令。

### 1.1 模型、性能与使用量

- `/cost`：显示 token 使用统计
- `/effort`：设置推理强度
- `/model`：选择模型（也可以用 cc-switch 切换）
- `/stats`：可视化每日使用量、会话数和连续使用天数

### 1.2 工作区与上下文维护

- `/context`：以彩色网格可视化上下文使用情况
- `/init`：初始化 `CLAUDE.md`
- `/memory`：编辑 `CLAUDE.md`
- `/btw <question>`：提出旁支问题且不写入历史记录
- `/export`：将当前对话导出到文件或剪贴板

### 1.3 计划、任务与代理能力

- `/plan`：计划模式
- `/skills`：列出可用 skills
- `/tasks`：列出或管理后台任务

### 1.4 界面、编辑器与交互设置

- `/theme`：更换主题
- `/color`：设置提示栏颜色
- `/clear`：清空当前对话
- `/exit`：退出（别名：`/quit`）
- `/config`：打开设置（别名：`/settings`）

### 1.5 完整命令说明

完整的内置命令列表以官方版本为准，部分历史命令可能已弃用。

## 2. Skills、MCP

- skills：Claude Code 系列教程（六）：Skills
- mcp：Claude Code 系列教程（八）：MCP

## 3. 参考链接

- [claude-howto / 01-slash-commands](https://github.com/luongnv89/claude-howto/tree/main/01-slash-commands)
