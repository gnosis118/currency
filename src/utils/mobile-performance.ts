/**
 * Mobile Performance Optimization Utilities
 * Optimized for currency converter mobile app
 */

// Service Worker for offline support and caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Request idle callback wrapper for non-critical updates
export const scheduleIdleTask = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
};

// Optimized local storage with compression
export class OptimizedStorage {
  private static compress(data: string): string {
    // Simple compression for repeated patterns
    return data.replace(/(\w+)(\1+)/g, (match, p1, p2) => {
      return `${p1}${p2.length / p1.length + 1}`;
    });
  }

  private static decompress(data: string): string {
    return data.replace(/(\w+)(\d+)/g, (match, p1, p2) => {
      return p1.repeat(parseInt(p2));
    });
  }

  static setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      const compressed = this.compress(serialized);
      localStorage.setItem(key, compressed);
    } catch (e) {
      console.error('Storage error:', e);
      // Clear old data if storage is full
      this.clearOldData();
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;
      const decompressed = this.decompress(compressed);
      return JSON.parse(decompressed);
    } catch (e) {
      console.error('Storage read error:', e);
      return null;
    }
  }

  static clearOldData(): void {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('rate_')) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            // Remove data older than 24 hours
            if (now - parsed.timestamp > 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      }
    });
  }
}

// Network status detector
export class NetworkMonitor {
  private static callbacks: Set<(online: boolean) => void> = new Set();

  static init() {
    window.addEventListener('online', () => this.notify(true));
    window.addEventListener('offline', () => this.notify(false));
  }

  static isOnline(): boolean {
    return navigator.onLine;
  }

  static subscribe(callback: (online: boolean) => void) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private static notify(online: boolean) {
    this.callbacks.forEach(callback => callback(online));
  }
}

// Optimized API client with retry and caching
export class CurrencyAPI {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_RETRIES = 3;

  static async fetchRates(
    from: string,
    to: string,
    options: { forceRefresh?: boolean } = {}
  ): Promise<number> {
    const cacheKey = `${from}_${to}`;
    
    // Check memory cache first
    if (!options.forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    // Check localStorage cache if offline
    if (!NetworkMonitor.isOnline()) {
      const stored = OptimizedStorage.getItem<{ rate: number }>(cacheKey);
      if (stored) return stored.rate;
      throw new Error('No network connection');
    }

    // Fetch with retry logic
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const response = await this.performFetch(from, to);
        
        // Update caches
        this.cache.set(cacheKey, { data: response, timestamp: Date.now() });
        OptimizedStorage.setItem(cacheKey, { rate: response });
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        // Exponential backoff
        if (attempt < this.MAX_RETRIES - 1) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new Error('Failed to fetch rates');
  }

  private static async performFetch(from: string, to: string): Promise<number> {
    // Replace with actual API endpoint
    const response = await fetch(`/api/rates?from=${from}&to=${to}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Abort after 5 seconds
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.rate;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static clearCache() {
    this.cache.clear();
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static marks = new Map<string, number>();

  static mark(name: string) {
    this.marks.set(name, performance.now());
  }

  static measure(name: string, startMark: string): number {
    const start = this.marks.get(startMark);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    
    // Log to analytics if needed
    if (duration > 1000) {
      console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  static logMetrics() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Send to analytics
          console.log(`${entry.name}: ${entry.duration}`);
        });
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }
}

// Touch gesture handler for better mobile UX
export class TouchGestureHandler {
  private startY = 0;
  private element: HTMLElement;
  private onRefresh?: () => void;

  constructor(element: HTMLElement, onRefresh?: () => void) {
    this.element = element;
    this.onRefresh = onRefresh;
    this.init();
  }

  private init() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  private handleTouchStart(e: TouchEvent) {
    this.startY = e.touches[0].pageY;
  }

  private handleTouchMove(e: TouchEvent) {
    const y = e.touches[0].pageY;
    const diff = y - this.startY;
    
    // Pull to refresh
    if (diff > 100 && window.scrollY === 0) {
      e.preventDefault();
      if (this.onRefresh) {
        this.onRefresh();
      }
    }
  }

  private handleTouchEnd() {
    this.startY = 0;
  }

  destroy() {
    // Clean up event listeners
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// Intersection Observer for lazy loading
export const lazyLoad = (
  element: HTMLElement,
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(entry.target);
      }
    });
  }, options);

  observer.observe(element);
  
  return () => observer.disconnect();
};

// Memory leak prevention
export class MemoryManager {
  private static intervals = new Set<number>();
  private static timeouts = new Set<number>();

  static setInterval(callback: () => void, delay: number): number {
    const id = window.setInterval(callback, delay);
    this.intervals.add(id);
    return id;
  }

  static clearInterval(id: number) {
    window.clearInterval(id);
    this.intervals.delete(id);
  }

  static setTimeout(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      callback();
      this.timeouts.delete(id);
    }, delay);
    this.timeouts.add(id);
    return id;
  }

  static clearTimeout(id: number) {
    window.clearTimeout(id);
    this.timeouts.delete(id);
  }

  static cleanup() {
    this.intervals.forEach(id => window.clearInterval(id));
    this.timeouts.forEach(id => window.clearTimeout(id));
    this.intervals.clear();
    this.timeouts.clear();
  }
}

// Initialize performance optimizations
export const initMobileOptimizations = () => {
  // Register service worker
  registerServiceWorker();
  
  // Initialize network monitor
  NetworkMonitor.init();
  
  // Start performance monitoring
  PerformanceMonitor.logMetrics();
  
  // Clean up old cached data periodically
  scheduleIdleTask(() => {
    OptimizedStorage.clearOldData();
  });
  
  // Set up memory cleanup on page unload
  window.addEventListener('beforeunload', () => {
    MemoryManager.cleanup();
    CurrencyAPI.clearCache();
  });
};
