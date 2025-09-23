const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [400, 800, 1200, 1920];

async function generateResponsiveImages(imagePath) {
  try {
    const dir = path.dirname(imagePath);
    const ext = path.extname(imagePath);
    const basename = path.basename(imagePath, ext);

    // Read the original image
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    console.log(`Processing ${path.basename(imagePath)} (${metadata.width}x${metadata.height})`);

    for (const width of sizes) {
      // Skip if target width is larger than original
      if (width > metadata.width) {
        console.log(`  Skipping ${width}w (larger than original)`);
        continue;
      }

      const outputPath = path.join(dir, `${basename}-${width}w${ext}`);
      const outputPathWebp = path.join(dir, `${basename}-${width}w.webp`);

      // Check if file already exists
      try {
        await fs.access(outputPath);
        console.log(`  ${width}w already exists`);
        continue;
      } catch {
        // File doesn't exist, create it
      }

      // Generate resized JPEG
      await sharp(imagePath)
        .resize(width, null, { withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(outputPath);

      // Generate WebP version
      await sharp(imagePath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPathWebp);

      console.log(`  Created ${width}w variants`);
    }
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
  }
}

async function processAllImages() {
  // Process main hero images
  const heroImages = [
    'public/images/equipment-3-600x409.jpg',
    'public/images/equipment/equipment-2-600x616.jpg',
    'public/images/equipment-5-600x451.jpg',
    'public/images/landscaping/bobcat-excavator.jpg'
  ];

  // Process other important images
  const otherImages = [
    'public/images/cat-299d3-snow.jpg',
    'public/images/truck-mid-plow.jpg',
    'public/images/loader-snow-bucket.jpg',
    'public/images/salting.jpg',
    'public/images/loader-pushing-gradient.jpg'
  ];

  console.log('Generating responsive images for hero slideshow...\n');

  for (const img of heroImages) {
    await generateResponsiveImages(img);
  }

  console.log('\nGenerating responsive images for other content...\n');

  for (const img of otherImages) {
    try {
      await fs.access(img);
      await generateResponsiveImages(img);
    } catch {
      console.log(`Skipping ${img} (not found)`);
    }
  }

  console.log('\nDone!');
}

processAllImages().catch(console.error);