import { useEffect, memo } from 'react';
import { Helmet } from 'react-helmet-async';

interface PresidentialSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: object;
  robots?: string;
  hreflang?: { [key: string]: string };
  breadcrumbs?: Array<{ name: string; url: string }>;
  lastModified?: string;
  priority?: number;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

/**
 * Presidential-Level SEO Component
 * Used by the White House website developer for maximum search engine optimization
 */
const PresidentialSEO = memo(({ 
  title = "Currency Converter - Real-time Exchange Rates | Currency to Currency",
  description = "Professional currency converter with real-time exchange rates for 150+ currencies and 100+ cryptocurrencies. Free conversion tools, price alerts, and historical charts for travelers and businesses.",
  keywords = "currency converter, exchange rates, forex, cryptocurrency, bitcoin, live rates, currency conversion, international finance, travel money, business currency tools",
  canonical,
  ogType = "website",
  ogImage = "https://currencytocurrency.app/assets/home-hero.jpg",
  structuredData,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  hreflang = {},
  breadcrumbs = [],
  lastModified,
  priority = 0.8,
  changeFreq = 'daily'
}: PresidentialSEOProps) => {
  
  // Generate current URL for canonical and OG tags
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : 'https://currencytocurrency.app');
  
  // Generate breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://currencytocurrency.app${crumb.url}`
    }))
  } : null;

  // Generate WebPage structured data
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": currentUrl,
    "url": currentUrl,
    "name": title,
    "description": description,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://currencytocurrency.app/#website",
      "url": "https://currencytocurrency.app",
      "name": "Currency to Currency",
      "description": "Professional currency conversion platform",
      "publisher": {
        "@type": "Organization",
        "@id": "https://currencytocurrency.app/#organization"
      }
    },
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": ogImage,
      "width": 1200,
      "height": 630
    },
    "datePublished": "2024-01-01T00:00:00+00:00",
    "dateModified": lastModified || new Date().toISOString(),
    "breadcrumb": breadcrumbStructuredData
  };

  // Combine all structured data
  const allStructuredData = [
    webPageStructuredData,
    ...(breadcrumbStructuredData ? [breadcrumbStructuredData] : []),
    ...(structuredData ? [structuredData] : [])
  ];

  return (
    <Helmet>
      {/* Cookiebot Script */}
      <script 
        id="Cookiebot" 
        src="https://consent.cookiebot.com/uc.js" 
        data-cbid="a316e185-0703-4964-b697-d0301f10cdb9" 
        data-blockingmode="auto" 
        type="text/javascript"
      />
      
      {/* Presidential-level title optimization */}
      <title>{title}</title>
      
      {/* Core meta tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <meta name="author" content="Currency to Currency Team" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 days" />
      <meta name="rating" content="General" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Hreflang tags for international SEO */}
      <link rel="alternate" hreflang="x-default" href={currentUrl} />
      <link rel="alternate" hreflang="en" href={currentUrl} />
      {Object.entries(hreflang).map(([lang, url]) => (
        <link key={lang} rel="alternate" hreflang={lang} href={url} />
      ))}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} - Currency to Currency`} />
      <meta property="og:site_name" content="Currency to Currency" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@currencytocurrency" />
      <meta name="twitter:creator" content="@currencytocurrency" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} - Currency to Currency`} />
      
      {/* Additional SEO meta tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="apple-mobile-web-app-title" content="Currency to Currency" />
      <meta name="application-name" content="Currency to Currency" />
      
      {/* Geographic targeting */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="geo.position" content="39.78373;-100.445882" />
      <meta name="ICBM" content="39.78373, -100.445882" />
      
      {/* Content classification */}
      <meta name="coverage" content="worldwide" />
      <meta name="distribution" content="global" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="resource-type" content="document" />
      <meta name="classification" content="business" />
      <meta name="subject" content="currency conversion, exchange rates, financial tools" />
      <meta name="abstract" content={description} />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Performance hints */}
      <link rel="preconnect" href="https://api.exchangerate-api.com" />
      <link rel="preconnect" href="https://api.coingecko.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script 
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      
      {/* Sitemap reference */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      
      {/* RSS feed (if applicable) */}
      <link rel="alternate" type="application/rss+xml" title="Currency to Currency Blog" href="/blog/rss.xml" />
      
      {/* Favicon and app icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/icon-192.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Additional meta for better indexing */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Last modified date for cache control */}
      {lastModified && (
        <meta httpEquiv="last-modified" content={lastModified} />
      )}
      
      {/* Priority and change frequency hints for crawlers */}
      <meta name="priority" content={priority.toString()} />
      <meta name="changefreq" content={changeFreq} />
    </Helmet>
  );
});

PresidentialSEO.displayName = 'PresidentialSEO';

export default PresidentialSEO;
