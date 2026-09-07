/**
 * [INPUT]: 接收 Markdown/HTML 正文等字符串输入，按中英文文本规则清理与度量
 * [OUTPUT]: 对外提供正文内容量、预计阅读分钟数与元描述 fallback 工具
 * [POS]: utils 的文本清理与度量基础层，被文章预览、详情页与 RSS 消费；不承担展示格式
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export function getEstimatedWordCount(input = '') {
    if (!input) return 0;

    const stripped = input
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`[^`]*`/g, ' ')
        .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
        .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/[#>*_\-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!stripped) return 0;

    const cjkChars = (stripped.match(/[\u4E00-\u9FFF]/g) || []).length;
    const latinWords = (stripped.replace(/[\u4E00-\u9FFF]/g, ' ').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;

    return cjkChars + latinWords;
}

const ESTIMATED_UNITS_PER_MINUTE = 450;

export function getEstimatedReadingMinutes(input = '') {
    return Math.max(1, Math.ceil(getEstimatedWordCount(input) / ESTIMATED_UNITS_PER_MINUTE));
}

export function getMetaDescription(input = '', fallback = '') {
    const plainText = input
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
        .replace(/^\s*[-*+]\s+\[[ xX]\]\s*/gm, '')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*>\s?/gm, '')
        .replace(/[#*_~]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return (plainText || fallback).slice(0, 155).trimEnd();
}
