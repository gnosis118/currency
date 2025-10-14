#!/usr/bin/env node

/**
 * Dynamic Sitemap Generator for Currency to Currency
 * Generates sitemaps with current dates instead of static dates
 * Run this script during build process to ensure fresh sitemaps
 */

const fs = require('fs');
const path = require('path');

// Get current date in ISO format
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Popular currency pairs for conversion pages
const popularPairs = [
  'usd-to-eur', 'eur-to-usd', 'usd-to-gbp', 'gbp-to-usd',
  'usd-to-jpy', 'jpy-to-usd', 'usd-to-cad', 'cad-to-usd',
  'usd-to-aud', 'aud-to-usd', 'usd-to-chf', 'chf-to-usd',
  'usd-to-cny', 'cny-to-usd', 'usd-to-inr', 'inr-to-usd',
  'eur-to-gbp', 'gbp-to-eur', 'eur-to-jpy', 'jpy-to-eur',
  'gbp-to-jpy', 'jpy-to-gbp', 'aud-to-nzd', 'nzd-to-aud',
  'usd-to-krw', 'krw-to-usd', 'usd-to-mxn', 'mxn-to-usd',
  'usd-to-brl', 'brl-to-usd', 'usd-to-zar', 'zar-to-usd'
];

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/convert', priority: '0.9', changefreq: 'daily' },
  { url: '/blog', priority: '0.8', changefreq: 'weekly' },
  { url: '/charts', priority: '0.7', changefreq: 'daily' },
  { url: '/alerts', priority: '0.7', changefreq: 'weekly' },
  { url: '/travel', priority: '0.7', changefreq: 'weekly' },
  { url: '/brokers', priority: '0.6', changefreq: 'weekly' },
  { url: '/faq', priority: '0.6', changefreq: 'monthly' },
  { url: '/about', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/help', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' }
];

// Generate main sitemap
function generateMainSitemap() {
  const currentDate = getCurrentDate();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>https://currencytocurrency.app${page.url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate convert pages sitemap
function generateConvertSitemap() {
  const currentDate = getCurrentDate();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  popularPairs.forEach(pair => {
    xml += '  <url>\n';
    xml += `    <loc>https://currencytocurrency.app/convert/${pair}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate blog sitemap (placeholder - update with actual blog posts)
function generateBlogSitemap() {
  const currentDate = getCurrentDate();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
  xml += 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" ';
  xml += 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  
  // Example blog posts - replace with actual blog post data
  const blogPosts = [
    'understanding-exchange-rates',
    'best-time-to-exchange-currency',
    'cryptocurrency-vs-fiat',
    'travel-money-tips',
    'forex-trading-basics'
  ];
  
  blogPosts.forEach(slug => {
    xml += '  <url>\n';
    xml += `    <loc>https://currencytocurrency.app/blog/${slug}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate sitemap index
function generateSitemapIndex() {
  const currentDate = getCurrentDate();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  const sitemaps = [
    'sitemap.xml',
    'sitemap-convert.xml',
    'sitemap-blog.xml'
  ];
  
  sitemaps.forEach(sitemap => {
    xml += '  <sitemap>\n';
    xml += `    <loc>https://currencytocurrency.app/${sitemap}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });
  
  xml += '</sitemapindex>';
  
  return xml;
}

// Write sitemaps to public directory
function writeSitemaps() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  try {
    // Generate and write sitemap index
    const sitemapIndex = generateSitemapIndex();
    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);
    console.log('✅ Generated sitemap-index.xml');
    
    // Generate and write main sitemap
    const mainSitemap = generateMainSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap);
    console.log('✅ Generated sitemap.xml');
    
    // Generate and write convert sitemap
    const convertSitemap = generateConvertSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap-convert.xml'), convertSitemap);
    console.log('✅ Generated sitemap-convert.xml');
    
    // Generate and write blog sitemap
    const blogSitemap = generateBlogSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogSitemap);
    console.log('✅ Generated sitemap-blog.xml');
    
    console.log('\n🎉 All sitemaps generated successfully with current date:', getCurrentDate());
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  console.log('🚀 Generating dynamic sitemaps...\n');
  writeSitemaps();
}

module.exports = {
  generateMainSitemap,
  generateConvertSitemap,
  generateBlogSitemap,
  generateSitemapIndex,
  writeSitemaps
};

