const fs = require('fs');
const path = require('path');

// Read blog posts data
const blogPostsContent = fs.readFileSync('src/data/blogPosts.ts', 'utf8');

// Extract blog post data using more robust regex patterns
const blogPosts = [];

// Split by object boundaries - look for objects starting with title, slug, etc.
const objectMatches = blogPostsContent.match(/{\s*title:\s*['"][^'"]+['"][\s\S]*?content:\s*`[\s\S]*?`\s*}/g);

if (objectMatches) {
  objectMatches.forEach(objStr => {
    const slugMatch = objStr.match(/slug:\s*['"]([^'"]+)['"]/);
    const titleMatch = objStr.match(/title:\s*['"]([^'"]+)['"]/);
    const dateMatch = objStr.match(/publishDate:\s*['"]([^'"]+)['"]/);
    const featuredMatch = objStr.match(/featured:\s*(true|false)/);

    if (slugMatch && titleMatch && dateMatch) {
      blogPosts.push({
        slug: slugMatch[1],
        title: titleMatch[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        date: dateMatch[1],
        featured: featuredMatch ? featuredMatch[1] === 'true' : false
      });
    }
  });
}

console.log(`Found ${blogPosts.length} blog posts`);
if (blogPosts.length > 0) {
  console.log('Sample posts:', blogPosts.slice(0, 3).map(p => p.slug));
}

// ISO date for lastmod
const TODAY = new Date().toISOString().split('T')[0];

// Define static pages with their priorities and change frequencies (ONLY canonical, indexable pages)
const staticPages = [
  { url: 'https://currencytocurrency.app/', lastmod: TODAY, changefreq: 'daily', priority: '1.0' },
  { url: 'https://currencytocurrency.app/convert', lastmod: TODAY, changefreq: 'daily', priority: '0.9' },
  { url: 'https://currencytocurrency.app/charts', lastmod: TODAY, changefreq: 'daily', priority: '0.9' },
  { url: 'https://currencytocurrency.app/alerts', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { url: 'https://currencytocurrency.app/travel', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { url: 'https://currencytocurrency.app/blog', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { url: 'https://currencytocurrency.app/faq', lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { url: 'https://currencytocurrency.app/about', lastmod: TODAY, changefreq: 'monthly', priority: '0.6' },
  { url: 'https://currencytocurrency.app/help', lastmod: TODAY, changefreq: 'monthly', priority: '0.6' },
  { url: 'https://currencytocurrency.app/contact', lastmod: TODAY, changefreq: 'monthly', priority: '0.6' },
  { url: 'https://currencytocurrency.app/privacy-policy', lastmod: TODAY, changefreq: 'yearly', priority: '0.3' },
  { url: 'https://currencytocurrency.app/terms-of-service', lastmod: TODAY, changefreq: 'yearly', priority: '0.3' },
  { url: 'https://currencytocurrency.app/privacy', lastmod: TODAY, changefreq: 'monthly', priority: '0.5' },
  { url: 'https://currencytocurrency.app/topics', lastmod: TODAY, changefreq: 'weekly', priority: '0.7' },
  { url: 'https://currencytocurrency.app/glossary', lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { url: 'https://currencytocurrency.app/brokers', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' }
];

// Generate popular currency conversion pages (bi-directional) from top currency list
const topCurrencies = ['USD','EUR','GBP','JPY','AUD','CAD','CHF','NZD','CNY','INR','SEK','NOK','ZAR','MXN','SGD','HKD'];
const currencyPairs = [];
for (const from of topCurrencies) {
  for (const to of topCurrencies) {
    if (from !== to) currencyPairs.push(`${from.toLowerCase()}-to-${to.toLowerCase()}`);
  }
}

// Generate main sitemap
let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

`;

// Add static pages
staticPages.forEach(page => {
  sitemapContent += `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>

`;
});

// Do not include blog posts or currency pairs here to avoid duplication.
// Blog posts and convert pairs are included in their dedicated sitemaps.

sitemapContent += `</urlset>`;

// Write the main sitemap
fs.writeFileSync('public/sitemap.xml', sitemapContent);

// Create a separate blog sitemap for better organization
let blogSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

`;

blogPosts.forEach(post => {
  const priority = post.featured ? '0.9' : '0.8';

  blogSitemapContent += `  <url>
    <loc>https://currencytocurrency.app/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>

`;
});

blogSitemapContent += `</urlset>`;

// Create a separate convert sitemap for currency pairs
let convertSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

`;

currencyPairs.forEach(pair => {
  convertSitemapContent += `  <url>
    <loc>https://currencytocurrency.app/convert/${pair}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

`;
});

convertSitemapContent += `</urlset>`;

fs.writeFileSync('public/sitemap-convert.xml', convertSitemapContent);

fs.writeFileSync('public/sitemap-blog.xml', blogSitemapContent);

// Create sitemap index
const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://currencytocurrency.app/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://currencytocurrency.app/sitemap-blog.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://currencytocurrency.app/sitemap-convert.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>

</sitemapindex>`;

fs.writeFileSync('public/sitemap-index.xml', sitemapIndexContent);

console.log('✅ Generated sitemaps:');
console.log(`   - Main sitemap: ${staticPages.length + blogPosts.length + currencyPairs.length} URLs`);
console.log(`   - Blog sitemap: ${blogPosts.length} blog posts`);
console.log(`   - Convert sitemap: ${currencyPairs.length} currency pairs`);
console.log(`   - Total unique URLs (by design): ${staticPages.length + blogPosts.length + currencyPairs.length}`);
console.log('   - Sitemap index created');

// Validate XML structure
try {
  const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
  if (xml.includes('<?xml') && xml.includes('<urlset') && xml.includes('</urlset>')) {
    console.log('✅ XML structure validation passed');
  } else {
    console.log('❌ XML structure validation failed');
  }
} catch (error) {
  console.log('❌ Error validating XML:', error.message);
}

