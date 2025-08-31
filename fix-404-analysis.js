// 404 Analysis Script for currencytocurrency.app
// This script identifies URLs in sitemap that don't have corresponding files

// URLs from sitemap.xml that are blog posts
const sitemapBlogUrls = [
  'currency-exchange-freelancers-guide',
  'digital-nomad-currency-management',
  'ai-forex-trading-beginners-guide-2025',
  'what-are-exchange-rates-complete-beginners-guide',
  'currency-hedging-small-business',
  'travel-money-budgeting-strategies',
  'currency-exchange-fees-comparison',
  'international-money-transfer-guide-2025',
  'currency-volatility-protection-strategies',
  'cbdc-complete-guide-2025',
  'forex-trading-psychology-guide',
  'business-currency-exchange-guide',
  'forex-brokers-guide-2025',
  'ai-forex-trading-research-2025',
  'freelancer-currency-expanded-guide',
  'digital-nomad-currency-expanded',
  'usd-eur-forecast-2025',
  'currency-codes-guide-iso-4217',
  'real-time-vs-historical-exchange-rates',
  'mobile-currency-security-guide',
  'best-currency-exchange-sites-2025',
  'north-america-travel-money-2025'
];

// Actual blog files (extracted from directory listing)
const actualBlogFiles = [
  '2025-01-20-what-156-fiat-536-crypto-currencies-means-for-global-users-impact-and-insights',
  '2025-01-21-currency-to-currency-vs-leading-alternatives-feature-by-feature-comparison',
  '2025-01-21-historical-currency-charts-why-they-matter-for-traders-travelers',
  '2025-08-26-best-currency-converter-apps-for-accurate-real-time-exchange-rates-in-2025',
  '2025-08-26-effective-currency-exchange-strategies-for-businesses',
  'ai-forex-trading-for-beginners-complete-2025-guide-to-automated-trading',
  'best-currency-exchange-rates-comparison-2025',
  'central-bank-digital-currencies-cbdcs-complete-guide-to-the-future-of-money',
  'comparing-currency-converter-apps-features-fees-and-user-reviews',
  'currency-exchange-for-international-business-complete-guide-to-multi-currency-operations',
  'currency-exchange-freelancers-guide',
  'currency-volatility-protection-advanced-hedging-strategies-for-individual-investors',
  'digital-nomad-currency-management-complete-guide',
  'forex-trading-psychology-master-the-mental-game-for-consistent-profits',
  'fx-broker-review-research-competitive-analysis',
  'how-to-use-currency-converter-apis-for-real-time-exchange-rates',
  'international-business-currency-strategy-guide',
  'international-money-transfer-guide-2025-complete-comparison-of-15-services',
  'real-time-exchange-rate-analysis-trading-guide',
  'the-complete-guide-to-forex-brokers-2025-expert-reviews-star-ratings',
  'the-top-10-best-currency-converter-apps-in-2025',
  'ultimate-currency-conversion-guide-2025',
  'ultimate-guide-choosing-best-currency-converter-app-2025',
  'understanding-currency-conversion-a-comprehensive-guide'
];

console.log('=== 404 ANALYSIS FOR CURRENCYTOCURRENCY.APP ===\n');

// Find URLs in sitemap that don't have corresponding files
const missing404s = sitemapBlogUrls.filter(url => {
  // Check if there's a matching file (exact match or similar)
  const exactMatch = actualBlogFiles.includes(url);
  const similarMatch = actualBlogFiles.some(file => 
    file.includes(url.replace(/-/g, '')) || 
    url.replace(/-/g, '').includes(file.replace(/-/g, ''))
  );
  return !exactMatch && !similarMatch;
});

console.log(`FOUND ${missing404s.length} POTENTIAL 404 ERRORS:\n`);

missing404s.forEach((url, index) => {
  console.log(`${index + 1}. https://currencytocurrency.app/blog/${url}`);
});

console.log('\n=== RECOMMENDATIONS ===\n');

console.log('1. REMOVE FROM SITEMAP:');
console.log('   Remove these URLs from sitemap.xml as they don\'t have corresponding files\n');

console.log('2. CREATE MISSING CONTENT:');
console.log('   Or create blog posts for these high-value keywords:\n');

const highValueKeywords = [
  'what-are-exchange-rates-complete-beginners-guide',
  'currency-hedging-small-business', 
  'travel-money-budgeting-strategies',
  'currency-exchange-fees-comparison',
  'usd-eur-forecast-2025',
  'currency-codes-guide-iso-4217',
  'mobile-currency-security-guide',
  'best-currency-exchange-sites-2025'
];

highValueKeywords.forEach(keyword => {
  if (missing404s.includes(keyword)) {
    console.log(`   - ${keyword} (High search volume)`);
  }
});

console.log('\n3. SITEMAP CLEANUP:');
console.log('   Update sitemap.xml to only include existing pages\n');

console.log('4. REDIRECT SETUP:');
console.log('   Set up 301 redirects for any external links pointing to missing pages\n');

// Generate corrected sitemap blog section
console.log('=== CORRECTED SITEMAP BLOG SECTION ===\n');

actualBlogFiles.forEach(file => {
  const slug = file.replace(/\.md$/, '');
  console.log(`  <url>`);
  console.log(`    <loc>https://currencytocurrency.app/blog/${slug}</loc>`);
  console.log(`    <lastmod>2025-08-31</lastmod>`);
  console.log(`    <changefreq>weekly</changefreq>`);
  console.log(`    <priority>0.9</priority>`);
  console.log(`  </url>\n`);
});

console.log('\n=== SUMMARY ===');
console.log(`Total blog URLs in sitemap: ${sitemapBlogUrls.length}`);
console.log(`Actual blog files: ${actualBlogFiles.length}`);
console.log(`404 errors found: ${missing404s.length}`);
console.log(`Match rate: ${((sitemapBlogUrls.length - missing404s.length) / sitemapBlogUrls.length * 100).toFixed(1)}%`);
