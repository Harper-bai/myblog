/**
 * [INPUT]: 依赖 Astro Content Collections 的 glob loader、文档文件排除规则与 Zod schema 能力
 * [OUTPUT]: 对外提供 blog、pages、projects、notes、diary 五类内容集合契约
 * [POS]: src 的内容边界定义；用 isLifeArchive 区分公开生活档案与首页品牌内容，不改变文章路径
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const seoSchema = z.object({
    title: z.string().min(5).max(120).optional(),
    description: z.string().min(15).max(160).optional(),
    image: z
        .object({
            src: z.string(),
            alt: z.string().optional()
        })
        .optional(),
    pageType: z.enum(['website', 'article']).default('website')
});

const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        language: z.enum(['zh', 'en']).optional(),
        isFeatured: z.boolean().default(false),
        isLifeArchive: z.boolean().default(false),
        seo: seoSchema.optional()
    })
});

const notes = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        language: z.enum(['zh', 'en']).optional(),
        isFeatured: z.boolean().default(false),
        seo: seoSchema.optional()
    })
});

const diary = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/diary' }),
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        language: z.enum(['zh', 'en']).optional(),
        isFeatured: z.boolean().default(false),
        seo: seoSchema.optional()
    })
});

const pages = defineCollection({
    loader: glob({ pattern: ['**/*.{md,mdx}', '!**/CLAUDE.md'], base: './src/content/pages' }),
    schema: z.object({
        title: z.string(),
        seo: seoSchema.optional()
    })
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        publishDate: z.coerce.date(),
        isFeatured: z.boolean().default(false),
        seo: seoSchema.optional()
    })
});

export const collections = { blog, pages, projects, notes, diary };
