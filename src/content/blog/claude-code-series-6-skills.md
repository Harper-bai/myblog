---
title: Claude Code 系列教程（六）：Skills 系统
description: "从零开始打造 Claude 的专业技能库，让 AI 员工自动执行复杂工作流。"
publishDate: '2026-03-30T09:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 1. 什么是 Skill？

Claude Code 的 Skill（技能）是让你给 Claude 安装"专家模块"的核心扩展功能：它把特定任务的工作流、指令、脚本和参考资源打包成一个可复用的"技能包"，让 Claude 能像专业团队成员一样自动、稳定地完成重复性工作，而不用每次都重复提示词。

**简单说**：Skill = 员工手册 + 工具箱，它把零散的提示词、模板、SOP 变成 Claude 的"内置能力"。

## 2. Skill 有什么用？

### 自动触发

Claude 根据任务描述，自动加载并使用 Skill（节省上下文，只在需要时注入完整内容）。

### 手动调用

输入 `/skill-name` 直接执行（类似以前的自定义命令）。

### 解决痛点

- 不用反复教 Claude "我们公司的代码审查流程是怎样的"
- 支持复杂工作流（多步、调用脚本、并行代理、读文件）
- 跨项目/团队复用（个人、全局、企业级）
- 比 CLAUDE.md 更灵活：CLAUDE.md 是"全局规则"，Skill 是"特定任务专家"

### 内置（Bundled）Skill 示例

| Skill | 用途 |
| --- | --- |
| `/batch` | 大规模并行代码修改（自动拆分、开 PR） |
| `/debug` | 开启调试日志并分析问题 |
| `/simplify` | 自动审查最近修改并优化代码 |
| `/loop` | 定时重复执行某个提示 |

## 3. 如何写 Skill？

### 第一步：创建目录

```bash
# 个人全局 Skill（所有项目可用）
mkdir -p ~/.claude/skills/my-skill-name

# 或项目级 Skill（只当前项目）
mkdir -p .claude/skills/my-skill-name
```

### 第二步：新建 SKILL.md（必须叫这个名字）

文件结构 = YAML frontmatter（头部配置） + Markdown 指令。

完整示例（教 Claude 用图表和类比解释代码）：

```markdown
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
---

When explaining code, always include:

1. **Start with an analogy**：Compare the code to something from everyday life
2. **Draw a diagram**：Use ASCII art to show the flow...
3. **Walk through the code**：Explain step-by-step...
4. **Highlight a gotcha**：Common mistake...

Keep explanations conversational.
```

### 第三步：保存后立即生效

- 直接输入 `/explain-code src/auth/login.ts`
- 或随便问 "How does this code work?" → Claude 自动调用

## 4. 支持额外文件（让 Skill 更强大）

```text
my-skill/
├── SKILL.md           # 必填：主指令
├── template.md        # Claude 要填的模板
├── examples/
│   └── sample.md      # 预期输出示例
└── scripts/
    └── validate.sh    # 可执行脚本（Claude 可调用）
```

在 SKILL.md 里引用它们，Claude 会按需加载。

## 5. Skill 存储位置 & 优先级

和 CLAUDE.md 的存放位置和优先级类似。

| 位置 | 路径 | 适用范围 | 优先级 |
| --- | --- | --- | --- |
| 企业级 | 托管策略（管理员配置） | 全组织 | 最高 |
| 个人级 | `~/.claude/skills/` | 你所有项目 | 中 |
| 项目级 | `.claude/skills/` | 当前项目 | 低 |
| 插件级 | 插件目录下的 `skills/` | 启用插件时 | - |

**Monorepo 支持**：嵌套目录自动发现（子包可有自己的 Skill）。

## 6. YAML Frontmatter 常用配置（进阶）

```yaml
---
name: my-skill
description: 简短描述，帮助 Claude 判断何时自动加载
invocation: both          # both（默认）/ user（只你手动）/ model（只 Claude 自动）
disable-model-invocation: true   # 禁止自动加载，只允许手动调用（节省上下文）
---
```

更多选项见官方文档（支持 subagent 执行、动态注入等）。

## 7. 管理命令

- 输入 `/skills` → 查看所有可用 Skill
- 现有 `.claude/commands/` 文件依然有效（已自动合并到 Skill 体系）

## 8. 最佳实践

- **保持 description 具体**：Claude 自动触发更准
- **Skill 越专注越好**：一个 Skill 一个任务
- **大型 Skill 可拆成多个文件引用**
- **团队共享**：把项目级 Skill 提交到 Git

## 9. 开源 Skills 库

### Anthropic 官方 Skills

官方示例和模板仓库

[anthropics/skills](https://github.com/anthropics/skills)

### alirezarezvani/claude-skills

最大社区库（200+ 个生产级 Skill，支持多工具）

[alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)

### travisvn/awesome-claude-skills

精选 Awesome 列表（最佳导航入口）

[travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)

### ComposioHQ/awesome-claude-skills

高质量 curated 列表

[ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)

### BehiSecc/awesome-claude-skills

另一个热门 Awesome 列表

[BehiSecc/awesome-claude-skills](https://github.com/BehiSecc/awesome-claude-skills)

### hesreallyhim/awesome-claude-code

超大规模 Awesome 合集（33k+ stars）

[hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)

## 10. 参考链接

- [中文：Claude Code - Skills](https://code.claude.com/docs/zh-CN/skills)
- [英文：Claude Code - Skills](https://code.claude.com/docs/en/skills)
