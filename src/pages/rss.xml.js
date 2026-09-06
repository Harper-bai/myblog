/**
 * [INPUT]: 依赖 blog 内容集合、站点配置与日期排序工具
 * [OUTPUT]: 对外提供 `/rss.xml` 订阅源，并将文章日期标准化为 UTC 日期
 * [POS]: pages 的 RSS 输出端点；不承载页面渲染或文章内容筛选逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config.ts';
import { sortItemsByDateDesc } from '../utils/data-utils.ts';

function toRssDate(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export async function GET(context) {
    const posts = (await getCollection('blog')).sort(sortItemsByDateDesc);
    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        items: posts.map((item) => ({
            title: item.data.title,
            description: item.data.excerpt,
            link: `/blog/${item.id}/`,
            pubDate: toRssDate(item.data.publishDate)
        }))
    });
}
