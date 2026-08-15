import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site || 'https://shopeeaffvn.com').toString().replace(/\/$/, '');
  const articles = await getCollection('bai-viet');

  const staticPages = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/search',
    '/bai-viet',
    '/chuyen-muc/huong-dan',
    '/chuyen-muc/chon-san-pham',
    '/chuyen-muc/case-study',
    '/chuyen-muc/tao-content',
    '/chuyen-muc/traffic-seo',
    '/chuyen-muc/phan-tich',
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
  ${articles
    .map(
      (article) => `
  <url>
    <loc>${baseUrl}/bai-viet/${article.slug}</loc>
    <lastmod>${article.data.publishDate.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join('')}
</urlset>`.trim();

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
