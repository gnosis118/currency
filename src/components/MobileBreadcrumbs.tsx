import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface MobileBreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * Mobile-optimized breadcrumb navigation with structured data
 * Provides better mobile navigation and SEO benefits
 */
const MobileBreadcrumbs: React.FC<MobileBreadcrumbsProps> = ({ 
  items, 
  className = '' 
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Generate breadcrumbs from current path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle specific routes
      switch (segment) {
        case 'convert':
          label = 'Currency Converter';
          break;
        case 'blog':
          label = 'Blog';
          break;
        case 'charts':
          label = 'Currency Charts';
          break;
        case 'alerts':
          label = 'Rate Alerts';
          break;
        case 'travel':
          label = 'Travel Money';
          break;
        default:
          // Handle currency pairs like USD-EUR
          if (segment.includes('-') && segment.length === 7) {
            const [from, to] = segment.split('-');
            label = `${from.toUpperCase()} to ${to.toUpperCase()}`;
          }
          break;
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://currencytocurrency.app${item.href}`
    }))
  };

  // Mobile-optimized breadcrumb display (show only last 2-3 items on mobile)
  const displayBreadcrumbs = isMobile && breadcrumbs.length > 3 
    ? [
        breadcrumbs[0], // Home
        { label: '...', href: '#', current: false }, // Ellipsis
        ...breadcrumbs.slice(-2) // Last 2 items
      ]
    : breadcrumbs;

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <nav 
        aria-label="Breadcrumb navigation"
        className={`mobile-breadcrumbs ${className}`}
        role="navigation"
      >
        <ol className={`
          flex items-center space-x-1 text-sm
          ${isMobile ? 'px-4 py-2' : 'px-0 py-1'}
          overflow-x-auto scrollbar-hide
        `}>
          {displayBreadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className={`
                    text-gray-400 mx-1 flex-shrink-0
                    ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}
                  `}
                  aria-hidden="true"
                />
              )}
              
              {item.href === '#' ? (
                <span className="text-gray-500 px-1">
                  {item.label}
                </span>
              ) : item.current ? (
                <span 
                  className={`
                    text-gray-900 font-medium px-1
                    ${isMobile ? 'text-xs' : 'text-sm'}
                  `}
                  aria-current="page"
                >
                  {index === 0 && isMobile ? (
                    <Home className="h-3 w-3" aria-label="Home" />
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className={`
                    text-blue-600 hover:text-blue-800 px-1
                    transition-colors duration-200
                    ${isMobile ? 'text-xs' : 'text-sm'}
                    touch-manipulation
                  `}
                  style={{ minHeight: isMobile ? '44px' : 'auto' }}
                >
                  {index === 0 && isMobile ? (
                    <Home className="h-3 w-3" aria-label="Home" />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <style jsx>{`
        .mobile-breadcrumbs {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .mobile-breadcrumbs {
            position: sticky;
            top: 0;
            z-index: 20;
          }
          
          .mobile-breadcrumbs ol {
            white-space: nowrap;
          }
          
          .mobile-breadcrumbs li {
            flex-shrink: 0;
          }
        }
      `}</style>
    </>
  );
};

export default MobileBreadcrumbs;
