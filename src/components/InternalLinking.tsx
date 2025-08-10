import { Link } from 'react-router-dom';

interface InternalLinkingProps {
  currentPage: string;
  className?: string;
}

const InternalLinking = ({ currentPage, className = "" }: InternalLinkingProps) => {
  const getRelevantLinks = (page: string) => {
    const baseLinks = [
      { href: '/charts', text: 'Historical Rate Charts', description: 'View exchange rate trends' },
      { href: '/alerts', text: 'Price Alerts', description: 'Set custom rate notifications' },
      { href: '/travel', text: 'Travel Money Guide', description: 'Currency tips for travelers' },
      { href: '/faq', text: 'Currency Converter FAQ', description: 'Common questions answered' }
    ];

    const currencyPairLinks = [
      { href: '/usd-to-eur', text: 'USD to EUR', description: 'US Dollar to Euro conversion' },
      { href: '/usd-to-gbp', text: 'USD to GBP', description: 'US Dollar to British Pound' },
      { href: '/usd-to-jpy', text: 'USD to JPY', description: 'US Dollar to Japanese Yen' },
      { href: '/eur-to-gbp', text: 'EUR to GBP', description: 'Euro to British Pound' },
      { href: '/gbp-to-usd', text: 'GBP to USD', description: 'British Pound to US Dollar' }
    ];

    switch (page) {
      case 'home':
        return [...currencyPairLinks.slice(0, 3), ...baseLinks.slice(0, 2)];
      case 'charts':
        return [...currencyPairLinks.slice(0, 4), { href: '/alerts', text: 'Set Price Alerts', description: 'Get notified of rate changes' }];
      case 'alerts':
        return [...currencyPairLinks.slice(0, 3), { href: '/charts', text: 'View Rate Charts', description: 'Analyze historical trends' }];
      case 'travel':
        return [
          ...currencyPairLinks.slice(0, 3),
          { href: '/charts', text: 'Rate Trends', description: 'Best time to exchange' },
          { href: '/alerts', text: 'Travel Alerts', description: 'Monitor rates before trips' }
        ];
      case 'faq':
        return [...baseLinks.slice(0, 3), ...currencyPairLinks.slice(0, 2)];
      case 'currency-pair':
        return [
          { href: '/charts', text: 'Historical Charts', description: 'View rate history' },
          { href: '/alerts', text: 'Set Rate Alert', description: 'Monitor this pair' },
          ...currencyPairLinks.slice(0, 3)
        ];
      default:
        return [...baseLinks.slice(0, 2), ...currencyPairLinks.slice(0, 3)];
    }
  };

  const links = getRelevantLinks(currentPage);

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">Related Tools & Rates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className="block p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors group"
          >
            <div className="font-medium text-foreground group-hover:text-primary transition-colors">
              {link.text}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {link.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InternalLinking;