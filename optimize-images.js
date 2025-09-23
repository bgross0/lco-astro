import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [400, 800, 1200, 1920];
const QUALITY = 85;

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).toLowerCase();

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  console.log(`Optimizing ${inputPath}...`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Generate multiple sizes
    for (const width of SIZES) {
      if (metadata.width >= width) {
        // Generate WebP version
        await image
          .clone()
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(path.join(outputDir, `${filename}-${width}w.webp`));

        // Generate optimized JPEG version
        if (ext !== '.png') {
          await image
            .clone()
            .resize(width, null, { withoutEnlargement: true })
            .jpeg({ quality: QUALITY, progressive: true })
            .toFile(path.join(outputDir, `${filename}-${width}w.jpg`));
        }
      }
    }

    // Also create an optimized version at original size
    if (ext !== '.png') {
      await image
        .clone()
        .jpeg({ quality: QUALITY, progressive: true })
        .toFile(path.join(outputDir, `${filename}-optimized.jpg`));
    }

    await image
      .clone()
      .webp({ quality: QUALITY })
      .toFile(path.join(outputDir, `${filename}-optimized.webp`));

    console.log(`✓ Optimized ${filename}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
  }
}

async function optimizeDirectory(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      await optimizeDirectory(fullPath);
    } else if (file.isFile()) {
      // Skip already optimized files
      if (file.name.includes('-optimized') || file.name.includes('w.')) {
        continue;
      }
      await optimizeImage(fullPath, dir);
    }
  }
}

async function main() {
  const publicImagesDir = path.join(__dirname, 'public', 'images');
  const publicMediaDir = path.join(__dirname, 'public', '_media');

  console.log('Starting image optimization...');

  try {
    await optimizeDirectory(publicImagesDir);
    console.log('\nOptimizing _media directory (this may take a while)...');
    await optimizeDirectory(publicMediaDir);
    console.log('\n✨ Image optimization complete!');
  } catch (error) {
    console.error('Error during optimization:', error);
  }
}

main();