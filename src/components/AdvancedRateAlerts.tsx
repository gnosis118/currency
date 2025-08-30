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
  Globe
} from 'lucide-react';

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

const AdvancedRateAlerts = () => {
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

  // Alert type options
  const alertTypes = [
    { value: 'above', label: 'Rate Above', icon: TrendingUp, description: 'Alert when rate goes above target' },
    { value: 'below', label: 'Rate Below', icon: TrendingDown, description: 'Alert when rate goes below target' },
    { value: 'change', label: 'Percentage Change', icon: Target, description: 'Alert on specific % change' },
    { value: 'volatility', label: 'High Volatility', icon: AlertTriangle, description: 'Alert on unusual price movements' },
  ];

  // Mock alerts data
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        currencyPair: 'USD/EUR',
        alertType: 'above',
        targetRate: 0.87,
        currentRate: 0.85,
        changePercent: 0,
        isActive: true,
        notifications: { email: true, push: true, sms: false },
        createdAt: '2025-01-30T10:00:00Z',
        triggerCount: 0
      },
      {
        id: '2',
        currencyPair: 'GBP/USD',
        alertType: 'below',
        targetRate: 1.35,
        currentRate: 1.37,
        changePercent: 0,
        isActive: true,
        notifications: { email: true, push: false, sms: false },
        createdAt: '2025-01-29T15:30:00Z',
        triggerCount: 1,
        lastTriggered: '2025-01-30T08:15:00Z'
      },
      {
        id: '3',
        currencyPair: 'USD/JPY',
        alertType: 'change',
        targetRate: 0,
        currentRate: 110.5,
        changePercent: 2.0,
        isActive: false,
        notifications: { email: false, push: true, sms: false },
        createdAt: '2025-01-28T12:00:00Z',
        triggerCount: 3,
        lastTriggered: '2025-01-30T06:45:00Z'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const selectedPairData = currencyPairs.find(pair => pair.name === selectedPair);

  const handleCreateAlert = () => {
    if (!targetRate && alertType !== 'volatility') return;
    
    const newAlert: Alert = {
      id: Date.now().toString(),
      currencyPair: selectedPair,
      alertType,
      targetRate: parseFloat(targetRate) || 0,
      currentRate: selectedPairData?.currentRate || 0,
      changePercent: parseFloat(changePercent) || 0,
      isActive: true,
      notifications,
      createdAt: new Date().toISOString(),
      triggerCount: 0
    };

    setAlerts(prev => [...prev, newAlert]);
    setShowCreateForm(false);
    setTargetRate('');
    setChangePercent('');
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertStatus = (alert: Alert) => {
    if (!alert.isActive) return { status: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-600' };
    
    const currentRate = alert.currentRate;
    const targetRate = alert.targetRate;
    
    switch (alert.alertType) {
      case 'above':
        return currentRate > targetRate 
          ? { status: 'triggered', label: 'Triggered', color: 'bg-red-100 text-red-600' }
          : { status: 'waiting', label: 'Waiting', color: 'bg-yellow-100 text-yellow-600' };
      case 'below':
        return currentRate < targetRate 
          ? { status: 'triggered', label: 'Triggered', color: 'bg-red-100 text-red-600' }
          : { status: 'waiting', label: 'Waiting', color: 'bg-yellow-100 text-yellow-600' };
      case 'change':
        const change = Math.abs(alert.changePercent);
        return change >= alert.changePercent 
          ? { status: 'triggered', label: 'Triggered', color: 'bg-red-100 text-red-600' }
          : { status: 'waiting', label: 'Waiting', color: 'bg-yellow-100 text-yellow-600' };
      case 'volatility':
        return { status: 'monitoring', label: 'Monitoring', color: 'bg-blue-100 text-blue-600' };
      default:
        return { status: 'unknown', label: 'Unknown', color: 'bg-gray-100 text-gray-600' };
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'above': return TrendingUp;
      case 'below': return TrendingDown;
      case 'change': return Target;
      case 'volatility': return AlertTriangle;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Rate Alerts & Notifications
            </CardTitle>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Create Alert Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency Pair</label>
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyPairs.map((pair) => (
                      <SelectItem key={pair.name} value={pair.name}>
                        {pair.name} ({pair.currentRate.toFixed(4)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Alert Type</label>
                <Select value={alertType} onValueChange={(value: any) => setAlertType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alertTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {alertType !== 'volatility' && (
              <div className="grid gap-4 md:grid-cols-2">
                {alertType === 'change' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Change Percentage (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="2.0"
                      value={changePercent}
                      onChange={(e) => setChangePercent(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Rate</label>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder={alertType === 'above' ? '0.87' : '1.35'}
                      value={targetRate}
                      onChange={(e) => setTargetRate(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium">Notification Methods</label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  />
                  <label htmlFor="email" className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="push"
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                  />
                  <label htmlFor="push" className="flex items-center gap-2 text-sm">
                    <Smartphone className="h-4 w-4" />
                    Push
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sms"
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                  />
                  <label htmlFor="sms" className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4" />
                    SMS
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateAlert} className="flex-1">
                Create Alert
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Alerts ({alerts.filter(a => a.isActive).length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.filter(alert => alert.isActive).map((alert) => {
              const status = getAlertStatus(alert);
              const Icon = getAlertIcon(alert.alertType);
              
              return (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">{alert.currencyPair}</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.alertType === 'above' && `Alert when rate > ${alert.targetRate}`}
                        {alert.alertType === 'below' && `Alert when rate < ${alert.targetRate}`}
                        {alert.alertType === 'change' && `Alert on ${alert.changePercent}% change`}
                        {alert.alertType === 'volatility' && 'Monitor for unusual movements'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={status.color}>{status.label}</Badge>
                    <div className="text-right text-sm">
                      <div>Current: {alert.currentRate.toFixed(4)}</div>
                      <div className="text-muted-foreground">
                        Created: {new Date(alert.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAlert(alert.id)}
                      >
                        <BellOff className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {alerts.filter(alert => alert.isActive).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No active alerts</p>
                <p className="text-sm">Create your first alert to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inactive Alerts */}
      {alerts.filter(alert => !alert.isActive).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inactive Alerts ({alerts.filter(a => !a.isActive).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.filter(alert => !alert.isActive).map((alert) => {
                const Icon = getAlertIcon(alert.alertType);
                
                return (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold text-muted-foreground">{alert.currencyPair}</div>
                        <div className="text-sm text-muted-foreground">
                          {alert.alertType === 'above' && `Alert when rate > ${alert.targetRate}`}
                          {alert.alertType === 'below' && `Alert when rate < ${alert.targetRate}`}
                          {alert.alertType === 'change' && `Alert on ${alert.changePercent}% change`}
                          {alert.alertType === 'volatility' && 'Monitor for unusual movements'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">Inactive</Badge>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>Triggered: {alert.triggerCount} times</div>
                        {alert.lastTriggered && (
                          <div>Last: {new Date(alert.lastTriggered).toLocaleDateString()}</div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAlert(alert.id)}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Email Notifications</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive alerts via email for all active alerts
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Summary</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Immediate Alerts</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Push Notifications</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications on your device
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sound</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vibration</span>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">SMS Notifications</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Emergency alerts via text message
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical Alerts</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Limit</span>
                    <span className="text-sm text-muted-foreground">5/day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedRateAlerts;
