#!/usr/bin/env node

/**
 * Copy Comprehensive Sitemap to Dist
 * Ensures the complete sitemap with all blog articles is deployed
 */

const fs = require('fs');
const path = require('path');

function copySitemap() {
  console.log('📋 COPYING COMPREHENSIVE SITEMAP');
  console.log('=================================');
  
  const sourceSitemap = path.join(__dirname, '../public/sitemap.xml');
  const distDir = path.join(__dirname, '../dist');
  const targetSitemap = path.join(distDir, 'sitemap.xml');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✅ Created dist directory');
  }
  
  // Check if source sitemap exists
  if (!fs.existsSync(sourceSitemap)) {
    console.error('❌ Source sitemap not found:', sourceSitemap);
    process.exit(1);
  }
  
  try {
    // Read and validate source sitemap
    const sitemapContent = fs.readFileSync(sourceSitemap, 'utf8');

    // Basic validation
    if (!sitemapContent.includes('<?xml')) {
      console.error('❌ Invalid sitemap format');
      process.exit(1);
    }

    // Count URLs in sitemap
    const urlMatches = sitemapContent.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;

    if (urlCount < 10) {
      console.warn(`⚠️ Warning: Only ${urlCount} URLs found in sitemap`);
    }

    // Copy sitemap to dist
    fs.writeFileSync(targetSitemap, sitemapContent);

    console.log(`✅ Sitemap copied successfully`);
    console.log(`📊 URLs included: ${urlCount}`);
    console.log(`📁 Source: ${sourceSitemap}`);
    console.log(`📁 Target: ${targetSitemap}`);

    // Copy additional sitemaps: index, blog, images
    const extraFiles = ['sitemap-index.xml', 'sitemap-blog.xml'];
    extraFiles.forEach((name) => {
      const src = path.join(__dirname, '../public', name);
      const dest = path.join(distDir, name);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✅ ${name} copied`);
      }
    });

    // Also copy robots.txt if it exists
    const sourceRobots = path.join(__dirname, '../public/robots.txt');
    const targetRobots = path.join(distDir, 'robots.txt');

    if (fs.existsSync(sourceRobots)) {
      fs.copyFileSync(sourceRobots, targetRobots);
      console.log('✅ robots.txt copied');
    }

    // Copy blog-index.json
    const sourceBlogIndex = path.join(__dirname, '../public/blog-index.json');
    const targetBlogIndex = path.join(distDir, 'blog-index.json');

    if (fs.existsSync(sourceBlogIndex)) {
      fs.copyFileSync(sourceBlogIndex, targetBlogIndex);
      console.log('✅ blog-index.json copied');
    }

    console.log('\n🎉 SITEMAP DEPLOYMENT READY!');

  } catch (error) {
    console.error('❌ Error copying sitemap:', error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  copySitemap();
}

module.exports = { copySitemap };
