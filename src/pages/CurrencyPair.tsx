import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EnhancedSEOHead from '@/components/EnhancedSEOHead';
import { loadAllBlogPosts } from '@/data/mdBlog';
import CurrencyPairLinks from '@/components/CurrencyPairLinks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPairFaqs } from '@/data/pairFaqs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ExchangeRates {
  [key: string]: number;
}

const CurrencyPair = () => {
  const { pair } = useParams();
  const { toast } = useToast();

  // Handle both formats: "usd-to-eur" and "usd-eur"
  const parseCurrencyPair = (pairString: string | undefined) => {
    if (!pairString) return ['USD', 'EUR'];

    // Check for "to" format first
    if (pairString.includes('-to-')) {
      return pairString.split('-to-').map(c => c.toUpperCase());
    }

    // Handle direct format like "usd-eur"
    const parts = pairString.split('-');
    if (parts.length >= 2) {
      return [parts[0].toUpperCase(), parts[1].toUpperCase()];
    }

    return ['USD', 'EUR'];
  };

  const [fromCurrency, toCurrency] = parseCurrencyPair(pair);
  const [amount, setAmount] = useState('1');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchExchangeRates = async (baseCurrency: string) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates(fromCurrency);
  }, [fromCurrency]);

  const convertedAmount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !exchangeRates[toCurrency]) return '0.00';

    if (fromCurrency === toCurrency) return numAmount.toFixed(2);

    const rate = exchangeRates[toCurrency];
    return (numAmount * rate).toFixed(4);
  };

  const getExchangeRate = () => {
    if (!exchangeRates[toCurrency] || fromCurrency === toCurrency) return null;
    return exchangeRates[toCurrency].toFixed(6);
  };

  const currencyNames = {
    USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar', JPY: 'Japanese Yen', CHF: 'Swiss Franc', CNY: 'Chinese Yuan'
  };

  const getCurrencyName = (code: string) => currencyNames[code as keyof typeof currencyNames] || code;

  // FAQs for this currency pair (visible content + JSON-LD)
  const faqs = getPairFaqs(fromCurrency, toCurrency);
  const faqSchema = faqs.length ? {
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  } : null;

  const financialProduct = {
    "@type": "FinancialProduct",
    "name": `${fromCurrency} to ${toCurrency} Currency Converter`,
    "description": `Convert ${getCurrencyName(fromCurrency)} to ${getCurrencyName(toCurrency)} with real-time exchange rates. Live currency conversion rates updated every few minutes.`,
    "provider": {
      "@type": "Organization",
      "name": "Currency to Currency"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": faqSchema ? [financialProduct, faqSchema] : [financialProduct]
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <EnhancedSEOHead
        title={`${fromCurrency} to ${toCurrency} Converter - Live Exchange Rate | Currency to Currency`}
        description={`Convert ${getCurrencyName(fromCurrency)} to ${getCurrencyName(toCurrency)} with real-time exchange rates. Live currency conversion rates updated every few minutes for accurate results.`}
        canonicalUrl={`https://currencytocurrency.app/convert/${fromCurrency.toLowerCase()}-to-${toCurrency.toLowerCase()}`}
        keywords={`${fromCurrency} to ${toCurrency}, ${fromCurrency}${toCurrency}, ${getCurrencyName(fromCurrency)} to ${getCurrencyName(toCurrency)}, currency converter, exchange rate, live rates`}
        structuredData={structuredData}
        pageType="product"
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {fromCurrency} to {toCurrency} Converter
          </h1>
          <p className="text-muted-foreground text-lg">
            Convert {getCurrencyName(fromCurrency)} to {getCurrencyName(toCurrency)} with real-time exchange rates
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Live exchange rates • Updated every few minutes • Free currency conversion</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{fromCurrency} to {toCurrency}</span>
                <Button variant="ghost" size="sm" onClick={() => fetchExchangeRates(fromCurrency)} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Amount in {fromCurrency}
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg"
                />
              </div>

              <div className="bg-price-bg p-6 rounded-lg text-center" role="status" aria-live="polite" aria-atomic="true">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {loading ? (
                    <div className="animate-pulse bg-muted h-10 w-48 rounded mx-auto" />
                  ) : (
                    `${convertedAmount()} ${toCurrency}`
                  )}
                </div>

                {!loading && getExchangeRate() && (
                  <div className="text-lg text-muted-foreground">
                    1 {fromCurrency} = {getExchangeRate()} {toCurrency}
                  </div>
                )}

                {lastUpdated && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{fromCurrency}</div>
                  <div className="text-sm text-muted-foreground">{getCurrencyName(fromCurrency)}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{toCurrency}</div>
                  <div className="text-sm text-muted-foreground">{getCurrencyName(toCurrency)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About {fromCurrency} to {toCurrency} Exchange Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The {fromCurrency} to {toCurrency} exchange rate shows how much one {getCurrencyName(fromCurrency)}
                is worth in {getCurrencyName(toCurrency)}. Exchange rates fluctuate constantly due to various
                economic factors including interest rates, inflation, political stability, and market sentiment.
              </p>
              <p>
                Our converter uses real-time data from reliable financial sources to provide you with the most
                accurate rates available. For actual transactions, banks and money exchange services may apply
                fees and spreads that differ from the interbank rates shown here.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Best Time to Exchange</h3>
                  <p className="text-sm">Monitor rates regularly and consider setting up price alerts for favorable exchange rates.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Historical Data</h3>
                  <p className="text-sm">View our Charts page to analyze historical trends and make informed decisions.</p>

	          {/* Learn more: internal links to relevant blog content */}
	          {(() => {
	            try {
	              const posts = loadAllBlogPosts();
	              const codes = [fromCurrency, toCurrency];
	              const pick = posts
	                .map((p:any) => ({
	                  p,
	                  s: ((p.title||'') + ' ' + (p.excerpt||'')).toUpperCase().split(/[^A-Z]+/)
	                         .reduce((acc:number,w:string)=>acc + (codes.includes(w)?1:0),0)
	                }))
	                .filter((x:any)=>x.s>0)
	                .sort((a:any,b:any)=>b.s-a.s)
	                .slice(0,4)
	                .map((x:any)=>x.p);
	              return pick.length ? (
	                <Card className="mt-2">
	                  <CardHeader>
	                    <CardTitle>Learn more about {fromCurrency} ↔ {toCurrency}</CardTitle>
	                  </CardHeader>
	                  <CardContent>
	                    <ul className="list-disc ml-5 space-y-2">
	                      {pick.map((rp:any)=> (
	                        <li key={rp.slug}>
	                          <Link to={`/blog/${rp.slug}`} className="text-primary hover:underline">{rp.title}</Link>
	                        </li>
	                      ))}
	                    </ul>
	                  </CardContent>
	                </Card>
	              ) : null;
	            } catch {
	              return null;
	            }
	          })()}

                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related conversions to expand internal links */}
          {(() => {
            const popular = ['USD','EUR','GBP','CAD','AUD','JPY','CHF','CNY'];
            const targets = popular.filter(c => c !== toCurrency && c !== fromCurrency).slice(0, 8);
            const links = targets.map(tc => ({
              href: `/convert/${fromCurrency.toLowerCase()}-to-${tc.toLowerCase()}`,
              text: `${getCurrencyName(fromCurrency)} to ${getCurrencyName(tc)} – live rates & calculator`,
            }));
            // also include the reverse current pair
            links.unshift({
              href: `/convert/${toCurrency.toLowerCase()}-to-${fromCurrency.toLowerCase()}`,
              text: `${getCurrencyName(toCurrency)} to ${getCurrencyName(fromCurrency)} – reverse converter`,
            });
            return (
              <Card>
                <CardHeader>
                  <CardTitle>People also convert</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-5 space-y-2">
                    {links.map((l, i) => (
                      <li key={i}>
                        <Link to={l.href} className="text-primary hover:underline">{l.text}</Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })()}

          {/* Topic hubs and glossary */}
          <Card>
            <CardHeader>
              <CardTitle>Learn about currencies and exchange rates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-5 space-y-2">
                <li>
                  <Link to="/topics" className="text-primary hover:underline">Explore Topic Hubs</Link> – curated guides on hedging, transfers, trading basics and more.
                </li>
                <li>
                  <Link to="/glossary" className="text-primary hover:underline">FX Glossary</Link> – clear definitions of key terms like
                  {' '}<Link to="/glossary#base-currency" className="text-primary hover:underline">base currency</Link>,
                  {' '}<Link to="/glossary#quote-currency" className="text-primary hover:underline">quote currency</Link>, and
                  {' '}<Link to="/glossary#spread" className="text-primary hover:underline">spread</Link>.
                </li>
              </ul>
            </CardContent>
          </Card>


          {/* FAQs for SEO and user help */}
          {faqs && faqs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{fromCurrency} to {toCurrency} FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.map((qa, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-left">{qa.q}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{qa.a}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}


          <CurrencyPairLinks currentPair={pair} />
        </div>
      </div>
    </div>
  );
};

export default CurrencyPair;