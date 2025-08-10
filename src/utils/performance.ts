// Performance monitoring utilities

interface PerformanceMetrics {
  name: string;
  value: number;
  delta?: number;
}

// Core Web Vitals monitoring
export const trackWebVitals = (onPerfEntry?: (metric: PerformanceMetrics) => void) => {
  if (onPerfEntry && typeof window !== 'undefined') {
    // Import web-vitals dynamically to avoid blocking
    import('web-vitals').then((webVitals) => {
      if (webVitals.onCLS) webVitals.onCLS(onPerfEntry);
      if (webVitals.onINP) webVitals.onINP(onPerfEntry);
      if (webVitals.onFCP) webVitals.onFCP(onPerfEntry);
      if (webVitals.onLCP) webVitals.onLCP(onPerfEntry);
      if (webVitals.onTTFB) webVitals.onTTFB(onPerfEntry);
    }).catch(() => {
      // Fallback performance tracking using Performance API
      if ('performance' in window && 'PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              onPerfEntry({
                name: entry.name,
                value: entry.startTime,
              });
            }
          });
          observer.observe({ entryTypes: ['measure', 'navigation'] });
        } catch (e) {
          console.warn('Performance monitoring not supported');
        }
      }
    });
  }
};

// API response time tracking
export const trackAPIResponse = (url: string, startTime: number) => {
  const duration = performance.now() - startTime;
  
  // Log slow API responses
  if (duration > 2000) {
    console.warn(`Slow API response: ${url} took ${duration.toFixed(0)}ms`);
  }
  
  // Track in analytics if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', 'api_response_time', {
      event_category: 'performance',
      event_label: url,
      value: Math.round(duration)
    });
  }
  
  return duration;
};

// Memory usage monitoring
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }
  return null;
};

// Bundle size tracking
export const trackBundleSize = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && resource.transferSize
    );
    
    const totalSize = jsResources.reduce((total, resource) => 
      total + (resource.transferSize || 0), 0
    );
    
    return {
      totalJSSize: totalSize,
      resources: jsResources.length,
      avgSize: totalSize / jsResources.length
    };
  }
  return null;
};

// Image loading performance
export const trackImageLoad = (src: string, startTime: number) => {
  const duration = performance.now() - startTime;
  
  if (duration > 3000) {
    console.warn(`Slow image load: ${src} took ${duration.toFixed(0)}ms`);
  }
  
  return duration;
};

// localStorage cache management
export const cacheManager = {
  set: (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.warn('Failed to cache data:', e);
    }
  },
  
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      const isExpired = Date.now() - parsed.timestamp > parsed.ttl;
      
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }
      
      return parsed.data;
    } catch (e) {
      console.warn('Failed to read cache:', e);
      return null;
    }
  },
  
  clear: (prefix?: string) => {
    try {
      if (prefix) {
        const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
        keys.forEach(key => localStorage.removeItem(key));
      } else {
        localStorage.clear();
      }
    } catch (e) {
      console.warn('Failed to clear cache:', e);
    }
  }
};

// Preload critical resources
export const preloadResource = (href: string, as: string = 'fetch') => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (as === 'fetch') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }
};

// Prefetch next page resources
export const prefetchRoute = (route: string) => {
  if (typeof document !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }
};