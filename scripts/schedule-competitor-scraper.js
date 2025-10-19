#!/usr/bin/env node

/**
 * Daily Scheduler for Competitor Article Scraper
 *
 * Runs the competitor article scraper every day at a specified time
 *
 * Usage: node scripts/schedule-competitor-scraper.js
 * Or: npm run schedule-scraper
 */

import schedule from 'node-schedule';
import { main } from './competitor-article-rewriter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SCHEDULE_TIME = process.env.SCRAPER_TIME || '09:00'; // 9 AM daily
const LOG_FILE = path.join(__dirname, '../logs/scraper.log');

/**
 * Log message to file and console
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);
  
  // Ensure logs directory exists
  const logsDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

/**
 * Parse time string (HH:MM format)
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hour: hours, minute: minutes };
}

/**
 * Start scheduler
 */
function startScheduler() {
  const time = parseTime(SCHEDULE_TIME);
  
  log('🚀 Competitor Article Scraper Scheduler Started');
  log(`⏰ Scheduled to run daily at ${SCHEDULE_TIME}`);
  
  // Schedule job
  const job = schedule.scheduleJob(
    { hour: time.hour, minute: time.minute },
    async () => {
      log('▶️  Starting scheduled competitor article scraper...');
      
      try {
        await main();
        log('✅ Scheduled scraper completed successfully');
      } catch (error) {
        log(`❌ Scheduled scraper failed: ${error.message}`);
      }
    }
  );
  
  log(`📅 Next run: ${job.nextInvocation()}`);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('🛑 Scheduler shutting down...');
    job.cancel();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('🛑 Scheduler terminating...');
    job.cancel();
    process.exit(0);
  });
  
  // Keep process alive
  log('⏳ Scheduler is running. Press Ctrl+C to stop.');
}

// Start scheduler
startScheduler();

export { startScheduler };

