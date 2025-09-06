import { Helmet } from 'react-helmet-async';

interface CanonicalHeadProps {
  canonicalUrl: string;
  alternateUrls?: { hreflang: string; href: string }[];
}

const CanonicalHead = ({ canonicalUrl, alternateUrls = [] }: CanonicalHeadProps) => {
  return (
    <Helmet>
      {/* Google Consent Mode (must precede gtag.js/GTM) */}
      <script data-cookieconsent="ignore">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("consent", "default", {
            ad_personalization: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            analytics_storage: "denied",
            functionality_storage: "denied",
            personalization_storage: "denied",
            security_storage: "granted",
            wait_for_update: 500,
          });
          gtag("set", "ads_data_redaction", true);
          gtag("set", "url_passthrough", false);
        `}
      </script>
      
      {/* Cookiebot Script */}
      <script 
        id="Cookiebot" 
        src="https://consent.cookiebot.com/uc.js" 
        data-cbid="a316e185-0703-4964-b697-d0301f10cdb9" 
        data-blockingmode="auto" 
        type="text/javascript"
      />
      
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Default hreflang for international SEO */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* Additional alternate URLs if provided */}
      {alternateUrls.map((alt, index) => (
        <link 
          key={index}
          rel="alternate" 
          hrefLang={alt.hreflang} 
          href={alt.href} 
        />
      ))}
      
      {/* Prevent duplicate content from URL parameters */}
      <meta name="robots" content="index, follow, noarchive" />
    </Helmet>
  );
};

export default CanonicalHead;