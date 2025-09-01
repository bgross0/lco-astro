import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function optimizeLogo() {
  const inputPath = join(__dirname, '../public/lco-final.png');
  const outputPath = join(__dirname, '../public/lco-optimized.png');
  
  try {
    // Optimize the logo - resize to reasonable dimensions and compress
    await sharp(inputPath)
      .resize(300, 300, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .png({ 
        quality: 85,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true
      })
      .toFile(outputPath);
    
    console.log('Logo optimized successfully!');
    console.log('Original can be backed up, and lco-optimized.png can be renamed to lco-final.png');
  } catch (error) {
    console.error('Error optimizing logo:', error);
  }
}

optimizeLogo();