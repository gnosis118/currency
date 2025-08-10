import { useState, useEffect, useCallback } from 'react';
import CookieConsent from './CookieConsent';
import HistoricalChart from './HistoricalChart';
import RateAlerts from './RateAlerts';
import TravelMoney from './TravelMoney';
import { ShareButton } from './ShareButton';
import { InstallPrompt } from './InstallPrompt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown, BarChart3, Bell, Plane } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const CurrencyConverter = () => {
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

  return (
    <div className="min-h-screen bg-converter-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Currency Converter</h1>
          <p className="text-muted-foreground text-lg">Real-time exchange rates and cryptocurrency prices</p>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Convert currencies instantly, track historical rates, set price alerts, and get travel money tips. 
            Our comprehensive currency tool provides everything you need for international finance, trading, and travel planning.
          </p>
        </div>

        <Tabs defaultValue="converter" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="converter">Converter</TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="travel" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Travel
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="converter" className="space-y-6">
            <p className="text-muted-foreground text-center mb-6">
              Convert between 40+ currencies and cryptocurrencies with live exchange rates. Share your conversions and install as a mobile app for quick access.
            </p>
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
                       inputMode="decimal"
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       placeholder="Enter amount"
                       className="text-lg min-h-11 touch-manipulation"
                       autoComplete="off"
                       style={{ fontSize: '16px' }}
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-2 items-end">
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-muted-foreground">From</label>
                       <Select value={fromCurrency} onValueChange={setFromCurrency}>
                         <SelectTrigger className="min-h-11 touch-manipulation">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="max-h-60 overflow-y-auto z-50 bg-background">
                           {fiatCurrencies.map((currency) => (
                             <SelectItem key={currency.code} value={currency.code} className="min-h-11 touch-manipulation">
                               <div className="flex items-center space-x-2">
                                 <span className="font-medium">{currency.code}</span>
                                 <span className="text-muted-foreground">-</span>
                                 <span className="text-sm truncate">{currency.name}</span>
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
                       className="mb-1 min-h-11 min-w-11 touch-manipulation"
                       aria-label="Swap currencies"
                     >
                       <ArrowUpDown className="h-4 w-4" />
                     </Button>

                     <div className="space-y-2">
                       <label className="text-sm font-medium text-muted-foreground">To</label>
                       <Select value={toCurrency} onValueChange={setToCurrency}>
                         <SelectTrigger className="min-h-11 touch-manipulation">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="max-h-60 overflow-y-auto z-50 bg-background">
                           {fiatCurrencies.map((currency) => (
                             <SelectItem key={currency.code} value={currency.code} className="min-h-11 touch-manipulation">
                               <div className="flex items-center space-x-2">
                                 <span className="font-medium">{currency.code}</span>
                                 <span className="text-muted-foreground">-</span>
                                 <span className="text-sm truncate">{currency.name}</span>
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
                          rate={getExchangeRate() || ''}
                        />
                      )}
                    </div>
                    {getExchangeRate() && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {getExchangeRate()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cryptocurrency Converter */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cryptocurrency Converter</span>
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
                       inputMode="decimal"
                       value={cryptoAmount}
                       onChange={(e) => setCryptoAmount(e.target.value)}
                       placeholder="Enter crypto amount"
                       className="text-lg min-h-11 touch-manipulation"
                       autoComplete="off"
                       style={{ fontSize: '16px' }}
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-muted-foreground">Cryptocurrency</label>
                       <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                         <SelectTrigger className="min-h-11 touch-manipulation">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="max-h-60 overflow-y-auto z-50 bg-background">
                           {cryptocurrencies.map((crypto) => (
                             <SelectItem key={crypto.id} value={crypto.id} className="min-h-11 touch-manipulation">
                               <div className="flex items-center space-x-2">
                                 <span className="font-medium">{crypto.symbol}</span>
                                 <span className="text-muted-foreground">-</span>
                                 <span className="text-sm truncate">{crypto.name}</span>
                               </div>
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-medium text-muted-foreground">Target Currency</label>
                       <Select value={cryptoTargetCurrency} onValueChange={setCryptoTargetCurrency}>
                         <SelectTrigger className="min-h-11 touch-manipulation">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="max-h-60 overflow-y-auto z-50 bg-background">
                           {fiatCurrencies.slice(0, 10).map((currency) => (
                             <SelectItem key={currency.code} value={currency.code} className="min-h-11 touch-manipulation">
                               <div className="flex items-center space-x-2">
                                 <span className="font-medium">{currency.code}</span>
                                 <span className="text-muted-foreground">-</span>
                                 <span className="text-sm truncate">{currency.name}</span>
                               </div>
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
                    
                    {!cryptoLoading && cryptoPrice && (
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-sm text-muted-foreground">24h change:</span>
                        <div className={`flex items-center space-x-1 ${getCryptoChange() >= 0 ? 'text-chart-positive' : 'text-chart-negative'}`}>
                          {getCryptoChange() >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {getCryptoChange().toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-6">
            <p className="text-muted-foreground text-center mb-6">
              Analyze currency trends with interactive historical charts. View 7, 30, or 90-day price movements to make informed exchange decisions.
            </p>
            <HistoricalChart 
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              currentRate={exchangeRates[toCurrency] || 0}
            />
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-6">
            <p className="text-muted-foreground text-center mb-6">
              Never miss the perfect exchange rate! Set email alerts to notify you when currencies reach your target prices, whether buying or selling.
            </p>
            <RateAlerts />
          </TabsContent>
          
          <TabsContent value="travel" className="space-y-6">
            <p className="text-muted-foreground text-center mb-6">
              Plan your international trips with essential currency guides, budget calculators, and money transfer recommendations for popular destinations.
            </p>
            <TravelMoney />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          {lastUpdated && (
            <div>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <div className="mt-2">
            Exchange rates powered by Exchange Rates API • Cryptocurrency data by CoinGecko
          </div>
          <div className="mt-4 space-x-4">
            <a href="/privacy-policy" className="hover:text-foreground underline">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms-of-service" className="hover:text-foreground underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Cookie Consent Banner */}
      <CookieConsent />
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default CurrencyConverter;