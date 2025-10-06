// src/services/polygon-api-service.ts
// Comprehensive Polygon.io API Integration for CurrencyToCurrency.app
// Your API Key: AAIgYzbfju84n3AQ2XD0oP8EUyCKLgwY

const POLYGON_API_KEY = 'AAIgYzbfju84n3AQ2XD0oP8EUyCKLgwY';
const POLYGON_BASE_URL = 'https://api.polygon.io';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PolygonCandle {
  c: number;   // Close price
  h: number;   // High price
  l: number;   // Low price
  o: number;   // Open price
  t: number;   // Timestamp (milliseconds)
  v: number;   // Volume
  vw: number;  // Volume weighted average price
  n: number;   // Number of transactions
}

export interface PolygonAggregatesResponse {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: PolygonCandle[];
  status: string;
  request_id: string;
  count: number;
}

export interface PolygonRealTimeQuote {
  ask: number;
  bid: number;
  exchange: number;
  last: {
    exchange: number;
    price: number;
    timestamp: number;
  };
}

export interface PolygonPreviousClose {
  T: string;    // Ticker
  c: number;    // Close
  h: number;    // High
  l: number;    // Low
  o: number;    // Open
  t: number;    // Timestamp
  v: number;    // Volume
}

export interface ConversionResult {
  from: string;
  to: string;
  rate: number;
  amount: number;
  converted: number;
  timestamp: number;
  lastUpdate: string;
}

export type Timeframe = '1' | '5' | '15' | '30' | '60' | '240' | 'D' | 'W' | 'M';

export interface TimeframeConfig {
  multiplier: number;
  timespan: 'minute' | 'hour' | 'day' | 'week' | 'month';
  label: string;
  dataPoints: number; // How many periods to fetch
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const TIMEFRAME_CONFIGS: Record<Timeframe, TimeframeConfig> = {
  '1': { multiplier: 1, timespan: 'minute', label: '1 Minute', dataPoints: 1440 },    // 1 day
  '5': { multiplier: 5, timespan: 'minute', label: '5 Minutes', dataPoints: 864 },    // 3 days
  '15': { multiplier: 15, timespan: 'minute', label: '15 Minutes', dataPoints: 672 }, // 1 week
  '30': { multiplier: 30, timespan: 'minute', label: '30 Minutes', dataPoints: 672 }, // 2 weeks
  '60': { multiplier: 1, timespan: 'hour', label: '1 Hour', dataPoints: 720 },        // 1 month
  '240': { multiplier: 4, timespan: 'hour', label: '4 Hours', dataPoints: 540 },      // 3 months
  'D': { multiplier: 1, timespan: 'day', label: '1 Day', dataPoints: 365 },           // 1 year
  'W': { multiplier: 1, timespan: 'week', label: '1 Week', dataPoints: 260 },         // 5 years
  'M': { multiplier: 1, timespan: 'month', label: '1 Month', dataPoints: 120 }        // 10 years
};

// Currency pair mapping (Polygon uses C:XXXYYY format)
export const formatCurrencyPair = (from: string, to: string): string => {
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();
  return `C:${fromCode}${toCode}`;
};

// Reverse formatting for display
export const parseCurrencyPair = (ticker: string): { from: string; to: string } | null => {
  const match = ticker.match(/C:([A-Z]{3})([A-Z]{3})/);
  if (!match) return null;
  return { from: match[1], to: match[2] };
};

// ============================================================================
// API REQUEST FUNCTIONS
// ============================================================================

/**
 * Fetch historical OHLC data (candlesticks) for a currency pair
 */
export async function fetchHistoricalCandles(
  from: string,
  to: string,
  timeframe: Timeframe = 'D',
  limit?: number
): Promise<PolygonCandle[]> {
  const ticker = formatCurrencyPair(from, to);
  const config = TIMEFRAME_CONFIGS[timeframe];
  
  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (limit || config.dataPoints));
  
  const fromTimestamp = startDate.toISOString().split('T')[0];
  const toTimestamp = endDate.toISOString().split('T')[0];
  
  const url = `${POLYGON_BASE_URL}/v2/aggs/ticker/${ticker}/range/${config.multiplier}/${config.timespan}/${fromTimestamp}/${toTimestamp}?adjusted=true&sort=asc&limit=50000&apiKey=${POLYGON_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
    }
    
    const data: PolygonAggregatesResponse = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.warn(`No data returned for ${ticker}`, data);
      return [];
    }
    
    return data.results;
  } catch (error) {
    console.error('Error fetching historical candles:', error);
    throw error;
  }
}

/**
 * Fetch current exchange rate (latest close price)
 */
export async function fetchCurrentRate(from: string, to: string): Promise<number> {
  const ticker = formatCurrencyPair(from, to);
  
  const url = `${POLYGON_BASE_URL}/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`No rate data available for ${from}/${to}`);
    }
    
    return data.results[0].c; // Return close price
  } catch (error) {
    console.error('Error fetching current rate:', error);
    throw error;
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<ConversionResult> {
  const rate = await fetchCurrentRate(from, to);
  const converted = amount * rate;
  const now = Date.now();
  
  return {
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    rate,
    amount,
    converted,
    timestamp: now,
    lastUpdate: new Date(now).toISOString()
  };
}

/**
 * Fetch multiple exchange rates at once
 */
export async function fetchMultipleRates(
  pairs: Array<{ from: string; to: string }>
): Promise<Map<string, number>> {
  const results = new Map<string, number>();
  
  // Fetch all rates in parallel
  const promises = pairs.map(async ({ from, to }) => {
    try {
      const rate = await fetchCurrentRate(from, to);
      const key = `${from}${to}`.toUpperCase();
      results.set(key, rate);
    } catch (error) {
      console.error(`Failed to fetch rate for ${from}/${to}:`, error);
    }
  });
  
  await Promise.all(promises);
  return results;
}

/**
 * Fetch previous day's OHLCV data
 */
export async function fetchPreviousClose(
  from: string,
  to: string
): Promise<PolygonPreviousClose | null> {
  const ticker = formatCurrencyPair(from, to);
  
  const url = `${POLYGON_BASE_URL}/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }
    
    return data.results[0];
  } catch (error) {
    console.error('Error fetching previous close:', error);
    return null;
  }
}

/**
 * Calculate percentage change
 */
export function calculateChange(current: number, previous: number): {
  amount: number;
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
} {
  const amount = current - previous;
  const percentage = (amount / previous) * 100;
  
  let direction: 'up' | 'down' | 'neutral';
  if (amount > 0) direction = 'up';
  else if (amount < 0) direction = 'down';
  else direction = 'neutral';
  
  return { amount, percentage, direction };
}

/**
 * Get rate with change information
 */
export async function getRateWithChange(from: string, to: string): Promise<{
  current: number;
  previous: number;
  change: ReturnType<typeof calculateChange>;
  timestamp: number;
}> {
  const [current, previousData] = await Promise.all([
    fetchCurrentRate(from, to),
    fetchPreviousClose(from, to)
  ]);
  
  const previous = previousData?.c || current;
  const change = calculateChange(current, previous);
  
  return {
    current,
    previous,
    change,
    timestamp: Date.now()
  };
}

// ============================================================================
// CACHING LAYER (to reduce API calls)
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number; // milliseconds
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultExpiry = 60000; // 1 minute default
  
  set<T>(key: string, data: T, expiry?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: expiry || this.defaultExpiry
    });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const age = Date.now() - entry.timestamp;
    if (age > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new APICache();

// Clear expired cache entries every 5 minutes
setInterval(() => cache.clearExpired(), 300000);

/**
 * Cached version of fetchCurrentRate
 */
export async function fetchCurrentRateCached(
  from: string,
  to: string,
  cacheExpiry = 60000 // 1 minute default
): Promise<number> {
  const cacheKey = `rate_${from}_${to}`;
  const cached = cache.get<number>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }
  
  const rate = await fetchCurrentRate(from, to);
  cache.set(cacheKey, rate, cacheExpiry);
  return rate;
}

/**
 * Cached version of fetchHistoricalCandles
 */
export async function fetchHistoricalCandlesCached(
  from: string,
  to: string,
  timeframe: Timeframe = 'D',
  limit?: number,
  cacheExpiry = 300000 // 5 minutes default for historical data
): Promise<PolygonCandle[]> {
  const cacheKey = `candles_${from}_${to}_${timeframe}_${limit || 'default'}`;
  const cached = cache.get<PolygonCandle[]>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }
  
  const candles = await fetchHistoricalCandles(from, to, timeframe, limit);
  cache.set(cacheKey, candles, cacheExpiry);
  return candles;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format number as currency
 */
export function formatCurrency(amount: number, currencyCode: string, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

/**
 * Format exchange rate
 */
export function formatRate(rate: number, decimals = 4): string {
  return rate.toFixed(decimals);
}

/**
 * Format percentage
 */
export function formatPercentage(percentage: number, decimals = 2): string {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(decimals)}%`;
}

/**
 * Get timestamp range for date period
 */
export function getDateRange(period: 'day' | 'week' | 'month' | 'year'): {
  from: string;
  to: string;
} {
  const to = new Date();
  const from = new Date();
  
  switch (period) {
    case 'day':
      from.setDate(from.getDate() - 1);
      break;
    case 'week':
      from.setDate(from.getDate() - 7);
      break;
    case 'month':
      from.setMonth(from.getMonth() - 1);
      break;
    case 'year':
      from.setFullYear(from.getFullYear() - 1);
      break;
  }
  
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0]
  };
}

// ============================================================================
// EXPORT DEFAULT SERVICE
// ============================================================================

export default {
  // Core functions
  fetchHistoricalCandles,
  fetchCurrentRate,
  convertCurrency,
  fetchMultipleRates,
  fetchPreviousClose,
  getRateWithChange,
  
  // Cached versions
  fetchCurrentRateCached,
  fetchHistoricalCandlesCached,
  
  // Utilities
  formatCurrencyPair,
  parseCurrencyPair,
  calculateChange,
  formatCurrency,
  formatRate,
  formatPercentage,
  getDateRange,
  
  // Cache management
  cache,
  
  // Config
  TIMEFRAME_CONFIGS,
  POLYGON_API_KEY
};
