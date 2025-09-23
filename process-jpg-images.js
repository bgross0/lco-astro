import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, 'lco-photos');
const WEB_DIR = path.join(__dirname, 'public', 'images');
const HIGH_RES_DIR = path.join(WEB_DIR, 'gallery');

// Web sizes to generate
const WEB_SIZES = [400, 800, 1200, 1920];

async function createDirectories() {
  await fs.mkdir(HIGH_RES_DIR, { recursive: true });

  // Create subdirectories for different types
  const subdirs = ['hero', 'equipment', 'landscaping', 'snow-removal'];
  for (const dir of subdirs) {
    await fs.mkdir(path.join(WEB_DIR, dir), { recursive: true });
  }
}

async function getImageDimensions(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    return null;
  }
}

async function processJPGFile(filePath, filename) {
  const baseName = path.basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  try {
    const metadata = await sharp(filePath).metadata();
    console.log(`Processing ${filename}: ${metadata.width}x${metadata.height}`);

    // Skip if image is too small
    if (metadata.width < 800) {
      console.log(`  ⚠ Skipping - image too small (${metadata.width}px wide)`);
      return null;
    }

    // Generate web-optimized versions
    for (const width of WEB_SIZES) {
      if (metadata.width >= width) {
        // Generate WebP
        const webpPath = path.join(HIGH_RES_DIR, `${baseName}-${width}w.webp`);
        await sharp(filePath)
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(webpPath);

        // Generate optimized JPEG
        const jpegPath = path.join(HIGH_RES_DIR, `${baseName}-${width}w.jpg`);
        await sharp(filePath)
          .resize(width, null, { withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toFile(jpegPath);
      }
    }

    // Create a high-quality "optimized" version at original size
    const optimizedPath = path.join(HIGH_RES_DIR, `${baseName}-optimized.jpg`);
    await sharp(filePath)
      .jpeg({ quality: 90, progressive: true })
      .toFile(optimizedPath);

    const optimizedWebpPath = path.join(HIGH_RES_DIR, `${baseName}-optimized.webp`);
    await sharp(filePath)
      .webp({ quality: 90 })
      .toFile(optimizedWebpPath);

    console.log(`  ✓ Generated ${WEB_SIZES.filter(w => w <= metadata.width).length} sizes`);

    return {
      original: filename,
      baseName,
      dimensions: { width: metadata.width, height: metadata.height },
      generated: WEB_SIZES.filter(w => w <= metadata.width)
    };
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return null;
  }
}

async function updateImageReferences() {
  // Create a mapping of potential replacement images
  const replacements = [
    { old: '/images/equipment-3-600x409.jpg', new: '/images/gallery/img-2471', desc: 'Snow removal equipment' },
    { old: '/images/equipment/equipment-2-600x616.jpg', new: '/images/gallery/img-1485', desc: 'Equipment' },
    { old: '/images/equipment-5-600x451.jpg', new: '/images/gallery/img-1486', desc: 'Landscaping' },
    { old: '/images/landscaping/bobcat-excavator.jpg', new: '/images/gallery/img-1487', desc: 'Excavator' }
  ];

  console.log('\n📝 Suggested replacements for hero images:');
  replacements.forEach(r => {
    console.log(`  ${r.old}`);
    console.log(`  → ${r.new}-optimized.jpg (${r.desc})`);
  });
}

async function main() {
  console.log('🖼️ Processing high-resolution JPG images...\n');

  await createDirectories();

  // Get all JPG files
  const files = await fs.readdir(SOURCE_DIR);
  const jpgFiles = files.filter(f => /\.(jpg|jpeg)$/i.test(f));

  console.log(`Found ${jpgFiles.length} JPG files\n`);

  const results = [];
  for (const file of jpgFiles) {
    const filePath = path.join(SOURCE_DIR, file);
    const result = await processJPGFile(filePath, file);
    if (result) results.push(result);
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Processing complete!`);
  console.log(`  Processed ${results.length} images`);
  console.log(`  Output directory: ${HIGH_RES_DIR}`);

  // Show largest images that could be used for hero
  console.log('\n🏆 Largest images (good for hero/backgrounds):');
  results
    .sort((a, b) => b.dimensions.width - a.dimensions.width)
    .slice(0, 5)
    .forEach(img => {
      console.log(`  ${img.baseName}: ${img.dimensions.width}x${img.dimensions.height}`);
    });

  await updateImageReferences();
}

main().catch(console.error);