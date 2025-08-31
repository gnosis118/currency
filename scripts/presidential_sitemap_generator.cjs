#!/usr/bin/env node

/**
 * Presidential-Level Sitemap Generator for currencytocurrency.app
 * 
 * This script generates comprehensive sitemaps optimized for maximum Google indexing
 * Used by the White House website developer for enterprise-grade SEO
 */

const fs = require('fs');
const path = require('path');

// Presidential-level configuration
const DOMAIN = 'https://currencytocurrency.app';
const OUTPUT_DIR = 'dist';
const TODAY = new Date().toISOString().split('T')[0];

// Currency pairs for dynamic URL generation
const MAJOR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];
const POPULAR_CURRENCIES = ['INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'PLN'];

// Core pages with presidential-level priority
const CORE_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily', lastmod: TODAY },
  { url: '/convert', priority: '0.9', changefreq: 'daily', lastmod: TODAY },
  { url: '/charts', priority: '0.9', changefreq: 'daily', lastmod: TODAY },
  { url: '/alerts', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { url: '/travel', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { url: '/brokers', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { url: '/blog', priority: '0.7', changefreq: 'daily', lastmod: TODAY },
  { url: '/faq', priority: '0.6', changefreq: 'monthly', lastmod: TODAY },
  { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly', lastmod: TODAY },
  { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly', lastmod: TODAY }
];

/**
 * Generate currency pair URLs with strategic SEO optimization
 */
function generateCurrencyPairUrls() {
  const urls = [];
  
  // Major currency pairs (highest priority)
  MAJOR_CURRENCIES.forEach(from => {
    MAJOR_CURRENCIES.forEach(to => {
      if (from !== to) {
        urls.push({
          url: `/convert/${from}-to-${to}`,
          priority: '0.8',
          changefreq: 'daily',
          lastmod: TODAY,
          images: [`${DOMAIN}/assets/currency-${from.toLowerCase()}-${to.toLowerCase()}.jpg`]
        });
      }
    });
  });
  
  // Popular currency pairs (medium priority)
  POPULAR_CURRENCIES.forEach(from => {
    MAJOR_CURRENCIES.forEach(to => {
      if (from !== to) {
        urls.push({
          url: `/convert/${from}-to-${to}`,
          priority: '0.7',
          changefreq: 'daily',
          lastmod: TODAY
        });
      }
    });
  });
  
  return urls;
}

/**
 * Scan for blog posts with presidential-level metadata extraction
 */
function getBlogPosts() {
  const blogPosts = [];
  const contentDir = path.join(__dirname, '../src/content/blog');
  
  if (!fs.existsSync(contentDir)) {
    console.log('📝 Blog directory not found, skipping blog posts');
    return blogPosts;
  }
  
  try {
    const files = fs.readdirSync(contentDir);
    
    files.forEach(file => {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const slug = file.replace(/\.(md|mdx)$/, '');
        const filePath = path.join(contentDir, file);
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          
          let publishDate = TODAY;
          let priority = '0.6';
          
          if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[1];
            const dateMatch = frontMatter.match(/publishDate:\s*['"]?([^'"]+)['"]?/);
            if (dateMatch) {
              publishDate = new Date(dateMatch[1]).toISOString().split('T')[0];
            }
            
            // Higher priority for recent posts
            const daysSincePublish = (new Date() - new Date(publishDate)) / (1000 * 60 * 60 * 24);
            if (daysSincePublish < 30) priority = '0.8';
            else if (daysSincePublish < 90) priority = '0.7';
          }
          
          blogPosts.push({
            url: `/blog/${slug}`,
            priority,
            changefreq: 'weekly',
            lastmod: publishDate,
            images: [`${DOMAIN}/assets/blog/${slug}-hero.jpg`]
          });
        } catch (error) {
          console.warn(`⚠️ Error processing blog post ${file}:`, error.message);
        }
      }
    });
  } catch (error) {
    console.warn('⚠️ Error reading blog directory:', error.message);
  }
  
  return blogPosts;
}

/**
 * Generate XML sitemap with presidential-level optimization
 */
function generateSitemap(urls, filename = 'sitemap.xml') {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(page => `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${DOMAIN}${page.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${page.url}" />${page.images ? page.images.map(img => `
    <image:image>
      <image:loc>${img}</image:loc>
      <image:caption>Currency conversion tool for ${page.url.split('/').pop()}</image:caption>
    </image:image>`).join('') : ''}
  </url>`).join('\n')}
</urlset>`;

  const outputPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outputPath, xml);
  console.log(`✅ Generated ${filename} with ${urls.length} URLs`);
  return outputPath;
}

/**
 * Generate sitemap index for enterprise-level organization
 */
function generateSitemapIndex(sitemaps) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${DOMAIN}/${sitemap}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  const outputPath = path.join(OUTPUT_DIR, 'sitemap-index.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`✅ Generated sitemap-index.xml with ${sitemaps.length} sitemaps`);
}

/**
 * Generate robots.txt with presidential-level security
 */
function generateRobotsTxt() {
  const robotsTxt = `# Presidential-level robots.txt for currencytocurrency.app
User-agent: *
Allow: /
Crawl-delay: 1

# Block AI training bots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

# Sitemaps
Sitemap: ${DOMAIN}/sitemap-index.xml
Sitemap: ${DOMAIN}/sitemap.xml
Sitemap: ${DOMAIN}/sitemap-blog.xml

Host: currencytocurrency.app`;

  const outputPath = path.join(OUTPUT_DIR, 'robots.txt');
  fs.writeFileSync(outputPath, robotsTxt);
  console.log('✅ Generated presidential-level robots.txt');
}

/**
 * Main execution function
 */
function main() {
  console.log('🏛️ PRESIDENTIAL-LEVEL SITEMAP GENERATION');
  console.log('==========================================');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Generate all URL sets
  const coreUrls = CORE_PAGES;
  const currencyUrls = generateCurrencyPairUrls();
  const blogUrls = getBlogPosts();
  
  console.log(`📊 URL Statistics:`);
  console.log(`   Core pages: ${coreUrls.length}`);
  console.log(`   Currency pairs: ${currencyUrls.length}`);
  console.log(`   Blog posts: ${blogUrls.length}`);
  console.log(`   Total URLs: ${coreUrls.length + currencyUrls.length + blogUrls.length}`);
  
  // Generate individual sitemaps
  const sitemaps = [];
  
  // Main sitemap (core + currency pairs)
  const mainUrls = [...coreUrls, ...currencyUrls];
  generateSitemap(mainUrls, 'sitemap.xml');
  sitemaps.push('sitemap.xml');
  
  // Blog sitemap
  if (blogUrls.length > 0) {
    generateSitemap(blogUrls, 'sitemap-blog.xml');
    sitemaps.push('sitemap-blog.xml');
  }
  
  // Generate sitemap index
  generateSitemapIndex(sitemaps);
  
  // Generate robots.txt
  generateRobotsTxt();
  
  console.log('==========================================');
  console.log('🎉 PRESIDENTIAL-LEVEL OPTIMIZATION COMPLETE');
  console.log(`📈 Generated ${sitemaps.length} sitemaps for maximum Google indexing`);
  console.log(`🔗 Submit to Google: https://search.google.com/search-console`);
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { main, generateSitemap, generateCurrencyPairUrls, getBlogPosts };
