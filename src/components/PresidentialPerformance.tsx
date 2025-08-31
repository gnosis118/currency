import { useEffect, memo } from 'react';

/**
 * Presidential-Level Performance Monitoring Component
 * Used by the White House website developer for enterprise-grade performance tracking
 */
const PresidentialPerformance = memo(() => {
  
  useEffect(() => {
    // Presidential-level performance monitoring
    const monitorPerformance = () => {
      // Core Web Vitals monitoring
      if ('web-vitals' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          // Largest Contentful Paint (LCP) - should be < 2.5s
          getLCP((metric) => {
            console.log('🎯 LCP:', metric.value, 'ms');
            if (metric.value > 2500) {
              console.warn('⚠️ LCP is slow:', metric.value, 'ms');
            }
          });

          // First Input Delay (FID) - should be < 100ms
          getFID((metric) => {
            console.log('⚡ FID:', metric.value, 'ms');
            if (metric.value > 100) {
              console.warn('⚠️ FID is slow:', metric.value, 'ms');
            }
          });

          // Cumulative Layout Shift (CLS) - should be < 0.1
          getCLS((metric) => {
            console.log('📐 CLS:', metric.value);
            if (metric.value > 0.1) {
              console.warn('⚠️ CLS is high:', metric.value);
            }
          });

          // First Contentful Paint (FCP) - should be < 1.8s
          getFCP((metric) => {
            console.log('🎨 FCP:', metric.value, 'ms');
            if (metric.value > 1800) {
              console.warn('⚠️ FCP is slow:', metric.value, 'ms');
            }
          });

          // Time to First Byte (TTFB) - should be < 600ms
          getTTFB((metric) => {
            console.log('🌐 TTFB:', metric.value, 'ms');
            if (metric.value > 600) {
              console.warn('⚠️ TTFB is slow:', metric.value, 'ms');
            }
          });
        });
      }

      // Navigation Timing API monitoring
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            ssl: navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
            ttfb: navigation.responseStart - navigation.requestStart,
            download: navigation.responseEnd - navigation.responseStart,
            domParse: navigation.domContentLoadedEventStart - navigation.responseEnd,
            domReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            total: navigation.loadEventEnd - navigation.navigationStart
          };

          console.log('🏛️ Presidential Performance Metrics:');
          console.log('   DNS Lookup:', metrics.dns, 'ms');
          console.log('   TCP Connect:', metrics.tcp, 'ms');
          console.log('   SSL Handshake:', metrics.ssl, 'ms');
          console.log('   TTFB:', metrics.ttfb, 'ms');
          console.log('   Download:', metrics.download, 'ms');
          console.log('   DOM Parse:', metrics.domParse, 'ms');
          console.log('   DOM Ready:', metrics.domReady, 'ms');
          console.log('   Load Complete:', metrics.loadComplete, 'ms');
          console.log('   Total Load Time:', metrics.total, 'ms');

          // Performance warnings
          if (metrics.total > 3000) {
            console.warn('⚠️ Total load time exceeds 3 seconds');
          }
          if (metrics.ttfb > 600) {
            console.warn('⚠️ TTFB exceeds 600ms - server optimization needed');
          }
          if (metrics.dns > 100) {
            console.warn('⚠️ DNS lookup is slow - consider DNS optimization');
          }
        }
      }

      // Resource timing monitoring
      if ('performance' in window && 'getEntriesByType' in performance) {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        const resourceMetrics = {
          scripts: resources.filter(r => r.name.includes('.js')),
          styles: resources.filter(r => r.name.includes('.css')),
          images: resources.filter(r => /\.(jpg|jpeg|png|gif|webp|svg)/.test(r.name)),
          fonts: resources.filter(r => /\.(woff|woff2|ttf|otf)/.test(r.name))
        };

        console.log('📊 Resource Performance:');
        console.log('   Scripts loaded:', resourceMetrics.scripts.length);
        console.log('   Stylesheets loaded:', resourceMetrics.styles.length);
        console.log('   Images loaded:', resourceMetrics.images.length);
        console.log('   Fonts loaded:', resourceMetrics.fonts.length);

        // Check for slow resources
        resources.forEach(resource => {
          const loadTime = resource.responseEnd - resource.startTime;
          if (loadTime > 1000) {
            console.warn(`⚠️ Slow resource: ${resource.name} (${loadTime}ms)`);
          }
        });
      }

      // Memory usage monitoring (if available)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('🧠 Memory Usage:');
        console.log('   Used:', Math.round(memory.usedJSHeapSize / 1024 / 1024), 'MB');
        console.log('   Total:', Math.round(memory.totalJSHeapSize / 1024 / 1024), 'MB');
        console.log('   Limit:', Math.round(memory.jsHeapSizeLimit / 1024 / 1024), 'MB');

        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
          console.warn('⚠️ High memory usage detected');
        }
      }

      // Connection quality monitoring
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        console.log('📡 Connection Info:');
        console.log('   Type:', connection.effectiveType);
        console.log('   Downlink:', connection.downlink, 'Mbps');
        console.log('   RTT:', connection.rtt, 'ms');
        console.log('   Save Data:', connection.saveData);

        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          console.warn('⚠️ Slow connection detected - consider optimizations');
        }
      }
    };

    // Run performance monitoring after page load
    if (document.readyState === 'complete') {
      setTimeout(monitorPerformance, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(monitorPerformance, 1000);
      });
    }

    // Monitor for layout shifts
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              console.log('📐 Layout shift detected:', (entry as any).value);
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });

        // Cleanup observer on unmount
        return () => observer.disconnect();
      } catch (error) {
        console.log('Layout shift monitoring not supported');
      }
    }

    // Performance budget monitoring
    const performanceBudget = {
      maxLoadTime: 3000,
      maxLCP: 2500,
      maxFID: 100,
      maxCLS: 0.1,
      maxTTFB: 600,
      maxResourceSize: 1024 * 1024, // 1MB
      maxTotalSize: 5 * 1024 * 1024 // 5MB
    };

    // Check performance budget compliance
    setTimeout(() => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const totalLoadTime = navigation?.loadEventEnd - navigation?.navigationStart;
        
        if (totalLoadTime > performanceBudget.maxLoadTime) {
          console.error('❌ Performance budget exceeded: Load time', totalLoadTime, 'ms');
        }

        // Check total resource size
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const totalSize = resources.reduce((sum, resource) => {
          return sum + (resource.transferSize || 0);
        }, 0);

        if (totalSize > performanceBudget.maxTotalSize) {
          console.error('❌ Performance budget exceeded: Total size', Math.round(totalSize / 1024 / 1024), 'MB');
        }

        console.log('💰 Performance Budget Status:');
        console.log('   Load Time:', totalLoadTime, '/', performanceBudget.maxLoadTime, 'ms');
        console.log('   Total Size:', Math.round(totalSize / 1024 / 1024), '/', Math.round(performanceBudget.maxTotalSize / 1024 / 1024), 'MB');
      }
    }, 2000);

  }, []);

  // This component doesn't render anything visible
  return null;
});

PresidentialPerformance.displayName = 'PresidentialPerformance';

export default PresidentialPerformance;
