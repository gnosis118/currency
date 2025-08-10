import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plane, CreditCard, MapPin, ExternalLink, Calculator, Globe } from 'lucide-react';

interface CountryInfo {
  name: string;
  currency: string;
  currencyName: string;
  flag: string;
  exchangeRate: number; // USD to local currency
  averageDailyBudget: {
    budget: number;
    midRange: number;
    luxury: number;
  };
  travelTips: string[];
  moneyTransferOptions: string[];
}

const countries: Record<string, CountryInfo> = {
  'united-states': {
    name: 'United States',
    currency: 'USD',
    currencyName: 'US Dollar',
    flag: '🇺🇸',
    exchangeRate: 1.0,
    averageDailyBudget: { budget: 75, midRange: 150, luxury: 300 },
    travelTips: [
      'Credit cards widely accepted everywhere',
      'Tipping 18-20% is standard in restaurants',
      'Sales tax added at checkout'
    ],
    moneyTransferOptions: ['Zelle', 'Venmo', 'Cash App', 'Bank transfers']
  },
  'eurozone': {
    name: 'Eurozone Countries',
    currency: 'EUR',
    currencyName: 'Euro',
    flag: '🇪🇺',
    exchangeRate: 0.92,
    averageDailyBudget: { budget: 60, midRange: 120, luxury: 250 },
    travelTips: [
      'Euro used in 19 countries',
      'Cash still preferred in some regions',
      'Service charge often included in bills'
    ],
    moneyTransferOptions: ['Wise', 'Revolut', 'Remitly', 'Bank transfers']
  },
  'japan': {
    name: 'Japan',
    currency: 'JPY',
    currencyName: 'Japanese Yen',
    flag: '🇯🇵',
    exchangeRate: 148,
    averageDailyBudget: { budget: 8000, midRange: 15000, luxury: 30000 },
    travelTips: [
      'Cash is still king in Japan',
      'ATMs may not accept foreign cards',
      'No tipping culture'
    ],
    moneyTransferOptions: ['Wise', '7-Eleven ATMs', 'Japan Post Bank', 'Citibank']
  },
  'united-kingdom': {
    name: 'United Kingdom',
    currency: 'GBP',
    currencyName: 'British Pound',
    flag: '🇬🇧',
    exchangeRate: 0.79,
    averageDailyBudget: { budget: 50, midRange: 100, luxury: 200 },
    travelTips: [
      'Contactless payment is widely accepted',
      'Tipping 10-15% in restaurants is customary',
      'Many pubs and restaurants add service charge'
    ],
    moneyTransferOptions: ['Wise', 'Revolut', 'Western Union', 'Bank transfers']
  },
  'switzerland': {
    name: 'Switzerland',
    currency: 'CHF',
    currencyName: 'Swiss Franc',
    flag: '🇨🇭',
    exchangeRate: 0.88,
    averageDailyBudget: { budget: 100, midRange: 200, luxury: 400 },
    travelTips: [
      'One of the most expensive countries',
      'Cash and cards both accepted',
      'Service charge included in bills'
    ],
    moneyTransferOptions: ['Wise', 'Revolut', 'Bank transfers', 'Swiss banks']
  },
  'canada': {
    name: 'Canada',
    currency: 'CAD',
    currencyName: 'Canadian Dollar',
    flag: '🇨🇦',
    exchangeRate: 1.35,
    averageDailyBudget: { budget: 70, midRange: 140, luxury: 280 },
    travelTips: [
      'Credit cards widely accepted',
      'Tipping 15-20% is standard',
      'Interac debit cards common'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'Western Union', 'Bank transfers']
  },
  'australia': {
    name: 'Australia',
    currency: 'AUD',
    currencyName: 'Australian Dollar',
    flag: '🇦🇺',
    exchangeRate: 1.52,
    averageDailyBudget: { budget: 80, midRange: 150, luxury: 300 },
    travelTips: [
      'Cashless payments very common',
      'No tipping expected but appreciated',
      'Round to nearest 5 cents for cash'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'Western Union', 'Bank transfers']
  },
  'new-zealand': {
    name: 'New Zealand',
    currency: 'NZD',
    currencyName: 'New Zealand Dollar',
    flag: '🇳🇿',
    exchangeRate: 1.62,
    averageDailyBudget: { budget: 75, midRange: 140, luxury: 280 },
    travelTips: [
      'Cards accepted everywhere',
      'No tipping culture',
      'GST included in prices'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'Western Union', 'Bank transfers']
  },
  'china': {
    name: 'China',
    currency: 'CNY',
    currencyName: 'Chinese Yuan',
    flag: '🇨🇳',
    exchangeRate: 7.15,
    averageDailyBudget: { budget: 200, midRange: 400, luxury: 800 },
    travelTips: [
      'Mobile payments (WeChat/Alipay) dominant',
      'Cash still useful for small vendors',
      'No tipping expected'
    ],
    moneyTransferOptions: ['Bank transfers', 'Western Union', 'MoneyGram']
  },
  'hong-kong': {
    name: 'Hong Kong',
    currency: 'HKD',
    currencyName: 'Hong Kong Dollar',
    flag: '🇭🇰',
    exchangeRate: 7.8,
    averageDailyBudget: { budget: 400, midRange: 700, luxury: 1200 },
    travelTips: [
      'Cards widely accepted',
      'Octopus card for transport and shopping',
      'Service charge often included'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'Bank transfers', 'Western Union']
  },
  'singapore': {
    name: 'Singapore',
    currency: 'SGD',
    currencyName: 'Singapore Dollar',
    flag: '🇸🇬',
    exchangeRate: 1.35,
    averageDailyBudget: { budget: 60, midRange: 120, luxury: 250 },
    travelTips: [
      'Cashless society - cards everywhere',
      'No tipping required',
      'GST included in prices'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'DBS Bank', 'Western Union']
  },
  'sweden': {
    name: 'Sweden',
    currency: 'SEK',
    currencyName: 'Swedish Krona',
    flag: '🇸🇪',
    exchangeRate: 10.5,
    averageDailyBudget: { budget: 600, midRange: 1000, luxury: 1800 },
    travelTips: [
      'Nearly cashless society',
      'Swish mobile payments popular',
      'No tipping required'
    ],
    moneyTransferOptions: ['Wise', 'Revolut', 'Swedbank', 'Western Union']
  },
  'norway': {
    name: 'Norway',
    currency: 'NOK',
    currencyName: 'Norwegian Krone',
    flag: '🇳🇴',
    exchangeRate: 10.8,
    averageDailyBudget: { budget: 800, midRange: 1200, luxury: 2000 },
    travelTips: [
      'Very expensive country',
      'Cards accepted everywhere',
      'No tipping culture'
    ],
    moneyTransferOptions: ['Wise', 'Revolut', 'DNB Bank', 'Western Union']
  },
  'denmark': {
    name: 'Denmark',
    currency: 'DKK',
    currencyName: 'Danish Krone',
    flag: '🇩🇰',
    exchangeRate: 6.9,
    averageDailyBudget: { budget: 500, midRange: 800, luxury: 1400 },
    travelTips: [
      'Cards preferred over cash',
      'MobilePay widely used',
      'Service charge often included'
    ],
    moneyTransferOptions: ['Wise', 'Revolut', 'Danske Bank', 'Western Union']
  },
  'russia': {
    name: 'Russia',
    currency: 'RUB',
    currencyName: 'Russian Ruble',
    flag: '🇷🇺',
    exchangeRate: 95,
    averageDailyBudget: { budget: 2000, midRange: 4000, luxury: 8000 },
    travelTips: [
      'Cash still important',
      'Mir payment system domestic',
      'Limited international card acceptance'
    ],
    moneyTransferOptions: ['Local banks', 'Cash exchange', 'Cryptoexchanges']
  },
  'turkey': {
    name: 'Turkey',
    currency: 'TRY',
    currencyName: 'Turkish Lira',
    flag: '🇹🇷',
    exchangeRate: 28.5,
    averageDailyBudget: { budget: 400, midRange: 700, luxury: 1200 },
    travelTips: [
      'Cash preferred in many places',
      'Bargaining common in markets',
      'Service charge often included'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Local banks', 'MoneyGram']
  },
  'india': {
    name: 'India',
    currency: 'INR',
    currencyName: 'Indian Rupee',
    flag: '🇮🇳',
    exchangeRate: 83,
    averageDailyBudget: { budget: 1500, midRange: 3000, luxury: 6000 },
    travelTips: [
      'UPI payments very popular',
      'Cash still important',
      'Bargaining common'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'Western Union', 'Local banks']
  },
  'brazil': {
    name: 'Brazil',
    currency: 'BRL',
    currencyName: 'Brazilian Real',
    flag: '🇧🇷',
    exchangeRate: 5.0,
    averageDailyBudget: { budget: 120, midRange: 200, luxury: 400 },
    travelTips: [
      'PIX payments very popular',
      'Cards widely accepted',
      'Service charge often included'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'Western Union', 'Local banks']
  },
  'south-africa': {
    name: 'South Africa',
    currency: 'ZAR',
    currencyName: 'South African Rand',
    flag: '🇿🇦',
    exchangeRate: 18.5,
    averageDailyBudget: { budget: 600, midRange: 1000, luxury: 1800 },
    travelTips: [
      'Cards widely accepted',
      'Cash useful for tips and small vendors',
      'Tipping 10-15% standard'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'FNB Bank', 'MoneyGram']
  },
  'mexico': {
    name: 'Mexico',
    currency: 'MXN',
    currencyName: 'Mexican Peso',
    flag: '🇲🇽',
    exchangeRate: 17.2,
    averageDailyBudget: { budget: 600, midRange: 1000, luxury: 2000 },
    travelTips: [
      'Cash preferred in many places',
      'Cards accepted in tourist areas',
      'Tipping 10-15% expected'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'Western Union', 'OXXO']
  },
  'south-korea': {
    name: 'South Korea',
    currency: 'KRW',
    currencyName: 'South Korean Won',
    flag: '🇰🇷',
    exchangeRate: 1320,
    averageDailyBudget: { budget: 50000, midRange: 80000, luxury: 150000 },
    travelTips: [
      'Cards accepted everywhere',
      'KakaoPay popular for mobile payments',
      'No tipping culture'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'KB Bank', 'MoneyGram']
  },
  'thailand': {
    name: 'Thailand',
    currency: 'THB',
    currencyName: 'Thai Baht',
    flag: '🇹🇭',
    exchangeRate: 36,
    averageDailyBudget: { budget: 800, midRange: 1500, luxury: 3000 },
    travelTips: [
      'Cash still important',
      'Cards accepted in malls and hotels',
      'Bargaining common in markets'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Bangkok Bank', 'MoneyGram']
  },
  'poland': {
    name: 'Poland',
    currency: 'PLN',
    currencyName: 'Polish Zloty',
    flag: '🇵🇱',
    exchangeRate: 4.0,
    averageDailyBudget: { budget: 150, midRange: 250, luxury: 450 },
    travelTips: [
      'Cards widely accepted',
      'BLIK mobile payments popular',
      'Tipping 10% standard'
    ],
    moneyTransferOptions: ['Wise', 'Revolut', 'PKO Bank', 'Western Union']
  },
  'hungary': {
    name: 'Hungary',
    currency: 'HUF',
    currencyName: 'Hungarian Forint',
    flag: '🇭🇺',
    exchangeRate: 355,
    averageDailyBudget: { budget: 12000, midRange: 20000, luxury: 35000 },
    travelTips: [
      'Cards accepted in most places',
      'Cash useful for small vendors',
      'Service charge often included'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'OTP Bank', 'MoneyGram']
  },
  'czech-republic': {
    name: 'Czech Republic',
    currency: 'CZK',
    currencyName: 'Czech Koruna',
    flag: '🇨🇿',
    exchangeRate: 22.5,
    averageDailyBudget: { budget: 1200, midRange: 2000, luxury: 3500 },
    travelTips: [
      'Cards widely accepted',
      'Cash preferred in traditional pubs',
      'Tipping 10% standard'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Česká spořitelna', 'MoneyGram']
  },
  'israel': {
    name: 'Israel',
    currency: 'ILS',
    currencyName: 'Israeli Shekel',
    flag: '🇮🇱',
    exchangeRate: 3.7,
    averageDailyBudget: { budget: 250, midRange: 400, luxury: 700 },
    travelTips: [
      'Cards widely accepted',
      'Bit mobile payments popular',
      'Service charge often included'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Bank Hapoalim', 'MoneyGram']
  },
  'saudi-arabia': {
    name: 'Saudi Arabia',
    currency: 'SAR',
    currencyName: 'Saudi Riyal',
    flag: '🇸🇦',
    exchangeRate: 3.75,
    averageDailyBudget: { budget: 200, midRange: 350, luxury: 600 },
    travelTips: [
      'Cards widely accepted',
      'mada local payment system',
      'No tipping culture traditionally'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'SABB Bank', 'MoneyGram']
  },
  'uae': {
    name: 'United Arab Emirates',
    currency: 'AED',
    currencyName: 'UAE Dirham',
    flag: '🇦🇪',
    exchangeRate: 3.67,
    averageDailyBudget: { budget: 250, midRange: 450, luxury: 800 },
    travelTips: [
      'Cards accepted everywhere',
      'Apple Pay/Google Pay popular',
      'Service charge often included'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Emirates NBD', 'MoneyGram']
  },
  'malaysia': {
    name: 'Malaysia',
    currency: 'MYR',
    currencyName: 'Malaysian Ringgit',
    flag: '🇲🇾',
    exchangeRate: 4.6,
    averageDailyBudget: { budget: 100, midRange: 180, luxury: 350 },
    travelTips: [
      'Cash preferred in many places',
      'Cards accepted in malls',
      'No tipping required'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Maybank', 'MoneyGram']
  },
  'indonesia': {
    name: 'Indonesia',
    currency: 'IDR',
    currencyName: 'Indonesian Rupiah',
    flag: '🇮🇩',
    exchangeRate: 15600,
    averageDailyBudget: { budget: 400000, midRange: 700000, luxury: 1200000 },
    travelTips: [
      'Cash is king',
      'GoPay and OVO popular',
      'Bargaining common'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Bank Mandiri', 'MoneyGram']
  },
  'philippines': {
    name: 'Philippines',
    currency: 'PHP',
    currencyName: 'Philippine Peso',
    flag: '🇵🇭',
    exchangeRate: 56,
    averageDailyBudget: { budget: 1500, midRange: 2500, luxury: 4500 },
    travelTips: [
      'Cash widely used',
      'GCash mobile payments popular',
      'Tipping 10% appreciated'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'BDO Bank', 'Western Union']
  },
  'chile': {
    name: 'Chile',
    currency: 'CLP',
    currencyName: 'Chilean Peso',
    flag: '🇨🇱',
    exchangeRate: 900,
    averageDailyBudget: { budget: 35000, midRange: 60000, luxury: 100000 },
    travelTips: [
      'Cards widely accepted',
      'Cash useful for tips',
      'Service charge often included'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Banco de Chile', 'MoneyGram']
  },
  'colombia': {
    name: 'Colombia',
    currency: 'COP',
    currencyName: 'Colombian Peso',
    flag: '🇨🇴',
    exchangeRate: 4200,
    averageDailyBudget: { budget: 80000, midRange: 140000, luxury: 250000 },
    travelTips: [
      'Cash preferred in many places',
      'Cards accepted in cities',
      'Tipping 10% standard'
    ],
    moneyTransferOptions: ['Wise', 'Remitly', 'Bancolombia', 'Western Union']
  },
  'argentina': {
    name: 'Argentina',
    currency: 'ARS',
    currencyName: 'Argentine Peso',
    flag: '🇦🇷',
    exchangeRate: 365,
    averageDailyBudget: { budget: 8000, midRange: 15000, luxury: 28000 },
    travelTips: [
      'US dollars often preferred',
      'Blue dollar exchange rate',
      'Cash is king'
    ],
    moneyTransferOptions: ['Western Union', 'MoneyGram', 'Banco Nación', 'Cash exchange']
  },
  'vietnam': {
    name: 'Vietnam',
    currency: 'VND',
    currencyName: 'Vietnamese Dong',
    flag: '🇻🇳',
    exchangeRate: 24000,
    averageDailyBudget: { budget: 600000, midRange: 1000000, luxury: 1800000 },
    travelTips: [
      'Cash is king',
      'US dollars widely accepted',
      'Bargaining common'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Vietcombank', 'MoneyGram']
  },
  'pakistan': {
    name: 'Pakistan',
    currency: 'PKR',
    currencyName: 'Pakistani Rupee',
    flag: '🇵🇰',
    exchangeRate: 280,
    averageDailyBudget: { budget: 4000, midRange: 7000, luxury: 12000 },
    travelTips: [
      'Cash preferred',
      'JazzCash and EasyPaisa popular',
      'Bargaining common'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'HBL Bank', 'MoneyGram']
  },
  'egypt': {
    name: 'Egypt',
    currency: 'EGP',
    currencyName: 'Egyptian Pound',
    flag: '🇪🇬',
    exchangeRate: 31,
    averageDailyBudget: { budget: 500, midRange: 900, luxury: 1600 },
    travelTips: [
      'Cash widely used',
      'US dollars appreciated',
      'Bargaining expected'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'CIB Bank', 'MoneyGram']
  },
  'nigeria': {
    name: 'Nigeria',
    currency: 'NGN',
    currencyName: 'Nigerian Naira',
    flag: '🇳🇬',
    exchangeRate: 750,
    averageDailyBudget: { budget: 15000, midRange: 25000, luxury: 45000 },
    travelTips: [
      'Cash is important',
      'Bank transfers popular',
      'Mobile money growing'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'GTBank', 'MoneyGram']
  },
  'kenya': {
    name: 'Kenya',
    currency: 'KES',
    currencyName: 'Kenyan Shilling',
    flag: '🇰🇪',
    exchangeRate: 130,
    averageDailyBudget: { budget: 3000, midRange: 5000, luxury: 9000 },
    travelTips: [
      'M-Pesa mobile money dominant',
      'Cash still important',
      'US dollars for safaris'
    ],
    moneyTransferOptions: ['M-Pesa', 'Wise', 'Western Union', 'KCB Bank']
  },
  'taiwan': {
    name: 'Taiwan',
    currency: 'TWD',
    currencyName: 'Taiwan Dollar',
    flag: '🇹🇼',
    exchangeRate: 31.5,
    averageDailyBudget: { budget: 1200, midRange: 2000, luxury: 3500 },
    travelTips: [
      'Cash preferred in many places',
      'EasyCard for transport and convenience stores',
      'No tipping culture'
    ],
    moneyTransferOptions: ['Wise', 'Western Union', 'Cathay Bank', 'MoneyGram']
  }
};

const TravelMoney = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [tripDays, setTripDays] = useState<number>(7);
  const [budgetType, setBudgetType] = useState<'budget' | 'midRange' | 'luxury'>('midRange');
  const [usdAmount, setUsdAmount] = useState<number>(1000);

  const countryInfo = selectedCountry ? countries[selectedCountry] : null;

  const calculateBudget = () => {
    if (!countryInfo) return 0;
    return countryInfo.averageDailyBudget[budgetType] * tripDays;
  };

  const convertCurrency = (amount: number) => {
    if (!countryInfo) return 0;
    return (amount * countryInfo.exchangeRate).toFixed(2);
  };

  return (
    <div className="space-y-8">
      {/* Country Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Select Your Destination
          </CardTitle>
          <CardDescription>
            Choose your travel destination to get currency guides and budget estimates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a destination country" />
            </SelectTrigger>
            <SelectContent className="max-h-80 overflow-y-auto">
              {Object.entries(countries)
                .sort(([,a], [,b]) => a.name.localeCompare(b.name))
                .map(([key, country]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                    <Badge variant="outline">{country.currency}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {countryInfo && (
        <>
          {/* Currency Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {countryInfo.flag}
                {countryInfo.name} - {countryInfo.currencyName}
              </CardTitle>
              <CardDescription>
                Current exchange rate: 1 USD = {countryInfo.exchangeRate} {countryInfo.currency}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usd-amount">USD Amount</Label>
                  <Input
                    id="usd-amount"
                    type="number"
                    value={usdAmount}
                    onChange={(e) => setUsdAmount(Number(e.target.value))}
                    placeholder="Enter USD amount"
                  />
                </div>
                <div>
                  <Label>Converted Amount</Label>
                  <div className="text-2xl font-bold text-primary">
                    {convertCurrency(usdAmount)} {countryInfo.currency}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Trip Budget Calculator
              </CardTitle>
              <CardDescription>
                Estimate your daily expenses based on travel style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trip-days">Trip Duration (days)</Label>
                  <Input
                    id="trip-days"
                    type="number"
                    value={tripDays}
                    onChange={(e) => setTripDays(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <Label>Travel Style</Label>
                  <Select value={budgetType} onValueChange={(value: 'budget' | 'midRange' | 'luxury') => setBudgetType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget ({countryInfo.averageDailyBudget.budget} {countryInfo.currency}/day)</SelectItem>
                      <SelectItem value="midRange">Mid-range ({countryInfo.averageDailyBudget.midRange} {countryInfo.currency}/day)</SelectItem>
                      <SelectItem value="luxury">Luxury ({countryInfo.averageDailyBudget.luxury} {countryInfo.currency}/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">Estimated Total Budget</div>
                <div className="text-3xl font-bold text-primary">
                  {calculateBudget()} {countryInfo.currency}
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ ${(calculateBudget() / countryInfo.exchangeRate).toFixed(2)} USD
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Travel Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Money Tips for {countryInfo.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {countryInfo.travelTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Money Transfer Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Money Transfer Options
              </CardTitle>
              <CardDescription>
                Best ways to send or access money in {countryInfo.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {countryInfo.moneyTransferOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-12">
                  <Calculator className="h-4 w-4 mr-2" />
                  Currency Converter
                </Button>
                <Button variant="outline" className="h-12">
                  <MapPin className="h-4 w-4 mr-2" />
                  Travel Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TravelMoney;