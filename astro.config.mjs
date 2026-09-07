/**
 * [INPUT]: 依赖 Astro、MDX、Sitemap 与 Tailwind 构建插件，以及站点地址配置
 * [OUTPUT]: 对外提供站点构建配置与 Markdown 静态图片属性处理器
 * [POS]: 项目根级构建边界；统一处理集成、样式编译与内容图片布局稳定性，不承载页面业务
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import siteConfig from './src/data/site-config';

// -----------------------------------------------------------------------------
// Markdown 图片契约：在构建阶段补充固有尺寸与懒加载属性。
// 这样浏览器执行 JS 之前就能确定布局并控制图片请求。
// -----------------------------------------------------------------------------
const staticImageDimensions = {
    '/previous-blog-snapshot.png': { width: 1200, height: 1000 },
    '/current-blog-snapshot.png': { width: 1280, height: 1086 }
};

function rehypeStaticImageAttributes() {
    return (tree) => {
        const visit = (node) => {
            if (!node || typeof node !== 'object') return;

            if (node.type === 'element' && node.tagName === 'img') {
                const src = node.properties?.src;
                const dimensions = typeof src === 'string' ? staticImageDimensions[src] : undefined;

                if (dimensions) {
                    node.properties = {
                        ...node.properties,
                        ...dimensions,
                        loading: 'lazy',
                        decoding: 'async'
                    };
                }
            }

            if (Array.isArray(node.children)) {
                node.children.forEach(visit);
            }
        };

        visit(tree);
    };
}

// https://astro.build/config
export default defineConfig({
    site: siteConfig.website,
    markdown: {
        rehypePlugins: [rehypeStaticImageAttributes]
    },
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [mdx(), sitemap()]
});
