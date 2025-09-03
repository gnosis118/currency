const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is available, if not install it
try {
  require('sharp');
} catch (error) {
  console.log('Installing sharp for image conversion...');
  execSync('npm install sharp', { stdio: 'inherit' });
}

const sharp = require('sharp');

const assetsDir = path.join(__dirname, '../src/assets');
const publicDir = path.join(__dirname, '../public');

// Image formats to convert
const imageFormats = ['.jpg', '.jpeg', '.png'];
const excludeFormats = ['.webp', '.svg', '.ico'];

// Function to convert image to WebP
async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to convert ${inputPath}:`, error.message);
    return false;
  }
}

// Function to process directory
async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let convertedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      convertedCount += await processDirectory(filePath);
    } else {
      const ext = path.extname(file).toLowerCase();
      
      // Check if file should be converted
      if (imageFormats.includes(ext) && !excludeFormats.includes(ext)) {
        const baseName = path.basename(file, ext);
        const webpPath = path.join(dir, `${baseName}.webp`);
        
        // Only convert if WebP doesn't already exist or if original is newer
        if (!fs.existsSync(webpPath) || stat.mtime > fs.statSync(webpPath).mtime) {
          const success = await convertToWebP(filePath, webpPath);
          if (success) convertedCount++;
        } else {
          console.log(`⏭️  Skipped: ${file} (WebP already exists and is up to date)`);
        }
      }
    }
  }
  
  return convertedCount;
}

// Main execution
async function main() {
  console.log('🚀 Starting image conversion to WebP format...\n');
  
  let totalConverted = 0;
  
  // Process assets directory
  if (fs.existsSync(assetsDir)) {
    console.log('📁 Processing src/assets directory...');
    totalConverted += await processDirectory(assetsDir);
  }
  
  // Process public directory
  if (fs.existsSync(publicDir)) {
    console.log('\n📁 Processing public directory...');
    totalConverted += await processDirectory(publicDir);
  }
  
  console.log(`\n🎉 Conversion complete! ${totalConverted} images converted to WebP format.`);
  
  if (totalConverted > 0) {
    console.log('\n💡 Next steps:');
    console.log('1. Update your components to use WebP images with fallbacks');
    console.log('2. Test the images in different browsers');
    console.log('3. Consider removing original images if WebP is widely supported');
  }
}

// Run the conversion
main().catch(console.error);
