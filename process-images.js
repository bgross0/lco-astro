import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, 'lco-photos');
const OUTPUT_DIR = path.join(__dirname, 'lco-photos-processed');
const WEB_DIR = path.join(__dirname, 'public', 'images', 'high-res');

// Web sizes to generate
const WEB_SIZES = [400, 800, 1200, 1920, 2560];
const QUALITY = {
  original: 95,  // High quality for full-res conversions
  web: 85        // Good quality for web
};

// Create output directories
async function createDirectories() {
  const dirs = [
    OUTPUT_DIR,
    path.join(OUTPUT_DIR, 'originals'),
    path.join(OUTPUT_DIR, 'converted'),
    path.join(OUTPUT_DIR, 'processed'),
    path.join(OUTPUT_DIR, 'web'),
    WEB_DIR
  ];

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Check if file is HEIC
function isHEIC(filename) {
  return /\.heic$/i.test(filename);
}

// Check if file is image
function isImage(filename) {
  return /\.(jpg|jpeg|png|heic)$/i.test(filename);
}

// Check if file is video
function isVideo(filename) {
  return /\.(mp4|mov|avi)$/i.test(filename);
}

// Process HEIC file - convert to JPG
async function processHEIC(inputPath, filename) {
  const baseName = path.basename(filename, path.extname(filename));
  const outputPath = path.join(OUTPUT_DIR, 'converted', `${baseName}.jpg`);

  try {
    // First, try to copy the HEIC as-is to see if sharp can handle it
    console.log(`Converting HEIC: ${filename}`);

    // Sharp might be able to read HEIC on some systems
    try {
      await sharp(inputPath)
        .jpeg({ quality: QUALITY.original })
        .toFile(outputPath);
      console.log(`✓ Converted ${filename} to JPG`);
      return outputPath;
    } catch (sharpError) {
      // If sharp can't handle it, we'll need heif-convert
      console.log(`⚠ Sharp couldn't process ${filename}, skipping HEIC conversion`);
      console.log(`  (Install libheif-examples for HEIC support: sudo apt-get install libheif-examples)`);

      // Copy original to preserve it
      const origPath = path.join(OUTPUT_DIR, 'originals', filename);
      await fs.copyFile(inputPath, origPath);
      return null;
    }
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}

// Process regular image (JPG, PNG)
async function processImage(inputPath, filename) {
  const baseName = path.basename(filename, path.extname(filename));
  const ext = path.extname(filename).toLowerCase();

  try {
    console.log(`Processing image: ${filename}`);

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`  Dimensions: ${metadata.width}x${metadata.height}`);

    // Copy original
    const origPath = path.join(OUTPUT_DIR, 'originals', filename);
    await fs.copyFile(inputPath, origPath);

    // Create high-quality processed version
    const processedPath = path.join(OUTPUT_DIR, 'processed', `${baseName}.jpg`);
    await sharp(inputPath)
      .jpeg({ quality: QUALITY.original, progressive: true })
      .toFile(processedPath);

    // Generate web versions
    for (const width of WEB_SIZES) {
      if (metadata.width >= width) {
        // WebP version
        const webpPath = path.join(OUTPUT_DIR, 'web', `${baseName}-${width}w.webp`);
        await sharp(inputPath)
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: QUALITY.web })
          .toFile(webpPath);

        // JPEG version
        const jpegPath = path.join(OUTPUT_DIR, 'web', `${baseName}-${width}w.jpg`);
        await sharp(inputPath)
          .resize(width, null, { withoutEnlargement: true })
          .jpeg({ quality: QUALITY.web, progressive: true })
          .toFile(jpegPath);
      }
    }

    // Also copy best web versions to public folder for immediate use
    const webPath = path.join(WEB_DIR, `${baseName}.jpg`);
    await sharp(inputPath)
      .resize(1920, null, { withoutEnlargement: true })
      .jpeg({ quality: QUALITY.web, progressive: true })
      .toFile(webPath);

    console.log(`✓ Processed ${filename}`);
    return processedPath;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}

// Extract frame from video
async function processVideo(inputPath, filename) {
  const baseName = path.basename(filename, path.extname(filename));

  try {
    console.log(`Processing video: ${filename}`);

    // Copy original
    const origPath = path.join(OUTPUT_DIR, 'originals', filename);
    await fs.copyFile(inputPath, origPath);

    // Try to extract a frame using ffmpeg if available
    const framePath = path.join(OUTPUT_DIR, 'processed', `${baseName}-frame.jpg`);

    try {
      // Extract frame at 1 second mark
      await execAsync(`ffmpeg -i "${inputPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${framePath}" 2>/dev/null`);
      console.log(`✓ Extracted frame from ${filename}`);

      // Process the extracted frame as an image
      await processImage(framePath, `${baseName}-frame.jpg`);
    } catch (ffmpegError) {
      console.log(`⚠ Couldn't extract frame from ${filename} (ffmpeg not available)`);
    }

    return framePath;
  } catch (error) {
    console.error(`Error processing video ${filename}:`, error.message);
    return null;
  }
}

// Main processing function
async function processAllImages() {
  console.log('Starting image processing...\n');

  // Create directories
  await createDirectories();

  // Get all files
  const files = await fs.readdir(SOURCE_DIR);
  const imageFiles = files.filter(f => isImage(f) || isVideo(f));

  console.log(`Found ${imageFiles.length} media files to process\n`);

  let processedCount = 0;
  let heicCount = 0;
  let imageCount = 0;
  let videoCount = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(SOURCE_DIR, file);
    const stats = await fs.stat(inputPath);

    if (!stats.isFile()) continue;

    let result;

    if (isHEIC(file)) {
      heicCount++;
      result = await processHEIC(inputPath, file);
      // If HEIC was converted successfully, process the resulting JPG
      if (result) {
        await processImage(result, path.basename(result));
      }
    } else if (isVideo(file)) {
      videoCount++;
      result = await processVideo(inputPath, file);
    } else if (isImage(file)) {
      imageCount++;
      result = await processImage(inputPath, file);
    }

    if (result) processedCount++;

    // Add small delay to avoid overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(50));
  console.log('Processing complete!');
  console.log(`- HEIC files: ${heicCount}`);
  console.log(`- Regular images: ${imageCount}`);
  console.log(`- Videos: ${videoCount}`);
  console.log(`- Successfully processed: ${processedCount}`);
  console.log('\nOutput locations:');
  console.log(`- Originals backed up: ${path.join(OUTPUT_DIR, 'originals')}`);
  console.log(`- Processed images: ${path.join(OUTPUT_DIR, 'processed')}`);
  console.log(`- Web versions: ${path.join(OUTPUT_DIR, 'web')}`);
  console.log(`- Ready for site: ${WEB_DIR}`);
}

// Run the processing
processAllImages().catch(console.error);