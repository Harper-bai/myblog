import { type CollectionEntry, getCollection } from 'astro:content';
import { getEstimatedWordCount, slugify } from './common-utils';

type ContentCollection = 'blog' | 'projects' | 'notes' | 'diary';

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

export function getAllTags(posts: CollectionEntry<'blog' | 'notes' | 'diary'>[]) {
    const tags: string[] = [...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean))];
    return tags
        .map((tag) => {
            return {
                name: tag,
                id: slugify(tag)
            };
        })
        .filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
        });
}

export function getPostsByTag(posts: CollectionEntry<'blog' | 'notes' | 'diary'>[], tagId: string) {
    const filteredPosts = posts.filter((post) => {
        const postTagIds = (post.data.tags || []).map((tag) => slugify(tag));
        return postTagIds.includes(tagId);
    });
    return filteredPosts;
}
