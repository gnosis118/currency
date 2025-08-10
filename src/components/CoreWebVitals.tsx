import { useEffect } from 'react';

const CoreWebVitals = () => {
  useEffect(() => {
    // Core Web Vitals monitoring and optimization
    const measurePerformance = () => {
      if ('performance' in window) {
        // Monitor LCP, FID, and CLS
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              console.log('LCP:', entry.startTime);
            } else if (entry.entryType === 'first-input') {
              const fidEntry = entry as any;
              console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
            } else if (entry.entryType === 'layout-shift') {
              const clsEntry = entry as any;
              if (!clsEntry.hadRecentInput) {
                console.log('CLS:', clsEntry.value);
              }
            }
          });
        });
        
        if ('observe' in observer) {
          try {
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
          } catch (e) {
            // Fallback for older browsers
            console.log('Performance Observer not fully supported');
          }
        }
      }
    };

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);

      // Preconnect to external domains
      const preconnectDomains = [
        'https://api.exchangerate-api.com',
        'https://api.coingecko.com'
      ];
      
      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Layout shift prevention
    const preventLayoutShift = () => {
      // Add explicit dimensions to images without them
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach(img => {
        const htmlImg = img as HTMLImageElement;
        if (htmlImg.naturalWidth && htmlImg.naturalHeight) {
          htmlImg.width = htmlImg.naturalWidth;
          htmlImg.height = htmlImg.naturalHeight;
        }
      });

      // Reserve space for dynamic content
      const dynamicContainers = document.querySelectorAll('[data-dynamic-content]');
      dynamicContainers.forEach(container => {
        const htmlContainer = container as HTMLElement;
        if (!htmlContainer.style.minHeight) {
          htmlContainer.style.minHeight = '200px';
        }
      });
    };

    // Initialize optimizations
    measurePerformance();
    preloadCriticalResources();
    preventLayoutShift();
    
    const mutationObserver = new MutationObserver(preventLayoutShift);
    mutationObserver.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'width', 'height']
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  return null;
};

export default CoreWebVitals;