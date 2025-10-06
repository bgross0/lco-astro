import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base paths
const publicDir = path.join(__dirname, '../public/images');
const originalsDir = path.join(publicDir, 'originals');

// Images to optimize
const images = [
  {
    input: 'img_2472.png',
    output: 'img_2472.webp',
    quality: 90,
    description: 'Hero image 1 (17MB PNG → WebP)'
  },
  {
    input: 'img_2486.png',
    output: 'img_2486.webp',
    quality: 90,
    description: 'About section image (25MB PNG → WebP)'
  },
  {
    input: 'gallery/img-2322-1920w.jpg',
    output: 'gallery/img-2322-1920w.webp',
    quality: 85,
    description: 'Municipal service showcase (1.7MB → WebP)'
  },
  {
    input: 'services/municipal/municipal-hero-final.jpg',
    output: 'services/municipal/municipal-hero-final.webp',
    quality: 85,
    description: 'Municipal hero (771KB → WebP)'
  },
  {
    input: 'gallery/img-8046-1920w.jpg',
    output: 'gallery/img-8046-1920w.webp',
    quality: 85,
    description: 'Ice management showcase (572KB → WebP)'
  },
  {
    input: 'gallery/img-7575-1920w.jpg',
    output: 'gallery/img-7575-1920w.webp',
    quality: 85,
    description: 'Snow removal showcase (549KB → WebP)'
  }
];

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function optimizeImage(imageConfig) {
  const inputPath = path.join(publicDir, imageConfig.input);
  const outputPath = path.join(publicDir, imageConfig.output);
  const originalBackupPath = path.join(originalsDir, imageConfig.input);

  console.log(`\n📸 Processing: ${imageConfig.description}`);
  console.log(`   Input: ${imageConfig.input}`);

  try {
    // Check if input file exists
    await fs.access(inputPath);

    // Get input file stats
    const inputStats = await fs.stat(inputPath);
    const inputSizeMB = (inputStats.size / (1024 * 1024)).toFixed(2);
    console.log(`   Original size: ${inputSizeMB}MB`);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await ensureDir(outputDir);

    // Backup original if not already backed up
    try {
      await fs.access(originalBackupPath);
      console.log(`   ✓ Original already backed up`);
    } catch {
      const backupDir = path.dirname(originalBackupPath);
      await ensureDir(backupDir);
      await fs.copyFile(inputPath, originalBackupPath);
      console.log(`   ✓ Original backed up to: originals/${imageConfig.input}`);
    }

    // Optimize image
    await sharp(inputPath)
      .webp({ quality: imageConfig.quality, effort: 6 })
      .toFile(outputPath);

    // Get output file stats
    const outputStats = await fs.stat(outputPath);
    const outputSizeMB = (outputStats.size / (1024 * 1024)).toFixed(2);
    const reduction = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(1);

    console.log(`   Output: ${imageConfig.output}`);
    console.log(`   Optimized size: ${outputSizeMB}MB`);
    console.log(`   ✅ Reduced by ${reduction}%`);

  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
  }
}

async function main() {
  console.log('🚀 Starting homepage image optimization...\n');
  console.log('This will:');
  console.log('  1. Back up originals to /public/images/originals/');
  console.log('  2. Create optimized WebP versions');
  console.log('  3. Preserve original dimensions\n');

  // Ensure originals directory exists
  await ensureDir(originalsDir);

  // Process all images
  for (const imageConfig of images) {
    await optimizeImage(imageConfig);
  }

  console.log('\n✨ Optimization complete!');
  console.log('\nNext steps:');
  console.log('  1. Update JSON files to reference .webp versions');
  console.log('  2. Test images on the site');
  console.log('  3. Commit changes if everything looks good\n');
}

main().catch(console.error);
