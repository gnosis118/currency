#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const ARTICLE_PATH = path.join(__dirname, 'src', 'content', 'blog', 'usd-to-chf-dollar-swiss-franc-exchange-rate-live.md');
const API_KEY = '669f46bf3291450b876bd2a28d8410e6';
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=USD`;
const LOG_FILE = path.join(__dirname, 'update-log-usd-chf.txt');

function fetchExchangeRate() {
    return new Promise((resolve, reject) => {
        https.get(API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    parsed.rates && parsed.rates.CHF ? resolve(parsed.rates.CHF) : reject(new Error('CHF rate not found'));
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
        log('Starting USD/CHF article update...');
        if (!fs.existsSync(ARTICLE_PATH)) throw new Error(`Article not found`);
        
        const rate = await fetchExchangeRate();
        log(`Current USD/CHF rate: ${rate}`);
        
        let content = fs.readFileSync(ARTICLE_PATH, 'utf8');
        const today = new Date().toISOString().split('T')[0];
        content = content.replace(/date: "\d{4}-\d{2}-\d{2}"/, `date: "${today}"`);
        
        const lastUpdated = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
        content = content.replace(/\*\*Last Updated:.*?\*\*/, `**Last Updated: ${lastUpdated}**`);
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        content = content.replace(/\*\*Last Updated\*\*:.*?\| \*\*Next Update\*\*:.*?GMT/, `**Last Updated**: ${lastUpdated} | **Next Update**: ${tomorrow.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})} at 9:00 AM GMT`);
        
        [100, 500, 1000, 5000].forEach(amount => {
            const converted = amount * rate;
            const formatted = converted.toFixed(2);
            const regex = new RegExp(`(<div id="convert-${amount}"[^>]*>)CHF [\\d,]+\\.\\d{2}(<\\/div>)`, 'g');
            content = content.replace(regex, `$1CHF ${formatted}$2`);
        });
        
        content = content.replace(/let currentRate = [\d.]+;/, `let currentRate = ${rate.toFixed(4)};`);
        content = content.replace(/let previousRate = [\d.]+;/, `let previousRate = ${rate.toFixed(4)};`);
        
        const marketAnalysis = `USD/CHF continues trading near multi-year lows as Swiss franc safe haven demand persists amid global uncertainty. Recent sessions reflect ongoing assessment of Federal Reserve policy trajectory versus Swiss National Bank's dovish stance.

Current market focus centers on risk appetite indicators and potential SNB intervention signals. The franc's strength despite wide interest rate differentials favoring the dollar demonstrates continued safe haven preference.

Traders monitor EUR/CHF movements closely, as SNB tolerance for euro weakness provides indirect signals about USD/CHF intervention thresholds. Any significant geopolitical developments could trigger sharp moves given both currencies' safe haven status.`.trim();
        
        content = content.replace(/## Daily Market Update[\s\S]*?\n\n## Convert USD to CHF Now/, `## Daily Market Update\n\n${marketAnalysis}\n\n## Convert USD to CHF Now`);
        
        fs.writeFileSync(ARTICLE_PATH, content, 'utf8');
        log(`Article updated! New rate: $1 = CHF ${rate.toFixed(4)}`);
        log('---');
        return true;
    } catch (error) {
        log(`ERROR: ${error.message}`);
        return false;
    }
}

updateArticle().then((success) => process.exit(success ? 0 : 1)).catch(() => process.exit(1));
