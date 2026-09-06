# src/
> L2 | 父级: /Users/harper_by/Documents/myblog/CLAUDE.md

成员清单
content.config.ts: 定义博客与静态页面内容契约；`isLifeArchive` 控制公开生活档案归类，不改变文章 URL。
components/: 页面复用组件与导航、文章预览、阅读工具；`HomePage.astro` 编排中文 Markdown 首页正文，`Footer.astro` 提供轻量许可证与版权页尾。
content/blog/: Astro 博客文章集合；Weekly 原稿暂存私人档案，完成改写后再逐篇恢复公开，生活档案仍公开但退出首页内容流。
content/pages/: Astro 静态内容集合；`about.md` 按个人档案信息架构承担详细 About 页面，`terms.md` 承担法律页面，首页正文不在此重复维护。
data/: 站点身份、导航与全局设置，以及中文首页 Markdown 文案源。
icons/: 跨组件复用的 SVG 图标资源；不承载页面级交互。
layouts/: 全站 HTML、头部元数据与公共布局。
pages/: 路由入口；`/` 提供中文个人主页且只引向 Blog 与 About；`/blog` 与 `/notes` 共用参考站式年份列表壳，分别消费 Blog 与 Notes 集合；`/about` 与 `/terms` 复用内容页路由壳，About 额外对齐 Blog 的窄列与轻排版；`/media` 提供 Media Consumption 记录页；项目展示已移出本站，Projects 仅保留为导航占位，`/life` 仅展示带 `isLifeArchive` 标记的公开生活档案。
styles/: 全局主题、字体与排版样式。
utils/: 内容排序、字数统计与预计阅读时长的通用工具函数。

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
