#!/usr/bin/env node

/**
 * Fix Missing Frontmatter Script
 * Adds YAML frontmatter to blog articles that are missing it
 */

const fs = require('fs');
const path = require('path');

function extractTitleFromContent(content) {
  // Look for the first # heading
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled Article';
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractExcerpt(content) {
  // Remove the title and get the first paragraph
  const withoutTitle = content.replace(/^#\s+.+$/m, '').trim();
  const firstParagraph = withoutTitle.split('\n\n')[0];
  
  // Clean up markdown and limit length
  const cleaned = firstParagraph
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove code
    .trim();
  
  return cleaned.length > 160 ? cleaned.substring(0, 157) + '...' : cleaned;
}

function categorizeArticle(title, content) {
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  
  if (titleLower.includes('forex') || titleLower.includes('trading') || 
      contentLower.includes('trading') || contentLower.includes('trader')) {
    return 'Trading';
  }
  
  if (titleLower.includes('bank') || titleLower.includes('fee') || 
      titleLower.includes('transfer') || contentLower.includes('banking')) {
    return 'Banking';
  }
  
  if (titleLower.includes('crypto') || titleLower.includes('bitcoin') || 
      contentLower.includes('cryptocurrency')) {
    return 'Cryptocurrency';
  }
  
  if (titleLower.includes('business') || contentLower.includes('business')) {
    return 'Business';
  }
  
  if (titleLower.includes('travel') || contentLower.includes('travel')) {
    return 'Travel';
  }
  
  return 'Currency';
}

function generateTags(title, content) {
  const tags = [];
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  
  // Currency-related tags
  if (titleLower.includes('currency') || contentLower.includes('currency')) {
    tags.push('currency-conversion');
  }
  
  if (titleLower.includes('exchange') || contentLower.includes('exchange')) {
    tags.push('exchange-rates');
  }
  
  if (titleLower.includes('forex') || contentLower.includes('forex')) {
    tags.push('forex');
  }
  
  if (titleLower.includes('trading') || contentLower.includes('trading')) {
    tags.push('trading');
  }
  
  if (titleLower.includes('fee') || titleLower.includes('cost') || 
      contentLower.includes('fees') || contentLower.includes('cost')) {
    tags.push('fees');
  }
  
  if (titleLower.includes('bank') || contentLower.includes('bank')) {
    tags.push('banking');
  }
  
  if (titleLower.includes('crypto') || contentLower.includes('crypto')) {
    tags.push('cryptocurrency');
  }
  
  if (titleLower.includes('business') || contentLower.includes('business')) {
    tags.push('business');
  }
  
  if (titleLower.includes('travel') || contentLower.includes('travel')) {
    tags.push('travel');
  }
  
  if (titleLower.includes('guide') || titleLower.includes('complete')) {
    tags.push('guide');
  }
  
  // Ensure we have at least 3 tags
  if (tags.length < 3) {
    const defaultTags = ['currency-exchange', 'money-transfer', 'financial-guide'];
    tags.push(...defaultTags.slice(0, 3 - tags.length));
  }
  
  return tags.slice(0, 5); // Limit to 5 tags
}

function extractFeaturedImage(content) {
  // Look for the first image in the content
  const imageMatch = content.match(/!\[.*?\]\(([^)]+)\)/);
  if (imageMatch) {
    const imagePath = imageMatch[1];
    // Convert relative paths to absolute
    if (imagePath.startsWith('/src/assets/')) {
      return imagePath;
    } else if (imagePath.startsWith('https://')) {
      return imagePath;
    }
  }
  
  // Default image
  return '/src/assets/blog-hero.jpg';
}

function addFrontmatterToArticle(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has frontmatter
  if (content.startsWith('---') || content.includes('title:') || content.includes('slug:')) {
    console.log(`  ⚠️ Already has frontmatter, skipping`);
    return false;
  }
  
  const title = extractTitleFromContent(content);
  const slug = generateSlug(title);
  const excerpt = extractExcerpt(content);
  const category = categorizeArticle(title, content);
  const tags = generateTags(title, content);
  const featuredImage = extractFeaturedImage(content);
  
  const frontmatter = `---
title: "${title}"
slug: "${slug}"
date: "2025-08-26"
excerpt: "${excerpt}"
featuredImage: "${featuredImage}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
category: "${category}"
featured: false
---

`;
  
  const newContent = frontmatter + content;
  fs.writeFileSync(filePath, newContent);
  
  console.log(`  ✅ Added frontmatter`);
  console.log(`     Title: ${title}`);
  console.log(`     Category: ${category}`);
  console.log(`     Tags: ${tags.join(', ')}`);
  
  return true;
}

function fixAllMissingFrontmatter() {
  console.log('🔧 FIXING MISSING FRONTMATTER');
  console.log('==============================');
  
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  let fixedCount = 0;
  let skippedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    const wasFixed = addFrontmatterToArticle(filePath);
    
    if (wasFixed) {
      fixedCount++;
    } else {
      skippedCount++;
    }
  });
  
  console.log('\n📊 RESULTS:');
  console.log('===========');
  console.log(`✅ Fixed: ${fixedCount} articles`);
  console.log(`⚠️ Skipped: ${skippedCount} articles (already had frontmatter)`);
  console.log(`📝 Total: ${files.length} articles processed`);
  
  if (fixedCount > 0) {
    console.log('\n🎉 Frontmatter fixes complete!');
    console.log('Now run: npm run schema:add');
  }
  
  return fixedCount > 0;
}

// Main execution
function main() {
  const success = fixAllMissingFrontmatter();
  
  if (success) {
    console.log('\n🚀 Ready to add schema markup to fixed articles!');
    process.exit(0);
  } else {
    console.log('\n✅ All articles already have proper frontmatter');
    process.exit(0);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { addFrontmatterToArticle, fixAllMissingFrontmatter };
