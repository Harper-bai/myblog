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
    website: 'https://example.com',
    title: ' ',
    // subtitle: 'A Thinker, Writer, and Learner',
    description: 'A personal blog and portfolio site built with Astro.js and Tailwind CSS',
    // image: {
    //     src: '/dante-preview.jpg',
    //     alt: 'Dante - Astro.js and Tailwind CSS theme'
    // },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        //{
        //    text: 'Projects',
        //    href: '/projects'
        //},
        {
            text: 'Blog',
            href: '/blog'
        },
        //{
        //    text: 'Tags',
        //    href: '/tags'
        //}
        {
            text: 'Notes',
            href: '/notes'
        },
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
        //{
        //    text: 'Terms',
        //    href: '/terms'
        //},
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
        title: 'Welcome to My Corner of the Web!',
        text: "Hi👋 I am Harper.<br>I am a passionate learner.<br> I am learning JavaScript! <br>I am also a experienced thinker and writer.<br>I am glad to share with my life & my opinion & my notes here.",
        //image: {
        //    src: '/hero.jpeg',
        //    alt: 'A person sitting at a desk in front of a computer'
        //},
        //actions: [
        //    {
        //        text: 'Get in Touch',
        //        href: '/contact'
        //    }
        //]
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
