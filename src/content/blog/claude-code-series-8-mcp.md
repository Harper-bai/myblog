---
title: Claude Code 系列教程（八）：MCP 外部集成协议
description: "给 Claude 装上 USB-C 接口，连接 Notion、Sentry、GitHub、数据库等外部系统，成为全栈自动化助手。"
publishDate: '2026-03-30T15:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 1. 什么是 MCP？

MCP（Model Context Protocol）是 Anthropic 推出的开源标准协议，相当于给 Claude Code 装上"USB-C 接口"，让它能**安全、动态地连接外部工具、数据库、API、监控系统、设计工具等**，从而突破"只能改本地代码"的限制，成为真正的全栈自动化助手。

### 核心概念

- **MCP 服务器（MCP Server）**：负责向 Claude Code 暴露工具（Tools）、资源（Resources）和提示（Prompts）
- **支持三种传输方式**：HTTP（推荐，远程云服务）、Stdio（本地进程）、SSE（已弃用）
- **动态特性**：服务器可实时推送工具更新（list_changed）、资源引用（@server:resource）和频道消息（Channel）
- **安全设计**：OAuth 2.0、Header 认证、权限控制，全程本地存储 token

**一句话总结**：MCP 让 Claude 能直接操作你公司的 Jira、Notion、数据库、Sentry、Figma、GitHub 等外部系统。

## 2. MCP 有什么用？

- **开发工作流**：从 Jira 拉取票据 → 自动实现功能 → 在 GitHub 创建 PR
- **数据查询**：直接问 PostgreSQL "本月 Top 10 用户邮箱是哪些？"
- **监控分析**：让 Claude 查 Sentry 最近 24 小时错误并给出修复方案
- **设计同步**：根据 Slack 里的 Figma 设计自动更新邮件模板
- **自动化**：批量创建 Gmail 草稿、响应 Telegram/Discord/Webhook 事件
- **实时反应**：通过 Channel 功能被动监听外部事件（CI 失败、监控告警）并自动处理

**优势**：数百个官方/社区 MCP 服务器可用，支持插件自动安装，团队可统一配置。

## 3. MCP 与其他功能区别

| 功能 | 作用范围 | 是否需要 MCP | 动态性 | 认证需求 | 示例用途 |
| --- | --- | --- | --- | --- | --- |
| MCP | 外部工具/数据源 | 是 | 支持 | OAuth/Header | 查询数据库、操作 Jira |
| Skill | 本地任务工作流 | 否 | 否 | 无 | 代码审查 SOP、生成 PRD |
| CLAUDE.md | 项目全局规则/偏好 | 否 | 否 | 无 | 代码风格、构建命令 |
| 原生工具 | 本地文件系统 & Shell | 否 | 否 | 系统权限 | 直接读写项目文件 |

**关键点**：本地文件读写永远优先用原生工具，不需要通过 MCP。除非你特意加了一个本地 filesystem MCP 服务器。

## 4. 如何使用 MCP

### 步骤 1：添加 MCP 服务器（CLI 命令）

#### HTTP 远程服务器（推荐）

```bash
claude mcp add --transport http <名称> <URL>
```

示例（官方常用）：

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

#### 完整参数说明

- `--scope project`：团队共享，存 `.mcp.json`
- `--scope user`：全局个人
- `--scope local`：默认（当前项目本地）
- `--header "Authorization: Bearer xxx"`：非 OAuth 认证时使用
- `--env KEY=value`：环境变量
- `--` 分隔本地命令（Stdio 模式）

#### Stdio 本地示例（数据库等）

```bash
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub --dsn "postgresql://..."
```

### 步骤 2：认证（OAuth 流程）

大部分云服务（如 Notion、Sentry、Figma）需要 OAuth：

1. 在 Claude Code 会话里输入 `/mcp`
2. 看到服务器列表
3. 选择需要认证的服务器 → 浏览器自动打开登录页
4. 授权完成后，token 自动保存并刷新
5. 不需要每次登录，只在首次或 token 过期时触发
6. 若浏览器没打开，可复制回调 URL 手动打开

### 步骤 3：直接使用

- 随便和 Claude 聊天："用 Notion 里的产品需求更新 README"
- Claude 会自动调用对应 MCP 工具，并弹出权限确认（可预先用 `--allowedTools` 控制）

## 5. 管理命令一览

| 命令 | 作用 |
| --- | --- |
| `claude mcp list` | 列出所有服务器 |
| `claude mcp get <name>` | 查看详情 |
| `claude mcp remove <name>` | 删除 |
| `/mcp`（会话内） | 状态查看 + OAuth 认证 + 清除认证 |
| `claude mcp reset-project-choices` | 重置项目范围选择 |

## 6. 常用服务器 & URL 来源

这些 URL 全部来自服务商官方（不是随便写的）：

- **Notion** → `https://mcp.notion.com/mcp`
- **Sentry** → `https://mcp.sentry.dev/mcp`
- **Figma** → `https://mcp.figma.com/mcp`
- **GitHub** → `https://api.githubcopilot.com/mcp/`

**完整列表**：[modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)（上千个官方+社区服务器）

## 7. 高级功能

### Channel（频道）

让 Claude 实时接收外部推送（如监控告警）。

### 资源引用

在提示里输入 `@notion:page/xxx` 或 `@github:issue/123` 直接引用外部内容。

### 企业级管控

管理员可部署 `managed-mcp.json` 统一允许/禁止服务器。

## 8. Token 消耗与上下文占用

### 为什么 MCP 会消耗 Token？

- 每个 MCP 服务器都会把工具描述（tool definitions）注入到 Claude 的上下文里
- 工具描述包括工具名称、参数说明、返回值格式等，这些文本本身就需要 token
- 如果只加 1–2 个简单 MCP（比如 Notion 或 GitHub），消耗通常很小（几百到几千 token）
- 如果加了很多 MCP（5 个以上，尤其是带大量工具的服务器如 Playwright、数据库等），工具描述总和很容易占到上下文的 20%–40% 甚至更高

### Claude Code 的智能控制机制

官方专门引入了 **MCP 工具搜索（Tool Search）机制**，来解决这个问题：

| 情况 | 上下文消耗情况 | 机制说明 |
| --- | --- | --- |
| 默认（推荐） | 很低（只加载工具名称） | 当工具描述总和超过上下文 10% 时，自动开启"工具搜索"。Claude 只记住工具名字，需要时才按需加载完整定义（懒加载 / on-demand） |
| 手动关闭（不推荐） | 很高（所有工具描述全部预加载） | `ENABLE_TOOL_SEARCH=false` 时，所有工具一次性全部注入，token 消耗暴增 |
| 输出阶段 | 可控 | MCP 工具返回结果默认上限 25,000 token，超过 10,000 token 会警告。可通过环境变量 `MAX_MCP_OUTPUT_TOKENS` 调整 |

#### 配置方式（推荐一直保持默认）

```bash
# 强制始终开启工具搜索
export ENABLE_TOOL_SEARCH=true

# 或设置更严格阈值（工具描述超 5% 就开启搜索）
export ENABLE_TOOL_SEARCH=auto:5
```

## 9. 实用示例

### 示例 1：Notion 集成 - 从 Notion 拉取任务

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

之后在会话里：

```text
Claude，用 Notion 里的"Q1 任务"数据库拉取所有 Todo 项，根据优先级排序后生成一份 JSON 文件到 /tasks-export.json
```

Claude 会自动：

1. 调用 Notion MCP
2. 查询任务数据库
3. 生成排序后的 JSON

### 示例 2：GitHub 集成 + 自动 PR

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

会话内：

```text
检查 #123 GitHub Issue 的详情，然后自动创建一个分支 fix/123 并写一个初步的实现。
```

Claude 会自动拉取 Issue 内容、创建分支、生成代码。

### 示例 3：数据库查询（Stdio 模式）

```bash
claude mcp add --transport stdio postgres -- psql "postgresql://user:pass@localhost/mydb"
```

之后直接问：

```sql
SELECT COUNT(*)，AVG(order_value) FROM orders WHERE created_at > NOW() - INTERVAL '30 days'
```

Claude 会执行 SQL 并给你结果。

### 示例 4：Sentry 监控 + 自动修复

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

让 Claude 检查最近 24 小时的错误并生成修复方案：

```text
查看 Sentry 最近 24 小时的 JavaScript 错误，按频率排序，给出修复建议。
```

### 示例 5：团队共享配置（Git 协作）

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp --scope project
```

这样 `.mcp.json` 会被提交到 Git，整个团队都能用：

```json
{
  "mcpServers": {
    "notion": {
      "transport": "http",
      "url": "https://mcp.notion.com/mcp"
    }
  }
}
```

## 10. 最佳实践 & 故障排除

### 最佳实践

- **少即是多**：只添加你真正常用的 MCP（建议不超过 3–4 个）。需要省 token 时，可以考虑社区开发的"轻量 MCP"或直接用 CLI 工具代替部分 MCP
- **先用 HTTP 远程**，最简单安全
- **团队协作**：用 `--scope project` 把 `.mcp.json` 提交到 Git
- **权限控制**：用 `--allowedTools` 或企业托管策略
- **定期审计**：用 `claude mcp list` 检查已添加的服务器，删除不用的

### 常见问题

| 问题 | 解决方案 |
| --- | --- |
| 认证失败 | 用 `/mcp` 清除后重新登录 |
| 服务器没响应 | `claude mcp get <name>` 检查状态 |
| Windows Stdio 问题 | 加 `cmd /c` 包裹命令 |
| Token 消耗太高 | 确认 `ENABLE_TOOL_SEARCH` 已启用，或删除不用的 MCP |

### 安全提醒

只添加可信来源的服务器，避免提示注入风险。不要随意添加来路不明的 MCP。

## 11. 参考链接

- [官方文档（中文）](https://code.claude.com/docs/zh-CN/mcp)
- [官方文档（英文）](https://code.claude.com/docs/en/mcp)
- [MCP 官方服务器列表](https://github.com/modelcontextprotocol/servers)
