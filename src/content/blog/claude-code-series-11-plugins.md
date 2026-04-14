---
title: Claude Code 系列教程（十一）：Plugins 插件系统
description: "掌握 Claude Code 官方扩展机制，打包 Skills、Subagents、Hooks、MCP 成可分发插件。"
publishDate: '2026-03-31T12:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 1. 什么是 Claude Code 插件？

Claude Code 的插件（Plugins）是官方提供的**扩展机制**，让你能把自定义功能（Skills、Subagents、Hooks、MCP Servers、LSP Servers 等）**打包成一个自包含、可安装、可共享的目录**，轻松在个人、项目或团队中复用。

**简单来说**：插件就是一个包含斜杠命令、Skill、MCP、Subagent、Hooks 的工具包。

## 2. 插件有什么用？

### 核心价值

- **打包 & 复用**：把多个 Skill、Subagent、Hooks、MCP 服务器一次性打包，分发给团队或多个项目
- **命名空间隔离**：插件里的 Skill 会自动加上前缀（如 `/my-plugin:review`），避免和其他插件冲突
- **集中管理**：通过插件市场一键安装、更新、启用/禁用
- **团队协作**：项目级插件可提交到 Git，大家统一使用；企业级可通过托管配置强制安装
- **安全性与版本控制**：支持语义化版本、自动更新、持久数据目录

### 扩展能力

| 能力 | 说明 | 示例 |
| --- | --- | --- |
| LSP（代码智能） | 实时类型检查、跳转定义、引用查找 | Python、TypeScript、Rust 等 |
| 外部集成 | MCP 服务器 | GitHub、Jira、Notion、Figma、Sentry |
| 工作流自动化 | Hooks 和自动化脚本 | Git 提交命令、PR 审查工具、自动 Lint |
| 自定义输出 | 教育模式、交互式学习模式 | 可视化调试、教学辅助 |

**一句话总结**：插件让 Claude Code 从"个人工具"变成"可分发的生产力套件"，特别适合团队或重复性强的项目。

## 3. 插件的发现与安装

### 方式一：图形管理器（推荐）

在 Claude Code 会话中：

```bash
/plugin
# 或
/plugins
```

然后：

1. 切换到 **发现** 选项卡 → 浏览官方市场（`claude-plugins-official` 默认已加载）
2. 选中插件 → 按 Enter → 选择安装范围（用户/项目/本地）

### 方式二：CLI 安装

```bash
# 基础安装
claude plugin install commit-commands@claude-plugins-official

# 指定范围（推荐项目级共享）
claude plugin install typescript-lsp@claude-plugins-official --scope project

# 用户级安装（所有项目可用）
claude plugin install github-integrations@claude-plugins-official --scope user
```

## 4. 插件管理命令

| 命令 | 作用 |
| --- | --- |
| `/plugin` | 打开图形管理器（发现、已安装、市场、错误） |
| `claude plugin list` | 列出已安装插件 |
| `claude plugin enable <name>` | 启用 |
| `claude plugin disable <name>` | 禁用 |
| `claude plugin update <name>` | 更新 |
| `claude plugin uninstall <name>` | 卸载 |
| `/reload-plugins` | 安装后立即重载（无需重启） |

### 市场管理

```bash
# 添加第三方市场
/plugin marketplace add anthropics/claude-code

# 更新市场
/plugin marketplace update <name>
```

**注意**：安装后，插件里的 Skill 会自动出现在 `/help` 里，MCP 服务器也会自动注册。

## 5. 创建自己的插件

### 第一步：创建目录结构

```bash
mkdir my-awesome-plugin
cd my-awesome-plugin
```

### 第二步：创建清单文件

在 `.claude-plugin/plugin.json` 中：

```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "description": "我的代码审查插件包",
  "author": {
    "name": "你的名字",
    "email": "your@email.com"
  },
  "license": "MIT",
  "keywords": ["code-review", "quality"]
}
```

### 第三步：添加组件

在插件根目录添加以下目录和文件：

#### Skills（可选）

```text
skills/
  └── review/
      └── SKILL.md
```

```markdown
---
name: code-review:check
description: 快速代码质量检查
---

你是一个代码审查员...
```

#### Subagents（可选）

```text
agents/
  └── security-reviewer.md
```

```markdown
---
name: security-reviewer
description: 安全审查专家
tools: Read, Grep
---

你是安全专家...
```

#### Hooks（可选）

```text
hooks.json
```

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

#### MCP（可选）

```text
.mcp.json
```

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

### 完整目录结构

```text
my-awesome-plugin/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── review/
│       └── SKILL.md
├── agents/
│   └── security-reviewer.md
├── hooks.json
├── .mcp.json
├── README.md
└── LICENSE
```

### 第四步：本地测试

```bash
claude --plugin-dir ./my-awesome-plugin
```

会话中输入 `/review` 应该能调用插件的 Skill。

### 第五步：分发（可选）

1. 推到 GitHub → 创建 `marketplace.json`
2. 在 `marketplace.json` 中描述元数据
3. 通过官方提交表单发布到 Anthropic 市场

## 6. 插件的命名空间

安装后，插件里的 Skill 会自动加上前缀，避免冲突。

**示例**：

| 插件名 | 原 Skill | 调用方式 |
| --- | --- | --- |
| `code-review` | `check` | `/code-review:check` |
| `github-tools` | `create-pr` | `/github-tools:create-pr` |
| `data-analyzer` | `export` | `/data-analyzer:export` |

## 7. 插件 vs 其他功能对比

| 功能 | 作用 | 是否打包 | 是否可市场分发 | 适用场景 |
| --- | --- | --- | --- | --- |
| **插件** | 打包多个组件 | 是 | 是 | 团队共享、重复使用、分发 |
| **Skill** | 单个任务工作流 | 否 | 否 | 简单重复提示、个人使用 |
| **MCP** | 外部工具连接 | 否 | 否 | 数据库、Jira、Notion 集成 |
| **Subagent** | 独立上下文子代理 | 可打包 | 可打包 | 隔离任务、并行处理 |
| **Hooks** | 自动化脚本 | 可打包 | 可打包 | 工作流自动化、拦截 |

## 8. 官方插件示例

### Commit Commands

- **功能**：快速生成规范化 commit 消息
- **包含**：Skill `/commit:generate`、Subagent、Hooks

### TypeScript LSP

- **功能**：TypeScript 类型检查和智能补全
- **包含**：LSP 服务器配置

### GitHub Integrations

- **功能**：直接操作 GitHub Issues 和 PRs
- **包含**：MCP 服务器、Skill、Subagent

### Python Analysis Suite

- **功能**：Python 代码分析和优化
- **包含**：LSP、Subagent、自定义 Hooks

## 9. 最佳实践

### 🎯 选择来源

- **优先**：官方市场（`claude-plugins-official`）— 最安全、更新及时
- **其次**：可信第三方市场
- **谨慎**：不明来源 — 插件可执行代码和访问文件

### 🎯 安装范围

| 范围 | 存储位置 | 适用场景 |
| --- | --- | --- |
| `--scope user` | `~/.claude/plugins/` | 个人所有项目 |
| `--scope project` | `.claude/plugins/` | 当前项目团队（可提交 Git） |
| `--scope local` | 临时 | 一次性测试 |

**建议**：项目级安装放在 `.gitignore` 里的 `.claude/` 目录，或者提交 `plugin-manifest.json`。

### 🎯 创建插件时

- **职责清晰**：一个插件做一类事情（如所有 PR 工具、所有数据分析工具）
- **命名一致**：Skill 名称加前缀（如 `plugin-name:action`）
- **文档完善**：每个 Skill/Subagent 都有明确的 description
- **版本管理**：遵循语义化版本（1.0.0、1.1.0、2.0.0）

### 🎯 特殊情况

#### LSP 插件

安装后需本地有对应语言服务器二进制：

```bash
# Python：需要 pyright
pip install pyright

# TypeScript：需要 typescript server
npm install -g typescript

# Rust：需要 rust-analyzer
rustup component add rust-analyzer
```

#### 重载插件

改动后一定要重载：

```bash
/reload-plugins
```

#### 调试

用 `--debug` 查看加载日志：

```bash
claude --debug
```

查看 `.claude/logs/` 目录下的日志文件。

## 10. 常见问题

### Q: 插件和 Skill 区别是什么？

**A**：

- **Skill**：单个 Markdown 文件，简单提示词
- **插件**：完整目录，可包含多个 Skill、Subagent、Hooks、MCP、LSP

### Q: 插件可以跨项目使用吗？

**A**：可以。用户级安装（`--scope user`）在所有项目里可用；项目级（`--scope project`）只在当前项目。

### Q: 如何私有分发插件？

**A**：

1. 推到私有 GitHub 仓库
2. 创建 `marketplace.json`
3. 用 `/plugin marketplace add your-private-url` 添加
4. 团队成员可以从私有市场安装

### Q: 插件会影响性能吗？

**A**：不会明显影响。已禁用的插件不加载；即使启用也只在调用时加载组件。

## 11. 插件开发资源

### 官方限制

- 单个 Skill 文件大小：< 100KB
- 插件总大小：< 50MB
- 最多 10 个 Subagent
- MCP 服务器：最多同时加载 5 个

### 参考链接

- [官方发现和安装（中文）](https://code.claude.com/docs/zh-CN/discover-plugins)
- [官方创建插件（中文）](https://code.claude.com/docs/zh-CN/plugins)
- [官方插件参考（中文）](https://code.claude.com/docs/zh-CN/plugins-reference)
- [Awesome Claude Plugins](https://github.com/awesome-claude-plugins)

## 12. 快速入门检查清单

- [ ] 浏览官方插件市场（`/plugin`）
- [ ] 安装一个官方插件测试体验
- [ ] 学会基本命令（`list`、`enable`、`disable`）
- [ ] （可选）尝试创建简单插件
- [ ] （可选）发布到团队或个人市场
