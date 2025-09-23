import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONVERTED_DIR = path.join(__dirname, 'lco-photos-converted');
const WEB_DIR = path.join(__dirname, 'public', 'images', 'gallery');

// Web sizes to generate
const WEB_SIZES = [400, 800, 1200, 1920];

async function processImage(filePath, filename) {
  const baseName = path.basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  try {
    const metadata = await sharp(filePath).metadata();

    // Skip if too small
    if (metadata.width < 800) {
      return null;
    }

    console.log(`Processing ${filename}: ${metadata.width}x${metadata.height}`);

    // Generate optimized versions for each size
    for (const width of WEB_SIZES) {
      if (metadata.width >= width) {
        // WebP version
        const webpPath = path.join(WEB_DIR, `${baseName}-${width}w.webp`);
        await sharp(filePath)
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(webpPath);

        // JPEG version
        const jpegPath = path.join(WEB_DIR, `${baseName}-${width}w.jpg`);
        await sharp(filePath)
          .resize(width, null, { withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toFile(jpegPath);
      }
    }

    // Create optimized full-res version
    const optimizedPath = path.join(WEB_DIR, `${baseName}-optimized.jpg`);
    await sharp(filePath)
      .jpeg({ quality: 90, progressive: true })
      .toFile(optimizedPath);

    return {
      name: baseName,
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️ Processing all converted images for web use...\n');

  await fs.mkdir(WEB_DIR, { recursive: true });

  // Get all JPG files from converted directory
  const files = await fs.readdir(CONVERTED_DIR);
  const jpgFiles = files.filter(f => /\.jpg$/i.test(f));

  console.log(`Found ${jpgFiles.length} JPG files to process\n`);

  const results = [];
  let processed = 0;

  for (const file of jpgFiles) {
    const filePath = path.join(CONVERTED_DIR, file);
    const result = await processImage(filePath, file);
    if (result) {
      results.push(result);
      processed++;

      if (processed % 10 === 0) {
        console.log(`  Progress: ${processed}/${jpgFiles.length} processed...`);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Processing complete!`);
  console.log(`  Processed ${processed} images`);
  console.log(`  Output: ${WEB_DIR}`);

  // Find best images for hero
  const largestImages = results
    .sort((a, b) => b.width - a.width)
    .slice(0, 10);

  console.log('\n🏆 Top 10 largest images (great for hero backgrounds):');
  largestImages.forEach((img, i) => {
    console.log(`  ${i+1}. ${img.name}: ${img.width}x${img.height}`);
  });

  // Create a gallery index
  const galleryIndex = {
    total: results.length,
    images: results,
    categories: {
      landscape: results.filter(img => img.width > img.height),
      portrait: results.filter(img => img.height > img.width),
      large: results.filter(img => img.width >= 3000)
    }
  };

  await fs.writeFile(
    path.join(WEB_DIR, 'gallery-index.json'),
    JSON.stringify(galleryIndex, null, 2)
  );

  console.log('\n📋 Gallery index created: gallery-index.json');
}

main().catch(console.error);