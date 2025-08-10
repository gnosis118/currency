import { useEffect } from 'react';

const SEOMonitoring = () => {
  useEffect(() => {
    // Monitor page load times for SEO
    const trackPageLoad = () => {
      if ('performance' in window) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            
            if (navigationTiming) {
              const metrics = {
                'dns-lookup': navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
                'tcp-connect': navigationTiming.connectEnd - navigationTiming.connectStart,
                'response-time': navigationTiming.responseEnd - navigationTiming.requestStart,
                'dom-interactive': navigationTiming.domInteractive - navigationTiming.fetchStart,
                'page-load': navigationTiming.loadEventEnd - navigationTiming.fetchStart
              };

              // Log critical metrics that affect SEO
              console.log('SEO Performance Metrics:', metrics);
              
              // Monitor for slow loading pages that hurt SEO
              if (metrics['page-load'] > 3000) {
                console.warn('Page load time exceeds 3 seconds - may impact SEO rankings');
              }
              
              if (metrics['dom-interactive'] > 1500) {
                console.warn('DOM interactive time slow - affects user experience and SEO');
              }
            }
          }, 100);
        });
      }
    };

    // Check for SEO meta tags
    const auditSEOTags = () => {
      const checks = {
        title: !!document.title && document.title.length > 10 && document.title.length < 60,
        description: !!document.querySelector('meta[name="description"]'),
        canonical: !!document.querySelector('link[rel="canonical"]'),
        ogTitle: !!document.querySelector('meta[property="og:title"]'),
        ogDescription: !!document.querySelector('meta[property="og:description"]'),
        structuredData: !!document.querySelector('script[type="application/ld+json"]'),
        viewport: !!document.querySelector('meta[name="viewport"]'),
        charset: !!document.querySelector('meta[charset]')
      };

      const failed = Object.entries(checks).filter(([_, passed]) => !passed);
      
      if (failed.length > 0) {
        console.warn('SEO Audit Issues:', failed.map(([tag]) => tag));
      } else {
        console.log('✅ All basic SEO tags present');
      }
    };

    // Monitor for mobile-first indexing requirements
    const checkMobileOptimization = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      const viewportContent = viewport?.getAttribute('content') || '';
      
      if (!viewportContent.includes('width=device-width')) {
        console.warn('Missing mobile viewport optimization');
      }

      // Check for touch-friendly buttons
      const buttons = document.querySelectorAll('button, a');
      let smallButtons = 0;
      
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        if (rect.height < 44 || rect.width < 44) {
          smallButtons++;
        }
      });

      if (smallButtons > 0) {
        console.log(`${smallButtons} buttons may be too small for mobile touch (< 44px)`);
      }
    };


    // Initialize all checks
    trackPageLoad();
    
    // Run SEO audits after DOM is ready
    setTimeout(() => {
      auditSEOTags();
      checkMobileOptimization();
    }, 1000);

  }, []);

  return null;
};

export default SEOMonitoring;