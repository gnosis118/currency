#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateXML(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic XML validation checks
    const checks = [
      {
        name: 'XML Declaration',
        test: () => content.startsWith('<?xml'),
        fix: 'File should start with <?xml version="1.0" encoding="UTF-8"?>'
      },
      {
        name: 'Root Element',
        test: () => content.includes('<urlset') && content.includes('</urlset>'),
        fix: 'File should have <urlset> root element'
      },
      {
        name: 'Unescaped Ampersands',
        test: () => !content.match(/&(?!amp;|lt;|gt;|quot;|apos;)/),
        fix: 'Replace & with &amp; in content'
      },
      {
        name: 'Balanced Tags',
        test: () => {
          const openTags = (content.match(/<[^\/][^>]*>/g) || []).length;
          const closeTags = (content.match(/<\/[^>]*>/g) || []).length;
          const selfClosing = (content.match(/<[^>]*\/>/g) || []).length;
          return openTags === closeTags + selfClosing;
        },
        fix: 'Ensure all opening tags have matching closing tags'
      }
    ];
    
    console.log(`🔍 Validating: ${path.basename(filePath)}`);
    console.log('================================');
    
    let allPassed = true;
    checks.forEach(check => {
      const passed = check.test();
      const icon = passed ? '✅' : '❌';
      console.log(`${icon} ${check.name}`);
      if (!passed) {
        console.log(`   Fix: ${check.fix}`);
        allPassed = false;
      }
    });
    
    // Count URLs
    const urlMatches = content.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    console.log(`📊 URLs found: ${urlCount}`);
    
    if (allPassed) {
      console.log('🎉 XML validation passed!');
    } else {
      console.log('⚠️  XML validation failed - see fixes above');
    }
    
    return allPassed;
    
  } catch (error) {
    console.error(`❌ Error reading file: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🗺️  SITEMAP XML VALIDATION');
  console.log('==========================\n');
  
  const sitemaps = [
    'public/sitemap.xml',
    'public/sitemap-blog.xml',
    'public/sitemap-index.xml',
    'public/sitemap-images.xml'
  ];
  
  let allValid = true;
  
  sitemaps.forEach(sitemap => {
    if (fs.existsSync(sitemap)) {
      const isValid = validateXML(sitemap);
      allValid = allValid && isValid;
      console.log('');
    } else {
      console.log(`⚠️  ${sitemap} not found`);
      console.log('');
    }
  });
  
  console.log('📋 SUMMARY');
  console.log('==========');
  if (allValid) {
    console.log('✅ All sitemaps are valid!');
    console.log('🚀 Ready to resubmit to Google Search Console');
  } else {
    console.log('❌ Some sitemaps have issues - fix them before resubmitting');
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateXML };
