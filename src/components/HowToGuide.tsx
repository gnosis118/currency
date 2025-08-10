import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle } from 'lucide-react';
import SEOHead from './SEOHead';

interface HowToGuideProps {
  fromCurrency: string;
  toCurrency: string;
}

const HowToGuide = ({ fromCurrency, toCurrency }: HowToGuideProps) => {
  const steps = [
    {
      step: 1,
      title: "Enter the amount",
      description: `Input the amount of ${fromCurrency} you want to convert`
    },
    {
      step: 2,
      title: "Select currencies",
      description: `Choose ${fromCurrency} as source and ${toCurrency} as target currency`
    },
    {
      step: 3,
      title: "Get instant results",
      description: `View the converted amount in ${toCurrency} with live exchange rates`
    },
    {
      step: 4,
      title: "Track rate changes",
      description: "Set up alerts to monitor favorable exchange rate movements"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Convert ${fromCurrency} to ${toCurrency}`,
    "description": `Step-by-step guide to convert ${fromCurrency} to ${toCurrency} using our free currency converter`,
    "image": "https://currencytocurrency.app/src/assets/home-hero.jpg",
    "totalTime": "PT2M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Internet connection"
      },
      {
        "@type": "HowToSupply", 
        "name": "Amount to convert"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Currency to Currency Converter"
      }
    ],
    "step": steps.map(step => ({
      "@type": "HowToStep",
      "position": step.step,
      "name": step.title,
      "text": step.description,
      "url": `https://currencytocurrency.app/#step-${step.step}`
    }))
  };

  return (
    <>
      <SEOHead structuredData={structuredData} />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Convert {fromCurrency} to {toCurrency}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.step} className="flex items-start gap-3" id={`step-${step.step}`}>
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default HowToGuide;