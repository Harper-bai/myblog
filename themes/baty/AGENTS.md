# themes/baty/
> L2 | 父级: /Users/harper_by/Projects/myblog/AGENTS.md

成员清单
theme.toml: 主题元数据与最低 Hugo 版本；样式派生自 baty.net，上游未附 LICENSE、仅 package.json 声明 ISC，许可状态见 README「许可与来源」。
AGENTS.md: 本模块地图。
archetypes/: 新内容骨架，按 posts/journal 提供 Front Matter；笔记骨架已删除。
assets/css/styles.css: 基础全站样式，包含变量、亮暗主题、`?theme=dark/light` 强制预览、卡片、搜索样式（暂时停用）与灯箱；亮色下卡片页使用浅灰 canvas 与白色卡片，普通页白底；普通页容器 826px（内容区 762px）；首页卡片容器 892px、卡片宽 828px，保留原版 22px 标题与 18px/1.7、68ch 正文；Journal 卡片容器 892px（内文 762px），中文卡片标题 33.6px 宋体；Posts 归档列表采用 22.4px/1.6 与 762px 栏宽；暗色下 canvas 更深；西文字体使用系统字体栈，后接中文回退字体栈。中文正文覆盖由 zh-reading.css 的 `.reading-zh` 提供，仅文章、普通页与 Journal 中文卡片使用。
assets/css/zh-reading.css: 内容容器中文阅读排版，作用于 `.reading-zh`（中文文章正文、中文普通页正文、Journal 中文卡片正文）；设定 22.4px 正文、762px 文字栏（文章容器 924px、普通页 826px、Journal 卡片 892px）、衬线标题、通栏分隔线；引用沿用 styles.css 原样式。中文单页与 Journal 列表加载；首页不加载；英文卡片不带 `.reading-zh`。
assets/js/search.js: /search/ 页的客户端搜索，读取 search-index.json，界面使用中文状态文案；搜索暂时停用，文件保留。
i18n/: 界面文案。zh-cn.toml 为当前站点文案，en.toml 为英文回退；两文件同步增删键。Posts/Journal 相关界面的按钮、分页与空状态键在 zh-cn.toml 中使用英文，其余键保留中文。
layouts/: Hugo 模板。baseof 设 body class，index 聚合首页内容，section 模板分派文章与日志卡片。
layouts/partials/: head/header/footer/cover/thumb/post-meta/post-card/pagination/reply-footer/lightbox/content-lang。
layouts/index.searchindex.json: home 的 JSON 搜索索引模板；SearchIndex 输出暂时停用。
static/img/: 主题默认头像与 favicon。站点级 `static/img/` 覆盖头像 WebP、favicon 与 PWA 图标；站点内容图片在根 `static/images/`。
static/site.webmanifest: PWA 元数据。

## 依赖方向

layouts -> partials -> assets。CSS 与 JS 通过 Hugo Pipes 指纹化输出。模板不直接引用 static 之外的资源。

## 设计边界

主题只认 section 名 `posts`、`journal`。新增内容类型时，必须在 partials/post-card.html 与 baseof.html 的 body class 判断中登记，否则会退回文章卡片排版。
可见文案必须走 i18n；模板中不得出现硬编码的中文或英文界面文字。
Posts/Journal 的页面标题与副标题来自各自 section 的 `_index.md`；i18n 只负责按钮、分页与空状态。
首页只聚合 `posts` 与 `journal`，不渲染欢迎卡片，也不读取 `content/_index.md`。
页头 `.page-header` 在包含 `.page-subtitle` 时不画底部分隔线；无副标题的页头保留分隔线。
body 为三行网格，列轨道用 minmax(0, 1fr)；长代码行在 pre 内横向滚动，不得撑破视口。
中文阅读排版作用于 `.reading-zh`：中文文章正文、中文普通页正文与 Journal 中文卡片正文。`partials/content-lang.html` 先读 `contentLang` 参数，再用 `\p{Han}` 检测标题与正文；检测结果决定 Journal list 卡片的 `.reading-zh` / `post-card--zh` 类与标题/正文的 lang；首页卡片始终使用原版排版。zh-reading.css 在中文单页与 Journal 列表加载，首页不加载；这些类不改 `<html lang>`、界面文案或卡片数量。
`layout: page` 的中文正文、中文文章与 Journal 中文卡片共用字号、762px 栏宽、衬线标题与分隔线；页面头部保持普通页样式。Posts 归档列表在 styles.css 中单独对齐文章正文字号与栏宽；标签页与搜索保持界面字号。英文内容保持基础正文样式。
英文单篇与普通页不得加载 zh-reading.css，也不得继承中文栏宽、字号或分隔线规则；首页不加载该表；Journal 列表因可能含中文卡片而加载，英文卡片不带 `.reading-zh`，仍走基础规则。
日期显示统一为 `YYYY-MM-DD`；标签在文章元信息、标签云与标签页标题中统一显示为小写 `#tag`。
笔记功能已移除：不得恢复 `layouts/notes/`、`archetypes/notes.md`、笔记菜单或笔记卡片分支。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
