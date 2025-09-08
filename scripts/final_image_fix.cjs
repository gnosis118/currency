#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Final fix for the remaining 10 placeholder images
 * Assigns unique images from the unused assets pool
 */

console.log('🎯 FINAL IMAGE FIX - ELIMINATING PLACEHOLDERS');
console.log('=============================================');

// Mapping for the remaining 10 placeholder posts with unique unused images
const finalImageMap = {
  'ultimate-guide-choosing-best-currency-converter-app-2025': '/src/assets/xe-currency-data.jpg',
  'ultimate-currency-conversion-guide-2025': '/src/assets/exchange-rates-guide.jpg',
  'real-time-exchange-rate-analysis-trading-guide': '/src/assets/oanda-trading.jpg',
  'international-business-currency-strategy-guide': '/src/assets/business-currency-exchange-2025.png',
  'fx-broker-review-research-competitive-analysis': '/src/assets/forex-broker-comparison-2025.png',
  'forex-trading-psychology-master-the-mental-game-for-consistent-profits': '/src/assets/forex-trading-psychology-2025.jpg',
  'currency-exchange-for-international-business-complete-guide-to-multi-currency-operations': '/src/assets/business-laptop-currency.jpg',
  'currency-arbitrage-for-digital-nomads-legal-ways-to-profit-from-rate-differences': '/src/assets/currency-arbitrage-profit.jpg',
  'central-bank-digital-currencies-cbdcs-vs-your-wallet-what-changes-in-2025-2026': '/src/assets/cbdc-complete-guide-2025.png',
  '2025-08-26-best-currency-converter-apps-for-accurate-real-time-exchange-rates-in-2025': '/src/assets/wise-money-transfer.jpg'
};

function fixPlaceholderImages() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  let fixedCount = 0;
  let errorCount = 0;

  console.log(`🔧 Processing ${Object.keys(finalImageMap).length} placeholder posts...`);

  for (const [slug, imagePath] of Object.entries(finalImageMap)) {
    const filename = slug + '.md';
    const filePath = path.join(blogDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      errorCount++;
      continue;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace placeholder with unique image
      const originalContent = content;
      content = content.replace(
        /^image:\s*"\/placeholder\.svg"$/gm,
        `image: "${imagePath}"`
      );
      
      // If no replacement was made, try to add the image property
      if (content === originalContent) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const restOfContent = content.substring(frontmatterMatch[0].length);
          const newFrontmatter = frontmatter + `\nimage: "${imagePath}"`;
          content = `---\n${newFrontmatter}\n---${restOfContent}`;
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed placeholder in: ${slug}`);
        fixedCount++;
      } else {
        console.log(`⚠️  No placeholder found in: ${slug}`);
      }
      
    } catch (error) {
      console.error(`❌ Error fixing ${filename}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 FINAL FIX SUMMARY:');
  console.log('=====================');
  console.log(`✅ Placeholders fixed: ${fixedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  
  return fixedCount > 0;
}

function validateImageUniqueness() {
  console.log('\n🔍 VALIDATING FINAL IMAGE UNIQUENESS...');
  
  // Get all assigned images
  const allImages = Object.values(finalImageMap);
  const uniqueImages = new Set(allImages);
  
  if (allImages.length === uniqueImages.size) {
    console.log('✅ All final images are unique!');
    return true;
  } else {
    console.log('❌ Duplicate images found in final mapping!');
    const duplicates = allImages.filter((item, index) => allImages.indexOf(item) !== index);
    console.log('Duplicates:', [...new Set(duplicates)]);
    return false;
  }
}

// Main execution
console.log('🎯 Step 1: Validate image uniqueness in mapping...');
const isUnique = validateImageUniqueness();

if (!isUnique) {
  console.log('❌ Aborting due to duplicate images in mapping');
  process.exit(1);
}

console.log('\n🎯 Step 2: Fix placeholder images...');
const success = fixPlaceholderImages();

if (success) {
  console.log('\n🎯 Step 3: Regenerating blog index...');
  try {
    const { execSync } = require('child_process');
    execSync('node scripts/generate_blog_index.mjs', { stdio: 'inherit' });
    console.log('✅ Blog index regenerated');
    
    console.log('\n🎯 Step 4: Running final validation...');
    execSync('node scripts/validate_unique_images.cjs', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ Error in post-processing:', error.message);
  }
} else {
  console.log('\n⚠️  No changes made');
}
