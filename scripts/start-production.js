#!/usr/bin/env node

import { config } from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
config({ path: path.join(__dirname, '..', '.env') });

console.log('🔧 Loading environment variables...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Loaded' : '✗ Missing');
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? '✓ Loaded' : '✗ Missing');
console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET ? '✓ Loaded' : '✗ Missing');

// Start the production server
console.log('🚀 Starting production server...');
const serverPath = path.join(__dirname, '..', '.output', 'server', 'index.mjs');

const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`🛑 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
});
