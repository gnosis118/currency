import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: object;
  robots?: string;
}

const SEOHead = ({
  title = "Free Currency Converter - Live Exchange Rates | Currency to Currency",
  description = "Convert currencies instantly with live exchange rates. Support for 150+ fiat currencies and 100+ cryptocurrencies. Free real-time currency converter with historical charts and price alerts.",
  keywords = "currency converter, exchange rates, live rates, cryptocurrency prices, currency conversion, foreign exchange, forex, bitcoin converter",
  canonical,
  ogType = "website",
  ogImage = 'https://currencytocurrency.app/og-image.jpg',
  structuredData,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Add Google Consent Mode if not already present
    if (!document.querySelector('script[data-cookieconsent="ignore"]')) {
      const consentScript = document.createElement('script');
      consentScript.setAttribute('data-cookieconsent', 'ignore');
      consentScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag("consent", "default", {
          ad_personalization: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          analytics_storage: "denied",
          functionality_storage: "denied",
          personalization_storage: "denied",
          security_storage: "granted",
          wait_for_update: 500,
        });
        gtag("set", "ads_data_redaction", true);
        gtag("set", "url_passthrough", false);
      `;
      document.head.appendChild(consentScript);
    }
    
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

    // Normalize lengths to avoid SEO warnings
    const normalizedTitle = title && title.length > 60 ? `${title.slice(0, 57)}...` : title;
    const normalizedDescription = description && description.length > 160 ? `${description.slice(0, 157)}...` : description;

    // Update document title
    document.title = normalizedTitle;

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
    updateMetaTag('description', normalizedDescription);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', robots);

    // Mobile-optimized Open Graph tags
    updateMetaTag('og:title', normalizedTitle, true);
    updateMetaTag('og:description', normalizedDescription, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:url', canonical || window.location.href, true);
    updateMetaTag('og:site_name', 'Currency to Currency', true);
    updateMetaTag('og:locale', 'en_US', true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', 'Currency Converter - Live Exchange Rates', true);

    // Mobile-optimized Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', normalizedTitle);
    updateMetaTag('twitter:description', normalizedDescription);
    updateMetaTag('twitter:url', canonical || window.location.href);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:image:alt', 'Currency Converter - Live Exchange Rates');
    updateMetaTag('twitter:site', '@currencytoapp');
    updateMetaTag('twitter:creator', '@currencytoapp');

    // Mobile app meta tags for better indexing
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('apple-mobile-web-app-title', 'Currency Converter');
    updateMetaTag('application-name', 'Currency Converter');
    updateMetaTag('msapplication-TileColor', '#3b82f6');
    updateMetaTag('theme-color', '#3b82f6');
    updateMetaTag('format-detection', 'telephone=no, date=no, email=no, address=no');

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

    // Hreflang alternates (en, x-default)
    const ensureAlt = (hreflang: string) => {
      const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
      let alt = document.querySelector(selector) as HTMLLinkElement;
      if (!alt) {
        alt = document.createElement('link');
        alt.setAttribute('rel', 'alternate');
        alt.setAttribute('hreflang', hreflang);
        document.head.appendChild(alt);
      }
      alt.setAttribute('href', canonicalUrl);
    };
    ensureAlt('en');
    ensureAlt('x-default');

    // Structured data (page-specific only)
    // We avoid injecting global WebApplication schema to prevent validation issues.
    // Only add structuredData when explicitly provided by the page.
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
  }, [title, description, keywords, canonical, ogType, ogImage, structuredData, robots]);

  return null;
};

export default SEOHead;