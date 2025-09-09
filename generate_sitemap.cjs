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

// Define static pages with their priorities and change frequencies (simple sitemap entries only)
const staticPages = [
  { url: 'https://currencytocurrency.app/', lastmod: TODAY, changefreq: 'daily', priority: '1.0' },
  { url: 'https://currencytocurrency.app/convert', lastmod: TODAY, changefreq: 'daily', priority: '0.9' },
  { url: 'https://currencytocurrency.app/charts', lastmod: TODAY, changefreq: 'daily', priority: '0.9' },
  { url: 'https://currencytocurrency.app/alerts', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { url: 'https://currencytocurrency.app/travel', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { url: 'https://currencytocurrency.app/blog', lastmod: TODAY, changefreq: 'weekly', priority: '0.8' },
  { url: 'https://currencytocurrency.app/faq', lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
  { url: 'https://currencytocurrency.app/privacy-policy', lastmod: TODAY, changefreq: 'yearly', priority: '0.3' },
  { url: 'https://currencytocurrency.app/terms-of-service', lastmod: TODAY, changefreq: 'yearly', priority: '0.3' }
];

// Popular currency conversion pages
const currencyPairs = [
  'usd-to-eur', 'usd-to-gbp', 'usd-to-jpy', 'eur-to-gbp', 'usd-to-cad',
  'usd-to-aud', 'gbp-to-usd', 'eur-to-usd', 'jpy-to-usd', 'aud-to-usd',
  'usd-to-chf', 'eur-to-jpy', 'cad-to-usd', 'chf-to-usd', 'usd-to-nzd',
  'nzd-to-usd'
];

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

// Add blog posts
blogPosts.forEach(post => {
  const priority = post.featured ? '0.9' : '0.8';
  const changefreq = post.featured ? 'weekly' : 'monthly';
  
  sitemapContent += `  <url>
    <loc>https://currencytocurrency.app/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>

`;
});

// Add currency conversion pages
currencyPairs.forEach(pair => {
  sitemapContent += `  <url>
    <loc>https://currencytocurrency.app/convert/${pair}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

`;
});

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
    <loc>https://currencytocurrency.app/sitemap-images.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`;

fs.writeFileSync('public/sitemap-index.xml', sitemapIndexContent);

console.log('✅ Generated sitemaps:');
console.log(`   - Main sitemap: ${staticPages.length + currencyPairs.length} static pages`);
console.log(`   - Blog sitemap: ${blogPosts.length} blog posts`);
console.log(`   - Total URLs: ${staticPages.length + currencyPairs.length + blogPosts.length}`);
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

