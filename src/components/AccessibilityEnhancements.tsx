import { useEffect } from 'react';

/**
 * WCAG 2.1 AA Accessibility Enhancements Component
 * Implements automated accessibility improvements for better compliance
 */
const AccessibilityEnhancements = () => {
  useEffect(() => {
    // Add skip navigation link
    const addSkipLink = () => {
      const existingSkipLink = document.getElementById('skip-link');
      if (existingSkipLink) return;

      const skipLink = document.createElement('a');
      skipLink.id = 'skip-link';
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded';
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    };

    // Add main content landmark if not present
    const addMainLandmark = () => {
      const main = document.querySelector('main');
      if (!main) {
        const mainContent = document.querySelector('[class*=\"container\"]') || 
                           document.querySelector('[class*=\"max-w\"]') ||
                           document.body.children[1]; // Fallback to second child (after header)
        
        if (mainContent && !mainContent.closest('header') && !mainContent.closest('footer')) {
          mainContent.id = 'main-content';
          mainContent.setAttribute('role', 'main');
        }
      }
    };

    // Enhance focus visibility
    const enhanceFocus = () => {
      const style = document.createElement('style');
      style.textContent = `
        /* Enhanced focus indicators for better accessibility */
        *:focus-visible {
          outline: 2px solid hsl(var(--primary)) !important;
          outline-offset: 2px !important;
          border-radius: 2px;
        }
        
        /* Ensure interactive elements have minimum touch target size (44px) */
        button, a, input, select, textarea {
          min-height: 44px;
          min-width: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Improve text contrast for better readability */
        .text-muted-foreground {
          color: hsl(var(--foreground) / 0.7) !important;
        }
        
        /* Ensure sufficient color contrast for links */
        a {
          text-decoration: underline;
        }
        
        a:hover {
          text-decoration: none;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          * {
            border-color: ButtonText !important;
          }
          
          .border {
            border-width: 2px !important;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Screen reader only content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .sr-only.focus\\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `;
      
      if (!document.querySelector('#accessibility-styles')) {
        style.id = 'accessibility-styles';
        document.head.appendChild(style);
      }
    };

    // Add ARIA labels to important elements without them
    const enhanceAriaLabels = () => {
      // Add lang attribute if missing
      if (!document.documentElement.lang) {
        document.documentElement.lang = 'en';
      }

      // Enhance navigation elements
      const navElements = document.querySelectorAll('nav');
      navElements.forEach((nav, index) => {
        if (!nav.getAttribute('aria-label')) {
          const isMainNav = nav.closest('header');
          const isFooterNav = nav.closest('footer');
          
          if (isMainNav) {
            nav.setAttribute('aria-label', 'Main navigation');
          } else if (isFooterNav) {
            nav.setAttribute('aria-label', 'Footer navigation');
          } else {
            nav.setAttribute('aria-label', `Navigation ${index + 1}`);
          }
        }
      });

      // Enhance form elements
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        const placeholder = input.getAttribute('placeholder');
        
        if (!label && placeholder && !input.getAttribute('aria-label')) {
          input.setAttribute('aria-label', placeholder);
        }
      });

      // Enhance buttons without accessible names
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        if (!button.textContent?.trim() && 
            !button.getAttribute('aria-label') && 
            !button.getAttribute('aria-labelledby')) {
          const icon = button.querySelector('svg');
          if (icon) {
            button.setAttribute('aria-label', 'Button');
          }
        }
      });
    };

    // Add live region for dynamic content announcements
    const addLiveRegion = () => {
      if (!document.getElementById('aria-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
      }
    };

    // Initialize all accessibility enhancements
    addSkipLink();
    addMainLandmark();
    enhanceFocus();
    enhanceAriaLabels();
    addLiveRegion();

    // Re-run aria enhancements when DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      enhanceAriaLabels();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Announce route changes to screen readers
    const announceRouteChange = () => {
      const liveRegion = document.getElementById('aria-live-region');
      if (liveRegion) {
        const pageTitle = document.title.split(' - ')[0] || 'Page';
        liveRegion.textContent = `Navigated to ${pageTitle}`;
        
        // Clear after announcement
        setTimeout(() => {
          liveRegion.textContent = '';
        }, 1000);
      }
    };

    // Listen for route changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      setTimeout(announceRouteChange, 100);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      setTimeout(announceRouteChange, 100);
    };

    window.addEventListener('popstate', () => {
      setTimeout(announceRouteChange, 100);
    });

    // Cleanup
    return () => {
      observer.disconnect();
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return null;
};

export default AccessibilityEnhancements;