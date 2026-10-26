# loose page — Harper 的 Hugo 博客

`loose page` 是 Harper 的个人博客，使用 Hugo 与自定义 `baty` 主题构建。界面以简体中文为主；所有界面页标题统一为英文 Title Case；导航标签保持全大写。Posts/Journal 相关界面使用英文，About 保留英文副标题；Now 页面暂时隐藏。站点位于 `Harper-bai/myblog` 仓库，2026-10-26 由 Astro 原地迁移为 Hugo；当前包含 11 篇文章、About 页、Media 页（书影）、Now 页（隐藏）与 Changelog 页。

主题保留卡片列表、日志、标签归档、深色模式、分页、灯箱与中文正文排版。`笔记` 内容类型已移除，搜索暂时停用。

## 环境要求

- Hugo **0.128+**（无需 extended）
- 除 `hugo` 外不需要 Node.js，也没有额外构建步骤

## 运行

```bash
hugo server
```

打开 <http://localhost:1313/>。

临时预览主题：在 URL 后加 `?theme=dark` 或 `?theme=light`，可覆盖系统外观。参数不写入本地存储；刷新保留，跳到站内其他页面后恢复系统设置。

构建：

```bash
hugo --minify --cleanDestinationDir --logLevel warn
```

## 目录结构

```text
hugo.toml                 站点配置：身份、菜单、永久链接、分页、OpenGraph
content/
  posts/                  11 篇文章
  journal/                Journal section；功能保留，当前没有条目
  tags/                   标签总览页；当前 11 个词条，规范见下
  about.md                About 页
  media.md                Media 页（书影）；当前不在主导航
  now.md                  Now 页；暂时隐藏（`build.render: never`）
  changelog.md            Changelog 页；站点变迁记录，当前不在主导航
static/
  images/                 关于页照片、旧版博客快照
  img/                    favicon、PWA 图标、头像 WebP（覆盖主题默认图标）
themes/baty/
  assets/css/styles.css   基础全站视觉系统
  assets/css/zh-reading.css 内容容器中文阅读排版（中文单页与 Journal 列表条件加载）
  assets/js/search.js     搜索界面（暂时停用，保留）
  i18n/                   界面文案：zh-cn.toml 为主，en.toml 为回退
  layouts/                模板
  static/img/             主题默认头像与图标
```

## 内容模型

### 文章

```yaml
---
title: "2024年、22岁：溺水的一年"
date: 2024-12-29T00:00:00+08:00
tags: ["life", "review"]                  # 受控词表，见标签命名规范
lastmod: 2025-01-02T00:00:00+08:00        # 可选，文章更新日期
description: "一篇年度回顾。"  # 可选
cover: "/images/example.webp"                  # 可选，通栏封面
coverAlt: "图片说明"
coverCaption: "图注"                            # 可选
thumb: "/images/thumb.png"                      # 可选，卡片右浮动小图
---
开头段落。

<!--more-->

正文其余部分。
```

- 日期使用 ISO 8601 并带 `+08:00`；显示统一为 `YYYY-MM-DD`。
- 文章可选 `lastmod`；仅当它与 `date` 不同日时，单篇文章标题下显示 `更新于 YYYY-MM-DD`。Hugo 未启用 git 信息读取，需手动维护该字段。
- 文章可选 `aliases`；用于承接迁移前的旧地址。当前 10 篇文章各有一条 `/blog/<旧 id>/` 别名，`content/posts/_index.md` 承接 `/blog/`。
- 文章标题由模板输出唯一 H1；正文 Markdown 标题从 `##` 开始，层级连续，文内不写 `#` 标题。
- 长文在第一段后放 `<!--more-->`；没有分隔符的短文在首页全文显示。
- 所有文章都使用受控词表打标签；标签显示统一为小写 `#tag`。
- 图片放在 `static/images/`，正文用 `/images/文件名` 引用。

### 标签命名规范

- 只使用小写 ASCII 英文；多个单词用连字符。
- 每篇 1–2 个标签，最多 3 个；标签描述主题或内容类型，不记录年份、月份、书名、平台或情绪。
- 年度、月度等周期回顾统一使用 `review`；不要创建年份、月份等时间标签。
- 标签显示为小写 `#tag`；标签页地址为 `/tags/<tag>/`。
- 新标签必须先加入受控词表；不得创建同义词、近义词或单复数变体，例如已有 `reading` 就不再用 `book`，已有 `tools` 就不再用 `tool`。

受控词表：

| 标签 | 用途 |
| --- | --- |
| `reading` | 读书笔记与阅读感悟 |
| `life` | 个人生活记录与阶段回顾 |
| `review` | 年度、月度等周期性总结 |
| `science` | 科学、物理、人工智能等知识主题 |
| `philosophy` | 哲学、意义与不确定性等思辨主题 |
| `tools` | 软件、硬件与效率工具 |
| `productivity` | 工作流、笔记法与效率方法 |
| `psychology` | 心态、行为与心理机制 |
| `investing` | 投资、资产配置与理财 |
| `love` | 亲密关系与爱 |
| `blog` | 博客写作、建站与内容运营 |

### 日志

Journal 模板与 `/journal/` 页面保留，当前没有条目；主导航仍显示 `JOURNAL`，列表页显示英文空状态。新增 `content/journal/*.md` 即可显示，无需修改菜单。

```yaml
---
title: "2026-10-18"
date: 2026-10-18T18:00:00+08:00
cover: "/images/example.webp"
coverAlt: "图片说明"
---
正文。
```

### 页面

- `about.md`：About 页，`layout: page`；正文从「关于我」开始，介绍个人、loose page 与「其他一些界面」。
- `media.md`：Media 页（书影），`layout: page`；按年份列出书单，并分组列出动画、美剧与纪录片；当前不在主导航。
- `now.md`：Now 页，`layout: page`；当前隐藏，`build.render: never` 与 `build.list: never`；内容保留，暂不输出页面。
- `changelog.md`：Changelog 页，`layout: page`；记录站点从 MkDocs 到 Hugo、Astro 再回到 Hugo 的变迁；当前不在主导航。
- Lifestack 已在 About 的「其他一些界面」列出，但页面尚未创建。

## 用 Obsidian 写作

`content/templates/` 存放 Obsidian 模板，产出与 Hugo archetype 相同的 Front Matter。

1. 在 Obsidian 中以本仓库的 `content/` 目录为 vault 打开。
2. 设置 → 核心插件 → 模板 → 模板文件夹设为 `templates`。
3. 新建笔记 → 命令面板 `模板：插入模板` → 选 `post` 或 `journal`，再填 `title`。
4. 文章存入 `posts/`，日志存入 `journal/`。

`post.md` 已含 `+08:00` 日期、`tags` 与可选字段注释；`journal.md` 自动生成日期标题与 `/journal/DMMMYY/` 永久链接。模板只补 Front Matter，不创建目录，`hugo new content posts/名字.md` 仍是等价通道。

注意：

- `hugo.toml` 的 `ignoreFiles` 排除 `content/templates/`，模板不会生成 `/templates/` 页面。
- 模板与 `themes/baty/archetypes/` 各存一份；字段变更时同时修改两处。
- Obsidian 不渲染 Hugo shortcode 与 `<!--more-->`。写作时照写，构建时生效。
- 站内链接用标准 Markdown 语法 `[文字](/posts/...)`，不要用 `[[wikilink]]`。

## 站点身份

- 站名：`loose page`
- 作者：Harper
- 邮箱：`heyharper@smailr.com`
- 域名：`https://harp83.us.kg/`
- 头像：`/img/avatar-harper.png`；同路径 WebP 优先，PNG 回退
- OpenGraph 默认图：`/images/about.jpeg`（1200×800）

主导航为 `POSTS / JOURNAL / ABOUT / RSS`。`JOURNAL` 当前无条目，页面显示英文空状态；`书影` 与 `Changelog` 页面保留但不进入主导航；`Now` 页面暂时隐藏。界面页标题统一为英文 Title Case：Posts / Journal / About / Media / Changelog / Tags / Not Found；导航标签保持全大写。Posts/Journal 的卡片按钮、分页与空状态为英文；About 保留英文副标题，其余正文文案以中文为主。社交链接暂未配置；页脚保留邮件与 RSS 入口。

## 搜索

搜索在站点层暂时停用：导航和页脚入口已移除，`content/search.md` 已删除，`home` 输出不含 `SearchIndex`。

以下文件保留，恢复时使用：

- `hugo.toml` 的 `[outputFormats.SearchIndex]`
- `themes/baty/layouts/index.searchindex.json`
- `themes/baty/layouts/_default/search.html`
- `themes/baty/assets/js/search.js`

恢复步骤：把 `SearchIndex` 加回 `[outputs] home`，重建 `content/search.md`，再恢复导航或页脚入口。

## 迁移说明

- 本站即 `https://github.com/Harper-bai/myblog`。2026-10-26 由 Astro 5 原地迁移为 Hugo：`src/`、`astro.config.mjs`、`package.json` 与依赖锁文件已移除，`public/` 静态资源目录让位给 Hugo 的输出目录。
- 旧站 14 篇 `src/content/blog/*.md` 中保留 10 篇，转为 Hugo 文章并改用英文 slug 与 ISO 日期；另从 `2026-08-29` 博客快照补入 `2024-summary.md`，当前 11 篇。旧站独有的 4 篇（`2025-first-half`、`2026target`、`ai-from-zero`、`joy_dividend`）未迁入。
- 旧站 10 篇保留文章的地址由 `/blog/<id>/` 改为 `/posts/YYYY/MM/<slug>/`；每篇 Front Matter 的 `aliases` 承接旧地址，`/blog/` 由 `content/posts/_index.md` 承接。旧站的 `/life/`、`/notes/`、`/terms/`、`/rss.xml`、`/sitemap-index.xml` 没有对应地址。
- 旧站 `src/content/pages/about.md` 的文案未沿用；`content/about.md` 已重写为「关于我 / 关于 loose page / 其他一些界面」，不再引用旧站快照。
- 旧站 `src/data/home-content.ts` 的首页独白未迁入；首页改为文章卡片流，不再渲染欢迎卡片。
- 旧站 `src/data/media-content.ts` 迁移为 `content/media.md`；页面保留，当前不在主导航。
- `content/now.md` 暂时隐藏：不在导航与 About 中出现，`build.render: never` 阻止生成 `/now/`；内容保留。
- 旧站的 `terms.md` 是 Dante 模板占位文本，未迁入。
- 旧站文章没有标签、没有内嵌图片；当前 11 篇文章均已按受控词表补标签，外链保持原样。
- 旧站的阅读目录、阅读进度条、回到顶部、复制链接、订阅块、主题切换持久化与 `/life/` 归档未迁入；Hugo 侧新增标签体系、Journal、灯箱与分页。
- baty.net 演示文章、日志、笔记与演示照片已移除。
- `笔记` 的模板、archetype、CSS、i18n 与配置入口已删除；`journal` 功能保留。

## 设计与排版

- 首页混合 `posts` 与 `journal`，按日期倒序分页；不渲染欢迎卡片。
- 首页与单篇使用卡片布局；About、书影、Changelog 与列表页使用白底普通页面布局。亮色下卡片页使用浅灰 canvas 与白色卡片；暗色下 canvas 更深。
- 中文文章、中文普通页面与 Journal 的中文卡片正文使用 `zh-reading.css` 的 `.reading-zh`：22.4px/1.6、约 34 字栏宽、宋体标题、`text-autospace` 与细线分隔；中文文章容器 924px、普通页 826px、Journal 卡片容器 892px，三者的内容区均为 762px。中文单页按内容语言加载该表，Journal 列表按栏目加载，Journal 卡片按内容语言加 `.reading-zh`；普通页保留自己的页头与白底布局。
- 首页卡片保留原版排版：标题 22px、正文 18px/1.7 与 68ch；只把卡片宽度改为 828px（容器 892px）。
- Journal 的中文卡片标题为 33.6px 宋体，与文章 H1 同级；卡片正文通过 `.reading-zh` 套用阅读排版。Journal 无条目时的空状态为 22.4px/762px。
- Posts 归档列表在 `styles.css` 中单独采用 22.4px/1.6 与 762px 栏宽，日期为 17.92px；年份标签保持界面字号。
- 英文内容保持 18px/1.7 与 68ch；标签页与搜索不套用中文阅读排版。
- 全站使用本机系统字体栈（SF Pro / Segoe UI / Noto Sans 等），不加载 Google Fonts；中文回退 PingFang SC、微软雅黑、Noto Sans SC。
- Front Matter `contentLang: en` 或 `contentLang: zh-CN` 可强制内容语言；它不影响 `<html lang>` 与界面文案。

## 许可与来源

本主题的样式派生自 baty.net，不使用 MIT 许可。

- 上游仓库：`https://github.com/jackbaty/baty.net`。
- 来源文件：`src/styles.css`。本仓库的 `themes/baty/assets/css/styles.css` 在其基础上修改。
- 上游未附 LICENSE 文件；GitHub 将该仓库识别为无许可证。`package.json` 仅声明 `"license": "ISC"`，没有许可正文与版权人署名。
- ISC 是宽松许可，要求保留版权与许可声明。若该声明不被视为有效授权，则上游代码默认版权保留。
- 旧主题 `hugo-PaperMod-baty` 的 MIT 许可不适用于本主题：本主题来自 2026 年 4 月后的 Eleventy 版样式，不是 PaperMod 分支。
- 本仓库的修改包括系统字体栈、中文阅读排版、卡片宽度、模板、脚本与界面文案。
- 公开部署前应向 Jack Baty 取得明确许可，或重写基础样式。
- 博客文字与图片版权归 Harper 所有；站点即 `Harper-bai/myblog` 仓库本身。
- 仓库根目录的 `LICENSE` 仍是迁移前 Dante 主题带来的 GPL-3.0。迁移后站点已不含该主题代码，该文件的适用范围待重新确认。
