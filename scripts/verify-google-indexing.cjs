#!/usr/bin/env node

/**
 * Google Indexing Verification Script
 * Comprehensive check to ensure your site is properly configured for Google indexing
 */

const fs = require('fs');
const path = require('path');

function checkSitemapStructure() {
  console.log('🗺️ SITEMAP STRUCTURE CHECK');
  console.log('===========================');
  
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ Sitemap not found at public/sitemap.xml');
    return false;
  }
  
  try {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Basic XML validation
    if (!sitemapContent.includes('<?xml version="1.0"')) {
      console.error('❌ Invalid XML declaration');
      return false;
    }
    
    if (!sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      console.error('❌ Missing or invalid urlset declaration');
      return false;
    }
    
    // Count URLs
    const urlMatches = sitemapContent.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    
    console.log(`✅ Sitemap XML structure valid`);
    console.log(`📊 Total URLs: ${urlCount}`);
    
    // Check for essential pages
    const essentialPages = [
      'https://currencytocurrency.app/',
      'https://currencytocurrency.app/convert',
      'https://currencytocurrency.app/blog',
      'https://currencytocurrency.app/charts'
    ];
    
    let missingPages = 0;
    essentialPages.forEach(page => {
      if (!sitemapContent.includes(page)) {
        console.warn(`⚠️ Missing essential page: ${page}`);
        missingPages++;
      }
    });
    
    if (missingPages === 0) {
      console.log('✅ All essential pages present');
    }
    
    // Check for blog articles
    const blogMatches = sitemapContent.match(/\/blog\/[^<]+/g);
    const blogCount = blogMatches ? blogMatches.length : 0;
    console.log(`📝 Blog articles: ${blogCount}`);
    
    if (blogCount < 20) {
      console.warn(`⚠️ Low blog article count: ${blogCount} (expected 25+)`);
    } else {
      console.log('✅ Good blog article coverage');
    }
    
    // Check for proper lastmod dates
    const lastmodMatches = sitemapContent.match(/<lastmod>([^<]+)<\/lastmod>/g);
    if (lastmodMatches && lastmodMatches.length > 0) {
      console.log('✅ Last modification dates present');
    } else {
      console.warn('⚠️ Missing lastmod dates');
    }
    
    // Check for priority settings
    const priorityMatches = sitemapContent.match(/<priority>([^<]+)<\/priority>/g);
    if (priorityMatches && priorityMatches.length > 0) {
      console.log('✅ Priority settings configured');
    } else {
      console.warn('⚠️ Missing priority settings');
    }
    
    return urlCount >= 20;
    
  } catch (error) {
    console.error('❌ Error reading sitemap:', error.message);
    return false;
  }
}

function checkRobotsTxt() {
  console.log('\n🤖 ROBOTS.TXT CHECK');
  console.log('===================');
  
  const robotsPath = path.join(__dirname, '../public/robots.txt');
  
  if (!fs.existsSync(robotsPath)) {
    console.error('❌ robots.txt not found');
    return false;
  }
  
  try {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    
    // Check for sitemap declaration
    if (!robotsContent.includes('Sitemap: https://currencytocurrency.app/sitemap.xml')) {
      console.error('❌ Sitemap not declared in robots.txt');
      return false;
    }
    
    // Check for Google bot allowance
    if (!robotsContent.includes('User-agent: Googlebot') || 
        !robotsContent.includes('Allow: /')) {
      console.error('❌ Googlebot not properly allowed');
      return false;
    }
    
    // Check for general allowance
    if (!robotsContent.includes('User-agent: *') || 
        !robotsContent.includes('Allow: /')) {
      console.error('❌ General bot access not properly configured');
      return false;
    }
    
    console.log('✅ robots.txt properly configured');
    console.log('✅ Googlebot allowed');
    console.log('✅ Sitemap declared');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error reading robots.txt:', error.message);
    return false;
  }
}

function checkBlogIndex() {
  console.log('\n📚 BLOG INDEX CHECK');
  console.log('===================');
  
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  
  if (!fs.existsSync(blogIndexPath)) {
    console.warn('⚠️ blog-index.json not found');
    return false;
  }
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    
    console.log(`📊 Blog articles in index: ${blogData.length}`);
    
    if (blogData.length < 20) {
      console.warn(`⚠️ Low article count: ${blogData.length}`);
    } else {
      console.log('✅ Good article coverage');
    }
    
    // Check for required fields
    let validArticles = 0;
    blogData.forEach((article, index) => {
      if (article.title && article.slug && article.publishDate) {
        validArticles++;
      } else {
        console.warn(`⚠️ Article ${index + 1} missing required fields`);
      }
    });
    
    console.log(`✅ Valid articles: ${validArticles}/${blogData.length}`);
    
    return validArticles === blogData.length;
    
  } catch (error) {
    console.error('❌ Error reading blog index:', error.message);
    return false;
  }
}

function checkSchemaMarkup() {
  console.log('\n📋 SCHEMA MARKUP CHECK');
  console.log('======================');
  
  const contentDir = path.join(__dirname, '../src/content/blog');
  
  if (!fs.existsSync(contentDir)) {
    console.warn('⚠️ Blog content directory not found');
    return false;
  }
  
  try {
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
    let articlesWithSchema = 0;
    let articlesWithFAQ = 0;
    
    files.forEach(file => {
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('"@context": "https://schema.org"')) {
        articlesWithSchema++;
        
        if (content.includes('"@type": "FAQPage"')) {
          articlesWithFAQ++;
        }
      }
    });
    
    console.log(`📊 Total articles: ${files.length}`);
    console.log(`✅ Articles with schema: ${articlesWithSchema}`);
    console.log(`📋 Articles with FAQ schema: ${articlesWithFAQ}`);
    
    const schemaPercentage = Math.round((articlesWithSchema / files.length) * 100);
    console.log(`📈 Schema coverage: ${schemaPercentage}%`);
    
    if (schemaPercentage >= 90) {
      console.log('✅ Excellent schema coverage');
      return true;
    } else if (schemaPercentage >= 70) {
      console.log('⚠️ Good schema coverage, room for improvement');
      return true;
    } else {
      console.warn('❌ Poor schema coverage');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error checking schema markup:', error.message);
    return false;
  }
}

function generateIndexingReport() {
  console.log('\n📊 GOOGLE INDEXING READINESS REPORT');
  console.log('====================================');
  
  const checks = [
    { name: 'Sitemap Structure', fn: checkSitemapStructure },
    { name: 'Robots.txt Configuration', fn: checkRobotsTxt },
    { name: 'Blog Index', fn: checkBlogIndex },
    { name: 'Schema Markup', fn: checkSchemaMarkup }
  ];
  
  const results = [];
  let totalScore = 0;
  
  checks.forEach(check => {
    const passed = check.fn();
    results.push({ name: check.name, passed });
    if (passed) totalScore += 25;
  });
  
  console.log('\n🎯 FINAL RESULTS:');
  console.log('=================');
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.passed ? 'PASS' : 'FAIL'}`);
  });
  
  console.log(`\n📈 Overall Score: ${totalScore}/100`);
  
  if (totalScore >= 90) {
    console.log('🎉 EXCELLENT! Your site is ready for Google indexing');
  } else if (totalScore >= 70) {
    console.log('👍 GOOD! Minor improvements needed');
  } else {
    console.log('⚠️ NEEDS WORK! Several issues need attention');
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('===================');
  
  if (totalScore < 100) {
    console.log('1. Submit sitemap to Google Search Console');
    console.log('2. Request indexing for key pages');
    console.log('3. Monitor crawl errors in Search Console');
    console.log('4. Check for mobile-friendliness');
    console.log('5. Verify page loading speed');
  }
  
  console.log('\n🔗 USEFUL TOOLS:');
  console.log('================');
  console.log('• Google Search Console: https://search.google.com/search-console');
  console.log('• Rich Results Test: https://search.google.com/test/rich-results');
  console.log('• Mobile-Friendly Test: https://search.google.com/test/mobile-friendly');
  console.log('• PageSpeed Insights: https://pagespeed.web.dev/');
  
  return totalScore >= 70;
}

// Main execution
function main() {
  console.log('🔍 GOOGLE INDEXING VERIFICATION');
  console.log('================================\n');
  
  const success = generateIndexingReport();
  
  if (success) {
    console.log('\n🚀 Your site is ready for Google indexing!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Please address the issues above before expecting good indexing');
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { 
  checkSitemapStructure, 
  checkRobotsTxt, 
  checkBlogIndex, 
  checkSchemaMarkup,
  generateIndexingReport 
};
