const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function createFallbackVariants(imagePath) {
  try {
    const dir = path.dirname(imagePath);
    const ext = path.extname(imagePath);
    const basename = path.basename(imagePath, ext);

    // Read the original image
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    console.log(`Processing ${path.basename(imagePath)} (${metadata.width}x${metadata.height})`);

    // For images smaller than standard sizes, create copies with size suffixes
    // This prevents 404s when the component looks for these variants
    const sizes = [800, 1200, 1920];

    for (const size of sizes) {
      const jpgPath = path.join(dir, `${basename}-${size}w.jpg`);
      const webpPath = path.join(dir, `${basename}-${size}w.webp`);

      // Check if file already exists
      try {
        await fs.access(jpgPath);
        console.log(`  ${size}w already exists`);
        continue;
      } catch {
        // File doesn't exist, create it
      }

      if (size > metadata.width) {
        // Image is smaller than target size - just copy it with the size suffix
        console.log(`  Creating ${size}w as copy (original is only ${metadata.width}px wide)`);

        // Create JPEG copy
        await sharp(imagePath)
          .jpeg({ quality: 85 })
          .toFile(jpgPath);

        // Create WebP copy
        await sharp(imagePath)
          .webp({ quality: 85 })
          .toFile(webpPath);
      } else {
        // Should not happen for these images, but resize if needed
        await sharp(imagePath)
          .resize(size, null, { withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(jpgPath);

        await sharp(imagePath)
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(webpPath);
      }
    }
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
  }
}

async function main() {
  const images = [
    'public/images/equipment-5-600x451.jpg',
    'public/images/landscaping/bobcat-excavator.jpg'
  ];

  console.log('Creating missing responsive variants for low-res images...\n');

  for (const img of images) {
    await createFallbackVariants(img);
  }

  console.log('\nDone! The images will now load without 404 errors.');
}

main().catch(console.error);