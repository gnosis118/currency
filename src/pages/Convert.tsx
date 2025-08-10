import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, TrendingUp, Clock, Globe } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import CurrencyConverter from '@/components/CurrencyConverter';
import PopularPairs from '@/components/PopularPairs';

const Convert = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'BTC', name: 'Bitcoin', flag: '₿' },
    { code: 'ETH', name: 'Ethereum', flag: 'Ξ' }
  ];

  const popularPairs = [
    { from: 'USD', to: 'EUR', pair: 'usd-to-eur' },
    { from: 'USD', to: 'GBP', pair: 'usd-to-gbp' },
    { from: 'USD', to: 'JPY', pair: 'usd-to-jpy' },
    { from: 'EUR', to: 'USD', pair: 'eur-to-usd' },
    { from: 'EUR', to: 'GBP', pair: 'eur-to-gbp' },
    { from: 'GBP', to: 'USD', pair: 'gbp-to-usd' },
    { from: 'USD', to: 'CAD', pair: 'usd-to-cad' },
    { from: 'USD', to: 'AUD', pair: 'usd-to-aud' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Currency Converter - Live Exchange Rates",
    "description": "Convert between 150+ currencies with real-time exchange rates. Free currency converter with live rates for fiat currencies and cryptocurrencies.",
    "url": "https://currencytocurrency.app/convert",
    "mainEntity": {
      "@type": "FinancialProduct",
      "name": "Currency Converter",
      "description": "Real-time currency conversion tool supporting 150+ fiat currencies and 100+ cryptocurrencies",
      "provider": {
        "@type": "Organization",
        "name": "Currency to Currency"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://currencytocurrency.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Convert",
          "item": "https://currencytocurrency.app/convert"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <SEOHead
        title="Currency Converter - Live Exchange Rates for 150+ Currencies | Currency to Currency"
        description="Convert between 150+ currencies with real-time exchange rates. Free currency converter with live rates for fiat currencies and cryptocurrencies. Updated every minute."
        keywords="currency converter, exchange rates, live rates, currency conversion, forex converter, cryptocurrency converter, real-time rates, USD EUR GBP JPY converter"
        canonical="https://currencytocurrency.app/convert"
        structuredData={structuredData}
      />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Currency Converter
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Convert between 150+ fiat currencies and 100+ cryptocurrencies
          </p>
          <p className="text-muted-foreground">
            Real-time exchange rates • Updated every minute • Free to use
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Quick Currency Converter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CurrencyConverter />
              </CardContent>
            </Card>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Popular Currency Pairs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularPairs.map(({ from, to, pair }) => (
                  <Link
                    key={pair}
                    to={`/convert/${pair}`}
                    className="group block p-4 bg-card hover:bg-accent rounded-lg transition-colors border"
                  >
                    <div className="font-semibold text-foreground group-hover:text-accent-foreground">
                      {from} → {to}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {from} to {to} converter
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Supported Currencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">FIAT CURRENCIES</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {popularCurrencies.filter(c => !['BTC', 'ETH'].includes(c.code)).map(currency => (
                        <div key={currency.code} className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span className="font-mono">{currency.code}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">+ 140 more currencies</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">CRYPTOCURRENCIES</h3>
                    <div className="space-y-1 text-sm">
                      {popularCurrencies.filter(c => ['BTC', 'ETH'].includes(c.code)).map(currency => (
                        <div key={currency.code} className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span className="font-mono">{currency.code}</span>
                          <span className="text-muted-foreground">{currency.name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">+ 100 more cryptocurrencies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Real-time Rates</div>
                    <div className="text-sm text-muted-foreground">Updated every minute</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">150+ Currencies</div>
                    <div className="text-sm text-muted-foreground">All major fiat & crypto</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Historical Charts</div>
                    <div className="text-sm text-muted-foreground">View rate trends</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link to="/charts">
                    <Button variant="outline" className="w-full">
                      View Charts & Analysis
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Our Currency Converter?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Accurate Rates</h3>
                <p className="text-muted-foreground">
                  Real-time exchange rates from multiple financial data providers, ensuring accuracy within 0.1% of market rates.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  Support for 150+ fiat currencies and 100+ cryptocurrencies, covering all major and minor currencies worldwide.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Free & Fast</h3>
                <p className="text-muted-foreground">
                  Completely free to use with no registration required. Lightning-fast calculations and instant results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convert;