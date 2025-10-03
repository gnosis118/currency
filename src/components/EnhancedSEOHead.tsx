import { Helmet } from 'react-helmet-async';

interface EnhancedSEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string;
  structuredData?: any;
  ogImage?: string;
  pageType?: 'website' | 'article' | 'product';
  noindex?: boolean;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
}

const EnhancedSEOHead = ({ 
  title, 
  description, 
  canonicalUrl, 
  keywords,
  structuredData,
  ogImage = 'https://currencytocurrency.app/og-image.jpg',
  pageType = 'website',
  noindex = false,
  author,
  publishDate,
  modifiedDate
}: EnhancedSEOHeadProps) => {
  // Ensure description is within optimal length
  const optimizedDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;
  
  // Ensure title is within optimal length (50-60 chars)
  const optimizedTitle = title.length > 60 
    ? title.substring(0, 57) + '...' 
    : title;
    
  return (
    <Helmet>
      {/* Google Consent Mode (must precede gtag.js/GTM) */}
      <script data-cookieconsent="ignore">
        {`
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
        `}
      </script>
      
      {/* Cookiebot Script */}
      <script 
        id="Cookiebot" 
        src="https://consent.cookiebot.com/uc.js" 
        data-cbid="a316e185-0703-4964-b697-d0301f10cdb9" 
        data-blockingmode="auto" 
        type="text/javascript"
      />
      
      {/* Basic Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* International SEO - Hreflang */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-US" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-GB" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={pageType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Currency to Currency" />
      <meta property="og:locale" content="en_US" />
      {publishDate && <meta property="article:published_time" content={publishDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@currencytocurrency" />
      <meta name="twitter:creator" content="@currencytocurrency" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="bingbot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#0f172a" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Breadcrumb Structured Data for Currency Pages */}
      {canonicalUrl.includes('/convert/') && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://currencytocurrency.app/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Currency Converter",
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      )}
    </Helmet>
  );
};

export default EnhancedSEOHead;