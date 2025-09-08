#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix malformed frontmatter in blog posts
 * Ensures all files have proper YAML frontmatter structure
 */

console.log('🔧 FIXING MALFORMED FRONTMATTER');
console.log('================================');

function fixFrontmatter() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  let fixedCount = 0;
  let errorCount = 0;

  console.log(`📁 Processing ${files.length} blog files...`);

  files.forEach(filename => {
    const filePath = path.join(blogDir, filename);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Fix missing opening ---
      if (content.startsWith('title:') && !content.startsWith('---')) {
        content = '---\n' + content;
      }
      
      // Fix malformed frontmatter patterns
      content = content.replace(/---schema:/g, '---\nschema:');
      
      // Ensure proper frontmatter structure
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        let frontmatter = frontmatterMatch[1];
        const restOfContent = content.substring(frontmatterMatch[0].length);
        
        // Clean up any duplicate image properties
        const imageLines = frontmatter.match(/^(image|featuredImage|cover):\s*.*$/gm);
        if (imageLines && imageLines.length > 1) {
          // Keep the last image property (most recent)
          const lastImageLine = imageLines[imageLines.length - 1];
          frontmatter = frontmatter.replace(/^(image|featuredImage|cover):\s*.*$/gm, '');
          frontmatter = frontmatter.replace(/\n\n+/g, '\n\n').trim();
          frontmatter += '\n' + lastImageLine;
        }
        
        content = `---\n${frontmatter}\n---${restOfContent}`;
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed frontmatter: ${filename}`);
        fixedCount++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n📊 FRONTMATTER FIX SUMMARY:');
  console.log('===========================');
  console.log(`✅ Files fixed: ${fixedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total files processed: ${files.length}`);
  
  return fixedCount > 0;
}

// Main execution
const success = fixFrontmatter();

if (success) {
  console.log('\n🎯 Regenerating blog index...');
  try {
    const { execSync } = require('child_process');
    execSync('node scripts/generate_blog_index.mjs', { stdio: 'inherit' });
    console.log('✅ Blog index regenerated');
    
    console.log('\n🎯 Running validation...');
    execSync('node scripts/validate_unique_images.cjs', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ Error in post-processing:', error.message);
  }
} else {
  console.log('\n⚠️  No frontmatter issues found');
}
