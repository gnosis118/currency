import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  structuredData?: object;
  robots?: string;
}

const SEOHead = ({ 
  title = "Free Currency Converter - Live Exchange Rates | Currency to Currency",
  description = "Convert currencies instantly with live exchange rates. Support for 150+ fiat currencies and 100+ cryptocurrencies. Free real-time currency converter with historical charts and price alerts.",
  keywords = "currency converter, exchange rates, live rates, cryptocurrency prices, currency conversion, foreign exchange, forex, bitcoin converter",
  canonical,
  ogType = "website",
  structuredData,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Add Cookiebot script if not already present
    if (!document.getElementById('Cookiebot')) {
      const script = document.createElement('script');
      script.id = 'Cookiebot';
      script.src = 'https://consent.cookiebot.com/uc.js';
      script.setAttribute('data-cbid', 'a316e185-0703-4964-b697-d0301f10cdb9');
      script.setAttribute('data-blockingmode', 'auto');
      script.type = 'text/javascript';
      document.head.appendChild(script);
    }
    
    // Update document title
    document.title = title;
    
    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', robots);
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:url', canonical || window.location.href, true);
    updateMetaTag('og:site_name', 'Currency to Currency', true);
    updateMetaTag('og:locale', 'en_US', true);
    
    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:url', canonical || window.location.href);

    // Canonical URL - ensure all pages have canonical URLs
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    
    // If canonical is provided, use it; otherwise, construct from current URL
    const canonicalUrl = canonical || `https://currencytocurrency.app${window.location.pathname}`;
    link.href = canonicalUrl;

    // Structured data
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [title, description, keywords, canonical, ogType, structuredData, robots]);

  return null;
};

export default SEOHead;