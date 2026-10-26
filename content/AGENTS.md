# content/
> L2 | 父级: /Users/harper_by/Projects/myblog/AGENTS.md

成员清单
about.md: About 页。`layout: page`；正文从 `## 关于我` 开始，依次介绍 Harper、loose page 与「其他一些界面」；`cover` 指向 `/images/about.jpeg`，只用于 OpenGraph。「其他一些界面」列出 Lifestack、Media、Changelog；Lifestack 尚未建页，Media 与 Changelog 已链接。
media.md: Media 页（书影）。`layout: page`；当前不在主导航；按年份列出 23 本书，并列出 21 部动画、5 部美剧与 5 部纪录片。正文沿用中文文章阅读排版。
changelog.md: Changelog 页。`layout: page`；当前不在主导航；记录 2024-09-10 至 2026-10-26 的站点迁移。正文沿用中文文章阅读排版。
now.md: Now 页。当前隐藏：`build.render: never` 与 `build.list: never`；英文副标题与导语保留；不再出现在导航、About 或站点输出中。恢复时移除 `build`，并恢复菜单与 About 入口。
posts/: 11 篇文章。文件名是英文 slug；每篇使用 `title`、`date` 与可选 `description`；可选 `lastmod` 用于单篇更新日期。当前文件：`2024-08.md`、`2024-summary.md`、`2025-summary.md`、`about-blog.md`、`investing-fundamentals.md`、`quantum-uncertainty.md`、`raycast-notes.md`、`self-handicapping.md`、`the-fish-doesnt-exist.md`、`the-little-prince-about-love.md`、`the-word-i-see.md`。
posts/_index.md: Posts 列表页标题 `Posts` 与副标题 `All posts, in one place.`；归档列表采用文章正文的字号与 762px 栏宽。
journal/: Journal section。主导航显示 `JOURNAL`；当前仅保留 `_index.md`，没有条目。新增 `*.md` 即出现在 `/journal/`；空列表显示 i18n 文案 `No journal entries yet.`，空状态采用 22.4px/762px；中文条目卡片正文通过 `.reading-zh` 套用阅读排版。
journal/_index.md: Journal 列表页标题 `Journal` 与副标题 `Daily entries. One a day. Most days.`。
tags/_index.md: Tags 总览页标题 `Tags` 与副标题 `All tags.`。当前有 11 个标签词条，命名规范见 README。

## 内容约定

- 文章来自旧站 `Harper-bai/myblog` 与 `2026-08-29` 博客快照，当前 11 篇。标题、正文与链接保持原文；日期已转为 ISO 8601，并统一带 `+08:00`。10 篇保留旧站文章各带 `aliases`，指向迁移前的 `/blog/<id>/` 地址；改文件名或 permalink 时不要删除 `aliases`。
- 可选 `lastmod` 使用 ISO 8601 与 `+08:00`；仅当它与 `date` 不同日时，单篇标题下显示 `更新于 YYYY-MM-DD`。`about-blog.md` 正文已有 2024-10-15 更新，Front Matter 已同步该日期。
- 文件名使用英文 slug；文章地址由 `hugo.toml` 的 permalink 生成：`/posts/YYYY/MM/<文件名>/`。不要随意改文件名，否则旧链接失效。
- 长文在第一段后放 `<!--more-->`；首页卡片读取摘要。`2024-summary.md` 在开篇段后放置分隔符。
- `posts/2024-08.md` 的正文以月度清单开头，`<!--more-->` 放在「一句话总结 / 躺平但在不断翻腾。」之后，让首页卡片保留清单与总结句。
- 当前 11 篇文章均已打标签；标签统一小写英文，每篇 1–2 个，周期回顾使用 `review`。受控词表与规则见 README「标签命名规范」；不得创建同义标签或时间标签。
- 主导航为 `POSTS / JOURNAL / ABOUT / RSS`；`书影` 与 `Changelog` 页面保留但不在主导航；`Now` 页面隐藏。界面页标题统一为英文 Title Case（Posts / Journal / About / Media / Changelog / Tags / Not Found）；Posts/Journal 相关界面文案为英文，其余正文文案以中文为主。
- 原文没有内嵌图片；外部链接保持原样。新增图片放入 `static/images/`，正文用 Markdown 图片语法与 `/images/...` 路径；卡片图可用 `cover` 或 `thumb`。
- 中文内容自动检测；文章与 `layout: page` 页面按内容语言加载中文阅读排版，Journal 列表按栏目加载，Journal 中文卡片按内容语言加 `.reading-zh`。文章、普通页与 Journal 中文卡片共用字号、栏宽、标题与分隔线；首页卡片保留原版排版。若文章含中文标题但正文为英文，或英文正文出现汉字引用，用 `contentLang` 强制语言；字段只影响阅读排版。
- 文章标题由模板输出唯一 H1；正文 Markdown 标题从 `##` 开始，层级连续，文内不写 `#` 标题。
- About、书影与 Changelog 使用 `layout: page`，进入白底普通页面布局；中文正文沿用中文文章阅读排版（22.4px/1.6、762px 栏宽、衬线标题），页面头部保持普通页样式。英文页面保持基础正文样式。Posts 归档列表在 `styles.css` 中单独采用 22.4px/1.6 与 762px 栏宽。公开部署前确认所有文字与图片可公开。
- 首页卡片保留原版排版：标题 22px、正文 18px/1.7 与 68ch；只把卡片宽度改为 828px（容器 892px）。
- Journal 的中文卡片标题 33.6px 宋体，正文通过 `.reading-zh` 采用 22.4px/1.6 与 762px 栏宽；卡片容器 892px，内边距 32px；Journal 空状态同为 22.4px/762px。
- 旧站 `terms.md` 是 Dante 模板占位文本，未迁入。旧站 `notes/` 为空；笔记功能与内容已从本站移除。
- 首页不渲染欢迎卡片，只聚合 `posts` 与 `journal`；`content/_index.md` 已删除。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
