import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://shopeeaffvn.com',
  integrations: [mdx()],
  scopedStyleStrategy: 'where',
  build: {
    inlineStylesheets: 'always',
  },
  compressHTML: true,
});
