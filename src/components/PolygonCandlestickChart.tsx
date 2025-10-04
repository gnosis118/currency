// PolygonCandlestickChart.tsx
// Professional Candlestick Chart using Polygon.io Forex API
// Supports real-time OHLC data with pattern detection

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';

interface PolygonCandle {
  c: number;  // close
  h: number;  // high
  l: number;  // low
  o: number;  // open
  t: number;  // timestamp (ms)
  v: number;  // volume
  vw: number; // volume weighted average
  n: number;  // number of transactions
}

interface PolygonResponse {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: PolygonCandle[];
  status: string;
  request_id: string;
}

interface ChartCandle extends CandlestickData {
  time: number;
}

interface Props {
  currencyPair: string;      // e.g., "USD/EUR" or "C:EURUSD"
  timeframe?: '1min' | '5min' | '15min' | '30min' | '1hour' | '4hour' | '1day' | '1week';
  height?: number;
  showVolume?: boolean;
  showPatterns?: boolean;
  apiKey?: string;           // Your Polygon.io API key
}

interface Pattern {
  type: string;
  time: number;
  position: 'aboveBar' | 'belowBar';
  color: string;
  shape: 'arrowUp' | 'arrowDown' | 'circle';
  text: string;
}

const PolygonCandlestickChart: React.FC<Props> = ({
  currencyPair,
  timeframe = '1hour',
  height = 500,
  showVolume = true,
  showPatterns = true,
  apiKey = 'AAIgYzbfju84n3AQ2XD0oP8EUyCKLgwY' // Your API key
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);

  /**
   * Convert currency pair format
   * "USD/EUR" -> "C:USDEUR"
   * "EUR/USD" -> "C:EURUSD"
   */
  const formatPolygonTicker = (pair: string): string => {
    if (pair.startsWith('C:')) return pair;
    return 'C:' + pair.replace('/', '');
  };

  /**
   * Convert timeframe to Polygon.io format
   */
  const getMultiplierAndTimespan = (tf: string): { multiplier: number; timespan: string } => {
    const map: Record<string, { multiplier: number; timespan: string }> = {
      '1min': { multiplier: 1, timespan: 'minute' },
      '5min': { multiplier: 5, timespan: 'minute' },
      '15min': { multiplier: 15, timespan: 'minute' },
      '30min': { multiplier: 30, timespan: 'minute' },
      '1hour': { multiplier: 1, timespan: 'hour' },
      '4hour': { multiplier: 4, timespan: 'hour' },
      '1day': { multiplier: 1, timespan: 'day' },
      '1week': { multiplier: 1, timespan: 'week' }
    };
    return map[tf] || { multiplier: 1, timespan: 'hour' };
  };

  /**
   * Fetch OHLC data from Polygon.io
   */
  const fetchCandlestickData = async (): Promise<ChartCandle[]> => {
    const ticker = formatPolygonTicker(currencyPair);
    const { multiplier, timespan } = getMultiplierAndTimespan(timeframe);
    
    // Get date range (last 200 periods)
    const to = new Date();
    const from = new Date();
    
    // Calculate lookback based on timeframe
    const hoursBack = {
      '1min': 200 / 60,
      '5min': 200 * 5 / 60,
      '15min': 200 * 15 / 60,
      '30min': 200 * 30 / 60,
      '1hour': 200,
      '4hour': 200 * 4,
      '1day': 200 * 24,
      '1week': 200 * 24 * 7
    }[timeframe] || 200;
    
    from.setHours(from.getHours() - hoursBack);

    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${fromStr}/${toStr}?adjusted=true&sort=asc&limit=50000&apiKey=${apiKey}`;

    console.log('Fetching from Polygon.io:', url);

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status} ${response.statusText}`);
      }

      const data: PolygonResponse = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error('No data returned from Polygon.io. Check your API key and currency pair.');
      }

      console.log(`Received ${data.results.length} candles from Polygon.io`);

      // Convert to chart format
      const candles: ChartCandle[] = data.results.map((candle) => ({
        time: Math.floor(candle.t / 1000), // Convert ms to seconds
        open: candle.o,
        high: candle.h,
        low: candle.l,
        close: candle.c
      }));

      // Update last price
      if (candles.length > 0) {
        setLastPrice(candles[candles.length - 1].close);
      }

      return candles;

    } catch (err) {
      console.error('Error fetching Polygon.io data:', err);
      throw err;
    }
  };

  /**
   * Detect candlestick patterns
   */
  const detectPatterns = (candles: ChartCandle[]): Pattern[] => {
    const patterns: Pattern[] = [];

    for (let i = 2; i < candles.length; i++) {
      const prev2 = candles[i - 2];
      const prev = candles[i - 1];
      const curr = candles[i];

      const prevBody = Math.abs(prev.close - prev.open);
      const currBody = Math.abs(curr.close - curr.open);
      const prevRange = prev.high - prev.low;
      const currRange = curr.high - curr.low;

      // Doji - Very small body
      if (currBody / currRange < 0.1) {
        patterns.push({
          type: 'Doji',
          time: curr.time,
          position: 'aboveBar',
          color: '#FFA500',
          shape: 'circle',
          text: 'D'
        });
      }

      // Hammer - Small body at top, long lower wick
      const lowerWick = curr.open < curr.close 
        ? curr.open - curr.low 
        : curr.close - curr.low;
      const upperWick = curr.open < curr.close 
        ? curr.high - curr.close 
        : curr.high - curr.open;
      
      if (lowerWick > currBody * 2 && upperWick < currBody * 0.3) {
        patterns.push({
          type: 'Hammer',
          time: curr.time,
          position: 'belowBar',
          color: '#00FF00',
          shape: 'arrowUp',
          text: 'H'
        });
      }

      // Shooting Star - Small body at bottom, long upper wick
      if (upperWick > currBody * 2 && lowerWick < currBody * 0.3) {
        patterns.push({
          type: 'Shooting Star',
          time: curr.time,
          position: 'aboveBar',
          color: '#FF0000',
          shape: 'arrowDown',
          text: 'SS'
        });
      }

      // Bullish Engulfing
      if (prev.close < prev.open && // Previous was bearish
          curr.close > curr.open && // Current is bullish
          curr.open <= prev.close && // Current opens at or below prev close
          curr.close >= prev.open) { // Current closes at or above prev open
        patterns.push({
          type: 'Bullish Engulfing',
          time: curr.time,
          position: 'belowBar',
          color: '#00FF00',
          shape: 'arrowUp',
          text: 'BE'
        });
      }

      // Bearish Engulfing
      if (prev.close > prev.open && // Previous was bullish
          curr.close < curr.open && // Current is bearish
          curr.open >= prev.close && // Current opens at or above prev close
          curr.close <= prev.open) { // Current closes at or below prev open
        patterns.push({
          type: 'Bearish Engulfing',
          time: curr.time,
          position: 'aboveBar',
          color: '#FF0000',
          shape: 'arrowDown',
          text: 'BE'
        });
      }

      // Morning Star (3-candle bullish reversal)
      if (i >= 2 &&
          prev2.close < prev2.open && // First candle bearish
          Math.abs(prev.close - prev.open) < prevBody * 0.3 && // Second candle small
          curr.close > curr.open && // Third candle bullish
          curr.close > (prev2.open + prev2.close) / 2) { // Closes above midpoint of first
        patterns.push({
          type: 'Morning Star',
          time: curr.time,
          position: 'belowBar',
          color: '#FFD700',
          shape: 'arrowUp',
          text: 'MS'
        });
      }

      // Evening Star (3-candle bearish reversal)
      if (i >= 2 &&
          prev2.close > prev2.open && // First candle bullish
          Math.abs(prev.close - prev.open) < prevBody * 0.3 && // Second candle small
          curr.close < curr.open && // Third candle bearish
          curr.close < (prev2.open + prev2.close) / 2) { // Closes below midpoint of first
        patterns.push({
          type: 'Evening Star',
          time: curr.time,
          position: 'aboveBar',
          color: '#8B0000',
          shape: 'arrowDown',
          text: 'ES'
        });
      }
    }

    return patterns;
  };

  /**
   * Initialize chart
   */
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2a2a2a' },
        horzLines: { color: '#2a2a2a' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#485c7b',
      },
      timeScale: {
        borderColor: '#485c7b',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Add volume series if enabled
    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });
      
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      volumeSeriesRef.current = volumeSeries;
    }

    // Fetch and set data
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const candles = await fetchCandlestickData();
        candlestickSeries.setData(candles);

        // Detect and add pattern markers
        if (showPatterns) {
          const patterns = detectPatterns(candles);
          const markers = patterns.map(p => ({
            time: p.time,
            position: p.position,
            color: p.color,
            shape: p.shape,
            text: p.text
          }));
          candlestickSeries.setMarkers(markers as any);
        }

        chart.timeScale().fitContent();
        setLoading(false);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [currencyPair, timeframe, height, showVolume, showPatterns]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontSize: '18px',
          zIndex: 10
        }}>
          Loading {currencyPair} chart...
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          padding: '15px',
          background: '#ff4444',
          color: '#fff',
          borderRadius: '8px',
          zIndex: 10
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {lastPrice && !loading && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '8px 12px',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '14px',
          zIndex: 5,
          fontFamily: 'monospace'
        }}>
          {currencyPair}: <strong>{lastPrice.toFixed(5)}</strong>
        </div>
      )}

      <div ref={chartContainerRef} style={{ width: '100%', height: `${height}px` }} />
      
      {showPatterns && !loading && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          background: '#2a2a2a',
          borderRadius: '6px',
          color: '#d1d4dc',
          fontSize: '12px'
        }}>
          <strong>Pattern Legend:</strong> D=Doji, H=Hammer, SS=Shooting Star, BE=Bullish/Bearish Engulfing, MS=Morning Star, ES=Evening Star
        </div>
      )}
    </div>
  );
};

export default PolygonCandlestickChart;
