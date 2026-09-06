/**
 * [INPUT]: 接收 Markdown/HTML 正文等字符串输入，按中英文文本规则清理与度量
 * [OUTPUT]: 对外提供正文内容量与预计阅读分钟数计算工具
 * [POS]: utils 的文本度量基础层，被文章预览、详情页与站点聚合数据消费；不承担展示格式
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
