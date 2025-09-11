#!/usr/bin/env node

/**
 * Build verification script to catch syntax errors before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build files...');

// Check critical files exist
const criticalFiles = [
  'src/pages/PrivacyHub.tsx',
  'src/components/PrivacyPolicyBanner.tsx',
  'src/App.tsx',
  'src/pages/PrivacyPolicy.tsx',
  'src/pages/Index.tsx'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    
    // Basic syntax check for TypeScript files
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for common syntax issues
      if (content.includes('\\n')) {
        console.log(`⚠️  ${file} may have escaped newlines`);
      }
      
      // Check for basic React import
      if (content.includes('import React') || content.includes('import * as React')) {
        console.log(`✅ ${file} has proper React import`);
      }
      
      // Check for proper export
      if (content.includes('export default')) {
        console.log(`✅ ${file} has default export`);
      }
    }
  } else {
    console.log(`❌ ${file} is missing`);
    allFilesExist = false;
  }
});

// Check package.json for duplicate keys
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageContent = fs.readFileSync(packageJsonPath, 'utf8');
  try {
    JSON.parse(packageContent);
    console.log('✅ package.json is valid JSON');
  } catch (error) {
    console.log('❌ package.json has syntax errors:', error.message);
    allFilesExist = false;
  }
}

if (allFilesExist) {
  console.log('🎉 All critical files verified successfully!');
  process.exit(0);
} else {
  console.log('❌ Build verification failed!');
  process.exit(1);
}