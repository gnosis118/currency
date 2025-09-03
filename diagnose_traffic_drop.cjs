const https = require('https');
const http = require('http');

// Configuration
const SITE_URL = 'https://currencytocurrency.app';
const HOMEPAGE_URL = `${SITE_URL}/`;

// Check site accessibility and basic performance
function checkSiteHealth() {
  return new Promise((resolve, reject) => {
    console.log('🔍 Checking site health...');
    
    const startTime = Date.now();
    
    https.get(HOMEPAGE_URL, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`✅ Site is accessible (${responseTime}ms)`);
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📱 Content-Type: ${res.headers['content-type']}`);
      console.log(`🔒 HTTPS: ${res.connection.encrypted ? 'Yes' : 'No'}`);
      
      // Check for common issues
      const issues = [];
      
      if (responseTime > 3000) {
        issues.push('⚠️ Slow response time (>3 seconds)');
      }
      
      if (!res.headers['content-type']?.includes('text/html')) {
        issues.push('⚠️ Unexpected content type');
      }
      
      if (res.statusCode !== 200) {
        issues.push(`⚠️ Non-200 status code: ${res.statusCode}`);
      }
      
      if (issues.length > 0) {
        console.log('\n🚨 Potential Issues Found:');
        issues.forEach(issue => console.log(`   ${issue}`));
      } else {
        console.log('\n✅ No obvious technical issues detected');
      }
      
      resolve({
        accessible: true,
        responseTime,
        statusCode: res.statusCode,
        issues
      });
      
    }).on('error', (err) => {
      console.log(`❌ Site is not accessible: ${err.message}`);
      reject(err);
    });
  });
}

// Check sitemap accessibility
function checkSitemap() {
  return new Promise((resolve, reject) => {
    console.log('\n🗺️ Checking sitemap...');
    
    https.get(`${SITE_URL}/sitemap.xml`, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Main sitemap is accessible');
        
        // Check sitemap index
        https.get(`${SITE_URL}/sitemap-index.xml`, (res2) => {
          if (res2.statusCode === 200) {
            console.log('✅ Sitemap index is accessible');
            resolve(true);
          } else {
            console.log('⚠️ Sitemap index not accessible');
            resolve(false);
          }
        });
      } else {
        console.log('❌ Main sitemap not accessible');
        reject(new Error('Sitemap not accessible'));
      }
    }).on('error', (err) => {
      console.log(`❌ Sitemap check failed: ${err.message}`);
      reject(err);
    });
  });
}

// Check robots.txt
function checkRobots() {
  return new Promise((resolve, reject) => {
    console.log('\n🤖 Checking robots.txt...');
    
    https.get(`${SITE_URL}/robots.txt`, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Robots.txt is accessible');
        resolve(true);
      } else {
        console.log('⚠️ Robots.txt not accessible');
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`❌ Robots.txt check failed: ${err.message}`);
      reject(err);
    });
  });
}

// Main diagnostic function
async function diagnoseTrafficDrop() {
  console.log('🚨 TRAFFIC DROP DIAGNOSTIC TOOL');
  console.log('================================\n');
  console.log(`🔍 Analyzing: ${SITE_URL}\n`);
  
  try {
    // Run all checks
    const siteHealth = await checkSiteHealth();
    await checkSitemap();
    await checkRobots();
    
    console.log('\n📋 DIAGNOSTIC SUMMARY');
    console.log('====================');
    console.log('✅ Basic technical checks completed');
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Check Google Search Console for:');
    console.log('   - Manual Actions (Security & Manual Actions)');
    console.log('   - Core Web Vitals (Experience → Core Web Vitals)');
    console.log('   - Coverage Issues (Coverage report)');
    console.log('   - Mobile Usability (Experience → Mobile Usability)');
    console.log('\n2. Test site speed at: https://pagespeed.web.dev/');
    console.log('3. Test mobile-friendliness at: https://search.google.com/test/mobile-friendly');
    console.log('\n4. Check for algorithm updates around August 9th, 2025');
    console.log('   - Google Search Central Blog');
    console.log('   - SEO news sites (Search Engine Land, etc.)');
    
    if (siteHealth.issues.length > 0) {
      console.log('\n🚨 IMMEDIATE ACTIONS NEEDED:');
      siteHealth.issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    console.log('\n💡 RECOMMENDATION:');
    console.log('The traffic drop pattern suggests a Google algorithm update.');
    console.log('Focus on improving content quality and user experience.');
    console.log('Recovery typically takes 3-6 months with proper optimization.');
    
  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Check if your site is accessible from your browser');
    console.log('2. Verify your domain is properly configured');
    console.log('3. Check for server issues or downtime');
  }
}

// Run the diagnostic
diagnoseTrafficDrop();
