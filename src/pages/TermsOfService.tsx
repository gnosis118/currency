import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, AlertTriangle, Scale, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedSEOHead from '@/components/EnhancedSEOHead';

const TermsOfService = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - Currency to Currency",
    "description": "Terms and conditions for using Currency to Currency converter app, including user responsibilities and service limitations.",
    "url": "https://currencytocurrency.app/terms-of-service",
    "mainEntity": {
      "@type": "TermsOfService",
      "datePublished": "2024-01-01",
      "dateModified": "2024-01-01"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Terms of Service - Currency to Currency | Legal Terms & Conditions"
        description="Terms of service for Currency to Currency converter. Understand your rights, responsibilities, and service limitations when using our platform."
        canonicalUrl="https://currencytocurrency.app/terms-of-service"
        keywords="terms of service, legal terms, currency converter terms, user agreement, service conditions"
        structuredData={structuredData}
        pageType="article"
      />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Currency Converter
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                These Terms of Service ("Terms") govern your use of our website located at currencytocurrency.app (the "Service") operated by Currency Converter ("us", "we", or "our").
              </p>
              <p className="text-sm text-muted-foreground">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Currency Converter provides real-time currency exchange rates and cryptocurrency price information for informational purposes only. Our Service includes:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Real-time fiat currency conversion</li>
                <li>Cryptocurrency price tracking</li>
                <li>Historical exchange rate information</li>
                <li>Market trend indicators</li>
              </ul>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Acceptable Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Permitted Uses</h3>
                <p className="text-sm text-muted-foreground">
                  You may use our Service for lawful purposes only and in accordance with these Terms. You agree to use the Service only for:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Personal, non-commercial use</li>
                  <li>Educational and informational purposes</li>
                  <li>Research and analysis</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Prohibited Uses</h3>
                <p className="text-sm text-muted-foreground mb-2">You agree not to use the Service:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                  <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                  <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Financial Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Financial Information Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">IMPORTANT FINANCIAL DISCLAIMER</p>
                <p className="text-sm text-muted-foreground">
                  The information provided on this Service is for informational purposes only and should not be considered as financial advice, investment advice, trading advice, or any other sort of advice.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">No Financial Advice</h3>
                <p className="text-sm text-muted-foreground">
                  We do not provide investment, financial, or trading advice. All information is provided "as is" for informational purposes only. You should consult with a qualified financial advisor before making any investment decisions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Market Volatility</h3>
                <p className="text-sm text-muted-foreground">
                  Currency and cryptocurrency markets are highly volatile and unpredictable. Past performance is not indicative of future results. You acknowledge that you understand the risks involved in currency trading and cryptocurrency investments.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Accuracy of Information</h3>
                <p className="text-sm text-muted-foreground">
                  While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy, completeness, or timeliness of the information displayed on our Service. Exchange rates and prices may be delayed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Currency Converter and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
              <p className="text-sm text-muted-foreground">
                Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Currently, our Service does not require user accounts. All features are available without registration. If we implement user accounts in the future:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>You will be responsible for maintaining the confidentiality of your account information</li>
                <li>You will be responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.
              </p>
              <Link to="/privacy-policy" className="inline-block mt-2">
                <Button variant="outline" size="sm">
                  View Privacy Policy
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                In no event shall Currency Converter, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                <li>Damages resulting from your use or inability to use the Service</li>
                <li>Damages resulting from any unauthorized access to or use of our servers</li>
                <li>Damages resulting from any interruption or cessation of transmission to or from the Service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions, and other terms which might otherwise have effect in relation to our Service.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which our Service operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm"><strong>Website:</strong> currencytocurrency.app</p>
                <p className="text-sm"><strong>Email:</strong> legal@currencytocurrency.app</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-4">
            <Link to="/">
              <Button variant="outline">
                Return to Home
              </Button>
            </Link>
            <Link to="/privacy-policy">
              <Button variant="outline">
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;