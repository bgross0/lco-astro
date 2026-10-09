import fs from 'node:fs';
import path from 'node:path';
import { imageMetadata } from 'astro/assets/utils';

// Images live in public/ (CMS uploads land there too), so Astro does not
// resize them. Resized copies sit next to the original as `name-<width>w.jpg`;
// this picks them up for srcset and reads the intrinsic size for width/height.

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const cache = new Map<string, Promise<ResponsiveImage>>();

export interface ResponsiveImage {
  src: string;
  srcset?: string;
  width?: number;
  height?: number;
}

async function size(file: string) {
  try {
    const meta = await imageMetadata(await fs.promises.readFile(file), file);
    return { width: meta.width, height: meta.height };
  } catch {
    return undefined;
  }
}

async function resolve(src: string): Promise<ResponsiveImage> {
  if (!src.startsWith('/')) return { src };
  const file = path.join(PUBLIC_DIR, decodeURI(src));
  const own = await size(file);
  if (!own) return { src };

  const dir = path.dirname(file);
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const pattern = new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)w${ext.replace('.', '\\.')}$`);
  const variants = fs.readdirSync(dir)
    .map((name) => ({ name, match: name.match(pattern) }))
    .filter((v): v is { name: string; match: RegExpMatchArray } => v.match !== null)
    .map((v) => ({ url: path.posix.join(path.posix.dirname(src), v.name), width: Number(v.match[1]) }))
    .filter((v) => v.width < own.width)
    .sort((a, b) => a.width - b.width);

  const srcset = variants.length
    ? [...variants.map((v) => `${encodeURI(v.url)} ${v.width}w`), `${encodeURI(src)} ${own.width}w`].join(', ')
    : undefined;
  return { src, srcset, ...own };
}

/** src, srcset and intrinsic width/height for an image under public/. */
export function responsiveImage(src: string): Promise<ResponsiveImage> {
  if (!cache.has(src)) cache.set(src, resolve(src));
  return cache.get(src)!;
}

/** Image props for the shadcn blocks: src, srcset, intrinsic size and alt text. */
export async function blockImage(src: string, alt: string) {
  const image = await responsiveImage(src);
  return { ...image, alt };
}
