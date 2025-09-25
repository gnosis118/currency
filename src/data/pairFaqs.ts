export type QA = { q: string; a: string };

// Generate templated FAQs for any currency pair. Keep answers concise and unique per pair.
export function getPairFaqs(from: string, to: string): QA[] {
  const f = from.toUpperCase();
  const t = to.toUpperCase();
  return [
    {
      q: `What is the current ${f} to ${t} exchange rate?`,
      a: `Live market data updates frequently. Use the converter above to see 1 ${f} in ${t}. Banks/fintechs may add fees or a spread on top of the interbank rate.`,
    },
    {
      q: `How do I calculate ${f} to ${t}?`,
      a: `Multiply your ${f} amount by the live rate shown (1 ${f} = rate × ${t}). Our converter performs this automatically and rounds to 2–4 decimals.`,
    },
    {
      q: `Why is my ${f}→${t} rate different from the bank?`,
      a: `Banks typically add a spread and fixed fees. Compare multiple providers and check total cost (rate + fee) before converting.`,
    },
    {
      q: `What’s a good time to exchange ${f} for ${t}?`,
      a: `Rates move with market news, interest rates, and risk sentiment. Set a price alert to capture favorable moves and avoid rushed conversions.`,
    },
    {
      q: `Do card payments use the same ${f}/${t} rate?`,
      a: `Card networks apply their own FX rates and your issuer may add fees. The final rate often differs from the mid‑market rate shown here.`,
    },
    {
      q: `Are there transfer limits or compliance checks for ${f} to ${t}?`,
      a: `Large transfers can require extra verification (KYC/AML). Check provider limits and timelines before sending high‑value amounts.`,
    },
    {
      q: `How can I reduce ${f}→${t} conversion costs?`,
      a: `Compare providers, use low‑fee routes, avoid weekend FX markups, and batch smaller payments where possible to lower fixed fees.`,
    },
    {
      q: `How often do ${f}/${t} rates change?`,
      a: `FX markets move continuously during trading hours. Rates can update many times per minute during volatile sessions.`,
    },
    {
      q: `Is ${f} to ${t} taxable?`,
      a: `Personal currency exchange is usually not taxed, but realized gains from speculation may be. Consult a tax professional for your situation.`,
    },
    {
      q: `Can I set an alert for ${f}/${t}?`,
      a: `Yes — use our rate alerts to get notified when ${f} reaches your target price in ${t}.`,
    },
  ];
}

