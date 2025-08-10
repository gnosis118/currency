import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SEOHead from '@/components/SEOHead';

const FAQ = () => {
  const faqs = [
    {
      question: "How accurate are the exchange rates?",
      answer: "Our exchange rates are sourced from reliable financial APIs and are updated in real-time. We use exchangerate-api.com for fiat currencies and CoinGecko for cryptocurrencies, which provide institutional-grade data used by banks and financial institutions worldwide."
    },
    {
      question: "How often are the rates updated?",
      answer: "Fiat currency rates are updated every few minutes during market hours, while cryptocurrency prices are updated in real-time as they trade 24/7. You can see the last update timestamp on each conversion."
    },
    {
      question: "Is this currency converter free to use?",
      answer: "Yes, our basic currency conversion service is completely free. You can convert between over 150 currencies and cryptocurrencies without any cost or registration required."
    },
    {
      question: "Can I set up price alerts?",
      answer: "Yes! You can set up custom price alerts for any currency pair or cryptocurrency. Simply go to the Alerts page and configure your desired exchange rate thresholds. You'll receive notifications when rates reach your target."
    },
    {
      question: "Do you support cryptocurrency conversions?",
      answer: "Absolutely! We support over 100 major cryptocurrencies including Bitcoin, Ethereum, and many altcoins. You can convert between crypto-to-crypto pairs or crypto-to-fiat currencies."
    },
    {
      question: "How do I use the historical charts?",
      answer: "Visit our Charts page to view historical exchange rate data. You can select different time periods (1 day to 1 year) and compare multiple currency pairs to analyze trends and make informed decisions."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take privacy seriously. We don't store personal financial information, and all data transmission is encrypted. Our service doesn't require personal information for basic currency conversions."
    },
    {
      question: "Can I use this for business purposes?",
      answer: "Our converter is suitable for reference purposes. For business transactions, we recommend consulting with your bank or financial advisor for the most current rates, as actual exchange rates may include fees and spreads."
    },
    {
      question: "Do you have a mobile app?",
      answer: "Our website is fully responsive and works great on mobile devices. You can also install it as a Progressive Web App (PWA) on your phone for a native app-like experience."
    },
    {
      question: "What travel money features do you offer?",
      answer: "Our Travel page provides currency conversion specifically for travelers, including tips for getting the best exchange rates, information about foreign transaction fees, and guidance on how much local currency to carry."
    }
  ];


  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <SEOHead
        title="Currency Converter FAQ - Common Questions | Currency to Currency"
        description="Currency converter FAQ: rates accuracy, crypto support, alerts setup & travel tips. Quick answers to common currency conversion questions."
        keywords="currency converter FAQ, exchange rate questions, currency conversion help, forex FAQ, currency converter support, exchange rate accuracy"
        canonical="https://currencytocurrency.app/faq"
        structuredData={faqStructuredData}
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about our currency converter, exchange rates, and features.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <h3 className="font-medium">{faq.question}</h3>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our currency converter is designed to be intuitive and easy to use.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Real-time exchange rates updated every few minutes</p>
              <p>• Support for 150+ fiat currencies and 100+ cryptocurrencies</p>
              <p>• Historical charts and price alerts available</p>
              <p>• Free to use with no registration required</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;