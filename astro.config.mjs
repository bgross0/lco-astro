// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://lakecountyoutdoor.com',
  integrations: [
    sitemap(),
    tailwind(),
  ],
  build: {
    inlineStylesheets: 'auto',
    // Enable aggressive asset optimization
    assets: '_assets'
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    // High quality output - let Cloudflare Polish handle compression
    // Output as JPG so Cloudflare Polish can convert to WebP/AVIF
    domains: [],
    remotePatterns: []
  },
  vite: {
    build: {
      // Enable minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize chunk size
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro:content']
          }
        }
      }
    },
    // Enable compression
    ssr: {
      noExternal: ['tailwindcss']
    }
  },
  compressHTML: true,
  output: 'static'
});
