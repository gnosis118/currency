import { Helmet } from 'react-helmet-async';

interface CanonicalHeadProps {
  canonicalUrl: string;
  alternateUrls?: { hreflang: string; href: string }[];
}

const CanonicalHead = ({ canonicalUrl, alternateUrls = [] }: CanonicalHeadProps) => {
  return (
    <Helmet>
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