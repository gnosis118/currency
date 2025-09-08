#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Mass fix for all blog post images - handles all frontmatter patterns
 */

console.log('🚀 MASS BLOG IMAGE FIX');
console.log('======================');

// Complete unique image mapping for all remaining files
const remainingImageMap = {
  'how-real-time-currency-rates-work-fluctuations-explained-fast': '/src/assets/realtime-vs-historical-rates.jpg',
  'the-15-minute-currency-window-why-exchange-rates-change-most-during-these-daily-periods-explained': '/src/assets/currency-codes-guide.jpg',
  'ultimate-currency-conversion-guide-2025': '/src/assets/exchange-rates-guide.jpg',
  'ultimate-guide-choosing-best-currency-converter-app-2025': '/src/assets/xe-currency-data.jpg',
  'real-time-exchange-rate-analysis-trading-guide': '/src/assets/oanda-trading.jpg',
  'international-business-currency-strategy-guide': '/src/assets/business-currency-exchange-2025.png',
  'fx-broker-review-research-competitive-analysis': '/src/assets/forex-broker-comparison-2025.png',
  'forex-trading-psychology-master-the-mental-game-for-consistent-profits': '/src/assets/forex-trading-psychology-2025.jpg',
  'currency-exchange-for-international-business-complete-guide-to-multi-currency-operations': '/src/assets/business-laptop-currency.jpg',
  'currency-arbitrage-for-digital-nomads-legal-ways-to-profit-from-rate-differences': '/src/assets/currency-arbitrage-profit.jpg',
  'central-bank-digital-currencies-cbdcs-vs-your-wallet-what-changes-in-2025-2026': '/src/assets/cbdc-complete-guide-2025.png',
  '2025-01-21-currency-conversion-tax-traps-irs-rules-international-freelancers-miss': '/src/assets/financial-expert-predictions.jpg',
  '2025-01-21-currency-to-currency-vs-leading-alternatives-feature-by-feature-comparison': '/src/assets/currency-comparison.jpg',
  '2025-01-21-historical-currency-charts-why-they-matter-for-traders-travelers': '/src/assets/charts-hero.jpg',
  '2025-01-21-the-geopolitical-currency-map-how-elections-and-trade-wars-move-exchange-rates': '/src/assets/trump-tariffs-currency-impact.jpg',
  '2025-08-19-currency-safety-and-security-protecting-your-money-in-global-markets': '/src/assets/currency-safety-hero.jpg',
};

function massFixBlogImages() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  let fixedCount = 0;
  let errorCount = 0;

  console.log(`📁 Processing ${files.length} blog files...`);

  files.forEach(filename => {
    const filePath = path.join(blogDir, filename);
    const slug = filename.replace('.md', '');
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let wasModified = false;

      // Fix malformed frontmatter patterns
      if (content.includes('---schema:')) {
        content = content.replace(/---schema:/g, '---\nschema:');
        wasModified = true;
      }

      // Replace external images with local ones if we have a mapping
      if (remainingImageMap[slug]) {
        const targetImage = remainingImageMap[slug];
        
        // Replace any existing image property
        content = content.replace(
          /^(featuredImage|image|cover):\s*.*$/gm,
          `image: "${targetImage}"`
        );
        
        // If no image property exists, add it to frontmatter
        if (!content.match(/^(featuredImage|image|cover):/gm)) {
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const restOfContent = content.substring(frontmatterMatch[0].length);
            const newFrontmatter = frontmatter + `\nimage: "${targetImage}"`;
            content = `---\n${newFrontmatter}\n---${restOfContent}`;
          }
        }
        wasModified = true;
      }

      // Replace any remaining external images with placeholders (to be caught by validation)
      if (content.includes('https://koala.sh/')) {
        content = content.replace(
          /^(featuredImage|image|cover):\s*"https:\/\/koala\.sh\/.*"$/gm,
          'image: "/placeholder.svg"'
        );
        wasModified = true;
      }

      if (wasModified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${slug}`);
        fixedCount++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n📊 MASS FIX SUMMARY:');
  console.log('====================');
  console.log(`✅ Files fixed: ${fixedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total files processed: ${files.length}`);
  
  return fixedCount > 0;
}

// Run the mass fix
const success = massFixBlogImages();

if (success) {
  console.log('\n🎯 Running validation to check results...');
  
  // Regenerate blog index
  try {
    const { execSync } = require('child_process');
    execSync('node scripts/generate_blog_index.mjs', { stdio: 'inherit' });
    console.log('✅ Blog index regenerated');
  } catch (error) {
    console.error('❌ Error regenerating blog index:', error.message);
  }
} else {
  console.log('\n⚠️  No changes made');
}
