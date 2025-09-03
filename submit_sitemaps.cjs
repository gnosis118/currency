const https = require('https');
const http = require('http');

// Configuration
const SITE_URL = 'https://currencytocurrency.app';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const SITEMAP_INDEX_URL = `${SITE_URL}/sitemap-index.xml`;

// Google Search Console Ping
function pingGoogle(sitemapUrl) {
  return new Promise((resolve, reject) => {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    console.log(`Pinging Google with: ${pingUrl}`);
    
    https.get(pingUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Google ping successful');
          resolve(data);
        } else {
          console.log(`⚠️ Google ping returned status: ${res.statusCode}`);
          resolve(data);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ Google ping failed: ${err.message}`);
      reject(err);
    });
  });
}

// Bing Webmaster Tools Ping
function pingBing(sitemapUrl) {
  return new Promise((resolve, reject) => {
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    console.log(`Pinging Bing with: ${pingUrl}`);
    
    https.get(pingUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Bing ping successful');
          resolve(data);
        } else {
          console.log(`⚠️ Bing ping returned status: ${res.statusCode}`);
          resolve(data);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ Bing ping failed: ${err.message}`);
      reject(err);
    });
  });
}

// Validate sitemap accessibility
function validateSitemap(sitemapUrl) {
  return new Promise((resolve, reject) => {
    console.log(`Validating sitemap: ${sitemapUrl}`);
    
    https.get(sitemapUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Sitemap is accessible');
        resolve(true);
      } else {
        console.log(`❌ Sitemap returned status: ${res.statusCode}`);
        reject(new Error(`Sitemap not accessible: ${res.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ Sitemap validation failed: ${err.message}`);
      reject(err);
    });
  });
}

// Main execution
async function submitSitemaps() {
  console.log('🚀 Starting sitemap submission process...\n');
  
  try {
    // Validate sitemaps first
    await validateSitemap(SITEMAP_URL);
    await validateSitemap(SITEMAP_INDEX_URL);
    
    console.log('\n📡 Submitting sitemaps to search engines...\n');
    
    // Submit to Google
    await pingGoogle(SITEMAP_URL);
    await pingGoogle(SITEMAP_INDEX_URL);
    
    // Submit to Bing
    await pingBing(SITEMAP_URL);
    await pingBing(SITEMAP_INDEX_URL);
    
    console.log('\n✅ Sitemap submission completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up Google Search Console: https://search.google.com/search-console/');
    console.log('2. Set up Bing Webmaster Tools: https://www.bing.com/webmasters/');
    console.log('3. Submit sitemaps manually in both tools for better tracking');
    console.log('4. Monitor indexing progress daily');
    
  } catch (error) {
    console.error('\n❌ Error during sitemap submission:', error.message);
    process.exit(1);
  }
}

// Run the script
submitSitemaps();
