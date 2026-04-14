---
title: Claude Code 系列教程：导言
description: "从工具到方法，理解为什么 Agent 正在成为新的基础能力。"
publishDate: '2026-03-28T09:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 为什么我们需要学会用 Agent？

过去几年，AI 的发展速度超出了很多人的预期。它不再只是一个能回答问题的对话框，而是开始真正介入我们的工作流程：帮我们搜集资料、整理信息、处理文件，完成那些原本要耗费大量时间的重复性任务。

这一类能够主动完成复杂任务的 AI，我们通常称它为 **Agent**。

现在市面上的 Agent 工具已经有很多选择：Claude Code、Codex、OpenCode、Amp、Trae......各有侧重，各有适合的使用场景。这篇教程聚焦的，是其中对新手友好、能力也相当全面的一个：**Claude Code**。

如果你是文科或社科背景，从来没有接触过编程，这篇教程依然适合你。因为学习使用 Agent，并不等于学习写代码。它更像是学会如何清晰地表达需求，然后让 AI 替你把事情做完。

**这项能力，正在变得越来越重要。**

## 为什么是 Claude Code，而不是 OpenClaw（小龙虾）？

1. 设置简单，易用性强。Claude Code 安装通常只需约 30 秒，无需 Docker 或复杂配置；OpenClaw setup 往往需要 30-60 分钟，还涉及本地环境、sandbox 等技术门槛。
2. 功能已基本覆盖 95% OpenClaw 使用场景，且官方迭代更快。
3. 安全性更高，更适合生产环境。Claude Code 内置企业级 guardrails（SOC2 合规）与 sandbox 保护；OpenClaw 默认防护较少，用户需自行承担更多安全责任。
4. 成本更可预测，整体更省心省力。Claude Code 可订阅使用；若接入国产模型，成本通常更低。OpenClaw 虽然软件免费，但实际使用中常有 token 和维护成本。

当所有人都在追同一个热度的时候，要保持谨慎。

## 这个教程是怎么来的？

目录结构参考了开源项目 [claude-howto](https://github.com/luongnv89/claude-howto)。

具体内容则来自 **官方文档 + 个人实践经验** 的总结。

## 快速了解 Claude Code

- 记忆系统（CLAUDE.md + Auto Memory）实现跨会话知识持久化。
- 检查点（Checkpoint / `/rewind`）支持随时回滚代码与对话。
- 斜杠命令可快速操作 CLI。
- Skill 可封装复用工作流。
- Hooks 可实现事件自动化。
- MCP 可连接外部工具。
- 插件机制可扩展能力。
- Subagents 可执行独立子任务。
- Agents Team 可组建多代理协作团队。

## 教程导航

- [系列（零）：导言](/blog/claude-code-series-0-intro-agent/)
- [系列（一）：如何下载配置](/blog/claude-code-series-1-download-setup/)
- [系列（二）：斜杠命令](/blog/claude-code-series-2-slash-commands/)
- [系列（三）：记忆](/blog/claude-code-series-3-memory/)
- [系列（四）：检查点与回溯](/blog/claude-code-series-4-checkpoint/)
- [系列（五）：CLI 基础](/blog/claude-code-series-5-cli/)
- [系列（六）：Skills 系统](/blog/claude-code-series-6-skills/)
- [系列（七）：Hooks 自动化工作流](/blog/claude-code-series-7-hooks/)
- [系列（八）：MCP 外部集成协议](/blog/claude-code-series-8-mcp/)
- [系列（九）：Tools 工具系统](/blog/claude-code-series-9-tools/)
- [系列（十）：Subagent 与 Agent Team 多代理协作](/blog/claude-code-series-10-agents/)
- [系列（十一）：Plugins 插件系统](/blog/claude-code-series-11-plugins/)
- [系列（十二）：CLI 进阶与工程化](/blog/claude-code-series-12-cli-advanced/)
- [系列（十三）：高级功能与企业级特性](/blog/claude-code-series-13-advanced-features/)
