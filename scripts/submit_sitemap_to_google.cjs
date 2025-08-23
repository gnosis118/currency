const https = require('https');
const fs = require('fs');

// Google Search Console sitemap submission
const siteUrl = 'https://currencytocurrency.app';
const sitemapUrl = `${siteUrl}/sitemap.xml`;

console.log('🚀 Submitting sitemap to Google Search Console...');
console.log(`📄 Sitemap URL: ${sitemapUrl}`);

// Google Ping URL for sitemap submission
const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

console.log('📡 Pinging Google with sitemap...');

// Submit to Google
https.get(googlePingUrl, (res) => {
  console.log(`✅ Google response status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('🎉 Sitemap successfully submitted to Google!');
  } else {
    console.log('⚠️ Sitemap submission may have encountered issues');
  }
}).on('error', (err) => {
  console.error('❌ Error submitting sitemap to Google:', err.message);
});

// Also submit blog sitemap
const blogSitemapUrl = `${siteUrl}/sitemap-blog.xml`;
const googleBlogPingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(blogSitemapUrl)}`;

setTimeout(() => {
  console.log('📡 Pinging Google with blog sitemap...');
  https.get(googleBlogPingUrl, (res) => {
    console.log(`✅ Google blog sitemap response status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('🎉 Blog sitemap successfully submitted to Google!');
    } else {
      console.log('⚠️ Blog sitemap submission may have encountered issues');
    }
  }).on('error', (err) => {
    console.error('❌ Error submitting blog sitemap to Google:', err.message);
  });
}, 2000);

// Submit to Bing
const bingSitemapUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

setTimeout(() => {
  console.log('📡 Pinging Bing with sitemap...');
  https.get(bingSitemapUrl, (res) => {
    console.log(`✅ Bing response status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('🎉 Sitemap successfully submitted to Bing!');
    } else {
      console.log('⚠️ Bing sitemap submission may have encountered issues');
    }
  }).on('error', (err) => {
    console.error('❌ Error submitting sitemap to Bing:', err.message);
  });
}, 4000);

console.log('📊 Current sitemap stats:');
try {
  const sitemapContent = fs.readFileSync('public/sitemap.xml', 'utf8');
  const urlCount = (sitemapContent.match(/<url>/g) || []).length;
  console.log(`📄 Main sitemap contains: ${urlCount} URLs`);
  
  const blogSitemapContent = fs.readFileSync('public/sitemap-blog.xml', 'utf8');
  const blogUrlCount = (blogSitemapContent.match(/<url>/g) || []).length;
  console.log(`📝 Blog sitemap contains: ${blogUrlCount} URLs`);
  
  console.log(`🎯 Total URLs submitted: ${urlCount + blogUrlCount}`);
} catch (error) {
  console.log('📊 Could not read sitemap files for stats');
}

console.log('✨ Sitemap submission process completed!');
