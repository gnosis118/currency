import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobilePerformance = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    // Critical performance optimizations for mobile
    const optimizeForMobile = () => {
      // 1. Optimize images with lazy loading
      const observeImages = () => {
        const imageObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                if (img.dataset.src) {
                  img.src = img.dataset.src;
                  img.removeAttribute('data-src');
                  imageObserver.unobserve(img);
                }
              }
            });
          },
          { rootMargin: '50px' }
        );

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach((img) => {
          imageObserver.observe(img);
        });

        return imageObserver;
      };

      // 2. Optimize scroll performance
      const optimizeScrolling = () => {
        let ticking = false;
        
        const updateScrollElements = () => {
          // Update any scroll-dependent elements
          const scrollTop = window.pageYOffset;
          
          // Optimize header background on scroll
          const header = document.querySelector('header');
          if (header) {
            if (scrollTop > 50) {
              header.classList.add('scrolled');
            } else {
              header.classList.remove('scrolled');
            }
          }
          
          ticking = false;
        };

        const onScroll = () => {
          if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
          }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
      };

      // 3. Optimize touch interactions
      const optimizeTouchInteractions = () => {
        // Add passive touch listeners for better scroll performance
        const addPassiveListeners = () => {
          const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
          passiveEvents.forEach(event => {
            document.addEventListener(event, () => {}, { passive: true });
          });
        };

        // Optimize tap highlighting
        const optimizeTapHighlight = () => {
          const style = document.createElement('style');
          style.textContent = `
            /* Optimize tap highlights for mobile */
            * {
              -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            
            /* Allow text selection for content areas */
            p, h1, h2, h3, h4, h5, h6, span, div[class*="content"], 
            article, section, .prose, [role="main"] {
              -webkit-user-select: text;
              -moz-user-select: text;
              -ms-user-select: text;
              user-select: text;
            }
            
            /* Input elements should be selectable */
            input, textarea, select, [contenteditable] {
              -webkit-user-select: text;
              -moz-user-select: text;
              -ms-user-select: text;
              user-select: text;
            }
          `;
          document.head.appendChild(style);
        };

        addPassiveListeners();
        optimizeTapHighlight();
      };

      // 4. Memory optimization
      const optimizeMemory = () => {
        // Limit the number of DOM elements for large lists
        const optimizeLargeLists = () => {
          const largeLists = document.querySelectorAll('[data-large-list]');
          largeLists.forEach(list => {
            const items = list.children;
            const visibleCount = parseInt(list.getAttribute('data-visible-count') || '20');
            
            if (items.length > visibleCount) {
              // Hide excess items and add "Load More" functionality
              Array.from(items).slice(visibleCount).forEach(item => {
                (item as HTMLElement).style.display = 'none';
              });
              
              // Add load more button if not exists
              if (!list.querySelector('.load-more-btn')) {
                const loadMoreBtn = document.createElement('button');
                loadMoreBtn.className = 'load-more-btn bg-primary text-primary-foreground px-4 py-2 rounded mt-4 touch-manipulation';
                loadMoreBtn.textContent = 'Load More';
                loadMoreBtn.onclick = () => {
                  const hiddenItems = Array.from(items).filter(item => 
                    (item as HTMLElement).style.display === 'none'
                  ).slice(0, visibleCount);
                  
                  hiddenItems.forEach(item => {
                    (item as HTMLElement).style.display = '';
                  });
                  
                  if (hiddenItems.length < visibleCount) {
                    loadMoreBtn.remove();
                  }
                };
                list.appendChild(loadMoreBtn);
              }
            }
          });
        };

        optimizeLargeLists();
      };

      // 5. Network optimization
      const optimizeNetwork = () => {
        // Preload critical resources
        const preloadCriticalResources = () => {
          const criticalImages = [
            '/placeholder.svg',
            '/favicon.ico'
          ];
          
          criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
          });
        };

        // Optimize font loading
        const optimizeFonts = () => {
          // Add font-display: swap to all font faces
          const style = document.createElement('style');
          style.textContent = `
            @font-face {
              font-display: swap;
            }
          `;
          document.head.appendChild(style);
        };

        preloadCriticalResources();
        optimizeFonts();
      };

      // 6. Battery optimization
      const optimizeBattery = () => {
        // Reduce animations when battery is low
        if ('getBattery' in navigator) {
          (navigator as any).getBattery().then((battery: any) => {
            const handleBatteryChange = () => {
              const lowBattery = battery.level < 0.2 && !battery.charging;
              
              if (lowBattery) {
                document.body.classList.add('low-battery');
                // Add styles to reduce animations
                const style = document.createElement('style');
                style.id = 'low-battery-styles';
                style.textContent = `
                  .low-battery * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                  }
                `;
                document.head.appendChild(style);
              } else {
                document.body.classList.remove('low-battery');
                const style = document.getElementById('low-battery-styles');
                if (style) style.remove();
              }
            };

            battery.addEventListener('levelchange', handleBatteryChange);
            battery.addEventListener('chargingchange', handleBatteryChange);
            handleBatteryChange();
          });
        }
      };

      // Initialize optimizations
      const imageObserver = observeImages();
      const scrollCleanup = optimizeScrolling();
      optimizeTouchInteractions();
      optimizeMemory();
      optimizeNetwork();
      optimizeBattery();

      // Cleanup function
      return () => {
        imageObserver.disconnect();
        scrollCleanup();
      };
    };

    // Service Worker registration for caching
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);
        } catch (error) {
          console.log('Service Worker registration failed:', error);
        }
      }
    };

    // Connection-aware optimizations
    const optimizeForConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const handleConnectionChange = () => {
          const slowConnection = connection.effectiveType === 'slow-2g' || 
                               connection.effectiveType === '2g';
          
          if (slowConnection) {
            document.body.classList.add('slow-connection');
            // Reduce image quality and disable autoplay
            document.querySelectorAll('img').forEach(img => {
              if (img.src && !img.src.includes('placeholder')) {
                // Could implement image quality reduction here
              }
            });
            
            document.querySelectorAll('video[autoplay]').forEach(video => {
              (video as HTMLVideoElement).autoplay = false;
            });
          } else {
            document.body.classList.remove('slow-connection');
          }
        };

        connection.addEventListener('change', handleConnectionChange);
        handleConnectionChange();
      }
    };

    const cleanup = optimizeForMobile();
    registerServiceWorker();
    optimizeForConnection();

    return cleanup;
  }, [isMobile]);

  return null;
};

export default MobilePerformance;
