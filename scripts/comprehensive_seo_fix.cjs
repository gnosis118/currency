#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive SEO Fix for Google Indexing Optimization
 * Fixes: titles, meta descriptions, tags, structured data, alt text
 */

console.log('🚀 COMPREHENSIVE SEO FIX FOR GOOGLE INDEXING');
console.log('=============================================');

// SEO Standards
const SEO_STANDARDS = {
  title: { minLength: 30, maxLength: 60 },
  metaDescription: { minLength: 120, maxLength: 160 },
  tags: { minTags: 3, maxTags: 8 }
};

// Category-specific keywords for better SEO
const CATEGORY_KEYWORDS = {
  'Trading': ['forex-trading', 'currency-pairs', 'trading-strategy'],
  'Banking': ['currency-conversion', 'exchange-rates', 'hidden-fees'],
  'Business': ['international-business', 'currency-strategy', 'hedging'],
  'Guides': ['currency-guide', 'exchange-rates', 'money-conversion'],
  'Apps': ['currency-apps', 'mobile-converter', 'real-time-rates'],
  'Cryptocurrency': ['crypto-currency', 'bitcoin', 'digital-assets'],
  'Analysis': ['market-analysis', 'currency-trends', 'exchange-rate-analysis'],
  'Freelancing': ['freelancer-payments', 'international-income', 'currency-management'],
  'Digital Nomad': ['digital-nomad', 'remote-work', 'international-banking'],
  'Risk Management': ['currency-risk', 'hedging-strategies', 'volatility-protection'],
  'Taxes': ['currency-taxes', 'irs-rules', 'international-tax'],
  'Geopolitics': ['geopolitical-risk', 'currency-policy', 'trade-wars'],
  'International Transfers': ['money-transfer', 'remittance', 'cross-border-payments']
};

function optimizeTitleForSEO(title) {
  // Shorten overly long titles while keeping key information
  if (title.length <= SEO_STANDARDS.title.maxLength) return title;
  
  // Common patterns to shorten
  const patterns = [
    { from: /: Complete Guide to /g, to: ': ' },
    { from: /: Everything You Need to Know/g, to: '' },
    { from: /: Advanced /g, to: ': ' },
    { from: / - Complete /g, to: ' - ' },
    { from: / Guide 2025/g, to: ' 2025' },
    { from: /Complete Comparison Guide/g, to: 'Comparison' },
    { from: /: Key Facts and Trends/g, to: '' },
    { from: /Explained: /g, to: '' }
  ];
  
  let optimized = title;
  for (const pattern of patterns) {
    optimized = optimized.replace(pattern.from, pattern.to);
    if (optimized.length <= SEO_STANDARDS.title.maxLength) break;
  }
  
  // If still too long, truncate intelligently
  if (optimized.length > SEO_STANDARDS.title.maxLength) {
    optimized = optimized.substring(0, SEO_STANDARDS.title.maxLength - 3) + '...';
  }
  
  return optimized;
}

function generateOptimalMetaDescription(excerpt, title, category) {
  if (!excerpt) {
    // Generate from title and category
    const baseDesc = `Learn about ${title.toLowerCase().replace(/[^\w\s]/g, '')} with our comprehensive guide.`;
    return baseDesc.length <= SEO_STANDARDS.metaDescription.maxLength ? baseDesc : 
           baseDesc.substring(0, SEO_STANDARDS.metaDescription.maxLength - 3) + '...';
  }
  
  if (excerpt.length >= SEO_STANDARDS.metaDescription.minLength && 
      excerpt.length <= SEO_STANDARDS.metaDescription.maxLength) {
    return excerpt;
  }
  
  if (excerpt.length < SEO_STANDARDS.metaDescription.minLength) {
    // Extend with category context
    const extension = ` Expert insights on ${category.toLowerCase()} for 2025.`;
    const extended = excerpt + extension;
    return extended.length <= SEO_STANDARDS.metaDescription.maxLength ? extended : excerpt;
  }
  
  // Truncate if too long
  return excerpt.substring(0, SEO_STANDARDS.metaDescription.maxLength - 3) + '...';
}

function optimizeBlogPost(filePath, slug) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let wasModified = false;
    
    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.log(`⚠️  No frontmatter found in ${slug}`);
      return false;
    }
    
    const frontmatter = frontmatterMatch[1];
    const restOfContent = content.substring(frontmatterMatch[0].length);
    
    // Parse frontmatter fields
    const titleMatch = frontmatter.match(/^title:\s*"([^"]*)"$/m);
    const excerptMatch = frontmatter.match(/^excerpt:\s*"([^"]*)"$/m);
    const categoryMatch = frontmatter.match(/^category:\s*"?([^"\n]*)"?$/m);
    const tagsMatch = frontmatter.match(/^tags:\s*\[(.*?)\]$/m);
    const imageMatch = frontmatter.match(/^image:\s*"([^"]*)"$/m);
    
    if (!titleMatch) {
      console.log(`⚠️  No title found in ${slug}`);
      return false;
    }
    
    const originalTitle = titleMatch[1];
    const excerpt = excerptMatch ? excerptMatch[1] : '';
    const category = categoryMatch ? categoryMatch[1] : 'General';
    const currentTags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, '')) : [];
    const image = imageMatch ? imageMatch[1] : '';
    
    // Optimize title
    const optimizedTitle = optimizeTitleForSEO(originalTitle);
    if (optimizedTitle !== originalTitle) {
      content = content.replace(
        /^title:\s*"([^"]*)"$/m,
        `title: "${optimizedTitle}"`
      );
      wasModified = true;
      console.log(`📝 Optimized title: ${slug}`);
    }
    
    // Add/optimize meta description
    const optimalMetaDesc = generateOptimalMetaDescription(excerpt, originalTitle, category);
    if (!frontmatter.includes('metaDescription:')) {
      content = content.replace(
        /^(category:\s*.*$)/m,
        `$1\nmetaDescription: "${optimalMetaDesc}"`
      );
      wasModified = true;
      console.log(`📝 Added meta description: ${slug}`);
    }
    
    // Optimize tags
    const categoryKeywords = CATEGORY_KEYWORDS[category] || [];
    let optimizedTags = [...currentTags];
    
    // Add missing category keywords
    categoryKeywords.forEach(keyword => {
      const hasKeyword = optimizedTags.some(tag => 
        tag.toLowerCase().includes(keyword.toLowerCase())
      );
      if (!hasKeyword && optimizedTags.length < SEO_STANDARDS.tags.maxTags) {
        optimizedTags.push(keyword);
      }
    });
    
    // Ensure minimum tags
    if (optimizedTags.length < SEO_STANDARDS.tags.minTags) {
      const defaultTags = ['currency', 'exchange-rates', '2025'];
      defaultTags.forEach(tag => {
        if (!optimizedTags.includes(tag) && optimizedTags.length < SEO_STANDARDS.tags.maxTags) {
          optimizedTags.push(tag);
        }
      });
    }
    
    if (optimizedTags.length !== currentTags.length || 
        !optimizedTags.every(tag => currentTags.includes(tag))) {
      const tagsString = optimizedTags.map(tag => `"${tag}"`).join(', ');
      content = content.replace(
        /^tags:\s*\[.*?\]$/m,
        `tags: [${tagsString}]`
      );
      wasModified = true;
      console.log(`🏷️  Optimized tags: ${slug}`);
    }
    
    // Fix structured data image URLs (remove external URLs)
    if (content.includes('https://koala.sh/') && image) {
      content = content.replace(
        /"url":\s*"https:\/\/koala\.sh\/[^"]*"/g,
        `"url": "https://currencytocurrency.app${image}"`
      );
      wasModified = true;
      console.log(`🖼️  Fixed structured data image: ${slug}`);
    }
    
    // Add missing structured data if not present
    if (!content.includes('"@context": "https://schema.org"')) {
      const structuredData = `
schema: {
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://currencytocurrency.app/blog/${slug}"
  },
  "headline": "${optimizedTitle}",
  "description": "${optimalMetaDesc}",
  "image": {
    "@type": "ImageObject",
    "url": "https://currencytocurrency.app${image}",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Organization",
    "@name": "Currency to Currency"
  },
  "publisher": {
    "@type": "Organization",
    "@name": "Currency to Currency",
    "logo": {
      "@type": "ImageObject",
      "url": "https://currencytocurrency.app/favicon-192x192.png"
    }
  },
  "datePublished": "${frontmatter.match(/^date:\s*"([^"]*)"$/m)?.[1] || '2025-08-15'}",
  "dateModified": "${new Date().toISOString().split('T')[0]}"
}`;
      
      content = content.replace(
        /^---$/m,
        `${structuredData}\n---`
      );
      wasModified = true;
      console.log(`📊 Added structured data: ${slug}`);
    }
    
    if (wasModified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error(`❌ Error optimizing ${slug}:`, error.message);
    return false;
  }
}

function runComprehensiveSEOFix() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  let optimizedCount = 0;
  let errorCount = 0;
  
  console.log(`📁 Processing ${files.length} blog files...`);
  
  files.forEach(filename => {
    const filePath = path.join(blogDir, filename);
    const slug = filename.replace('.md', '');
    
    try {
      const wasOptimized = optimizeBlogPost(filePath, slug);
      if (wasOptimized) {
        optimizedCount++;
        console.log(`✅ Optimized: ${slug}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
      errorCount++;
    }
  });
  
  console.log('\n📊 SEO OPTIMIZATION SUMMARY:');
  console.log('============================');
  console.log(`✅ Files optimized: ${optimizedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total files processed: ${files.length}`);
  
  return optimizedCount > 0;
}

// Main execution
const success = runComprehensiveSEOFix();

if (success) {
  console.log('\n🎯 Regenerating blog index and running validation...');
  try {
    const { execSync } = require('child_process');
    execSync('node scripts/generate_blog_index.mjs', { stdio: 'inherit' });
    console.log('✅ Blog index regenerated');
    
    execSync('node scripts/seo_optimization.cjs', { stdio: 'inherit' });
    console.log('✅ SEO audit completed');
    
  } catch (error) {
    console.error('❌ Error in post-processing:', error.message);
  }
} else {
  console.log('\n⚠️  No SEO optimizations needed');
}
