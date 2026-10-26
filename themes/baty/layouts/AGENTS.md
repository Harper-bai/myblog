# layouts/
> L2 | 父级: /Users/harper_by/Projects/myblog/themes/baty/AGENTS.md

成员清单
_default/baseof.html: HTML 骨架与 body class 判定；中文内容页追加 content-zh（single-post / single-page）。
_default/single.html: 通用单页，白底 page-header + page-body；带副标题的页头不画分隔线；中文正文容器追加 reading-zh，沿用文章阅读排版。
_default/list.html: 通用列表，页头 + 归档。
_default/terms.html: 标签云。
_default/taxonomy.html: 单个标签的归档页。
_default/search.html: 搜索页模板；搜索暂时停用，文件保留。
index.html: 首页，聚合 posts/journal 并分页；不渲染欢迎卡片；卡片保留原版排版，宽度 828px；首页不加载中文阅读表。
index.searchindex.json: 搜索索引输出模板；SearchIndex 暂时停用。
posts/list.html: 文章全量归档，按年分组；列表采用文章正文字号与 762px 栏宽。
posts/single.html: 长文阅读页；标题与正文标注内容语言；中文正文容器追加 reading-zh；`lastmod` 与 `date` 不同日时显示更新日期。
journal/list.html: Journal 分页列表；无条目时显示英文 i18n 空状态，空状态采用 22.4px/762px；中文条目卡片正文带 reading-zh。
journal/single.html: 日记阅读页；标题与正文标注内容语言；中文正文容器追加 reading-zh。
page/single.html: About、书影、NOW 等静态页面；带副标题的页头不画分隔线；中文正文容器追加 reading-zh，沿用文章阅读排版。
404.html: 404 页面。
robots.txt: 覆盖 Hugo 内置 robots.txt；输出 `Allow: /` 并声明 `sitemap.xml` 的绝对地址，因为内置版本不含 Sitemap 指令。
partials/content-lang.html: 内容语言判定；参数优先，否则检测汉字并返回 zh-CN 或 en。
partials/post-card.html: 首页/Journal 卡片；home 模式保持原版排版；Journal list 模式的中文卡片带 post-card--zh，正文容器带 reading-zh；Journal 卡片标题 33.6px 宋体。
partials/: 其余可复用片段，详见 themes/baty/AGENTS.md。

## 查找顺序

Hugo 先找项目根 layouts/，再找主题 layouts/。section 模板优先于 _default。baseof 是所有 HTML 页面的入口。

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
