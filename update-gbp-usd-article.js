#!/usr/bin/env node

/**
 * GBP to USD Article Auto-Updater
 * 
 * Automatically updates the GBP/USD article with:
 * - Current date
 * - Fresh conversion examples  
 * - Market context
 * 
 * Run daily via cron job or Task Scheduler
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const ARTICLE_PATH = path.join(__dirname, 'src', 'content', 'blog', 'gbp-to-usd-live-exchange-rate-british-pound-dollar-converter.md');
const API_KEY = '669f46bf3291450b876bd2a28d8410e6';
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=GBP`;
const LOG_FILE = path.join(__dirname, 'update-log-gbp-usd.txt');

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
                    if (parsed.rates && parsed.rates.USD) {
                        resolve(parsed.rates.USD);
                    } else {
                        reject(new Error('USD rate not found in API response'));
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
        log('Starting GBP/USD article update...');
        
        // Check if article exists
        if (!fs.existsSync(ARTICLE_PATH)) {
            throw new Error(`Article not found at: ${ARTICLE_PATH}`);
        }
        
        // Fetch current exchange rate
        log('Fetching exchange rate...');
        const rate = await fetchExchangeRate();
        log(`Current GBP/USD rate: ${rate}`);
        
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
        
        // Update "Last Updated" at bottom
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        content = content.replace(
            /\*\*Last Updated\*\*:.*?\| \*\*Next Update\*\*:.*?GMT/,
            `**Last Updated**: ${lastUpdated} | **Next Update**: ${tomorrowString} at 9:00 AM GMT`
        );
        
        // Update conversion examples in the article text
        const conversions = [
            { amount: 100, id: 'convert-100' },
            { amount: 500, id: 'convert-500' },
            { amount: 1000, id: 'convert-1000' },
            { amount: 5000, id: 'convert-5000' }
        ];
        
        conversions.forEach(({ amount, id }) => {
            const converted = amount * rate;
            const formatted = formatCurrency(converted);
            
            // Update the default values in the HTML
            const regex = new RegExp(`(<div id="${id}"[^>]*>)\\$[\\d,]+\\.\\d{2}(<\\/div>)`, 'g');
            content = content.replace(regex, `$1$${formatted}$2`);
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
        
        // Update market analysis section
        const marketAnalysis = `
The GBP/USD currency pair continues to respond to evolving monetary policy expectations from both the Bank of England and Federal Reserve. Recent trading sessions reflect market assessment of inflation trends, economic growth data, and central bank communications from both sides of the Atlantic.

Current market focus centers on upcoming economic releases including employment figures, inflation data, and GDP growth from both countries. These data points will inform central bank policy decisions and directly influence near-term exchange rate movements.

Traders are closely monitoring statements from BoE and Fed officials for clues about future interest rate trajectories. Any divergence in policy paths—whether the Fed cuts rates while the BoE maintains higher rates, or vice versa—will likely drive significant GBP/USD movement in coming weeks.
        `.trim();
        
        // Replace the market analysis section
        content = content.replace(
            /## Daily Market Update[\s\S]*?\n\n## Convert GBP to USD Now/,
            `## Daily Market Update\n\n*This section updates daily with current market context and rate movements*\n\n${marketAnalysis}\n\n## Convert GBP to USD Now`
        );
        
        // Write updated content back to file
        fs.writeFileSync(ARTICLE_PATH, content, 'utf8');
        
        log(`Article updated successfully!`);
        log(`New rate: £1 = $${rate.toFixed(4)}`);
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
