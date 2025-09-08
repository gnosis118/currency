#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validates that every blog post has a unique image assignment
 * and no two articles share the same image
 */

console.log('🔍 VALIDATING UNIQUE IMAGE ASSIGNMENTS');
console.log('=====================================');

function validateUniqueImages() {
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  const blogImagesPath = path.join(__dirname, '../src/assets/blog-images.ts');
  
  if (!fs.existsSync(blogIndexPath)) {
    console.error('❌ Blog index not found. Run npm run build:blog-index first.');
    process.exit(1);
  }

  try {
    // Read blog data
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    console.log(`📊 Analyzing ${blogData.length} blog posts...`);

    // Track image usage
    const imageUsage = new Map();
    const issues = [];
    const placeholderPosts = [];
    const externalImagePosts = [];

    // Analyze each post
    blogData.forEach(post => {
      const { slug, title, image } = post;

      // Check for placeholder images
      if (image === '/placeholder.svg') {
        placeholderPosts.push({ slug, title });
        return;
      }

      // Check for external images
      if (image && image.startsWith('http')) {
        externalImagePosts.push({ slug, title, image });
        return;
      }

      // Track local image usage
      if (image) {
        if (!imageUsage.has(image)) {
          imageUsage.set(image, []);
        }
        imageUsage.get(image).push({ slug, title });
      }
    });

    // Find duplicates
    const duplicates = [];
    imageUsage.forEach((posts, image) => {
      if (posts.length > 1) {
        duplicates.push({ image, posts });
      }
    });

    // Report results
    console.log('\n📋 VALIDATION RESULTS:');
    console.log('======================');

    if (placeholderPosts.length > 0) {
      console.log(`\n❌ ${placeholderPosts.length} posts using placeholder images:`);
      placeholderPosts.forEach(post => {
        console.log(`   • ${post.slug}: "${post.title}"`);
      });
    }

    if (externalImagePosts.length > 0) {
      console.log(`\n⚠️  ${externalImagePosts.length} posts using external images:`);
      externalImagePosts.forEach(post => {
        console.log(`   • ${post.slug}: "${post.title}"`);
        console.log(`     External URL: ${post.image}`);
      });
    }

    if (duplicates.length > 0) {
      console.log(`\n🔄 ${duplicates.length} images used by multiple posts:`);
      duplicates.forEach(duplicate => {
        console.log(`\n   Image: ${duplicate.image}`);
        console.log(`   Used by ${duplicate.posts.length} posts:`);
        duplicate.posts.forEach(post => {
          console.log(`     • ${post.slug}: "${post.title}"`);
        });
      });
    }

    // Summary
    const uniqueImages = imageUsage.size;
    const totalIssues = placeholderPosts.length + duplicates.length;
    
    console.log('\n📊 SUMMARY:');
    console.log('===========');
    console.log(`✅ Posts with unique local images: ${uniqueImages}`);
    console.log(`⚠️  Posts with external images: ${externalImagePosts.length}`);
    console.log(`❌ Posts with placeholder images: ${placeholderPosts.length}`);
    console.log(`🔄 Duplicate image assignments: ${duplicates.length}`);
    console.log(`📝 Total posts analyzed: ${blogData.length}`);

    // Validation status
    if (totalIssues === 0 && externalImagePosts.length === 0) {
      console.log('\n🎉 SUCCESS: All posts have unique local images!');
      return true;
    } else {
      console.log('\n⚠️  ISSUES FOUND: Some posts need attention');
      
      if (placeholderPosts.length > 0) {
        console.log('\n💡 RECOMMENDATIONS:');
        console.log('===================');
        console.log('1. Replace placeholder images with unique local assets');
        console.log('2. Update blogImageMap in src/assets/blog-images.ts');
      }
      
      if (duplicates.length > 0) {
        console.log('3. Assign unique images to duplicate posts');
        console.log('4. Ensure each article has its own distinct image');
      }
      
      if (externalImagePosts.length > 0) {
        console.log('5. Replace external images with local assets for better performance');
      }
      
      return false;
    }

  } catch (error) {
    console.error('❌ Error validating images:', error.message);
    process.exit(1);
  }
}

// Generate detailed report
function generateUniqueImageReport() {
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  const reportPath = path.join(__dirname, '../public/unique-image-report.json');
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    const imageUsage = new Map();
    
    blogData.forEach(post => {
      if (post.image && !post.image.startsWith('http') && post.image !== '/placeholder.svg') {
        if (!imageUsage.has(post.image)) {
          imageUsage.set(post.image, []);
        }
        imageUsage.get(post.image).push({
          slug: post.slug,
          title: post.title,
          category: post.category
        });
      }
    });

    const report = {
      generatedAt: new Date().toISOString(),
      totalPosts: blogData.length,
      uniqueImageAssignments: imageUsage.size,
      imageUsageMap: Object.fromEntries(imageUsage),
      duplicateImages: Array.from(imageUsage.entries())
        .filter(([_, posts]) => posts.length > 1)
        .map(([image, posts]) => ({ image, posts })),
      isValid: Array.from(imageUsage.values()).every(posts => posts.length === 1)
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
  }
}

// Main execution
const isValid = validateUniqueImages();
generateUniqueImageReport();

if (!isValid) {
  process.exit(1);
}
