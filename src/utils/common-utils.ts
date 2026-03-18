export function slugify(input?: string) {
    if (!input) return '';

    // make lower case and trim
    var slug = input.toLowerCase().trim();

    // remove accents from charaters
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // replace invalid chars with spaces
    slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

    // replace multiple spaces or hyphens with a single hyphen
    slug = slug.replace(/[\s-]+/g, '-');

    return slug;
}

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
