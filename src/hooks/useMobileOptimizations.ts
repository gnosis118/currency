/**
 * Mobile-optimized React hooks for currency converter
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { OptimizedStorage, NetworkMonitor, CurrencyAPI } from '@/utils/mobile-performance';

// Hook for managing currency conversion with caching
export const useCurrencyConversion = (
  initialFrom = 'USD',
  initialTo = 'EUR',
  initialAmount = '100'
) => {
  const [fromCurrency, setFromCurrency] = useState(initialFrom);
  const [toCurrency, setToCurrency] = useState(initialTo);
  const [amount, setAmount] = useState(initialAmount);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(NetworkMonitor.isOnline());

  // Subscribe to network status
  useEffect(() => {
    const unsubscribe = NetworkMonitor.subscribe(setIsOnline);
    return unsubscribe;
  }, []);

  // Fetch conversion rate
  const fetchRate = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const newRate = await CurrencyAPI.fetchRates(
        fromCurrency,
        toCurrency,
        { forceRefresh }
      );
      setRate(newRate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rate');
      // Try to get cached rate as fallback
      const cached = OptimizedStorage.getItem<{ rate: number }>(
        `${fromCurrency}_${toCurrency}`
      );
      if (cached) {
        setRate(cached.rate);
      }
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  // Calculate converted amount
  const convertedAmount = useMemo(() => {
    if (!rate || !amount) return '0.00';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '0.00';
    return (numAmount * rate).toFixed(2);
  }, [amount, rate]);

  // Swap currencies
  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (rate) {
      setRate(1 / rate);
    }
  }, [fromCurrency, toCurrency, rate]);

  // Auto-fetch rate on currency change
  useEffect(() => {
    fetchRate();
  }, [fromCurrency, toCurrency]); // Intentionally exclude fetchRate

  return {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amount,
    setAmount,
    rate,
    loading,
    error,
    isOnline,
    convertedAmount,
    swapCurrencies,
    refreshRate: () => fetchRate(true),
  };
};

// Hook for managing favorite currency pairs
export const useFavoritePairs = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = OptimizedStorage.getItem<string[]>('favorite-pairs');
    return saved || [];
  });

  const toggleFavorite = useCallback((from: string, to: string) => {
    const pairKey = `${from}_${to}`;
    setFavorites(prev => {
      const newFavorites = prev.includes(pairKey)
        ? prev.filter(f => f !== pairKey)
        : [...prev, pairKey];
      
      OptimizedStorage.setItem('favorite-pairs', newFavorites);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((from: string, to: string) => {
    return favorites.includes(`${from}_${to}`);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};

// Hook for managing recent conversions history
export const useConversionHistory = (maxItems = 10) => {
  const [history, setHistory] = useState<Array<{
    from: string;
    to: string;
    amount: string;
    result: string;
    rate: number;
    timestamp: number;
  }>>(() => {
    const saved = OptimizedStorage.getItem<any[]>('conversion-history');
    return saved || [];
  });

  const addToHistory = useCallback((
    from: string,
    to: string,
    amount: string,
    result: string,
    rate: number
  ) => {
    setHistory(prev => {
      const newHistory = [
        {
          from,
          to,
          amount,
          result,
          rate,
          timestamp: Date.now(),
        },
        ...prev.slice(0, maxItems - 1),
      ];
      
      OptimizedStorage.setItem('conversion-history', newHistory);
      return newHistory;
    });
  }, [maxItems]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    OptimizedStorage.setItem('conversion-history', []);
  }, []);

  return { history, addToHistory, clearHistory };
};

// Hook for responsive design detection
export const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    isLandscape: window.innerWidth > window.innerHeight,
  });

  useEffect(() => {
    let timeoutId: number;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
          isMobile: window.innerWidth < 768,
          isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
          isDesktop: window.innerWidth >= 1024,
          isLandscape: window.innerWidth > window.innerHeight,
        });
      }, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return dimensions;
};

// Hook for pull-to-refresh functionality
export const usePullToRefresh = (
  onRefresh: () => Promise<void>,
  threshold = 100
) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let rafId: number;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].pageY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY !== 0 || startY.current === 0) return;

      const currentY = e.touches[0].pageY;
      const diff = currentY - startY.current;

      if (diff > 0) {
        e.preventDefault();
        setIsPulling(true);
        
        rafId = requestAnimationFrame(() => {
          setPullDistance(Math.min(diff, threshold * 1.5));
        });
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > threshold) {
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
      startY.current = 0;
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [onRefresh, pullDistance, threshold]);

  return {
    elementRef,
    isPulling,
    pullDistance,
    pullProgress: Math.min(pullDistance / threshold, 1),
  };
};

// Hook for haptic feedback (vibration)
export const useHapticFeedback = () => {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const light = useCallback(() => vibrate(10), [vibrate]);
  const medium = useCallback(() => vibrate(20), [vibrate]);
  const heavy = useCallback(() => vibrate(30), [vibrate]);
  const success = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const warning = useCallback(() => vibrate([20, 100, 20]), [vibrate]);
  const error = useCallback(() => vibrate([30, 100, 30, 100, 30]), [vibrate]);

  return {
    vibrate,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
  };
};

// Hook for lazy loading images with intersection observer
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !src) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = new Image();
            image.src = src;
            image.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
            };
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return { imgRef, imageSrc, isLoaded };
};

// Hook for keyboard management on mobile
export const useMobileKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.clientHeight;
      
      if (windowHeight < documentHeight * 0.75) {
        setIsKeyboardVisible(true);
        setKeyboardHeight(documentHeight - windowHeight);
      } else {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    };

    // Visual viewport API for better keyboard detection
    if ('visualViewport' in window) {
      const viewport = window.visualViewport;
      
      const handleViewportChange = () => {
        const hasKeyboard = viewport!.height < window.innerHeight * 0.75;
        setIsKeyboardVisible(hasKeyboard);
        setKeyboardHeight(window.innerHeight - viewport!.height);
      };

      viewport?.addEventListener('resize', handleViewportChange);
      viewport?.addEventListener('scroll', handleViewportChange);

      return () => {
        viewport?.removeEventListener('resize', handleViewportChange);
        viewport?.removeEventListener('scroll', handleViewportChange);
      };
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const renderTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current++;
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      renderTime.current = duration;

      // Log slow renders
      if (duration > 16.67) { // Slower than 60fps
        console.warn(
          `Slow render in ${componentName}: ${duration.toFixed(2)}ms (render #${renderCount.current})`
        );
      }
    };
  });

  return {
    renderCount: renderCount.current,
    lastRenderTime: renderTime.current,
  };
};

// Export all hooks
export * from '@/utils/mobile-performance';
