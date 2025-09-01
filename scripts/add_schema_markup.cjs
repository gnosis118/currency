#!/usr/bin/env node

/**
 * Schema Markup Addition Script
 * Adds comprehensive JSON-LD structured data to all blog articles
 */

const fs = require('fs');
const path = require('path');

// Schema templates for different article types
const SCHEMA_TEMPLATES = {
  article: {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": ""
    },
    "headline": "",
    "description": "",
    "image": {
      "@type": "ImageObject",
      "url": "",
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Organization",
      "name": "Currency to Currency",
      "url": "https://currencytocurrency.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://currencytocurrency.app/icon-512.png"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Currency to Currency",
      "logo": {
        "@type": "ImageObject",
        "url": "https://currencytocurrency.app/icon-512.png",
        "width": 512,
        "height": 512
      }
    },
    "datePublished": "",
    "dateModified": "",
    "articleSection": "",
    "keywords": [],
    "wordCount": 0,
    "timeRequired": "",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "about": {
      "@type": "Thing",
      "name": "",
      "description": ""
    }
  },
  
  howTo: {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "",
    "description": "",
    "image": {
      "@type": "ImageObject",
      "url": ""
    },
    "author": {
      "@type": "Organization",
      "name": "Currency to Currency"
    },
    "datePublished": "",
    "totalTime": "",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [],
    "tool": [],
    "step": []
  },
  
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": []
  }
};

// Category-specific schema enhancements
const CATEGORY_SCHEMAS = {
  'Trading': {
    about: {
      "@type": "Thing",
      name: "Forex Trading",
      description: "Foreign exchange trading and currency pair analysis"
    },
    additionalType: "https://schema.org/FinancialProduct"
  },
  'Banking': {
    about: {
      "@type": "Thing", 
      name: "Currency Exchange",
      description: "Banking services and currency conversion"
    },
    additionalType: "https://schema.org/BankOrCreditUnion"
  },
  'Guides': {
    about: {
      "@type": "Thing",
      name: "Currency Conversion",
      description: "Educational guides for currency exchange"
    },
    additionalType: "https://schema.org/Guide"
  },
  'Business': {
    about: {
      "@type": "Thing",
      name: "International Business",
      description: "Business currency management and strategy"
    },
    additionalType: "https://schema.org/BusinessFunction"
  },
  'Technology': {
    about: {
      "@type": "Thing",
      name: "Financial Technology",
      description: "Currency conversion technology and APIs"
    },
    additionalType: "https://schema.org/SoftwareApplication"
  }
};

function generateArticleSchema(post) {
  const schema = JSON.parse(JSON.stringify(SCHEMA_TEMPLATES.article));
  
  // Basic article information
  schema.mainEntityOfPage["@id"] = `https://currencytocurrency.app/blog/${post.slug}`;
  schema.headline = post.title;
  schema.description = post.metaDescription || post.excerpt;
  schema.datePublished = post.publishDate;
  schema.dateModified = post.publishDate;
  schema.articleSection = post.category || "Currency";
  schema.keywords = post.tags || [];
  schema.wordCount = post.wordCount || 0;
  schema.timeRequired = `PT${post.readTime?.replace(/[^\d]/g, '') || '5'}M`;
  
  // Image handling
  if (post.image) {
    let imageUrl = post.image;
    if (imageUrl.startsWith('/src/assets/')) {
      // Convert to full URL for schema
      imageUrl = `https://currencytocurrency.app${imageUrl}`;
    }
    schema.image.url = imageUrl;
  }
  
  // Category-specific enhancements
  if (post.category && CATEGORY_SCHEMAS[post.category]) {
    const categorySchema = CATEGORY_SCHEMAS[post.category];
    schema.about = categorySchema.about;
    if (categorySchema.additionalType) {
      schema.additionalType = categorySchema.additionalType;
    }
  }
  
  // Add breadcrumb schema
  schema.breadcrumb = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://currencytocurrency.app"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Blog",
        "item": "https://currencytocurrency.app/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://currencytocurrency.app/blog/${post.slug}`
      }
    ]
  };
  
  return schema;
}

function extractFAQFromContent(content) {
  const faqSchema = JSON.parse(JSON.stringify(SCHEMA_TEMPLATES.faq));
  
  // Look for FAQ sections in content
  const faqPattern = /###?\s*(.+\?)\s*\n\n([\s\S]*?)(?=\n###|\n##|$)/g;
  let match;
  
  while ((match = faqPattern.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n\n/g, ' ').substring(0, 500);
    
    if (question && answer) {
      faqSchema.mainEntity.push({
        "@type": "Question",
        "name": question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": answer
        }
      });
    }
  }
  
  return faqSchema.mainEntity.length > 0 ? faqSchema : null;
}

function addSchemaToArticle(articlePath, post) {
  try {
    let content = fs.readFileSync(articlePath, 'utf8');
    
    // Check if schema already exists
    if (content.includes('"@context": "https://schema.org"') || content.includes('schema:')) {
      console.log(`⚠️ Schema already exists: ${post.title}`);
      return false;
    }
    
    // Generate main article schema
    const articleSchema = generateArticleSchema(post);
    
    // Extract FAQ schema if present
    const faqSchema = extractFAQFromContent(content);
    
    // Find frontmatter end
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      console.log(`❌ No frontmatter found: ${post.title}`);
      return false;
    }
    
    // Parse existing frontmatter
    const frontmatter = content.substring(0, frontmatterEnd + 3);
    const bodyContent = content.substring(frontmatterEnd + 3);
    
    // Add schema to frontmatter
    let updatedFrontmatter = frontmatter.replace('---\n', '');
    
    // Add article schema
    updatedFrontmatter += `schema: ${JSON.stringify(articleSchema, null, 2)}\n`;
    
    // Add FAQ schema if present
    if (faqSchema) {
      updatedFrontmatter += `faqSchema: ${JSON.stringify(faqSchema, null, 2)}\n`;
    }
    
    updatedFrontmatter += '---\n';
    
    // Write updated content
    const updatedContent = updatedFrontmatter + bodyContent;
    fs.writeFileSync(articlePath, updatedContent);
    
    console.log(`✅ Added schema: ${post.title}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${post.title}:`, error.message);
    return false;
  }
}

function addSchemaToAllArticles() {
  console.log('📋 ADDING STRUCTURED DATA TO ALL ARTICLES');
  console.log('==========================================');
  
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  const contentDir = path.join(__dirname, '../src/content/blog');
  
  if (!fs.existsSync(blogIndexPath)) {
    console.error('❌ blog-index.json not found');
    return false;
  }
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    let processedCount = 0;
    let addedCount = 0;
    
    console.log(`📊 Processing ${blogData.length} articles...\n`);
    
    blogData.forEach((post) => {
      const articlePath = path.join(contentDir, `${post.slug}.md`);
      
      if (fs.existsSync(articlePath)) {
        processedCount++;
        const wasAdded = addSchemaToArticle(articlePath, post);
        if (wasAdded) {
          addedCount++;
        }
      } else {
        console.log(`⚠️ Article file not found: ${post.slug}.md`);
      }
    });
    
    console.log('\n📈 SCHEMA ADDITION RESULTS:');
    console.log('===========================');
    console.log(`Articles processed: ${processedCount}`);
    console.log(`Schema added: ${addedCount}`);
    console.log(`Already had schema: ${processedCount - addedCount}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error adding schema markup:', error.message);
    return false;
  }
}

function generateSchemaValidationReport() {
  console.log('\n🔍 SCHEMA VALIDATION REPORT');
  console.log('===========================');
  
  const blogIndexPath = path.join(__dirname, '../public/blog-index.json');
  const contentDir = path.join(__dirname, '../src/content/blog');
  
  try {
    const blogData = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    const report = {
      generatedAt: new Date().toISOString(),
      totalArticles: blogData.length,
      withSchema: 0,
      withFAQ: 0,
      articles: []
    };
    
    blogData.forEach((post) => {
      const articlePath = path.join(contentDir, `${post.slug}.md`);
      const articleReport = {
        title: post.title,
        slug: post.slug,
        hasSchema: false,
        hasFAQ: false,
        schemaTypes: []
      };
      
      if (fs.existsSync(articlePath)) {
        const content = fs.readFileSync(articlePath, 'utf8');
        
        if (content.includes('"@context": "https://schema.org"')) {
          articleReport.hasSchema = true;
          report.withSchema++;
          
          // Detect schema types
          if (content.includes('"@type": "Article"')) {
            articleReport.schemaTypes.push('Article');
          }
          if (content.includes('"@type": "HowTo"')) {
            articleReport.schemaTypes.push('HowTo');
          }
          if (content.includes('"@type": "FAQPage"')) {
            articleReport.hasFAQ = true;
            articleReport.schemaTypes.push('FAQPage');
            report.withFAQ++;
          }
        }
      }
      
      report.articles.push(articleReport);
    });
    
    // Save report
    const reportPath = path.join(__dirname, '../public/schema-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Articles with schema: ${report.withSchema}/${report.totalArticles}`);
    console.log(`📊 Articles with FAQ schema: ${report.withFAQ}/${report.totalArticles}`);
    console.log(`✅ Validation report saved to: schema-validation-report.json`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error generating validation report:', error.message);
    return false;
  }
}

function createSchemaTestingGuide() {
  console.log('\n📖 CREATING SCHEMA TESTING GUIDE');
  console.log('=================================');
  
  const guide = `# Schema Markup Testing Guide

## Testing Tools

### 1. Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- Test individual article URLs
- Validates Article, FAQ, and BreadcrumbList schemas

### 2. Schema.org Validator
- URL: https://validator.schema.org/
- Comprehensive schema validation
- Detailed error reporting

### 3. Google Search Console
- Monitor rich results performance
- Track schema-related issues
- View search appearance enhancements

## Schema Types Implemented

### Article Schema
- ✅ Basic article information
- ✅ Author and publisher details
- ✅ Publication dates
- ✅ Image metadata
- ✅ Category and keywords
- ✅ Word count and reading time

### FAQ Schema
- ✅ Automatically extracted from content
- ✅ Question and answer pairs
- ✅ Enhanced search snippets

### Breadcrumb Schema
- ✅ Navigation hierarchy
- ✅ Improved search result display
- ✅ Better user experience

## Testing Checklist

### For Each Article:
- [ ] Article schema validates without errors
- [ ] Image URLs are accessible
- [ ] Author and publisher information is complete
- [ ] Dates are in correct ISO format
- [ ] Keywords array is populated
- [ ] FAQ schema (if applicable) validates

### Common Issues to Check:
- [ ] Image URLs return 200 status
- [ ] No duplicate schema markup
- [ ] Proper JSON-LD formatting
- [ ] All required properties present
- [ ] Correct schema.org types used

## Expected Benefits

### Search Engine Results:
- Enhanced snippets with rich information
- FAQ sections in search results
- Breadcrumb navigation in results
- Author and publication date display

### SEO Improvements:
- Better content understanding by search engines
- Increased click-through rates
- Higher search result visibility
- Improved topic authority signals

## Monitoring and Maintenance

### Weekly:
- Check Google Search Console for schema errors
- Monitor rich results performance
- Test new articles with validation tools

### Monthly:
- Review schema markup effectiveness
- Update schema templates if needed
- Analyze rich results click-through rates

### Quarterly:
- Comprehensive schema audit
- Update schema.org specifications
- Optimize based on performance data
`;

  const guidePath = path.join(__dirname, '../docs/schema-testing-guide.md');
  
  // Create docs directory if it doesn't exist
  const docsDir = path.dirname(guidePath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  fs.writeFileSync(guidePath, guide);
  console.log(`✅ Schema testing guide created: docs/schema-testing-guide.md`);
  
  return true;
}

// Main execution
function main() {
  console.log('🏗️ STRUCTURED DATA IMPLEMENTATION');
  console.log('=================================\n');
  
  const steps = [
    { name: 'Add Schema Markup', fn: addSchemaToAllArticles },
    { name: 'Generate Validation Report', fn: generateSchemaValidationReport },
    { name: 'Create Testing Guide', fn: createSchemaTestingGuide }
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
    console.log('🎉 STRUCTURED DATA IMPLEMENTATION COMPLETE!');
    console.log('📈 Your articles now have comprehensive schema markup');
    console.log('🔍 Test with Google Rich Results Test tool');
    console.log('📊 Monitor performance in Google Search Console');
  } else {
    console.log('⚠️ Some steps failed - check output above');
  }
  
  return allSuccess;
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { addSchemaToAllArticles, generateSchemaValidationReport };
