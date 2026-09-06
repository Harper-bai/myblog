# components/
> L2 | 父级: /Users/harper_by/Documents/myblog/src/CLAUDE.md

成员清单
BaseHead.astro: 输出全站 HTML head 与 canonical/Feed 元数据，消费站点配置与页面 props。
BackToTop.astro: 提供全站右下角的低存在感回顶按钮，消费 `readingTools.backToTop` 开关并复用全局主题变量。
Button.astro: 提供统一的链接/按钮视觉壳，隔离交互入口的基础样式与属性透传。
CopyLinkButton.astro: 提供文章链接复制动作，复用 Button 并由页面级事件绑定保持跨路由可用。
EmptyState.astro: 提供无内容页面的说明与可选 CTA，复用 Button 承载回流入口。
Footer.astro: 提供全站许可证与版权归属页尾，保持导航与联系方式不进入页尾职责。
FormattedDate.astro: 将 Date 值格式化为带 datetime 属性的可访问日期节点。
Header.astro: 提供可配置的站点标题与副标题标识，标题强调色由全局主题变量注入。
Hero.astro: 将站点配置中的 hero 内容转换为主视觉、正文与行动按钮，作为备用配置驱动渲染器，不作为首页事实来源。
HomePage.astro: 编排 data/home-content 的品牌标题、中文 Markdown 正文、Blog/About 入口与默认克制的社交入口，复用 BaseLayout 形成不重复身份信息的简版首页。
IconButton.astro: 提供带图标场景的链接/按钮视觉壳，复用统一边框与主题状态。
MediaPage.astro: 编排 Media Consumption 的分类切换与双列媒体记录表，消费 data/media-content 的结构化记录。
Nav.astro: 渲染左侧头像入口、右侧主导航、GitHub 图标和主题切换，协调 NavLink 与 ThemeToggle 的页面级交互，并提供宽幅桌面导航与移动端菜单。
NavLink.astro: 根据当前 URL 注入克莱因蓝活动状态与 aria-current 语义，保持导航项的路由判断单一化。
ArchiveList.astro: 编排 Blog/Notes 共用的分类导航、年份水印与文章列表，路由只提供内容集合数据。
Pagination.astro: 渲染内容集合的前后翻页控制，消费 Astro 分页对象并复用 IconButton。
PostPreview.astro: 渲染轻量文章索引项的标题、日期、字数或预计阅读时长与置顶标识，消费内容集合条目并提供文章入口；标题层级与 `default`/`archive` 展示变体由调用方传入。
ProjectPreview.astro: 渲染项目标题、描述与项目入口，消费 projects 内容集合条目。
ReadingTools.astro: 输出文章阅读进度，基于页面事件维护带 `data-reading-root` 的文章阅读状态；全站回顶由 BackToTop 承担。
Subscribe.astro: 根据站点配置输出订阅表单，未配置 formUrl 时不产生页面节点。
ThemeToggle.astro: 提供低存在感对比度图标的明暗主题切换按钮，具体主题状态由 BaseLayout 统一维护。

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
