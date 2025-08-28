import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const IMG_DIR = join(ROOT, 'public', 'images');

async function* walk(dir) {
  for (const dirent of await fs.readdir(dir, { withFileTypes: true })) {
    const res = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

function toWebpPath(file) {
  return file.replace(/\.(jpe?g|png)$/i, '.webp');
}

async function convertFile(file) {
  const out = toWebpPath(file);
  if (out === file) return; // skip non-targets
  try {
    const data = await fs.readFile(file);
    const webp = await sharp(data).webp({ quality: 82 }).toBuffer();
    await fs.writeFile(out, webp);
    console.log('Converted →', out.replace(ROOT, ''));
  } catch (e) {
    console.warn('Failed:', file, e?.message);
  }
}

async function main() {
  try {
    await fs.access(IMG_DIR);
  } catch {
    console.error('Missing directory:', IMG_DIR);
    process.exit(1);
  }
  for await (const file of walk(IMG_DIR)) {
    if (/\.(jpe?g|png)$/i.test(file)) {
      await convertFile(file);
    }
  }
}

main();

