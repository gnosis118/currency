import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CurrencyPairLinksProps {
  currentPair?: string;
  className?: string;
}

const CurrencyPairLinks = ({ currentPair, className = "" }: CurrencyPairLinksProps) => {
  const popularPairs = [
    { pair: 'usd-to-eur', title: 'USD to EUR', description: 'US Dollar to Euro' },
    { pair: 'usd-to-gbp', title: 'USD to GBP', description: 'US Dollar to British Pound' },
    { pair: 'usd-to-jpy', title: 'USD to JPY', description: 'US Dollar to Japanese Yen' },
    { pair: 'eur-to-usd', title: 'EUR to USD', description: 'Euro to US Dollar' },
    { pair: 'eur-to-gbp', title: 'EUR to GBP', description: 'Euro to British Pound' },
    { pair: 'gbp-to-usd', title: 'GBP to USD', description: 'British Pound to US Dollar' },
    { pair: 'usd-to-cad', title: 'USD to CAD', description: 'US Dollar to Canadian Dollar' },
    { pair: 'usd-to-aud', title: 'USD to AUD', description: 'US Dollar to Australian Dollar' },
    { pair: 'jpy-to-usd', title: 'JPY to USD', description: 'Japanese Yen to US Dollar' },
    { pair: 'eur-to-jpy', title: 'EUR to JPY', description: 'Euro to Japanese Yen' },
    { pair: 'cad-to-usd', title: 'CAD to USD', description: 'Canadian Dollar to US Dollar' },
    { pair: 'aud-to-usd', title: 'AUD to USD', description: 'Australian Dollar to US Dollar' }
  ];

  // Filter out current pair and show related pairs
  const filteredPairs = popularPairs.filter(p => p.pair !== currentPair);
  const displayPairs = filteredPairs.slice(0, 8); // Show 8 related pairs

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Popular Currency Pairs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {displayPairs.map((pair) => (
            <Link
              key={pair.pair}
              to={`/convert/${pair.pair}`}
              className="group block p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {pair.title}
              </div>
              <div className="text-sm text-muted-foreground">
                {pair.description}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link 
            to="/charts" 
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View All Currency Charts →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyPairLinks;