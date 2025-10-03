#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const ARTICLE_PATH = path.join(__dirname, 'src', 'content', 'blog', 'usd-to-cad-live-dollar-canadian-exchange-rate-converter.md');
const API_KEY = '669f46bf3291450b876bd2a28d8410e6';
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=USD`;
const LOG_FILE = path.join(__dirname, 'update-log-usd-cad.txt');

function fetchExchangeRate() {
    return new Promise((resolve, reject) => {
        https.get(API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.rates && parsed.rates.CAD) {
                        resolve(parsed.rates.CAD);
                    } else {
                        reject(new Error('CAD rate not found'));
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
    console.log(message);
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

async function updateArticle() {
    try {
        log('Starting USD/CAD article update...');
        
        if (!fs.existsSync(ARTICLE_PATH)) {
            throw new Error(`Article not found at: ${ARTICLE_PATH}`);
        }
        
        const rate = await fetchExchangeRate();
        log(`Current USD/CAD rate: ${rate}`);
        
        let content = fs.readFileSync(ARTICLE_PATH, 'utf8');
        
        const today = new Date().toISOString().split('T')[0];
        content = content.replace(/date: "\d{4}-\d{2}-\d{2}"/, `date: "${today}"`);
        
        const lastUpdated = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        content = content.replace(/\*\*Last Updated:.*?\*\*/, `**Last Updated: ${lastUpdated}**`);
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        content = content.replace(
            /\*\*Last Updated\*\*:.*?\| \*\*Next Update\*\*:.*?GMT/,
            `**Last Updated**: ${lastUpdated} | **Next Update**: ${tomorrow.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})} at 9:00 AM GMT`
        );
        
        [100, 500, 1000, 5000].forEach(amount => {
            const converted = amount * rate;
            const formatted = converted.toFixed(2);
            const regex = new RegExp(`(<div id="convert-${amount}"[^>]*>)\\$[\\d,]+\\.\\d{2} CAD(<\\/div>)`, 'g');
            content = content.replace(regex, `$1$${formatted} CAD$2`);
        });
        
        content = content.replace(/let currentRate = [\d.]+;/, `let currentRate = ${rate.toFixed(4)};`);
        content = content.replace(/let previousRate = [\d.]+;/, `let previousRate = ${rate.toFixed(4)};`);
        
        const marketAnalysis = `
USD/CAD continues trading influenced by monetary policy expectations from both the Federal Reserve and Bank of Canada, as well as crude oil price movements. Recent sessions reflect market assessment of inflation data and economic growth indicators from both countries.

Current focus centers on upcoming central bank communications and energy market dynamics. Any divergence in rate paths—with the Fed potentially cutting while the BoC holds—could drive the pair toward lower levels. Conversely, sustained US dollar strength from robust economic data might support current elevated levels.

Traders monitor weekly crude oil inventories and Canadian economic releases, particularly employment and inflation data, for directional cues on the currency pair.
        `.trim();
        
        content = content.replace(
            /## Daily Market Update[\s\S]*?\n\n## Convert USD to CAD Now/,
            `## Daily Market Update\n\n*This section updates daily with current market movements*\n\n${marketAnalysis}\n\n## Convert USD to CAD Now`
        );
        
        fs.writeFileSync(ARTICLE_PATH, content, 'utf8');
        
        log(`Article updated! New rate: $1 USD = $${rate.toFixed(4)} CAD`);
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
