const fs = require('fs');
const path = require('path');

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

console.log(`Updating all sitemaps to date: ${currentDate}\n`);

const sitemapFiles = [
  'public/sitemap.xml',
  'public/sitemap-blog.xml',
  'public/sitemap-convert.xml',
  'public/sitemap-images.xml',
  'public/sitemap-index.xml'
];

sitemapFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all date patterns (YYYY-MM-DD)
    const datePattern = /\d{4}-\d{2}-\d{2}/g;
    const updatedContent = content.replace(datePattern, currentDate);
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✓ Updated ${file}`);
  } else {
    console.log(`✗ File not found: ${file}`);
  }
});

console.log(`\n✓ All sitemaps updated successfully to ${currentDate}`);
console.log('\nNext steps:');
console.log('1. Submit updated sitemaps to Google Search Console');
console.log('2. Use IndexNow to notify search engines immediately');
console.log('3. Check that all 350+ pages are accessible and load properly');
