const fs = require('fs');
const path = require('path');

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
console.log(`Today's date: ${today}`);

// List of sitemap files to fix
const sitemapFiles = [
  'public/sitemap.xml',
  'public/sitemap-blog.xml',
  'public/sitemap-index.xml'
];

function fixSitemapDates(filePath) {
  try {
    console.log(`\nProcessing: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Find all dates in the format YYYY-MM-DD
    const dateRegex = /(\d{4}-\d{2}-\d{2})/g;
    const dates = content.match(dateRegex) || [];
    
    console.log(`Found dates: ${dates.join(', ')}`);
    
    // Replace any future dates with today's date
    content = content.replace(dateRegex, (match) => {
      if (match > today) {
        console.log(`Replacing future date ${match} with ${today}`);
        return today;
      }
      return match;
    });
    
    // Write the fixed content back to the file
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed dates in ${filePath}`);
    } else {
      console.log(`No future dates found in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Fix all sitemap files
sitemapFiles.forEach(fixSitemapDates);

console.log('\nSitemap date fixing completed!');

