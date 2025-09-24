export type QA = { q: string; a: string };
export type PostEnhancement = {
  title?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  longtails?: string[];
  faqs?: QA[];
};

// Add entries keyed by post slug. Safe to expand over time.
export const seoEnhancements: Record<string, PostEnhancement> = {
  'forward-exchange-rate-explained': {
    title: 'Forward Exchange Rate Explained for SMEs (2025): Hedging Made Simple',
    metaDescription:
      'Forward exchange rate explained for small businesses: when to hedge FX risk, forward vs. options, pricing, and a practical treasury policy template.',
    primaryKeyword: 'forward exchange rate',
    longtails: [
      'forward exchange rate for SMEs',
      'FX forward vs options',
      'hedging currency risk for small business',
      'how forward points work',
      'treasury policy template hedging'
    ],
    faqs: [
      { q: 'What is a forward exchange rate?', a: 'It is the agreed rate today for exchanging one currency for another on a future date, used to lock in costs or revenues and remove FX uncertainty.' },
      { q: 'When should SMEs use forwards?', a: 'When you have committed future foreign cash flows (e.g., invoices, purchase orders) and want budget certainty. Typical tenors range from 30 to 365 days.' },
      { q: 'How are forward rates priced?', a: 'They adjust from spot based on interest rate differentials between the two currencies—forward points are added or subtracted from spot.' },
      { q: 'Do forwards have upfront costs?', a: 'Forwards usually have no cash premium; the economic cost is embedded in forward points and your bank’s spread. Credit lines/ISDA may be required.' }
    ]
  }
};

