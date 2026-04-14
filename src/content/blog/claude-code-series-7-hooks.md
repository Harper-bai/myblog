---
title: Claude Code 系列教程（七）：Hooks 自动化工作流
description: "从零开始掌握 Hooks——在 Claude 执行的关键时刻自动运行脚本，让 AI 像守纪律的工程师。"
publishDate: '2026-03-30T12:00:00+08:00'
author: 'Harper'
language: "zh"
tags:
- tech
---

## 1. 什么是 Hook？

Hook = 自动触发器，在 Claude Code 执行的关键时刻，自动运行你写的脚本——让 Claude 更像一个守纪律的工程师，而不是一个"有时候会忘事"的助理。

### 核心区别

你可以在 prompt 或 CLAUDE.md 里写"每次改完代码都要跑测试"，Claude 大概率会照做。但如果它在一个复杂任务里专注起来，可能就"忘了"（因为上下文太长了）。

**Hook 是不同的东西**：只要触发条件满足，脚本就一定运行，不依赖 Claude 的"记忆"。

## 2. Hooks 有什么用？

典型用途：

- **自动格式化**：Claude 改完文件，Prettier/Black 自动跑，不用多说一个字
- **安全拦截**：Claude 想执行 `rm -rf` 或 `git push --force main`，直接阻断
- **自动注入上下文**：每次会话开始，自动把当前 git 状态、未完成的 TODO 告诉 Claude
- **任务完成检查**：Claude 说"我做完了"，先跑一遍测试，没过就不让它停
- **桌面通知**：Claude 等你回复时，发一条通知，你不用一直盯着屏幕
- **日志与备份**：自动记录每次操作，或在上下文压缩前备份对话

## 3. 配置在哪里？

两种位置（和 CLAUDE.md 的逻辑类似）：

| 位置 | 路径 | 适用范围 |
| --- | --- | --- |
| 个人全局 | `~/.claude/settings.json` | 你所有项目 |
| 项目级 | `.claude/settings.json` | 当前项目（覆盖全局设置） |

配置格式固定，三层嵌套：事件 → 匹配器 → 处理器：

```json
{
  "hooks": {
    "事件名": [
      {
        "matcher": "正则，匹配哪些工具",
        "hooks": [
          {
            "type": "command",
            "command": "你的 shell 命令"
          }
        ]
      }
    ]
  }
}
```

**matcher 留空 `""`** 则对所有情况都触发。**多个 hooks 数组里的命令会并行执行**。

## 4. 全部 12 个生命周期事件

| 事件 | 触发时机 | 可阻断? | 说明 |
| --- | --- | --- | --- |
| `SessionStart` | 会话开始 | 否 | stdout 被自动注入到 Claude 的上下文 |
| `SessionEnd` | 会话结束（超时 1.5s） | 否 | 清理、备份、日志上报 |
| `PreToolUse` | Claude 要使用工具之前 | 是 | 权限校验、参数修正、安全拦截 |
| `PostToolUse` | 工具执行完后 | 否 | 自动格式化、日志记录、但不能撤销已执行的操作 |
| `Notification` | Claude 需要你的注意时 | 否 | 发送桌面通知 |
| `Stop` | Claude 想停止任务之前 | 是 | 强制跑测试，不通过不让停 |
| `SubagentStart` | 子 Agent 启动前 | 否 | 设置子 Agent 的上下文 |
| `SubagentStop` | 子 Agent 停止前 | 是 | 检查子 Agent 的工作成果 |
| `ToolError` | 工具执行出错 | 否 | 记录错误、发送告警 |
| `FileChange` | 文件被修改 | 否 | 跟踪代码变更、触发重新编译 |
| `ContextLimitApproach` | 上下文接近满 | 是 | 决定是否压缩历史或生成摘要 |
| `ErrorOccurred` | Claude 出现错误 | 否 | 记录、告警、对话恢复 |

## 5. 退出码——控制流程的信号

对于 `PreToolUse`、`Stop`、`SubagentStop` 等可阻断的事件，你的脚本用退出码来告诉 Claude 该怎么办：

| 退出码 | 含义 | 使用场景 |
| --- | --- | --- |
| `0` | 通过，继续执行 | 默认选择 |
| `1` | 警告，但不阻断（Claude 照样执行） | 记录风险 |
| `2` | 拦截，阻止操作（需把原因输出到 stderr） | 安全保护 |

### 常见踩坑

⚠️ **新手最容易踩的坑**：用 `exit 1` 以为能拦截危险命令——不行，`exit 1` 只是警告，Claude 照样执行。安全类 Hook 必须用 `exit 2`。

另一个细节：`exit 2` 要把原因输出到 stderr，不是 stdout。Claude 只会读取 stderr 的内容来理解"为什么被阻断"，stdout 的内容是给用户看的（在 transcript 模式下可见）。

## 6. 四种处理器类型

### ① command（最常用）

运行 shell 命令，通过 stdin 接收 JSON：

```json
{
  "type": "command",
  "command": "python .claude/hooks/check.py",
  "timeout": 30
}
```

### ② http（2026年2月新增）

把事件 POST 到你的服务器，适合团队共享审计系统或远程验证：

```json
{
  "type": "http",
  "url": "http://localhost:8080/hooks/pre-tool-use",
  "headers": { "Authorization": "Bearer $MY_TOKEN" },
  "allowedEnvVars": ["MY_TOKEN"]
}
```

**注意**：HTTP hook 不能靠 4xx/5xx 来阻断操作——非 2xx 响应只会产生一个非阻断警告。要真正阻断，需要返回 2xx 状态码 + JSON body 里写 `decision: "deny"`。

### ③ prompt

让 Claude 本身来判断，返回 yes/no，适合语义判断：

```json
{
  "type": "prompt",
  "prompt": "判断这个 Bash 命令是否可能影响生产环境：$ARGUMENTS。如果是，返回 {\"ok\": false, \"reason\": \"...\"}",
  "timeout": 30
}
```

### ④ agent

启动一个子 Agent，可以用 Read、Grep、Glob 工具深度核查代码库，再做决策。比 prompt 更彻底，但更慢（默认超时 60s vs prompt 的 30s）：

```json
{
  "type": "agent",
  "prompt": "检查被修改的文件是否都有对应的测试文件",
  "timeout": 60
}
```

## 7. 异步 Hook（2026年1月新增）

加一个 `"async": true`，Hook 就在后台运行，不阻塞 Claude 继续工作：

```json
{
  "type": "command",
  "command": "node backup-script.js",
  "async": true,
  "timeout": 30
}
```

适合异步的场景：日志记录、桌面通知、备份——这些不需要结果，后台跑就行。

**不适合**异步的场景：安全拦截、权限审批——你需要结果才能决定"放行还是阻断"。

## 8. 进阶：JSON 输出精确控制

退出码只能说"通过/阻断"，如果想更精细地控制，可以在 stdout 输出 JSON：

### 让 PreToolUse 修改工具的输入参数

比如：把错误的命令自动纠正：

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "安全的只读操作，自动审批",
    "updatedInput": { "command": "修正后的命令" },
    "additionalContext": "给 Claude 看的额外说明"
  }
}
```

### 让 Stop Hook 强制 Claude 继续工作

比如：测试没过就不让停：

```json
{
  "decision": "block",
  "reason": "测试未通过，请先修复再结束任务。"
}
```

**控制优先级**从高到低：`"continue": false`（最终否决）→ JSON `"decision": "block"` → `exit 2`。

## 9. 实用示例（从简单到复杂）

### 示例 1：自动格式化（推荐第一个试这个）

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
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

### 示例 2：安全拦截危险命令（Python 版，更易维护）

`.claude/hooks/guard.py`：

```python
#!/usr/bin/env python3
import json, sys, re

DANGEROUS = [
    r'\brm\s+.*-[a-z]*r[a-z]*f',
    r'git\s+push\s+--force.*main',
    r'DROP\s+TABLE',
    r'chmod\s+777',
]

data = json.load(sys.stdin)
if data.get('tool_name') == 'Bash':
    cmd = data.get('tool_input', {}).get('command', '')
    for pattern in DANGEROUS:
        if re.search(pattern, cmd, re.IGNORECASE):
            print(f"被拦截：匹配到危险指令 `{pattern}`", file=sys.stderr)
            sys.exit(2)

sys.exit(0)
```

Settings.json 配置：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/guard.py"
          }
        ]
      }
    ]
  }
}
```

### 示例 3：会话开始自动注入上下文

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '## 当前 Git 状态' && git status --short && echo '## 未完成 TODO' && grep -r 'TODO:' src/ | head -5"
          }
        ]
      }
    ]
  }
}
```

`SessionStart` hook 的 stdout 会被自动注入进 Claude 的上下文，它真的会读到这些信息。

### 示例 4：任务完成前强制跑测试

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npm test 2>&1 || (echo '测试未通过，不能停止任务！' >&2 && exit 2)"
          }
        ]
      }
    ]
  }
}
```

⚠️ **防止死循环**：Stop hook 里的脚本 `exit 2` 会让 Claude 继续工作，然后再次触发 Stop hook……记得检查 `stop_hook_active` 字段：

```bash
INPUT=$(cat)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0  # 已经触发过一次了，放行
fi
npm test 2>&1 || (echo '测试未通过！' >&2 && exit 2)
```

### 示例 5：桌面通知（macOS）

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude 需要你的注意\" with title \"Claude Code\"'",
            "async": true
          }
        ]
      }
    ]
  }
}
```

### 示例 6：文件修改时自动构建

```json
{
  "hooks": {
    "FileChange": [
      {
        "matcher": "src/.*\\.(ts|tsx)$",
        "hooks": [
          {
            "type": "command",
            "command": "npm run build",
            "async": true
          }
        ]
      }
    ]
  }
}
```

### 示例 7：上下文接近满时自动压缩

```json
{
  "hooks": {
    "ContextLimitApproach": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "当前对话已接近上下文限制。应该压缩历史对话还是生成任务总结？",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### 示例 8：远程审计日志（HTTP Hook）

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "http://audit-server:8080/log",
            "headers": {
              "Authorization": "Bearer $AUDIT_TOKEN",
              "X-Project-ID": "myblog"
            },
            "allowedEnvVars": ["AUDIT_TOKEN"],
            "async": true
          }
        ]
      }
    ]
  }
}
```

## 10. 可用的环境变量

Hook 运行时，Claude Code 会自动提供一些变量：

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `CLAUDE_SESSION_ID` | 当前会话 ID | `550e8400-e29b-41d4-a716-446655440000` |
| `CLAUDE_TOOL_NAME` | 使用的工具名 | `Write`, `Bash`, `Read` |
| `CLAUDE_TOOL_INPUT_FILE_PATH` | 文件工具的路径 | `/src/main.ts` |
| `CLAUDE_TOOL_INPUT_COMMAND` | Bash 命令 | `npm run build` |
| `CLAUDE_WORKING_DIRECTORY` | 当前工作目录 | `/Users/harper_by/Documents/myblog` |
| `CLAUDE_PROJECT_ROOT` | 项目根目录 | `/Users/harper_by/Documents/myblog` |

更丰富的输入通过 stdin 传入 JSON，包含 `tool_name`、`tool_input`、`session_id` 等字段，用 `json.load(sys.stdin)` 读取。

## 11. 管理与调试

### 临时禁用所有 Hook

紧急情况下：

```bash
CLAUDE_SKIP_HOOKS=1 claude
```

### 开启调试日志

```bash
CLAUDE_DEBUG=1 claude
```

### 手动测试 Hook 脚本

不用真的触发 Claude：

```bash
echo '{"tool_name": "Bash", "tool_input": {"command": "rm -rf /"}}' | python .claude/hooks/guard.py
echo "退出码：$?"
```

## 12. 注意事项

- **同步 Hook 会阻塞 Claude**：脚本要尽量快，耗时操作加 `"async": true`
- **安全审查**：`.claude/settings.json` 会进版本控制，克隆陌生项目前先检查这个文件，就像审查源代码一样
- **脚本要有执行权限**：`chmod +x .claude/hooks/my-script.sh`
- **默认超时**：command 和 prompt hook 是 10 分钟，SessionEnd hook 是 1.5 秒（可用 `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS` 调整）

## 13. 社区资源

- [官方文档（英文）](https://code.claude.com/docs/en/hooks)
- [官方文档（中文）](https://code.claude.com/docs/zh-CN/hooks)
- [Hook 实战教程](https://github.com/disler/claude-code-hooks-mastery)
