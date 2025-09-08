const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// List of files that need empty line fixes
const filesToFix = [
  'ultimate-currency-conversion-guide-2025.md',
  'real-time-exchange-rate-analysis-trading-guide.md',
  'international-money-transfer-guide-2025-complete-comparison-of-15-services.md',
  'international-business-currency-strategy-guide.md',
  'hidden-currency-conversion-fees-how-banks-disguise-charges.md',
  'forex-currency-pairs-complete-trading-guide-2025.md',
  'digital-nomad-currency-management-complete-guide.md',
  'currency-volatility-protection-advanced-hedging-strategies-for-individual-investors.md',
  'central-bank-digital-currencies-cbdcs-complete-guide-to-the-future-of-money.md',
  'best-currency-exchange-rates-comparison-2025.md',
  'ai-forex-trading-for-beginners-complete-2025-guide-to-automated-trading.md',
  '2025-08-26-best-currency-converter-apps-for-accurate-real-time-exchange-rates-in-2025.md'
];

function fixEmptyLines() {
  console.log('🔧 FIXING EMPTY LINES AT START OF FILES');
  console.log('=======================================');
  
  let fixedCount = 0;
  
  filesToFix.forEach(filename => {
    const filePath = path.join(blogDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      return;
    }
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Remove all leading whitespace and empty lines
      content = content.replace(/^\s+/, '');
      
      // Ensure the file starts with ---
      if (!content.startsWith('---')) {
        console.log(`⚠️  File doesn't start with frontmatter: ${filename}`);
        return;
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${filename}`);
        fixedCount++;
      } else {
        console.log(`✓ Already correct: ${filename}`);
      }
      
    } catch (error) {
      console.error(`❌ Error fixing ${filename}:`, error.message);
    }
  });
  
  console.log(`\n📊 SUMMARY: Fixed ${fixedCount} files`);
  return fixedCount >= 0;
}

// Run the fix
if (require.main === module) {
  const success = fixEmptyLines();
  process.exit(success ? 0 : 1);
}

module.exports = { fixEmptyLines };
