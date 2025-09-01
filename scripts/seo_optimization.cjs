#!/usr/bin/env node

/**
 * Comprehensive SEO Optimization Script
 * Audits and optimizes all blog articles for search engine ranking
 */

const fs = require('fs');
const path = require('path');

// SEO optimization rules and standards
const SEO_STANDARDS = {
  title: {
    minLength: 30,
    maxLength: 60,
    shouldIncludeYear: true,
    shouldIncludeKeywords: true
  },
  metaDescription: {
    minLength: 120,
    maxLength: 160,
    shouldIncludeKeywords: true,
    shouldIncludeCTA: true
  },
  excerpt: {
    minLength: 100,
    maxLength: 200,
    shouldMatchMetaDescription: false
  },
  content: {
    minWordCount: 1500,
    maxWordCount: 8000,
    shouldHaveHeaders: true,
    shouldHaveInternalLinks: true,
    shouldHaveImages: true
  },
  schema: {
    required: ['@context', '@type', 'headline', 'author', 'publisher', 'datePublished'],
    recommended: ['image', 'mainEntityOfPage', 'dateModified']
  },
  keywords: {
    minTags: 3,
    maxTags: 8,
    shouldIncludePrimary: true,
    shouldIncludeSecondary: true
  }
};

// Primary keywords by category
const CATEGORY_KEYWORDS = {
  'Trading': ['forex trading', 'currency pairs', 'trading strategy', 'risk management', 'leverage'],
  'Banking': ['currency conversion', 'exchange rates', 'hidden fees', 'international transfers'],
  'Guides': ['currency guide', 'exchange rates', 'money conversion', 'travel money'],
  'Business': ['international business', 'currency strategy', 'hedging', 'multi-currency'],
  'Digital Nomad': ['digital nomad', 'remote work', 'international banking', 'travel money'],
  'Technology': ['currency API', 'forex technology', 'trading tools', 'financial technology'],
  'Analysis': ['market analysis', 'currency trends', 'exchange rate analysis', 'forex signals']
};

function auditBlogSEO() {
  console.log('🔍 COMPREHENSIVE SEO AUDIT');
  console.log('===========================');
  
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  const contentDir = path.join(__dirname, '../src/content/blog');
  
  if (!fs.existsSync(blogIndexPath)) {
    console.error('❌ blog-index.json not found');
    return false;
  }
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    const auditResults = [];
    
    console.log(`📊 Auditing ${blogData.length} blog posts...\n`);
    
    blogData.forEach((post, index) => {
      const result = {
        title: post.title,
        slug: post.slug,
        category: post.category,
        issues: [],
        score: 0,
        recommendations: []
      };
      
      // Audit title
      const titleLength = post.title.length;
      if (titleLength < SEO_STANDARDS.title.minLength) {
        result.issues.push(`Title too short (${titleLength} chars, min ${SEO_STANDARDS.title.minLength})`);
      } else if (titleLength > SEO_STANDARDS.title.maxLength) {
        result.issues.push(`Title too long (${titleLength} chars, max ${SEO_STANDARDS.title.maxLength})`);
      } else {
        result.score += 10;
      }
      
      // Check for year in title
      if (!post.title.includes('2025') && !post.title.includes('2024')) {
        result.recommendations.push('Consider adding current year to title for freshness');
      } else {
        result.score += 5;
      }
      
      // Audit meta description
      if (!post.metaDescription) {
        result.issues.push('Missing meta description');
      } else {
        const metaLength = post.metaDescription.length;
        if (metaLength < SEO_STANDARDS.metaDescription.minLength) {
          result.issues.push(`Meta description too short (${metaLength} chars, min ${SEO_STANDARDS.metaDescription.minLength})`);
        } else if (metaLength > SEO_STANDARDS.metaDescription.maxLength) {
          result.issues.push(`Meta description too long (${metaLength} chars, max ${SEO_STANDARDS.metaDescription.maxLength})`);
        } else {
          result.score += 15;
        }
      }
      
      // Audit excerpt
      if (!post.excerpt) {
        result.issues.push('Missing excerpt');
      } else {
        const excerptLength = post.excerpt.length;
        if (excerptLength < SEO_STANDARDS.excerpt.minLength) {
          result.issues.push(`Excerpt too short (${excerptLength} chars, min ${SEO_STANDARDS.excerpt.minLength})`);
        } else {
          result.score += 10;
        }
      }
      
      // Audit tags/keywords
      if (!post.tags || post.tags.length < SEO_STANDARDS.keywords.minTags) {
        result.issues.push(`Insufficient tags (${post.tags?.length || 0}, min ${SEO_STANDARDS.keywords.minTags})`);
      } else if (post.tags.length > SEO_STANDARDS.keywords.maxTags) {
        result.issues.push(`Too many tags (${post.tags.length}, max ${SEO_STANDARDS.keywords.maxTags})`);
      } else {
        result.score += 10;
      }
      
      // Check category-specific keywords
      if (post.category && CATEGORY_KEYWORDS[post.category]) {
        const categoryKeywords = CATEGORY_KEYWORDS[post.category];
        const hasRelevantKeywords = post.tags?.some(tag => 
          categoryKeywords.some(keyword => tag.toLowerCase().includes(keyword.toLowerCase()))
        );
        if (!hasRelevantKeywords) {
          result.recommendations.push(`Add category-specific keywords: ${categoryKeywords.slice(0, 3).join(', ')}`);
        } else {
          result.score += 5;
        }
      }
      
      // Audit word count
      if (!post.wordCount) {
        result.issues.push('Missing word count');
      } else if (post.wordCount < SEO_STANDARDS.content.minWordCount) {
        result.issues.push(`Content too short (${post.wordCount} words, min ${SEO_STANDARDS.content.minWordCount})`);
      } else {
        result.score += 15;
      }
      
      // Audit image
      if (!post.image) {
        result.issues.push('Missing featured image');
      } else {
        result.score += 10;
      }
      
      // Audit read time
      if (!post.readTime) {
        result.issues.push('Missing read time');
      } else {
        result.score += 5;
      }
      
      // Check if article file exists
      const articlePath = path.join(contentDir, `${post.slug}.md`);
      if (!fs.existsSync(articlePath)) {
        result.issues.push('Article file not found');
      } else {
        result.score += 5;
        
        // Audit article content if file exists
        try {
          const content = fs.readFileSync(articlePath, 'utf8');
          
          // Check for schema markup
          if (!content.includes('schema:') && !content.includes('"@context"')) {
            result.issues.push('Missing structured data/schema markup');
          } else {
            result.score += 10;
          }
          
          // Check for internal links
          const internalLinkPattern = /\[.*?\]\(\/blog\/.*?\)/g;
          const internalLinks = content.match(internalLinkPattern);
          if (!internalLinks || internalLinks.length < 2) {
            result.recommendations.push('Add more internal links to related articles');
          } else {
            result.score += 5;
          }
          
          // Check for images in content
          const imagePattern = /!\[.*?\]\(.*?\)/g;
          const images = content.match(imagePattern);
          if (!images || images.length < 2) {
            result.recommendations.push('Add more images throughout the content');
          } else {
            result.score += 5;
          }
          
          // Check for headers
          const headerPattern = /^#{1,6}\s+/gm;
          const headers = content.match(headerPattern);
          if (!headers || headers.length < 3) {
            result.recommendations.push('Add more section headers for better structure');
          } else {
            result.score += 5;
          }
          
        } catch (error) {
          result.issues.push('Error reading article content');
        }
      }
      
      // Calculate final score percentage
      result.scorePercentage = Math.round((result.score / 100) * 100);
      
      auditResults.push(result);
    });
    
    // Sort by score (lowest first - most issues)
    auditResults.sort((a, b) => a.score - b.score);
    
    // Display results
    console.log('📈 SEO AUDIT RESULTS:');
    console.log('=====================\n');
    
    auditResults.forEach((result, index) => {
      const scoreIcon = result.scorePercentage >= 80 ? '🟢' : 
                       result.scorePercentage >= 60 ? '🟡' : '🔴';
      
      console.log(`${scoreIcon} ${result.title}`);
      console.log(`   Score: ${result.scorePercentage}% (${result.score}/100)`);
      console.log(`   Category: ${result.category || 'None'}`);
      
      if (result.issues.length > 0) {
        console.log(`   Issues:`);
        result.issues.forEach(issue => console.log(`     ❌ ${issue}`));
      }
      
      if (result.recommendations.length > 0) {
        console.log(`   Recommendations:`);
        result.recommendations.forEach(rec => console.log(`     💡 ${rec}`));
      }
      
      console.log('');
    });
    
    // Summary statistics
    const avgScore = auditResults.reduce((sum, r) => sum + r.scorePercentage, 0) / auditResults.length;
    const highScoring = auditResults.filter(r => r.scorePercentage >= 80).length;
    const needsWork = auditResults.filter(r => r.scorePercentage < 60).length;
    
    console.log('📊 SUMMARY STATISTICS:');
    console.log('======================');
    console.log(`Average SEO Score: ${Math.round(avgScore)}%`);
    console.log(`High-performing articles (80%+): ${highScoring}`);
    console.log(`Articles needing work (<60%): ${needsWork}`);
    console.log(`Total articles audited: ${auditResults.length}`);
    
    // Save detailed report
    const reportPath = path.join(__dirname, '../public/seo-audit-report.json');
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalArticles: auditResults.length,
        averageScore: Math.round(avgScore),
        highPerforming: highScoring,
        needsImprovement: needsWork
      },
      articles: auditResults,
      standards: SEO_STANDARDS,
      categoryKeywords: CATEGORY_KEYWORDS
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n✅ Detailed report saved to: seo-audit-report.json`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error during SEO audit:', error.message);
    return false;
  }
}

function optimizeArticlesSEO() {
  console.log('\n🚀 SEO OPTIMIZATION');
  console.log('===================');
  
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    let optimizedCount = 0;
    
    blogData.forEach((post, index) => {
      let wasOptimized = false;
      
      // Optimize missing read time
      if (!post.readTime && post.wordCount) {
        const readingSpeed = 200; // words per minute
        const minutes = Math.ceil(post.wordCount / readingSpeed);
        post.readTime = `${minutes} min read`;
        wasOptimized = true;
      }
      
      // Optimize missing meta description
      if (!post.metaDescription && post.excerpt) {
        post.metaDescription = post.excerpt;
        wasOptimized = true;
      }
      
      // Add category-specific keywords if missing
      if (post.category && CATEGORY_KEYWORDS[post.category]) {
        const categoryKeywords = CATEGORY_KEYWORDS[post.category];
        const currentTags = post.tags || [];
        
        // Add missing category keywords
        categoryKeywords.forEach(keyword => {
          const hasKeyword = currentTags.some(tag => 
            tag.toLowerCase().includes(keyword.toLowerCase())
          );
          if (!hasKeyword && currentTags.length < SEO_STANDARDS.keywords.maxTags) {
            currentTags.push(keyword);
            wasOptimized = true;
          }
        });
        
        post.tags = currentTags;
      }
      
      // Ensure featured status for high-quality content
      if (post.wordCount > 3000 && !post.featured) {
        post.featured = true;
        wasOptimized = true;
      }
      
      if (wasOptimized) {
        optimizedCount++;
        console.log(`✅ Optimized: ${post.title}`);
      }
    });
    
    // Save optimized blog index
    if (optimizedCount > 0) {
      fs.writeFileSync(blogIndexPath, JSON.stringify(blogData, null, 2));
      console.log(`\n🎉 Optimized ${optimizedCount} articles`);
    } else {
      console.log('\n✅ All articles already optimized');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🎯 SEO OPTIMIZATION SUITE');
  console.log('=========================\n');
  
  const steps = [
    { name: 'SEO Audit', fn: auditBlogSEO },
    { name: 'SEO Optimization', fn: optimizeArticlesSEO }
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
    console.log('🎉 SEO OPTIMIZATION COMPLETE!');
    console.log('📈 Your blog is now optimized for search engines');
    console.log('🔄 Deploy changes to see improvements in rankings');
  } else {
    console.log('⚠️ Some optimizations failed - check output above');
  }
  
  return allSuccess;
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { auditBlogSEO, optimizeArticlesSEO };
