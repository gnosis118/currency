import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface EnhancedBreadcrumbsProps {
  customBreadcrumbs?: Array<{
    name: string;
    href?: string;
  }>;
}

const EnhancedBreadcrumbs = ({ customBreadcrumbs }: EnhancedBreadcrumbsProps) => {
  const location = useLocation();

  // Generate breadcrumbs from URL path
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return [{ name: 'Home', href: '/' }, ...customBreadcrumbs];
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Home', href: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Format segment name
      let name = segment.replace(/-/g, ' ');
      name = name.charAt(0).toUpperCase() + name.slice(1);
      
      // Special cases for better naming
      if (segment === 'convert') name = 'Currency Converter';
      if (segment === 'charts') name = 'Exchange Rate Charts';
      if (segment === 'alerts') name = 'Rate Alerts';
      if (segment === 'travel') name = 'Travel Money';
      if (segment === 'faq') name = 'FAQ';
      if (segment === 'blog') name = 'Blog';
      if (segment === 'privacy-policy') name = 'Privacy Policy';
      if (segment === 'terms-of-service') name = 'Terms of Service';

      breadcrumbs.push({
        name,
        href: isLast ? undefined : `https://currencytocurrency.app${currentPath}`
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.href || `https://currencytocurrency.app${location.pathname}`
    }))
  };

  useEffect(() => {
    // Add hreflang tags for international SEO
    const addHreflangTags = () => {
      // Remove existing hreflang tags
      const existingTags = document.querySelectorAll('link[hreflang]');
      existingTags.forEach(tag => tag.remove());

      // Add new hreflang tags
      const currentUrl = `https://currencytocurrency.app${location.pathname}`;
      
      const hreflangTags = [
        { hreflang: 'en', href: currentUrl },
        { hreflang: 'en-US', href: currentUrl },
        { hreflang: 'en-GB', href: currentUrl },
        { hreflang: 'en-CA', href: currentUrl },
        { hreflang: 'en-AU', href: currentUrl },
        { hreflang: 'x-default', href: currentUrl }
      ];

      hreflangTags.forEach(({ hreflang, href }) => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang;
        link.href = href;
        document.head.appendChild(link);
      });
    };

    addHreflangTags();
  }, [location.pathname]);

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') {
    return (
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
    );
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-2">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={index}>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="text-foreground">
                    {crumb.name}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink 
                      href={crumb.href || '/'}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.name}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
};

export default EnhancedBreadcrumbs;