#!/usr/bin/env node

/**
 * USD to EUR Article Auto-Updater
 * 
 * This script automatically updates the USD/EUR article with:
 * - Current date
 * - Fresh conversion examples
 * - Market context (you can customize this)
 * 
 * Run this daily via cron job or Task Scheduler
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const ARTICLE_PATH = path.join(__dirname, 'src', 'content', 'blog', 'usd-to-eur-daily-rates-analysis.md');
const API_KEY = '669f46bf3291450b876bd2a28d8410e6';
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`;
const LOG_FILE = path.join(__dirname, 'update-log.txt');

// Helper function to fetch exchange rate
function fetchExchangeRate() {
    return new Promise((resolve, reject) => {
        https.get(API_URL, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.rates && parsed.rates.EUR) {
                        resolve(parsed.rates.EUR);
                    } else {
                        reject(new Error('EUR rate not found in API response'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// Helper function to log messages
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(LOG_FILE, logMessage);
}

// Helper function to format currency
function formatCurrency(amount, decimals = 2) {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Main update function
async function updateArticle() {
    try {
        log('Starting article update...');
        
        // Check if article exists
        if (!fs.existsSync(ARTICLE_PATH)) {
            throw new Error(`Article not found at: ${ARTICLE_PATH}`);
        }
        
        // Fetch current exchange rate
        log('Fetching exchange rate...');
        const rate = await fetchExchangeRate();
        log(`Current USD/EUR rate: ${rate}`);
        
        // Read article content
        let content = fs.readFileSync(ARTICLE_PATH, 'utf8');
        
        // Update date in frontmatter
        const today = new Date().toISOString().split('T')[0];
        content = content.replace(
            /date: "\d{4}-\d{2}-\d{2}"/,
            `date: "${today}"`
        );
        
        // Update "Last Updated" text
        const lastUpdated = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        content = content.replace(
            /\*\*Last Updated:.*?\*\*/,
            `**Last Updated: ${lastUpdated}**`
        );
        
        // Update conversion examples in the article text
        const conversions = [
            { amount: 100, id: 'convert-100' },
            { amount: 1000, id: 'convert-1000' },
            { amount: 5000, id: 'convert-5000' },
            { amount: 10000, id: 'convert-10000' }
        ];
        
        conversions.forEach(({ amount, id }) => {
            const converted = amount * rate;
            const formatted = formatCurrency(converted);
            
            // Update the default values in the HTML
            const regex = new RegExp(`(<div id="${id}"[^>]*>)€[\\d,]+\\.\\d{2}(<\\/div>)`, 'g');
            content = content.replace(regex, `$1€${formatted}$2`);
        });
        
        // Update default rate in JavaScript
        content = content.replace(
            /let currentRate = [\d.]+;/,
            `let currentRate = ${rate.toFixed(4)};`
        );
        content = content.replace(
            /let previousRate = [\d.]+;/,
            `let previousRate = ${rate.toFixed(4)};`
        );
        
        // Update market analysis section (you can customize this based on news APIs)
        const marketAnalysis = `
The USD/EUR pair continues to reflect current economic conditions and monetary policy divergence between the Federal Reserve and European Central Bank. Recent trading sessions show the pair responding to economic data releases and central bank communications.

Market participants are monitoring key economic indicators including inflation data, employment figures, and GDP growth from both regions. These factors continue to influence medium-term currency movements and trader positioning.
        `.trim();
        
        // Replace the market analysis section
        content = content.replace(
            /## Daily Market Analysis & Trends[\s\S]*?\n\n## Real-Time Conversion Calculator/,
            `## Daily Market Analysis & Trends\n\n*This section is updated daily with current market context*\n\n${marketAnalysis}\n\n## Real-Time Conversion Calculator`
        );
        
        // Write updated content back to file
        fs.writeFileSync(ARTICLE_PATH, content, 'utf8');
        
        log(`Article updated successfully!`);
        log(`New rate: $1 = €${rate.toFixed(4)}`);
        log('---');
        
        return true;
    } catch (error) {
        log(`ERROR: ${error.message}`);
        log(`Stack: ${error.stack}`);
        return false;
    }
}

// Run the update
updateArticle()
    .then((success) => {
        process.exit(success ? 0 : 1);
    })
    .catch((error) => {
        log(`FATAL ERROR: ${error.message}`);
        process.exit(1);
    });
