---
title: Claude Code 系列教程（十三）：高级功能与企业级特性
description: "掌握 16 个高级功能：权限模式、规划模式、扩展思考、自动化、后台任务、沙盒等。"
publishDate: '2026-03-31T18:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 1. 权限模式（Permission Modes）

### 权限模式定义

Claude Code 的核心**安全控制开关**，用于决定每次工具调用（编辑文件、运行命令等）时是否需要用户确认。

### 权限模式对标场景

在安全与效率之间找到平衡，避免误操作，同时支持自动化场景。

### 权限模式使用方式

**在会话内切换**：

```bash
Shift + Tab
```

会弹出权限模式选择菜单。

**CLI 启动时指定**：

```bash
claude --permission-mode <模式>
```

### 权限模式可用的模式

| 模式 | 说明 | 使用场景 |
| --- | --- | --- |
| `default` | 每次工具调用都询问（最安全） | 日常开发、学习阶段 |
| `acceptEdits` | 自动接受文件编辑，但命令仍需确认 | 信任 Claude 编辑，谨慎执行命令 |
| `plan` | 只读规划模式，不修改代码 | 代码审查、架构设计、影响分析 |
| `auto` | 后台自动审批低风险操作 | Team/Enterprise 计划专属 |
| `dontAsk` | 只允许预配置的 allow 规则，其他拒绝 | 高度受限场景（CI/CD 系统） |

### 权限模式最佳实践

**工作流建议**：

```text
复杂任务：plan 模式 → 审查计划 → 批准 → acceptEdits 模式 → 自动执行
```

## 2. 规划模式（Plan Mode）

### 规划模式定义

**只读需求分析阶段**，然后生成详细执行计划，而不实际修改代码。

### 规划模式对标场景

防止 Claude "一上来就乱改"，让你先审查计划再执行，大幅降低试错成本。

### 规划模式使用方式

**在会话中切换**：

```bash
Shift + Tab → 选择 "plan"
```

**启动时指定**：

```bash
claude --permission-mode plan
```

**非交互模式**：

```bash
claude --permission-mode plan -p "分析这个模块的重构方案"
```

### 规划模式查看与编辑计划

生成计划后：

- **查看完整计划**：Ctrl + O
- **编辑计划**：Ctrl + G（在编辑器中修改）
- **批准执行**：Enter

### 规划模式最佳实践

**适用场景**：

- 大型重构项目
- 代码审查与优化
- 架构设计决策
- 多模块涉及的功能开发

**工作流**：

```text
1. Plan Mode：生成详细计划
2. 人工审查：检查步骤、预测风险
3. 编辑调整：修改不合理的部分
4. 批准执行：切换到 acceptEdits 或 auto 执行
```

## 3. 扩展思考（Extended Thinking / Thinking Mode）

### 扩展思考定义

Claude 在**回答前进行更深入的逐步推理**（类似 Chain-of-Thought 的增强版）。

### 扩展思考对标场景

显著提升复杂任务的质量，尤其适合架构决策、疑难 Bug 定位、多方案权衡。

### 扩展思考使用方式

**快捷键激发**：

- **macOS**：Option + T
- **Windows/Linux**：Alt + T

**配置文件启用**：

在 `/config` 或 `~/.claude/settings.json` 中：

```json
{
  "alwaysThinkingEnabled": true
}
```

**Prompt 中强制激活**：

```bash
claude /effort high "这是一个复杂的架构问题..."

# 或在 prompt 中加关键词
claude -p "用深度思考分析这个性能瓶颈"
```

### 扩展思考查看思考过程

生成后，按 **Ctrl + O** 查看完整的思考链路（发生了什么、为什么这样做、权衡等）。

### 扩展思考何时使用

| 场景 | 推荐 |
| --- | --- |
| 简单查询（"这个函数做什么？"） | ❌ 不需要 |
| 架构设计决策 | ✅ 强烈推荐 |
| 复杂 Bug 定位 | ✅ 强烈推荐 |
| 性能优化方案对比 | ✅ 强烈推荐 |
| 代码重构影响评估 | ✅ 强烈推荐 |
| 快速编码任务 | ❌ 不需要，浪费时间 |

### 扩展思考最佳实践

**超级组合**：Plan Mode + Extended Thinking

```bash
claude --permission-mode plan << EOF /effort high
重构 auth 模块，需要考虑：
1. 向后兼容性
2. 性能影响
3. 安全风险

详细分析并给出分步计划。
EOF
```

## 4. 自动模式（Auto Mode）

### 自动模式定义

使用**独立的安全分类器**（基于 Sonnet 4.6）在后台自动审批低风险操作。

### 自动模式对标场景

大幅减少权限弹窗，实现真正的"无人值守"长任务执行。

### 自动模式可用性

**仅限 Team/Enterprise/GitHub Copilot 计划**。

### 自动模式配置方式

在 `~/.claude/settings.json` 中自定义规则：

```json
{
  "autoMode": {
    "rules": [
      {
        "tools": ["Read", "Grep", "Glob"],
        "decision": "allow"
      },
      {
        "tools": ["Bash"],
        "patterns": ["git", "npm", "pnpm"],
        "decision": "allow"
      },
      {
        "tools": ["Edit"],
        "filesPattern": "test/**/*.ts",
        "decision": "allow"
      },
      {
        "tools": ["Bash"],
        "patterns": ["rm", "git push"],
        "decision": "soft_deny"
      }
    ]
  }
}
```

### 自动模式 CLI 启动

```bash
claude --permission-mode auto
```

### 自动模式最佳实践

1. **验证后再启用**：先用 Plan Mode 验证任务安全，再开启 Auto Mode
2. **保守规则**：从最小权限开始，逐步扩大
3. **监控告警**：定期检查日志 `~/.claude/logs/`，看是否有异常操作

## 5. 后台任务（Background Tasks）

### 后台任务定义

支持**异步、长时间运行的任务**，不会阻塞当前会话。

### 后台任务对标场景

实现真正的并行工作，例如批量代码审查、定时监控、循环调试等。

### 后台任务创建循环任务

```bash
/loop create "代码审查" --interval daily --start "08:00"
```

**参数**：

- `--interval`：循环周期（daily、hourly、weekly）
- `--start`：执行时间
- `--max-runs`：最多运行次数

### 后台任务 Subagent

在 Subagent 配置中：

```yaml
---
name: background-reviewer
background: true
---

你在后台持续运行...
```

### 后台任务查看与管理

```bash
/tasks list           # 列出所有后台任务
/tasks pause <id>     # 暂停
/tasks resume <id>    # 恢复
Ctrl + F              # 终止指定任务
```

### 后台任务最佳实践

**大型项目推荐配置**：

```bash
/loop create "daily-lint" --interval daily --start "06:00"  # 每日 Lint
/loop create "weekly-review" --interval weekly --start "friday-17:00"
/agent background-reviewer --name "reviewer-bg"
```

## 6. 打印/非交互模式（Print Mode）

### 打印模式定义

CLI 的**单次执行模式**，用 `-p` 或 `--print` 标志。

### 打印模式对标场景

适合 CI/CD、脚本、管道处理、自动化任务。

### 打印模式基础用法

```bash
claude -p "代码审查这个文件"

# 或长形式
claude --print "问题：性能瓶颈分析" << EOF
$(cat src/main.ts)
EOF
```

### 打印模式高级参数

| 参数 | 说明 |
| --- | --- |
| `--bare` | 最小输出（仅结果，无格式） |
| `--json-schema <schema>` | 输出 JSON，按 schema 验证 |
| `--max-turns 1` | 限制最多 1 轮对话 |
| `--max-budget-usd 1.0` | 花费不超过 $1.0 |
| `--output-format json` | 强制 JSON 输出 |
| `--no-session-persistence` | 不保存会话 |

### 打印模式实战例子

```bash
# JSON 格式的代码审查报告
claude -p --output-format json << EOF
审查这个代码，输出 JSON：{
  "issues": [...],
  "score": 0-100,
  "suggestions": [...]
}
EOF

# 集成到 CI/CD（最小开销）
claude -p --bare --max-turns 1 "修复这个 bug" << EOF
$(git diff)
EOF
```

### 打印模式最佳实践

**结合 --bare 实现极致轻量自动化**：

```bash
claude \
  -p --bare \
  --max-budget-usd 0.50 \
  --permission-mode dontAsk \
  "快速 lint 检查"
```

## 7. 会话管理（Session Management）

### 会话管理定义

对会话进行**命名、恢复、分支、持久化管理**。

### 会话管理对标场景

支持长期项目、多分支实验、跨设备续接。

### 会话管理基本操作

**命名会话**：

```bash
claude -n "auth-refactor"
```

**恢复会话**：

```bash
claude --resume <name>   # 或
claude -c               # 恢复最后一个会话
```

**分支会话**：

```bash
/branch "auth-refactor-branch-2"
# 或 CLI
claude --fork-session --from "auth-refactor"
```

**会话选择器**：

在启动时按 ↑↓ 导航，P 预览，Enter 选择：

```bash
claude
# → 交互式会话列表
```

### 会话管理会话列表与管理

```bash
/session list           # 列出所有会话
/session delete <name>  # 删除
/session info <name>    # 查看详情
/session export <name>  # 导出
/session import <file>  # 导入
```

### 会话管理最佳实践

**为大功能模块建立独立会话**：

```bash
# 功能 A：认证重构
claude -n "feature/auth"

# 功能 B：支付集成
claude -n "feature/payment"

# Bug 修复
claude -n "bugfix/memory-leak"

# 实验（临时）
claude -n "experiment/new-arch" --fork-session
```

## 8. 交互式功能（Interactive Features）

### 交互式功能定义

终端内**丰富的快捷键和 `/` 命令系统**。

### 交互式功能对标场景

极大提升操作效率和沉浸感。

### 交互式功能常用快捷键

| 快捷键 | 功能 |
| --- | --- |
| `Shift + Tab` | 切换权限模式 |
| `Esc Esc` 或 `Ctrl + Z` | 打开 /rewind 菜单 |
| `Option + T` / `Alt + T` | 激活扩展思考 |
| `Ctrl + O` | 查看思考过程或完整输出 |
| `Ctrl + G` | 编辑当前计划 |
| `Ctrl + F` | 终止任务 |
| `Ctrl + K` | 清屏 |
| `Tab` | 自动补全 Prompt |

### 常用 / 命令

| 命令 | 功能 |
| --- | --- |
| `/help` | 显示所有可用命令 |
| `/config` | 打开配置界面 |
| `/memory` | 查看和编辑记忆系统 |
| `/skills` | 列出所有 Skill |
| `/mcp` | 管理 MCP 连接 |
| `/plugin` | 插件市场和管理 |
| `/agents` | 列出 Subagent |
| `/tasks` | 查看后台任务 |
| `/rewind` | 进入检查点恢复菜单 |
| `/voice` | 激活语音听写 |
| `/branch` | 分支会话 |

### 交互式功能上下文智能推荐

Claude 会根据当前项目、最近操作智能推荐 /help 提示。

## 9. 频道（Channels）

### 频道定义

MCP 服务器的**实时推送功能**。

### 频道对标场景

让 Claude 能被动接收外部事件（监控告警、Slack 消息、Webhook 等）并自动响应。

### 频道配置方式

在 MCP 配置中开启：

```json
{
  "mcpServers": {
    "webhook-mcp": {
      "transport": "http",
      "url": "https://mcp.example.com",
      "channels": {
        "alerts": {
          "subscribe": true,
          "autoRespond": true
        }
      }
    }
  }
}
```

### 频道实际应用

- **Sentry 告警**：监听 error channel，自动生成修复方案
- **Slack 消息**：监听 @claude 提及，自动回复代码问题
- **CI/CD 失败**：监听 build-failed channel，自动诊断

## 10. 语音听写（Voice Dictation）

### 语音听写定义

**直接用语音输入 Prompt**。

### 语音听写对标场景

实现"说代码"工作流，大幅降低打字负担。

### 语音听写使用方式

**在会话中激活**：

```bash
/voice
```

然后**按住空格说话**，释放即停止。

**Desktop 版**：专用语音按钮（🎤 图标）。

### 语音听写最佳实践

**边走边码**：

- 走到一个逻辑问题，按 `/voice` 激活语音
- Claude 听完自动提供方案

## 11. 远程控制（Remote Control）

### 远程控制定义

从**Claude.ai / 手机 App 远程操控本地 Claude Code**。

### 远程控制对标场景

随时随地操作本地文件和工具（离开工作地点也能继续工作）。

### 远程控制启动与配对

```bash
claude remote-control
```

→ 生成二维码 → 用**手机或网页浏览器**（[https://claude.ai](https://claude.ai)）扫描二维码 → 连接

### 远程控制限制

- 仅 macOS/Linux 桌面稳定支持
- 需保持网络连接
- 本地进程必须持续运行

## 12. Web 会话（Web Sessions）

### Web 会话定义

在 **[https://claude.ai/code](https://claude.ai/code)** 运行的**云端 Claude Code**。

### Web 会话对标场景

无需安装即可快速使用（但无法直接访问本地文件，除非通过远程控制）。

### Web 会话优缺点

| 优势 | 劣势 |
| --- | --- |
| 无需安装 | 无法直接访问本地文件 |
| 跨平台 | 性能可能受网络影响 |
| 实时同步 Claude.ai 功能 | 初级功能少于桌面版 |

## 13. 桌面应用程序（Desktop Application）

### 桌面应用定义

**独立的 GUI 客户端**（macOS 为主）。

### 桌面应用对标场景

提供可视化 diff、实时预览、Computer Use 等 CLI 无法实现的体验。

### 桌面应用特有功能

- **Side-by-side Diff**：直观查看代码修改
- **Live Preview**：网页项目实时预览
- **File Tree**：可视化文件结构
- **Terminal Integration**：集成终端
- **Computer Use**：模拟鼠标键盘与桌面应用交互

### 桌面应用最佳实践

**任务分工**：

- **复杂审查**：用 Desktop（可视化 Diff）
- **批量处理**：用 CLI（脚本化）
- **实时预览**：用 Desktop（Live Preview）

## 14. Git 工作树（Git Worktrees）

### Git 工作树定义

**自动创建隔离的 Git 工作树**。

### Git 工作树对标场景

完美支持多任务并行，每个任务独立目录和分支。

### Git 工作树使用方式

```bash
# 创建新工作树并在其中启动 Claude Code
claude --worktree feature-xxx
```

Claude 会自动：

1. 创建 `worktrees/feature-xxx` 目录
2. 创建对应的 Git 分支
3. 在该环境中启动会话

### Git 工作树多任务并行示例

```bash
# 终端 1：处理 feature A
claude --worktree feature/auth

# 终端 2：处理 feature B
claude --worktree feature/payment

# 终端 3：修 Bug
claude --worktree bugfix/memory-leak
```

每个任务完全独立，互不干扰。

### Git 工作树清理

```bash
git worktree remove worktrees/feature-xxx
```

## 15. 沙盒（Sandbox）

### 沙盒定义

对 **Bash 命令进行 OS 级隔离环境**。

### 沙盒对标场景

安全运行未知代码或插件，防止系统被破坏。

### 沙盒启用方式

在 `~/.claude/settings.json` 中：

```json
{
  "sandbox": {
    "enabled": true,
    "features": {
      "filesystem": "restricted",
      "network": "denied",
      "process": "isolated"
    }
  }
}
```

### 沙盒限制与权限

| 资源 | 沙盒默认 |
| --- | --- |
| 文件系统 | 只读（除项目目录外） |
| 网络 | 拒绝 |
| 进程 | 隔离（无法影响主系统） |
| 环境变量 | 受限 |

## 16. 托管设置与配置（Managed Settings & Configuration）

### 托管设置定义

**企业级统一配置体系**（三层：托管 > 用户 > 项目）。

### 托管设置对标场景

管理员可强制策略，团队保持一致性。

### 托管设置配置层级（优先级从高到低）

1. **托管配置**（`managed-settings.json`）：管理员强制
2. **用户配置**（`~/.claude/settings.json`）：个人偏好
3. **项目配置**（`.claude/settings.json`）：项目级规则

### 托管设置管理员配置示例

```json
{
  "managed": {
    "autoUpdatesEnabled": true,
    "permissions": {
      "defaultMode": "plan",
      "allowTools": ["Read", "Grep", "Glob", "Edit"],
      "denyTools": ["Bash"]
    },
    "models": {
      "allowed": ["sonnet", "haiku"],
      "forbidden": ["opus"]
    },
    "security": {
      "sandboxEnabled": true,
      "mpcAllowlist": ["notion", "github"]
    }
  }
}
```

### 三层配置冲突解决

```text
user 设置: "model": "opus"
managed:   "forbidden": ["opus"]
→ 结果：使用 sonnet（托管策略优先）
```

## 17. 最佳实践总结

### 日常工作流

```text
1. Plan Mode：生成详细计划
   ↓
2. Extended Thinking：深度分析（复杂任务）
   ↓
3. Auto Mode：自动执行（Team 计划）
   或 acceptEdits 模式：人工批准
   ↓
4. Background Tasks：并行处理其他工作
```

### 安全第一

- 大型项目始终开启 **Sandbox + Plan Mode**
- 敏感操作用 `dontAsk` 模式 + 严格规则
- 定期审查 `~/.claude/logs/` 日志

### 效率组合

| 场景 | 推荐组合 |
| --- | --- |
| 远程工作 | Remote Control + Voice + Web Session |
| 多任务并行 | Git Worktree + Background Tasks + Sessions |
| 代码审查 | Desktop App + Plan Mode + Extended Thinking |
| CI/CD 自动化 | CLI + Auto Mode + Print Mode |
| 架构设计 | Plan Mode + Extended Thinking + 远程讨论 |

### 渐进式学习

**从小到大**：

1. ✅ 学会权限模式、规划模式（入门）
2. ✅ 掌握会话管理、快捷键（初级）
3. ✅ 启用后台任务、Sandbox（中级）
4. ✅ 集成远程控制、企业配置（进阶）

## 18. 官方文档与资源

- [中文官方文档](https://code.claude.com/docs/zh-CN/)（实时更新）
- [英文官方文档](https://code.claude.com/docs/en/)
- [前置系列教程 Series 0-12](/blog/) 涵盖所有基础与进阶功能

---

**总结**：掌握了这 16 个高级功能，结合 Series 0-12 的所有核心功能，你已经具备构建**企业级 AI 工程化工作流**的所有能力。从日常开发到团队协作再到完整自动化，Claude Code 都能胜任。🚀
