import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Help = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <SEOHead
        title="How to Use Currency Converter - Step by Step Guide | Currency to Currency"
        description="Learn how to use our free currency converter with step-by-step instructions. Convert 150+ currencies instantly with real-time exchange rates."
        keywords="how to use currency converter, currency conversion guide, exchange rate calculator tutorial, currency converter instructions"
        canonical="https://currencytocurrency.app/help"
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <BreadcrumbNav className="mb-6" />
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">How to Use Currency Converter</h1>
          <p className="text-lg text-muted-foreground">
            Complete guide to using our free currency converter with real-time exchange rates.
          </p>
        </header>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h3>Step 1: Access the Currency Converter</h3>
              <p>
                Navigate to our <Link to="/convert" className="text-primary hover:underline">Currency Converter page</Link> 
                or use the converter widget on our homepage. The interface is designed to be intuitive and user-friendly.
              </p>
              
              <h3>Step 2: Select Your Currencies</h3>
              <p>
                Choose the currency you want to convert from (source currency) and the currency you want to convert to (target currency). 
                We support over 150 fiat currencies and 100+ cryptocurrencies.
              </p>
              
              <h3>Step 3: Enter the Amount</h3>
              <p>
                Type the amount you want to convert in the input field. You can use decimal points for precise amounts. 
                The converter will automatically update as you type.
              </p>
              
              <h3>Step 4: View Results</h3>
              <p>
                The converted amount will appear instantly with the current exchange rate. 
                You'll also see the rate timestamp and any applicable fees or margins.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="secondary">Feature</Badge>
                    Historical Charts
                  </h3>
                  <p className="text-muted-foreground">
                    View exchange rate trends over time with our interactive charts. Select different time periods 
                    (1 day, 1 week, 1 month, 1 year) to analyze currency movements and make informed decisions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="secondary">Feature</Badge>
                    Price Alerts
                  </h3>
                  <p className="text-muted-foreground">
                    Set custom alerts for your preferred exchange rates. Get notified via email when currencies 
                    reach your target levels, helping you time your transactions optimally.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="secondary">Feature</Badge>
                    Popular Currency Pairs
                  </h3>
                  <p className="text-muted-foreground">
                    Quick access to commonly converted currency pairs like USD to EUR, GBP to USD, 
                    EUR to JPY, and many more. Save time with one-click conversions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="secondary">Feature</Badge>
                    Mobile Optimization
                  </h3>
                  <p className="text-muted-foreground">
                    Use our currency converter on any device. Our responsive design ensures a seamless 
                    experience whether you're on desktop, tablet, or smartphone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h3>How often are exchange rates updated?</h3>
              <p>
                Our exchange rates are updated every minute from reliable financial data sources. 
                We source rates from major banks and financial institutions to ensure accuracy.
              </p>
              
              <h3>Are the rates real-time?</h3>
              <p>
                Yes, our rates are real-time and reflect current market conditions. However, please note 
                that actual bank rates may vary slightly due to processing fees and margins.
              </p>
              
              <h3>Do you charge any fees?</h3>
              <p>
                No, our currency converter is completely free to use. We don't charge any fees for 
                currency conversion calculations or access to exchange rate information.
              </p>
              
              <h3>Can I convert cryptocurrencies?</h3>
              <p>
                Yes, we support over 100 cryptocurrencies including Bitcoin, Ethereum, and other major coins. 
                Cryptocurrency rates are updated in real-time from leading crypto exchanges.
              </p>
              
              <h3>How accurate are the conversion rates?</h3>
              <p>
                Our rates are highly accurate and sourced from reputable financial data providers. 
                However, actual conversion rates may vary slightly due to bank fees, processing charges, 
                and market fluctuations.
              </p>
              
              <h3>Do I need to create an account?</h3>
              <p>
                No account is required to use our currency converter. You can start converting currencies 
                immediately without any registration or login process.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h3>Check Multiple Sources</h3>
              <p>
                While our rates are accurate, it's always good practice to compare rates from multiple 
                sources, especially for large transactions or when dealing with less common currencies.
              </p>
              
              <h3>Consider Timing</h3>
              <p>
                Exchange rates fluctuate throughout the day. Use our historical charts to identify 
                optimal times for currency conversion based on market trends.
              </p>
              
              <h3>Account for Fees</h3>
              <p>
                Remember that actual conversion rates may include bank fees, processing charges, 
                or currency conversion fees. Always check with your financial institution for final rates.
              </p>
              
              <h3>Use Price Alerts</h3>
              <p>
                Set up price alerts for currencies you frequently convert. This helps you catch 
                favorable rates and optimize your conversion timing.
              </p>
              
              <h3>Stay Informed</h3>
              <p>
                Read our <Link to="/blog" className="text-primary hover:underline">currency blog</Link> for market insights, 
                travel tips, and financial advice to make informed currency decisions.
              </p>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Ready to start converting currencies? Try our free converter now!
            </p>
            <Link 
              to="/convert" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Converting Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
