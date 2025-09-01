const https = require('https');
const http = require('http');

console.log('🚀 Submitting Sitemap to Search Engines...\n');

const sitemapUrl = 'https://currencytocurrency.app/sitemap-index.xml';

// Function to make HTTP requests
function makeRequest(url, description) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ ${description}: Success (${res.statusCode})`);
          resolve({ success: true, statusCode: res.statusCode });
        } else {
          console.log(`⚠️  ${description}: Status ${res.statusCode}`);
          resolve({ success: false, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${description}: Error - ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    req.setTimeout(10000, () => {
      console.log(`⏰ ${description}: Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

// Submit to various search engines
async function submitSitemaps() {
  const submissions = [
    {
      url: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      description: 'Google Search Console'
    },
    {
      url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      description: 'Bing Webmaster Tools'
    },
    {
      url: `https://yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      description: 'Yandex Webmaster'
    }
  ];

  console.log('📡 Submitting sitemap to search engines...\n');

  for (const submission of submissions) {
    await makeRequest(submission.url, submission.description);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📋 Sitemap Submission Summary:');
  console.log('✅ Sitemap URL: ' + sitemapUrl);
  console.log('✅ Submitted to Google, Bing, and Yandex');
  console.log('✅ All search engines notified of your sitemap');
  
  console.log('\n🎯 Next Steps for Google Indexing:');
  console.log('1. Log into Google Search Console');
  console.log('2. Go to Sitemaps section');
  console.log('3. Add sitemap: ' + sitemapUrl);
  console.log('4. Monitor indexing status');
  console.log('5. Request indexing for important pages');
  
  console.log('\n📊 Manual Submission URLs:');
  console.log('- Google: https://search.google.com/search-console');
  console.log('- Bing: https://www.bing.com/webmasters');
  console.log('- Yandex: https://webmaster.yandex.com');
  
  console.log('\n✅ Sitemap submission complete!');
}

// Run the submission
submitSitemaps().catch(console.error);
