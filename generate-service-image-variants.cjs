#!/usr/bin/env node
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const WIDTHS = [400, 800, 1200, 1920];
const SERVICES_DIR = '/home/ben/Documents/GitHub/lco-astro/public/images/services';

async function generateVariants(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).slice(1);

  for (const width of WIDTHS) {
    const outputPath = path.join(outputDir, `${filename}-${width}w.jpg`);
    const webpPath = path.join(outputDir, `${filename}-${width}w.webp`);

    try {
      // Generate JPEG variant
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(outputPath);

      console.log(`✓ Generated: ${outputPath}`);

      // Generate WebP variant
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 85 })
        .toFile(webpPath);

      console.log(`✓ Generated: ${webpPath}`);
    } catch (error) {
      console.error(`✗ Error processing ${inputPath} at ${width}w:`, error.message);
    }
  }
}

async function processServiceImages() {
  try {
    const services = await fs.readdir(SERVICES_DIR);

    for (const service of services) {
      const servicePath = path.join(SERVICES_DIR, service);
      const stats = await fs.stat(servicePath);

      if (stats.isDirectory()) {
        const files = await fs.readdir(servicePath);
        const heroImage = files.find(f => f.includes('hero') && f.endsWith('.jpg'));

        if (heroImage) {
          const imagePath = path.join(servicePath, heroImage);
          console.log(`\nProcessing: ${service}/${heroImage}`);
          await generateVariants(imagePath, servicePath);
        }
      }
    }

    console.log('\n✅ All service hero images processed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

processServiceImages();