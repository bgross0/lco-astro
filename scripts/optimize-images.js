#!/usr/bin/env node

/**
 * Image Optimization Script for Cloudflare Polish Compatibility
 *
 * Resizes images larger than 3840px to ensure Cloudflare Polish
 * can apply full optimization (WebP conversion, advanced compression).
 *
 * Cloudflare Polish limitation: Images >4000px get limited optimization (degrade mode)
 * This script ensures all images are ≤3840px for optimal Polish performance.
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_DIR = path.join(__dirname, '..', 'public', 'images');
const MAX_DIMENSION = 3840; // 4K UHD, safely under Polish's 4000px limit
const QUALITY = 90; // High quality preservation
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

let processedCount = 0;
let skippedCount = 0;
let errorCount = 0;

/**
 * Get all image files recursively
 */
async function getImageFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await getImageFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Process a single image
 */
async function processImage(filePath) {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    const { width, height, format } = metadata;
    const maxDimension = Math.max(width, height);

    // Skip if already under limit
    if (maxDimension <= MAX_DIMENSION) {
      skippedCount++;
      return;
    }

    // Calculate new dimensions (maintain aspect ratio)
    let newWidth, newHeight;
    if (width > height) {
      newWidth = MAX_DIMENSION;
      newHeight = Math.round((height / width) * MAX_DIMENSION);
    } else {
      newHeight = MAX_DIMENSION;
      newWidth = Math.round((width / height) * MAX_DIMENSION);
    }

    console.log(`\n📸 Processing: ${path.relative(IMAGE_DIR, filePath)}`);
    console.log(`   Original: ${width}x${height} (${(await fs.stat(filePath)).size / 1024 / 1024}MB)`);
    console.log(`   Resizing to: ${newWidth}x${newHeight}`);

    // Resize and optimize
    const outputBuffer = await image
      .resize(newWidth, newHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();

    // Write back to same file
    await fs.writeFile(filePath, outputBuffer);

    const newSize = outputBuffer.length / 1024 / 1024;
    console.log(`   ✓ Complete: ${newWidth}x${newHeight} (${newSize.toFixed(2)}MB)`);

    processedCount++;

  } catch (error) {
    console.error(`   ✗ Error processing ${filePath}:`, error.message);
    errorCount++;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image optimization for Cloudflare Polish compatibility...\n');
  console.log(`📁 Scanning directory: ${IMAGE_DIR}`);
  console.log(`📏 Maximum dimension: ${MAX_DIMENSION}px`);
  console.log(`🎨 Quality setting: ${QUALITY}%\n`);

  try {
    // Check if directory exists
    await fs.access(IMAGE_DIR);

    // Get all image files
    const imageFiles = await getImageFiles(IMAGE_DIR);
    console.log(`Found ${imageFiles.length} images to check\n`);

    // Process each image
    for (const filePath of imageFiles) {
      await processImage(filePath);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 OPTIMIZATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Processed: ${processedCount} images`);
    console.log(`⊘ Skipped:   ${skippedCount} images (already optimized)`);
    console.log(`✗ Errors:    ${errorCount} images`);
    console.log('='.repeat(60) + '\n');

    if (processedCount > 0) {
      console.log('✨ Images optimized for Cloudflare Polish!');
      console.log('💡 Deploy to enable WebP conversion and full compression.\n');
    } else {
      console.log('✅ All images already optimized!\n');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
