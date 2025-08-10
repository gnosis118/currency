import { Helmet } from 'react-helmet-async';

interface EnhancedSEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string;
  structuredData?: any;
  ogImage?: string;
  pageType?: 'website' | 'article' | 'product';
}

const EnhancedSEOHead = ({ 
  title, 
  description, 
  canonicalUrl, 
  keywords,
  structuredData,
  ogImage = 'https://currencytocurrency.app/og-image.jpg',
  pageType = 'website'
}: EnhancedSEOHeadProps) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* International SEO */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={pageType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="CurrencyToCurrency" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
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