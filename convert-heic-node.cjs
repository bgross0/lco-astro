const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function installHeicConvert() {
  try {
    require.resolve('heic-convert');
    return true;
  } catch {
    console.log('Installing heic-convert package...');
    try {
      await exec('npm install heic-convert');
      return true;
    } catch (error) {
      console.error('Failed to install heic-convert:', error.message);
      return false;
    }
  }
}

async function convertHeicFile(inputPath, outputPath) {
  try {
    const convert = require('heic-convert');

    const inputBuffer = await fs.readFile(inputPath);

    // Convert HEIC to JPEG
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.95
    });

    await fs.writeFile(outputPath, outputBuffer);
    return true;
  } catch (error) {
    // If heic-convert fails, try a fallback method
    return false;
  }
}

async function processAllHeicFiles() {
  const sourceDir = '/home/ben/Documents/GitHub/lco-astro/lco-photos';
  const outputDir = '/home/ben/Documents/GitHub/lco-astro/lco-photos-converted';

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Get all HEIC files
  const files = await fs.readdir(sourceDir);
  const heicFiles = files.filter(f => /\.(heic|HEIC)$/i.test(f));

  console.log(`Found ${heicFiles.length} HEIC files to convert\n`);

  let converted = 0;
  let failed = 0;

  for (let i = 0; i < heicFiles.length; i++) {
    const file = heicFiles[i];
    const inputPath = path.join(sourceDir, file);
    const outputName = file.replace(/\.(heic|HEIC)$/i, '.jpg');
    const outputPath = path.join(outputDir, outputName);

    // Check if already converted
    try {
      await fs.access(outputPath);
      console.log(`[${i+1}/${heicFiles.length}] ${file} - already converted`);
      converted++;
      continue;
    } catch {}

    process.stdout.write(`[${i+1}/${heicFiles.length}] Converting ${file}... `);

    if (await convertHeicFile(inputPath, outputPath)) {
      const stats = await fs.stat(outputPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
      console.log(`✓ (${sizeMB} MB)`);
      converted++;
    } else {
      // Try using sips on Mac or other system tools
      try {
        // Try sips (Mac)
        await exec(`sips -s format jpeg "${inputPath}" --out "${outputPath}" 2>/dev/null`);
        console.log('✓ (sips)');
        converted++;
      } catch {
        // Try GraphicsMagick
        try {
          await exec(`gm convert "${inputPath}" -quality 95 "${outputPath}" 2>/dev/null`);
          console.log('✓ (gm)');
          converted++;
        } catch {
          console.log('✗');
          failed++;
        }
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Conversion complete!');
  console.log(`  Successfully converted: ${converted}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Output directory: ${outputDir}`);
}

async function main() {
  if (await installHeicConvert()) {
    await processAllHeicFiles();
  } else {
    console.log('Could not install heic-convert, trying system tools only...');
    await processAllHeicFiles();
  }
}

main().catch(console.error);