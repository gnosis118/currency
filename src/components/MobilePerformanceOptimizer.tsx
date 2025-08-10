import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobilePerformanceOptimizer = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    // Optimize viewport for mobile
    const optimizeViewport = () => {
      // Set viewport height for mobile browsers
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Ensure viewport meta tag is optimal
      let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (viewportMeta) {
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
      }
    };

    // Optimize touch performance
    const optimizeTouchPerformance = () => {
      // Add touch-action: manipulation to prevent delays
      const style = document.createElement('style');
      style.textContent = `
        .touch-manipulation,
        button,
        [role="button"],
        [tabindex],
        input,
        select,
        textarea {
          touch-action: manipulation;
        }
        
        /* Prevent 300ms click delay */
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }
        
        /* Optimize scrolling */
        body {
          -webkit-overflow-scrolling: touch;
          overflow-scrolling: touch;
        }
      `;
      
      if (!document.getElementById('mobile-touch-optimizations')) {
        style.id = 'mobile-touch-optimizations';
        document.head.appendChild(style);
      }
    };

    // Optimize images for mobile
    const optimizeMobileImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Add loading optimization
        if (!img.loading) {
          img.loading = 'lazy';
        }
        
        // Add decoding optimization
        if (!img.decoding) {
          img.decoding = 'async';
        }
        
        // Ensure proper sizing
        if (!img.style.maxWidth) {
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
        }
      });
    };

    // Optimize scroll performance
    const optimizeScrolling = () => {
      // Add passive event listeners for better scroll performance
      const passiveSupported = (() => {
        let passive = false;
        try {
          const options = {
            get passive() {
              passive = true;
              return false;
            }
          };
          window.addEventListener('test' as any, () => {}, options as any);
          window.removeEventListener('test' as any, () => {}, options as any);
        } catch {}
        return passive;
      })();

      if (passiveSupported) {
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
      }
    };

    // Optimize form inputs for mobile
    const optimizeMobileInputs = () => {
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        const htmlInput = input as HTMLInputElement;
        
        // Prevent zoom on focus by ensuring font-size is at least 16px
        if (!htmlInput.style.fontSize || parseInt(htmlInput.style.fontSize) < 16) {
          htmlInput.style.fontSize = '16px';
        }
        
        // Add mobile-friendly input modes
        if (htmlInput.type === 'number' && !htmlInput.inputMode) {
          htmlInput.inputMode = 'decimal';
        }
        
        if (htmlInput.type === 'email' && !htmlInput.inputMode) {
          htmlInput.inputMode = 'email';
        }
        
        if (htmlInput.type === 'tel' && !htmlInput.inputMode) {
          htmlInput.inputMode = 'tel';
        }
      });
    };

    // Performance monitoring for mobile
    const monitorMobilePerformance = () => {
      // Monitor Core Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('Mobile LCP:', lastEntry.startTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              const fidEntry = entry as any;
              if (fidEntry.processingStart) {
                console.log('Mobile FID:', fidEntry.processingStart - entry.startTime);
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              const clsEntry = entry as any;
              if (!clsEntry.hadRecentInput && clsEntry.value !== undefined) {
                console.log('Mobile CLS:', clsEntry.value);
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance monitoring not available:', error);
        }
      }
    };

    // Battery API optimization
    const optimizeForBattery = () => {
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          if (battery.level < 0.2) {
            // Reduce animations and heavy operations when battery is low
            document.documentElement.style.setProperty('--animation-duration', '0s');
            console.log('Low battery mode: animations disabled');
          }
        }).catch(() => {
          // Battery API not supported, continue normally
        });
      }
    };

    // Connection-aware optimizations
    const optimizeForConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
          // Disable animations and reduce image quality for slow connections
          document.documentElement.classList.add('slow-connection');
          console.log('Slow connection detected: optimizations applied');
        }
      }
    };

    // Initialize all optimizations
    optimizeViewport();
    optimizeTouchPerformance();
    optimizeMobileImages();
    optimizeScrolling();
    optimizeMobileInputs();
    monitorMobilePerformance();
    optimizeForBattery();
    optimizeForConnection();

    // Set up observers for dynamic content
    const observer = new MutationObserver(() => {
      optimizeMobileImages();
      optimizeMobileInputs();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Handle orientation changes
    const handleOrientationChange = () => {
      setTimeout(optimizeViewport, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', optimizeViewport);

    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', optimizeViewport);
    };
  }, [isMobile]);

  return null;
};

export default MobilePerformanceOptimizer;