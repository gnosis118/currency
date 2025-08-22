import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { loadAllBlogPosts } from '@/data/mdBlog';

const EnhancedSitemapGenerator = () => {
  // Generate Website Schema JSON-LD
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Currency to Currency",
    "url": "https://currencytocurrency.app",
    "description": "Free real-time currency converter with live exchange rates for 150+ currencies and cryptocurrencies",
    "publisher": {
      "@type": "Organization",
      "name": "Currency to Currency",
      "logo": "https://currencytocurrency.app/icon-512.png"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://currencytocurrency.app/convert/{search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://currencytocurrency.app/blog",
      "https://currencytocurrency.app/charts",
      "https://currencytocurrency.app/travel"
    ]
  };

  useEffect(() => {
    // Generate dynamic sitemap data with current dates
    const getCurrentDate = () => new Date().toISOString().split('T')[0];
    
    // Main sitemap URLs with priority and changefreq
    const mainSitemapUrls = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/convert', priority: 0.9, changefreq: 'daily' },
      { url: '/charts', priority: 0.9, changefreq: 'daily' },
      { url: '/alerts', priority: 0.8, changefreq: 'weekly' },
      { url: '/travel', priority: 0.8, changefreq: 'weekly' },
      { url: '/blog', priority: 0.8, changefreq: 'weekly' },
      { url: '/faq', priority: 0.7, changefreq: 'monthly' },
      { url: '/auth', priority: 0.6, changefreq: 'monthly' },
      { url: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
      { url: '/terms-of-service', priority: 0.3, changefreq: 'yearly' }
    ];

    // Load blog posts dynamically from Markdown
    const blogPosts = loadAllBlogPosts().map(p => ({ slug: p.slug, publishDate: p.publishDate }));

    // Currency pairs with high search volume
    const currencyPairs = [
      { pair: 'usd-to-eur', priority: 0.9 },
      { pair: 'usd-to-gbp', priority: 0.9 },
      { pair: 'usd-to-jpy', priority: 0.9 },
      { pair: 'eur-to-gbp', priority: 0.8 },
      { pair: 'usd-to-cad', priority: 0.8 },
      { pair: 'usd-to-aud', priority: 0.8 },
      { pair: 'gbp-to-usd', priority: 0.8 },
      { pair: 'eur-to-usd', priority: 0.8 },
      { pair: 'jpy-to-usd', priority: 0.7 },
      { pair: 'aud-to-usd', priority: 0.7 },
      { pair: 'usd-to-chf', priority: 0.7 },
      { pair: 'eur-to-jpy', priority: 0.7 },
      { pair: 'cad-to-usd', priority: 0.7 },
      { pair: 'chf-to-usd', priority: 0.7 },
      { pair: 'usd-to-nzd', priority: 0.7 },
      { pair: 'nzd-to-usd', priority: 0.7 }
    ];

    // Image assets for image sitemap
    const imageAssets = [
      { src: '/assets/home-hero.webp', caption: 'Currency to Currency - Free Exchange Rate Converter', title: 'Real-time currency converter homepage' },
      { src: '/assets/blog-hero.webp', caption: 'Currency Exchange Blog and Guides', title: 'Expert currency exchange insights and guides' },
      { src: '/assets/charts-hero.webp', caption: 'Live Currency Exchange Rate Charts', title: 'Interactive currency rate charts and analytics' },
      { src: '/assets/alerts-hero.webp', caption: 'Currency Rate Alerts and Notifications', title: 'Set alerts for favorable exchange rates' },
      { src: '/assets/travel-hero.webp', caption: 'Travel Money and Currency Exchange Guide', title: 'Smart travel money exchange strategies' },
      { src: '/assets/usd-eur-hero.jpg', caption: 'USD to EUR Exchange Rate Analysis', title: 'US Dollar to Euro conversion rate trends' },
      { src: '/assets/bitcoin-trading-dashboard.jpg', caption: 'Bitcoin to USD Trading Dashboard', title: 'Real-time Bitcoin price tracking and analysis' },
      { src: '/assets/currency-safety-hero.jpg', caption: 'Safe Currency Conversion Practices', title: 'Security guide for online currency exchanges' },
      { src: '/assets/trump-tariffs-currency-impact.jpg', caption: 'Trump Tariffs Impact on Currency Markets', title: 'Analysis of trade policy effects on exchange rates' },
      { src: '/assets/digital-nomad-laptop.jpg', caption: 'Digital Nomad Banking Solutions', title: 'Best banking options for remote workers and travelers' }
    ];

    // Log sitemap generation for debugging
    console.log('Enhanced sitemap data generated:', {
      mainUrls: mainSitemapUrls.length,
      blogPosts: blogPosts.length,
      currencyPairs: currencyPairs.length,
      images: imageAssets.length,
      lastGenerated: getCurrentDate()
    });

  }, []);

  const dynamicBlogItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": loadAllBlogPosts().map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://currencytocurrency.app/blog/${p.slug}`,
      "name": p.title,
      "datePublished": p.publishDate
    }))
  };

  return (
    <Helmet>
      {/* Sitemap and robots meta tags */}
      <link rel="sitemap" type="application/xml" title="Sitemap" href="https://currencytocurrency.app/sitemap-index.xml" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large" />
      <meta name="bingbot" content="index, follow" />
      <meta name="slurp" content="index, follow" />
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Website Schema JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(dynamicBlogItemList)}</script>
    </Helmet>
  );
};

export default EnhancedSitemapGenerator;