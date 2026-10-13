// Build-time image optimization for files under public/images (including
// Decap CMS uploads in public/images/uploads), which Astro copies as-is.
//
// After the build, every JPEG, PNG and WebP under dist/images gets WebP
// copies at a few widths (never wider than the original, capped at
// MAX_WIDTH), and every <img> in the built HTML is rewritten to serve them:
// src becomes the largest WebP, and a srcset lists every width so the browser
// downloads the smallest file that is still sharp on that screen (including
// high-density phones). The originals stay in place, so content, social
// images and the CMS keep their paths. Encoded files are cached in
// node_modules/.cache, keyed by content and settings, so rebuilds are fast.
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Steps close enough that a phone (1x-3x) and a desktop (1x-2x) each get a
// file within ~30% of the pixels they need.
const WIDTHS = [480, 768, 1080, 1440, 1920, 2560];
const MAX_WIDTH = 2560;
// Quality 75 at effort 4: on this site's already-compressed job photos it
// matches the originals' size at full width and halves it at 1024px, and
// encodes ~2.5x faster than effort 6 for no visible gain. AVIF would be ~40%
// smaller still but ~13x slower to encode, too slow for a build on every CMS
// publish; serve AVIF from Cloudflare (Polish / image transformations) once
// the domain is on Cloudflare instead.
const WEBP = { quality: 75, effort: 4, smartSubsample: true };
const CONCURRENCY = Math.max(2, Math.min(8, os.availableParallelism?.() ?? os.cpus().length));
const RASTER = /\.(jpe?g|png|webp)$/i;
const SETTINGS = JSON.stringify({ WIDTHS, MAX_WIDTH, WEBP, v: 2 });

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const variantName = (file, width) => file.replace(RASTER, `.w${width}.webp`);

export default function webpImages() {
  return {
    name: 'webp-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const sharp = (await import('sharp')).default;
        const dist = fileURLToPath(dir);
        const imagesDir = path.join(dist, 'images');
        if (!existsSync(imagesDir)) return;
        const cacheDir = path.join(process.cwd(), 'node_modules', '.cache', 'webp-images');
        await mkdir(cacheDir, { recursive: true });

        // 1. Encode: url -> [{ url, width }] of WebP variants, widest last.
        const variants = new Map();
        let encoded = 0;
        let cached = 0;
        let before = 0;
        let after = 0;
        const files = (await walk(imagesDir)).filter((f) => RASTER.test(f) && !/\.w\d+\.webp$/.test(f));
        const toUrl = (f) => '/' + path.relative(dist, f).split(path.sep).join('/');

        async function encode(file) {
          const input = await readFile(file);
          const meta = await sharp(input).metadata();
          // Respect EXIF rotation for the reported width.
          const width = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
          if (!width) return;
          const key = createHash('sha256').update(input).update(SETTINGS).digest('hex').slice(0, 24);
          const targets = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, MAX_WIDTH)])].sort((a, b) => a - b);
          const list = [];
          for (const target of targets) {
            const outFile = variantName(file, target);
            const cacheFile = path.join(cacheDir, `${key}-${target}.webp`);
            let size;
            if (existsSync(cacheFile)) {
              await copyFile(cacheFile, outFile);
              size = (await stat(cacheFile)).size;
              cached++;
            } else {
              const buffer = await sharp(input).rotate().resize({ width: target, withoutEnlargement: true }).webp(WEBP).toBuffer();
              await writeFile(cacheFile, buffer);
              await writeFile(outFile, buffer);
              size = buffer.length;
              encoded++;
            }
            list.push({ url: toUrl(outFile), width: target, size });
          }
          // No bloat: if the full-width WebP is bigger than the original (and
          // the original is not wider than MAX_WIDTH), offer the original.
          const top = list.at(-1);
          if (top.size >= input.length && width <= MAX_WIDTH) list[list.length - 1] = { url: toUrl(file), width, size: input.length };
          before += input.length;
          after += list.at(-1).size;
          variants.set(toUrl(file), list);
        }

        const queue = [...files];
        await Promise.all(
          Array.from({ length: CONCURRENCY }, async () => {
            while (queue.length) await encode(queue.shift());
          }),
        );

        // 2. Rewrite <img> tags in the built HTML.
        const pages = (await walk(dist)).filter((f) => f.endsWith('.html') && !f.includes(`${path.sep}admin${path.sep}`));
        let rewritten = 0;
        const lookup = (url) => variants.get(decodeURI(url.split('?')[0]));
        for (const page of pages) {
          const html = await readFile(page, 'utf8');
          const next = html.replace(/<img\b[^>]*>/gi, (tag) => {
            const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
            const list = src && lookup(src);
            if (!list) return tag;
            rewritten++;
            const largest = list.at(-1);
            const srcset = list.map((v) => `${encodeURI(v.url)} ${v.width}w`).join(', ');
            let out = tag.replace(/\ssrc="[^"]+"/i, ` src="${encodeURI(largest.url)}"`);
            out = /\ssrcset="/i.test(out)
              ? out.replace(/\ssrcset="[^"]*"/i, ` srcset="${srcset}"`)
              : out.replace(/^<img\b/i, `<img srcset="${srcset}"`);
            if (!/\ssizes="/i.test(out)) {
              // Lazy images let the browser size from layout; others fill the width.
              const sizes = /\sloading="lazy"/i.test(out) ? 'auto, 100vw' : '100vw';
              out = out.replace(/^<img\b/i, `<img sizes="${sizes}"`);
            }
            return out;
          })
          // Video posters: the largest WebP.
          .replace(/(<video\b[^>]*\sposter=")([^"]+)(")/gi, (all, a, url, b) => {
            const list = lookup(url);
            return list ? `${a}${encodeURI(list.at(-1).url)}${b}` : all;
          });
          if (next !== html) await writeFile(page, next);
        }

        const mb = (n) => (n / 1024 / 1024).toFixed(1);
        logger.info(
          `${variants.size} images: ${encoded} encoded, ${cached} from cache; ${rewritten} <img> tags rewritten; ` +
            `largest variants ${mb(after)} MB vs originals ${mb(before)} MB`,
        );
      },
    },
  };
}
