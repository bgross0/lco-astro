#!/usr/bin/env node

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only generate sizes that make sense based on original
const RESPONSIVE_SIZES = [400, 800, 1200, 1600, 2400];
const QUALITY = {
  webp: 82,
  jpg: 85
};

const INPUT_DIR = path.join(__dirname, '../public/images');

async function getOptimalSizes(originalWidth) {
  // Only return sizes smaller than or equal to original
  return RESPONSIVE_SIZES.filter(size => size < originalWidth);
}

async function optimizeImage(inputPath, relativePath) {
  const ext = path.extname(inputPath).toLowerCase();
  const name = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);

  // Skip if already optimized
  if (name.includes('-400w') || name.includes('-800w') || name.endsWith('.webp')) {
    return;
  }

  // Skip non-images
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  console.log(`Optimizing: ${relativePath}`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalWidth = metadata.width || 1600;

    // Get appropriate sizes for this image
    const sizes = await getOptimalSizes(originalWidth);

    // Always create a full-size WebP
    const fullWebpPath = path.join(dir, `${name}.webp`);
    if (!await fs.access(fullWebpPath).then(() => true).catch(() => false)) {
      await sharp(inputPath)
        .webp({ quality: QUALITY.webp })
        .toFile(fullWebpPath);
      console.log(`  ✓ Created full WebP: ${name}.webp`);
    }

    // Create responsive sizes only if they make sense
    for (const width of sizes) {
      // WebP version
      const webpPath = path.join(dir, `${name}-${width}w.webp`);
      if (!await fs.access(webpPath).then(() => true).catch(() => false)) {
        await image
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: QUALITY.webp })
          .toFile(webpPath);
        console.log(`  ✓ Created ${width}w WebP`);
      }

      // JPEG version for fallback (only if original is JPEG)
      if (ext === '.jpg' || ext === '.jpeg') {
        const jpgPath = path.join(dir, `${name}-${width}w.jpg`);
        if (!await fs.access(jpgPath).then(() => true).catch(() => false)) {
          await image
            .resize(width, null, {
              withoutEnlargement: true,
              fit: 'inside'
            })
            .jpeg({ quality: QUALITY.jpg, progressive: true })
            .toFile(jpgPath);
          console.log(`  ✓ Created ${width}w JPEG`);
        }
      }
    }

    console.log(`✅ Completed: ${relativePath}`);
  } catch (error) {
    console.error(`❌ Failed: ${relativePath}:`, error.message);
  }
}

async function processDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(INPUT_DIR, fullPath);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      await optimizeImage(fullPath, relativePath);
    }
  }
}

// Main execution
console.log('🖼️  Image Optimization v2');
console.log('📁 Processing:', INPUT_DIR);
console.log('⚙️  Creating WebP versions and responsive sizes...\n');

processDirectory(INPUT_DIR)
  .then(() => {
    console.log('\n✅ Optimization complete!');
    console.log('💡 Tip: Commit these changes to git');
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });