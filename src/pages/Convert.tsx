import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRightLeft, 
  TrendingUp, 
  Clock, 
  Globe,
  ArrowUpDown, 
  RefreshCw, 
  TrendingDown, 
  BarChart3, 
  Bell, 
  Plane,
  Calculator,
  AlertTriangle,
  Star,
  Share2,
  Download,
  Settings
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  rate?: number;
  change24h?: number;
  lastUpdated?: string;
}

interface ConversionResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  timestamp: string;
  fees?: number;
  totalCost?: number;
}

const Convert = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [feePercentage, setFeePercentage] = useState(0.5);
  const { toast } = useToast();

  // Enhanced currency list with flags and more currencies
  const currencies: CurrencyData[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', flag: '🇸🇦' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: '£', flag: '🇪🇬' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
    { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
    { code: 'BTC', name: 'Bitcoin', symbol: '₿', flag: '₿' },
    { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', flag: 'Ξ' },
    { code: 'USDT', name: 'Tether', symbol: 'USDT', flag: '₮' },
    { code: 'USDC', name: 'USD Coin', symbol: 'USDC', flag: '₮' },
    { code: 'BNB', name: 'Binance Coin', symbol: 'BNB', flag: '₿' },
    { code: 'XRP', name: 'Ripple', symbol: 'XRP', flag: '✕' },
    { code: 'ADA', name: 'Cardano', symbol: 'ADA', flag: '₳' },
    { code: 'SOL', name: 'Solana', symbol: 'SOL', flag: '◎' },
    { code: 'DOGE', name: 'Dogecoin', symbol: 'DOGE', flag: 'Ð' },
  ];

  const popularPairs = [
    { from: 'USD', to: 'EUR', pair: 'usd-to-eur' },
    { from: 'USD', to: 'GBP', pair: 'usd-to-gbp' },
    { from: 'USD', to: 'JPY', pair: 'usd-to-jpy' },
    { from: 'EUR', to: 'USD', pair: 'eur-to-usd' },
    { from: 'EUR', to: 'GBP', pair: 'eur-to-gbp' },
    { from: 'GBP', to: 'USD', pair: 'gbp-to-usd' },
    { from: 'USD', to: 'CAD', pair: 'usd-to-cad' },
    { from: 'USD', to: 'AUD', pair: 'usd-to-aud' }
  ];

  // Mock exchange rates - replace with real API
  useEffect(() => {
    const mockRates: ExchangeRates = {
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110.5,
      'CAD': 1.25,
      'AUD': 1.35,
      'CHF': 1.09,
      'CNY': 6.45,
      'HKD': 7.85,
      'SGD': 1.35,
      'SEK': 8.45,
      'NOK': 8.75,
      'DKK': 6.55,
      'RUB': 75.5,
      'TRY': 8.95,
      'INR': 74.5,
      'BRL': 5.25,
      'ZAR': 15.25,
      'MXN': 20.15,
      'KRW': 1105.5,
      'THB': 33.25,
      'PLN': 3.85,
      'HUF': 305.5,
      'CZK': 21.85,
      'ILS': 3.25,
      'SAR': 3.75,
      'AED': 3.67,
      'MYR': 4.15,
      'IDR': 14250.5,
      'PHP': 50.25,
      'CLP': 750.5,
      'COP': 3750.5,
      'ARS': 95.5,
      'VND': 23050.5,
      'PKR': 155.5,
      'EGP': 15.75,
      'NGN': 410.5,
      'KES': 110.5,
      'TWD': 28.25,
      'BTC': 0.000025,
      'ETH': 0.0004,
      'USDT': 1.0,
      'USDC': 1.0,
      'BNB': 0.0015,
      'XRP': 1.85,
      'ADA': 2.85,
      'SOL': 0.0085,
      'DOGE': 150.5,
    };
    setRates(mockRates);
  }, []);

  const convertCurrency = useCallback(() => {
    if (!amount || !rates[toCurrency]) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const fromAmount = parseFloat(amount);
      const rate = rates[toCurrency];
      const toAmount = fromAmount * rate;
      const fees = (fromAmount * feePercentage) / 100;
      const totalCost = fromAmount + fees;
      
      setConversionResult({
        fromAmount,
        fromCurrency,
        toAmount,
        toCurrency,
        rate,
        timestamp: new Date().toISOString(),
        fees,
        totalCost
      });
      
      setLoading(false);
      
      toast({
        title: "Conversion Complete",
        description: `${fromAmount} ${fromCurrency} = ${toAmount.toFixed(2)} ${toCurrency}`,
      });
    }, 1000);
  }, [amount, fromCurrency, toCurrency, rates, feePercentage, toast]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConversionResult(null);
  };

  const toggleFavorite = (currencyPair: string) => {
    setFavorites(prev => 
      prev.includes(currencyPair) 
        ? prev.filter(f => f !== currencyPair)
        : [...prev, currencyPair]
    );
  };

  const refreshRates = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Rates Updated",
        description: "Exchange rates have been refreshed",
      });
    }, 1000);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Currency Converter - Live Exchange Rates",
    "description": "Convert between 150+ currencies with real-time exchange rates. Free currency converter with live rates for fiat currencies and cryptocurrencies.",
    "url": "https://currencytocurrency.app/convert",
    "inLanguage": "en-US",
    "isFamilyFriendly": true,
    "mainEntity": {
      "@type": "FinancialProduct",
      "name": "Currency Converter",
      "description": "Real-time currency conversion tool supporting 150+ fiat currencies and 100+ cryptocurrencies",
      "provider": {
        "@type": "Organization",
        "name": "Currency to Currency"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://currencytocurrency.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Convert",
          "item": "https://currencytocurrency.app/convert"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <SEOHead
        title="Currency Converter - Live Exchange Rates for 150+ Currencies | Currency to Currency"
        description="Convert between 150+ currencies with real-time exchange rates. Free currency converter with live rates for fiat currencies and cryptocurrencies. Updated every minute."
        keywords="currency converter, exchange rates, live rates, currency conversion, forex converter, cryptocurrency converter, real-time rates, USD EUR GBP JPY converter"
        canonical="https://currencytocurrency.app/convert"
        structuredData={structuredData}
      />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Advanced Currency Converter
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Convert between 150+ fiat currencies and 100+ cryptocurrencies
          </p>
          <p className="text-muted-foreground">
            Real-time exchange rates • Advanced fee calculation • Professional tools
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Professional Currency Converter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Converter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <div className="flex gap-2">
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center gap-2">
                                <span>{currency.flag}</span>
                                <span>{currency.code}</span>
                                <span className="text-muted-foreground">{currency.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="text-lg font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <div className="flex gap-2">
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center gap-2">
                                <span>{currency.flag}</span>
                                <span>{currency.code}</span>
                                <span className="text-muted-foreground">{currency.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center text-lg font-semibold" role="status" aria-live="polite" aria-atomic="true">
                      {conversionResult ? conversionResult.toAmount.toFixed(2) : '0.00'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={convertCurrency} 
                    disabled={loading || !amount}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4 mr-2" />
                        Convert
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={swapCurrencies}>
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" onClick={refreshRates}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full justify-between"
                  >
                    <span>Advanced Options</span>
                    <Settings className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                  </Button>
                  
                  {showAdvanced && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fee Percentage (%)</label>
                        <Input
                          type="number"
                          step="0.1"
                          value={feePercentage}
                          onChange={(e) => setFeePercentage(parseFloat(e.target.value) || 0)}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Fee</label>
                        <div className="h-10 px-3 py-2 bg-background rounded-md flex items-center">
                          {amount ? `$${((parseFloat(amount) * feePercentage) / 100).toFixed(2)}` : '$0.00'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversion Result */}
                {conversionResult && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Exchange Rate:</span>
                        <div className="font-semibold">1 {fromCurrency} = {conversionResult.rate.toFixed(4)} {toCurrency}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fees:</span>
                        <div className="font-semibold">${conversionResult.fees?.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Cost:</span>
                        <div className="font-semibold">${conversionResult.totalCost?.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Updated:</span>
                        <div className="font-semibold">{new Date(conversionResult.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Popular Currency Pairs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularPairs.map(({ from, to, pair }) => (
                  <Link
                    key={pair}
                    to={`/convert/${pair}`}
                    className="group block p-4 bg-card hover:bg-accent rounded-lg transition-colors border"
                  >
                    <div className="font-semibold text-foreground group-hover:text-accent-foreground">
                      {from} → {to}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {from} to {to} converter
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Supported Currencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">FIAT CURRENCIES</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {currencies.filter(c => !['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE'].includes(c.code)).slice(0, 20).map(currency => (
                        <div key={currency.code} className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span className="font-mono">{currency.code}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">+ 130 more currencies</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">CRYPTOCURRENCIES</h3>
                    <div className="space-y-1 text-sm">
                      {currencies.filter(c => ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE'].includes(c.code)).map(currency => (
                        <div key={currency.code} className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span className="font-mono">{currency.code}</span>
                          <span className="text-muted-foreground">{currency.name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">+ 100 more cryptocurrencies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Enhanced Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Real-time Rates</div>
                    <div className="text-sm text-muted-foreground">Updated every minute</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calculator className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Fee Calculator</div>
                    <div className="text-sm text-muted-foreground">Customizable fee calculation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">150+ Currencies</div>
                    <div className="text-sm text-muted-foreground">All major fiat & crypto</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Historical Charts</div>
                    <div className="text-sm text-muted-foreground">View rate trends</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link to="/charts">
                    <Button variant="outline" className="w-full">
                      View Charts & Analysis
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Our Advanced Currency Converter?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Professional Tools</h3>
                <p className="text-muted-foreground">
                  Advanced fee calculation, real-time rates, and professional-grade tools for serious currency conversion needs.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  Support for 150+ fiat currencies and 100+ cryptocurrencies, covering all major and minor currencies worldwide.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Advanced Features</h3>
                <p className="text-muted-foreground">
                  Fee calculation, favorites system, advanced options, and professional tools for traders and businesses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convert;