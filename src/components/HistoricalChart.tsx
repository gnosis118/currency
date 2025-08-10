import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, ArrowUpDown } from 'lucide-react';

interface HistoricalDataPoint {
  date: string;
  rate: number;
  timestamp: number;
}

const fiatCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'CNY', name: 'Chinese Yuan Renminbi', symbol: '¥' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
];

interface HistoricalChartProps {
  fromCurrency: string;
  toCurrency: string;
  currentRate: number;
}

const HistoricalChart = ({ fromCurrency: initialFromCurrency, toCurrency: initialToCurrency, currentRate: initialCurrentRate }: HistoricalChartProps) => {
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);
  const [currentRate, setCurrentRate] = useState(initialCurrentRate);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [changePercent, setChangePercent] = useState(0);

  // Generate mock historical data (in production, this would be from a real API)
  const generateHistoricalData = (days: number) => {
    const data: HistoricalDataPoint[] = [];
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Start with a base rate close to current rate
    let baseRate = currentRate * (0.95 + Math.random() * 0.1);
    
    for (let i = days; i >= 0; i--) {
      const timestamp = now - (i * oneDayMs);
      const date = new Date(timestamp);
      
      // Add some realistic volatility
      const volatility = 0.02; // 2% daily volatility
      const change = (Math.random() - 0.5) * volatility;
      baseRate = baseRate * (1 + change);
      
      data.push({
        date: date.toISOString().split('T')[0],
        rate: Number(baseRate.toFixed(6)),
        timestamp
      });
    }
    
    return data;
  };

  // Fetch current exchange rate when currencies change
  const fetchCurrentRate = async (from: string, to: string) => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      const data = await response.json();
      setCurrentRate(data.rates[to] || 1);
    } catch (error) {
      console.error('Exchange rate fetch error:', error);
      setCurrentRate(1);
    }
  };

  const swapCurrencies = () => {
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    setFromCurrency(newFrom);
    setToCurrency(newTo);
    fetchCurrentRate(newFrom, newTo);
  };

  useEffect(() => {
    if (fromCurrency !== toCurrency) {
      fetchCurrentRate(fromCurrency, toCurrency);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const historicalData = generateHistoricalData(days);
      setData(historicalData);
      
      // Calculate trend
      if (historicalData.length >= 2) {
        const firstRate = historicalData[0].rate;
        const lastRate = historicalData[historicalData.length - 1].rate;
        const change = ((lastRate - firstRate) / firstRate) * 100;
        
        setChangePercent(change);
        
        if (change > 0.1) setTrend('up');
        else if (change < -0.1) setTrend('down');
        else setTrend('neutral');
      }
      
      setLoading(false);
    }, 800);
  }, [timeframe, fromCurrency, toCurrency, currentRate]);

  const formatTooltipValue = (value: number) => {
    return `1 ${fromCurrency} = ${value.toFixed(6)} ${toCurrency}`;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {fromCurrency}/{toCurrency} Historical Rates
            </CardTitle>
            <CardDescription>
              Exchange rate trends over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </Badge>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-2 gap-2 items-end mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">From Currency</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {fiatCurrencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-sm">{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={swapCurrencies}
            className="mb-1"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">To Currency</label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {fiatCurrencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-sm">{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={timeframe === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeframe === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeframe === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('90d')}
          >
            90 Days
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    });
                  }}
                />
                <YAxis 
                  domain={['dataMin - dataMin * 0.001', 'dataMax + dataMax * 0.001']}
                  tickFormatter={(value) => value.toFixed(4)}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [formatTooltipValue(value), 'Exchange Rate']}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke={getTrendColor()} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: getTrendColor() }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Current rate: 1 {fromCurrency} = {currentRate.toFixed(6)} {toCurrency}
          </p>
          <p className="mt-1">
            Historical data shows {timeframe} trend with {Math.abs(changePercent).toFixed(2)}% {trend === 'up' ? 'gain' : trend === 'down' ? 'loss' : 'change'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;