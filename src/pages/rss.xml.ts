import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('bai-viet');
  const sortedArticles = articles.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  return rss({
    title: 'ShopeeAffVN — Kinh Nghiệm Shopee Affiliate Marketing',
    description: 'Chia sẻ kiến thức, hướng dẫn đăng ký, case study và chiến lược tối ưu hoa hồng Shopee Affiliate.',
    site: context.site || 'https://shopeeaffvn.com',
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishDate,
      description: article.data.description,
      link: `/bai-viet/${article.slug}/`,
      categories: [article.data.categoryName],
      author: article.data.author,
    })),
    customData: `<language>vi-VN</language>`,
  });
}
