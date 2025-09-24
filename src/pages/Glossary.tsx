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

