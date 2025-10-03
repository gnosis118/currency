#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const ARTICLE_PATH = path.join(__dirname, 'src', 'content', 'blog', 'aud-to-usd-live-australian-dollar-us-dollar-exchange-rate.md');
const API_KEY = '669f46bf3291450b876bd2a28d8410e6';
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=AUD`;
const LOG_FILE = path.join(__dirname, 'update-log-aud-usd.txt');

function fetchExchangeRate() {
    return new Promise((resolve, reject) => {
        https.get(API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    parsed.rates && parsed.rates.USD ? resolve(parsed.rates.USD) : reject(new Error('USD rate not found'));
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
        log('Starting AUD/USD article update...');
        
        if (!fs.existsSync(ARTICLE_PATH)) throw new Error(`Article not found`);
        
        const rate = await fetchExchangeRate();
        log(`Current AUD/USD rate: ${rate}`);
        
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
        
        [100, 500, 1000, 10000].forEach(amount => {
            const converted = amount * rate;
            const formatted = converted.toFixed(2);
            const regex = new RegExp(`(<div id="convert-${amount}"[^>]*>)\\$[\\d,]+\\.\\d{2} USD(<\\/div>)`, 'g');
            content = content.replace(regex, `$1$${formatted} USD$2`);
        });
        
        content = content.replace(/let currentRate = [\d.]+;/, `let currentRate = ${rate.toFixed(4)};`);
        content = content.replace(/let previousRate = [\d.]+;/, `let previousRate = ${rate.toFixed(4)};`);
        
        const marketAnalysis = `
AUD/USD continues trading within its recent range as markets assess competing forces: Chinese economic data and stimulus measures, US Federal Reserve policy guidance, and global commodity price movements. Recent sessions reflect the ongoing tug-of-war between risk sentiment and interest rate differentials.

Current market focus centers on upcoming Chinese economic releases and their implications for commodity demand, particularly iron ore. Any significant shifts in Chinese growth trajectory or stimulus measures could drive meaningful AUD/USD movements given Australia's substantial export dependence on China.

Traders also monitor Reserve Bank of Australia communications for policy guidance, as the RBA's rate path relative to the Federal Reserve will significantly influence the currency pair's direction in coming months.
        `.trim();
        
        content = content.replace(
            /## Daily Market Update[\s\S]*?\n\n## Convert AUD to USD Now/,
            `## Daily Market Update\n\n${marketAnalysis}\n\n## Convert AUD to USD Now`
        );
        
        fs.writeFileSync(ARTICLE_PATH, content, 'utf8');
        
        log(`Article updated! New rate: A$1 = $${rate.toFixed(4)} USD`);
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
