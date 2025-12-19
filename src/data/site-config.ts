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
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    website: 'https://harp83.us.kg',
    title: "Marginalia",
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
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
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
            text: 'About',
            href: '/about'
        },
    ],
    footerNavLinks: [
        {
            text: '/CV ',
            href: 'https://baishancv.vercel.app/'
        },
        {
            text: '/Contact',
            href: '/contact'
        },
        {
            text: '/List',
            href: '/lists'
        },
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
        text: "Hi 👋 I am Harper.<br><br>" +
            "This is my personal repository for <b>curiosity and synthesis</b>.<br><br>" +
            "<b>Reading & Learning:</b> Converting new knowledge into long-term understanding.<br>" +
            "<b>Thinking:</b> Connecting the dots between books, logic, and daily life.<br>" +
            "<b>Writing:</b> Documenting the evolution of my thoughts so they don't fade away.<br><br>" +
            "<i>“Writing is the process by which we figure out what we think.”</i>",
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
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;

