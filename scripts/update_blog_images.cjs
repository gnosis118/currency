#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Updates all blog post frontmatter with unique local images
 * Removes external images and ensures each article has a unique image
 */

console.log('🖼️ UPDATING BLOG POST IMAGES');
console.log('=============================');

// Unique image mapping for all 36 articles
const uniqueImageMap = {
  // Currency Analysis & Guides (8 articles)
  'strongest-currencies-in-the-world-whos-winning-the-fx-race': '/src/assets/global-finance.jpg',
  'how-real-time-currency-rates-work-fluctuations-explained-fast': '/src/assets/realtime-vs-historical-rates.jpg',
  'currency-conversion-tax-traps-irs-rules-international-freelancers-miss': '/src/assets/currency-analytics.jpg',
  '2025-01-20-what-156-fiat-536-crypto-currencies-means-for-global-users-impact-and-insights': '/src/assets/economic-trends-global.jpg',
  'understanding-currency-conversion-a-comprehensive-guide': '/src/assets/currency-calculator-guide.jpg',
  'ultimate-currency-conversion-guide-2025': '/src/assets/exchange-rates-guide.jpg',
  'the-15-minute-currency-window-why-exchange-rates-change-most-during-these-daily-periods-explained': '/src/assets/currency-codes-guide.jpg',
  '2025-01-21-currency-to-currency-vs-leading-alternatives-feature-by-feature-comparison': '/src/assets/currency-comparison.jpg',

  // Trading & Forex (6 articles)
  'forex-currency-pairs-complete-trading-guide-2025': '/src/assets/forex-risk-management-2025.png',
  'forex-trading-psychology-master-the-mental-game-for-consistent-profits': '/src/assets/forex-trading-psychology-2025.jpg',
  'ai-forex-trading-for-beginners-complete-2025-guide-to-automated-trading': '/src/assets/ai-forex-trading-guide-2025.jpg',
  'the-complete-guide-to-forex-brokers-2025-expert-reviews-star-ratings': '/src/assets/broker-comparison-table-chart-2025.png',
  'fx-broker-review-research-competitive-analysis': '/src/assets/forex-broker-comparison-2025.png',
  'real-time-exchange-rate-analysis-trading-guide': '/src/assets/oanda-trading.jpg',

  // Business & International (4 articles)
  'international-business-currency-strategy-guide': '/src/assets/business-currency-exchange-2025.png',
  '2025-08-26-effective-currency-exchange-strategies-for-businesses': '/src/assets/business-currency-exchange-strategies-2025.png',
  'currency-exchange-for-international-business-complete-guide-to-multi-currency-operations': '/src/assets/business-laptop-currency.jpg',
  'international-money-transfer-guide-2025-complete-comparison-of-15-services': '/src/assets/international-money-transfer-2025.jpeg',

  // Digital Nomad & Freelancer (3 articles)
  'digital-nomad-currency-management-complete-guide': '/src/assets/digital-nomad-laptop.jpg',
  'currency-exchange-freelancers-guide': '/src/assets/freelancer-currency-exchange.jpeg',
  'currency-arbitrage-for-digital-nomads-legal-ways-to-profit-from-rate-differences': '/src/assets/currency-arbitrage-profit.jpg',

  // Apps & Technology (5 articles)
  '2025-08-26-best-currency-converter-apps-for-accurate-real-time-exchange-rates-in-2025': '/src/assets/wise-money-transfer.jpg',
  'ultimate-guide-choosing-best-currency-converter-app-2025': '/src/assets/xe-currency-data.jpg',
  'the-top-10-best-currency-converter-apps-in-2025': '/src/assets/mobile-currency-security.jpg',
  'comparing-currency-converter-apps-features-fees-and-user-reviews': '/src/assets/financial-technology-circuit.jpg',
  'how-to-use-currency-converter-apis-for-real-time-exchange-rates': '/src/assets/business-software-code.jpg',

  // Risk Management & Security (3 articles)
  'currency-volatility-protection-advanced-hedging-strategies-for-individual-investors': '/src/assets/currency-volatility-domino.jpg',
  'currency-safety-and-security-protecting-your-money-in-global-markets': '/src/assets/currency-safety-hero.jpg',
  'hidden-currency-conversion-fees-how-banks-disguise-charges': '/src/assets/bank-exchange-fees.jpg',

  // Digital Currency & Crypto (3 articles)
  'central-bank-digital-currencies-cbdcs-complete-guide-to-the-future-of-money': '/src/assets/cbdc-guide-2025.jpg',
  'central-bank-digital-currencies-cbdcs-vs-your-wallet-what-changes-in-2025-2026': '/src/assets/cbdc-complete-guide-2025.png',
  '2025-01-21-cryptocurrency-as-currency-hedging-bitcoin-inflation-protection': '/src/assets/bitcoin-vs-traditional-currency.jpg',

  // Comparison & Reviews (6 articles)
  'best-currency-exchange-rates-comparison-2025': '/src/assets/bank-vs-online-exchange.png',
  '2025-01-21-historical-currency-charts-why-they-matter-for-traders-travelers': '/src/assets/charts-hero.jpg',
  '2025-01-21-the-geopolitical-currency-map-how-elections-and-trade-wars-move-exchange-rates': '/src/assets/trump-tariffs-currency-impact.jpg',
  '2025-01-21-currency-conversion-tax-traps-irs-rules-international-freelancers-miss': '/src/assets/financial-expert-predictions.jpg',
  '2025-08-19-currency-safety-and-security-protecting-your-money-in-global-markets': '/src/assets/currency-safety-hero.jpg',
  '2025-08-26-best-currency-converter-apps-for-accurate-real-time-exchange-rates-in-2025': '/src/assets/wise-money-transfer.jpg',
};

function updateBlogPostImages() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  console.log(`📁 Found ${files.length} blog post files`);
  
  let updatedCount = 0;
  let errorCount = 0;

  files.forEach(filename => {
    const filePath = path.join(blogDir, filename);
    const slug = filename.replace('.md', '');
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if this slug has a unique image mapping
      if (!uniqueImageMap[slug]) {
        console.log(`⚠️  No unique image mapping for: ${slug}`);
        return;
      }

      const uniqueImage = uniqueImageMap[slug];
      
      // Parse frontmatter - handle both normal and malformed cases
      let frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      // Handle malformed frontmatter like "---schema:"
      if (!frontmatterMatch) {
        frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---schema:/);
        if (frontmatterMatch) {
          // Fix the malformed frontmatter
          const frontmatter = frontmatterMatch[1];
          const restOfContent = content.substring(frontmatterMatch[0].length - 7); // Keep "schema:"
          const fixedContent = `---\n${frontmatter}\n---\nschema:${restOfContent}`;
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          console.log(`🔧 Fixed malformed frontmatter in: ${filename}`);
          // Re-read the fixed content
          const newContent = fs.readFileSync(filePath, 'utf8');
          frontmatterMatch = newContent.match(/^---\n([\s\S]*?)\n---/);
        }
      }

      if (!frontmatterMatch) {
        console.log(`⚠️  No frontmatter found in: ${filename}`);
        return;
      }

      let frontmatter = frontmatterMatch[1];
      const restOfContent = content.substring(frontmatterMatch[0].length);

      // Remove existing image/featuredImage properties
      frontmatter = frontmatter
        .replace(/^(featuredImage|image|cover):\s*.*$/gm, '')
        .replace(/\n\n+/g, '\n\n')
        .trim();

      // Add the unique image
      frontmatter += `\nimage: "${uniqueImage}"`;

      // Reconstruct the file
      const newContent = `---\n${frontmatter}\n---${restOfContent}`;
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Updated: ${slug}`);
      updatedCount++;
      
    } catch (error) {
      console.error(`❌ Error updating ${filename}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n📊 SUMMARY:');
  console.log('===========');
  console.log(`✅ Successfully updated: ${updatedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`📝 Total unique images assigned: ${Object.keys(uniqueImageMap).length}`);
  
  // Validate uniqueness
  const imageValues = Object.values(uniqueImageMap);
  const uniqueImages = new Set(imageValues);
  
  if (imageValues.length === uniqueImages.size) {
    console.log('🎉 SUCCESS: All images are unique!');
  } else {
    console.log('⚠️  WARNING: Some images are duplicated!');
    
    // Find duplicates
    const duplicates = imageValues.filter((item, index) => imageValues.indexOf(item) !== index);
    console.log('Duplicate images:', [...new Set(duplicates)]);
  }
}

// Main execution
updateBlogPostImages();
