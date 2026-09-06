/**
 * [INPUT]: 仅承载首页品牌标题、Markdown 正文与社交区入口文案
 * [OUTPUT]: 对外提供 HomeContent 类型与中文首页文案单一配置对象
 * [POS]: data 的首页内容源；正文只引导 Blog 与 About，不额外重复身份信息
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export type HomeContent = {
    title: string;
    description: string;
    content: string;
    socialLabel: string;
};

const homeContent: HomeContent = {
    title: "Harper's Blog",
    description: 'Harper 的个人博客，记录生活、想法与不设主题的文字。',
    content: `嘿，欢迎来到我的博客。

我是Harper，想了解更多可以点击 [About](/about/)。

这里是我用来记录生活和一些想法的地方，没有特定的主题，只看我什么时候对什么产生了兴致。你可以在这里看我过去的一些文字 [Blog](/blog/)。

大部分时间里我可能都没有什么表达欲，只有在特别开心或者特别难过的时候才会产生强烈的写作欲望。但我也希望自己能养成一个稳定输出的好习惯。做博客最大的愿望就是能够做一个稳定更新的周刊。慢慢来吧！我并不想在这件事情上太难为自己。

在AI时代，其实做这件事情特别容易，但我不想让这里也被“污染”。也许人类的文字，幼稚、混乱、毫无逻辑、毫无条理、语病频出，但这就是我想保留的人味吧。所以，我尽量不会使用AI来直接修改文字。

下面是我很喜欢的两个句子，分享给你。

> 记录持续不断，意义自然浮现

> 不为无为之事，何以遣有生之涯`,
    socialLabel: 'Find me on'
};

export default homeContent;
