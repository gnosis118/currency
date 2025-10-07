import { useEffect, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileFirstSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
  robots?: string;
  mobileOptimized?: boolean;
  pageType?: 'website' | 'article' | 'product' | 'profile';
  lastModified?: string;
  author?: string;
  publishDate?: string;
}

/**
 * Mobile-First SEO Component
 * Optimized specifically for mobile-first indexing and mobile user experience
 */
const MobileFirstSEO = memo(({
  title = "Currency Converter - Real-time Mobile Exchange Rates",
  description = "Mobile-optimized currency converter with real-time exchange rates. Convert 150+ currencies instantly on your mobile device with offline support and PWA features.",
  keywords = "mobile currency converter, mobile exchange rates, mobile forex, currency app, mobile money converter, real-time rates mobile",
  canonical,
  ogImage = "https://currencytocurrency.app/og-image-mobile.jpg",
  structuredData,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  mobileOptimized = true,
  pageType = 'website',
  lastModified,
  author,
  publishDate
}: MobileFirstSEOProps) => {
  const isMobile = useIsMobile();
  
  // Generate current URL for canonical and OG tags
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : 'https://currencytocurrency.app');
  
  // Mobile-optimized title (shorter for mobile displays)
  const mobileTitle = isMobile && title.length > 50 
    ? title.substring(0, 47) + '...' 
    : title;
  
  // Mobile-optimized description (optimal for mobile snippets)
  const mobileDescription = isMobile && description.length > 140 
    ? description.substring(0, 137) + '...' 
    : description;

  // Mobile-specific structured data
  const mobileStructuredData = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "Currency to Currency",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": ["iOS", "Android", "Web"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "featureList": [
      "Real-time exchange rates",
      "Offline currency conversion",
      "150+ supported currencies",
      "Mobile-optimized interface",
      "PWA support",
      "Touch-friendly design"
    ]
  };

  // Mobile Web App structured data
  const webAppStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Currency Converter Mobile",
    "url": currentUrl,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "HTML5, JavaScript, Service Worker",
    "installUrl": currentUrl,
    "screenshot": "https://currencytocurrency.app/mobile-screenshot.jpg",
    "softwareVersion": "2.1.0",
    "datePublished": publishDate || "2024-01-01",
    "dateModified": lastModified || new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "creator": {
      "@type": "Organization",
      "name": "Currency to Currency",
      "url": "https://currencytocurrency.app"
    }
  };

  // Mobile-specific FAQ structured data
  const mobileFAQStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does the currency converter work on mobile devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our currency converter is fully optimized for mobile devices with touch-friendly interface, offline support, and PWA capabilities for app-like experience."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use the currency converter offline on mobile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our mobile app includes offline support through service workers, allowing you to access cached exchange rates even without internet connection."
        }
      },
      {
        "@type": "Question",
        "name": "Is the mobile currency converter free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our mobile currency converter is completely free with no hidden fees, registration requirements, or premium features."
        }
      }
    ]
  };

  // Performance optimization for mobile
  useEffect(() => {
    if (isMobile) {
      // Optimize viewport for mobile
      const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover, shrink-to-fit=no';
      }

      // Add mobile-specific meta tags
      const addMobileMetaTag = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      // Mobile web app meta tags
      addMobileMetaTag('mobile-web-app-capable', 'yes');
      addMobileMetaTag('apple-mobile-web-app-capable', 'yes');
      addMobileMetaTag('apple-mobile-web-app-status-bar-style', 'default');
      addMobileMetaTag('apple-mobile-web-app-title', 'Currency Converter');
      addMobileMetaTag('application-name', 'Currency Converter');
      
      // Mobile performance hints
      addMobileMetaTag('format-detection', 'telephone=no');
      addMobileMetaTag('mobile-web-app-capable', 'yes');
    }
  }, [isMobile]);

  return (
    <Helmet>
      {/* Basic Meta Tags - Mobile Optimized */}
      <title>{mobileTitle}</title>
      <meta name="description" content={mobileDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Mobile-Optimized Open Graph */}
      <meta property="og:title" content={mobileTitle} />
      <meta property="og:description" content={mobileDescription} />
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Currency to Currency" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Mobile Currency Converter - Real-time Exchange Rates" />
      
      {/* Mobile-Optimized Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={mobileTitle} />
      <meta name="twitter:description" content={mobileDescription} />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:width" content="1200" />
      <meta name="twitter:image:height" content="600" />
      <meta name="twitter:image:alt" content="Mobile Currency Converter" />
      <meta name="twitter:site" content="@currencytocurrency" />
      <meta name="twitter:creator" content="@currencytocurrency" />
      
      {/* Mobile App Meta Tags */}
      {mobileOptimized && (
        <>
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Currency Converter" />
          <meta name="application-name" content="Currency Converter" />
          <meta name="format-detection" content="telephone=no" />
        </>
      )}
      
      {/* Article-specific meta tags */}
      {pageType === 'article' && (
        <>
          {author && <meta name="author" content={author} />}
          {publishDate && <meta property="article:published_time" content={publishDate} />}
          {lastModified && <meta property="article:modified_time" content={lastModified} />}
          <meta property="article:section" content="Finance" />
          <meta property="article:tag" content="currency,exchange rates,mobile,finance" />
        </>
      )}
      
      {/* Hreflang for international mobile SEO */}
      <link rel="alternate" hrefLang="en" href={currentUrl} />
      <link rel="alternate" hrefLang="en-US" href={currentUrl} />
      <link rel="alternate" hrefLang="en-GB" href={currentUrl} />
      <link rel="alternate" hrefLang="en-CA" href={currentUrl} />
      <link rel="alternate" hrefLang="en-AU" href={currentUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />
      
      {/* Mobile-Specific Structured Data */}
      {mobileOptimized && (
        <>
          <script type="application/ld+json">
            {JSON.stringify(mobileStructuredData)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(webAppStructuredData)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(mobileFAQStructuredData)}
          </script>
        </>
      )}
      
      {/* Custom Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Mobile Performance Hints */}
      <link rel="dns-prefetch" href="//api.exchangerate-api.com" />
      <link rel="dns-prefetch" href="//api.coingecko.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Mobile-Specific Resource Hints */}
      <link rel="preload" href="/manifest.json" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="/sw.js" as="script" />
    </Helmet>
  );
});

MobileFirstSEO.displayName = 'MobileFirstSEO';

export default MobileFirstSEO;
