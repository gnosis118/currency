import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'article' | 'breadcrumb' | 'financialProduct';
  data?: any;
}

const StructuredData = ({ type = 'website', data }: StructuredDataProps) => {
  const location = useLocation();

  useEffect(() => {
    const generateStructuredData = () => {
      const baseUrl = 'https://currencytocurrency.app';
      const currentUrl = `${baseUrl}${location.pathname}`;

      switch (type) {
        case 'website':
          return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Currency to Currency',
            alternateName: 'CurrencyToCurrency.app',
            url: baseUrl,
            description: 'Professional currency exchange platform with real-time rates, alerts, and comprehensive forex tools',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/convert?from={search_term_string}&to=USD`
              },
              'query-input': 'required name=search_term_string'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Currency to Currency',
              url: baseUrl,
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/icon-512x512.png`,
                width: 512,
                height: 512
              }
            },
            sameAs: [
              'https://twitter.com/currencytocurrency',
              'https://facebook.com/currencytocurrency'
            ]
          };

        case 'organization':
          return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Currency to Currency',
            url: baseUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/icon-512x512.png`,
              width: 512,
              height: 512
            },
            description: 'Professional currency exchange platform with real-time rates, alerts, and comprehensive forex tools',
            foundingDate: '2024',
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: 'English'
            },
            sameAs: [
              'https://twitter.com/currencytocurrency',
              'https://facebook.com/currencytocurrency'
            ]
          };

        case 'financialProduct':
          return {
            '@context': 'https://schema.org',
            '@type': 'FinancialProduct',
            name: data?.name || 'Currency Converter',
            description: data?.description || 'Real-time currency conversion with live exchange rates',
            url: currentUrl,
            provider: {
              '@type': 'Organization',
              name: 'Currency to Currency',
              url: baseUrl
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock'
            },
            category: 'Financial Services',
            featureList: [
              'Real-time exchange rates',
              'Historical charts',
              'Rate alerts',
              'Multi-currency support',
              'Mobile responsive'
            ]
          };

        case 'breadcrumb':
          const pathSegments = location.pathname.split('/').filter(Boolean);
          const breadcrumbItems = [
            { name: 'Home', url: baseUrl }
          ];

          let currentPath = '';
          pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
            breadcrumbItems.push({
              name,
              url: `${baseUrl}${currentPath}`
            });
          });

          return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbItems.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.url
            }))
          };

        case 'article':
          return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data?.title || 'Currency Exchange Article',
            description: data?.description || 'Learn about currency exchange and forex trading',
            url: currentUrl,
            datePublished: data?.datePublished || new Date().toISOString(),
            dateModified: data?.dateModified || new Date().toISOString(),
            author: {
              '@type': 'Organization',
              name: 'Currency to Currency',
              url: baseUrl
            },
            publisher: {
              '@type': 'Organization',
              name: 'Currency to Currency',
              url: baseUrl,
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/icon-512x512.png`,
                width: 512,
                height: 512
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': currentUrl
            },
            image: data?.image || `${baseUrl}/og-image.jpg`
          };

        default:
          return null;
      }
    };

    const structuredData = data || generateStructuredData();
    
    if (structuredData) {
      // Remove existing structured data for this type
      const existingScript = document.querySelector(`script[data-structured-data="${type}"]`);
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', type);
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [type, data, location.pathname]);

  return null;
};

export default StructuredData;
