export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
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
    headerNavLinks?: Link[];
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
    description: 'I write cause I live, I live cause I write.',
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
            text: '全部',
            href: '/blog'
        },
        {
            text: '周刊',
            href: '/tags/weekly'
        },
        {
            text: '技术',
            href: '/tags/tech'
        },
        //{
        //    text: 'Notes',
        //    href: '/notes'
        //},
        //{
        //    text: 'Diary',
        //    href: '/diary'
        //},
        {
            text: '关于',
            href: '/about'
        },
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
            text: 'Telegram',
            href: 'https://t.me/HarperBai'
        },
        {
            text: 'X/Twitter',
            href: 'https://x.com/HarperBai02'
        }
    ],
    hero: {
        title: '',
        text: '你好，这里是Harper的个人博客，我在试图理解自己，更好生活。',
        //image: {
        //    src: '/hero.jpeg',
        //    alt: 'A person sitting at a desk in front of a computer'
        //},
        actions: [
            {
                text: 'All Posts',
                href: '/blog'
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
