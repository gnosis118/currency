import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Plane, 
  Hotel, 
  Utensils, 
  ShoppingBag, 
  Car, 
  Train, 
  Bus,
  Camera,
  Gift,
  Plus,
  Minus,
  Save,
  Download,
  Share2,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  location: string;
  notes?: string;
}

interface Budget {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  currency: string;
}

interface TravelPlan {
  destination: string;
  startDate: string;
  endDate: string;
  baseCurrency: string;
  localCurrency: string;
  exchangeRate: number;
  dailyBudget: number;
  totalBudget: number;
}

const AdvancedTravelCalculator = () => {
  const [travelPlan, setTravelPlan] = useState<TravelPlan>({
    destination: 'Paris, France',
    startDate: '2025-06-01',
    endDate: '2025-06-07',
    baseCurrency: 'USD',
    localCurrency: 'EUR',
    exchangeRate: 0.85,
    dailyBudget: 150,
    totalBudget: 1050
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'accommodation',
    description: '',
    amount: 0,
    currency: 'EUR',
    date: new Date().toISOString().split('T')[0],
    location: '',
    notes: ''
  });

  // Expense categories with icons and colors
  const expenseCategories = [
    { value: 'accommodation', label: 'Accommodation', icon: Hotel, color: 'bg-blue-100 text-blue-800' },
    { value: 'transportation', label: 'Transportation', icon: Car, color: 'bg-green-100 text-green-800' },
    { value: 'food', label: 'Food & Dining', icon: Utensils, color: 'bg-orange-100 text-orange-800' },
    { value: 'activities', label: 'Activities', icon: Camera, color: 'bg-purple-100 text-purple-800' },
    { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-100 text-pink-800' },
    { value: 'souvenirs', label: 'Souvenirs', icon: Gift, color: 'bg-indigo-100 text-indigo-800' },
    { value: 'other', label: 'Other', icon: Plus, color: 'bg-gray-100 text-gray-800' },
  ];

  // Popular destinations with exchange rates
  const destinations = [
    { name: 'Paris, France', country: 'France', currency: 'EUR', rate: 0.85, flag: '🇫🇷' },
    { name: 'London, UK', country: 'United Kingdom', currency: 'GBP', rate: 0.73, flag: '🇬🇧' },
    { name: 'Tokyo, Japan', country: 'Japan', currency: 'JPY', rate: 110.5, flag: '🇯🇵' },
    { name: 'Sydney, Australia', country: 'Australia', currency: 'AUD', rate: 1.35, flag: '🇦🇺' },
    { name: 'Toronto, Canada', country: 'Canada', currency: 'CAD', rate: 1.25, flag: '🇨🇦' },
    { name: 'Dubai, UAE', country: 'UAE', currency: 'AED', rate: 3.67, flag: '🇦🇪' },
    { name: 'Singapore', country: 'Singapore', currency: 'SGD', rate: 1.35, flag: '🇸🇬' },
    { name: 'Bangkok, Thailand', country: 'Thailand', currency: 'THB', rate: 32.5, flag: '🇹🇭' },
  ];

  // Mock expenses data
  useEffect(() => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        category: 'accommodation',
        description: 'Hotel booking - 3 nights',
        amount: 450,
        currency: 'EUR',
        date: '2025-06-01',
        location: 'Paris',
        notes: 'Central location, breakfast included'
      },
      {
        id: '2',
        category: 'transportation',
        description: 'Airport transfer',
        amount: 80,
        currency: 'EUR',
        date: '2025-06-01',
        location: 'Paris',
        notes: 'Private car service'
      },
      {
        id: '3',
        category: 'food',
        description: 'Dinner at restaurant',
        amount: 65,
        currency: 'EUR',
        date: '2025-06-01',
        location: 'Paris',
        notes: 'Traditional French cuisine'
      }
    ];
    setExpenses(mockExpenses);
  }, []);

  const selectedDestination = destinations.find(d => d.name === travelPlan.destination);

  const handleDestinationChange = (destination: string) => {
    const dest = destinations.find(d => d.name === destination);
    if (dest) {
      setTravelPlan(prev => ({
        ...prev,
        destination,
        localCurrency: dest.currency,
        exchangeRate: dest.rate
      }));
    }
  };

  const calculateTripDuration = () => {
    const start = new Date(travelPlan.startDate);
    const end = new Date(travelPlan.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => {
      if (expense.currency === travelPlan.baseCurrency) {
        return total + expense.amount;
      } else {
        return total + (expense.amount / travelPlan.exchangeRate);
      }
    }, 0);
  };

  const calculateRemainingBudget = () => {
    return travelPlan.totalBudget - calculateTotalExpenses();
  };

  const calculateDailyAverage = () => {
    const duration = calculateTripDuration();
    const spent = calculateTotalExpenses();
    return duration > 0 ? spent / duration : 0;
  };

  const getBudgetStatus = () => {
    const remaining = calculateRemainingBudget();
    const percentage = (remaining / travelPlan.totalBudget) * 100;
    
    if (percentage >= 50) return { status: 'good', color: 'text-green-600', icon: TrendingUp };
    if (percentage >= 25) return { status: 'warning', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'danger', color: 'text-red-600', icon: AlertTriangle };
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category || 'other',
      description: newExpense.description,
      amount: newExpense.amount,
      currency: newExpense.currency || 'EUR',
      date: newExpense.date || new Date().toISOString().split('T')[0],
      location: newExpense.location || '',
      notes: newExpense.notes
    };

    setExpenses(prev => [...prev, expense]);
    setShowExpenseForm(false);
    setNewExpense({
      category: 'accommodation',
      description: '',
      amount: 0,
      currency: 'EUR',
      date: new Date().toISOString().split('T')[0],
      location: '',
      notes: ''
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const getCategoryIcon = (category: string) => {
    const cat = expenseCategories.find(c => c.value === category);
    return cat ? cat.icon : Plus;
  };

  const getCategoryColor = (category: string) => {
    const cat = expenseCategories.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const exportData = () => {
    const data = {
      travelPlan,
      expenses,
      summary: {
        totalExpenses: calculateTotalExpenses(),
        remainingBudget: calculateRemainingBudget(),
        dailyAverage: calculateDailyAverage(),
        tripDuration: calculateTripDuration()
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-plan-${travelPlan.destination.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Travel Money Calculator
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Travel Plan Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Trip Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Select value={travelPlan.destination} onValueChange={handleDestinationChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.name} value={dest.name}>
                      <div className="flex items-center gap-2">
                        <span>{dest.flag}</span>
                        <span>{dest.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={travelPlan.startDate}
                onChange={(e) => setTravelPlan(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={travelPlan.endDate}
                onChange={(e) => setTravelPlan(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Daily Budget</label>
              <Input
                type="number"
                value={travelPlan.dailyBudget}
                onChange={(e) => setTravelPlan(prev => ({ 
                  ...prev, 
                  dailyBudget: parseFloat(e.target.value) || 0,
                  totalBudget: (parseFloat(e.target.value) || 0) * calculateTripDuration()
                }))}
              />
            </div>
          </div>

          {selectedDestination && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedDestination.flag}</span>
                  <div>
                    <div className="font-semibold">{selectedDestination.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Local currency: {selectedDestination.currency}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Exchange Rate</div>
                  <div className="text-lg font-bold">
                    1 {travelPlan.baseCurrency} = {selectedDestination.rate.toFixed(4)} {selectedDestination.currency}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${travelPlan.totalBudget.toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Budget</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              ${calculateTotalExpenses().toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getBudgetStatus().color}`}>
              ${calculateRemainingBudget().toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">Remaining</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {calculateTripDuration()}
            </div>
            <div className="text-sm text-muted-foreground">Days</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
          <TabsTrigger value="planning">Planning Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          {/* Add Expense Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Add Expense</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
                >
                  {showExpenseForm ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {showExpenseForm ? 'Hide' : 'Add'}
                </Button>
              </div>
            </CardHeader>
            
            {showExpenseForm && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select 
                      value={newExpense.category} 
                      onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <category.icon className="h-4 w-4" />
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      placeholder="e.g., Hotel booking, Dinner, etc."
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <Select 
                      value={newExpense.currency} 
                      onValueChange={(value) => setNewExpense(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      placeholder="e.g., City, Hotel, Restaurant"
                      value={newExpense.location}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (Optional)</label>
                  <Input
                    placeholder="Additional details..."
                    value={newExpense.notes}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddExpense} className="flex-1">
                    Add Expense
                  </Button>
                  <Button variant="outline" onClick={() => setShowExpenseForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Expenses List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expenses ({expenses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.map((expense) => {
                  const Icon = getCategoryIcon(expense.category);
                  const categoryColor = getCategoryColor(expense.category);
                  
                  return (
                    <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={categoryColor}>
                          <Icon className="h-3 w-3 mr-1" />
                          {expenseCategories.find(c => c.value === expense.category)?.label}
                        </Badge>
                        <div>
                          <div className="font-semibold">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {expense.location} • {new Date(expense.date).toLocaleDateString()}
                          </div>
                          {expense.notes && (
                            <div className="text-xs text-muted-foreground">{expense.notes}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">
                          {expense.amount.toFixed(2)} {expense.currency}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ≈ ${(expense.amount / travelPlan.exchangeRate).toFixed(2)} {travelPlan.baseCurrency}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExpense(expense.id)}
                          className="mt-1"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {expenses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No expenses added yet</p>
                    <p className="text-sm">Start tracking your travel expenses</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          {/* Budget Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Daily Spending</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Daily Average</span>
                        <span className="font-semibold">${calculateDailyAverage().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Daily Budget</span>
                        <span className="font-semibold">${travelPlan.dailyBudget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Remaining Days</span>
                        <span className="font-semibold">{calculateTripDuration()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold">Budget Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Budget Used</span>
                        <span className="font-semibold">
                          {((calculateTotalExpenses() / travelPlan.totalBudget) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge className={getBudgetStatus().color}>
                          {getBudgetStatus().status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          {/* Planning Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Planning Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold">Currency Converter</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="Amount" type="number" />
                      <Select>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Convert to {travelPlan.localCurrency}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Budget Calculator</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="Daily budget" type="number" />
                      <span className="text-sm text-muted-foreground self-center">×</span>
                      <Input placeholder="Days" type="number" value={calculateTripDuration()} readOnly />
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Total: ${(travelPlan.dailyBudget * calculateTripDuration()).toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedTravelCalculator;
