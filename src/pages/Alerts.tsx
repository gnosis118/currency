import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  BellOff, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Trash2,
  Edit,
  Plus,
  Mail,
  Smartphone,
  Globe,
  RefreshCw,
  Filter,
  Search,
  BarChart3
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import WebPOptimizedImage from '@/components/WebPOptimizedImage';
import alertsHero from '@/assets/alerts-hero.jpg';
import alertsHeroWebP from '@/assets/alerts-hero.webp';

interface Alert {
  id: string;
  currencyPair: string;
  alertType: 'above' | 'below' | 'change' | 'volatility';
  targetRate: number;
  currentRate: number;
  changePercent: number;
  isActive: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
}

interface CurrencyPair {
  from: string;
  to: string;
  name: string;
  currentRate: number;
  change24h: number;
  changePercent: number;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPair, setSelectedPair] = useState('USD-EUR');
  const [alertType, setAlertType] = useState<'above' | 'below' | 'change' | 'volatility'>('above');
  const [targetRate, setTargetRate] = useState('');
  const [changePercent, setChangePercent] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Popular currency pairs
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

  // Mock alerts data - replace with real API data
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        currencyPair: 'USD-EUR',
        alertType: 'above',
        targetRate: 0.87,
        currentRate: 0.85,
        changePercent: -0.24,
        isActive: true,
        notifications: { email: true, push: true, sms: false },
        createdAt: '2025-01-15T10:30:00Z',
        triggerCount: 0
      },
      {
        id: '2',
        currencyPair: 'EUR-GBP',
        alertType: 'below',
        targetRate: 0.84,
        currentRate: 0.86,
        changePercent: 0.35,
        isActive: true,
        notifications: { email: true, push: false, sms: false },
        createdAt: '2025-01-14T15:45:00Z',
        triggerCount: 1,
        lastTriggered: '2025-01-16T09:15:00Z'
      },
      {
        id: '3',
        currencyPair: 'USD-JPY',
        alertType: 'change',
        targetRate: 0.5,
        currentRate: 110.5,
        changePercent: -0.27,
        isActive: false,
        notifications: { email: false, push: true, sms: false },
        createdAt: '2025-01-13T12:20:00Z',
        triggerCount: 3,
        lastTriggered: '2025-01-15T14:30:00Z'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const createAlert = () => {
    if (!targetRate || !selectedPair) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      currencyPair: selectedPair,
      alertType,
      targetRate: parseFloat(targetRate),
      currentRate: currencyPairs.find(p => `${p.from}-${p.to}` === selectedPair)?.currentRate || 0,
      changePercent: currencyPairs.find(p => `${p.from}-${p.to}` === selectedPair)?.changePercent || 0,
      isActive: true,
      notifications,
      createdAt: new Date().toISOString(),
      triggerCount: 0
    };

    setAlerts(prev => [newAlert, ...prev]);
    setShowCreateForm(false);
    setTargetRate('');
    setChangePercent('');
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.currencyPair.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && alert.isActive) || 
      (filterStatus === 'inactive' && !alert.isActive);
    return matchesSearch && matchesFilter;
  });

  const selectedPairData = currencyPairs.find(pair => `${pair.from}-${pair.to}` === selectedPair);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication", 
    "name": "Advanced Currency Rate Alerts & Monitoring",
    "description": "Professional currency exchange rate alerts with multiple notification methods, advanced monitoring, and real-time tracking for optimal exchange opportunities.",
    "url": "https://currencytocurrency.app/alerts",
    "applicationCategory": "FinanceApplication",
    "featureList": [
      "Advanced rate alerts with multiple types",
      "Multiple notification methods",
      "Real-time monitoring and tracking",
      "Professional alert management",
      "Performance analytics and history",
      "Customizable alert conditions"
    ]
  };

  return (
    <div className="min-h-screen bg-converter-bg">
      <SEOHead
        title="Advanced Currency Rate Alerts & Smart Monitoring | Currency to Currency"
        description="Professional currency rate alerts with multiple notification methods, advanced monitoring, and real-time tracking. Never miss the perfect exchange opportunity with smart alerts."
        keywords="advanced currency alerts, exchange rate monitoring, smart rate alerts, currency notifications, forex alerts, rate tracking, professional alerts, multiple notification methods"
        canonical="https://currencytocurrency.app/alerts"
        structuredData={structuredData}
      />
      
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <WebPOptimizedImage
          src={alertsHero}
          webpSrc={alertsHeroWebP}
          alt="Advanced smart currency rate alert system with multiple notification methods and professional monitoring tools"
          width={1200}
          height={320}
          className="w-full h-full"
          loading="eager"
          priority={true}
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Smart Rate Alerts</h1>
            <p className="text-lg md:text-xl opacity-90">
              Advanced monitoring with multiple notification methods and professional tools
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 -mt-16 relative z-10">
        <div className="bg-converter-bg rounded-lg shadow-lg p-6 mb-8">
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            Set up professional-grade rate alerts with multiple notification methods, 
            advanced monitoring, and real-time tracking to never miss optimal exchange opportunities.
          </p>
        </div>
        
        {/* Main Alerts Interface */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Rate Alerts
                  </CardTitle>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Alerts List */}
                <div className="space-y-4">
                  {filteredAlerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                      <p className="text-sm">Create your first rate alert to get started</p>
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => {
                      const pairData = currencyPairs.find(p => `${p.from}-${p.to}` === alert.currencyPair);
                      return (
                        <div key={alert.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{alert.currencyPair}</h3>
                                <Badge variant={alert.isActive ? "default" : "secondary"}>
                                  {alert.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant="outline">
                                  {alert.alertType.charAt(0).toUpperCase() + alert.alertType.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Target Rate:</span>
                                  <div className="font-semibold">{alert.targetRate.toFixed(4)}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Current Rate:</span>
                                  <div className="font-semibold">{alert.currentRate.toFixed(4)}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Triggered:</span>
                                  <div className="font-semibold">{alert.triggerCount} times</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Created:</span>
                                  <div className="font-semibold">
                                    {new Date(alert.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              
                              {alert.lastTriggered && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  Last triggered: {new Date(alert.lastTriggered).toLocaleString()}
                                </div>
                              )}
                              
                              <div className="flex flex-wrap gap-2 mt-3">
                                {alert.notifications.email && (
                                  <Badge variant="outline" className="text-xs">
                                    <Mail className="h-3 w-3 mr-1" />
                                    Email
                                  </Badge>
                                )}
                                {alert.notifications.push && (
                                  <Badge variant="outline" className="text-xs">
                                    <Bell className="h-3 w-3 mr-1" />
                                    Push
                                  </Badge>
                                )}
                                {alert.notifications.sms && (
                                  <Badge variant="outline" className="text-xs">
                                    <Smartphone className="h-3 w-3 mr-1" />
                                    SMS
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAlert(alert.id)}
                              >
                                {alert.isActive ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteAlert(alert.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Create Alert Form */}
            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Alert
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <label className="text-sm font-medium mb-2 block">Alert Type</label>
                    <Select value={alertType} onValueChange={(value: 'above' | 'below' | 'change' | 'volatility') => setAlertType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Rate Above Target</SelectItem>
                        <SelectItem value="below">Rate Below Target</SelectItem>
                        <SelectItem value="change">Percentage Change</SelectItem>
                        <SelectItem value="volatility">Volatility Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {alertType === 'change' ? 'Change Percentage (%)' : 'Target Rate'}
                    </label>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder={alertType === 'change' ? '0.5' : '0.8500'}
                      value={alertType === 'change' ? changePercent : targetRate}
                      onChange={(e) => {
                        if (alertType === 'change') {
                          setChangePercent(e.target.value);
                        } else {
                          setTargetRate(e.target.value);
                        }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Notification Methods</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email</span>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push Notifications</span>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS</span>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={createAlert} className="flex-1">
                      Create Alert
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currencyPairs.slice(0, 5).map((pair) => (
                    <div key={`${pair.from}-${pair.to}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-semibold text-sm">{pair.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {pair.from} to {pair.to}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-semibold">{pair.currentRate.toFixed(4)}</div>
                        <div className={`text-xs ${pair.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pair.changePercent > 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alert Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Alert Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{alerts.length}</div>
                      <div className="text-sm text-muted-foreground">Total Alerts</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {alerts.filter(a => a.isActive).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {alerts.reduce((sum, alert) => sum + alert.triggerCount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Triggers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;