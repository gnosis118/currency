import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpDown, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Bell, 
  Plane,
  Globe,
  Clock,
  Calculator,
  AlertTriangle,
  Star,
  Share2,
  Download,
  Settings
} from 'lucide-react';
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

const EnhancedCurrencyConverter = () => {
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

  // Popular currency pairs
  const popularPairs = [
    { from: 'USD', to: 'EUR', name: 'USD to EUR' },
    { from: 'USD', to: 'GBP', name: 'USD to GBP' },
    { from: 'EUR', to: 'USD', name: 'EUR to USD' },
    { from: 'GBP', to: 'USD', name: 'GBP to USD' },
    { from: 'USD', to: 'JPY', name: 'USD to JPY' },
    { from: 'USD', to: 'CAD', name: 'USD to CAD' },
    { from: 'USD', to: 'AUD', name: 'USD to AUD' },
    { from: 'USD', to: 'CHF', name: 'USD to CHF' },
  ];

  // Fetch exchange rates
  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      // Import the exchange rates service
      const { getLatestRates } = await import('@/services/exchangeRatesService');
      
      // Fetch live rates from OpenExchangeRates API
      const liveRates = await getLatestRates(fromCurrency);
      
      setRates(liveRates);
      
      // Calculate conversion
      if (amount && liveRates[toCurrency]) {
        const rate = liveRates[toCurrency];
        const fromAmount = parseFloat(amount);
        const toAmount = fromAmount * rate;
        const fees = (fromAmount * feePercentage) / 100;
        
        setConversionResult({
          fromAmount,
          fromCurrency,
          toAmount,
          toCurrency,
          rate,
          timestamp: new Date().toISOString(),
          fees,
          totalCost: fromAmount + fees
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates. Please try again.",
        variant: "destructive",
      });
      console.error('Exchange rate fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency, feePercentage, toast]);

  // Handle currency swap
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Handle amount change
  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value && rates[toCurrency]) {
      const rate = rates[toCurrency];
      const fromAmount = parseFloat(value);
      const toAmount = fromAmount * rate;
      const fees = (fromAmount * feePercentage) / 100;
      
      setConversionResult({
        fromAmount,
        fromCurrency,
        toAmount,
        toCurrency,
        rate,
        timestamp: new Date().toISOString(),
        fees,
        totalCost: fromAmount + fees
      });
    }
  };

  // Add/remove from favorites
  const toggleFavorite = (pair: string) => {
    setFavorites(prev => 
      prev.includes(pair) 
        ? prev.filter(f => f !== pair)
        : [...prev, pair]
    );
  };

  // Quick conversion for popular pairs
  const quickConvert = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
    fetchRates();
  };

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return (
    <div className="space-y-6">
      {/* Main Converter */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Advanced Currency Converter
            </span>
            <Button variant="ghost" size="sm" onClick={fetchRates} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conversion Inputs */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">From</label>
              <div className="flex gap-2">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                          <span className="text-muted-foreground">({currency.name})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="text-lg font-semibold"
              />
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">To</label>
              <div className="flex gap-2">
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                          <span className="text-muted-foreground">({currency.name})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-lg font-semibold p-3 border rounded-md bg-muted">
                {conversionResult ? conversionResult.toAmount.toFixed(2) : '0.00'}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={handleSwap}>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Swap Currencies
            </Button>
          </div>

          {/* Conversion Details */}
          {conversionResult && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Exchange Rate:</span>
                <span className="font-semibold">
                  1 {fromCurrency} = {conversionResult.rate.toFixed(4)} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fees ({feePercentage}%):</span>
                <span className="font-semibold text-red-600">
                  {conversionResult.fees?.toFixed(2)} {fromCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Cost:</span>
                <span className="font-semibold text-green-600">
                  {conversionResult.totalCost?.toFixed(2)} {fromCurrency}
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Last updated: {new Date(conversionResult.timestamp).toLocaleString()}
              </div>
            </div>
          )}

          {/* Advanced Options */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>
            
            {showAdvanced && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fee Percentage (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={feePercentage}
                    onChange={(e) => setFeePercentage(parseFloat(e.target.value) || 0)}
                    className="w-32"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Charts
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Set Alert
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Pairs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Popular Currency Pairs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4">
            {popularPairs.map((pair) => (
              <Button
                key={`${pair.from}-${pair.to}`}
                variant="outline"
                size="sm"
                onClick={() => quickConvert(pair.from, pair.to)}
                className="justify-between"
              >
                <span>{pair.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(`${pair.from}-${pair.to}`);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Star className={`h-4 w-4 ${favorites.includes(`${pair.from}-${pair.to}`) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold">Historical Charts</h3>
            <p className="text-sm text-muted-foreground">View rate trends over time</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Bell className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold">Rate Alerts</h3>
            <p className="text-sm text-muted-foreground">Get notified of rate changes</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Calculator className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold">Travel Calculator</h3>
            <p className="text-sm text-muted-foreground">Plan your travel budget</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedCurrencyConverter;
