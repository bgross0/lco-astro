// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import checkRedirects from './scripts/redirects-integration.mjs';

const NOINDEX_PAGES = ['/thank-you'];

// https://astro.build/config
export default defineConfig({
  site: 'https://lakecountyoutdoor.com',
  output: 'static',
  // Canonical URLs have no trailing slash, as on the previous live site
  // (/reviews, /services/sod-installation). With 'file' output dist holds
  // reviews.html; the Worker's html_handling "auto-trailing-slash" serves it at
  // /reviews and redirects /reviews/ there. Link to the slashless form only.
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PAGES.some((path) => new URL(page).pathname === path),
    }),
    checkRedirects(),
  ],
  build: {
    format: 'file',
    // public/_headers caches /_assets/* as immutable; keep the two in sync.
    assets: '_assets',
  },
  // Astro 7 defaults to 'jsx' whitespace handling; keep the v5 behaviour.
  compressHTML: true,
});
