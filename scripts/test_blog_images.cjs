#!/usr/bin/env node

/**
 * Blog Image Testing Script
 * Tests all blog images to ensure they load properly
 */

const fs = require('fs');
const path = require('path');

function testBlogImages() {
  console.log('🧪 TESTING BLOG IMAGES');
  console.log('======================');
  
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  const assetsDir = path.join(__dirname, '../src/assets');
  
  if (!fs.existsSync(blogIndexPath)) {
    console.error('❌ blog-index.json not found');
    return false;
  }
  
  if (!fs.existsSync(assetsDir)) {
    console.error('❌ src/assets directory not found');
    return false;
  }
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    const availableAssets = fs.readdirSync(assetsDir).filter(file => 
      /\.(jpg|jpeg|png|webp|svg)$/i.test(file)
    );
    
    console.log(`📊 Testing ${blogData.length} blog posts...`);
    console.log(`📁 Available assets: ${availableAssets.length}`);
    
    let workingImages = 0;
    let brokenImages = 0;
    let externalImages = 0;
    let missingImages = 0;
    
    const results = [];
    
    blogData.forEach((post, index) => {
      const result = {
        title: post.title,
        slug: post.slug,
        category: post.category,
        image: post.image,
        status: 'unknown',
        issue: null
      };
      
      if (!post.image) {
        result.status = 'missing';
        result.issue = 'No image specified';
        missingImages++;
      } else if (post.image.startsWith('http')) {
        result.status = 'external';
        externalImages++;
      } else if (post.image.startsWith('/src/assets/')) {
        const filename = post.image.split('/').pop();
        if (availableAssets.includes(filename)) {
          result.status = 'working';
          workingImages++;
        } else {
          result.status = 'broken';
          result.issue = `Asset not found: ${filename}`;
          brokenImages++;
        }
      } else {
        result.status = 'broken';
        result.issue = `Invalid path format: ${post.image}`;
        brokenImages++;
      }
      
      results.push(result);
    });
    
    // Print detailed results
    console.log('\n📋 DETAILED RESULTS:');
    console.log('====================');
    
    results.forEach((result, index) => {
      const statusIcon = {
        'working': '✅',
        'external': '🌐',
        'broken': '❌',
        'missing': '⚠️'
      }[result.status];
      
      console.log(`${statusIcon} ${result.title}`);
      if (result.issue) {
        console.log(`   Issue: ${result.issue}`);
      }
      if (result.status === 'working') {
        console.log(`   Image: ${result.image.split('/').pop()}`);
      }
      console.log(`   Category: ${result.category || 'None'}`);
      console.log('');
    });
    
    // Summary
    console.log('📈 SUMMARY:');
    console.log('===========');
    console.log(`✅ Working images: ${workingImages}`);
    console.log(`🌐 External images: ${externalImages}`);
    console.log(`❌ Broken images: ${brokenImages}`);
    console.log(`⚠️ Missing images: ${missingImages}`);
    console.log(`📊 Total posts: ${blogData.length}`);
    
    const successRate = ((workingImages + externalImages) / blogData.length * 100).toFixed(1);
    console.log(`🎯 Success rate: ${successRate}%`);
    
    // Recommendations
    if (brokenImages > 0 || missingImages > 0) {
      console.log('\n🔧 RECOMMENDATIONS:');
      console.log('===================');
      
      if (brokenImages > 0) {
        console.log('1. Fix broken image paths:');
        results.filter(r => r.status === 'broken').forEach(r => {
          console.log(`   - ${r.slug}: ${r.issue}`);
        });
      }
      
      if (missingImages > 0) {
        console.log('2. Add images for posts without them:');
        results.filter(r => r.status === 'missing').forEach(r => {
          console.log(`   - ${r.slug}`);
        });
      }
      
      console.log('\n💡 Run: npm run optimize:images to auto-fix issues');
    }
    
    return brokenImages === 0 && missingImages === 0;
    
  } catch (error) {
    console.error('❌ Error testing blog images:', error.message);
    return false;
  }
}

function generateImageReport() {
  console.log('\n📊 GENERATING IMAGE REPORT');
  console.log('===========================');
  
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  const assetsDir = path.join(__dirname, '../src/assets');
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    const availableAssets = fs.readdirSync(assetsDir).filter(file => 
      /\.(jpg|jpeg|png|webp|svg)$/i.test(file)
    );
    
    const report = {
      generatedAt: new Date().toISOString(),
      totalPosts: blogData.length,
      totalAssets: availableAssets.length,
      imageStatus: {
        working: 0,
        external: 0,
        broken: 0,
        missing: 0
      },
      posts: [],
      unusedAssets: [],
      recommendations: []
    };
    
    // Analyze each post
    const usedAssets = new Set();
    
    blogData.forEach(post => {
      const postReport = {
        slug: post.slug,
        title: post.title,
        category: post.category,
        image: post.image,
        status: 'unknown'
      };
      
      if (!post.image) {
        postReport.status = 'missing';
        report.imageStatus.missing++;
      } else if (post.image.startsWith('http')) {
        postReport.status = 'external';
        report.imageStatus.external++;
      } else if (post.image.startsWith('/src/assets/')) {
        const filename = post.image.split('/').pop();
        usedAssets.add(filename);
        if (availableAssets.includes(filename)) {
          postReport.status = 'working';
          report.imageStatus.working++;
        } else {
          postReport.status = 'broken';
          report.imageStatus.broken++;
        }
      } else {
        postReport.status = 'broken';
        report.imageStatus.broken++;
      }
      
      report.posts.push(postReport);
    });
    
    // Find unused assets
    report.unusedAssets = availableAssets.filter(asset => !usedAssets.has(asset));
    
    // Generate recommendations
    if (report.imageStatus.broken > 0) {
      report.recommendations.push('Fix broken image paths');
    }
    if (report.imageStatus.missing > 0) {
      report.recommendations.push('Add images for posts without them');
    }
    if (report.unusedAssets.length > 10) {
      report.recommendations.push('Consider removing unused assets to reduce bundle size');
    }
    
    // Save report
    const reportPath = path.join(__dirname, '../public/image-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Image report saved to: ${reportPath}`);
    console.log(`📊 Unused assets: ${report.unusedAssets.length}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error generating image report:', error.message);
    return false;
  }
}

function suggestImageMappings() {
  console.log('\n🎯 SUGGESTING IMAGE MAPPINGS');
  console.log('=============================');
  
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  const assetsDir = path.join(__dirname, '../src/assets');
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    const availableAssets = fs.readdirSync(assetsDir).filter(file => 
      /\.(jpg|jpeg|png|webp|svg)$/i.test(file)
    );
    
    const suggestions = [];
    
    blogData.forEach(post => {
      if (!post.image || post.image.startsWith('http')) return;
      
      const filename = post.image.split('/').pop();
      if (!availableAssets.includes(filename)) {
        // Suggest alternative images based on keywords
        const keywords = [
          ...post.title.toLowerCase().split(' '),
          ...(post.category || '').toLowerCase().split(' '),
          ...post.slug.split('-')
        ];
        
        const matches = availableAssets.filter(asset => {
          const assetName = asset.toLowerCase();
          return keywords.some(keyword => 
            keyword.length > 3 && assetName.includes(keyword)
          );
        });
        
        if (matches.length > 0) {
          suggestions.push({
            post: post.slug,
            title: post.title,
            current: post.image,
            suggested: matches.slice(0, 3)
          });
        }
      }
    });
    
    if (suggestions.length > 0) {
      console.log('💡 Suggested image mappings:');
      suggestions.forEach(suggestion => {
        console.log(`\n📝 ${suggestion.title}`);
        console.log(`   Current: ${suggestion.current}`);
        console.log(`   Suggested: ${suggestion.suggested.join(', ')}`);
      });
    } else {
      console.log('✅ No suggestions needed - all images are properly mapped');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error suggesting image mappings:', error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🖼️ BLOG IMAGE TESTING SUITE');
  console.log('============================\n');
  
  const steps = [
    { name: 'Test Blog Images', fn: testBlogImages },
    { name: 'Generate Report', fn: generateImageReport },
    { name: 'Suggest Mappings', fn: suggestImageMappings }
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
    console.log('🎉 ALL IMAGE TESTS COMPLETED!');
    console.log('📱 Check the results above for any issues');
  } else {
    console.log('⚠️ Some tests failed - check the output above');
  }
  
  return allSuccess;
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { testBlogImages, generateImageReport, suggestImageMappings };
