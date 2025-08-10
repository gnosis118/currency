import RateAlerts from '@/components/RateAlerts';
import SEOHead from '@/components/SEOHead';
import alertsHero from '@/assets/alerts-hero.jpg';

const Alerts = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication", 
    "name": "Currency Rate Alerts",
    "description": "Set personalized currency exchange rate alerts and get notified when rates reach your target levels. Never miss the perfect exchange rate opportunity.",
    "url": "https://currencytocurrency.app/alerts",
    "applicationCategory": "FinanceApplication",
    "featureList": [
      "Personalized rate alerts",
      "Email notifications",
      "Target rate monitoring",
      "Multiple currency pairs",
      "Real-time rate tracking"
    ]
  };

  return (
    <div className="min-h-screen bg-converter-bg">
      <SEOHead
        title="Currency Rate Alerts & Notifications | Currency to Currency"
        description="Set currency rate alerts & get email notifications when rates hit your targets. Never miss the perfect exchange opportunity. Free monitoring."
        keywords="currency alerts, exchange rate notifications, rate alerts, currency monitoring, forex alerts, exchange rate tracking, currency price alerts, rate notifications"
        canonical="https://currencytocurrency.app/alerts"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img 
          src={alertsHero} 
          alt="Smart currency rate alert system with notifications for optimal exchange rates and trading opportunities" 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width="1200"
          height="320"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Rate Alerts</h1>
            <p className="text-lg md:text-xl opacity-90">
              Never miss the perfect exchange rate with personalized email alerts
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 -mt-16 relative z-10">
        <div className="bg-converter-bg rounded-lg shadow-lg p-6 mb-8">
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Set up personalized rate alerts to be notified when your target currencies reach specific exchange rates. 
            Never miss an opportunity to convert at your ideal rate.
          </p>
        </div>
        
        <RateAlerts />
      </div>
    </div>
  );
};

export default Alerts;