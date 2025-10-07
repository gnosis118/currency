const fs = require('fs');
const path = require('path');

/**
 * Generate mobile-optimized sitemap with mobile-specific annotations
 * This enhances the existing sitemap with mobile-first indexing signals
 */

const DOMAIN = 'https://currencytocurrency.app';
const OUTPUT_DIR = path.join(__dirname, '../public');

// Mobile-specific priority adjustments
const MOBILE_PRIORITIES = {
  homepage: 1.0,
  convert: 0.95,
  currencyPairs: 0.9,
  blog: 0.85,
  charts: 0.8,
  alerts: 0.8,
  travel: 0.75,
  static: 0.7
};

// Mobile-optimized changefreq
const MOBILE_CHANGEFREQ = {
  homepage: 'daily',
  convert: 'hourly',
  currencyPairs: 'hourly',
  blog: 'weekly',
  charts: 'daily',
  alerts: 'daily',
  travel: 'monthly',
  static: 'monthly'
};

function generateMobileSitemap() {
  console.log('🔧 GENERATING MOBILE-OPTIMIZED SITEMAP');
  console.log('=====================================');

  // Read existing sitemap to enhance it
  const existingSitemapPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  let existingSitemap = '';
  
  try {
    existingSitemap = fs.readFileSync(existingSitemapPath, 'utf8');
  } catch (error) {
    console.error('❌ Could not read existing sitemap:', error.message);
    return;
  }

  // Parse existing URLs
  const urlMatches = existingSitemap.match(/<url>[\s\S]*?<\/url>/g) || [];
  const urls = [];

  urlMatches.forEach(urlBlock => {
    const locMatch = urlBlock.match(/<loc>(.*?)<\/loc>/);
    const lastmodMatch = urlBlock.match(/<lastmod>(.*?)<\/lastmod>/);
    const priorityMatch = urlBlock.match(/<priority>(.*?)<\/priority>/);
    
    if (locMatch) {
      const url = locMatch[1];
      const path = url.replace(DOMAIN, '');
      
      // Determine mobile priority and changefreq
      let priority = MOBILE_PRIORITIES.static;
      let changefreq = MOBILE_CHANGEFREQ.static;
      
      if (path === '/') {
        priority = MOBILE_PRIORITIES.homepage;
        changefreq = MOBILE_CHANGEFREQ.homepage;
      } else if (path.startsWith('/convert')) {
        priority = path === '/convert' ? MOBILE_PRIORITIES.convert : MOBILE_PRIORITIES.currencyPairs;
        changefreq = MOBILE_CHANGEFREQ.currencyPairs;
      } else if (path.startsWith('/blog')) {
        priority = MOBILE_PRIORITIES.blog;
        changefreq = MOBILE_CHANGEFREQ.blog;
      } else if (path.startsWith('/charts')) {
        priority = MOBILE_PRIORITIES.charts;
        changefreq = MOBILE_CHANGEFREQ.charts;
      } else if (path.startsWith('/alerts')) {
        priority = MOBILE_PRIORITIES.alerts;
        changefreq = MOBILE_CHANGEFREQ.alerts;
      } else if (path.startsWith('/travel')) {
        priority = MOBILE_PRIORITIES.travel;
        changefreq = MOBILE_CHANGEFREQ.travel;
      }

      urls.push({
        loc: url,
        lastmod: lastmodMatch ? lastmodMatch[1] : new Date().toISOString().split('T')[0],
        priority: priority.toFixed(1),
        changefreq,
        mobile: true // Mobile-first flag
      });
    }
  });

  // Generate mobile-optimized sitemap XML
  const mobileSitemapXml = generateMobileSitemapXML(urls);
  
  // Write mobile sitemap
  const mobileSitemapPath = path.join(OUTPUT_DIR, 'sitemap-mobile.xml');
  fs.writeFileSync(mobileSitemapPath, mobileSitemapXml);
  
  // Update sitemap index to include mobile sitemap
  updateSitemapIndex();
  
  console.log(`✅ Mobile sitemap generated: ${urls.length} URLs`);
  console.log(`📱 Mobile-optimized priorities applied`);
  console.log(`🔄 Mobile-specific changefreq set`);
  console.log(`📁 Output: ${mobileSitemapPath}`);
}

function generateMobileSitemapXML(urls) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  const footer = `</urlset>`;

  const urlEntries = urls.map(url => {
    return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <mobile:mobile/>
  </url>`;
  }).join('\n');

  return `${header}\n${urlEntries}\n${footer}`;
}

function updateSitemapIndex() {
  const sitemapIndexPath = path.join(OUTPUT_DIR, 'sitemap-index.xml');
  
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-mobile.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-images.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync(sitemapIndexPath, sitemapIndex);
  console.log('✅ Sitemap index updated with mobile sitemap');
}

// Generate mobile-specific image sitemap
function generateMobileImageSitemap() {
  console.log('📱 GENERATING MOBILE IMAGE SITEMAP');
  console.log('==================================');

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const assetsDir = path.join(__dirname, '../src/assets');
  const publicAssetsDir = path.join(__dirname, '../public');
  
  const images = [];

  // Scan for images in assets directory
  function scanDirectory(dir, baseUrl = '/assets') {
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          scanDirectory(filePath, `${baseUrl}/${file}`);
        } else if (imageExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
          // Mobile-optimized image entry
          images.push({
            loc: `${DOMAIN}${baseUrl}/${file}`,
            caption: file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            title: file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            mobile: true
          });
        }
      });
    } catch (error) {
      console.warn(`⚠️ Could not scan directory ${dir}:`, error.message);
    }
  }

  // Scan both directories
  scanDirectory(assetsDir);
  scanDirectory(publicAssetsDir, '');

  // Generate mobile image sitemap XML
  const imageHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">`;

  const imageFooter = `</urlset>`;

  const imageEntries = images.map(img => {
    return `  <url>
    <loc>${DOMAIN}/</loc>
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:caption>${img.caption}</image:caption>
      <image:title>${img.title}</image:title>
    </image:image>
    <mobile:mobile/>
  </url>`;
  }).join('\n');

  const mobileImageSitemap = `${imageHeader}\n${imageEntries}\n${imageFooter}`;
  
  const mobileImageSitemapPath = path.join(OUTPUT_DIR, 'sitemap-images-mobile.xml');
  fs.writeFileSync(mobileImageSitemapPath, mobileImageSitemap);
  
  console.log(`✅ Mobile image sitemap generated: ${images.length} images`);
  console.log(`📁 Output: ${mobileImageSitemapPath}`);
}

// Run the mobile sitemap generation
if (require.main === module) {
  try {
    generateMobileSitemap();
    generateMobileImageSitemap();
    console.log('\n🎉 MOBILE SITEMAP GENERATION COMPLETE!');
  } catch (error) {
    console.error('❌ Mobile sitemap generation failed:', error);
    process.exit(1);
  }
}

module.exports = { generateMobileSitemap, generateMobileImageSitemap };
