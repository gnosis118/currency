import { lazy, Suspense, memo } from 'react';
import { ChartSkeleton } from './SkeletonLoader';

// Lazy load the chart component to reduce initial bundle size
const HistoricalChart = lazy(() => import('./HistoricalChart'));

interface LazyChartProps {
  fromCurrency: string;
  toCurrency: string;
  currentRate: number;
  className?: string;
}

const LazyChart = memo(({ fromCurrency, toCurrency, currentRate, className }: LazyChartProps) => {
  return (
    <div className={className}>
      <Suspense fallback={<ChartSkeleton />}>
        <HistoricalChart fromCurrency={fromCurrency} toCurrency={toCurrency} currentRate={currentRate} />
      </Suspense>
    </div>
  );
});

LazyChart.displayName = 'LazyChart';

export default LazyChart;