// src/utils/seo.ts
// Enhanced SEO utilities for currencytocurrency.app

export interface CurrencyPair {
  from: string;
  to: string;
  fromName: string;
  toName: string;
}

// Comprehensive currency names mapping
export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  MXN: 'Mexican Peso',
  BRL: 'Brazilian Real',
  KRW: 'South Korean Won',
  RUB: 'Russian Ruble',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  NZD: 'New Zealand Dollar',
  TRY: 'Turkish Lira',
  ZAR: 'South African Rand',
  THB: 'Thai Baht',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  DKK: 'Danish Krone',
  PLN: 'Polish Zloty',
  CZK: 'Czech Koruna',
  HUF: 'Hungarian Forint',
  RON: 'Romanian Leu',
  ILS: 'Israeli Shekel',
  CLP: 'Chilean Peso',
  PHP: 'Philippine Peso',
  AED: 'UAE Dirham',
  SAR: 'Saudi Riyal',
  MYR: 'Malaysian Ringgit',
  IDR: 'Indonesian Rupiah',
  VND: 'Vietnamese Dong',
  PKR: 'Pakistani Rupee',
  BDT: 'Bangladeshi Taka',
  EGP: 'Egyptian Pound',
  NGN: 'Nigerian Naira',
  KES: 'Kenyan Shilling',
  ARS: 'Argentine Peso',
  COP: 'Colombian Peso',
  PEN: 'Peruvian Sol',
};

// Get currency full name
export function getCurrencyName(code: string): string {
  return CURRENCY_NAMES[code.toUpperCase()] || code.toUpperCase();
}

// Generate optimized page title for conversion pages
export function generateConversionTitle(from: string, to: string): string {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  return `${fromUpper} to ${toUpper} Converter | Live Exchange Rates & Alerts`;
}

// Generate SEO-optimized meta description
export function generateConversionDescription(from: string, to: string): string {
  const fromName = getCurrencyName(from);
  const toName = getCurrencyName(to);
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  
  return `Convert ${fromName} (${fromUpper}) to ${toName} (${toUpper}) with real-time exchange rates. Free currency converter, historical charts, rate alerts, and forex analysis for ${fromUpper}/${toUpper}.`;
}

// Generate keywords for conversion pages
export function generateConversionKeywords(from: string, to: string): string {
  const fromName = getCurrencyName(from);
  const toName = getCurrencyName(to);
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  
  return [
    `${fromUpper} to ${toUpper}`,
    `${fromUpper}${toUpper}`,
    `${fromUpper}/${toUpper}`,
    `${fromUpper} to ${toUpper} exchange rate`,
    `convert ${fromUpper} to ${toUpper}`,
    `${fromUpper} to ${toUpper} converter`,
    `${fromName} to ${toName}`,
    `${fromName} ${toName} exchange rate`,
    'currency converter',
    'exchange rate',
    'forex',
    'live rates',
    'currency exchange',
    'real-time exchange rates'
  ].join(', ');
}

// Generate Open Graph title
export function generateOGTitle(from: string, to: string): string {
  return `${from.toUpperCase()} to ${to.toUpperCase()} Exchange Rate - Live Converter`;
}

// Generate Open Graph description
export function generateOGDescription(from: string, to: string): string {
  return `Live ${from.toUpperCase()} to ${to.toUpperCase()} conversion rates updated every minute. Free currency converter with charts and alerts.`;
}

// Blog post metadata generator
export interface BlogPostMetadata {
  title: string;
  excerpt: string;
  author?: string;
  date: string;
  tags?: string[];
  slug: string;
}

export function generateBlogMetadata(post: BlogPostMetadata) {
  return {
    title: `${post.title} | Currency Exchange Blog`,
    description: post.excerpt.substring(0, 160),
    keywords: post.tags?.join(', '),
    canonicalUrl: `https://currencytocurrency.app/blog/${post.slug}`,
    ogImage: `https://currencytocurrency.app/images/blog/${post.slug}-og.jpg`,
  };
}

// Page-specific metadata
export const PAGE_METADATA = {
  alerts: {
    title: 'Currency Rate Alerts | Track Exchange Rate Changes',
    description: 'Set up free currency rate alerts and get notified when exchange rates hit your target. Track 150+ currency pairs with instant email and SMS notifications.',
    keywords: 'currency alerts, exchange rate alerts, forex alerts, rate notifications, currency tracker, price alerts',
  },
  charts: {
    title: 'Live Currency Charts | Real-time Forex Analysis',
    description: 'View live currency charts with real-time data for 150+ currency pairs. Interactive forex charts with technical indicators and historical data.',
    keywords: 'currency charts, forex charts, exchange rate charts, live rates, technical analysis, currency graphs',
  },
  brokers: {
    title: 'Best Forex Brokers 2025 | Compare Trading Platforms',
    description: 'Compare the best forex brokers for 2025. Detailed reviews of trading platforms, fees, regulations, and features to help you choose the right broker.',
    keywords: 'forex brokers, trading platforms, currency trading, broker comparison, forex reviews, best brokers',
  },
  blog: {
    title: 'Currency Exchange Blog | Forex Trading Tips & Analysis',
    description: 'Expert insights on currency exchange, forex trading strategies, market analysis, and international money transfer tips. Stay updated with the latest forex trends.',
    keywords: 'forex blog, currency exchange, trading tips, forex analysis, exchange rates, market news',
  },
  travel: {
    title: 'Travel Currency Converter | Best Exchange Rates for Travelers',
    description: 'Get the best currency exchange rates for your travels. Compare rates, avoid hidden fees, and learn when to exchange money for your destination.',
    keywords: 'travel currency, travel money, currency exchange travel, best exchange rates, travel forex',
  },
  faq: {
    title: 'Frequently Asked Questions | Currency Converter Help',
    description: 'Find answers to common questions about currency conversion, exchange rates, forex trading, and using our currency tools.',
    keywords: 'currency faq, exchange rate questions, forex help, currency converter help',
  },
  about: {
    title: 'About Currency to Currency | Our Mission',
    description: 'Learn about Currency to Currency, our mission to provide accurate real-time exchange rates, and how we help millions make better currency decisions.',
    keywords: 'about us, currency platform, exchange rates, forex tools, company information',
  },
  contact: {
    title: 'Contact Us | Currency to Currency Support',
    description: 'Get in touch with our support team. We\'re here to help with questions about currency conversion, technical issues, or partnership opportunities.',
    keywords: 'contact, support, help, customer service, feedback',
  },
  privacyPolicy: {
    title: 'Privacy Policy | Currency to Currency',
    description: 'Read our privacy policy to understand how we collect, use, and protect your data. GDPR and CCPA compliant.',
    keywords: 'privacy policy, data protection, GDPR, CCPA, privacy rights',
  },
  termsOfService: {
    title: 'Terms of Service | Currency to Currency',
    description: 'Read our terms of service governing your use of Currency to Currency. Understand your rights and responsibilities.',
    keywords: 'terms of service, terms and conditions, user agreement, legal',
  },
};

// Generate structured data for currency converter
export function generateConverterStructuredData(from: string, to: string) {
  const fromName = getCurrencyName(from);
  const toName = getCurrencyName(to);
  
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": `${from.toUpperCase()} to ${to.toUpperCase()} Currency Converter`,
    "description": `Convert ${fromName} to ${toName} with real-time exchange rates`,
    "url": `https://currencytocurrency.app/convert/${from.toLowerCase()}-to-${to.toLowerCase()}`,
    "provider": {
      "@type": "Organization",
      "name": "Currency to Currency",
      "url": "https://currencytocurrency.app"
    },
    "feesAndCommissionsSpecification": "Free to use",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free currency conversion tool"
    }
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbData(path: string, title: string) {
  const parts = path.split('/').filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://currencytocurrency.app"
    }
  ];
  
  let currentPath = '';
  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    const isLast = index === parts.length - 1;
    
    items.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": isLast ? title : part.charAt(0).toUpperCase() + part.slice(1),
      "item": `https://currencytocurrency.app${currentPath}`
    });
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Generate article structured data for blog posts
export function generateArticleStructuredData(post: BlogPostMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author || "Currency to Currency Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Currency to Currency",
      "logo": {
        "@type": "ImageObject",
        "url": "https://currencytocurrency.app/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://currencytocurrency.app/blog/${post.slug}`
    }
  };
}

// Website schema (add to root layout)
export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Currency to Currency",
  "alternateName": "CurrencytoCurrency.app",
  "url": "https://currencytocurrency.app",
  "description": "Free real-time currency converter with live exchange rates, historical charts, and rate alerts for 150+ currencies.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://currencytocurrency.app/convert/{search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Organization schema
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Currency to Currency",
  "url": "https://currencytocurrency.app",
  "logo": "https://currencytocurrency.app/logo.png",
  "description": "Providing real-time currency conversion and forex information",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "support@currencytocurrency.app"
  }
};

// Helper to normalize currency pair URLs
export function normalizePairUrl(from: string, to: string): string {
  return `/convert/${from.toLowerCase()}-to-${to.toLowerCase()}`;
}

// Get canonical URL - ALWAYS add trailing slash for consistency (except root)
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash first to normalize
  const cleanPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  // Add trailing slash back (except for root path)
  const finalPath = cleanPath === '' || cleanPath === '/' ? '/' : `${cleanPath}/`;
  return `https://currencytocurrency.app${finalPath}`;
}

export default {
  CURRENCY_NAMES,
  getCurrencyName,
  generateConversionTitle,
  generateConversionDescription,
  generateConversionKeywords,
  generateOGTitle,
  generateOGDescription,
  generateBlogMetadata,
  generateConverterStructuredData,
  generateBreadcrumbData,
  generateFAQStructuredData,
  generateArticleStructuredData,
  PAGE_METADATA,
  WEBSITE_SCHEMA,
  ORGANIZATION_SCHEMA,
  normalizePairUrl,
  getCanonicalUrl,
};
