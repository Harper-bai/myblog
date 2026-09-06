/**
 * [INPUT]: 依赖 Astro Content Collections 与正文阅读时长工具
 * [OUTPUT]: 对外提供内容排序、集合计数与博客总字数聚合函数
 * [POS]: utils 的内容数据层；被列表、RSS 与布局消费，不反向依赖页面组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { type CollectionEntry, getCollection } from 'astro:content';
import { getEstimatedWordCount } from './common-utils';

type ContentCollection = 'blog' | 'projects' | 'notes';

export function sortItemsByDateDesc(itemA: CollectionEntry<ContentCollection>, itemB: CollectionEntry<ContentCollection>) {
    return new Date(itemB.data.publishDate).getTime() - new Date(itemA.data.publishDate).getTime();
}

export async function getCollectionItemCount(collection: ContentCollection) {
    try {
        return (await getCollection(collection)).length;
    } catch {
        return 0;
    }
}

export async function getBlogTotalWordCount() {
    try {
        const posts = await getCollection('blog');
        return posts.reduce((sum, post) => sum + getEstimatedWordCount(post.body), 0);
    } catch {
        return 0;
    }
}
