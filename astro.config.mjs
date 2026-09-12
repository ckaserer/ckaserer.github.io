import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ckaserer.dev',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/og') && !page.includes('/cv'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
