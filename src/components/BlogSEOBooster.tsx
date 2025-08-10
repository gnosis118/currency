import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, TrendingUp, Clock } from 'lucide-react';

interface BlogSEOBoosterProps {
  currentSlug?: string;
  className?: string;
}

const BlogSEOBooster = ({ currentSlug, className = "" }: BlogSEOBoosterProps) => {
  const relatedPosts = [
    {
      slug: '2025-currency-predictions',
      title: '2025 Currency Predictions: Expert Forecasts & Market Analysis',
      description: 'Comprehensive analysis of currency market trends for 2025',
      readTime: '8 min',
      category: 'Market Analysis'
    },
    {
      slug: 'currency-exchange-fees-hidden-costs',
      title: 'Currency Exchange Fees: Hidden Costs You Need to Know in 2025',
      description: 'Expose hidden banking fees and learn how to save on currency conversion',
      readTime: '6 min',
      category: 'Money Tips'
    },
    {
      slug: 'bitcoin-to-usd-converter-live-price-analysis',
      title: 'Bitcoin to USD Converter: Live Price Analysis & Trading Insights',
      description: 'Real-time Bitcoin conversion with expert market analysis',
      readTime: '7 min',
      category: 'Cryptocurrency'
    },
    {
      slug: 'currency-conversion-safety-guide-2025',
      title: 'Currency Conversion Safety Guide 2025: Protect Your Money',
      description: 'Essential security tips for safe currency exchanges and travel money',
      readTime: '5 min',
      category: 'Security'
    },
    {
      slug: 'trump-2025-tariffs-currency-exchange-travel-money',
      title: 'Trump 2025 Tariffs: How They Impact Currency Exchange & Travel Money',
      description: 'Analysis of tariff impacts on currency rates and travel costs',
      readTime: '10 min',
      category: 'Politics & Economy'
    },
    {
      slug: 'digital-nomad-banking-crisis-2025',
      title: 'Digital Nomad Banking Crisis 2025: The Hidden $50 Billion Problem',
      description: 'How digital nomads are losing billions to banking fees',
      readTime: '12 min',
      category: 'Digital Nomads'
    }
  ];

  const currencyTools = [
    {
      href: '/convert',
      title: 'Currency Converter',
      description: 'Convert 150+ currencies with live rates'
    },
    {
      href: '/charts',
      title: 'Exchange Rate Charts',
      description: 'Historical trends and market analysis'
    },
    {
      href: '/alerts',
      title: 'Rate Alerts',
      description: 'Get notified of favorable exchange rates'
    },
    {
      href: '/travel',
      title: 'Travel Money Guide',
      description: 'Best practices for international travel'
    }
  ];

  // Filter out current post
  const filteredPosts = relatedPosts.filter(post => post.slug !== currentSlug);
  const displayPosts = filteredPosts.slice(0, 4);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Related Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Related Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currency Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Currency Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currencyTools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="group flex items-center gap-3 p-3 bg-card hover:bg-accent rounded-lg transition-colors border"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm group-hover:text-accent-foreground">
                    {tool.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tool.description}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Schema for Related Content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": displayPosts.map((post, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Article",
                "url": `https://currencytocurrency.app/blog/${post.slug}`,
                "name": post.title,
                "description": post.description
              }
            }))
          })
        }}
      />
    </div>
  );
};

export default BlogSEOBooster;