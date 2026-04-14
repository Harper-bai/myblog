---
title: Claude Code 系列教程（五）：CLI 基础
description: "掌握 claude 命令行，从脚本自动化到权限管理，一文通透。"
publishDate: '2026-03-29T17:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 1. 为什么需要 Claude Code CLI？

Claude Code CLI（命令行界面）是和 Claude Code 交互的主要方式，支持交互模式、非交互脚本模式、会话恢复、子命令管理等多种用法。它让你可以在终端里直接启动 Claude、处理管道输入、自动化任务、恢复旧会话等。

- **交互模式**：支持多轮实时聊天和手动操作
- **非交互模式**（加 `-p`）：单次 prompt 执行完立即退出

所有命令在终端直接输入 `claude --help` 即可查看最新帮助。

## 2. 核心启动命令（最常用）

| 命令 | 作用 | 示例 | 适用场景 |
| --- | --- | --- | --- |
| `claude` | 启动交互式会话（REPL） | `claude` | 日常编码、聊天 |
| `claude "query"` | 带初始提示启动交互式会话 | `claude "explain this project"` | 快速开始一个任务 |
| `claude -p "query"` | 非交互模式（打印结果后直接退出） | `claude -p "explain this function"` | 脚本、CI/CD、管道处理 |
| `cat file \| claude -p "query"` | 处理管道输入内容 | `cat logs.txt \| claude -p "explain"` | 分析日志、diff 等 |
| `claude -c`（或 `--continue`） | 继续当前目录下最近一次对话 | `claude -c` | 接着上次工作 |
| `claude -c -p "query"` | 非交互模式继续上一次对话 | `claude -c -p "Check for type errors"` | 自动化继续任务 |
| `claude -r "<session>" "query"` | 按会话 ID 或名称恢复对话 | `claude -r "auth-refactor" "Finish this PR"` | 恢复特定历史会话 |

## 3. 子命令（`claude <subcommand>`）

这些是独立的工具命令：

- `claude update` → 更新 Claude Code 到最新版本
- `claude auth login` → 登录 Anthropic 账户（支持 `--email`、`--sso`、`--console` 参数）
- `claude auth logout` → 登出
- `claude auth status` → 查看登录状态（加 `--text` 更友好）
- `claude agents` → 列出所有已配置的 subagents（子代理）
- `claude auto-mode defaults` → 导出内置 auto-mode 规则（JSON）
- `claude mcp` → 配置 Model Context Protocol（MCP）服务器
- `claude plugin`（或 `claude plugins`） → 管理插件（`install`、`list` 等）
- `claude remote-control` → 启动远程控制服务器（让 Claude.ai / App 远程操控本地 CLI）

## 4. 常用 Flags（标志）—— 附加在 claude 后面使用

这些标志可以和上面任意命令组合，功能非常强大：

| 标志 | 作用 | 常用示例 |
| --- | --- | --- |
| `--model <name>` | 指定模型（如 sonnet、opus） | `--model claude-sonnet-4-6` |
| `--add-dir <path>` | 添加额外工作目录 | `--add-dir ../libs` |
| `--init` | 先运行初始化 hooks 再进入会话 | `claude --init` |
| `--init-only` | 只运行初始化 hooks，不进入会话 | `claude --init-only` |
| `--bare` | 极简模式（禁用 hooks、插件、自动记忆等，脚本更快） | `claude --bare -p "query"` |
| `--debug` | 开启调试模式 | `--debug "api,mcp"` |
| `--continue` / `-c` | 继续最近会话 | （同上） |
| `--resume` / `-r` | 恢复指定会话 | `--resume auth-refactor` |
| `--fork-session` | 恢复时创建新会话分支 | `--resume abc123 --fork-session` |
| `--from-pr <num>` | 恢复与 GitHub PR 关联的会话 | `--from-pr 123` |
| `--append-system-prompt "text"` | 额外追加系统提示 | `--append-system-prompt "永远用 pnpm"` |
| `--append-system-prompt-file <file>` | 从文件追加系统提示 | `--append-system-prompt-file ./extra-rules.txt` |
| `--allowedTools` / `--disallowedTools` | 精确控制可用的工具（权限管理） | `--allowedTools "Bash(git *)" "Read"` |
| `--dangerously-skip-permissions` | 跳过所有权限确认（谨慎使用） | `--dangerously-skip-permissions` |
| `--permission-mode plan` | 进入计划模式（先规划再执行） | `--permission-mode plan` |
| `--effort <level>` | 设置工作量（low/medium/high/max） | `--effort high` |
| `--json-schema <schema>` | 强制输出符合 JSON Schema（仅 `-p` 模式） | `--json-schema '{"type":"object",...}'` |
| `--max-turns <n>` | 限制代理执行轮次（仅 `-p`） | `--max-turns 5` |
| `--max-budget-usd <n>` | 限制最大花费（美元，仅 `-p`） | `--max-budget-usd 2.00` |
| `--output-format json` | 输出格式（text/json/stream-json） | `--output-format json` |
| `--no-session-persistence` | 禁用会话持久化（仅 `-p`） | `--no-session-persistence` |

其他高级标志（按需使用）：`--ide`、`--chrome`、`--mcp-config`、`--plugin-dir`、`--disable-slash-commands`、`--include-partial-messages` 等。

## 5. 实用场景示例

### CI/CD 自动化

```bash
git diff | claude -p "review these changes for security issues" --allowedTools "Read"
```

### 快速修复

```bash
claude "fix the build error" --effort high
```

### 批量处理

```bash
find . -name "*.ts" | claude -p "add error handling to all these files"
```

### 安全脚本

```bash
claude --bare --allowedTools "Read,Edit" -p "refactor this module"
```

## 6. 常用标志速查

**最常用的权限控制标志**：

- `--dangerously-skip-permissions`：跳过所有权限确认（谨慎使用）
- `--allowedTools`：精确指定允许的工具
- `--permission-mode plan`：计划模式（先规划再执行）

## 7. 参考链接

- [中文：Claude Code CLI 参考](https://code.claude.com/docs/zh-CN/cli-reference)
- [英文：Claude Code CLI Reference](https://code.claude.com/docs/en/cli-reference)
