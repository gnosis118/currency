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
import { alertsService, Alert, CreateAlertRequest } from '@/services/alertsService';
import { useToast } from '@/hooks/use-toast';

// Alert interface is now imported from alertsService

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
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [targetRate, setTargetRate] = useState('');
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

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

  // Load alerts from API
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const alertsData = await alertsService.getAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load alerts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    if (!targetRate || !selectedPair || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setCreating(true);
      const [fromCurrency, toCurrency] = selectedPair.split('-');
      
      const alertData: CreateAlertRequest = {
        from_currency: fromCurrency,
        to_currency: toCurrency,
        target_rate: parseFloat(targetRate),
        condition: alertType,
        email: email
      };

      const newAlert = await alertsService.createAlert(alertData);
      setAlerts(prev => [newAlert, ...prev]);
      
      toast({
        title: "Alert Created",
        description: "Your price alert has been created successfully.",
      });

      setShowCreateForm(false);
      setTargetRate('');
      setSelectedPair('USD-EUR');
      setAlertType('above');
      setEmail('');
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleAlert = async (alertId: string) => {
    try {
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return;

      const updatedAlert = await alertsService.toggleAlert(alertId, !alert.is_active);
      setAlerts(prev => prev.map(a => a.id === alertId ? updatedAlert : a));
      
      toast({
        title: "Alert Updated",
        description: `Alert ${updatedAlert.is_active ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      await alertsService.deleteAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
      toast({
        title: "Alert Deleted",
        description: "Alert deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const currencyPair = `${alert.from_currency}-${alert.to_currency}`;
    const matchesSearch = currencyPair.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && alert.is_active) || 
      (filterStatus === 'inactive' && !alert.is_active);
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
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-sm">Loading alerts...</p>
                    </div>
                  ) : filteredAlerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                      <p className="text-sm">Create your first rate alert to get started</p>
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => {
                      const currencyPair = `${alert.from_currency}-${alert.to_currency}`;
                      const pairData = currencyPairs.find(p => `${p.from}-${p.to}` === currencyPair);
                      return (
                        <div key={alert.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{currencyPair}</h3>
                                <Badge variant={alert.is_active ? "default" : "secondary"}>
                                  {alert.is_active ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant="outline">
                                  {alert.condition.charAt(0).toUpperCase() + alert.condition.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Target Rate:</span>
                                  <div className="font-semibold">{alert.target_rate.toFixed(4)}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Current Rate:</span>
                                  <div className="font-semibold">{pairData?.currentRate.toFixed(4) || 'N/A'}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Triggered:</span>
                                  <div className="font-semibold">{alert.trigger_count} times</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Created:</span>
                                  <div className="font-semibold">
                                    {new Date(alert.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              
                              {alert.last_triggered_at && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  Last triggered: {new Date(alert.last_triggered_at).toLocaleString()}
                                </div>
                              )}
                              
                              <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant="outline" className="text-xs">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {alert.email}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAlert(alert.id)}
                              >
                                {alert.is_active ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
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
                    <Select value={alertType} onValueChange={(value: 'above' | 'below') => setAlertType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Rate Above Target</SelectItem>
                        <SelectItem value="below">Rate Below Target</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Rate</label>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder="0.8500"
                      value={targetRate}
                      onChange={(e) => setTargetRate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={createAlert} className="flex-1" disabled={creating}>
                      {creating ? "Creating..." : "Create Alert"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                      disabled={creating}
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