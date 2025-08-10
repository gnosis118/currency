import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import CurrencyPairLinks from '@/components/CurrencyPairLinks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExchangeRates {
  [key: string]: number;
}

const CurrencyPair = () => {
  const { pair } = useParams();
  const { toast } = useToast();
  
  const [fromCurrency, toCurrency] = pair?.split('-to-').map(c => c.toUpperCase()) || ['USD', 'EUR'];
  const [amount, setAmount] = useState('1');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchExchangeRates = async (baseCurrency: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      const data = await response.json();
      setExchangeRates(data.rates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Exchange rate fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates(fromCurrency);
  }, [fromCurrency]);

  const convertedAmount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !exchangeRates[toCurrency]) return '0.00';
    
    if (fromCurrency === toCurrency) return numAmount.toFixed(2);
    
    const rate = exchangeRates[toCurrency];
    return (numAmount * rate).toFixed(4);
  };

  const getExchangeRate = () => {
    if (!exchangeRates[toCurrency] || fromCurrency === toCurrency) return null;
    return exchangeRates[toCurrency].toFixed(6);
  };

  const currencyNames = {
    USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar', JPY: 'Japanese Yen', CHF: 'Swiss Franc', CNY: 'Chinese Yuan'
  };

  const getCurrencyName = (code: string) => currencyNames[code as keyof typeof currencyNames] || code;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": `${fromCurrency} to ${toCurrency} Currency Converter`,
    "description": `Convert ${getCurrencyName(fromCurrency)} to ${getCurrencyName(toCurrency)} with real-time exchange rates. Live currency conversion rates updated every few minutes.`,
    "provider": {
      "@type": "Organization",
      "name": "Currency to Currency"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <SEOHead
        title={`${fromCurrency} to ${toCurrency} Converter - Live Exchange Rate | Currency to Currency`}
        description={`Convert ${getCurrencyName(fromCurrency)} to ${getCurrencyName(toCurrency)} with real-time exchange rates. Live currency conversion rates updated every few minutes for accurate results.`}
        keywords={`${fromCurrency} to ${toCurrency}, ${fromCurrency}${toCurrency}, ${getCurrencyName(fromCurrency)} to ${getCurrencyName(toCurrency)}, currency converter, exchange rate, live rates`}
        canonical={`https://currencytocurrency.app/convert/${pair?.toLowerCase()}`}
        structuredData={structuredData}
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {fromCurrency} to {toCurrency} Converter
          </h1>
          <p className="text-muted-foreground text-lg">
            Convert {getCurrencyName(fromCurrency)} to {getCurrencyName(toCurrency)} with real-time exchange rates
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Live exchange rates • Updated every few minutes • Free currency conversion</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{fromCurrency} to {toCurrency}</span>
                <Button variant="ghost" size="sm" onClick={() => fetchExchangeRates(fromCurrency)} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Amount in {fromCurrency}
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg"
                />
              </div>

              <div className="bg-price-bg p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {loading ? (
                    <div className="animate-pulse bg-muted h-10 w-48 rounded mx-auto" />
                  ) : (
                    `${convertedAmount()} ${toCurrency}`
                  )}
                </div>
                
                {!loading && getExchangeRate() && (
                  <div className="text-lg text-muted-foreground">
                    1 {fromCurrency} = {getExchangeRate()} {toCurrency}
                  </div>
                )}
                
                {lastUpdated && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{fromCurrency}</div>
                  <div className="text-sm text-muted-foreground">{getCurrencyName(fromCurrency)}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{toCurrency}</div>
                  <div className="text-sm text-muted-foreground">{getCurrencyName(toCurrency)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About {fromCurrency} to {toCurrency} Exchange Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The {fromCurrency} to {toCurrency} exchange rate shows how much one {getCurrencyName(fromCurrency)} 
                is worth in {getCurrencyName(toCurrency)}. Exchange rates fluctuate constantly due to various 
                economic factors including interest rates, inflation, political stability, and market sentiment.
              </p>
              <p>
                Our converter uses real-time data from reliable financial sources to provide you with the most 
                accurate rates available. For actual transactions, banks and money exchange services may apply 
                fees and spreads that differ from the interbank rates shown here.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Best Time to Exchange</h3>
                  <p className="text-sm">Monitor rates regularly and consider setting up price alerts for favorable exchange rates.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Historical Data</h3>
                  <p className="text-sm">View our Charts page to analyze historical trends and make informed decisions.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <CurrencyPairLinks currentPair={pair} />
        </div>
      </div>
    </div>
  );
};

export default CurrencyPair;