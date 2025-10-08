/**
 * Exchange Rates Service
 * Centralized service for fetching and caching exchange rates from OpenExchangeRates.org
 */

const API_KEY = (import.meta as any)?.env?.VITE_OPENEXCHANGERATES_KEY || '669f46bf3291450b876bd2a28d8410e6';
const BASE_URL = 'https://openexchangerates.org/api';

interface ExchangeRatesResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: { [key: string]: number };
}

interface CachedRates {
  rates: { [key: string]: number };
  timestamp: number;
  base: string;
}

// Cache duration: 1 hour (3600000 ms)
const CACHE_DURATION = 3600000;

// In-memory cache
let cachedRates: CachedRates | null = null;

/**
 * Fetch latest exchange rates from OpenExchangeRates API
 * Results are cached for 1 hour to reduce API calls
 */
export async function getLatestRates(baseCurrency: string = 'USD'): Promise<{ [key: string]: number }> {
  // Check cache first
  if (cachedRates && 
      cachedRates.base === baseCurrency && 
      Date.now() - cachedRates.timestamp < CACHE_DURATION) {
    return cachedRates.rates;
  }

  try {
    // 1) Prefer OpenExchangeRates if key is available. Request USD base (default) then normalize to desired base.
    if (API_KEY) {
      const oxrUrl = `${BASE_URL}/latest.json?app_id=${API_KEY}`; // default base is USD on free plan
      const oxrResponse = await fetch(oxrUrl);
      if (oxrResponse.ok) {
        const data: ExchangeRatesResponse = await oxrResponse.json();
        let normalizedRates: { [key: string]: number } = { ...data.rates };
        let normalizedBase = (data.base || 'USD').toUpperCase();

        const targetBase = (baseCurrency || 'USD').toUpperCase();
        if (targetBase !== normalizedBase) {
          const factor = data.rates[targetBase];
          if (factor && factor > 0) {
            const out: { [key: string]: number } = {};
            for (const code of Object.keys(data.rates)) {
              out[code] = data.rates[code] / factor;
            }
            out[targetBase] = 1;
            normalizedRates = out;
            normalizedBase = targetBase;
          } else {
            // If target base not present in OXR response, fall back to open.er-api.com below
            console.warn(`OXR missing rate for ${targetBase}, falling back to open.er-api.com`);
          }
        }

        if (normalizedBase === targetBase) {
          cachedRates = {
            rates: normalizedRates,
            timestamp: Date.now(),
            base: normalizedBase,
          };
          try { localStorage.setItem('exchangeRatesCache', JSON.stringify(cachedRates)); } catch {}
          return normalizedRates;
        }
      }
    }

    // 2) Fallback: open.er-api.com (no key required)
    const erUrl = `https://open.er-api.com/v6/latest/${baseCurrency}`;
    const erResponse = await fetch(erUrl);
    if (erResponse.ok) {
      const erData = await erResponse.json();
      const rates = erData?.rates as { [key: string]: number };
      if (rates && typeof rates === 'object') {
        cachedRates = {
          rates,
          timestamp: Date.now(),
          base: (baseCurrency || 'USD').toUpperCase(),
        };
        try { localStorage.setItem('exchangeRatesCache', JSON.stringify(cachedRates)); } catch {}
        return rates;
      }
    }

    throw new Error('All providers failed for latest rates');
  } catch (error) {
    console.error('Error fetching exchange rates:', error);

    // Try to load from localStorage if API fails
    try {
      const cached = localStorage.getItem('exchangeRatesCache');
      if (cached) {
        const parsedCache: CachedRates = JSON.parse(cached);
        if (parsedCache.base === baseCurrency) {
          cachedRates = parsedCache;
          return parsedCache.rates;
        }
      }
    } catch (e) {
      console.warn('Failed to load cached rates from localStorage:', e);
    }

    throw new Error('Failed to fetch exchange rates and no cached data available');
  }
}

/**
 * Convert an amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<{ convertedAmount: number; rate: number; timestamp: number }> {
  const rates = await getLatestRates(fromCurrency);

  if (!rates[toCurrency]) {
    throw new Error(`Rate not available for ${toCurrency}`);
  }

  const rate = rates[toCurrency];
  const convertedAmount = amount * rate;

  return {
    convertedAmount,
    rate,
    timestamp: Date.now()
  };
}

/**
 * Get historical rates for a specific date
 */
export async function getHistoricalRates(
  date: string,
  baseCurrency: string = 'USD'
): Promise<{ [key: string]: number }> {
  try {
    // Format: YYYY-MM-DD
    const url = `${BASE_URL}/historical/${date}.json?app_id=${API_KEY}&base=${baseCurrency}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: ExchangeRatesResponse = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    throw new Error('Failed to fetch historical exchange rates');
  }
}

/**
 * Get time series data for a date range
 * Note: This requires a paid plan on OpenExchangeRates
 */
export async function getTimeSeries(
  startDate: string,
  endDate: string,
  baseCurrency: string = 'USD',
  symbols?: string[]
): Promise<any> {
  try {
    let url = `${BASE_URL}/time-series.json?app_id=${API_KEY}&start=${startDate}&end=${endDate}&base=${baseCurrency}`;
    
    if (symbols && symbols.length > 0) {
      url += `&symbols=${symbols.join(',')}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw new Error('Failed to fetch time series data');
  }
}

/**
 * Get list of available currencies
 */
export async function getCurrencies(): Promise<{ [key: string]: string }> {
  try {
    const url = `${BASE_URL}/currencies.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching currencies list:', error);
    throw new Error('Failed to fetch currencies list');
  }
}

/**
 * Force refresh the cache
 */
export function clearCache(): void {
  cachedRates = null;
  try {
    localStorage.removeItem('exchangeRatesCache');
  } catch (e) {
    console.warn('Failed to clear localStorage cache:', e);
  }
}

/**
 * Get cache status
 */
export function getCacheStatus(): { isCached: boolean; age: number | null; base: string | null } {
  if (!cachedRates) {
    return { isCached: false, age: null, base: null };
  }

  return {
    isCached: true,
    age: Date.now() - cachedRates.timestamp,
    base: cachedRates.base
  };
}
