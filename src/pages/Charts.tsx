import HistoricalChart from '@/components/HistoricalChart';
import SEOHead from '@/components/SEOHead';
import chartsHero from '@/assets/charts-hero.jpg';

const Charts = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Currency Exchange Rate Charts",
    "description": "Interactive historical currency exchange rate charts and trends analysis. Track currency performance over time with detailed data visualization.",
    "url": "https://currencytocurrency.app/charts",
    "applicationCategory": "FinanceApplication",
    "featureList": [
      "Historical exchange rate charts",
      "Currency trend analysis", 
      "Interactive data visualization",
      "Multiple time periods",
      "Currency performance tracking"
    ]
  };

  return (
    <div className="min-h-screen bg-converter-bg">
      <SEOHead
        title="Currency Exchange Rate Charts & Historical Data | Currency to Currency"
        description="View historical currency charts & trends. Interactive rate analysis with 1-year data. Track forex performance for informed exchange decisions."
        keywords="currency charts, exchange rate history, currency trends, historical rates, forex charts, currency analysis, exchange rate graphs, currency performance"
        canonical="https://currencytocurrency.app/charts"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img 
          src={chartsHero} 
          alt="Interactive historical currency exchange rate charts showing trend analysis and market performance over time" 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width="1200"
          height="320"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Historical Charts</h1>
            <p className="text-lg md:text-xl opacity-90">
              Track currency trends and historical exchange rates with interactive charts
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 -mt-16 relative z-10">
        <div className="bg-converter-bg rounded-lg shadow-lg p-6 mb-8">
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Analyze currency performance over time with detailed historical data. 
            Our charts help you identify trends and make informed decisions about currency conversions.
          </p>
        </div>
        
        <HistoricalChart 
          fromCurrency="USD" 
          toCurrency="EUR" 
          currentRate={1} 
        />
      </div>
    </div>
  );
};

export default Charts;