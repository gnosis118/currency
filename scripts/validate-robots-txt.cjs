#!/usr/bin/env node

/**
 * Robots.txt Validation Script
 * Validates robots.txt configuration for optimal search engine indexing
 */

const fs = require('fs');
const path = require('path');

function validateRobotsTxt() {
  console.log('🤖 ROBOTS.TXT VALIDATION');
  console.log('========================');
  
  const robotsPath = path.join(__dirname, '../public/robots.txt');
  
  if (!fs.existsSync(robotsPath)) {
    console.error('❌ robots.txt not found');
    return false;
  }
  
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  const lines = robotsContent.split('\n');
  
  let score = 0;
  const maxScore = 100;
  const issues = [];
  const recommendations = [];
  
  // Check for major search engines
  const searchEngines = [
    { name: 'Googlebot', required: true, points: 25 },
    { name: 'bingbot', required: true, points: 20 },
    { name: 'Slurp', required: false, points: 10 }, // Yahoo
    { name: 'DuckDuckBot', required: false, points: 10 },
    { name: 'YandexBot', required: false, points: 5 },
    { name: 'Baiduspider', required: false, points: 5 }
  ];
  
  console.log('\n🔍 SEARCH ENGINE SUPPORT:');
  searchEngines.forEach(engine => {
    const hasEngine = robotsContent.includes(`User-agent: ${engine.name}`);
    if (hasEngine) {
      console.log(`✅ ${engine.name} configured`);
      score += engine.points;
    } else {
      const message = `${engine.required ? '❌' : '⚠️'} ${engine.name} not configured`;
      console.log(message);
      if (engine.required) {
        issues.push(`Missing ${engine.name} configuration`);
      } else {
        recommendations.push(`Consider adding ${engine.name} for better coverage`);
      }
    }
  });
  
  // Check for sitemap declaration
  console.log('\n🗺️ SITEMAP CONFIGURATION:');
  if (robotsContent.includes('Sitemap: https://currencytocurrency.app/sitemap.xml')) {
    console.log('✅ Sitemap properly declared');
    score += 15;
  } else {
    console.log('❌ Sitemap not properly declared');
    issues.push('Missing or incorrect sitemap declaration');
  }
  
  // Check for AI bot blocking
  console.log('\n🛡️ AI BOT PROTECTION:');
  const aiBots = ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot'];
  let blockedAiBots = 0;
  
  aiBots.forEach(bot => {
    if (robotsContent.includes(`User-agent: ${bot}`) && 
        robotsContent.includes('Disallow: /')) {
      console.log(`✅ ${bot} blocked`);
      blockedAiBots++;
    } else {
      console.log(`⚠️ ${bot} not blocked`);
    }
  });
  
  if (blockedAiBots >= 3) {
    console.log('✅ Good AI bot protection');
    score += 10;
  } else {
    recommendations.push('Consider blocking more AI training bots');
  }
  
  // Check for social media bots
  console.log('\n📱 SOCIAL MEDIA SUPPORT:');
  const socialBots = ['facebookexternalhit', 'Twitterbot', 'LinkedInBot'];
  let allowedSocialBots = 0;
  
  socialBots.forEach(bot => {
    if (robotsContent.includes(`User-agent: ${bot}`) && 
        robotsContent.includes('Allow: /')) {
      console.log(`✅ ${bot} allowed`);
      allowedSocialBots++;
    } else {
      console.log(`⚠️ ${bot} not explicitly allowed`);
    }
  });
  
  if (allowedSocialBots >= 2) {
    console.log('✅ Good social media support');
    score += 10;
  } else {
    recommendations.push('Consider explicitly allowing social media bots');
  }
  
  // Check for crawl delays
  console.log('\n⏱️ CRAWL DELAY CONFIGURATION:');
  if (robotsContent.includes('Crawl-delay:')) {
    console.log('✅ Crawl delays configured');
    score += 5;
    
    // Check for reasonable delays
    const googleDelay = robotsContent.match(/User-agent: Googlebot[\s\S]*?Crawl-delay: (\d+)/);
    if (googleDelay && parseInt(googleDelay[1]) <= 2) {
      console.log('✅ Google crawl delay is reasonable');
    } else {
      recommendations.push('Consider setting Google crawl delay to 1-2 seconds');
    }
  } else {
    console.log('⚠️ No crawl delays configured');
    recommendations.push('Consider adding crawl delays to prevent server overload');
  }
  
  // Check for host declaration
  console.log('\n🏠 HOST DECLARATION:');
  if (robotsContent.includes('Host: currencytocurrency.app')) {
    console.log('✅ Host properly declared');
    score += 5;
  } else {
    console.log('⚠️ Host not declared');
    recommendations.push('Consider adding host declaration');
  }
  
  // Check file structure
  console.log('\n📋 FILE STRUCTURE:');
  const hasComments = robotsContent.includes('#');
  const hasUserAgents = robotsContent.includes('User-agent:');
  const hasDirectives = robotsContent.includes('Allow:') || robotsContent.includes('Disallow:');
  
  if (hasComments && hasUserAgents && hasDirectives) {
    console.log('✅ Well-structured robots.txt');
    score += 10;
  } else {
    issues.push('robots.txt structure could be improved');
  }
  
  // Generate report
  console.log('\n📊 VALIDATION RESULTS:');
  console.log('======================');
  console.log(`📈 Overall Score: ${score}/${maxScore}`);
  
  if (score >= 90) {
    console.log('🎉 EXCELLENT! Your robots.txt is optimally configured');
  } else if (score >= 70) {
    console.log('👍 GOOD! Minor improvements possible');
  } else if (score >= 50) {
    console.log('⚠️ NEEDS WORK! Several improvements needed');
  } else {
    console.log('🚨 CRITICAL! Major configuration issues detected');
  }
  
  if (issues.length > 0) {
    console.log('\n❌ CRITICAL ISSUES:');
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  if (recommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  console.log('\n🔗 TESTING TOOLS:');
  console.log('=================');
  console.log('• Google Search Console Robots.txt Tester');
  console.log('• Bing Webmaster Tools Robots.txt Tester');
  console.log('• robots-txt.com validator');
  console.log('• Technical SEO robots.txt checker');
  
  console.log('\n📋 NEXT STEPS:');
  console.log('==============');
  console.log('1. Test robots.txt with Google Search Console');
  console.log('2. Submit to Bing Webmaster Tools');
  console.log('3. Monitor crawl stats in search console');
  console.log('4. Check for crawl errors regularly');
  
  return score >= 70;
}

function analyzeSearchEngineSupport() {
  console.log('\n🌍 SEARCH ENGINE MARKET COVERAGE:');
  console.log('==================================');
  
  const marketShare = {
    'Google (Googlebot)': 91.9,
    'Bing (bingbot)': 3.0,
    'Yahoo (Slurp)': 1.2,
    'Yandex (YandexBot)': 1.5,
    'Baidu (Baiduspider)': 0.8,
    'DuckDuckGo (DuckDuckBot)': 0.6
  };
  
  Object.entries(marketShare).forEach(([engine, share]) => {
    console.log(`${engine}: ${share}% market share`);
  });
  
  console.log('\n📊 COVERAGE ANALYSIS:');
  console.log('Google + Bing = 94.9% of search traffic');
  console.log('Adding Yahoo/Yandex = 97.6% coverage');
  console.log('Full configuration = 99%+ coverage');
}

// Main execution
function main() {
  console.log('🤖 ROBOTS.TXT COMPREHENSIVE VALIDATION');
  console.log('======================================\n');
  
  const isValid = validateRobotsTxt();
  analyzeSearchEngineSupport();
  
  if (isValid) {
    console.log('\n🚀 Your robots.txt is ready for optimal search engine indexing!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Please address the issues above for better search engine support');
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { validateRobotsTxt, analyzeSearchEngineSupport };
