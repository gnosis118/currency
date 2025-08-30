import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  BarChart3, 
  Bell, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Clock,
  Settings,
  Star,
  Download,
  Share2,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import EnhancedCurrencyConverter from './EnhancedCurrencyConverter';
import AdvancedCurrencyCharts from './AdvancedCurrencyCharts';
import AdvancedRateAlerts from './AdvancedRateAlerts';
import AdvancedTravelCalculator from './AdvancedTravelCalculator';

interface MarketOverview {
  currency: string;
  rate: number;
  change24h: number;
  changePercent: number;
  volume: string;
  trend: 'up' | 'down' | 'stable';
}

const MasterCurrencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('converter');
  const [showMarketData, setShowMarketData] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock market data - replace with real API data
  const marketData: MarketOverview[] = [
    { currency: 'EUR/USD', rate: 1.18, change24h: 0.002, changePercent: 0.17, volume: '2.1B', trend: 'up' },
    { currency: 'GBP/USD', rate: 1.37, change24h: -0.001, changePercent: -0.07, volume: '1.8B', trend: 'down' },
    { currency: 'USD/JPY', rate: 110.5, change24h: -0.3, changePercent: -0.27, volume: '3.2B', trend: 'down' },
    { currency: 'USD/CAD', rate: 1.25, change24h: 0.01, changePercent: 0.80, volume: '1.5B', trend: 'up' },
    { currency: 'AUD/USD', rate: 0.74, change24h: -0.02, changePercent: -2.63, volume: '1.2B', trend: 'down' },
    { currency: 'USD/CHF', rate: 1.09, change24h: 0.005, changePercent: 0.46, volume: '0.9B', trend: 'up' },
  ];

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // Trigger refresh of all components
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Currency to Currency
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional Currency Tools & Analytics Platform
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Market Overview */}
        {showMarketData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Live Market Overview
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMarketData(!showMarketData)}
                  >
                    {showMarketData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showMarketData ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {marketData.map((item) => (
                  <div key={item.currency} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.currency}</span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="text-2xl font-bold">{item.rate.toFixed(4)}</div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${getTrendColor(item.trend)}`}>
                        {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(4)} 
                        ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                      </span>
                      <span className="text-muted-foreground">Vol: {item.volume}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="converter" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Converter</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Charts</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="travel" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Travel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Advanced Currency Converter</h2>
              <p className="text-muted-foreground">
                Convert between 150+ currencies with real-time rates, fees calculation, and advanced features
              </p>
            </div>
            <EnhancedCurrencyConverter />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Professional Currency Charts</h2>
              <p className="text-muted-foreground">
                Advanced technical analysis with multiple timeframes, indicators, and export capabilities
              </p>
            </div>
            <AdvancedCurrencyCharts />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Smart Rate Alerts</h2>
              <p className="text-muted-foreground">
                Set intelligent alerts for price movements, percentage changes, and volatility monitoring
              </p>
            </div>
            <AdvancedRateAlerts />
          </TabsContent>

          <TabsContent value="travel" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Travel Money Manager</h2>
              <p className="text-muted-foreground">
                Plan your travel budget, track expenses, and manage multiple currencies for your trips
              </p>
            </div>
            <AdvancedTravelCalculator />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Star className="h-6 w-6" />
                <span>Favorites</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Download className="h-6 w-6" />
                <span>Export Data</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Share2 className="h-6 w-6" />
                <span>Share</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Multi-Currency Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Support for 150+ fiat currencies and 100+ cryptocurrencies with real-time exchange rates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Advanced Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Professional charts with technical indicators, multiple timeframes, and export capabilities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Smart Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Intelligent rate alerts with multiple notification methods and custom conditions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Travel Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive travel budget management with expense tracking and currency conversion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
                Real-Time Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Live exchange rates updated every minute with historical data and trend analysis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Fee Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built-in fee calculation and total cost analysis for accurate financial planning
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Currency to Currency - Professional Currency Tools & Analytics Platform
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Built with React, TypeScript, and Tailwind CSS • Real-time data • Professional features
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MasterCurrencyDashboard;
