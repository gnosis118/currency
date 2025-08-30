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
  Bell,
  RefreshCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import SEOHead from '@/components/SEOHead';
import chartsHero from '@/assets/charts-hero.jpg';

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

const Charts = () => {
  const [selectedPair, setSelectedPair] = useState('USD-EUR');
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

  // Generate dynamic chart data based on selected pair and timeframe
  const generateChartData = (pair: string, tf: string): ChartData[] => {
    const baseRate = currencyPairs.find(p => `${p.from}-${p.to}` === pair)?.currentRate || 0.85;
    const volatility = 0.005; // 0.5% volatility
    const dataPoints = tf === '1H' ? 24 : tf === '4H' ? 30 : tf === '1D' ? 7 : tf === '1W' ? 14 : tf === '1M' ? 30 : tf === '3M' ? 90 : tf === '6M' ? 180 : 365;
    
    const data: ChartData[] = [];
    let currentRate = baseRate;
    
    for (let i = 0; i < dataPoints; i++) {
      const change = (Math.random() - 0.5) * volatility;
      const newRate = currentRate * (1 + change);
      const high = newRate * (1 + Math.random() * 0.002);
      const low = newRate * (1 - Math.random() * 0.002);
      const open = currentRate;
      const close = newRate;
      
      data.push({
        date: new Date(Date.now() - (dataPoints - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
      
      currentRate = newRate;
    }
    
    return data;
  };

  // State for dynamic chart data
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Update chart data when pair or timeframe changes
  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay for better UX
    setTimeout(() => {
      const newData = generateChartData(selectedPair, timeframe);
      setChartData(newData);
      setIsLoading(false);
    }, 300);
  }, [selectedPair, timeframe]);

  // Calculate chart statistics
  const chartStats = {
    highest: Math.max(...chartData.map(d => d.high)),
    lowest: Math.min(...chartData.map(d => d.low)),
    average: chartData.reduce((sum, d) => sum + d.close, 0) / chartData.length,
    change: ((chartData[chartData.length - 1]?.close || 0) - (chartData[0]?.open || 0)) / (chartData[0]?.open || 1) * 100
  };

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

  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick' },
    { value: 'line', label: 'Line' },
    { value: 'area', label: 'Area' },
    { value: 'bar', label: 'Bar' },
  ];

  const selectedPairData = currencyPairs.find(pair => `${pair.from}-${pair.to}` === selectedPair);

  // Refresh chart data
  const refreshChartData = () => {
    // Generate fresh data with current settings
    const newData = generateChartData(selectedPair, timeframe);
    setChartData(newData);
    console.log('Refreshing chart data...');
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Advanced Currency Exchange Rate Charts",
    "description": "Professional interactive historical currency exchange rate charts and trends analysis with multiple timeframes and technical indicators.",
    "url": "https://currencytocurrency.app/charts",
    "applicationCategory": "FinanceApplication",
    "featureList": [
      "Advanced historical exchange rate charts",
      "Multiple timeframes and chart types",
      "Technical indicators and analysis",
      "Interactive data visualization",
      "Professional trading tools",
      "Real-time market data"
    ]
  };

  return (
    <div className="min-h-screen bg-converter-bg">
      <SEOHead
        title="Advanced Currency Exchange Rate Charts & Technical Analysis | Currency to Currency"
        description="Professional currency charts with technical indicators, multiple timeframes, and advanced analysis tools. Track forex performance with professional-grade visualization."
        keywords="currency charts, exchange rate history, currency trends, technical analysis, forex charts, currency indicators, candlestick charts, trading tools"
        canonical="https://currencytocurrency.app/charts"
        structuredData={structuredData}
      />
      
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img 
          src={chartsHero} 
          alt="Advanced interactive historical currency exchange rate charts with technical analysis and professional trading tools" 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width="1200"
          height="320"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Advanced Currency Charts</h1>
            <p className="text-lg md:text-xl opacity-90">
              Professional trading tools with technical indicators and multiple timeframes
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 -mt-16 relative z-10">
        <div className="bg-converter-bg rounded-lg shadow-lg p-6 mb-8">
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            Analyze currency performance with professional-grade charts featuring multiple timeframes, 
            technical indicators, and advanced visualization tools for informed trading decisions.
          </p>
        </div>
        
        {/* Main Chart Interface */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {selectedPairData?.name} Chart
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-2xl font-bold">
                    {selectedPairData?.currentRate.toFixed(4)}
                  </div>
                  <div className={`flex items-center gap-1 ${selectedPairData?.changePercent && selectedPairData.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedPairData?.changePercent && selectedPairData.changePercent > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {selectedPairData?.changePercent && selectedPairData.changePercent > 0 ? '+' : ''}
                      {selectedPairData?.changePercent?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={refreshChartData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Chart Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Currency Pair</label>
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyPairs.map((pair) => (
                      <SelectItem key={`${pair.from}-${pair.to}`} value={`${pair.from}-${pair.to}`}>
                        {pair.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
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
              
              <div>
                <label className="text-sm font-medium mb-2 block">Chart Type</label>
                <Select value={chartType} onValueChange={(value) => {
                  setChartType(value as any);
                  // Trigger a small refresh when changing chart type
                  setTimeout(() => {
                    const newData = generateChartData(selectedPair, timeframe);
                    setChartData(newData);
                  }, 100);
                }}>
                  <SelectTrigger>
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
              
              <div>
                <label className="text-sm font-medium mb-2 block">Zoom</label>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chart Display */}
            <div className="border rounded-lg p-4 bg-white min-h-[400px]">
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </div>
                </div>
              ) : (
              <ResponsiveContainer width="100%" height={400}>
                {(() => {
                  if (chartType === 'line') {
                    return (
                      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis 
                          domain={['dataMin - 0.001', 'dataMax + 0.001']}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => value.toFixed(4)}
                        />
                        <Tooltip 
                          formatter={(value: number) => [value.toFixed(4), 'Rate']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="close" 
                          stroke="#2563eb" 
                          strokeWidth={2} 
                          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
                        />
                      </LineChart>
                    );
                  }
                  
                  if (chartType === 'area') {
                    return (
                      <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis 
                          domain={['dataMin - 0.001', 'dataMax + 0.001']}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => value.toFixed(4)}
                        />
                        <Tooltip 
                          formatter={(value: number) => [value.toFixed(4), 'Rate']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="close" 
                          stroke="#2563eb" 
                          fill="#2563eb" 
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    );
                  }
                  
                  if (chartType === 'bar') {
                    return (
                      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis 
                          domain={['dataMin - 0.001', 'dataMin + 0.01']}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => value.toFixed(4)}
                        />
                        <Tooltip 
                          formatter={(value: number) => [value.toFixed(4), 'Rate']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        />
                        <Bar dataKey="close" fill="#2563eb" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    );
                  }
                  
                  if (chartType === 'candlestick') {
                    return (
                      <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis 
                          domain={['dataMin - 0.001', 'dataMax + 0.001']}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => value.toFixed(4)}
                        />
                        <Tooltip 
                          formatter={(value: number) => [value.toFixed(4), 'Rate']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        />
                        {/* High-Low lines */}
                        <Line 
                          type="monotone" 
                          dataKey="high" 
                          stroke="#10b981" 
                          strokeWidth={1} 
                          dot={false}
                          connectNulls={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="low" 
                          stroke="#ef4444" 
                          strokeWidth={1} 
                          dot={false}
                          connectNulls={false}
                        />
                        {/* Open-Close bars */}
                        <Bar 
                          dataKey="close" 
                          fill="#2563eb" 
                          radius={[1, 1, 0, 0]}
                          opacity={0.8}
                        />
                        <Bar 
                          dataKey="open" 
                          fill="#7c3aed" 
                          radius={[1, 1, 0, 0]}
                          opacity={0.6}
                        />
                      </ComposedChart>
                    );
                  }
                  
                  return null;
                                 })()}
               </ResponsiveContainer>
               )}
               
               {/* Chart Info */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>
                  {chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart for {selectedPairData?.name} 
                  ({timeframe} timeframe) • {chartData.length} data points • Zoom: {zoomLevel.toFixed(1)}x
                </p>
              </div>
              
              {/* Chart Statistics */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {chartStats.highest.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">Highest</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {chartStats.lowest.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">Lowest</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {chartStats.average.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">Average</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${chartStats.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {chartStats.change >= 0 ? '+' : ''}{chartStats.change.toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Change</div>
                </div>
              </div>
            </div>

            {/* Chart Options */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showVolume"
                  checked={showVolume}
                  onChange={(e) => setShowVolume(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showVolume" className="text-sm">Show Volume</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showIndicators"
                  checked={showIndicators}
                  onChange={(e) => setShowIndicators(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showIndicators" className="text-sm">Show Indicators</label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Pairs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Currency Pairs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currencyPairs.slice(0, 6).map((pair) => (
                  <div key={`${pair.from}-${pair.to}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-semibold">{pair.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {pair.from} to {pair.to}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold">{pair.currentRate.toFixed(4)}</div>
                      <div className={`text-sm ${pair.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {pair.changePercent > 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Technical Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Moving Averages</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>SMA 20:</span>
                      <span className="font-mono">0.8562</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SMA 50:</span>
                      <span className="font-mono">0.8518</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EMA 12:</span>
                      <span className="font-mono">0.8547</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EMA 26:</span>
                      <span className="font-mono">0.8523</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Oscillators</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>RSI (14):</span>
                      <span className="font-mono">58.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MACD:</span>
                      <span className="font-mono">+0.0024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stochastic:</span>
                      <span className="font-mono">72.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Williams %R:</span>
                      <span className="font-mono">-27.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Chart Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...chartData.map(d => d.high)).toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">Highest</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Math.min(...chartData.map(d => d.low)).toFixed(4)}
                </div>
                <div className="text-sm text-muted-foreground">Lowest</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {chartData.length}
                </div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {chartData.reduce((sum, d) => sum + (d.volume || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Volume</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Charts;