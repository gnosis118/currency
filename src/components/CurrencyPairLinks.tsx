import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CurrencyPairLinksProps {
  currentPair?: string;
  className?: string;
}

const CurrencyPairLinks = ({ currentPair, className = "" }: CurrencyPairLinksProps) => {
  const popularPairs = [
    { pair: 'usd-eur', title: 'USD to EUR', description: 'US Dollar to Euro' },
    { pair: 'usd-gbp', title: 'USD to GBP', description: 'US Dollar to British Pound' },
    { pair: 'usd-jpy', title: 'USD to JPY', description: 'US Dollar to Japanese Yen' },
    { pair: 'eur-usd', title: 'EUR to USD', description: 'Euro to US Dollar' },
    { pair: 'eur-gbp', title: 'EUR to GBP', description: 'Euro to British Pound' },
    { pair: 'gbp-usd', title: 'GBP to USD', description: 'British Pound to US Dollar' },
    { pair: 'usd-cad', title: 'USD to CAD', description: 'US Dollar to Canadian Dollar' },
    { pair: 'usd-aud', title: 'USD to AUD', description: 'US Dollar to Australian Dollar' },
    { pair: 'jpy-usd', title: 'JPY to USD', description: 'Japanese Yen to US Dollar' },
    { pair: 'eur-jpy', title: 'EUR to JPY', description: 'Euro to Japanese Yen' },
    { pair: 'cad-usd', title: 'CAD to USD', description: 'Canadian Dollar to US Dollar' },
    { pair: 'aud-usd', title: 'AUD to USD', description: 'Australian Dollar to US Dollar' },
    { pair: 'usd-chf', title: 'USD to CHF', description: 'US Dollar to Swiss Franc' },
    { pair: 'gbp-eur', title: 'GBP to EUR', description: 'British Pound to Euro' },
    { pair: 'gbp-jpy', title: 'GBP to JPY', description: 'British Pound to Japanese Yen' },
    { pair: 'aud-eur', title: 'AUD to EUR', description: 'Australian Dollar to Euro' },
    { pair: 'cad-eur', title: 'CAD to EUR', description: 'Canadian Dollar to Euro' },
    { pair: 'chf-usd', title: 'CHF to USD', description: 'Swiss Franc to US Dollar' },
    { pair: 'chf-eur', title: 'CHF to EUR', description: 'Swiss Franc to Euro' },
    { pair: 'jpy-eur', title: 'JPY to EUR', description: 'Japanese Yen to Euro' }
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
              to={`/convert/${pair.pair.replace('-', '-to-')}`}
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