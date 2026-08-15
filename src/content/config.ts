import { defineCollection, z } from 'astro:content';

const baiVietCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Admin'),
    category: z.enum([
      'huong-dan',
      'case-study',
      'chon-san-pham',
      'tao-content',
      'traffic-seo',
      'tool-phan-mem',
      'phan-tich'
    ]),
    categoryName: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    featured: z.boolean().default(false),
    hotBadge: z.string().optional(),
    views: z.number().default(1000),
    commentsCount: z.number().default(0),
    affiliateUrl: z.string().optional(),
    affiliateCtaText: z.string().optional(),
  }),
});

export const collections = {
  'bai-viet': baiVietCollection,
};
