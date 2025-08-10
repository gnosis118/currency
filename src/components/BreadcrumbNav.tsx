import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useEffect } from 'react';

interface BreadcrumbNavProps {
  className?: string;
}

const BreadcrumbNav = ({ className }: BreadcrumbNavProps) => {
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return { label, href };
    })
  ];

  useEffect(() => {
    // Enhanced breadcrumb structured data with organization context
    if (breadcrumbItems.length > 1) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            "@id": "https://currencytocurrency.app/#breadcrumb",
            "itemListElement": breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.label,
              "item": {
                "@type": "WebPage",
                "@id": `https://currencytocurrency.app${item.href}`,
                "url": `https://currencytocurrency.app${item.href}`,
                "name": item.label
              }
            }))
          },
          {
            "@type": "Organization",
            "@id": "https://currencytocurrency.app/#organization",
            "name": "Currency to Currency",
            "url": "https://currencytocurrency.app",
            "logo": {
              "@type": "ImageObject",
              "url": "https://currencytocurrency.app/icon-512.png"
            }
          }
        ]
      });
      document.head.appendChild(script);
      
      return () => {
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript && existingScript.textContent?.includes('BreadcrumbList')) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [location.pathname]);

  if (breadcrumbItems.length <= 1) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.href}>
            {index === breadcrumbItems.length - 1 ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;