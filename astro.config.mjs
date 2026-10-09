// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import checkRedirects from './scripts/redirects-integration.mjs';

const NOINDEX_PAGES = ['/thank-you/'];

// https://astro.build/config
export default defineConfig({
  site: 'https://lakecountyoutdoor.com',
  output: 'static',
  // Workers static assets answer /page with a redirect to /page/; link to the
  // trailing-slash form everywhere so no internal link costs a redirect hop.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PAGES.some((path) => new URL(page).pathname === path),
    }),
    checkRedirects(),
  ],
  build: {
    // public/_headers caches /_assets/* as immutable; keep the two in sync.
    assets: '_assets',
  },
  // Astro 7 defaults to 'jsx' whitespace handling; keep the v5 behaviour.
  compressHTML: true,
});
