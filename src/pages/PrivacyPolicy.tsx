import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedSEOHead from '@/components/EnhancedSEOHead';

const PrivacyPolicy = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Currency to Currency",
    "description": "Privacy policy for Currency to Currency converter app, detailing data collection, usage, and user rights.",
    "url": "https://currencytocurrency.app/privacy-policy",
    "mainEntity": {
      "@type": "PrivacyPolicy",
      "datePublished": "2024-01-01",
      "dateModified": "2024-01-01"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Privacy Policy - Currency to Currency | Data Protection & User Rights"
        description="Our privacy policy explains how we collect, use, and protect your data when using our currency converter. Learn about your rights and data protection measures."
        canonicalUrl="https://currencytocurrency.app/privacy-policy"
        keywords="privacy policy, data protection, currency converter privacy, user rights, data collection"
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
              <Shield className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
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
                <Eye className="h-5 w-5 mr-2" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                At Currency Converter ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website currencytocurrency.app (the "Service").
              </p>
              <p>
                By using our Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p className="text-sm text-muted-foreground">
                  We do not collect personal information such as names, email addresses, or phone numbers unless you voluntarily provide them to us.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Usage Data</h3>
                <p className="text-sm text-muted-foreground">
                  We may collect information that your browser sends whenever you visit our Service, including:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Your computer's Internet Protocol (IP) address</li>
                  <li>Browser type and version</li>
                  <li>Pages you visit on our Service</li>
                  <li>Time and date of your visit</li>
                  <li>Time spent on pages</li>
                  <li>Device identifiers and other diagnostic data</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cookies and Tracking Technologies</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies and similar tracking technologies to track activity on our Service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>To provide and maintain our Service</li>
                <li>To improve and optimize our website</li>
                <li>To analyze usage patterns and trends</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations</li>
                <li>To provide customer support</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">Service Providers</h3>
                <p className="text-sm text-muted-foreground">
                  We may employ third-party companies and individuals to facilitate our Service, provide support, or perform analytics on our behalf.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Legal Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  We may disclose your information if required to do so by law or in response to valid requests by public authorities.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Business Transfers</h3>
                <p className="text-sm text-muted-foreground">
                  If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The security of your data is important to us. We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Data Protection Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate information</li>
                <li><strong>Erasure:</strong> Request deletion of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Objection:</strong> Object to processing of your information</li>
              </ul>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">API Providers</h3>
                <p className="text-sm text-muted-foreground">
                  Our Service uses the following third-party APIs to provide real-time currency and cryptocurrency data:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li><strong>Exchange Rates API:</strong> For fiat currency exchange rates</li>
                  <li><strong>CoinGecko API:</strong> For cryptocurrency prices and data</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  These services may collect data according to their own privacy policies.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Changes are effective when posted on this page.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm"><strong>Website:</strong> currencytocurrency.app</p>
                <p className="text-sm"><strong>Email:</strong> privacy@currencytocurrency.app</p>
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
            <Link to="/terms-of-service">
              <Button variant="outline">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;