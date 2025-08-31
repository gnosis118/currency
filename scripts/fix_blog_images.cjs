#!/usr/bin/env node

/**
 * Blog Image Optimization Script
 * Fixes broken image paths and ensures all blog posts have valid images
 */

const fs = require('fs');
const path = require('path');

// Available assets mapping
const availableAssets = {
  // Currency & Exchange
  'currency-conversion-guide-2025.jpg': 'exchange-rates-guide.jpg',
  'best-exchange-rates-2025.jpg': 'currency-comparison.jpg',
  'digital-nomad-currency-guide.jpg': 'digital-nomad-laptop.jpg',
  'real-time-exchange-rate-analysis.jpg': 'realtime-vs-historical-rates.jpg',
  'international-business-currency-strategy.jpg': 'business-currency-exchange-2025.png',
  
  // Trading & AI
  'ai-forex-trading-guide-2025.jpg': 'ai-forex-trading-guide-2025.jpg',
  'forex-trading-psychology-2025.jpg': 'forex-trading-psychology-2025.jpg',
  'broker-comparison-2025.png': 'broker-comparison-table-chart-2025.png',
  
  // Business & Finance
  'business-currency-strategies.jpg': 'business-currency-exchange-strategies-2025.png',
  'currency-volatility-protection.jpg': 'currency-volatility-domino.jpg',
  'international-money-transfer.jpg': 'international-money-transfer-2025.jpeg',
  
  // Technology & Apps
  'currency-converter-apps.jpg': 'currency-comparison.jpg',
  'currency-apis.jpg': 'business-software-code.jpg',
  
  // Travel & Nomad
  'travel-money-guide.jpg': 'travel-money-management-2025.jpg',
  'nomad-banking.jpg': 'nomad-remote-work.jpg',
  
  // Default fallbacks
  'default-currency.jpg': 'currency-analytics.jpg',
  'default-business.jpg': 'business-laptop-currency.jpg',
  'default-trading.jpg': 'forex-trading-psychology-2025.jpg',
  'default-technology.jpg': 'financial-technology-circuit.jpg'
};

function fixBlogImages() {
  console.log('🖼️ FIXING BLOG IMAGES');
  console.log('=====================');
  
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  
  if (!fs.existsSync(blogIndexPath)) {
    console.error('❌ blog-index.json not found');
    return false;
  }
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    let fixedCount = 0;
    let totalPosts = blogData.length;
    
    console.log(`📊 Processing ${totalPosts} blog posts...`);
    
    blogData.forEach((post, index) => {
      const originalImage = post.image;
      let newImage = originalImage;
      let wasFixed = false;
      
      // Fix broken /images/blog/ paths
      if (originalImage && originalImage.includes('/images/blog/')) {
        const filename = originalImage.split('/').pop();
        const baseName = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
        
        // Try to find a matching asset
        let matchedAsset = null;
        
        // Direct filename match
        if (availableAssets[filename]) {
          matchedAsset = availableAssets[filename];
        }
        // Partial name match
        else {
          for (const [key, value] of Object.entries(availableAssets)) {
            if (key.includes(baseName) || baseName.includes(key.replace(/\.(jpg|jpeg|png|webp)$/i, ''))) {
              matchedAsset = value;
              break;
            }
          }
        }
        
        // Category-based fallback
        if (!matchedAsset) {
          const category = post.category?.toLowerCase() || '';
          if (category.includes('business') || category.includes('finance')) {
            matchedAsset = 'business-currency-exchange-2025.png';
          } else if (category.includes('trading') || category.includes('forex')) {
            matchedAsset = 'forex-trading-psychology-2025.jpg';
          } else if (category.includes('technology') || category.includes('app')) {
            matchedAsset = 'currency-comparison.jpg';
          } else if (category.includes('nomad') || category.includes('travel')) {
            matchedAsset = 'digital-nomad-laptop.jpg';
          } else {
            matchedAsset = 'exchange-rates-guide.jpg'; // Default fallback
          }
        }
        
        newImage = `/src/assets/${matchedAsset}`;
        wasFixed = true;
        fixedCount++;
        
        console.log(`✅ Fixed: ${post.title}`);
        console.log(`   Old: ${originalImage}`);
        console.log(`   New: ${newImage}`);
      }
      
      // Update the post
      post.image = newImage;
      
      // Ensure other required fields
      if (!post.metaDescription && post.excerpt) {
        post.metaDescription = post.excerpt;
      }
      
      if (!post.readTime && post.wordCount) {
        const readingSpeed = 200; // words per minute
        const minutes = Math.ceil(post.wordCount / readingSpeed);
        post.readTime = `${minutes} min read`;
      }
    });
    
    // Write the updated blog index
    fs.writeFileSync(blogIndexPath, JSON.stringify(blogData, null, 2));
    
    console.log('\n📈 RESULTS:');
    console.log(`   Total posts: ${totalPosts}`);
    console.log(`   Images fixed: ${fixedCount}`);
    console.log(`   Success rate: ${((totalPosts - fixedCount) / totalPosts * 100).toFixed(1)}% already correct`);
    
    if (fixedCount > 0) {
      console.log('\n✅ Blog images have been fixed!');
      console.log('🔄 Restart your development server to see changes');
    } else {
      console.log('\n✅ All blog images are already correctly configured!');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error fixing blog images:', error.message);
    return false;
  }
}

function validateAssets() {
  console.log('\n🔍 VALIDATING ASSETS');
  console.log('====================');
  
  const assetsDir = path.join(__dirname, '../src/assets');
  const existingAssets = fs.readdirSync(assetsDir).filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );
  
  console.log(`📁 Found ${existingAssets.length} image assets`);
  
  // Check if referenced assets exist
  const referencedAssets = Object.values(availableAssets);
  const missingAssets = referencedAssets.filter(asset => 
    !existingAssets.includes(asset)
  );
  
  if (missingAssets.length > 0) {
    console.log('\n⚠️ Missing assets:');
    missingAssets.forEach(asset => console.log(`   - ${asset}`));
  } else {
    console.log('\n✅ All referenced assets exist');
  }
  
  return missingAssets.length === 0;
}

function createImageManifest() {
  console.log('\n📋 CREATING IMAGE MANIFEST');
  console.log('==========================');
  
  const assetsDir = path.join(__dirname, '../src/assets');
  const existingAssets = fs.readdirSync(assetsDir).filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );
  
  const manifest = {
    totalAssets: existingAssets.length,
    lastUpdated: new Date().toISOString(),
    assets: existingAssets.map(asset => ({
      filename: asset,
      path: `/src/assets/${asset}`,
      category: categorizeAsset(asset)
    }))
  };
  
  const manifestPath = path.join(__dirname, '../public/image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Created image manifest with ${existingAssets.length} assets`);
  return true;
}

function categorizeAsset(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('business') || name.includes('corporate')) return 'business';
  if (name.includes('forex') || name.includes('trading')) return 'trading';
  if (name.includes('nomad') || name.includes('travel')) return 'travel';
  if (name.includes('app') || name.includes('technology')) return 'technology';
  if (name.includes('currency') || name.includes('exchange')) return 'currency';
  if (name.includes('ai') || name.includes('automated')) return 'ai';
  if (name.includes('crypto') || name.includes('bitcoin')) return 'crypto';
  
  return 'general';
}

// Main execution
function main() {
  console.log('🎨 BLOG IMAGE OPTIMIZATION TOOL');
  console.log('================================\n');
  
  const steps = [
    { name: 'Fix Blog Images', fn: fixBlogImages },
    { name: 'Validate Assets', fn: validateAssets },
    { name: 'Create Manifest', fn: createImageManifest }
  ];
  
  let allSuccess = true;
  
  for (const step of steps) {
    try {
      const success = step.fn();
      if (!success) {
        allSuccess = false;
        console.log(`❌ ${step.name} failed`);
      }
    } catch (error) {
      allSuccess = false;
      console.error(`❌ ${step.name} error:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allSuccess) {
    console.log('🎉 ALL BLOG IMAGES OPTIMIZED SUCCESSFULLY!');
    console.log('📱 Your blog page should now display all images correctly');
  } else {
    console.log('⚠️ Some issues were found - check the output above');
  }
  
  return allSuccess;
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { fixBlogImages, validateAssets, createImageManifest };
