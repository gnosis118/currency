// Netlify Function: convert
// Provides minute-level accurate conversions via Option B providers:
// - OpenExchangeRates Pro (preferred): set OPENEXCHANGERATES_APP_ID
// - Currencylayer Pro: set CURRENCYLAYER_API_KEY
// Falls back to open.er-api.com if provider fails.
// Simple in-memory caching per function instance to reduce upstream calls.

const CACHE_TTL_MS = 45 * 1000; // ~45s cache per base set
let cache = {
  provider: null,
  oxr: { last: 0, base: 'USD', data: null },
  cl: { last: 0, base: 'USD', data: null },
  openER: { last: 0, base: null, data: null },
};

export async function handler(event) {
  try {
    const url = new URL(event.rawUrl || `http://x${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
    const from = (url.searchParams.get('from') || 'USD').toUpperCase();
    const to = (url.searchParams.get('to') || 'EUR').toUpperCase();
    const amount = parseFloat(url.searchParams.get('amount') || '1');

    if (isNaN(amount)) return json({ error: 'Invalid amount' }, 400);

    const oxrKey = process.env.OPENEXCHANGERATES_APP_ID;
    const clKey = process.env.CURRENCYLAYER_API_KEY;

    let rate;

    // Prefer OpenExchangeRates if configured
    if (oxrKey) {
      rate = await getRateFromOXR(oxrKey, from, to);
      cache.provider = 'openexchangerates';
    }
    // Else try Currencylayer if configured
    if (!rate && clKey) {
      rate = await getRateFromCurrencylayer(clKey, from, to);
      cache.provider = 'currencylayer';
    }
    // Fallback to open.er-api.com
    if (!rate) {
      rate = await getRateFromOpenER(from, to);
      cache.provider = 'open.er-api';
    }

    if (!rate) return json({ error: 'Rate unavailable' }, 502);

    const converted = amount * rate;
    return json({
      provider: cache.provider,
      from,
      to,
      rate,
      amount,
      converted,
      // Basic cache hinting (client/CDN may ignore; real CDN caching can be added later)
    }, 200, {
      'Cache-Control': 'public, max-age=0, s-maxage=45, stale-while-revalidate=60',
      'Content-Type': 'application/json; charset=utf-8',
    });
  } catch (e) {
    return json({ error: 'Server error', details: String(e?.message || e) }, 500);
  }
}

function json(body, status = 200, headers = {}) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
    body: JSON.stringify(body),
  };
}

async function getRateFromOXR(appId, from, to) {
  try {
    // Try to use base=from (Pro feature). If blocked, fall back to USD-base cross rate.
    let data;
    if (cache.oxr.data && cache.oxr.base === from && Date.now() - cache.oxr.last < CACHE_TTL_MS) {
      data = cache.oxr.data;
    } else {
      const withBase = await fetchJson(`https://openexchangerates.org/api/latest.json?app_id=${appId}&base=${from}`);
      if (withBase && withBase.rates && withBase.rates[to] != null) {
        cache.oxr = { last: Date.now(), base: from, data: withBase };
        data = withBase;
      } else {
        // Fall back to USD base and compute cross-rate
        const usdData = await getOXRUSDBase(appId);
        if (!usdData) return null;
        const rate = crossFromUSD(usdData, from, to);
        return rate;
      }
    }
    const rate = data?.rates?.[to];
    return typeof rate === 'number' ? rate : null;
  } catch (e) {
    // Try USD-base cross rate
    try {
      const usdData = await getOXRUSDBase(appId);
      if (!usdData) return null;
      const rate = crossFromUSD(usdData, from, to);
      return rate;
    } catch (_) {
      return null;
    }
  }
}

async function getOXRUSDBase(appId) {
  if (cache.oxr.data && cache.oxr.base === 'USD' && Date.now() - cache.oxr.last < CACHE_TTL_MS) {
    return cache.oxr.data;
  }
  const data = await fetchJson(`https://openexchangerates.org/api/latest.json?app_id=${appId}`);
  if (data && data.rates) {
    cache.oxr = { last: Date.now(), base: 'USD', data };
    return data;
  }
  return null;
}

function crossFromUSD(usdData, from, to) {
  const r = usdData.rates || {};
  const rFrom = from === 'USD' ? 1 : r[from];
  const rTo = to === 'USD' ? 1 : r[to];
  if (!rFrom || !rTo) return null;
  // Rate from->to is (USD->to) / (USD->from)
  return rTo / rFrom;
}

async function getRateFromCurrencylayer(apiKey, from, to) {
  try {
    // Currencylayer live endpoint is USD-based; compute cross rate
    const data = await getCurrencylayerUSDLive(apiKey, [from, to]);
    if (!data || !data.quotes) return null;
    const rFrom = from === 'USD' ? 1 : data.quotes[`USD${from}`];
    const rTo = to === 'USD' ? 1 : data.quotes[`USD${to}`];
    if (!rFrom || !rTo) return null;
    return rTo / rFrom;
  } catch (e) {
    return null;
  }
}

async function getCurrencylayerUSDLive(apiKey, symbols = []) {
  const key = symbols.sort().join(',');
  const now = Date.now();
  if (
    cache.cl.data &&
    cache.cl.base === key &&
    now - cache.cl.last < CACHE_TTL_MS
  ) {
    return cache.cl.data;
  }
  const url = `https://api.currencylayer.com/live?access_key=${apiKey}&currencies=${symbols.join(',')}`;
  const data = await fetchJson(url);
  if (data && data.success) {
    cache.cl = { last: now, base: key, data };
    return data;
  }
  return null;
}

async function getRateFromOpenER(from, to) {
  try {
    // Cache per base
    const now = Date.now();
    if (
      cache.openER.data &&
      cache.openER.base === from &&
      now - cache.openER.last < CACHE_TTL_MS
    ) {
      const rate = cache.openER.data?.rates?.[to];
      return typeof rate === 'number' ? rate : null;
    }
    const data = await fetchJson(`https://open.er-api.com/v6/latest/${from}`);
    if (data && data.rates) {
      cache.openER = { last: now, base: from, data };
      const rate = data.rates[to];
      return typeof rate === 'number' ? rate : null;
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

