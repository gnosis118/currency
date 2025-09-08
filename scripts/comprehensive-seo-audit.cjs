#!/usr/bin/env node

/**
 * Comprehensive SEO Audit & Fix Script
 * Ensures your website is fully optimized for Google indexing
 */

const fs = require('fs');
const path = require('path');

function auditSitemapDeployment() {
  console.log('🗺️ SITEMAP DEPLOYMENT AUDIT');
  console.log('============================');
  
  const issues = [];
  const fixes = [];
  
  // Check local sitemap
  const localSitemap = path.join(__dirname, '../public/sitemap.xml');
  if (!fs.existsSync(localSitemap)) {
    issues.push('❌ Local sitemap missing');
    return { issues, fixes, score: 0 };
  }
  
  const sitemapContent = fs.readFileSync(localSitemap, 'utf8');
  const urlMatches = sitemapContent.match(/<url>/g);
  const urlCount = urlMatches ? urlMatches.length : 0;
  
  console.log(`📊 Local sitemap URLs: ${urlCount}`);
  
  if (urlCount < 20) {
    issues.push(`❌ Low URL count in local sitemap: ${urlCount}`);
  } else {
    console.log('✅ Local sitemap has good URL coverage');
  }
  
  // Check for blog articles
  const blogMatches = sitemapContent.match(/\/blog\/[^<]+/g);
  const blogCount = blogMatches ? blogMatches.length : 0;
  console.log(`📝 Blog articles in sitemap: ${blogCount}`);
  
  if (blogCount < 20) {
    issues.push(`❌ Low blog article count: ${blogCount}`);
  } else {
    console.log('✅ Good blog article coverage');
  }
  
  // Check build process
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const postbuild = packageJson.scripts?.postbuild;
  
  if (postbuild?.includes('presidential_sitemap_generator')) {
    issues.push('❌ Build process using wrong sitemap generator');
    fixes.push('Fix: Update postbuild to use copy-sitemap.cjs');
  } else if (postbuild?.includes('copy-sitemap')) {
    console.log('✅ Build process correctly configured');
  } else {
    issues.push('❌ Build process not copying sitemap');
    fixes.push('Fix: Add copy-sitemap.cjs to postbuild');
  }
  
  const score = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 25));
  return { issues, fixes, score };
}

function auditRobotsTxt() {
  console.log('\n🤖 ROBOTS.TXT AUDIT');
  console.log('===================');
  
  const issues = [];
  const fixes = [];
  
  const robotsPath = path.join(__dirname, '../public/robots.txt');
  if (!fs.existsSync(robotsPath)) {
    issues.push('❌ robots.txt missing');
    return { issues, fixes, score: 0 };
  }
  
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  
  // Check for proper Googlebot allowance
  if (!robotsContent.includes('User-agent: Googlebot') || 
      !robotsContent.includes('Allow: /')) {
    issues.push('❌ Googlebot not properly allowed');
    fixes.push('Fix: Add explicit Googlebot Allow directive');
  } else {
    console.log('✅ Googlebot properly allowed');
  }
  
  // Check sitemap declaration
  const sitemapMatches = robotsContent.match(/Sitemap: https:\/\/currencytocurrency\.app\/sitemap[^.]*\.xml/g);
  if (!sitemapMatches) {
    issues.push('❌ No sitemap declared');
    fixes.push('Fix: Add sitemap declaration');
  } else if (sitemapMatches.length > 1) {
    issues.push('❌ Multiple sitemaps declared (should be one comprehensive)');
    fixes.push('Fix: Use single comprehensive sitemap');
  } else {
    console.log('✅ Sitemap properly declared');
  }
  
  // Check for AI bot blocking
  if (!robotsContent.includes('User-agent: GPTBot')) {
    issues.push('⚠️ AI training bots not blocked');
    fixes.push('Recommendation: Block AI training bots');
  } else {
    console.log('✅ AI training bots blocked');
  }
  
  const score = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 20));
  return { issues, fixes, score };
}

function auditSchemaMarkup() {
  console.log('\n📋 SCHEMA MARKUP AUDIT');
  console.log('======================');
  
  const issues = [];
  const fixes = [];
  
  const contentDir = path.join(__dirname, '../src/content/blog');
  if (!fs.existsSync(contentDir)) {
    issues.push('❌ Blog content directory missing');
    return { issues, fixes, score: 0 };
  }
  
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
  
  if (schemaPercentage < 70) {
    issues.push(`❌ Low schema coverage: ${schemaPercentage}%`);
    fixes.push('Fix: Run npm run schema:add to add schema markup');
  } else if (schemaPercentage < 90) {
    issues.push(`⚠️ Good but improvable schema coverage: ${schemaPercentage}%`);
    fixes.push('Recommendation: Add schema to remaining articles');
  } else {
    console.log('✅ Excellent schema coverage');
  }
  
  const score = schemaPercentage;
  return { issues, fixes, score };
}

function auditMetaTags() {
  console.log('\n🏷️ META TAGS AUDIT');
  console.log('==================');
  
  const issues = [];
  const fixes = [];
  
  // Check main pages for meta tags
  const pagesToCheck = [
    { file: 'src/pages/Index.tsx', name: 'Homepage' },
    { file: 'src/pages/Convert.tsx', name: 'Convert Page' },
    { file: 'src/pages/Blog.tsx', name: 'Blog Page' }
  ];
  
  let pagesWithMeta = 0;
  
  pagesToCheck.forEach(page => {
    const pagePath = path.join(__dirname, '..', page.file);
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');

      // Check for React-based SEO components or traditional meta tags
      if (content.includes('SEOHead') ||
          content.includes('<title>') ||
          content.includes('document.title') ||
          content.includes('title=') ||
          content.includes('description=')) {
        pagesWithMeta++;
        console.log(`✅ ${page.name} has SEO meta tags`);
      } else {
        issues.push(`❌ ${page.name} missing meta tags`);
        fixes.push(`Fix: Add meta tags to ${page.file}`);
      }
    } else {
      issues.push(`❌ ${page.name} file not found`);
    }
  });
  
  const score = Math.round((pagesWithMeta / pagesToCheck.length) * 100);
  return { issues, fixes, score };
}

function auditImageOptimization() {
  console.log('\n🖼️ IMAGE OPTIMIZATION AUDIT');
  console.log('===========================');
  
  const issues = [];
  const fixes = [];
  
  // Check blog images mapping
  const blogImagesPath = path.join(__dirname, '../src/assets/blog-images.ts');
  if (!fs.existsSync(blogImagesPath)) {
    issues.push('❌ Blog images mapping missing');
    fixes.push('Fix: Create blog images mapping file');
    return { issues, fixes, score: 0 };
  }
  
  const blogImagesContent = fs.readFileSync(blogImagesPath, 'utf8');
  
  // Check for syntax errors
  if (blogImagesContent.includes('import ') && blogImagesContent.includes('export {')) {
    console.log('✅ Blog images mapping properly structured');
  } else {
    issues.push('❌ Blog images mapping has structural issues');
    fixes.push('Fix: Repair blog images mapping structure');
  }
  
  // Count image imports
  const importMatches = blogImagesContent.match(/import .+ from '.+\.(jpg|jpeg|png|webp|svg)'/g);
  const importCount = importMatches ? importMatches.length : 0;
  console.log(`📊 Image imports: ${importCount}`);
  
  if (importCount < 20) {
    issues.push(`⚠️ Low image count: ${importCount}`);
    fixes.push('Recommendation: Add more optimized images');
  } else {
    console.log('✅ Good image coverage');
  }
  
  const score = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 25));
  return { issues, fixes, score };
}

function generateComprehensiveReport() {
  console.log('🔍 COMPREHENSIVE SEO AUDIT');
  console.log('===========================\n');
  
  const audits = [
    { name: 'Sitemap Deployment', fn: auditSitemapDeployment, weight: 30 },
    { name: 'Robots.txt Configuration', fn: auditRobotsTxt, weight: 20 },
    { name: 'Schema Markup', fn: auditSchemaMarkup, weight: 25 },
    { name: 'Meta Tags', fn: auditMetaTags, weight: 15 },
    { name: 'Image Optimization', fn: auditImageOptimization, weight: 10 }
  ];
  
  let totalScore = 0;
  let totalWeight = 0;
  const allIssues = [];
  const allFixes = [];
  
  audits.forEach(audit => {
    const result = audit.fn();
    const weightedScore = (result.score * audit.weight) / 100;
    totalScore += weightedScore;
    totalWeight += audit.weight;
    
    allIssues.push(...result.issues);
    allFixes.push(...result.fixes);
    
    console.log(`\n📊 ${audit.name}: ${result.score}/100 (Weight: ${audit.weight}%)`);
  });
  
  const finalScore = Math.round(totalScore);
  
  console.log('\n🎯 COMPREHENSIVE SEO REPORT');
  console.log('============================');
  console.log(`📈 Overall SEO Score: ${finalScore}/100`);
  
  if (finalScore >= 90) {
    console.log('🎉 EXCELLENT! Your site is SEO-optimized');
  } else if (finalScore >= 70) {
    console.log('👍 GOOD! Minor improvements needed');
  } else if (finalScore >= 50) {
    console.log('⚠️ NEEDS WORK! Several issues to address');
  } else {
    console.log('🚨 CRITICAL! Major SEO problems detected');
  }
  
  if (allIssues.length > 0) {
    console.log('\n❌ ISSUES FOUND:');
    allIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  if (allFixes.length > 0) {
    console.log('\n🔧 RECOMMENDED FIXES:');
    allFixes.forEach((fix, index) => {
      console.log(`${index + 1}. ${fix}`);
    });
  }
  
  console.log('\n📋 IMMEDIATE ACTION ITEMS:');
  console.log('1. Deploy the current fixes to resolve sitemap issues');
  console.log('2. Submit sitemap to Google Search Console');
  console.log('3. Request indexing for key pages');
  console.log('4. Monitor crawl errors and coverage');
  console.log('5. Test rich results with Google Rich Results Test');
  
  return finalScore >= 70;
}

// Main execution
function main() {
  const success = generateComprehensiveReport();
  
  if (success) {
    console.log('\n🚀 Your site is ready for optimal Google indexing!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Please address the critical issues before deployment');
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { 
  auditSitemapDeployment,
  auditRobotsTxt,
  auditSchemaMarkup,
  auditMetaTags,
  auditImageOptimization,
  generateComprehensiveReport
};
