# src/
> L2 | 父级: /CLAUDE.md

成员清单
pages/[...id].astro: 渲染 pages 内容集合中的静态页面（如 about、terms）。
pages/blog/[...page].astro: 全部博客归档页，按年份分组展示。
pages/blog/[id].astro: 博客文章详情页。
pages/index.astro: 首页入口，展示精选与最新内容。
pages/rss.xml.js: 博客 RSS 生成入口。
pages/tags/index.astro: 标签总览页。
pages/tags/[id]/[...page].astro: 标签筛选后的文章列表页。
pages/weekly/[...page].astro: 周刊独立分页页面，按 weekly 标签筛选。
pages/tech/[...page].astro: 技术独立分页页面，按 tech 标签筛选。
pages/life/[...page].astro: 生活志独立分页页面，按 life 标签筛选。

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
