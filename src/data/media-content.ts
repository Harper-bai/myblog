/**
 * [INPUT]: 仅承载 Harper 已记录的书籍、电影、动漫、电视剧与纪录片条目
 * [OUTPUT]: 对外提供 MediaType、MediaItem、MediaCategory 类型与 mediaContent 单一数据源
 * [POS]: data 的 Media Consumption 内容源；页面只负责分类切换与记录呈现，不在组件内维护条目
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export type MediaType = 'book' | 'movie' | 'anime' | 'series' | 'documentary';

export type MediaItem = {
    title: string;
    creator?: string;
};

export type MediaCategory = {
    id: MediaType;
    label: string;
    items: MediaItem[];
};

const mediaContent = {
    title: 'Media Consumption',
    description: 'Books, films, anime, series, and documentaries I have enjoyed.',
    note: 'These are records of things I have read or watched. Not exhaustive, and not necessarily recommendations.',
    categories: [
        {
            id: 'book',
            label: 'book',
            items: [
                { title: '《投资中，我相信的事》', creator: '孟岩' },
                { title: '《鱼不存在》', creator: '露露·米勒' },
                { title: '《小王子的领悟》', creator: '周保松' },
                { title: '《李飞飞自传：我看见的世界》', creator: '李飞飞' }
            ]
        },
        {
            id: 'movie',
            label: 'movie',
            items: []
        },
        {
            id: 'series',
            label: 'series',
            items: []
        },
        {
            id: 'anime',
            label: 'anime',
            items: []
        },
        {
            id: 'documentary',
            label: 'documentary',
            items: []
        }
    ] satisfies MediaCategory[]
};

export default mediaContent;
