#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validate and fix structured data (Schema.org) for all blog posts
 * Ensures proper JSON-LD for Google rich snippets
 */

console.log('🔍 STRUCTURED DATA VALIDATION & FIX');
console.log('===================================');

function validateAndFixStructuredData() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  let fixedCount = 0;
  let validCount = 0;
  let errorCount = 0;
  const issues = [];

  console.log(`📁 Processing ${files.length} blog files...`);

  files.forEach(filename => {
    const filePath = path.join(blogDir, filename);
    const slug = filename.replace('.md', '');
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let wasModified = false;
      
      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        issues.push(`❌ ${slug}: No frontmatter found`);
        errorCount++;
        return;
      }
      
      const frontmatter = frontmatterMatch[1];
      const restOfContent = content.substring(frontmatterMatch[0].length);
      
      // Extract metadata
      const titleMatch = frontmatter.match(/^title:\s*"([^"]*)"$/m);
      const excerptMatch = frontmatter.match(/^excerpt:\s*"([^"]*)"$/m);
      const imageMatch = frontmatter.match(/^image:\s*"([^"]*)"$/m);
      const dateMatch = frontmatter.match(/^date:\s*"([^"]*)"$/m);
      const categoryMatch = frontmatter.match(/^category:\s*"?([^"\n]*)"?$/m);
      
      if (!titleMatch || !imageMatch || !dateMatch) {
        issues.push(`❌ ${slug}: Missing required metadata (title, image, or date)`);
        errorCount++;
        return;
      }
      
      const title = titleMatch[1];
      const excerpt = excerptMatch ? excerptMatch[1] : '';
      const image = imageMatch[1];
      const date = dateMatch[1];
      const category = categoryMatch ? categoryMatch[1] : 'General';
      
      // Check if structured data exists
      const hasStructuredData = content.includes('"@context": "https://schema.org"');
      
      if (!hasStructuredData) {
        // Add structured data
        const structuredData = `
schema: {
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://currencytocurrency.app/blog/${slug}"
  },
  "headline": "${title}",
  "description": "${excerpt || title}",
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
  "datePublished": "${date}",
  "dateModified": "${new Date().toISOString().split('T')[0]}",
  "articleSection": "${category}",
  "keywords": ["currency", "exchange rates", "finance", "${category.toLowerCase()}"]
}`;
        
        content = content.replace(
          /^---$/m,
          `${structuredData}\n---`
        );
        wasModified = true;
        console.log(`📊 Added structured data: ${slug}`);
      } else {
        // Fix existing structured data issues
        
        // Fix external image URLs
        if (content.includes('https://koala.sh/')) {
          content = content.replace(
            /"url":\s*"https:\/\/koala\.sh\/[^"]*"/g,
            `"url": "https://currencytocurrency.app${image}"`
          );
          wasModified = true;
          console.log(`🖼️  Fixed external image URL: ${slug}`);
        }
        
        // Ensure proper image dimensions
        if (!content.includes('"width": 1200') || !content.includes('"height": 630')) {
          content = content.replace(
            /"width":\s*\d+,?\s*"height":\s*\d+/g,
            '"width": 1200,\n    "height": 630'
          );
          wasModified = true;
          console.log(`📐 Fixed image dimensions: ${slug}`);
        }
        
        // Ensure dateModified is current
        const currentDate = new Date().toISOString().split('T')[0];
        if (!content.includes(`"dateModified": "${currentDate}"`)) {
          content = content.replace(
            /"dateModified":\s*"[^"]*"/g,
            `"dateModified": "${currentDate}"`
          );
          wasModified = true;
          console.log(`📅 Updated dateModified: ${slug}`);
        }
        
        // Add missing articleSection if not present
        if (!content.includes('"articleSection"')) {
          content = content.replace(
            /"keywords":\s*\[/,
            `"articleSection": "${category}",\n  "keywords": [`
          );
          wasModified = true;
          console.log(`📂 Added articleSection: ${slug}`);
        }
        
        // Validate JSON structure
        try {
          const schemaMatch = content.match(/schema:\s*({[\s\S]*?})\s*---/);
          if (schemaMatch) {
            const schemaText = schemaMatch[1];
            // Basic validation - check for proper JSON structure
            if (!schemaText.includes('"@context"') || !schemaText.includes('"@type"')) {
              issues.push(`⚠️  ${slug}: Invalid schema structure`);
            } else {
              validCount++;
            }
          }
        } catch (error) {
          issues.push(`❌ ${slug}: Schema validation error - ${error.message}`);
          errorCount++;
        }
      }
      
      if (wasModified) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
        console.log(`✅ Fixed structured data: ${slug}`);
      } else if (hasStructuredData) {
        validCount++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
      errorCount++;
      issues.push(`❌ ${slug}: Processing error - ${error.message}`);
    }
  });
  
  console.log('\n📊 STRUCTURED DATA VALIDATION SUMMARY:');
  console.log('======================================');
  console.log(`✅ Files with valid structured data: ${validCount}`);
  console.log(`🔧 Files fixed: ${fixedCount}`);
  console.log(`❌ Files with errors: ${errorCount}`);
  console.log(`📝 Total files processed: ${files.length}`);
  
  if (issues.length > 0) {
    console.log('\n🚨 ISSUES FOUND:');
    console.log('================');
    issues.forEach(issue => console.log(issue));
  }
  
  // Generate validation report
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      validStructuredData: validCount,
      fixedFiles: fixedCount,
      errorFiles: errorCount
    },
    issues: issues,
    recommendations: [
      'All articles should have proper Schema.org Article markup',
      'Images should use local URLs, not external services',
      'dateModified should be updated when content changes',
      'articleSection should match the article category'
    ]
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../public/schema-validation-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📄 Detailed report saved to: public/schema-validation-report.json');
  
  return fixedCount > 0;
}

// Main execution
const success = validateAndFixStructuredData();

if (success) {
  console.log('\n🎯 Regenerating blog index...');
  try {
    const { execSync } = require('child_process');
    execSync('node scripts/generate_blog_index.mjs', { stdio: 'inherit' });
    console.log('✅ Blog index regenerated');
  } catch (error) {
    console.error('❌ Error regenerating blog index:', error.message);
  }
} else {
  console.log('\n✅ All structured data is valid');
}
