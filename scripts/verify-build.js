#!/usr/bin/env node

/**
 * Build Verification Script
 * Verifies that all required files and dependencies are present before building
 */

import fs from 'fs';
import path from 'path';

function verifyBuildRequirements() {
  console.log('🔍 VERIFYING BUILD REQUIREMENTS');
  console.log('===============================');
  
  const errors = [];
  const warnings = [];
  
  // Check required directories
  const requiredDirs = [
    'src',
    'src/components',
    'src/pages',
    'src/assets',
    'public'
  ];
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      errors.push(`Missing required directory: ${dir}`);
    } else {
      console.log(`✅ Directory exists: ${dir}`);
    }
  });
  
  // Check required files
  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'index.html',
    'src/main.tsx',
    'src/App.tsx'
  ];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      errors.push(`Missing required file: ${file}`);
    } else {
      console.log(`✅ File exists: ${file}`);
    }
  });
  
  // Check package.json dependencies
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const criticalDeps = [
      'react',
      'react-dom',
      'vite'
    ];
    
    criticalDeps.forEach(dep => {
      if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
        errors.push(`Missing critical dependency: ${dep}`);
      } else {
        console.log(`✅ Dependency found: ${dep}`);
      }
    });
    
    // Check for Vite React plugin
    if (!packageJson.dependencies?.['@vitejs/plugin-react'] && 
        !packageJson.devDependencies?.['@vitejs/plugin-react']) {
      warnings.push('Missing @vitejs/plugin-react - may cause build issues');
    }
    
  } catch (error) {
    errors.push('Cannot read or parse package.json');
  }
  
  // Check blog index
  if (fs.existsSync('public/blog-index.json')) {
    try {
      const blogIndex = JSON.parse(fs.readFileSync('public/blog-index.json', 'utf8'));
      console.log(`✅ Blog index loaded: ${blogIndex.length} articles`);
    } catch (error) {
      warnings.push('Blog index exists but cannot be parsed');
    }
  } else {
    warnings.push('Blog index not found - will be generated');
  }
  
  // Check sitemap
  if (fs.existsSync('public/sitemap.xml')) {
    console.log('✅ Sitemap exists');
  } else {
    warnings.push('Sitemap not found');
  }
  
  // Check assets
  if (fs.existsSync('src/assets')) {
    const assets = fs.readdirSync('src/assets').filter(file => 
      /\.(jpg|jpeg|png|webp|svg)$/i.test(file)
    );
    console.log(`✅ Found ${assets.length} image assets`);
  }
  
  // Report results
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('========================');
  
  if (warnings.length > 0) {
    console.log('\n⚠️ WARNINGS:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach(error => console.log(`   ${error}`));
    console.log('\n💥 Build verification failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All critical requirements verified');
    console.log('🚀 Ready to build!');
  }
}

// Environment checks
function checkEnvironment() {
  console.log('\n🌍 ENVIRONMENT CHECK:');
  console.log('=====================');
  
  console.log(`Node.js version: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Architecture: ${process.arch}`);
  
  // Check if we're in Netlify
  if (process.env.NETLIFY) {
    console.log('🌐 Running on Netlify');
    console.log(`Build ID: ${process.env.BUILD_ID || 'Unknown'}`);
    console.log(`Deploy URL: ${process.env.DEPLOY_URL || 'Unknown'}`);
  } else {
    console.log('💻 Running locally');
  }
}

// Memory and performance checks
function checkResources() {
  console.log('\n💾 RESOURCE CHECK:');
  console.log('==================');
  
  const memUsage = process.memoryUsage();
  console.log(`Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
  
  // Check available disk space (basic check)
  try {
    const stats = fs.statSync('.');
    console.log('✅ Filesystem accessible');
  } catch (error) {
    console.log('❌ Filesystem access issues');
  }
}

// Main execution
function main() {
  console.log('🔧 BUILD VERIFICATION TOOL');
  console.log('==========================\n');
  
  try {
    checkEnvironment();
    checkResources();
    verifyBuildRequirements();
    
    console.log('\n🎉 BUILD VERIFICATION COMPLETE!');
    console.log('Ready to proceed with build process.');
    
  } catch (error) {
    console.error('\n💥 Verification failed:', error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { verifyBuildRequirements, checkEnvironment, checkResources };
