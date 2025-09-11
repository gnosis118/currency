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
    "description": "Comprehensive privacy policy detailing data collection, usage, and user rights for Currency to Currency converter app. GDPR and CCPA compliant.",
    "url": "https://currencytocurrency.app/privacy-policy",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "isPartOf": {
      "@type": "WebSite",
      "name": "Currency to Currency",
      "url": "https://currencytocurrency.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Currency to Currency",
      "url": "https://currencytocurrency.app"
    },
    "mainEntity": {
      "@type": "PrivacyPolicy",
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "governmentAgency": "GDPR, CCPA Compliant",
      "jurisdiction": "EU, California, International"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" tabIndex={-1} role="main" aria-label="Privacy policy information">
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

        {/* Cookie Declaration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Cookie Declaration
            </CardTitle>
            <p className="text-muted-foreground">
              Detailed information about all cookies used on this website
            </p>
          </CardHeader>
          <CardContent>
            <div id="CookieDeclaration">
              <script
                id="CookieDeclaration"
                src="https://consent.cookiebot.com/a316e185-0703-4964-b697-d0301f10cdb9/cd.js"
                type="text/javascript"
                async
              />
            </div>
          </CardContent>
        </Card>

        {/* Cookie Preferences (Manage/Withdraw) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Manage Your Cookie Preferences
            </CardTitle>
            <p className="text-muted-foreground">
              You can change or withdraw your cookie consent at any time.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => (window as any).openCookieSettings?.() || (window as any).withdrawConsent?.()}
            >
              Open Cookie Settings
            </Button>
            <Button
              variant="destructive"
              onClick={() => (window as any).withdrawConsent?.()}
            >
              Withdraw Consent
            </Button>
          </CardContent>
        </Card>


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

          {/* Legal Basis for Processing (GDPR) */}
          <Card>
            <CardHeader>
              <CardTitle>Legal Basis for Processing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li><strong>Consent:</strong> Analytics and advertising cookies/processes are used only with your consent.</li>
                <li><strong>Contract:</strong> If you create an account, we process necessary data to provide the service (authentication, account management).</li>
                <li><strong>Legitimate Interests:</strong> Essential security and fraud prevention (e.g., rate limiting, error logging) with minimal impact on your privacy.</li>
                <li><strong>Legal Obligation:</strong> Where required to comply with applicable laws and regulations.</li>
              </ul>
            </CardContent>
          </Card>

          {/* International Data Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-sm text-muted-foreground">
                Your information may be processed in countries outside your own (including the United States and EU). Where applicable, we rely on appropriate safeguards such as Standard Contractual Clauses (SCCs) or equivalent mechanisms provided by our service providers.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-3">
                We retain your information only for as long as necessary to fulfill the purposes outlined in this policy:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li><strong>Usage Data:</strong> Retained for up to 26 months for analytics purposes</li>
                <li><strong>Cookie Data:</strong> Varies by cookie type (see Cookie Declaration above)</li>
                <li><strong>Account Data:</strong> Retained until account deletion is requested</li>
                <li><strong>Legal Obligations:</strong> Retained as required by applicable laws</li>
              </ul>
            </CardContent>
          </Card>

          {/* Security Measures */}
          <Card>
            <CardHeader>
              <CardTitle>Security Measures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-3">
                We implement comprehensive security measures to protect your information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Technical Safeguards</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>HTTPS encryption for all data transmission</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Secure hosting infrastructure</li>
                    <li>Access controls and authentication</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Organizational Measures</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Employee privacy training</li>
                    <li>Data protection impact assessments</li>
                    <li>Incident response procedures</li>
                    <li>Vendor security requirements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Breach Procedures */}
          <Card>
            <CardHeader>
              <CardTitle>Data Breach Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                In the unlikely event of a data breach affecting your personal information:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>We will assess the risk and take immediate containment measures</li>
                <li>We will notify supervisory authorities within 72 hours when required by law</li>
                <li>We will notify affected users without undue delay if there is a high risk to their rights</li>
                <li>We will provide clear information about the breach and recommended protective actions</li>
              </ul>
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg mt-3">
                <p className="text-sm font-medium text-red-800">Report Security Issues</p>
                <p className="text-sm text-red-700">Email: security@currencytocurrency.app</p>
              </div>
            </CardContent>
          </Card>

          {/* Automated Decision Making */}
          <Card>
            <CardHeader>
              <CardTitle>Automated Decision Making</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We do not engage in automated decision-making or profiling that produces legal effects or significantly affects you. Any automated processing is limited to basic website functionality and fraud prevention.
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
                If you have any questions about this Privacy Policy or want to exercise your data protection rights, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm"><strong>Website:</strong> currencytocurrency.app</p>
                <p className="text-sm"><strong>Privacy Email:</strong> privacy@currencytocurrency.app</p>
                <p className="text-sm"><strong>Data Protection Officer:</strong> dpo@currencytocurrency.app</p>
                <p className="text-sm"><strong>Security Issues:</strong> security@currencytocurrency.app</p>
                <p className="text-sm"><strong>Response Time:</strong> Within 72 hours for privacy inquiries</p>
                <p className="text-sm"><strong>Postal Address:</strong> Data Protection Team, Currency to Currency, [Your Business Address]</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-4">
                <p className="text-sm font-medium text-blue-800 mb-1">For Data Subject Rights Requests:</p>
                <p className="text-sm text-blue-700">
                  Please clearly state your location (EU/California/Other) and specify the type of request (access, rectification, erasure, portability, restriction, objection) in your email.
                </p>
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
      </main>
    </div>
  );
};

export default PrivacyPolicy;