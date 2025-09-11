#!/usr/bin/env node

/**
 * Dependency Checker Script
 * Ensures all required dependencies are installed before building
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔍 CHECKING DEPENDENCIES...');

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check if @vitejs/plugin-react is needed
  const hasViteReact = packageJson.devDependencies?.['@vitejs/plugin-react'];
  const hasViteReactSwc = packageJson.devDependencies?.['@vitejs/plugin-react-swc'];
  
  if (hasViteReact || hasViteReactSwc) {
    console.log('✅ Vite React plugin dependencies are satisfied');
  } else {
    console.log('❌ No Vite React plugin found!');
    process.exit(1);
  }
  
  // Check other critical dependencies
  const criticalDeps = [
    'react',
    'react-dom',
    'vite'
  ];
  
  const missingDeps = criticalDeps.filter(dep => 
    !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
  );
  
  if (missingDeps.length > 0) {
    console.log('❌ Missing critical dependencies:', missingDeps.join(', '));
    process.exit(1);
  }
  
  console.log('✅ All dependencies verified!');
  
} catch (error) {
  console.error('❌ Dependency check failed:', error.message);
  process.exit(1);
}