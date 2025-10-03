#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const ARTICLE_PATH = path.join(__dirname, 'src', 'content', 'blog', 'eur-to-gbp-euro-british-pound-exchange-rate-live.md');
const API_KEY = '669f46bf3291450b876bd2a28d8410e6';
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=EUR`;
const LOG_FILE = path.join(__dirname, 'update-log-eur-gbp.txt');

function fetchExchangeRate() {
    return new Promise((resolve, reject) => {
        https.get(API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    parsed.rates && parsed.rates.GBP ? resolve(parsed.rates.GBP) : reject(new Error('GBP rate not found'));
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
        log('Starting EUR/GBP article update...');
        
        if (!fs.existsSync(ARTICLE_PATH)) throw new Error(`Article not found`);
        
        const rate = await fetchExchangeRate();
        log(`Current EUR/GBP rate: ${rate}`);
        
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
            const regex = new RegExp(`(<div id="convert-${amount}"[^>]*>)£[\\d,]+\\.\\d{2}(<\\/div>)`, 'g');
            content = content.replace(regex, `$1£${formatted}$2`);
        });
        
        content = content.replace(/let currentRate = [\d.]+;/, `let currentRate = ${rate.toFixed(4)};`);
        content = content.replace(/let previousRate = [\d.]+;/, `let previousRate = ${rate.toFixed(4)};`);
        
        const marketAnalysis = `
EUR/GBP continues trading within its post-Brexit range as markets evaluate economic data from both the UK and eurozone. Recent sessions reflect assessment of monetary policy trajectories from the Bank of England and European Central Bank.

Current market attention focuses on UK inflation and growth data, which inform BoE rate decisions, while eurozone PMI figures and ECB communications provide the European counterbalance. Any significant divergence in economic performance or policy direction could drive directional moves in the currency pair.

Political stability in both regions remains a factor, with UK elections and EU fiscal discussions creating periodic volatility in this historically politically-sensitive currency pair.
        `.trim();
        
        content = content.replace(
            /## Daily Market Update[\s\S]*?\n\n## Convert EUR to GBP Now/,
            `## Daily Market Update\n\n${marketAnalysis}\n\n## Convert EUR to GBP Now`
        );
        
        fs.writeFileSync(ARTICLE_PATH, content, 'utf8');
        
        log(`Article updated! New rate: €1 = £${rate.toFixed(4)}`);
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
