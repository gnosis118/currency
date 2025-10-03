#!/usr/bin/env node

/**
 * USD to JPY Article Auto-Updater
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ARTICLE_PATH = path.join(__dirname, 'src', 'content', 'blog', 'usd-to-jpy-live-dollar-yen-exchange-rate-converter.md');
const API_KEY = '669f46bf3291450b876bd2a28d8410e6';
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=USD`;
const LOG_FILE = path.join(__dirname, 'update-log-usd-jpy.txt');

function fetchExchangeRate() {
    return new Promise((resolve, reject) => {
        https.get(API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.rates && parsed.rates.JPY) {
                        resolve(parsed.rates.JPY);
                    } else {
                        reject(new Error('JPY rate not found'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(LOG_FILE, logMessage);
}

async function updateArticle() {
    try {
        log('Starting USD/JPY article update...');
        
        if (!fs.existsSync(ARTICLE_PATH)) {
            throw new Error(`Article not found at: ${ARTICLE_PATH}`);
        }
        
        log('Fetching exchange rate...');
        const rate = await fetchExchangeRate();
        log(`Current USD/JPY rate: ${rate}`);
        
        let content = fs.readFileSync(ARTICLE_PATH, 'utf8');
        
        // Update date
        const today = new Date().toISOString().split('T')[0];
        content = content.replace(/date: "\d{4}-\d{2}-\d{2}"/, `date: "${today}"`);
        
        // Update "Last Updated"
        const lastUpdated = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        content = content.replace(/\*\*Last Updated:.*?\*\*/, `**Last Updated: ${lastUpdated}**`);
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        content = content.replace(
            /\*\*Last Updated\*\*:.*?\| \*\*Next Update\*\*:.*?GMT/,
            `**Last Updated**: ${lastUpdated} | **Next Update**: ${tomorrowString} at 9:00 AM GMT`
        );
        
        // Update conversion examples
        const conversions = [
            { amount: 100, id: 'convert-100' },
            { amount: 500, id: 'convert-500' },
            { amount: 1000, id: 'convert-1000' },
            { amount: 5000, id: 'convert-5000' }
        ];
        
        conversions.forEach(({ amount, id }) => {
            const converted = amount * rate;
            const formatted = Math.round(converted).toLocaleString('en-US');
            const regex = new RegExp(`(<div id="${id}"[^>]*>)¥[\\d,]+(<\\/div>)`, 'g');
            content = content.replace(regex, `$1¥${formatted}$2`);
        });
        
        // Update default rate
        content = content.replace(/let currentRate = [\d.]+;/, `let currentRate = ${rate.toFixed(2)};`);
        content = content.replace(/let previousRate = [\d.]+;/, `let previousRate = ${rate.toFixed(2)};`);
        
        // Update market analysis
        const marketAnalysis = `
USD/JPY continues to trade at elevated levels as the interest rate differential between the Federal Reserve and Bank of Japan remains historically wide. Market participants are closely monitoring both central banks for any policy signals that might narrow this gap.

Recent trading sessions have seen the pair responding to US economic data releases and speculation about potential Bank of Japan policy adjustments. The BoJ's ongoing ultra-loose monetary stance contrasts sharply with the Fed's restrictive policy, maintaining upward pressure on the dollar-yen exchange rate.

Traders remain alert for any signs of Japanese government intervention, particularly if USD/JPY approaches or exceeds the 155 level. Historical precedent suggests authorities may act to slow yen depreciation if movements become too rapid or extreme.
        `.trim();
        
        content = content.replace(
            /## Daily Market Update[\s\S]*?\n\n## Convert USD to JPY Now/,
            `## Daily Market Update\n\n*This section updates daily with current market context and rate movements*\n\n${marketAnalysis}\n\n## Convert USD to JPY Now`
        );
        
        fs.writeFileSync(ARTICLE_PATH, content, 'utf8');
        
        log(`Article updated successfully!`);
        log(`New rate: $1 = ¥${rate.toFixed(2)}`);
        log('---');
        
        return true;
    } catch (error) {
        log(`ERROR: ${error.message}`);
        log(`Stack: ${error.stack}`);
        return false;
    }
}

updateArticle()
    .then((success) => process.exit(success ? 0 : 1))
    .catch((error) => {
        log(`FATAL ERROR: ${error.message}`);
        process.exit(1);
    });
