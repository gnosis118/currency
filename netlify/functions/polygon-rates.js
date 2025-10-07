// Polygon.io exchange rates function for high-quality financial data
export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const url = new URL(event.rawUrl || `http://x${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
    const from = (url.searchParams.get('from') || 'USD').toUpperCase();
    const to = (url.searchParams.get('to') || 'EUR').toUpperCase();
    const amount = parseFloat(url.searchParams.get('amount') || '1');

    // Check for required API key
    const polygonApiKey = process.env.POLYGON_API_KEY;
    if (!polygonApiKey) {
      throw new Error('Polygon API key not configured');
    }

    // Cache key for in-memory caching
    const cacheKey = `${from}-${to}`;
    const now = Date.now();
    
    // Simple in-memory cache (45 seconds)
    if (global.rateCache && global.rateCache[cacheKey] && (now - global.rateCache[cacheKey].timestamp) < 45000) {
      const cached = global.rateCache[cacheKey];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          provider: 'polygon.io',
          rate: cached.rate,
          converted: amount * cached.rate,
          cached: true,
          timestamp: cached.timestamp
        })
      };
    }

    // Initialize cache if needed
    if (!global.rateCache) global.rateCache = {};

    let rate;

    // Direct pair conversion
    if (from !== to) {
      try {
        // Try direct conversion first
        const directUrl = `https://api.polygon.io/v1/conversion/${from}/${to}?amount=1&precision=6&apikey=${polygonApiKey}`;
        const directResponse = await fetch(directUrl);
        
        if (directResponse.ok) {
          const directData = await directResponse.json();
          if (directData.status === 'OK' && directData.converted) {
            rate = directData.converted;
          }
        }
      } catch (error) {
        console.log('Direct conversion failed, trying cross-rate calculation');
      }

      // If direct conversion failed, try cross-rate calculation via USD
      if (!rate && from !== 'USD' && to !== 'USD') {
        try {
          const [fromUsdResponse, toUsdResponse] = await Promise.all([
            fetch(`https://api.polygon.io/v1/conversion/${from}/USD?amount=1&precision=6&apikey=${polygonApiKey}`),
            fetch(`https://api.polygon.io/v1/conversion/${to}/USD?amount=1&precision=6&apikey=${polygonApiKey}`)
          ]);

          if (fromUsdResponse.ok && toUsdResponse.ok) {
            const [fromUsdData, toUsdData] = await Promise.all([
              fromUsdResponse.json(),
              toUsdResponse.json()
            ]);

            if (fromUsdData.status === 'OK' && toUsdData.status === 'OK' && 
                fromUsdData.converted && toUsdData.converted) {
              rate = fromUsdData.converted / toUsdData.converted;
            }
          }
        } catch (error) {
          console.log('Cross-rate calculation failed');
        }
      }

      // If one currency is USD, try the other direction
      if (!rate && (from === 'USD' || to === 'USD')) {
        try {
          const nonUsd = from === 'USD' ? to : from;
          const usdPairUrl = `https://api.polygon.io/v1/conversion/USD/${nonUsd}?amount=1&precision=6&apikey=${polygonApiKey}`;
          const usdResponse = await fetch(usdPairUrl);
          
          if (usdResponse.ok) {
            const usdData = await usdResponse.json();
            if (usdData.status === 'OK' && usdData.converted) {
              rate = from === 'USD' ? usdData.converted : (1 / usdData.converted);
            }
          }
        } catch (error) {
          console.log('USD pair conversion failed');
        }
      }
    } else {
      // Same currency
      rate = 1;
    }

    if (!rate) {
      throw new Error(`Unable to get rate for ${from}/${to} from Polygon.io`);
    }

    // Cache the result
    global.rateCache[cacheKey] = {
      rate,
      timestamp: now
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        provider: 'polygon.io',
        rate,
        converted: amount * rate,
        cached: false,
        timestamp: now
      })
    };

  } catch (error) {
    console.error('Polygon rates error:', error);
    
    // Fallback to OpenExchangeRates if available
    try {
      const openExchangeKey = process.env.OPENEXCHANGERATES_APP_ID;
      if (openExchangeKey) {
        const url = new URL(event.rawUrl || `http://x${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
        const from = (url.searchParams.get('from') || 'USD').toUpperCase();
        const to = (url.searchParams.get('to') || 'EUR').toUpperCase();
        const amount = parseFloat(url.searchParams.get('amount') || '1');

        const fallbackResponse = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${openExchangeKey}`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fromRate = from === 'USD' ? 1 : fallbackData.rates[from];
          const toRate = to === 'USD' ? 1 : fallbackData.rates[to];
          
          if (fromRate && toRate) {
            const rate = toRate / fromRate;
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                provider: 'openexchangerates-fallback',
                rate,
                converted: amount * rate,
                cached: false,
                timestamp: Date.now()
              })
            };
          }
        }
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch exchange rates',
        message: error.message
      })
    };
  }
}
