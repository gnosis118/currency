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
  AlertTriangle,
  Globe,
  RefreshCw,
  Settings
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import WebPOptimizedImage from '@/components/WebPOptimizedImage';
import travelHero from '@/assets/travel-hero.jpg';
import travelHeroWebP from '@/assets/travel-hero.webp';

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

const Travel = () => {
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
    category: 'food',
    description: '',
    amount: 0,
    currency: 'EUR',
    date: new Date().toISOString().split('T')[0],
    location: '',
    notes: ''
  });

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Accommodation', allocated: 400, spent: 0, remaining: 400, currency: 'USD' },
    { category: 'Food & Dining', allocated: 300, spent: 0, remaining: 300, currency: 'USD' },
    { category: 'Transportation', allocated: 150, spent: 0, remaining: 150, currency: 'USD' },
    { category: 'Activities', allocated: 200, spent: 0, remaining: 200, currency: 'USD' },
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  // Mock exchange rates - replace with real API data
  const exchangeRates = {
    'EUR': 0.85,
    'GBP': 0.73,
    'JPY': 110.5,
    'CAD': 1.25,
    'AUD': 1.35,
    'CHF': 1.09,
    'CNY': 6.45,
    'HKD': 7.85,
    'SGD': 1.35,
    'SEK': 8.45,
    'NOK': 8.75,
    'DKK': 6.55,
    'RUB': 75.5,
    'TRY': 8.95,
    'INR': 74.5,
    'BRL': 5.25,
    'ZAR': 15.25,
    'MXN': 20.15,
    'KRW': 1105.5,
    'THB': 33.25,
  };

  const expenseCategories = [
    { value: 'accommodation', label: 'Accommodation', icon: Hotel },
    { value: 'food', label: 'Food & Dining', icon: Utensils },
    { value: 'transportation', label: 'Transportation', icon: Car },
    { value: 'activities', label: 'Activities', icon: Camera },
    { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { value: 'other', label: 'Other', icon: Gift },
  ];

  const popularDestinations = [
    { name: 'Paris, France', currency: 'EUR', rate: 0.85, flag: '🇫🇷' },
    { name: 'London, UK', currency: 'GBP', rate: 0.73, flag: '🇬🇧' },
    { name: 'Tokyo, Japan', currency: 'JPY', rate: 110.5, flag: '🇯🇵' },
    { name: 'Toronto, Canada', currency: 'CAD', rate: 1.25, flag: '🇨🇦' },
    { name: 'Sydney, Australia', currency: 'AUD', rate: 1.35, flag: '🇦🇺' },
    { name: 'Zurich, Switzerland', currency: 'CHF', rate: 1.09, flag: '🇨🇭' },
  ];

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category || 'other',
      description: newExpense.description,
      amount: newExpense.amount,
      currency: newExpense.currency || 'EUR',
      date: newExpense.date || new Date().toISOString().split('T')[0],
      location: newExpense.location || '',
      notes: newExpense.notes || ''
    };

    setExpenses(prev => [expense, ...prev]);
    
    // Update budget
    const categoryMap: { [key: string]: string } = {
      'accommodation': 'Accommodation',
      'food': 'Food & Dining',
      'transportation': 'Transportation',
      'activities': 'Activities',
      'shopping': 'Shopping',
      'other': 'Other'
    };
    
    const budgetCategory = categoryMap[expense.category] || 'Other';
    setBudgets(prev => prev.map(budget => 
      budget.category === budgetCategory 
        ? { ...budget, spent: budget.spent + expense.amount, remaining: budget.remaining - expense.amount }
        : budget
    ));

    setNewExpense({
      category: 'food',
      description: '',
      amount: 0,
      currency: 'EUR',
      date: new Date().toISOString().split('T')[0],
      location: '',
      notes: ''
    });
    setShowExpenseForm(false);
  };

  const deleteExpense = (expenseId: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
      // Update budget
      const categoryMap: { [key: string]: string } = {
        'accommodation': 'Accommodation',
        'food': 'Food & Dining',
        'transportation': 'Transportation',
        'activities': 'Activities',
        'shopping': 'Shopping',
        'other': 'Other'
      };
      
      const budgetCategory = categoryMap[expense.category] || 'Other';
      setBudgets(prev => prev.map(budget => 
        budget.category === budgetCategory 
          ? { ...budget, spent: budget.spent - expense.amount, remaining: budget.remaining + expense.amount }
          : budget
      ));
    }
    
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRemaining = travelPlan.totalBudget - totalSpent;
  const daysRemaining = Math.ceil((new Date(travelPlan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Advanced Travel Money Calculator & Budget Planner",
    "description": "Professional travel money calculator with budget planning, expense tracking, and multi-currency support for international travel planning and financial management.",
    "url": "https://currencytocurrency.app/travel",
    "applicationCategory": "TravelApplication",
    "featureList": [
      "Advanced travel budget calculator",
      "Multi-currency expense tracking",
      "Budget planning and management",
      "Travel expense categorization",
      "Exchange rate integration",
      "Financial planning tools"
    ]
  };

  return (
    <div className="min-h-screen bg-converter-bg">
      <SEOHead
        title="Advanced Travel Money Calculator & Budget Planner | Currency to Currency"
        description="Professional travel money calculator with budget planning, expense tracking, and multi-currency support. Plan your international trips with advanced financial tools and real-time exchange rates."
        keywords="travel money calculator, travel budget planner, international travel money, currency exchange travel, travel expense tracker, multi-currency budget, travel financial planning"
        canonical="https://currencytocurrency.app/travel"
        structuredData={structuredData}
      />
      
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <WebPOptimizedImage
          src={travelHero}
          webpSrc={travelHeroWebP}
          alt="Advanced travel money calculator with budget planning tools and multi-currency support for international travel financial management"
          width={1200}
          height={320}
          className="w-full h-full"
          loading="eager"
          priority={true}
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Advanced Travel Money Planner</h1>
            <p className="text-lg md:text-xl opacity-90">
              Professional budget planning and expense tracking for international travel
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 -mt-16 relative z-10">
        <div className="bg-converter-bg rounded-lg shadow-lg p-6 mb-8">
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            Plan your international trips with professional-grade financial tools including budget planning, 
            expense tracking, multi-currency support, and real-time exchange rate integration.
          </p>
        </div>
        
        {/* Main Travel Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Travel Plan Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    Travel Plan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Destination</label>
                        <Input
                          value={travelPlan.destination}
                          onChange={(e) => setTravelPlan(prev => ({ ...prev, destination: e.target.value }))}
                          placeholder="Enter destination"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Start Date</label>
                          <Input
                            type="date"
                            value={travelPlan.startDate}
                            onChange={(e) => setTravelPlan(prev => ({ ...prev, startDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">End Date</label>
                          <Input
                            type="date"
                            value={travelPlan.endDate}
                            onChange={(e) => setTravelPlan(prev => ({ ...prev, endDate: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Base Currency</label>
                          <Select value={travelPlan.baseCurrency} onValueChange={(value) => setTravelPlan(prev => ({ ...prev, baseCurrency: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="JPY">JPY</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Local Currency</label>
                          <Select value={travelPlan.localCurrency} onValueChange={(value) => setTravelPlan(prev => ({ ...prev, localCurrency: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(exchangeRates).map(currency => (
                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Exchange Rate</label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={travelPlan.exchangeRate}
                          onChange={(e) => setTravelPlan(prev => ({ ...prev, exchangeRate: parseFloat(e.target.value) || 0 }))}
                          placeholder="Exchange rate"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${totalSpent.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${totalRemaining.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Remaining Budget</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {daysRemaining > 0 ? daysRemaining : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Remaining</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ${(totalRemaining / Math.max(daysRemaining, 1)).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Daily Budget</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Destinations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Popular Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {popularDestinations.map((dest) => (
                    <div key={dest.name} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{dest.flag}</span>
                        <div>
                          <div className="font-semibold">{dest.name}</div>
                          <div className="text-sm text-muted-foreground">{dest.currency}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-semibold">1 USD = {dest.rate.toFixed(4)} {dest.currency}</div>
                        <div className="text-sm text-muted-foreground">
                          {dest.currency} 100 = ${(100 / dest.rate).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Budget Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgets.map((budget, index) => (
                    <div key={budget.category} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{budget.category}</h3>
                        <div className="text-sm text-muted-foreground">
                          {budget.currency} {budget.allocated.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            budget.spent / budget.allocated > 0.8 ? 'bg-red-500' : 
                            budget.spent / budget.allocated > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%` }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Allocated:</span>
                          <div className="font-semibold">${budget.allocated.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Spent:</span>
                          <div className="font-semibold">${budget.spent.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Remaining:</span>
                          <div className="font-semibold">${budget.remaining.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Expense Tracking</h2>
              <Button onClick={() => setShowExpenseForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>

            {/* Add Expense Form */}
            {showExpenseForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Expense
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
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
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Input
                        value={newExpense.description}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Expense description"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Currency</label>
                      <Select value={newExpense.currency} onValueChange={(value) => setNewExpense(prev => ({ ...prev, currency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Date</label>
                      <Input
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Input
                        value={newExpense.location}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Location"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Input
                      value={newExpense.notes}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes"
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button onClick={addExpense} className="flex-1">
                      Add Expense
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowExpenseForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Expenses List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
                    <p className="text-sm">Add your first expense to start tracking</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.map((expense) => {
                      const category = expenseCategories.find(c => c.value === expense.category);
                      const IconComponent = category?.icon || Gift;
                      
                      return (
                        <div key={expense.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <IconComponent className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{expense.description}</h3>
                                <div className="text-sm text-muted-foreground">
                                  {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)} • {expense.location}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(expense.date).toLocaleDateString()}
                                </div>
                                {expense.notes && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {expense.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-mono font-semibold text-lg">
                                {expense.currency} {expense.amount.toFixed(2)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ${(expense.amount * (exchangeRates[expense.currency as keyof typeof exchangeRates] || 1)).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteExpense(expense.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Travel Planning Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Budget Planning</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Daily Budget (USD)</label>
                        <Input
                          type="number"
                          step="1"
                          value={travelPlan.dailyBudget}
                          onChange={(e) => setTravelPlan(prev => ({ ...prev, dailyBudget: parseFloat(e.target.value) || 0 }))}
                          placeholder="150"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Total Budget (USD)</label>
                        <Input
                          type="number"
                          step="1"
                          value={travelPlan.totalBudget}
                          onChange={(e) => setTravelPlan(prev => ({ ...prev, totalBudget: parseFloat(e.target.value) || 0 }))}
                          placeholder="1050"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Exchange Rate Calculator</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Amount (USD)</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="100"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Convert to {travelPlan.localCurrency}</label>
                        <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center font-mono">
                          {(100 * travelPlan.exchangeRate).toFixed(2)} {travelPlan.localCurrency}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Travel;