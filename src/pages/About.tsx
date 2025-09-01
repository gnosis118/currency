import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <SEOHead
        title="About Currency to Currency - Free Real-time Exchange Rate Converter"
        description="Learn about Currency to Currency, the leading free currency converter with real-time exchange rates for 150+ currencies and 100+ cryptocurrencies."
        keywords="about currency converter, exchange rate tool, currency conversion service, real-time rates, forex calculator"
        canonical="https://currencytocurrency.app/about"
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <BreadcrumbNav className="mb-6" />
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">About Currency to Currency</h1>
          <p className="text-lg text-muted-foreground">
            Your trusted partner for real-time currency conversion and exchange rate information.
          </p>
        </header>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>
                At Currency to Currency, we believe that access to accurate, real-time exchange rates should be free and available to everyone. 
                Whether you're a traveler planning your next adventure, a business professional conducting international transactions, 
                or an investor tracking currency markets, we provide the tools you need to make informed financial decisions.
              </p>
              <p>
                Our platform serves millions of users worldwide, offering instant currency conversion for over 150 fiat currencies 
                and 100+ cryptocurrencies. We're committed to providing the most accurate and up-to-date exchange rate information 
                available, helping you navigate the complex world of international finance with confidence.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Real-time Exchange Rates</h3>
                  <p className="text-muted-foreground">
                    Get live exchange rates updated every minute from reliable financial data sources. 
                    Our rates are sourced from major banks and financial institutions worldwide.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">150+ Fiat Currencies</h3>
                  <p className="text-muted-foreground">
                    Convert between major world currencies including USD, EUR, GBP, JPY, CAD, AUD, 
                    and many more. We cover currencies from every continent and major economy.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">100+ Cryptocurrencies</h3>
                  <p className="text-muted-foreground">
                    Track Bitcoin, Ethereum, and other major cryptocurrencies with real-time pricing. 
                    Stay updated on the latest crypto market movements and trends.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Historical Charts</h3>
                  <p className="text-muted-foreground">
                    Analyze currency trends with interactive historical charts. View exchange rate 
                    movements over time to make informed trading and investment decisions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Price Alerts</h3>
                  <p className="text-muted-foreground">
                    Set custom alerts for your preferred exchange rates. Get notified when currencies 
                    reach your target levels for optimal timing of transactions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Travel Guides</h3>
                  <p className="text-muted-foreground">
                    Access comprehensive travel money guides and tips. Learn about currency exchange 
                    best practices for international travel and business.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose Currency to Currency?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h3>Accuracy and Reliability</h3>
              <p>
                Our exchange rates are sourced from multiple reliable financial data providers, 
                ensuring accuracy and consistency. We update our rates every minute to provide 
                the most current information available.
              </p>
              
              <h3>User-Friendly Interface</h3>
              <p>
                Our clean, intuitive design makes currency conversion quick and easy. 
                Whether you're a first-time user or a financial professional, our platform 
                is designed to meet your needs with minimal learning curve.
              </p>
              
              <h3>No Registration Required</h3>
              <p>
                Start converting currencies immediately without creating an account. 
                We believe in providing instant access to financial tools without barriers.
              </p>
              
              <h3>Mobile Optimized</h3>
              <p>
                Access our currency converter on any device. Our responsive design ensures 
                a seamless experience whether you're using a desktop, tablet, or smartphone.
              </p>
              
              <h3>Comprehensive Coverage</h3>
              <p>
                From major world currencies to emerging market currencies and cryptocurrencies, 
                we provide coverage for virtually every currency you might need to convert.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Commitment to Quality</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>
                We're committed to maintaining the highest standards of accuracy and reliability 
                in our currency conversion services. Our team continuously monitors and updates 
                our data sources to ensure you always have access to the most current and 
                accurate exchange rate information.
              </p>
              <p>
                We also prioritize user privacy and security. We don't store personal information 
                or track individual conversion history, ensuring your financial activities remain 
                private and secure.
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link 
              to="/convert" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Converting Currencies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
