import EnhancedSEOHead from '@/components/EnhancedSEOHead';
import BreadcrumbNav from '@/components/BreadcrumbNav';

const terms: Array<{ id: string; term: string; definition: string }> = [
  {
    id: 'forward-exchange-rate',
    term: 'Forward exchange rate',
    definition:
      'The agreed exchange rate today for a currency transaction that will occur on a specified future date. Used to lock in rates and eliminate FX uncertainty.',
  },
  {
    id: 'spot-rate',
    term: 'Spot rate',
    definition:
      'The current exchange rate for immediate delivery (typically T+2 settlement in FX). Baseline from which forwards are priced.',
  },
  {
    id: 'hedging',
    term: 'Hedging',
    definition:
      'Using financial contracts (e.g., forwards, options) to reduce the impact of adverse currency movements on future cash flows.',
  },
  {
    id: 'fx-exposure',
    term: 'FX exposure',
    definition:
      'The risk that currency movements will affect a company’s financial results or cash flows, typically from foreign revenues or costs.',
  },
  {
    id: 'isda',
    term: 'ISDA',
    definition:
      'International Swaps and Derivatives Association. Master agreement framework many banks use to document derivatives like FX forwards and options.',
  },
  {
    id: 'mark-to-market',
    term: 'Mark-to-market (MTM)',
    definition:
      'The daily valuation of open hedges at current market rates to measure unrealized gains/losses and manage collateral requirements.',
  },
  {
    id: 'basis-points',
    term: 'Basis points (bps)',
    definition:
      'One hundredth of a percent (0.01%). Common unit to express spreads or differences in interest or forward points.',
  },
  {
    id: 'forward-points',
    term: 'Forward points',
    definition:
      'The premium/discount added to the spot rate to arrive at a forward rate. Driven by interest rate differentials.',
  },
  {
    id: 'natural-hedge',
    term: 'Natural hedge',
    definition:
      'Operational alignment of foreign currency revenues and costs to reduce net exposure, e.g., paying EUR expenses with EUR revenues.',
  },
  {
    id: 'counterparty-risk',
    term: 'Counterparty risk',
    definition:
      'The risk a bank or financial institution defaults on its obligations in a derivative contract such as a forward.',
  },
  ,
  { id: 'base-currency', term: 'Base currency', definition: 'The first currency in a currency pair quotation. The pair shows how much quote currency is needed for one unit of base currency.' },
  { id: 'quote-currency', term: 'Quote currency', definition: 'The second currency in a pair; its amount indicates the price of one unit of the base currency.' },
  { id: 'spread', term: 'Spread', definition: 'The difference between bid and ask prices. Represents execution cost and liquidity; narrower spreads generally mean lower costs.' },
  { id: 'pip', term: 'Pip', definition: 'A standardized unit (typically 0.0001 for most pairs) that measures the change in a currency pair’s value.' },
  { id: 'cross-rate', term: 'Cross rate', definition: 'An exchange rate between two currencies derived from their common relationship to a third currency (e.g., EUR/JPY via EUR/USD and USD/JPY).' },
  { id: 'major-pairs', term: 'Major pairs', definition: 'Most-traded currency pairs involving USD (e.g., EUR/USD, USD/JPY, GBP/USD). Usually highest liquidity and tightest spreads.' },
  { id: 'minor-pairs', term: 'Minor pairs', definition: 'Currency pairs that do not include USD (e.g., EUR/GBP, EUR/AUD). Often wider spreads than majors.' },
  { id: 'exotic-pairs', term: 'Exotic pairs', definition: 'Pairs that include a major currency and a currency from a smaller or emerging economy (e.g., USD/TRY). Typically higher spreads/volatility.' },
  { id: 'slippage', term: 'Slippage', definition: 'The difference between expected and executed price, often due to volatility or low liquidity.' },
  { id: 'liquidity', term: 'Liquidity', definition: 'How easily an asset can be bought or sold without affecting its price. High liquidity typically reduces spreads.' },
  { id: 'tplus2', term: 'T+2 settlement', definition: 'Standard FX spot settlement two business days after the trade date; some pairs settle T+1.' },
  { id: 'notional', term: 'Notional', definition: 'The face value amount upon which payments in a derivative contract (e.g., forward) are calculated.' },
  { id: 'leverage', term: 'Leverage', definition: 'Using borrowed funds or margin to increase market exposure. Amplifies both gains and losses.' },
  { id: 'carry-trade', term: 'Carry trade', definition: 'Strategy of borrowing in a low-interest-rate currency and investing in a higher-yielding currency, profiting from the rate differential.' },
  { id: 'hedge-ratio', term: 'Hedge ratio', definition: 'The proportion of exposure that is hedged, e.g., 80% of forecast EUR revenues hedged with forwards.' },
  { id: 'exposure-netting', term: 'Exposure netting', definition: 'Offsetting exposures across currencies or entities to reduce total net risk before hedging.' },
  { id: 'basis-risk', term: 'Basis risk', definition: 'Risk that the hedge does not perfectly offset the underlying exposure due to differences in rates, timing, or instruments.' },
  { id: 'forward-curve', term: 'Forward curve', definition: 'A series of forward rates across maturities, reflecting interest differentials and market expectations over time.' },
  { id: 'markout', term: 'Markout', definition: 'Post-trade measure of execution quality comparing the trade price to subsequent market prices over a time window.' },
  { id: 'stop-loss', term: 'Stop-loss order', definition: 'An order to close a position when price reaches a specified level to limit losses.' },
  { id: 'limit-order', term: 'Limit order', definition: 'An order to buy or sell at a specified price or better, used to control entry/exit prices.' },
  { id: 'ndf', term: 'NDF (Non-Deliverable Forward)', definition: 'A cash-settled forward contract used for currencies with capital controls or limited convertibility.' },
  { id: 'swap', term: 'FX swap', definition: 'A transaction combining a spot exchange with a forward re-exchange at a future date; used for funding and rolling hedges.' }
];

export default function Glossary() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'FX Glossary',
    itemListElement: terms.map((t, i) => ({
      '@type': 'DefinedTerm',
      position: i + 1,
      name: t.term,
      description: t.definition,
      url: `https://currencytocurrency.app/glossary#${t.id}`,
    })),
  } as any;

  return (
    <div className="min-h-screen bg-background py-8">
      <EnhancedSEOHead
        title="FX Glossary: Forward Rate, Hedging, MTM & More | Currency to Currency"
        description="A concise glossary of essential foreign exchange terms for SMEs and travelers. Clear definitions with practical context."
        canonicalUrl="https://currencytocurrency.app/glossary"
        structuredData={structuredData}
      />

      <div className="container mx-auto px-4 max-w-3xl">
        <BreadcrumbNav className="mb-4" />
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">FX Glossary</h1>
          <p className="text-muted-foreground">Quick definitions for key currency and hedging concepts.</p>
        </header>

        <dl className="space-y-6">
          {terms.map((t) => (
            <div key={t.id} id={t.id}>
              <dt className="font-semibold text-lg">{t.term}</dt>
              <dd className="text-muted-foreground">{t.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

