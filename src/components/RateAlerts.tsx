import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Check, Trash2, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from './AuthGuard';

interface RateAlert {
  id: string;
  from_currency: string;
  to_currency: string;
  target_rate: number;
  condition: 'above' | 'below';
  email: string;
  created_at: string;
  is_active: boolean;
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
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$' },
];

const RateAlertsContent = ({ user }: { user: User }) => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currentRate, setCurrentRate] = useState(0);
  const [email, setEmail] = useState(user.email || '');
  const [targetRate, setTargetRate] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [alerts, setAlerts] = useState<RateAlert[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch current exchange rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setCurrentRate(data.rates[toCurrency] || 0);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    };

    if (fromCurrency && toCurrency) {
      fetchRate();
    }
  }, [fromCurrency, toCurrency]);

  // Fetch user's alerts
  useEffect(() => {
    fetchAlerts();
  }, [user]);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rate_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts((data || []) as RateAlert[]);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load alerts.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAlert = async () => {
    if (!email || !targetRate) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and target rate.",
        variant: "destructive"
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    const rate = parseFloat(targetRate);
    if (isNaN(rate) || rate <= 0) {
      toast({
        title: "Invalid Rate",
        description: "Please enter a valid exchange rate.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('rate_alerts')
        .insert({
          user_id: user.id,
          from_currency: fromCurrency,
          to_currency: toCurrency,
          target_rate: rate,
          condition,
          email,
        });

      if (error) throw error;

      setTargetRate('');
      await fetchAlerts(); // Refresh the alerts list

      toast({
        title: "Alert Created!",
        description: `We'll notify you when ${fromCurrency}/${toCurrency} goes ${condition} ${rate.toFixed(4)}`,
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rate_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchAlerts(); // Refresh the alerts list
      toast({
        title: "Alert Deleted",
        description: "Rate alert has been removed.",
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert.",
        variant: "destructive"
      });
    }
  };

  const toggleAlert = async (id: string) => {
    try {
      const alert = alerts.find(a => a.id === id);
      if (!alert) return;

      const { error } = await supabase
        .from('rate_alerts')
        .update({ is_active: !alert.is_active })
        .eq('id', id);

      if (error) throw error;

      await fetchAlerts(); // Refresh the alerts list
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert.",
        variant: "destructive"
      });
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="space-y-6">
      {/* Currency Selection */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Select Currency Pair</CardTitle>
          <CardDescription>
            Choose the currencies you want to monitor for rate alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 items-end">
            <div className="space-y-2">
              <Label>From Currency</Label>
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
              <Label>To Currency</Label>
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
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Rate Alerts</CardTitle>
          </div>
          <CardDescription>
            Get notified when {fromCurrency}/{toCurrency} reaches your target rate
          </CardDescription>
        </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Create New Alert */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <h4 className="font-medium">Create New Alert</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetRate">Target Rate</Label>
              <Input
                id="targetRate"
                type="number"
                step="0.0001"
                placeholder={currentRate.toFixed(4)}
                value={targetRate}
                onChange={(e) => setTargetRate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Notify me when rate goes</Label>
            <Select value={condition} onValueChange={(value: 'above' | 'below') => setCondition(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above target rate</SelectItem>
                <SelectItem value="below">Below target rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={createAlert} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Alert...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Create Alert
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Current rate: 1 {fromCurrency} = {currentRate.toFixed(6)} {toCurrency}
          </p>
        </div>

        {/* Active Alerts */}
        {isLoading ? (
          <div className="space-y-3">
            <h4 className="font-medium">Your Alerts</h4>
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium">Your Alerts</h4>
            
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-card"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={alert.is_active ? 'default' : 'secondary'}>
                      {alert.is_active ? 'Active' : 'Paused'}
                    </Badge>
                    <span className="text-sm font-medium">
                      {alert.from_currency}/{alert.to_currency}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Notify {alert.email} when rate goes {alert.condition} {alert.target_rate.toFixed(4)}
                  </p>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Created {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAlert(alert.id)}
                  >
                    <Check className="h-4 w-4" />
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
            ))}
          </div>
        ) : null}
        
        {!isLoading && alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No alerts created yet</p>
            <p className="text-sm">Create your first rate alert above</p>
          </div>
        )}
      </CardContent>
      </Card>
    </div>
  );
};

const RateAlerts = () => {
  return (
    <AuthGuard
      fallback={
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Rate Alerts</CardTitle>
            </div>
            <CardDescription>
              Sign in to set up personalized rate alerts and get notified when currencies reach your target rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Authentication required</p>
              <p className="text-sm">Sign in above to manage your rate alerts</p>
            </div>
          </CardContent>
        </Card>
      }
    >
      {(user) => <RateAlertsContent user={user} />}
    </AuthGuard>
  );
};

export default RateAlerts;