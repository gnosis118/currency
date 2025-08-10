import { useEffect } from 'react';

const SitemapGenerator = () => {
  useEffect(() => {
    // Generate dynamic sitemap entries for currency pairs
    const generateCurrencyPairSitemaps = () => {
      const majorPairs = [
        'usd-to-eur', 'usd-to-gbp', 'usd-to-jpy', 'usd-to-cad', 'usd-to-aud',
        'eur-to-usd', 'eur-to-gbp', 'eur-to-jpy', 'gbp-to-usd', 'gbp-to-eur',
        'jpy-to-usd', 'cad-to-usd', 'aud-to-usd', 'usd-to-chf', 'chf-to-usd',
        'usd-to-cny', 'cny-to-usd', 'usd-to-inr', 'inr-to-usd', 'usd-to-krw'
      ];

      // Add dynamic currency pair meta tags for SEO
      majorPairs.forEach(pair => {
        const pairName = pair.replace(/-/g, ' ').toUpperCase();
        
        // Create link rel="alternate" for currency pairs
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.type = 'application/rss+xml';
        link.title = `${pairName} Exchange Rate Feed`;
        link.href = `https://currencytocurrency.app/${pair}`;
        document.head.appendChild(link);
      });
    };

    // Add structured data for organization
    const addOrganizationData = () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Currency to Currency",
          "url": "https://currencytocurrency.app",
          "logo": "https://currencytocurrency.app/icon-512.png",
          "description": "Free real-time currency converter with live exchange rates for 150+ currencies and cryptocurrencies",
          "foundingDate": "2024",
          "knowsAbout": [
            "Currency Exchange",
            "Foreign Exchange",
            "Cryptocurrency",
            "Financial Services",
            "Exchange Rates"
          ],
          "serviceArea": "Worldwide",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Currency Conversion Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Real-time Currency Conversion",
                  "description": "Convert between 150+ fiat currencies instantly"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Service",
                  "name": "Cryptocurrency Price Tracking",
                  "description": "Track 100+ cryptocurrency prices in real-time"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service", 
                  "name": "Historical Rate Charts",
                  "description": "View exchange rate trends and historical data"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Price Alerts",
                  "description": "Set custom alerts for exchange rate changes"
                }
              }
            ]
          }
        });
        document.head.appendChild(script);
      }
    };

    generateCurrencyPairSitemaps();
    addOrganizationData();
  }, []);

  return null;
};

export default SitemapGenerator;