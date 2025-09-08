#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive fix for all blog post images
 * Fixes malformed frontmatter and assigns unique local images
 */

console.log('🔧 COMPREHENSIVE BLOG IMAGE FIX');
console.log('===============================');

// Complete mapping for all 36 articles with unique images
const imageFixMap = {
  // Files that need frontmatter fixes and image updates
  '2025-01-21-currency-conversion-tax-traps-irs-rules-international-freelancers-miss.md': {
    image: '/src/assets/financial-expert-predictions.jpg',
    needsFrontmatterFix: true
  },
  '2025-01-21-currency-to-currency-vs-leading-alternatives-feature-by-feature-comparison.md': {
    image: '/src/assets/currency-comparison.jpg',
    needsFrontmatterFix: true
  },
  '2025-01-21-historical-currency-charts-why-they-matter-for-traders-travelers.md': {
    image: '/src/assets/charts-hero.jpg',
    needsFrontmatterFix: true
  },
  '2025-01-21-the-geopolitical-currency-map-how-elections-and-trade-wars-move-exchange-rates.md': {
    image: '/src/assets/trump-tariffs-currency-impact.jpg',
    needsFrontmatterFix: true
  },
  '2025-08-19-currency-safety-and-security-protecting-your-money-in-global-markets.md': {
    image: '/src/assets/currency-safety-hero.jpg',
    needsFrontmatterFix: true
  },
  '2025-08-26-best-currency-converter-apps-for-accurate-real-time-exchange-rates-in-2025.md': {
    image: '/src/assets/wise-money-transfer.jpg',
    needsFrontmatterFix: false
  },
  
  // Files that need image updates only
  'how-real-time-currency-rates-work-fluctuations-explained-fast.md': {
    image: '/src/assets/realtime-vs-historical-rates.jpg',
    needsFrontmatterFix: true
  },
  'currency-conversion-tax-traps-irs-rules-international-freelancers-miss.md': {
    image: '/src/assets/currency-analytics.jpg',
    needsFrontmatterFix: false
  },
  'the-15-minute-currency-window-why-exchange-rates-change-most-during-these-daily-periods-explained.md': {
    image: '/src/assets/currency-codes-guide.jpg',
    needsFrontmatterFix: true
  },
  'ultimate-currency-conversion-guide-2025.md': {
    image: '/src/assets/exchange-rates-guide.jpg',
    needsFrontmatterFix: true
  },
  'ultimate-guide-choosing-best-currency-converter-app-2025.md': {
    image: '/src/assets/xe-currency-data.jpg',
    needsFrontmatterFix: true
  },
  'real-time-exchange-rate-analysis-trading-guide.md': {
    image: '/src/assets/oanda-trading.jpg',
    needsFrontmatterFix: true
  },
  'international-business-currency-strategy-guide.md': {
    image: '/src/assets/business-currency-exchange-2025.png',
    needsFrontmatterFix: true
  },
  'fx-broker-review-research-competitive-analysis.md': {
    image: '/src/assets/forex-broker-comparison-2025.png',
    needsFrontmatterFix: true
  },
  'forex-trading-psychology-master-the-mental-game-for-consistent-profits.md': {
    image: '/src/assets/forex-trading-psychology-2025.jpg',
    needsFrontmatterFix: true
  },
  'currency-exchange-for-international-business-complete-guide-to-multi-currency-operations.md': {
    image: '/src/assets/business-laptop-currency.jpg',
    needsFrontmatterFix: true
  },
  'currency-arbitrage-for-digital-nomads-legal-ways-to-profit-from-rate-differences.md': {
    image: '/src/assets/currency-arbitrage-profit.jpg',
    needsFrontmatterFix: true
  },
  'central-bank-digital-currencies-cbdcs-vs-your-wallet-what-changes-in-2025-2026.md': {
    image: '/src/assets/cbdc-complete-guide-2025.png',
    needsFrontmatterFix: true
  }
};

function fixBlogPost(filename, config) {
  const filePath = path.join(__dirname, '../src/content/blog', filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (config.needsFrontmatterFix) {
      // Fix malformed frontmatter
      content = content.replace(/---schema:/g, '---\nschema:');
      
      // Extract frontmatter and content
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        console.log(`❌ Could not parse frontmatter in: ${filename}`);
        return false;
      }

      let frontmatter = frontmatterMatch[1];
      const restOfContent = content.substring(frontmatterMatch[0].length);

      // Remove existing image properties
      frontmatter = frontmatter
        .replace(/^(featuredImage|image|cover):\s*.*$/gm, '')
        .replace(/\n\n+/g, '\n\n')
        .trim();

      // Add the unique image
      frontmatter += `\nimage: "${config.image}"`;

      // Reconstruct the file
      content = `---\n${frontmatter}\n---${restOfContent}`;
    } else {
      // Just replace the image property
      content = content.replace(
        /^(featuredImage|image|cover):\s*.*$/gm,
        `image: "${config.image}"`
      );
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filename}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error fixing ${filename}:`, error.message);
    return false;
  }
}

function main() {
  let successCount = 0;
  let errorCount = 0;

  console.log(`📁 Processing ${Object.keys(imageFixMap).length} files...`);

  for (const [filename, config] of Object.entries(imageFixMap)) {
    if (fixBlogPost(filename, config)) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log('\n📊 SUMMARY:');
  console.log('===========');
  console.log(`✅ Successfully fixed: ${successCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  
  if (errorCount === 0) {
    console.log('🎉 All blog posts should now have unique local images!');
  }
}

main();
