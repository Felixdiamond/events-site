#!/usr/bin/env node

/**
 * This script is designed to be run by a cron job on Hostinger
 * It will compile and execute the TypeScript send-reminders script
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(projectRoot, '.env.local') });

try {
  console.log('Starting reminder sending process...');
  
  // Execute the TypeScript script using ts-node
  // This requires ts-node to be installed globally or as a dev dependency
  const result = execSync('npx ts-node --project tsconfig.json -r tsconfig-paths/register src/scripts/send-reminders.ts', {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env
  });
  
  console.log('Reminder sending process completed successfully');
  process.exit(0);
} catch (error) {
  console.error('Error executing reminder script:', error);
  process.exit(1);
} 