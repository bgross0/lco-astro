// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const NOINDEX_PAGES = ['/thank-you/'];

// https://astro.build/config
export default defineConfig({
  site: 'https://lakecountyoutdoor.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PAGES.some((path) => new URL(page).pathname === path),
    }),
  ],
  build: {
    // public/_headers caches /_assets/* as immutable; keep the two in sync.
    assets: '_assets',
  },
  // Astro 7 defaults to 'jsx' whitespace handling; keep the v5 behaviour.
  compressHTML: true,
});
