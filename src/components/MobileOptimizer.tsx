import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileOptimizer = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Critical CSS inlining for mobile
    const inlineCriticalCSS = () => {
      const criticalCSS = `
        /* Critical mobile-first styles */
        html { font-size: 16px; -webkit-text-size-adjust: 100%; }
        body { line-height: 1.6; }
        .mobile-optimized { 
          min-height: 44px; 
          min-width: 44px; 
          touch-action: manipulation;
        }
        /* Prevent layout shift */
        .aspect-ratio-container {
          position: relative;
          width: 100%;
          height: 0;
        }
        .aspect-ratio-16-9 { padding-bottom: 56.25%; }
        .aspect-ratio-4-3 { padding-bottom: 75%; }
        .aspect-ratio-1-1 { padding-bottom: 100%; }
      `;

      if (isMobile && !document.getElementById('critical-mobile-css')) {
        const style = document.createElement('style');
        style.id = 'critical-mobile-css';
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
      }
    };

    // Font loading optimization
    const optimizeFonts = () => {
      const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]') as HTMLLinkElement;
      if (fontLink && !fontLink.getAttribute('data-optimized')) {
        fontLink.setAttribute('data-optimized', 'true');
        // Add font-display: swap via CSS if not already present
        if (!document.getElementById('font-display-css')) {
          const style = document.createElement('style');
          style.id = 'font-display-css';
          style.textContent = '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");';
          document.head.appendChild(style);
        }
      }

      // Preload critical fonts for mobile
      const preloadFont = (href: string, weight = '400') => {
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = href;
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      };

      if (isMobile) {
        // Preload only essential font weights for mobile
        preloadFont('/fonts/inter-400.woff2', '400');
        preloadFont('/fonts/inter-600.woff2', '600');
      }
    };

    // Touch target optimization
    const optimizeTouchTargets = () => {
      if (isMobile) {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        interactiveElements.forEach(element => {
          const htmlElement = element as HTMLElement;
          if (!htmlElement.classList.contains('mobile-optimized')) {
            htmlElement.classList.add('mobile-optimized');
          }
        });
      }
    };

    // Viewport height fix for mobile browsers
    const setViewportHeight = () => {
      if (isMobile) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    };

    // Prevent zoom on input focus (mobile)
    const preventZoomOnInput = () => {
      if (isMobile) {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          const htmlInput = input as HTMLInputElement;
          if (!htmlInput.style.fontSize) {
            htmlInput.style.fontSize = '16px';
          }
        });
      }
    };

    // Initialize optimizations
    inlineCriticalCSS();
    optimizeFonts();
    optimizeTouchTargets();
    setViewportHeight();
    preventZoomOnInput();

    // Update on resize
    const handleResize = () => {
      setViewportHeight();
      optimizeTouchTargets();
    };

    window.addEventListener('resize', handleResize);
    
    // Observer for new content
    const observer = new MutationObserver(() => {
      optimizeTouchTargets();
      preventZoomOnInput();
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [isMobile]);

  return null;
};

export default MobileOptimizer;