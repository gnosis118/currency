import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Mobile-optimized Core Web Vitals monitoring
 * Tracks LCP, FID, CLS, FCP, TTFB specifically for mobile devices
 */
const MobileCoreWebVitals = () => {
  const isMobile = useIsMobile();
  const metricsRef = useRef<Map<string, WebVitalMetric>>(new Map());

  useEffect(() => {
    if (!isMobile) return;

    // Only load web-vitals on mobile devices
    const loadWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

        // Largest Contentful Paint (LCP)
        getLCP((metric) => {
          const rating = metric.value <= 2500 ? 'good' : metric.value <= 4000 ? 'needs-improvement' : 'poor';
          metricsRef.current.set('LCP', { ...metric, rating });
          reportMetric('LCP', metric.value, rating);
        });

        // First Input Delay (FID) - Mobile interaction responsiveness
        getFID((metric) => {
          const rating = metric.value <= 100 ? 'good' : metric.value <= 300 ? 'needs-improvement' : 'poor';
          metricsRef.current.set('FID', { ...metric, rating });
          reportMetric('FID', metric.value, rating);
        });

        // Cumulative Layout Shift (CLS) - Critical for mobile
        getCLS((metric) => {
          const rating = metric.value <= 0.1 ? 'good' : metric.value <= 0.25 ? 'needs-improvement' : 'poor';
          metricsRef.current.set('CLS', { ...metric, rating });
          reportMetric('CLS', metric.value, rating);
        });

        // First Contentful Paint (FCP) - Mobile loading perception
        getFCP((metric) => {
          const rating = metric.value <= 1800 ? 'good' : metric.value <= 3000 ? 'needs-improvement' : 'poor';
          metricsRef.current.set('FCP', { ...metric, rating });
          reportMetric('FCP', metric.value, rating);
        });

        // Time to First Byte (TTFB) - Mobile network performance
        getTTFB((metric) => {
          const rating = metric.value <= 800 ? 'good' : metric.value <= 1800 ? 'needs-improvement' : 'poor';
          metricsRef.current.set('TTFB', { ...metric, rating });
          reportMetric('TTFB', metric.value, rating);
        });

      } catch (error) {
        console.warn('Web Vitals library not available:', error);
      }
    };

    loadWebVitals();
  }, [isMobile]);

  // Mobile-specific performance monitoring
  useEffect(() => {
    if (!isMobile) return;

    // Monitor mobile-specific performance metrics
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Track mobile navigation timing
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // Mobile-specific metrics
          const mobileMetrics = {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstByte: navEntry.responseStart - navEntry.requestStart,
            domInteractive: navEntry.domInteractive - navEntry.navigationStart,
            mobileNetworkType: (navigator as any).connection?.effectiveType || 'unknown'
          };

          reportMobileMetrics(mobileMetrics);
        }

        // Track mobile resource loading
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Monitor critical mobile resources
          if (resourceEntry.name.includes('manifest.json') || 
              resourceEntry.name.includes('sw.js') ||
              resourceEntry.name.includes('mobile')) {
            
            const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
            reportResourceMetric(resourceEntry.name, loadTime);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'resource'] });

    return () => observer.disconnect();
  }, [isMobile]);

  // Mobile touch interaction monitoring
  useEffect(() => {
    if (!isMobile) return;

    let touchStartTime = 0;
    let interactionCount = 0;

    const handleTouchStart = () => {
      touchStartTime = performance.now();
    };

    const handleTouchEnd = () => {
      if (touchStartTime > 0) {
        const interactionTime = performance.now() - touchStartTime;
        interactionCount++;
        
        // Track mobile interaction responsiveness
        if (interactionTime > 100) {
          reportSlowInteraction(interactionTime, interactionCount);
        }
        
        touchStartTime = 0;
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  // Mobile viewport monitoring
  useEffect(() => {
    if (!isMobile) return;

    const monitorViewport = () => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        orientation: screen.orientation?.type || 'unknown'
      };

      reportViewportMetrics(viewport);
    };

    monitorViewport();
    window.addEventListener('resize', monitorViewport);
    window.addEventListener('orientationchange', monitorViewport);

    return () => {
      window.removeEventListener('resize', monitorViewport);
      window.removeEventListener('orientationchange', monitorViewport);
    };
  }, [isMobile]);

  return null; // This is a monitoring component with no UI
};

// Reporting functions
const reportMetric = (name: string, value: number, rating: string) => {
  // Send to analytics service
  if (typeof gtag !== 'undefined') {
    gtag('event', 'web_vitals', {
      event_category: 'Mobile Performance',
      event_label: name,
      value: Math.round(value),
      custom_map: { metric_rating: rating }
    });
  }

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Mobile ${name}:`, {
      value: Math.round(value),
      rating,
      timestamp: new Date().toISOString()
    });
  }
};

const reportMobileMetrics = (metrics: any) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'mobile_performance', {
      event_category: 'Mobile Metrics',
      custom_map: metrics
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Mobile Performance Metrics:', metrics);
  }
};

const reportResourceMetric = (resource: string, loadTime: number) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'mobile_resource_timing', {
      event_category: 'Mobile Resources',
      event_label: resource,
      value: Math.round(loadTime)
    });
  }
};

const reportSlowInteraction = (time: number, count: number) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'mobile_slow_interaction', {
      event_category: 'Mobile UX',
      value: Math.round(time),
      custom_map: { interaction_count: count }
    });
  }
};

const reportViewportMetrics = (viewport: any) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'mobile_viewport', {
      event_category: 'Mobile Device',
      custom_map: viewport
    });
  }
};

export default MobileCoreWebVitals;
