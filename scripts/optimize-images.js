#!/usr/bin/env node

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [400, 800, 1200, 1600];
const QUALITY = {
  webp: 80,
  jpg: 85
};

const INPUT_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images');

async function optimizeImage(inputPath, relativePath) {
  const ext = path.extname(inputPath).toLowerCase();
  const name = path.basename(inputPath, ext);
  const dir = path.dirname(relativePath);

  // Skip if already optimized
  if (name.includes('-400w') || name.includes('-800w') || name.includes('.webp')) {
    return;
  }

  console.log(`Optimizing: ${relativePath}`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Generate multiple sizes
    for (const width of SIZES) {
      // Skip if image is smaller than target size
      if (metadata.width < width) continue;

      const outputDir = path.join(OUTPUT_DIR, dir);
      await fs.mkdir(outputDir, { recursive: true });

      // WebP version
      const webpPath = path.join(outputDir, `${name}-${width}w.webp`);
      await image
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: QUALITY.webp })
        .toFile(webpPath);

      // JPEG version (fallback)
      if (ext === '.jpg' || ext === '.jpeg') {
        const jpgPath = path.join(outputDir, `${name}-${width}w.jpg`);
        await image
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: QUALITY.jpg, progressive: true })
          .toFile(jpgPath);
      }
    }

    // Create a full-size WebP version
    const fullWebpPath = path.join(OUTPUT_DIR, dir, `${name}.webp`);
    await sharp(inputPath)
      .webp({ quality: QUALITY.webp })
      .toFile(fullWebpPath);

    console.log(`✓ Optimized: ${relativePath}`);
  } catch (error) {
    console.error(`✗ Failed to optimize ${relativePath}:`, error.message);
  }
}

async function processDirectory(dir, baseDir = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      await processDirectory(fullPath, baseDir);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        await optimizeImage(fullPath, relativePath);
      }
    }
  }
}

// Main execution
console.log('🖼️  Starting image optimization...');
console.log(`Processing images in: ${INPUT_DIR}`);

processDirectory(INPUT_DIR)
  .then(() => {
    console.log('✅ Image optimization complete!');
  })
  .catch(error => {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  });