import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CurrencyPair {
  from: string;
  to: string;
  rate: number;
  change: number;
  symbol: string;
  description: string;
}

const popularPairs: CurrencyPair[] = [
  { from: 'USD', to: 'EUR', rate: 0.9234, change: 0.15, symbol: '€', description: 'US Dollar to Euro - Most traded currency pair globally' },
  { from: 'GBP', to: 'USD', rate: 1.2567, change: -0.23, symbol: '$', description: 'British Pound to US Dollar - Major reserve currencies' },
  { from: 'USD', to: 'JPY', rate: 149.85, change: 0.45, symbol: '¥', description: 'US Dollar to Japanese Yen - Asian market benchmark' },
  { from: 'EUR', to: 'GBP', rate: 0.8654, change: -0.12, symbol: '£', description: 'Euro to British Pound - European trading pair' },
  { from: 'USD', to: 'CAD', rate: 1.3598, change: 0.08, symbol: 'C$', description: 'US Dollar to Canadian Dollar - North American pair' },
  { from: 'AUD', to: 'USD', rate: 0.6543, change: 0.34, symbol: '$', description: 'Australian Dollar to US Dollar - Commodity currency' }
];

const PopularPairs = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Live Exchange Rates - Popular Currency Pairs</CardTitle>
        <p className="text-muted-foreground">
          Track the most traded currency pairs with real-time rates and 24-hour changes. 
          Perfect for forex trading, international business, and travel planning.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popularPairs.map((pair, index) => (
            <a 
              key={index}
              href={`/convert/${pair.from.toLowerCase()}-to-${pair.to.toLowerCase()}`}
              className="block p-4 border rounded-lg hover:border-primary transition-colors hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-lg">{pair.from}/{pair.to}</span>
                  <div className="flex items-center space-x-1">
                    {pair.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${pair.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">
                {pair.symbol}{pair.rate.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                {pair.description}
              </p>
            </a>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Why These Currency Pairs Matter</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>USD/EUR:</strong> Represents 23% of global forex trading volume</li>
            <li>• <strong>GBP/USD:</strong> Known as "Cable" - highly liquid and volatile</li>
            <li>• <strong>USD/JPY:</strong> Safe haven pair during market uncertainty</li>
            <li>• <strong>EUR/GBP:</strong> Key European economic indicator</li>
            <li>• <strong>USD/CAD:</strong> Influenced by oil prices and commodity markets</li>
            <li>• <strong>AUD/USD:</strong> Commodity currency sensitive to raw material prices</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularPairs;