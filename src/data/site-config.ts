/**
 * [INPUT]: 不依赖运行时服务，仅承载站点身份与导航配置
 * [OUTPUT]: 对外提供 SiteConfig 类型与全站 siteConfig 单一配置对象
 * [POS]: data 的全站配置源，被导航、页脚、首页外壳与布局共同消费；首页正文由 home-content 提供
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type NavigationLink = Link & {
    disabled?: boolean;
};

export type Hero = {
    title?: string;
    text?: string;
    textZh?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    website: string;
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: NavigationLink[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    readingTools?: {
        progressBar?: boolean;
        backToTop?: boolean;
    };
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    website: 'https://harp83.us.kg',
    title: 'Harp83',
    // subtitle: 'A Thinker, Writer, and Learner',
    description: "Harper Bai's personal website about SEO/GEO, content systems, and AI-native workflows.",
    // image: {
    //     src: '/dante-preview.jpg',
    //     alt: 'Dante - Astro.js and Tailwind CSS theme'
    // },
    headerNavLinks: [
        //{
        //    text: 'Home',
        //    href: '/'
        //},
        //{
        //    text: 'Projects',
        //    href: '/projects'
        //},
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Media',
            href: '/media'
        },
        {
            text: 'Projects',
            href: '/projects',
            disabled: true
        },
        {
            text: 'About',
            href: '/about'
        }
        //{
        //    text: 'Notes',
        //    href: '/notes'
        //},
        //{
        //    text: 'Diary',
        //    href: '/diary'
        //},
    ],
    footerNavLinks: [
        // {
        //     text: 'Terms',
        //     href: '/terms'
        // },
        //{
        //    text: 'Download theme',
        //    href: 'https://github.com/JustGoodUI/dante-astro-theme'
        //}
    ],
    socialLinks: [
        {
            text: 'Github',
            href: 'https://github.com/Harper-bai'
        },
        {
            text: 'Jike',
            href: 'https://web.okjike.com/u/1fd1142d-6d5b-4035-a112-194890e42f61'
        },
        {
            text: 'Email',
            href: 'mailto:h7451392@gmail.com'
        }
    ],
    hero: {
        title: 'Harper Bai',
        text: 'I’m exploring how content, search, and AI-native workflows can turn ideas into measurable growth experiments.',
        textZh: '你好，我是 Harper。我正在探索如何用内容、搜索和 AI 原生工作流，把想法变成可验证的增长实验。',
        //image: {
        //    src: '/hero.jpeg',
        //    alt: 'A person sitting at a desk in front of a computer'
        //},
        actions: [
            {
                text: 'Blog',
                href: '/blog'
            },
            {
                text: 'About',
                href: '/about'
            }
        ]
    },
    // subscribe: {
    // title: 'Subscribe to Dante Newsletter',
    // text: 'One update per week. All the latest posts directly in your inbox.',
    // formUrl: '#'
    // },
    readingTools: {
        progressBar: true,
        backToTop: true
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
