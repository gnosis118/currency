#!/usr/bin/env node

/**
 * Start Local Admin Server
 * Runs the Decap CMS local backend for blog management
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Local Admin Server...');
console.log('📝 Admin will be available at: http://localhost:8081/admin/');
console.log('🔧 Local backend will be available at: http://localhost:8081');

// Start the local backend server
const server = spawn('npx', ['decap-server'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

server.on('error', (error) => {
  console.error('❌ Failed to start admin server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`📝 Admin server stopped with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping admin server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping admin server...');
  server.kill('SIGTERM');
});
