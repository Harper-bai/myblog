---
title: Claude Code 系列教程（三）：记忆
description: "从 CLAUDE.md 到 Auto Memory，建立跨会话知识持久化的最佳实践。"
publishDate: '2026-03-29T09:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 1. 为什么需要记忆系统？

Claude Code 的记忆系统是为了解决"每次新会话都要重复解释项目背景、代码风格、构建命令"的问题而设计的。它让 Claude 能跨会话持久记住项目知识，而不需要你每次都从头教它。

Claude Code 有两个互补的记忆系统，两者都会在每次对话开始时自动加载到上下文里。Claude 把它们当作参考上下文（而不是强制规则）。指令越具体、越简洁，Claude 遵守得越好。

## 2. 两种记忆机制

- **CLAUDE.md**：你主动给 Claude 的「长期指令」。
- **Auto Memory**：Claude 自己记的「笔记本」，无需你手动维护。

## 3. CLAUDE.md 详解

### 3.1 文件放在哪里？

Claude Code 支持多个层级的 CLAUDE.md，启动时全部加载。

完整的层级目录结构：

```text
/Library/Application Support/ClaudeCode/        ← [0] 管理策略（最高优先级·只读）
├── CLAUDE.md
└── managed-settings.d/
    ├── 00-security.md
    └── 01-code-style.md

~/.claude/                                       ← [1] 用户记忆（所有项目生效）
├── CLAUDE.md
└── rules/                                       ← [2] 用户规则（所有项目生效）
    ├── personal-style.md
    └── preferred-patterns.md

your-project/
├── CLAUDE.md                                    ← [3] 项目记忆（团队共享·随 Git 提交）
└── .claude/
    ├── CLAUDE.md                                ← [3] 项目记忆（同上，二选一）
    └── rules/                                   ← [4] 项目规则（模块化·按主题拆分）
        ├── code-style.md
        ├── testing.md
        └── api/
            ├── conventions.md
            └── validation.md

~/.claude/projects/your-project/memory/          ← [5] 自动记忆（最低优先级·仅本机）
├── MEMORY.md                                        （每次加载前 200 行）
├── debugging.md
└── api-conventions.md
```

**优先级**：企业统一策略 > 用户级 > 项目级 > 子目录级。越具体的规则，Claude 越优先参考。

### 3.2 怎么写 CLAUDE.md

#### 第一层次：个人偏好（所有项目生效）

在 `~/.claude/CLAUDE.md` 里，对所有项目生效。示例：

```markdown
# 我的开发偏好

## 编码习惯
- 错误处理：使用明确的 try-catch，附有意义的错误信息
- 注释风格：注释解释"为什么"，而不是"做了什么"
- 测试习惯：先写测试，再写实现（TDD）

## 调试风格
- 日志前缀统一用 `[DEBUG]`
- 每条日志包含：函数名、关键变量值、时间戳

## 沟通偏好
- 解释复杂概念时，先给代码示例再解释理论
- 代码修改前后对比展示
- 段尾总结关键要点
```

#### 第二层次：项目规范（可团队共享）

在 `~/your-project/CLAUDE.md` 里，项目规范，随 Git 提交，团队共享：

```markdown
# 项目概览

## 基本信息
- 项目名：my-ecommerce-app
- 技术栈：Next.js 15、TypeScript、PostgreSQL
- 团队规模：5 人

## 开发规范
- 包管理：永远用 pnpm，不要用 npm 或 yarn
- 代码风格：2 空格缩进，函数式 React 组件
- 文件命名：kebab-case

## 常用命令
- 安装依赖：`pnpm install`
- 本地运行：`pnpm dev`
- 构建：`pnpm build`
- 测试：`pnpm test -- --coverage`

## 架构说明
- API 路由在 `src/app/api/`
- 数据库模型在 `src/models/`
- 共用组件在 `src/components/`
```

#### 第三层次：子目录专属规则

如果项目的某个模块有特殊规范，可以在那个目录下放独立的 CLAUDE.md。这个文件只在 Claude 处理该目录文件时才加载：

```markdown
<!-- src/api/CLAUDE.md -->
# API 开发规范

所有端点必须：
- 做输入验证（用 Zod）
- 处理错误并返回标准格式
- 在注释里说明参数和返回值类型
```

### 3.3 怎么用 Rules

Rules 也是记忆的一部分，和 CLAUDE.md 的作用一样。为什么会有 Rules 呢？

1. 一份好的 CLAUDE.md 不能过长，可以将规则分割成 Rules。
2. 它允许我们把某些规则只限定在特定文件/目录上生效，而不是全局加载，从而节省上下文空间。

Rules 的文件通过 YAML frontmatter 精确控制文件匹配范围：

```markdown
---
paths:
  - "src/api/**/*.ts"
---
# 只对 API 的 TypeScript 文件生效
所有端点必须做输入验证
```

Rules 的文件也可以通过 `@` 被 CLAUDE.md 引用：

```markdown
# 项目规范

## 项目概览
参见 @README.md

## 可用命令
参见 @package.json

## 架构文档
参见 @docs/architecture.md

## 共享规范（从用户目录导入）
参见 @~/.claude/my-rules.md
```

最多支持 5 层递归导入。

### 3.4 最佳实践

#### 应该包含的内容

- **要具体详细**：使用清晰、详细的说明，而不是模糊的指导。
  - ✅ 良好建议："所有 JavaScript 文件均使用 2 个空格缩进"
  - ❌ 避免使用："遵循最佳实践"

- **保持条理清晰**：使用清晰的 Markdown 章节和标题来组织记忆文件。

- **使用适当的层级结构**：
  - 管理策略：公司范围内的策略、安全标准、合规要求
  - 项目内存：团队标准、架构、编码规范（提交到 Git）
  - 用户记忆：个人偏好、沟通方式、工具选择
  - 目录内存：模块特定规则和覆盖

- **利用导入**：使用 `@path/to/file` 语法引用现有文档
  - 支持最多 5 层递归嵌套
  - 避免跨内存文件重复
  - 示例：See `@README.md` for project overview

- **记录常用命令**：将经常使用的命令添加到记忆中，以节省时间。

- **版本控制项目内存**：将项目级别的 CLAUDE.md 文件提交到 Git，利于团队协作。

- **定期回顾**：随着项目发展和需求变化，定期更新记忆。

- **提供具体示例**：包括代码片段和具体场景。

#### 应避免的行为

- **不要存储机密信息**：切勿包含 API 密钥、密码、令牌或凭据。
- **请勿包含敏感数据**：不得包含个人身份信息、私人信息或专有秘密。
- **不要重复内容**：请使用导入语句（`@path`）引用现有文档。
- **不要含糊其辞**：避免使用"遵循最佳实践"或"编写优质代码"之类的笼统说法。
- **不要写得太长**：保持单个内存文件简洁，篇幅不超过 500 行。
- **不要过度组织**：策略性地使用层级结构；不要创建过多的子目录覆盖。
- **别忘了更新**：记忆陈旧会导致混淆和过时的做法。
- **请勿超过嵌套层数限制**：内存导入最多支持 5 层嵌套。

## 4. Auto Memory 详解

### 4.1 它是怎么工作的？

当你纠正 Claude，或者会话中出现了值得记住的信息，Claude 会自动把它写入记忆文件：

```text
~/.claude/projects/<项目名>/memory/
├── MEMORY.md          ← 索引文件，每次会话自动加载前 200 行
├── debugging.md       ← Claude 记录的调试经验
└── api-conventions.md ← API 约定笔记
```

MEMORY.md 每次会话只加载前 200 行，其他主题文件是按需读取的（Claude 需要时才去翻）。所以它会自动把详细内容挪到主题文件里，保持索引简洁。

### 4.2 怎么主动告诉 Claude 记住某件事？

直接在会话里说：

```text
记住：我们项目永远用 pnpm，不要用 npm
记住：本地 Redis 地址是 localhost:6379，API 测试需要它运行
```

如果你想把规则加到 CLAUDE.md 而不是 Auto Memory，明确说：

```text
把这条规则加到 CLAUDE.md：测试文件命名统一用 *.test.ts
```

### 4.3 查看和管理记忆

在会话里输入 `/memory`，可以：

- 查看当前加载了哪些记忆文件
- 开关 Auto Memory 功能
- 直接用编辑器打开记忆文件修改或删除（全是普通 Markdown）

## 5. 参考链接

- [官方文档：Claude Code Memory](https://code.claude.com/docs/en/memory)
- [claude-howto / 02-memory](https://github.com/luongnv89/claude-howto/tree/main/02-memory)
