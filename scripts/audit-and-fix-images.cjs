// scripts/audit-and-fix-images.cjs
// Comprehensive image audit and alt text verification script

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const PROJECT_ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// Track issues
const issues = {
  missingAlt: [],
  emptyAlt: [],
  poorAlt: [],
  largeImages: [],
  unoptimizedFormats: []
};

// Check if alt text is descriptive enough
function isAltTextDescriptive(alt) {
  if (!alt || alt.trim().length === 0) return false;
  if (alt.length < 5) return false;
  
  const poorAltPatterns = [
    /^image$/i,
    /^img$/i,
    /^picture$/i,
    /^photo$/i,
    /^icon$/i,
    /^logo$/i,
    /^\d+$/,  // Just numbers
    /^untitled/i
  ];
  
  return !poorAltPatterns.some(pattern => pattern.test(alt));
}

// Analyze TSX/JSX files for img tags
async function analyzeComponentFiles() {
  const files = await glob('**/*.{tsx,jsx}', {
    cwd: SRC_DIR,
    ignore: ['node_modules/**', 'dist/**', 'build/**']
  });

  console.log(`\n📊 Analyzing ${files.length} component files...\n`);

  for (const file of files) {
    const filePath = path.join(SRC_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Find all img tags
    const imgTagRegex = /<img\s+([^>]*?)>/gi;
    const matches = content.matchAll(imgTagRegex);
    
    for (const match of matches) {
      const imgTag = match[0];
      const attributes = match[1];
      
      // Check for alt attribute
      const altMatch = attributes.match(/alt\s*=\s*["']([^"']*)["']/i);
      const srcMatch = attributes.match(/src\s*=\s*["']([^"']*)["']/i);
      
      const src = srcMatch ? srcMatch[1] : 'unknown';
      
      if (!altMatch) {
        issues.missingAlt.push({
          file: file,
          line: getLineNumber(content, match.index),
          src: src,
          tag: imgTag
        });
      } else {
        const alt = altMatch[1];
        if (alt.trim() === '') {
          issues.emptyAlt.push({
            file: file,
            line: getLineNumber(content, match.index),
            src: src
          });
        } else if (!isAltTextDescriptive(alt)) {
          issues.poorAlt.push({
            file: file,
            line: getLineNumber(content, match.index),
            src: src,
            alt: alt
          });
        }
      }
    }
  }
}

// Helper to get line number
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

// Analyze image files in public directory
async function analyzeImageFiles() {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const files = await glob('**/*', {
    cwd: PUBLIC_DIR,
    nodir: true
  });

  console.log(`\n📁 Analyzing ${files.length} files in public directory...\n`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;

    const filePath = path.join(PUBLIC_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeInKB = stats.size / 1024;

    // Check for large images
    if (sizeInKB > 200 && ext !== '.svg') {
      issues.largeImages.push({
        file: file,
        size: `${sizeInKB.toFixed(2)} KB`
      });
    }

    // Check for unoptimized formats
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      issues.unoptimizedFormats.push({
        file: file,
        suggestion: `Convert to WebP for ${Math.round(100 - (sizeInKB * 0.7 / sizeInKB * 100))}% size reduction`
      });
    }
  }
}

// Generate suggested alt text based on file name
function generateSuggestedAlt(src) {
  const filename = path.basename(src, path.extname(src));
  
  // Convert kebab-case or snake_case to readable text
  const readable = filename
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return readable;
}

// Generate report
function generateReport() {
  console.log('\n' + '='.repeat(70));
  console.log('📊 IMAGE AUDIT REPORT');
  console.log('='.repeat(70) + '\n');

  // Missing Alt Text
  if (issues.missingAlt.length > 0) {
    console.log(`❌ MISSING ALT TEXT (${issues.missingAlt.length} issues):`);
    console.log('-'.repeat(70));
    issues.missingAlt.forEach(issue => {
      console.log(`\nFile: ${issue.file}:${issue.line}`);
      console.log(`Source: ${issue.src}`);
      console.log(`Suggested alt: "${generateSuggestedAlt(issue.src)}"`);
      console.log(`Fix: Add alt="${generateSuggestedAlt(issue.src)}" to the img tag`);
    });
    console.log('\n');
  }

  // Empty Alt Text
  if (issues.emptyAlt.length > 0) {
    console.log(`⚠️  EMPTY ALT TEXT (${issues.emptyAlt.length} issues):`);
    console.log('-'.repeat(70));
    issues.emptyAlt.forEach(issue => {
      console.log(`\nFile: ${issue.file}:${issue.line}`);
      console.log(`Source: ${issue.src}`);
      console.log(`Suggested alt: "${generateSuggestedAlt(issue.src)}"`);
    });
    console.log('\n');
  }

  // Poor Alt Text
  if (issues.poorAlt.length > 0) {
    console.log(`⚠️  POOR ALT TEXT QUALITY (${issues.poorAlt.length} issues):`);
    console.log('-'.repeat(70));
    issues.poorAlt.forEach(issue => {
      console.log(`\nFile: ${issue.file}:${issue.line}`);
      console.log(`Source: ${issue.src}`);
      console.log(`Current alt: "${issue.alt}"`);
      console.log(`Suggested alt: "${generateSuggestedAlt(issue.src)}"`);
    });
    console.log('\n');
  }

  // Large Images
  if (issues.largeImages.length > 0) {
    console.log(`📦 LARGE IMAGES (${issues.largeImages.length} files > 200KB):`);
    console.log('-'.repeat(70));
    issues.largeImages.forEach(issue => {
      console.log(`${issue.file} - ${issue.size}`);
    });
    console.log('\n💡 Recommendation: Compress these images or convert to WebP\n');
  }

  // Unoptimized Formats
  if (issues.unoptimizedFormats.length > 0) {
    console.log(`🔄 UNOPTIMIZED FORMATS (${issues.unoptimizedFormats.length} files):`);
    console.log('-'.repeat(70));
    issues.unoptimizedFormats.slice(0, 10).forEach(issue => {
      console.log(`${issue.file} - ${issue.suggestion}`);
    });
    if (issues.unoptimizedFormats.length > 10) {
      console.log(`... and ${issues.unoptimizedFormats.length - 10} more files`);
    }
    console.log('\n💡 Recommendation: Convert JPG/PNG images to WebP format\n');
  }

  // Summary
  console.log('='.repeat(70));
  console.log('📈 SUMMARY:');
  console.log('='.repeat(70));
  console.log(`Missing Alt Text: ${issues.missingAlt.length}`);
  console.log(`Empty Alt Text: ${issues.emptyAlt.length}`);
  console.log(`Poor Alt Text: ${issues.poorAlt.length}`);
  console.log(`Large Images: ${issues.largeImages.length}`);
  console.log(`Unoptimized Formats: ${issues.unoptimizedFormats.length}`);
  
  const totalIssues = issues.missingAlt.length + issues.emptyAlt.length + 
                     issues.poorAlt.length + issues.largeImages.length + 
                     issues.unoptimizedFormats.length;
  
  console.log(`\nTotal Issues: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n✅ All images are properly optimized with descriptive alt text!');
  } else {
    console.log('\n⚠️  Please address the issues above to improve SEO and accessibility.');
  }
  console.log('='.repeat(70) + '\n');

  // Save report to file
  const reportPath = path.join(PROJECT_ROOT, 'public', 'image-seo-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
  console.log(`📄 Detailed report saved to: public/image-seo-audit-report.json\n`);
}

// Main execution
async function main() {
  console.log('🔍 Starting comprehensive image audit...\n');
  
  await analyzeComponentFiles();
  await analyzeImageFiles();
  generateReport();
  
  // Exit with error code if critical issues found
  const criticalIssues = issues.missingAlt.length + issues.emptyAlt.length;
  if (criticalIssues > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
