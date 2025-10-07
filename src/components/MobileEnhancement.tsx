import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileEnhancement = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    // Enhanced mobile CSS
    const mobileStyles = document.createElement('style');
    mobileStyles.id = 'mobile-enhancement-styles';
    mobileStyles.textContent = `
      /* Mobile-first responsive enhancements */
      @media (max-width: 768px) {
        /* Ensure minimum touch target sizes */
        button, 
        [role="button"], 
        input, 
        select, 
        textarea,
        a {
          min-height: 44px !important;
          min-width: 44px !important;
          touch-action: manipulation;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        }

        /* Optimize scrolling performance */
        * {
          -webkit-overflow-scrolling: touch;
          overflow-scrolling: touch;
        }

        /* Prevent zoom on input focus */
        input[type="text"],
        input[type="number"],
        input[type="email"],
        input[type="password"],
        input[type="search"],
        select,
        textarea {
          font-size: 16px !important;
          transform: scale(1);
          -webkit-text-size-adjust: 100%;
        }

        /* Improved mobile typography */
        h1 { font-size: 1.75rem !important; }
        h2 { font-size: 1.5rem !important; }
        h3 { font-size: 1.25rem !important; }
        
        /* Better spacing for mobile */
        .container {
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }

        /* Mobile-friendly cards */
        .mobile-card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: none !important;
        }

        /* Optimize form layouts for mobile */
        .mobile-form-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr;
        }

        /* Better mobile navigation */
        .mobile-nav-item {
          padding: 0.75rem 1rem;
          margin: 0.25rem 0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-height: 48px;
          touch-action: manipulation;
        }

        /* Mobile-optimized selects */
        .mobile-select {
          background-size: 20px;
          padding-right: 2.5rem;
        }

        /* Prevent layout shift on mobile */
        .mobile-stable {
          contain: layout style;
        }

        /* Better mobile tables */
        .mobile-table {
          font-size: 0.875rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Mobile sticky elements */
        .mobile-sticky {
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        /* Better mobile modals */
        .mobile-modal {
          margin: 1rem;
          max-height: calc(100vh - 2rem);
          border-radius: 12px;
        }

        /* Mobile-friendly buttons */
        .mobile-button {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          min-height: 44px;
          touch-action: manipulation;
        }

        /* Safe area handling for iOS */
        .mobile-safe-area {
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }

        /* Mobile loading states */
        .mobile-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        /* Better mobile focus states */
        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
      }

      /* Dark mode mobile optimizations */
      @media (max-width: 768px) and (prefers-color-scheme: dark) {
        .mobile-sticky {
          background: rgba(0, 0, 0, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #60a5fa;
          box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
        }
      }
    `;

    // Only add if not already present
    if (!document.getElementById('mobile-enhancement-styles')) {
      document.head.appendChild(mobileStyles);
    }

    // Mobile viewport optimization
    const setMobileViewport = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Update viewport meta tag for better mobile experience
      let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
      }
    };

    // Performance optimizations for mobile
    const optimizeMobilePerformance = () => {
      // Add will-change to frequently animated elements
      const animatedElements = document.querySelectorAll('.animate-spin, .transition-all, .transition-transform');
      animatedElements.forEach(el => {
        (el as HTMLElement).style.willChange = 'transform';
      });

      // Optimize scroll performance
      const scrollContainers = document.querySelectorAll('.overflow-auto, .overflow-scroll');
      scrollContainers.forEach(container => {
        (container as HTMLElement).style.webkitOverflowScrolling = 'touch';
      });
    };

    // Mobile touch optimizations
    const optimizeTouchInteractions = () => {
      // Add touch-friendly classes to interactive elements
      const interactiveElements = document.querySelectorAll('button, [role="button"], input, select, textarea, a[href]');
      interactiveElements.forEach(el => {
        el.classList.add('touch-manipulation');
        if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
          el.classList.add('mobile-button');
        }
      });

      // Apply mobile-friendly classes to common UI elements
      const cards = document.querySelectorAll('[class*="card"], .bg-card');
      cards.forEach(card => {
        card.classList.add('mobile-card');
      });

      const containers = document.querySelectorAll('.container');
      containers.forEach(container => {
        container.classList.add('mobile-safe-area');
      });
    };

    // Mobile accessibility enhancements
    const enhanceMobileAccessibility = () => {
      // Ensure proper ARIA labels for mobile
      const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      buttons.forEach(button => {
        const text = button.textContent?.trim();
        if (text && text.length > 0) {
          button.setAttribute('aria-label', text);
        }
      });

      // Add mobile-specific focus management
      document.addEventListener('focusin', (e) => {
        const target = e.target as HTMLElement;
        if (target.scrollIntoView) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    };

    // Initialize optimizations
    setMobileViewport();
    optimizeMobilePerformance();
    optimizeTouchInteractions();
    enhanceMobileAccessibility();

    // Update on resize
    const handleResize = () => {
      setMobileViewport();
      optimizeTouchInteractions();
    };

    // Update on orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        setMobileViewport();
        optimizeTouchInteractions();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Observer for dynamic content
    const observer = new MutationObserver(() => {
      optimizeTouchInteractions();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      observer.disconnect();
      
      const styles = document.getElementById('mobile-enhancement-styles');
      if (styles) {
        styles.remove();
      }
    };
  }, [isMobile]);

  return null;
};

export default MobileEnhancement;
