import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CurrencyPairLinksProps {
  currentPair?: string;
  className?: string;
}

const CurrencyPairLinks = ({ currentPair, className = "" }: CurrencyPairLinksProps) => {
  const popularPairs = [
    // USD crosses
    { pair: 'usd-eur', title: 'USD to EUR', description: 'US Dollar to Euro' },
    { pair: 'usd-gbp', title: 'USD to GBP', description: 'US Dollar to British Pound' },
    { pair: 'usd-jpy', title: 'USD to JPY', description: 'US Dollar to Japanese Yen' },
    { pair: 'usd-cad', title: 'USD to CAD', description: 'US Dollar to Canadian Dollar' },
    { pair: 'usd-aud', title: 'USD to AUD', description: 'US Dollar to Australian Dollar' },
    { pair: 'usd-chf', title: 'USD to CHF', description: 'US Dollar to Swiss Franc' },
    { pair: 'usd-cny', title: 'USD to CNY', description: 'US Dollar to Chinese Yuan' },
    { pair: 'usd-inr', title: 'USD to INR', description: 'US Dollar to Indian Rupee' },
    { pair: 'usd-hkd', title: 'USD to HKD', description: 'US Dollar to Hong Kong Dollar' },
    { pair: 'usd-sgd', title: 'USD to SGD', description: 'US Dollar to Singapore Dollar' },
    { pair: 'usd-sek', title: 'USD to SEK', description: 'US Dollar to Swedish Krona' },
    { pair: 'usd-nok', title: 'USD to NOK', description: 'US Dollar to Norwegian Krone' },
    { pair: 'usd-mxn', title: 'USD to MXN', description: 'US Dollar to Mexican Peso' },
    { pair: 'usd-zar', title: 'USD to ZAR', description: 'US Dollar to South African Rand' },
    // EUR crosses
    { pair: 'eur-usd', title: 'EUR to USD', description: 'Euro to US Dollar' },
    { pair: 'eur-gbp', title: 'EUR to GBP', description: 'Euro to British Pound' },
    { pair: 'eur-jpy', title: 'EUR to JPY', description: 'Euro to Japanese Yen' },
    { pair: 'eur-cad', title: 'EUR to CAD', description: 'Euro to Canadian Dollar' },
    { pair: 'eur-aud', title: 'EUR to AUD', description: 'Euro to Australian Dollar' },
    { pair: 'eur-chf', title: 'EUR to CHF', description: 'Euro to Swiss Franc' },
    { pair: 'eur-cny', title: 'EUR to CNY', description: 'Euro to Chinese Yuan' },
    { pair: 'eur-inr', title: 'EUR to INR', description: 'Euro to Indian Rupee' },
    // GBP crosses
    { pair: 'gbp-usd', title: 'GBP to USD', description: 'British Pound to US Dollar' },
    { pair: 'gbp-eur', title: 'GBP to EUR', description: 'British Pound to Euro' },
    { pair: 'gbp-jpy', title: 'GBP to JPY', description: 'British Pound to Japanese Yen' },
    { pair: 'gbp-cad', title: 'GBP to CAD', description: 'British Pound to Canadian Dollar' },
    { pair: 'gbp-aud', title: 'GBP to AUD', description: 'British Pound to Australian Dollar' },
    // JPY crosses
    { pair: 'jpy-usd', title: 'JPY to USD', description: 'Japanese Yen to US Dollar' },
    { pair: 'jpy-eur', title: 'JPY to EUR', description: 'Japanese Yen to Euro' },
    { pair: 'jpy-gbp', title: 'JPY to GBP', description: 'Japanese Yen to British Pound' }
  ];

  // Filter out current pair and show related pairs
  const filteredPairs = popularPairs.filter(p => p.pair !== currentPair);
  const displayPairs = filteredPairs.slice(0, 24); // Show 24 related pairs

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