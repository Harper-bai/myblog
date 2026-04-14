---
title: Claude Code 系列教程（十）：Subagent 与 Agent Team 多代理协作
description: "掌握多代理架构核心：Subagent 实现专职隔离任务，Agent Team 支持团队协同讨论。"
publishDate: '2026-03-31T09:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 1. 什么是 Subagent？

Subagent 是处理特定类型任务的**专门 AI 助手**。它在单个会话内运行，每个 Subagent 都有独立的上下文窗口、自定义系统提示、专属工具权限和独立权限。

### 核心特征

- **主 Claude**（主代理）遇到匹配的任务时，会自动委托给对应的 Subagent
- **Subagent 独立完成**工作后，把总结结果返回给主代理，不会互相通信
- **简单比喻**：主代理像经理，Subagent 像专业外包助手（一次性任务，干完就汇报）

## 2. Subagent 有什么用？

- **隔离上下文**：避免大量文件/研究污染主对话
- **强制约束**：限制工具权限（例如只读、不允许编辑）
- **成本控制**：指定用更便宜的模型（如 Haiku）
- **跨项目复用**：用户级 Subagent 可在所有项目中使用
- **典型场景**：代码审查、调试、数据分析、数据库查询、测试运行等专注型任务

## 3. 如何创建 Subagent？

### 方式一：交互式创建（最简单）

在会话中：

```bash
/agents
```

然后选择 "Create new agent" → 描述需求 → Claude 自动生成

### 方式二：手动创建文件

在以下位置创建 Markdown 文件：

- **项目级**：`.claude/agents/xxx.md`
- **用户级**：`~/.claude/agents/xxx.md`

### 最小示例（code-reviewer.md）

```markdown
---
name: code-reviewer
description: 代码审查专家，专注于质量、安全和最佳实践
tools: Read, Grep, Glob, Bash
model: sonnet
---

你是一个资深代码审查员。

当被调用时：

1. 查看最近的 git diff
2. 重点审查修改的文件
3. 给出具体、可操作的反馈
```

### 完整示例（data-analyzer.md）

```markdown
---
name: data-analyzer
description: 专业数据分析助手，处理数据库查询和报表生成
tools: Read, Bash, WebFetch
disallowedTools: Write, Edit
model: opus
memory: project
---

你是一个数据分析专家，拥有 SQL 和数据挖掘背景。

# 职责

- 执行数据库查询并解释结果
- 生成统计报告
- 识别数据异常和趋势

# 工作流程

1. 确认数据源和查询需求
2. 编写并执行 SQL
3. 用自然语言解释找到的模式
4. 提供可行建议

# 约束

- 只读数据，不允许修改
- 敏感数据脱敏处理
- 每次报告包括数据样本大小和置信度
```

## 4. 如何调用 Subagent？

### 自动调用

Claude 根据 description 自动识别匹配的 Subagent：

```text
主代理："请审查一下我最近的改动"
→ 自动调用 code-reviewer subagent
```

### 手动调用

#### 自然语言

```text
"用 code-reviewer 子代理审查 auth 模块的改动"
"让 data-analyzer 查一下本月的用户增长趋势"
```

#### @ 提及

```text
@code-reviewer (agent) 看一下我的改动
```

#### CLI 启动

```bash
claude --agent code-reviewer
```

## 5. Subagent 的高级配置

### YAML Frontmatter 常用字段

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `name` | Subagent 唯一标识（必填） | `name: code-reviewer` |
| `description` | 功能描述，帮助主代理判断何时调用 | `description: 代码审查专家...` |
| `tools` | 允许使用的工具列表 | `tools: Read, Grep, Bash` |
| `disallowedTools` | 禁止使用的工具 | `disallowedTools: Write, Edit` |
| `model` | 指定使用的 Claude 模型 | `model: haiku`（省钱）或 `model: opus`（更强） |
| `memory: project` | 启用独立记忆系统 | 保持任务间的上下文 |
| `skills` | 预加载的 Skill 列表 | `skills: [code-review-checklist]` |
| `background: true` | 后台运行，不阻塞主对话 | 适合长时间任务 |
| `maxTokens` | 限制输出 token 数 | `maxTokens: 5000` |
| `systemPrompt` | 完全自定义系统提示 | 覆盖默认行为 |

### 实战示例：最小化成本的 Code Reviewer

```markdown
---
name: cost-effective-reviewer
description: 快速代码审查，用 Haiku 模型降低成本
tools: Read, Glob
disallowedTools: Edit, Write, Bash
model: haiku
maxTokens: 2000
---

你是一个严谨但简洁的代码审查员。

# 审查清单

- [ ] 是否有明显的 bug？
- [ ] 变量名是否清晰？
- [ ] 是否缺少错误处理？
- [ ] JSON/类型定义是否正确？

仅输出问题列表，不提出优化建议。
```

## 6. 什么是 Agent Team？

Agent Team 是**实验性功能**，允许多个独立 Claude Code 会话组成**团队协同工作**。

### 主要特点

- 一个会话作为**团队负责人（Lead）**，其他作为**队友（Teammate）**
- 每个队友都有**完全独立的上下文窗口**，可**直接互相通信**
- **比喻**：像一个工程小队，有组长 + 多个专职成员，大家共享任务列表、互相讨论、认领工作
- **与 Subagent 最大区别**：队友之间可以直接聊天，而非只汇报给组长

## 7. Agent Team 有什么用？

### 典型场景

- **并行代码审查**：安全/性能/测试三人组
- **新功能开发**：前端/后端/测试各一人并行工作
- **调试多假设**：每个人测试一种可能性并互相辩论

### 优势

- 每个队友上下文独立，不会互相干扰
- 支持直接消息、共享任务列表、计划审批
- 激烈讨论能产生更好的结果（竞争性验证）

## 8. 如何启用和使用 Agent Team？

### 第一步：启用（默认关闭）

#### 方式一：环境变量

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
claude
```

#### 方式二：配置文件

在 `~/.claude/settings.json` 中添加：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### 第二步：启动团队

在主会话中直接描述：

```text
创建一个 Agent Team 来审查 PR #142：
- 一个安全审查员
- 一个性能审查员
- 一个测试覆盖率审查员
让他们互相讨论并汇总结论。
```

Claude 会自动：

1. 创建团队 + 共享任务列表
2. 生成队友
3. 分配角色

## 9. Agent Team 的交互方式

### 切换队友

```bash
Shift + Down
```

直接发消息给不同的队友。

### 自然语言指令

```text
"给安全队友发消息：重点看 JWT 的验证逻辑"
"要求所有队友提交计划"
"整合三位队友的审查意见"
```

### 计划审批模式（推荐）

队友先只读规划，负责人批准后再执行：

```text
Lead: /plan

(所有队友生成计划)

Lead: 我审核了，安全队友的计划需要调整...

(队友修改后重新执行)
```

### 显示模式

**in-process**（默认）：所有队友在同一终端切换

**split-panes**（推荐复杂团队）：用 tmux 或 iTerm2 把每个队友放在独立窗格

```bash
# iTerm2 示例
claude --agent-team split-panes
```

## 10. Subagent vs Agent Team 对比

| 维度 | Subagent（子代理） | Agent Team（代理团队） |
| --- | --- | --- |
| 运行范围 | 单个会话内 | 多个独立会话 |
| 通信方式 | 只向主代理汇报 | 队友之间可直接互相发消息 |
| 上下文 | 独立但结果需汇总 | 完全独立 + 共享任务列表 |
| 适合任务 | 专注、一次性、隔离型任务 | 需要讨论、并行探索、协作型复杂任务 |
| 令牌成本 | 较低（总结返回） | 较高（每个队友都是完整实例） |
| 稳定性 | 已稳定 | 仍为实验功能（需手动启用） |
| 典型场景 | 快速代码审查、数据分析查询 | PR 多角度评审、新功能并行开发 |

### 选择建议

- **90% 的场景用 Subagent 就够**（更快、更省钱）
- **需要"多人讨论"或"竞争性验证"时**，才用 Agent Team

## 11. 最佳实践

### 🎯 Subagent 设计

- **职责清晰**：每个 Subagent 只做一件事（单一职责）
- **工具权限最小化**：不需要的工具加到 `disallowedTools`
- **模型选择**：
  - Haiku（快速 + 便宜）：代码搜索、日志分析、简单查询
  - Sonnet（平衡）：代码审查、测试运行、中等复杂度任务
  - Opus（最强）：架构设计、复杂调试、策略性决策
- **描述要精准**：description 决定自动调用的准确度

### 🎯 Agent Team 使用

- **适度团队规模**：3-5 人为最优（太多会造成混乱）
- **角色明确**：每个队友的职责要孤立不相交
- **启用计划模式**：复杂任务必须先审批计划
- **定期同步**：每个队友完成一个 milestone 后向 Lead 汇报

### 🎯 成本控制

```markdown
# 高效搭配

- 主会话：Opus（复杂决策）
- Code Reviewer Subagent：Haiku（快速扫描）
- Data Analyzer Subagent：Opus（准确计算）

# 平衡方案

- 所有任务默认用 Sonnet
- 成本敏感任务改用 Haiku
- 关键决策改用 Opus
```

## 12. 实战案例

### 案例一：代码审查 Subagent

**场景**：每次 commit 前快速审查

```markdown
---
name: pr-reviewer
description: PR 审查员，检查代码质量、安全和测试覆盖
tools: Read, Glob, Grep
disallowedTools: Edit, Write
model: sonnet
---

# PR 审查流程

1. 查看 git diff
2. 检查以下维度：
   - 代码风格一致性
   - 安全漏洞（SQL 注入、XSS、CSRF）
   - 错误处理是否完善
   - 是否有对应的单元测试
3. 生成 Review 评论

# 注意事项

- 仅指出问题，不修改代码
- 按优先级排列建议（Critical → Nice to Have）
```

### 案例二：Agent Team —— 三角监督式 PR 再审

**场景**：关键 PR 需要多角度评估

```text
Lead 创建 Agent Team：

创建代码审查小队，分别评估 PR #999：

- 角色 1：性能审查员（重点看遍历、缓存、数据库查询）
- 角色 2：安全审查员（重点看认证、授权、敏感数据处理）
- 角色 3：测试审查员（重点看测试覆盖率、边界情况）

三位要互相讨论，给出最终共识意见。
```

## 13. 参考链接

- [Subagent 官方文档（中文）](https://code.claude.com/docs/zh-CN/sub-agents)
- [Agent Team 官方文档（中文）](https://code.claude.com/docs/zh-CN/agent-teams)
- [Subagent 实践指南](https://github.com/luongnv89/claude-howto/tree/main/04-subagents)
