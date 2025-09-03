const fs = require('fs');
const path = require('path');

// Read the current sitemap
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Additional currency pairs to add
const additionalCurrencies = [
  'usd-to-cny', 'cny-to-usd', 'usd-to-inr', 'inr-to-usd',
  'usd-to-brl', 'brl-to-usd', 'usd-to-krw', 'krw-to-usd',
  'usd-to-mxn', 'mxn-to-usd', 'usd-to-sgd', 'sgd-to-usd',
  'usd-to-hkd', 'hkd-to-usd', 'usd-to-nok', 'nok-to-usd',
  'usd-to-sek', 'sek-to-usd', 'usd-to-dkk', 'dkk-to-usd',
  'usd-to-pln', 'pln-to-usd', 'usd-to-czk', 'czk-to-usd',
  'usd-to-huf', 'huf-to-usd', 'usd-to-rub', 'rub-to-usd',
  'usd-to-zar', 'zar-to-usd', 'usd-to-try', 'try-to-usd',
  'usd-to-thb', 'thb-to-usd', 'usd-to-myr', 'myr-to-usd',
  'usd-to-idr', 'idr-to-usd', 'usd-to-php', 'php-to-usd',
  'usd-to-vnd', 'vnd-to-usd', 'usd-to-btc', 'btc-to-usd',
  'usd-to-eth', 'eth-to-usd', 'usd-to-bnb', 'bnb-to-usd',
  'usd-to-ada', 'ada-to-usd', 'usd-to-sol', 'sol-to-usd',
  'usd-to-dot', 'dot-to-usd', 'usd-to-matic', 'matic-to-usd'
];

// Generate URL entries for additional currencies
const additionalUrls = additionalCurrencies.map(currency => {
  return `  <url>
    <loc>https://currencytocurrency.app/convert/${currency}</loc>
    <lastmod>2025-01-21</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://currencytocurrency.app/convert/${currency}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://currencytocurrency.app/convert/${currency}" />
  </url>`;
}).join('\n');

// Insert before the closing </urlset> tag
const insertPoint = sitemapContent.lastIndexOf('</urlset>');
const updatedSitemap = sitemapContent.slice(0, insertPoint) + 
  '\n' + additionalUrls + '\n' + 
  sitemapContent.slice(insertPoint);

// Write the updated sitemap
fs.writeFileSync(sitemapPath, updatedSitemap, 'utf8');

console.log(`Added ${additionalCurrencies.length} additional currency conversion pages to sitemap`);
console.log('Sitemap updated successfully!');
