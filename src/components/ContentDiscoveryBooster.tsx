import { useEffect } from 'react';

const ContentDiscoveryBooster = () => {
  useEffect(() => {
    // Add RSS feed links for content discovery
    const addRSSFeeds = () => {
      const feeds = [
        { title: 'Currency to Currency Blog', href: '/feed.xml' },
        { title: 'Exchange Rate Updates', href: '/rates-feed.xml' },
        { title: 'Cryptocurrency News', href: '/crypto-feed.xml' }
      ];

      feeds.forEach(feed => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.type = 'application/rss+xml';
        link.title = feed.title;
        link.href = feed.href;
        document.head.appendChild(link);
      });
    };

    // Add JSON-LD for blog posts and articles
    const addBlogSchema = () => {
      const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Currency to Currency Blog",
        "description": "Expert insights on currency exchange, travel finance, and digital nomad banking",
        "url": "https://currencytocurrency.app/blog",
        "publisher": {
          "@type": "Organization",
          "name": "Currency to Currency",
          "url": "https://currencytocurrency.app"
        },
        "blogPost": [
          {
            "@type": "BlogPosting",
            "headline": "Digital Nomad Banking Crisis 2025: The Hidden $50 Billion Currency Exchange Problem",
            "description": "Investigation reveals 50+ million digital nomads lose $50 billion annually to banking fees",
            "url": "https://currencytocurrency.app/blog/digital-nomad-banking-crisis-2025",
            "datePublished": "2025-01-27",
            "dateModified": "2025-01-27",
            "author": {
              "@type": "Organization",
              "name": "Currency to Currency"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Currency to Currency"
            },
            "keywords": "digital nomad, banking fees, currency exchange, travel finance, fintech",
            "articleSection": "Finance",
            "wordCount": 8500
          }
        ]
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(blogSchema);
      document.head.appendChild(script);
    };


    // Add breadcrumb schema
    const addBreadcrumbSchema = () => {
      const breadcrumbSchema = {
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
            "item": "https://currencytocurrency.app/"
          }
        ]
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(script);
    };

    // Social media meta tags for better sharing
    const addSocialTags = () => {
      const socialTags = [
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Currency to Currency - Professional Exchange Rate Tool' },
        { name: 'twitter:creator', content: '@currencytocurrency' },
        { name: 'twitter:site', content: '@currencytocurrency' },
        { name: 'twitter:domain', content: 'currencytocurrency.app' },
        { property: 'article:publisher', content: 'https://www.facebook.com/currencytocurrency' },
        { property: 'fb:admins', content: 'currencytocurrency-admin' }
      ];

      socialTags.forEach(({ name, property, content }) => {
        const meta = document.createElement('meta');
        if (name) meta.name = name;
        if (property) meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      });
    };

    // Execute all discovery boosters
    addRSSFeeds();
    addBlogSchema();
    addBreadcrumbSchema();
    addSocialTags();

    // Preload critical resources for faster indexing
    const preloadCriticalContent = () => {
      const criticalResources = [
        '/assets/home-hero.jpg',
        '/assets/blog-hero.jpg',
        '/assets/charts-hero.jpg',
        '/manifest.json',
        '/sitemap.xml'
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        if (resource.includes('.jpg')) {
          link.as = 'image';
        } else if (resource.includes('.json') || resource.includes('.xml')) {
          link.as = 'fetch';
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      });
    };

    preloadCriticalContent();

  }, []);

  return null;
};

export default ContentDiscoveryBooster;