#!/usr/bin/env node

/**
 * Build Verification Script
 * Checks that all required files and dependencies are present
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build environment...');

// Check Node.js version
const nodeVersion = process.version;
console.log(`✅ Node.js version: ${nodeVersion}`);

// Check required files exist
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'src/App.tsx',
  'src/main.tsx',
  'index.html',
  'public/robots.txt',
  'public/sitemap-index.xml'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check package.json has required scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'dev', 'preview'];
requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ Script '${script}' exists`);
  } else {
    console.log(`❌ Script '${script}' missing`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('🎉 Build environment verification passed!');
  process.exit(0);
} else {
  console.log('❌ Build environment verification failed!');
  process.exit(1);
}
