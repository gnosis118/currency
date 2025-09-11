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
  
  // Check if @vitejs/plugin-react is installed
  const hasViteReact = packageJson.devDependencies?.['@vitejs/plugin-react'];
  const hasViteReactSwc = packageJson.devDependencies?.['@vitejs/plugin-react-swc'];
  
  if (!hasViteReact && hasViteReactSwc) {
    console.log('⚠️  Missing @vitejs/plugin-react, but @vitejs/plugin-react-swc is available');
    console.log('✅ Using SWC version for React plugin');
  } else if (!hasViteReact && !hasViteReactSwc) {
    console.log('❌ No Vite React plugin found!');
    console.log('🔧 Installing @vitejs/plugin-react...');
    
    try {
      execSync('npm install --save-dev @vitejs/plugin-react@^4.3.1', { 
        stdio: 'inherit',
        timeout: 60000 
      });
      console.log('✅ @vitejs/plugin-react installed successfully');
    } catch (error) {
      console.error('❌ Failed to install @vitejs/plugin-react:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✅ Vite React plugin dependencies are satisfied');
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