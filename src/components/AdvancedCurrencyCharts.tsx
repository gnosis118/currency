import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Share2,
  Settings,
  Eye,
  EyeOff,
  Minus,
  Plus,
  Bell
} from 'lucide-react';

interface ChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface CurrencyPair {
  from: string;
  to: string;
  name: string;
  currentRate: number;
  change24h: number;
  changePercent: number;
}

const AdvancedCurrencyCharts = () => {
  const [selectedPair, setSelectedPair] = useState('USD-EUR');
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Popular currency pairs with real-time data
  const currencyPairs: CurrencyPair[] = [
    { from: 'USD', to: 'EUR', name: 'USD/EUR', currentRate: 0.85, change24h: -0.002, changePercent: -0.24 },
    { from: 'USD', to: 'GBP', name: 'USD/GBP', currentRate: 0.73, change24h: 0.001, changePercent: 0.14 },
    { from: 'EUR', to: 'USD', name: 'EUR/USD', currentRate: 1.18, change24h: 0.002, changePercent: 0.24 },
    { from: 'EUR', to: 'GBP', name: 'EUR/GBP', currentRate: 0.86, change24h: 0.003, changePercent: 0.35 },
    { from: 'GBP', to: 'USD', name: 'GBP/USD', currentRate: 1.37, change24h: -0.001, changePercent: -0.07 },
    { from: 'USD', to: 'JPY', name: 'USD/JPY', currentRate: 110.5, change24h: -0.3, changePercent: -0.27 },
    { from: 'USD', to: 'CAD', name: 'USD/CAD', currentRate: 1.25, change24h: 0.01, changePercent: 0.80 },
    { from: 'USD', to: 'AUD', name: 'USD/AUD', currentRate: 1.35, change24h: -0.02, changePercent: -1.46 },
  ];

  // Timeframe options
  const timeframes = [
    { value: '1H', label: '1 Hour' },
    { value: '4H', label: '4 Hours' },
    { value: '1D', label: '1 Day' },
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
  ];

  // Chart type options
  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick' },
    { value: 'line', label: 'Line' },
    { value: 'area', label: 'Area' },
    { value: 'bar', label: 'Bar' },
  ];

  // Mock chart data - replace with real API data
  const generateMockData = (timeframe: string): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    let interval = 1; // hours
    
    switch (timeframe) {
      case '1H':
        interval = 1;
        break;
      case '4H':
        interval = 4;
        break;
      case '1D':
        interval = 24;
        break;
      case '1W':
        interval = 24 * 7;
        break;
      case '1M':
        interval = 24 * 30;
        break;
      case '3M':
        interval = 24 * 90;
        break;
      case '6M':
        interval = 24 * 180;
        break;
      case '1Y':
        interval = 24 * 365;
        break;
    }

    const baseRate = 0.85; // USD/EUR base rate
    for (let i = 0; i < 100; i++) {
      const date = new Date(now.getTime() - (100 - i) * interval * 60 * 60 * 1000);
      const volatility = 0.005;
      const randomChange = (Math.random() - 0.5) * volatility;
      const rate = baseRate + randomChange;
      
      data.push({
        date: date.toISOString(),
        open: rate,
        high: rate + Math.random() * 0.002,
        low: rate - Math.random() * 0.002,
        close: rate + (Math.random() - 0.5) * 0.001,
        volume: Math.random() * 1000000 + 500000
      });
    }
    
    return data;
  };

  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    setChartData(generateMockData(timeframe));
  }, [timeframe]);

  const selectedPairData = currencyPairs.find(pair => pair.name === selectedPair);

  const handleExport = () => {
    // Export chart data functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Open,High,Low,Close,Volume\n" +
      chartData.map(row => 
        `${row.date},${row.open},${row.high},${row.low},${row.close},${row.volume}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedPair}_${timeframe}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: `${selectedPair} Chart`,
        text: `Check out the ${selectedPair} exchange rate chart on Currency to Currency`,
        url: window.location.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Advanced Currency Charts
              </CardTitle>
              <div className="flex items-center gap-4">
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyPairs.map((pair) => (
                      <SelectItem key={pair.name} value={pair.name}>
                        {pair.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedPairData && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{selectedPairData.currentRate.toFixed(4)}</span>
                    <Badge variant={selectedPairData.change24h >= 0 ? "default" : "destructive"}>
                      {selectedPairData.change24h >= 0 ? '+' : ''}{selectedPairData.change24h.toFixed(4)} 
                      ({selectedPairData.changePercent >= 0 ? '+' : ''}{selectedPairData.changePercent.toFixed(2)}%)
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chart Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Chart Type</label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chartTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVolume(!showVolume)}
              >
                {showVolume ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Volume
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowIndicators(!showIndicators)}
              >
                <BarChart3 className="h-4 w-4" />
                Indicators
              </Button>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chart Area */}
      <Card className="min-h-[500px]">
        <CardContent className="p-4">
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Chart Component</h3>
                <p className="text-muted-foreground">
                  Interactive chart will be rendered here with {selectedPair} data
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Timeframe: {timeframe} | Type: {chartType} | Zoom: {Math.round(zoomLevel * 100)}%
                </p>
              </div>
              
              {/* Mock chart visualization */}
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {selectedPairData?.currentRate.toFixed(4)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {chartData.length} data points loaded
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Information */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Market Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">High (24h)</span>
              <span className="font-semibold">
                {Math.max(...chartData.map(d => d.high)).toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Low (24h)</span>
              <span className="font-semibold">
                {Math.min(...chartData.map(d => d.low)).toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Volume</span>
              <span className="font-semibold">
                {(chartData.reduce((sum, d) => sum + (d.volume || 0), 0) / 1000000).toFixed(2)}M
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Technical Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">SMA (20)</span>
              <span className="font-semibold">
                {(chartData.reduce((sum, d) => sum + d.close, 0) / Math.min(20, chartData.length)).toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">RSI</span>
              <span className="font-semibold">65.4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">MACD</span>
              <span className="font-semibold text-green-600">+0.0012</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Trend</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Bullish
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Strength</span>
              <span className="font-semibold">Strong</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Support</span>
              <span className="font-semibold">0.8480</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Set Price Alert
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Economic Calendar
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Chart Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedCurrencyCharts;
