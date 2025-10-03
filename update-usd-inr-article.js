#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const ARTICLE_PATH = path.join(__dirname, 'src', 'content', 'blog', 'usd-to-inr-live-dollar-rupee-exchange-rate-converter.md');
const API_KEY = '669f46bf3291450b876bd2a28d8410e6';
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=USD`;
const LOG_FILE = path.join(__dirname, 'update-log-usd-inr.txt');

function fetchExchangeRate() {
    return new Promise((resolve, reject) => {
        https.get(API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    parsed.rates && parsed.rates.INR ? resolve(parsed.rates.INR) : reject(new Error('INR rate not found'));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

function log(message) {
    console.log(message);
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${message}\n`);
}

async function updateArticle() {
    try {
        log('Starting USD/INR article update...');
        
        if (!fs.existsSync(ARTICLE_PATH)) throw new Error(`Article not found`);
        
        const rate = await fetchExchangeRate();
        log(`Current USD/INR rate: ${rate}`);
        
        let content = fs.readFileSync(ARTICLE_PATH, 'utf8');
        
        const today = new Date().toISOString().split('T')[0];
        content = content.replace(/date: "\d{4}-\d{2}-\d{2}"/, `date: "${today}"`);
        
        const lastUpdated = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
        content = content.replace(/\*\*Last Updated:.*?\*\*/, `**Last Updated: ${lastUpdated}**`);
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        content = content.replace(
            /\*\*Last Updated\*\*:.*?\| \*\*Next Update\*\*:.*?GMT/,
            `**Last Updated**: ${lastUpdated} | **Next Update**: ${tomorrow.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})} at 9:00 AM GMT`
        );
        
        [100, 1000, 5000, 10000].forEach(amount => {
            const converted = Math.round(amount * rate);
            const formatted = converted.toLocaleString('en-IN');
            const regex = new RegExp(`(<div id="convert-${amount}"[^>]*>)₹[\\d,]+(<\\/div>)`, 'g');
            content = content.replace(regex, `$1₹${formatted}$2`);
        });
        
        content = content.replace(/let currentRate = [\d.]+;/, `let currentRate = ${rate.toFixed(2)};`);
        content = content.replace(/let previousRate = [\d.]+;/, `let previousRate = ${rate.toFixed(2)};`);
        
        const marketAnalysis = `
USD/INR continues trading influenced by RBI intervention policies, crude oil price movements, and global dollar dynamics. Recent sessions reflect market assessment of inflation data from both countries and foreign portfolio investment flows into Indian markets.

Current attention centers on upcoming RBI monetary policy communications and US Federal Reserve guidance. Any shift in rate expectations could drive meaningful moves in the currency pair. Additionally, crude oil prices remain a key focus given India's substantial import dependence.

Traders monitor weekly FPI flow data and monthly trade balance figures for directional cues, while staying alert for RBI interventions that could quickly reverse sharp movements in either direction.
        `.trim();
        
        content = content.replace(
            /## Daily Market Update[\s\S]*?\n\n## Convert USD to INR Now/,
            `## Daily Market Update\n\n*Updated daily with current market context*\n\n${marketAnalysis}\n\n## Convert USD to INR Now`
        );
        
        fs.writeFileSync(ARTICLE_PATH, content, 'utf8');
        
        log(`Article updated! New rate: $1 USD = ₹${rate.toFixed(2)}`);
        log('---');
        
        return true;
    } catch (error) {
        log(`ERROR: ${error.message}`);
        return false;
    }
}

updateArticle()
    .then((success) => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
