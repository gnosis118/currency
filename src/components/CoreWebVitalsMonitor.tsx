import { useEffect } from 'react';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

const CoreWebVitalsMonitor = () => {
  useEffect(() => {
    // Only run in production and when Web Vitals API is available
    if (process.env.NODE_ENV !== 'production') return;

    const reportWebVital = (metric: WebVitalMetric) => {
      // Log to console for debugging
      console.log(`${metric.name}: ${metric.value} (${metric.rating})`);
      
      // Send to analytics (Google Analytics 4)
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          custom_map: {
            metric_rating: metric.rating,
            metric_delta: metric.delta,
          },
        });
      }
    };

    // Dynamically import web-vitals library
    const loadWebVitals = async () => {
      try {
        // Note: web-vitals package would be imported here in production
        // const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        
        // Measure Core Web Vitals (would be enabled with web-vitals package)
        // getCLS(reportWebVital);
        // getFID(reportWebVital);
        // getFCP(reportWebVital);
        // getLCP(reportWebVital);
        // getTTFB(reportWebVital);
        console.log('Core Web Vitals monitoring initialized (placeholder)');
      } catch (error) {
        console.warn('Web Vitals library not available:', error);
      }
    };

    // Load Web Vitals after a delay to not impact TTI
    setTimeout(loadWebVitals, 3000);
  }, []);

  // Performance observer for additional metrics
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;

    // Monitor Long Tasks (blocking main thread)
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          console.warn(`Long task detected: ${entry.duration}ms`);
          
          // Report to analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'long_task', {
              event_category: 'Performance',
              value: Math.round(entry.duration),
            });
          }
        }
      });
    });

    // Monitor Layout Shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      if (clsValue > 0.1) {
        console.warn(`Layout shift detected: ${clsValue}`);
      }
    });

    // Monitor Resource Loading
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        // Flag slow loading resources
        if (entry.duration > 1000) {
          console.warn(`Slow resource: ${entry.name} (${entry.duration}ms)`);
        }
      });
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Performance Observer not fully supported:', error);
    }

    return () => {
      longTaskObserver.disconnect();
      layoutShiftObserver.disconnect();
      resourceObserver.disconnect();
    };
  }, []);

  // Monitor First Input Delay manually for older browsers
  useEffect(() => {
    let firstInputDelay: number | null = null;

    const handleFirstInput = (event: Event) => {
      if (firstInputDelay === null) {
        firstInputDelay = performance.now() - (event as any).timeStamp;
        
        if (firstInputDelay > 100) {
          console.warn(`High First Input Delay: ${firstInputDelay}ms`);
          
          if (typeof gtag !== 'undefined') {
            gtag('event', 'first_input_delay', {
              event_category: 'Performance',
              value: Math.round(firstInputDelay),
            });
          }
        }
        
        // Remove listeners after first input
        document.removeEventListener('click', handleFirstInput);
        document.removeEventListener('keydown', handleFirstInput);
        document.removeEventListener('touchstart', handleFirstInput);
      }
    };

    document.addEventListener('click', handleFirstInput, { passive: true });
    document.addEventListener('keydown', handleFirstInput, { passive: true });
    document.addEventListener('touchstart', handleFirstInput, { passive: true });

    return () => {
      document.removeEventListener('click', handleFirstInput);
      document.removeEventListener('keydown', handleFirstInput);
      document.removeEventListener('touchstart', handleFirstInput);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CoreWebVitalsMonitor;
