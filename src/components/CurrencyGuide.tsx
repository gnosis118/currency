import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CurrencyGuide = () => {
  const majorCurrencies = [
    { code: 'USD', name: 'US Dollar', description: 'World\'s primary reserve currency, used in international trade', volume: '87%' },
    { code: 'EUR', name: 'Euro', description: 'Second most traded currency, official currency of 19 EU countries', volume: '33%' },
    { code: 'JPY', name: 'Japanese Yen', description: 'Safe haven currency, third most traded globally', volume: '23%' },
    { code: 'GBP', name: 'British Pound', description: 'One of the oldest currencies still in use, highly volatile', volume: '12%' },
    { code: 'CHF', name: 'Swiss Franc', description: 'Traditional safe haven, backed by political stability', volume: '6%' },
    { code: 'CAD', name: 'Canadian Dollar', description: 'Commodity currency influenced by oil and natural resources', volume: '5%' }
  ];

  const cryptoCurrencies = [
    { symbol: 'BTC', name: 'Bitcoin', description: 'First and largest cryptocurrency by market cap', volatility: 'High' },
    { symbol: 'ETH', name: 'Ethereum', description: 'Smart contract platform and second-largest crypto', volatility: 'High' },
    { symbol: 'USDT', name: 'Tether', description: 'Stablecoin pegged to US Dollar', volatility: 'Low' },
    { symbol: 'BNB', name: 'Binance Coin', description: 'Exchange token with utility in DeFi ecosystem', volatility: 'Medium' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Currency Guide</CardTitle>
        <p className="text-muted-foreground">
          Learn about major currencies, their characteristics, and what affects their exchange rates.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fiat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fiat">Fiat Currencies</TabsTrigger>
            <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fiat" className="space-y-4">
            <div className="grid gap-4">
              {majorCurrencies.map((currency, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="font-bold">
                        {currency.code}
                      </Badge>
                      <h3 className="font-semibold">{currency.name}</h3>
                    </div>
                    <Badge variant="secondary">
                      {currency.volume} trading volume
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currency.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Factors Affecting Exchange Rates</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Interest Rates:</strong> Higher rates attract foreign investment</li>
                <li>• <strong>Economic Growth:</strong> Strong GDP growth strengthens currency</li>
                <li>• <strong>Political Stability:</strong> Uncertainty weakens currency value</li>
                <li>• <strong>Trade Balance:</strong> Export surplus strengthens currency</li>
                <li>• <strong>Central Bank Policy:</strong> Monetary policy affects currency strength</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="crypto" className="space-y-4">
            <div className="grid gap-4">
              {cryptoCurrencies.map((crypto, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="font-bold">
                        {crypto.symbol}
                      </Badge>
                      <h3 className="font-semibold">{crypto.name}</h3>
                    </div>
                    <Badge variant={crypto.volatility === 'High' ? 'destructive' : crypto.volatility === 'Medium' ? 'default' : 'secondary'}>
                      {crypto.volatility} volatility
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {crypto.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Cryptocurrency Price Factors</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Market Sentiment:</strong> News and social media influence prices</li>
                <li>• <strong>Adoption:</strong> Real-world usage drives long-term value</li>
                <li>• <strong>Regulation:</strong> Government policies affect market confidence</li>
                <li>• <strong>Technology:</strong> Updates and improvements impact value</li>
                <li>• <strong>Supply & Demand:</strong> Scarcity and trading volume matter</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CurrencyGuide;