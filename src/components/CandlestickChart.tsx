import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  currencyPair: string; // e.g., "USD/EUR", "GBP/USD"
  timeframe?: '1H' | '4H' | '1D' | '1W' | '1M';
  height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  currencyPair, 
  timeframe = '1D',
  height = 500 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert currency pair format (USD/EUR -> USDEUR)
  const formatPairForAPI = (pair: string) => pair.replace('/', '');

  // Fetch historical OHLC data from your API or external source
  const fetchCandlestickData = async (): Promise<CandlestickData[]> => {
    try {
      const pair = formatPairForAPI(currencyPair);
      
      // Option 1: If you have your own API endpoint
      // const response = await fetch(`/api/ohlc/${pair}?timeframe=${timeframe}`);
      
      // Option 2: Using Alpha Vantage (free tier: 5 calls/minute, 500 calls/day)
      const ALPHA_VANTAGE_KEY = 'YOUR_API_KEY'; // Replace with your key
      const interval = timeframe === '1H' ? '60min' : 'daily';
      const from_symbol = pair.substring(0, 3);
      const to_symbol = pair.substring(3, 6);
      
      const response = await fetch(
        `https://www.alphavantage.co/query?function=FX_${interval === 'daily' ? 'DAILY' : 'INTRADAY'}&from_symbol=${from_symbol}&to_symbol=${to_symbol}&interval=${interval}&apikey=${ALPHA_VANTAGE_KEY}&outputsize=full`
      );
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      
      // Parse Alpha Vantage response
      const timeSeries = data[`Time Series FX (${interval === 'daily' ? 'Daily' : interval})`];
      
      if (!timeSeries) {
        throw new Error('No data available for this currency pair');
      }
      
      // Convert to candlestick format
      const candlesticks: CandlestickData[] = Object.entries(timeSeries)
        .map(([timestamp, values]: [string, any]) => ({
          time: new Date(timestamp).getTime() / 1000, // Convert to Unix timestamp
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close'])
        }))
        .sort((a, b) => a.time - b.time) // Sort chronologically
        .slice(-200); // Last 200 candles
      
      return candlesticks;
    } catch (err) {
      throw new Error(`Failed to load chart data: ${err}`);
    }
  };

  // Generate sample data if API fails (for development/demo)
  const generateSampleData = (): CandlestickData[] => {
    const data: CandlestickData[] = [];
    let basePrice = 1.0850; // Starting EUR/USD rate
    const now = Math.floor(Date.now() / 1000);
    const interval = timeframe === '1H' ? 3600 : 86400; // seconds
    
    for (let i = 200; i >= 0; i--) {
      const time = now - (i * interval);
      const volatility = 0.002;
      const trend = (Math.random() - 0.5) * 0.0001;
      
      const open = basePrice;
      const close = open + trend + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      
      data.push({
        time,
        open: parseFloat(open.toFixed(5)),
        high: parseFloat(high.toFixed(5)),
        low: parseFloat(low.toFixed(5)),
        close: parseFloat(close.toFixed(5))
      });
      
      basePrice = close;
    }
    
    return data;
  };

  // Detect candlestick patterns
  const detectPatterns = (data: CandlestickData[], index: number): string[] => {
    const patterns: string[] = [];
    const current = data[index];
    const prev = data[index - 1];
    const prev2 = data[index - 2];
    
    if (!prev || !prev2) return patterns;
    
    const bodySize = Math.abs(current.close - current.open);
    const upperWick = current.high - Math.max(current.open, current.close);
    const lowerWick = Math.min(current.open, current.close) - current.low;
    const isBullish = current.close > current.open;
    const isBearish = current.close < current.open;
    
    // Doji (very small body)
    if (bodySize < (current.high - current.low) * 0.1) {
      patterns.push('Doji');
    }
    
    // Hammer (small body, long lower wick, little/no upper wick)
    if (isBullish && lowerWick > bodySize * 2 && upperWick < bodySize * 0.1) {
      patterns.push('Hammer (Bullish)');
    }
    
    // Inverted Hammer
    if (isBullish && upperWick > bodySize * 2 && lowerWick < bodySize * 0.1) {
      patterns.push('Inverted Hammer');
    }
    
    // Shooting Star (bearish)
    if (isBearish && upperWick > bodySize * 2 && lowerWick < bodySize * 0.1) {
      patterns.push('Shooting Star (Bearish)');
    }
    
    // Bullish Engulfing
    if (prev.close < prev.open && // Previous bearish
        current.close > current.open && // Current bullish
        current.open < prev.close &&
        current.close > prev.open) {
      patterns.push('Bullish Engulfing');
    }
    
    // Bearish Engulfing
    if (prev.close > prev.open && // Previous bullish
        current.close < current.open && // Current bearish
        current.open > prev.close &&
        current.close < prev.open) {
      patterns.push('Bearish Engulfing');
    }
    
    // Morning Star (3-candle bullish reversal)
    if (prev2.close < prev2.open && // First bearish
        Math.abs(prev.close - prev.open) < bodySize * 0.5 && // Second small
        current.close > current.open && // Third bullish
        current.close > (prev2.open + prev2.close) / 2) {
      patterns.push('Morning Star (Strong Bullish)');
    }
    
    // Evening Star (3-candle bearish reversal)
    if (prev2.close > prev2.open && // First bullish
        Math.abs(prev.close - prev.open) < bodySize * 0.5 && // Second small
        current.close < current.open && // Third bearish
        current.close < (prev2.open + prev2.close) / 2) {
      patterns.push('Evening Star (Strong Bearish)');
    }
    
    return patterns;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2B2B43',
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: 1, // Normal crosshair
        vertLine: {
          width: 1,
          color: '#758696',
          style: 3, // Dashed
        },
        horzLine: {
          width: 1,
          color: '#758696',
          style: 3,
        },
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Load data
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: CandlestickData[];
        
        try {
          // Try to fetch real data first
          data = await fetchCandlestickData();
        } catch (err) {
          console.warn('Using sample data:', err);
          // Fall back to sample data
          data = generateSampleData();
        }
        
        candlestickSeries.setData(data);
        
        // Add pattern detection markers
        const markers = data
          .map((candle, index) => {
            const patterns = detectPatterns(data, index);
            if (patterns.length > 0) {
              return {
                time: candle.time,
                position: patterns.some(p => p.includes('Bullish')) ? 'belowBar' : 'aboveBar',
                color: patterns.some(p => p.includes('Bullish')) ? '#26a69a' : '#ef5350',
                shape: patterns.some(p => p.includes('Engulfing')) ? 'arrowUp' : 'circle',
                text: patterns[0], // Show first pattern
                size: 1,
              };
            }
            return null;
          })
          .filter(marker => marker !== null) as any[];
        
        candlestickSeries.setMarkers(markers);
        
        // Fit content
        chart.timeScale().fitContent();
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chart');
        setLoading(false);
      }
    };

    loadData();

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [currencyPair, timeframe, height]);

  return (
    <div className="candlestick-chart-container">
      <div className="chart-header" style={{
        padding: '15px',
        background: '#1a1a1a',
        borderBottom: '1px solid #2B2B43',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, color: '#d1d4dc', fontSize: '18px', fontWeight: 600 }}>
            {currencyPair} - {timeframe} Candlestick Chart
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '13px' }}>
            Real-time forex data with pattern detection
          </p>
        </div>
        <div className="timeframe-selector" style={{ display: 'flex', gap: '8px' }}>
          {(['1H', '4H', '1D', '1W', '1M'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => window.location.href = `?timeframe=${tf}`}
              style={{
                padding: '6px 12px',
                background: timeframe === tf ? '#26a69a' : '#2B2B43',
                color: '#d1d4dc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#d1d4dc',
          fontSize: '16px'
        }}>
          Loading chart data...
        </div>
      )}
      
      {error && (
        <div style={{
          padding: '20px',
          background: '#ef5350',
          color: 'white',
          margin: '15px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <div 
        ref={chartContainerRef} 
        style={{ 
          position: 'relative',
          background: '#1a1a1a'
        }} 
      />
      
      <div className="chart-legend" style={{
        padding: '15px',
        background: '#1a1a1a',
        borderTop: '1px solid #2B2B43',
        fontSize: '12px',
        color: '#888'
      }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#26a69a', borderRadius: '50%' }}></div>
            <span>Bullish Pattern</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#ef5350', borderRadius: '50%' }}></div>
            <span>Bearish Pattern</span>
          </div>
          <div style={{ marginLeft: 'auto', color: '#d1d4dc' }}>
            Hover over markers to see pattern names
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;