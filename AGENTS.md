# myblog — loose page：Harper 的个人 Hugo 博客

Hugo 0.167 + 原生 CSS + 原生 JS + Hugo Pipes。站点把 baty.net 的版式、配色、卡片与交互复刻为可复用主题，并承载 Harper 从旧 Astro 站点原地迁移的内容。站名 `loose page`，作者 Harper，邮箱 `heyharper@smailr.com`，域名 `https://harp83.us.kg/`。界面以简体中文为主；所有界面页标题统一为英文 Title Case；导航标签保持全大写；Posts/Journal 相关界面使用英文；About 保留英文副标题；Now 页面暂时隐藏。

<directory>
content/ - 站点内容：11 篇文章、关于页、书影页、NOW 页（暂时隐藏）与 Changelog 页；日志 section 保留但当前为空 (4子目录: posts, journal, tags, templates)
static/ - 站点级静态资源：`images/` 存关于页照片与旧版快照，`img/` 覆盖主题 favicon 与 PWA 图标 (2子目录: images, img)
themes/baty/ - 主题本体：布局、样式、脚本、界面文案与主题默认图片 (5子目录: assets, i18n, layouts, static, archetypes)
</directory>

<config>
hugo.toml - 站点配置：身份、菜单、永久链接、分页、OpenGraph；SearchIndex 输出暂时停用
README.md - 运行方式、目录说明、内容模型、迁移记录与搜索恢复步骤
AGENTS.md - 本文件，L1 项目地图
</config>

## 核心约定

- 写作入口有两个：`hugo new content posts/<slug>.md` 使用 `themes/baty/archetypes/`；Obsidian 使用 `content/templates/`。两处 Front Matter 字段必须一致，日期均带 `+08:00`。`ignoreFiles` 排除 `content/templates/`，模板不生成页面。
- 站点即 `Harper-bai/myblog` 仓库，2026-10-26 由 Astro 5 原地迁移为 Hugo：`src/`、`astro.config.mjs`、`package.json` 与依赖锁文件已删除，`public/` 不再是静态资源目录，而是 Hugo 输出目录并被 `.gitignore` 排除。当前 11 篇文章，来自旧站保留的 10 篇与 `2026-08-29` 博客快照的 `2024-summary`；旧站独有的 4 篇未迁入。旧站 10 篇的地址由 `/blog/<id>/` 改为 `/posts/YYYY/MM/<slug>/`，每篇用 Front Matter `aliases` 承接旧地址，`/blog/` 由 `content/posts/_index.md` 承接；`/life/`、`/notes/`、`/terms/`、`/rss.xml`、`/sitemap-index.xml` 无对应地址。旧站 `terms.md` 是模板占位，未迁入；旧站文章的标签、内嵌图片原本为空，外链保持原样。当前所有文章按受控词表打标签，周期回顾统一使用 `review`。
- 首页按日期倒序混合 `posts` 与 `journal`，不再渲染欢迎卡片。`posts` 显示标题条与摘要，`journal` 显示日期标题与全文。`notes` 分支已从模板、CSS 与 archetypes 删除。
- 首页与单篇使用卡片布局；About、书影、Changelog 与列表页使用白底普通页面布局。About、书影等中文普通页面的正文沿用文章阅读排版；Journal 的中文卡片正文通过 `.reading-zh` 套用同一排版；首页卡片保留原版排版；Posts 归档列表采用相同字号与栏宽；页面头部保持普通页样式。亮色下卡片页使用浅灰 canvas 与白色卡片；暗色下 canvas 更深。差异只由 section 与 body class 控制。
- 中文文章、中文普通页面与 Journal 的中文卡片正文使用 `zh-reading.css` 的 `.reading-zh`：22.4px/1.6、约 34 字栏宽、宋体标题、text-autospace、tabular nums 与细线分隔；中文单页按内容语言加载，Journal 列表按栏目加载，Journal 卡片按内容语言加 `.reading-zh`。英文内容保持 18px/1.7 与 68ch；标签页与搜索页不套用。
- Posts 归档列表在 `styles.css` 中单独采用 22.4px/1.6 与 762px 栏宽；日期 17.92px，年份标签保持界面字号。首页卡片容器 892px，卡片宽 828px，保留原版 22px 标题与 18px/1.7、68ch 正文；Journal 卡片容器为 892px（卡片内文 762px），中文卡片标题 33.6px 宋体；Journal 空状态同为 22.4px/762px。
- 内容语言默认按标题或正文中的汉字检测；Front Matter `contentLang` 可强制 `en` 或 `zh-CN`。语言标注只改标题与正文的 `lang`，`<html lang>` 仍由界面语言决定。
- 日期使用 ISO 8601 并带 `+08:00`，显示统一为 `YYYY-MM-DD`；文章可选 `lastmod`，仅当与 `date` 不同日时在单篇元信息显示 `更新于 YYYY-MM-DD`。标签在文章元信息、标签云与标签页标题中统一显示为小写 `#tag`；当前 11 个词条：`reading`、`life`、`review`、`science`、`philosophy`、`tools`、`productivity`、`psychology`、`investing`、`love`、`blog`。命名规范见 README。
- 文章标题由模板输出唯一 H1；正文 Markdown 标题从 `##` 开始，层级连续，文内不得出现 `#` 标题。
- 主导航为 `POSTS / JOURNAL / ABOUT / RSS`。`JOURNAL` 当前没有条目，直接访问 `/journal/` 时显示英文空状态；`书影` 与 `Changelog` 页面保留但不进入主导航。`Now` 页面暂时隐藏：内容保留在 `content/now.md`，Front Matter 使用 `build.render: never` 与 `build.list: never`；恢复时移除 `build`，并恢复菜单与 About 入口。笔记功能已移除，不得恢复旧模板或菜单入口。
- 搜索暂时停用：导航与页脚入口已移除，`content/search.md` 已删除，SearchIndex 输出关闭。搜索模板、索引模板与 `search.js` 保留，恢复步骤见 README。
- 图片与灯箱不依赖第三方 JS 框架；全站使用系统字体栈（SF Pro / Segoe UI / Noto Sans 等），不加载外部字体；中文回退 PingFang SC、微软雅黑、Noto Sans SC。头像优先加载 WebP，PNG 回退。
- 站点图片放在 `static/images/`，正文用 `/images/...`；favicon 与 PWA 图标放在 `static/img/`，覆盖主题默认图标。OpenGraph 默认图使用 `/images/about.jpeg`（1200×800）。
- 可见文案集中管理：菜单名在 `hugo.toml`，界面页头在各自内容文件或 i18n；模板不写死可见文案。页面 H1 统一为英文 Title Case；Posts/Journal 相关界面的按钮、分页与空状态使用英文 i18n 值，其余正文文案以中文为主。
- 演示文章、日志、笔记与 baty.net 照片已移除。公开部署前请确认所有文字与图片均为 Harper 自有内容。
- 主题样式派生自 baty.net 的 `src/styles.css`；上游未附 LICENSE，仅 `package.json` 声明 ISC。README「许可与来源」记录衍生关系与授权状态；不得改称 MIT，也不得套用旧 PaperMod 分支的 MIT 许可。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
