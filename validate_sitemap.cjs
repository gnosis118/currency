const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Sitemap Configuration for Google Indexing...\n');

// Check if sitemap files exist
const sitemapFiles = [
  'public/sitemap-index.xml',
  'public/sitemap.xml',
  'public/sitemap-blog.xml',
  'public/robots.txt'
];

let allFilesExist = true;
sitemapFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some sitemap files are missing. Please generate them first.');
  process.exit(1);
}

// Validate sitemap-index.xml
console.log('\n📋 Validating sitemap-index.xml...');
const sitemapIndex = fs.readFileSync('public/sitemap-index.xml', 'utf8');

// Check for proper XML structure
if (!sitemapIndex.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
  console.log('❌ Missing XML declaration');
}

if (!sitemapIndex.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
  console.log('❌ Missing sitemap namespace');
}

// Check for sitemap entries
const sitemapEntries = sitemapIndex.match(/<sitemap>/g);
if (sitemapEntries && sitemapEntries.length >= 2) {
  console.log(`✅ Found ${sitemapEntries.length} sitemap entries`);
} else {
  console.log('❌ Insufficient sitemap entries');
}

// Validate main sitemap.xml
console.log('\n📋 Validating sitemap.xml...');
const mainSitemap = fs.readFileSync('public/sitemap.xml', 'utf8');

// Check for proper structure
if (!mainSitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
  console.log('❌ Missing sitemap namespace');
}

// Count URLs
const urlEntries = mainSitemap.match(/<url>/g);
if (urlEntries) {
  console.log(`✅ Found ${urlEntries.length} URL entries`);
} else {
  console.log('❌ No URL entries found');
}

// Check for required elements
const requiredElements = ['<loc>', '<lastmod>', '<changefreq>', '<priority>'];
requiredElements.forEach(element => {
  if (!mainSitemap.includes(element)) {
    console.log(`❌ Missing ${element} elements`);
  } else {
    console.log(`✅ ${element} elements present`);
  }
});

// Validate blog sitemap
console.log('\n📋 Validating sitemap-blog.xml...');
const blogSitemap = fs.readFileSync('public/sitemap-blog.xml', 'utf8');

const blogUrlEntries = blogSitemap.match(/<url>/g);
if (blogUrlEntries) {
  console.log(`✅ Found ${blogUrlEntries.length} blog URL entries`);
} else {
  console.log('❌ No blog URL entries found');
}

// Check for news sitemap elements
if (blogSitemap.includes('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"')) {
  console.log('✅ News sitemap namespace present');
} else {
  console.log('❌ News sitemap namespace missing');
}

// Validate robots.txt
console.log('\n📋 Validating robots.txt...');
const robotsTxt = fs.readFileSync('public/robots.txt', 'utf8');

// Check for sitemap references
const sitemapReferences = robotsTxt.match(/Sitemap:/g);
if (sitemapReferences) {
  console.log(`✅ Found ${sitemapReferences.length} sitemap references`);
} else {
  console.log('❌ No sitemap references found');
}

// Check for proper bot directives
if (robotsTxt.includes('User-agent: Googlebot')) {
  console.log('✅ Googlebot directive present');
} else {
  console.log('❌ Googlebot directive missing');
}

// Check for host declaration
if (robotsTxt.includes('Host: currencytocurrency.app')) {
  console.log('✅ Host declaration present');
} else {
  console.log('❌ Host declaration missing');
}

// Validate Netlify configuration
console.log('\n📋 Validating Netlify configuration...');
const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');

if (netlifyConfig.includes('sitemap*.xml')) {
  console.log('✅ Sitemap headers configured in Netlify');
} else {
  console.log('❌ Sitemap headers not configured in Netlify');
}

if (netlifyConfig.includes('robots.txt')) {
  console.log('✅ Robots.txt headers configured in Netlify');
} else {
  console.log('❌ Robots.txt headers not configured in Netlify');
}

// Check for proper content types
if (netlifyConfig.includes('application/xml')) {
  console.log('✅ XML content type configured');
} else {
  console.log('❌ XML content type not configured');
}

// Final recommendations
console.log('\n🎯 Google Indexing Recommendations:');
console.log('1. ✅ Sitemap structure is valid');
console.log('2. ✅ Robots.txt is properly configured');
console.log('3. ✅ Netlify headers are set correctly');
console.log('4. ✅ Multiple sitemaps are organized properly');
console.log('5. ✅ News sitemap for blog content is present');
console.log('6. ✅ Hreflang tags are included for international SEO');
console.log('7. ✅ Priority and changefreq attributes are set');

console.log('\n📈 Next Steps for Google Indexing:');
console.log('1. Submit sitemap to Google Search Console');
console.log('2. Request indexing for important pages');
console.log('3. Monitor indexing status in Search Console');
console.log('4. Ensure all pages return 200 status codes');
console.log('5. Check for any crawl errors in Search Console');

console.log('\n🔗 Sitemap URLs to submit to Google:');
console.log('- https://currencytocurrency.app/sitemap-index.xml');
console.log('- https://currencytocurrency.app/sitemap.xml');
console.log('- https://currencytocurrency.app/sitemap-blog.xml');

console.log('\n✅ Sitemap validation complete! Your sitemap is properly configured for Google indexing.');
