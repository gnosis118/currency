import { useState, useEffect, useCallback } from 'react';
import { ShareButton } from '@/components/ShareButton';
import { InstallPrompt } from '@/components/InstallPrompt';
import PopularPairs from '@/components/PopularPairs';
import CurrencyGuide from '@/components/CurrencyGuide';
import SEOHead from '@/components/SEOHead';
import InternalLinking from '@/components/InternalLinking';
import WebPOptimizedImage from '@/components/WebPOptimizedImage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import homeHero from '@/assets/home-hero.jpg';
import homeHeroWebP from '@/assets/home-hero.webp';

interface ExchangeRates {
  [key: string]: number;
}

interface CryptoPrice {
  [key: string]: number;
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

const cryptocurrencies = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'tether', name: 'Tether', symbol: 'USDT' },
  { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC' },
  { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'the-open-network', name: 'Toncoin', symbol: 'TON' },
  { id: 'tron', name: 'TRON', symbol: 'TRX' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB' },
  { id: 'matic-network', name: 'Polygon', symbol: 'MATIC' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH' },
  { id: 'wrapped-bitcoin', name: 'Wrapped Bitcoin', symbol: 'WBTC' },
  { id: 'dai', name: 'DAI (MakerDAO Stablecoin)', symbol: 'DAI' },
  { id: 'stellar', name: 'Stellar Lumens', symbol: 'XLM' },
  { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM' },
  { id: 'leo-token', name: 'UNUS SED LEO', symbol: 'LEO' },
  { id: 'monero', name: 'Monero', symbol: 'XMR' },
  { id: 'okb', name: 'OKB Token', symbol: 'OKB' },
  { id: 'crypto-com-chain', name: 'Cronos (Crypto.com)', symbol: 'CRO' },
  { id: 'near', name: 'Near Protocol', symbol: 'NEAR' },
  { id: 'internet-computer', name: 'Internet Computer', symbol: 'ICP' },
  { id: 'quant-network', name: 'Quant Network', symbol: 'QNT' },
  { id: 'filecoin', name: 'Filecoin', symbol: 'FIL' },
  { id: 'aptos', name: 'Aptos', symbol: 'APT' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB' },
  { id: 'maker', name: 'Maker', symbol: 'MKR' },
  { id: 'aave', name: 'Aave', symbol: 'AAVE' },
  { id: 'elrond-erd-2', name: 'MultiversX (Elrond)', symbol: 'EGLD' },
  { id: 'the-sandbox', name: 'The Sandbox', symbol: 'SAND' },
  { id: 'axie-infinity', name: 'Axie Infinity', symbol: 'AXS' },
  { id: 'theta-token', name: 'Theta Network', symbol: 'THETA' },
  { id: 'render-token', name: 'Render Token', symbol: 'RNDR' },
  { id: 'flow', name: 'Flow', symbol: 'FLOW' },
  { id: 'decentraland', name: 'Decentraland', symbol: 'MANA' },
  { id: 'chiliz', name: 'Chiliz', symbol: 'CHZ' },
  { id: 'lido-dao', name: 'Lido DAO', symbol: 'LDO' },
  { id: 'the-graph', name: 'The Graph', symbol: 'GRT' },
  { id: 'blockstack', name: 'Stacks', symbol: 'STX' },
  { id: 'algorand', name: 'Algorand', symbol: 'ALGO' },
  { id: 'injective-protocol', name: 'Injective Protocol', symbol: 'INJ' },
  { id: 'kaspa', name: 'Kaspa', symbol: 'KAS' },
  { id: 'fantom', name: 'Fantom', symbol: 'FTM' },
  { id: 'celestia', name: 'Celestia', symbol: 'TIA' },
  { id: 'ethereum-name-service', name: 'Ethereum Name Service', symbol: 'ENS' },
  { id: 'stepn', name: 'STEPN', symbol: 'GMT' },
  { id: 'immutable-x', name: 'Immutable X', symbol: 'IMX' },
  { id: 'optimism', name: 'Optimism', symbol: 'OP' },
  { id: 'pyth-network', name: 'Pyth Network', symbol: 'PYTH' },
  { id: 'dydx', name: 'dYdX', symbol: 'DYDX' },
  { id: 'oasis-network', name: 'Oasis Network', symbol: 'ROSE' },
  { id: 'zcash', name: 'Zcash', symbol: 'ZEC' },
  { id: 'terra-luna', name: 'Terra Classic', symbol: 'LUNC' },
  { id: 'hedera-hashgraph', name: 'Hedera Hashgraph', symbol: 'HBAR' },
  { id: 'bitcoin-gold', name: 'Bitcoin Gold', symbol: 'BTG' },
  { id: 'sui', name: 'Sui', symbol: 'SUI' },
  { id: 'conflux-token', name: 'Conflux', symbol: 'CFX' },
  { id: 'celo', name: 'CELO', symbol: 'CELO' },
  { id: 'neo', name: 'NEO', symbol: 'NEO' },
  { id: 'kava', name: 'Kava', symbol: 'KAVA' },
  { id: 'iota', name: 'IOTA', symbol: 'IOTA' },
  { id: 'mina-protocol', name: 'Mina Protocol', symbol: 'MINA' },
  { id: 'thorchain', name: 'Thorchain', symbol: 'RUNE' },
  { id: 'xdce-crowd-sale', name: 'XDC Network', symbol: 'XDC' },
  { id: 'vechain', name: 'VeChain', symbol: 'VET' },
  { id: 'bitcoin-cash-sv', name: 'Bitcoin SV', symbol: 'BSV' },
  { id: 'stratis', name: 'Stratis', symbol: 'STRAX' },
  { id: 'ecash', name: 'eCash', symbol: 'XEC' },
  { id: 'osmosis', name: 'Osmosis', symbol: 'OSMO' },
  { id: 'nexo', name: 'Nexo', symbol: 'NEXO' },
  { id: 'secret', name: 'Secret Network', symbol: 'SCRT' },
  { id: 'zilliqa', name: 'Zilliqa', symbol: 'ZIL' },
  { id: 'ankr', name: 'Ankr', symbol: 'ANKR' },
  { id: 'gala', name: 'Gala Games', symbol: 'GALA' },
  { id: 'baby-doge-coin', name: 'Baby Doge Coin', symbol: 'BABYDOGE' },
];

const Index = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [cryptoAmount, setCryptoAmount] = useState('1');
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [cryptoTargetCurrency, setCryptoTargetCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [cryptoPrice, setCryptoPrice] = useState<CryptoPrice>({});
  const [fiatLoading, setFiatLoading] = useState(false);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchExchangeRates = useCallback(async (baseCurrency: string) => {
    try {
      setFiatLoading(true);
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      const data = await response.json();
      setExchangeRates(data.rates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Exchange rate fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setFiatLoading(false);
    }
  }, [toast]);

  const fetchCryptoPrice = useCallback(async (cryptoId: string, vsCurrency: string) => {
    try {
      setCryptoLoading(true);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${vsCurrency.toLowerCase()}&include_24hr_change=true`
      );
      if (!response.ok) throw new Error('Failed to fetch crypto price');
      const data = await response.json();
      setCryptoPrice(data[cryptoId]);
    } catch (error) {
      console.error('Crypto price fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cryptocurrency prices. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCryptoLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExchangeRates(fromCurrency);
  }, [fromCurrency, fetchExchangeRates]);

  useEffect(() => {
    fetchCryptoPrice(selectedCrypto, cryptoTargetCurrency);
  }, [selectedCrypto, cryptoTargetCurrency, fetchCryptoPrice]);

  const convertedAmount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !exchangeRates[toCurrency]) return '0.00';
    
    if (fromCurrency === toCurrency) return numAmount.toFixed(2);
    
    const rate = exchangeRates[toCurrency];
    return (numAmount * rate).toFixed(2);
  };

  const getExchangeRate = () => {
    if (!exchangeRates[toCurrency] || fromCurrency === toCurrency) return null;
    return `1 ${fromCurrency} = ${exchangeRates[toCurrency].toFixed(4)} ${toCurrency}`;
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCryptoPrice = (price: number) => {
    if (price >= 1) return price.toFixed(2);
    if (price >= 0.01) return price.toFixed(4);
    return price.toFixed(6);
  };

  const convertedCryptoAmount = () => {
    const numAmount = parseFloat(cryptoAmount);
    if (isNaN(numAmount) || !cryptoPrice[cryptoTargetCurrency.toLowerCase()]) return '0.00';
    
    const rate = cryptoPrice[cryptoTargetCurrency.toLowerCase()];
    return formatCryptoPrice(numAmount * rate);
  };

  const getCryptoChange = () => {
    const changeKey = `${cryptoTargetCurrency.toLowerCase()}_24h_change`;
    return cryptoPrice[changeKey] || 0;
  };

  const refresh = () => {
    fetchExchangeRates(fromCurrency);
    fetchCryptoPrice(selectedCrypto, cryptoTargetCurrency);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://currencytocurrency.app/#application",
        "name": "Currency to Currency Converter",
        "description": "Free real-time currency converter with support for 150+ fiat currencies and 100+ cryptocurrencies. Get instant exchange rates, historical charts, and price alerts.",
        "url": "https://currencytocurrency.app",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "HTML5, JavaScript",
        "softwareVersion": "2.0",
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0],
        "inLanguage": "en-US",
        "isAccessibleForFree": true,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": [
          "Real-time exchange rates",
          "150+ fiat currencies",
          "100+ cryptocurrencies", 
          "Historical rate charts",
          "Price alerts",
          "Travel money guides",
          "Offline conversion calculator",
          "Currency trend analysis"
        ],
        "creator": {
          "@type": "Organization",
          "@id": "https://currencytocurrency.app/#organization"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://currencytocurrency.app/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://currencytocurrency.app/#organization",
        "name": "Currency to Currency",
        "url": "https://currencytocurrency.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://currencytocurrency.app/icon-512.png",
          "width": 512,
          "height": 512
        },
        "sameAs": [
          "https://currencytocurrency.app"
        ]
      },
      {
        "@type": "Service",
        "@id": "https://currencytocurrency.app/#service",
        "name": "Currency Conversion Service",
        "description": "Professional currency conversion and exchange rate tracking service",
        "provider": {
          "@type": "Organization",
          "@id": "https://currencytocurrency.app/#organization"
        },
        "serviceType": "Currency Conversion",
        "areaServed": "Worldwide",
        "availableLanguage": "English"
      },
      {
        "@type": "FAQPage",
        "@id": "https://currencytocurrency.app/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How accurate are the exchange rates on Currency to Currency?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our exchange rates are updated in real-time from multiple financial data providers including banks and financial institutions. Rates are typically accurate within 0.1% of market rates."
            }
          },
          {
            "@type": "Question", 
            "name": "Which currencies are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We support over 150 fiat currencies and 100+ cryptocurrencies, including all major world currencies like USD, EUR, GBP, JPY, CAD, AUD, CHF, and more."
            }
          },
          {
            "@type": "Question",
            "name": "Is the currency converter free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our currency converter is completely free to use with no registration required."
            }
          },
          {
            "@type": "Question",
            "name": "Does Currency to Currency charge fees for currency conversion?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Currency to Currency is a free comparison tool. We don't charge conversion fees, but we help you find the best rates and lowest fees from various providers."
            }
          },
          {
            "@type": "Question",
            "name": "Can I set up price alerts for currency pairs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can set up custom price alerts for any currency pair. You'll receive notifications when your target exchange rate is reached."
            }
          },
          {
            "@type": "Question",
            "name": "Is the Currency to Currency app available offline?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Currency to Currency is a Progressive Web App (PWA) that works offline with cached exchange rates for basic conversions."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-converter-bg">
      <SEOHead
        title="Free Currency Converter - Live Exchange Rates | Currency to Currency"
        description="Convert 150+ currencies instantly with live rates. Free real-time forex calculator with crypto support, charts & alerts. No registration required."
        keywords="currency converter, exchange rates, live rates, cryptocurrency prices, currency conversion, foreign exchange, forex, bitcoin converter, real-time rates, USD to EUR, GBP to USD, currency calculator, money converter"
        canonical="https://currencytocurrency.app/"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <WebPOptimizedImage 
          src={homeHero}
          webpSrc={homeHeroWebP}
          alt="Professional currency conversion interface showing real-time exchange rates for international finance and travel planning" 
          width={1200}
          height={400}
          className="w-full h-full"
          loading="eager"
          priority={true}
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Currency Converter</h1>
            <p className="text-lg md:text-xl opacity-90">
              Get real-time exchange rates and convert currencies instantly
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 -mt-16 relative z-10">
        {/* Header */}
        <div className="bg-converter-bg rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center">
            <p className="text-muted-foreground text-xl mb-4">Convert 150+ currencies and cryptocurrencies with real-time rates</p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              Get instant currency conversions, track historical exchange rates, set price alerts, and access travel money tips. 
              Our free currency converter provides accurate real-time data for over 150 fiat currencies and 100+ cryptocurrencies.
            </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>✓ Real-time rates</span>
            <span>✓ 150+ currencies</span>
            <span>✓ Historical charts</span>
            <span>✓ Price alerts</span>
            <span>✓ Travel guides</span>
          </div>
        </div>

        {/* Popular Currency Pairs - Internal Linking */}
        <div className="mb-8 bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Popular Currency Conversions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/usd-to-eur" className="text-primary hover:text-primary-hover transition-colors p-2 rounded border hover:border-primary text-center">
              USD to EUR
            </a>
            <a href="/gbp-to-usd" className="text-primary hover:text-primary-hover transition-colors p-2 rounded border hover:border-primary text-center">
              GBP to USD
            </a>
            <a href="/eur-to-gbp" className="text-primary hover:text-primary-hover transition-colors p-2 rounded border hover:border-primary text-center">
              EUR to GBP
            </a>
            <a href="/usd-to-cad" className="text-primary hover:text-primary-hover transition-colors p-2 rounded border hover:border-primary text-center">
              USD to CAD
            </a>
            <a href="/jpy-to-usd" className="text-primary hover:text-primary-hover transition-colors p-2 rounded border hover:border-primary text-center">
              JPY to USD
            </a>
            <a href="/aud-to-usd" className="text-primary hover:text-primary-hover transition-colors p-2 rounded border hover:border-primary text-center">
              AUD to USD
            </a>
            <a href="/usd-to-chf" className="text-primary hover:text-primary-hover transition-colors p-2 rounded border hover:border-primary text-center">
              USD to CHF
            </a>
            <a href="/eur-to-jpy" className="text-primary hover:text-primary-hover transition-colors p-2 rounded border hover:border-primary text-center">
              EUR to JPY
            </a>
          </div>
        </div>
      </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Fiat Currency Converter */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Currency Converter</span>
                <Button variant="ghost" size="sm" onClick={refresh} disabled={fiatLoading}>
                  <RefreshCw className={`h-4 w-4 ${fiatLoading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">From</label>
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
                  <label className="text-sm font-medium text-muted-foreground">To</label>
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

              <div className="bg-price-bg p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-foreground">
                    {fiatLoading ? (
                      <div className="animate-pulse bg-muted h-8 w-32 rounded" />
                    ) : (
                      `${convertedAmount()} ${toCurrency}`
                    )}
                  </div>
                  {!fiatLoading && amount && convertedAmount() !== '0.00' && (
                    <ShareButton
                      fromCurrency={fromCurrency}
                      toCurrency={toCurrency}
                      amount={amount}
                      convertedAmount={convertedAmount()}
                      rate={(exchangeRates[toCurrency] || 0).toString()}
                    />
                  )}
                </div>
                
                {!fiatLoading && getExchangeRate() && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {getExchangeRate()}
                  </div>
                )}
                
                {lastUpdated && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cryptocurrency Converter */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cryptocurrency</span>
                <Button variant="ghost" size="sm" onClick={refresh} disabled={cryptoLoading}>
                  <RefreshCw className={`h-4 w-4 ${cryptoLoading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <Input
                  type="number"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Cryptocurrency</label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {cryptocurrencies.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{crypto.symbol}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-sm">{crypto.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">To</label>
                  <Select value={cryptoTargetCurrency} onValueChange={setCryptoTargetCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fiatCurrencies.slice(0, 10).map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-price-bg p-4 rounded-lg">
                <div className="text-3xl font-bold text-foreground">
                  {cryptoLoading ? (
                    <div className="animate-pulse bg-muted h-8 w-32 rounded" />
                  ) : (
                    `${convertedCryptoAmount()} ${cryptoTargetCurrency}`
                  )}
                </div>
                
                {!cryptoLoading && cryptoPrice[cryptoTargetCurrency.toLowerCase()] && (
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-muted-foreground">
                      1 {cryptocurrencies.find(c => c.id === selectedCrypto)?.symbol} = {formatCryptoPrice(cryptoPrice[cryptoTargetCurrency.toLowerCase()])} {cryptoTargetCurrency}
                    </div>
                    <div className={`flex items-center text-sm ${getCryptoChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {getCryptoChange() >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(getCryptoChange()).toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Currency Pairs Section */}
        <div className="mt-12">
          <PopularPairs />
        </div>

        {/* Currency Guide Section */}
        <div className="mt-12">
          <CurrencyGuide />
        </div>

        {/* SEO Content Section */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4 text-foreground">How to Use Our Currency Converter</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Our free currency converter provides real-time exchange rates for over 40 fiat currencies and 80+ cryptocurrencies.</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Enter the amount you want to convert</li>
                <li>Select your source currency (from)</li>
                <li>Choose your target currency (to)</li>
                <li>View the converted amount instantly</li>
                <li>Set up rate alerts for your favorite pairs</li>
              </ol>
              <p>Perfect for international business, travel planning, forex trading, and cryptocurrency investments.</p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Why Choose Currency to Currency?</h2>
            <div className="space-y-3 text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Real-time rates:</strong> Live data from trusted financial APIs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Historical charts:</strong> Track trends up to 90 days</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Price alerts:</strong> Get notified when rates hit your target</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Travel tools:</strong> Budget planning for international trips</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Mobile ready:</strong> Works perfectly on all devices</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Internal Linking */}
        <div className="mt-12">
          <InternalLinking currentPage="home" className="bg-card p-6 rounded-lg border" />
        </div>

        {/* Install Prompt */}
        <div className="mt-8">
          <InstallPrompt />
        </div>
      </div>
    </div>
  );
};

export default Index;