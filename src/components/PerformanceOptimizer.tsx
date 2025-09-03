import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload important images with higher priority
      const heroImages = [
        '/src/assets/home-hero.jpg',
        '/src/assets/charts-hero.jpg',
        '/src/assets/alerts-hero.jpg',
        '/src/assets/travel-hero.jpg'
      ];

      heroImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    // Optimize images with lazy loading attributes
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        if (!img.getAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      });
    };

    // Add critical resource hints
    const addResourceHints = () => {
      const hints = [
        { rel: 'dns-prefetch', href: '//api.exchangerate-api.com' },
        { rel: 'dns-prefetch', href: '//api.coingecko.com' },
        // Font preconnect handled statically in index.html to avoid duplicates
      ];

      hints.forEach(hint => {
        const existingLink = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = hint.rel;
          link.href = hint.href;
          if (hint.crossorigin) {
            link.crossOrigin = hint.crossorigin;
          }
          document.head.appendChild(link);
        }
      });
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeImages();
    addResourceHints();

    // Optimize images when new content loads
    const observer = new MutationObserver(optimizeImages);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

export default PerformanceOptimizer;