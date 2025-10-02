import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Shield, Clock, Globe, AlertTriangle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedSEOHead from '@/components/EnhancedSEOHead';

const Contact = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Us - Currency to Currency",
      "description": "Contact information for privacy inquiries, GDPR requests, data protection questions, and general support.",
      "url": "https://currencytocurrency.app/contact",
      "mainEntity": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@currencytocurrency.app",
        "availableLanguage": "English"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Currency to Currency",
      "description": "Free real-time currency converter and exchange rate service",
      "@id": "https://currencytocurrency.app/#business",
      "url": "https://currencytocurrency.app",
      "logo": "https://currencytocurrency.app/favicon-192x192.png",
      "serviceType": "Currency Conversion Service",
      "areaServed": "Worldwide",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "support@currencytocurrency.app",
        "url": "https://currencytocurrency.app/contact",
        "availableLanguage": "English"
      }
    }
  ];
  const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
  const [testTo, setTestTo] = useState('you@example.com');
  const [sending, setSending] = useState(false);
  const sendTest = async () => {
    try {
      setSending(true);
      const res = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testTo,
          subject: 'Test Email from CurrencyToCurrency',
          text: 'This is a test email sent from the Contact page dev tool.'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Send failed');
      alert('Email sent! RequestId: ' + (data.requestId || 'n/a'));
    } catch (e) {
      alert('Send failed: ' + (e && e.message ? e.message : String(e)));
    } finally {
      setSending(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Contact Us - Currency to Currency | Privacy & Support Inquiries"
        description="Contact Currency to Currency for privacy inquiries, GDPR/CCPA requests, data protection questions, and general support. Quick response guaranteed."
        canonicalUrl="https://currencytocurrency.app/contact"
        keywords="contact support, privacy inquiry, GDPR request, CCPA request, data protection, customer support"
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
              <Mail className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-4xl font-bold">Contact Us</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              We're here to help with your privacy and data protection questions
            </p>
          </div>
        </div>

        {/* Quick Response Promise */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <Badge variant="secondary">Response Guarantee</Badge>
            </div>
            <p className="text-sm">
              We respond to all privacy and data protection inquiries within <strong>72 hours</strong>.
              For urgent security matters, we aim to respond within 24 hours.
            </p>
          </CardContent>
        </Card>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Privacy & Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Data Protection
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                GDPR, CCPA requests, privacy questions, data subject rights
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Data Protection Officer:</p>
                <a
                  href="mailto:dpo@currencytocurrency.app"
                  className="text-sm text-primary hover:underline block"
                >
                  dpo@currencytocurrency.app
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Privacy Inquiries:</p>
                <a
                  href="mailto:privacy@currencytocurrency.app"
                  className="text-sm text-primary hover:underline block"
                >
                  privacy@currencytocurrency.app
                </a>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>For GDPR/CCPA requests:</strong> Please include your location and specify the type of request
                  (access, rectification, erasure, portability, restriction, objection).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* General Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                General Support
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Technical issues, feature requests, general questions
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">General Support:</p>
                <a
                  href="mailto:support@currencytocurrency.app"
                  className="text-sm text-primary hover:underline block"
                >
                  support@currencytocurrency.app
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Technical Issues:</p>
                <a
                  href="mailto:tech@currencytocurrency.app"
                  className="text-sm text-primary hover:underline block"
                >
                  tech@currencytocurrency.app
                </a>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Website:</strong> currencytocurrency.app<br/>
                  <strong>Operating Hours:</strong> 9 AM - 6 PM EST (Mon-Fri)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Subject Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Your Data Subject Rights
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Understand your rights regarding personal data under GDPR, CCPA, and other privacy laws
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm">GDPR Rights (EU Residents):</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate information</li>
                  <li><strong>Erasure:</strong> Request deletion of your data</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Portability:</strong> Transfer your data to another service</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">CCPA Rights (California Residents):</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li><strong>Know:</strong> What personal info we collect and how it's used</li>
                  <li><strong>Delete:</strong> Request deletion of personal information</li>
                  <li><strong>Opt-out:</strong> Opt out of the sale of personal info</li>
                  <li><strong>Non-discrimination:</strong> Equal service regardless of privacy choices</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium mb-1">How to Exercise Your Rights:</p>
              <p className="text-xs text-muted-foreground">
                Email us at <strong>dpo@currencytocurrency.app</strong> with your request.
                We'll verify your identity and respond within the legally required timeframe.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Incident Reporting */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Security Incident Reporting
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Report security vulnerabilities or suspected data breaches
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-red-800 mb-2">🚨 Urgent Security Issues</p>
              <p className="text-xs text-red-700">
                If you've discovered a security vulnerability or suspect a data breach,
                please email us immediately at <strong>security@currencytocurrency.app</strong>
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-1 text-sm">What to Include:</h3>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                  <li>• Detailed description of the issue</li>
                  <li>• Steps to reproduce (if applicable)</li>
                  <li>• Potential impact assessment</li>
                  <li>• Your contact information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Our Response:</h3>
                <p className="text-xs text-muted-foreground">
                  We take security seriously and will investigate all reports promptly.
                  We'll acknowledge receipt within 24 hours and provide updates as our investigation progresses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Documentation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Legal Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/privacy-policy" className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">Privacy Policy</h3>
                    <p className="text-xs text-muted-foreground">
                      How we collect, use, and protect your data
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/terms-of-service" className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">Terms of Service</h3>
                    <p className="text-xs text-muted-foreground">
                      Terms and conditions for using our service
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
        {isDev && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Developer: Send Test Email
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Dev-only helper to test Netlify SendGrid function locally.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Recipient email"
                  value={testTo}
                  onChange={(e) => setTestTo(e.target.value)}
                />
                <Button onClick={sendTest} disabled={sending}>
                  {sending ? 'Sending...' : 'Send test'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Endpoint: /.netlify/functions/send-email
              </p>
            </CardContent>
          </Card>
        )}


        {/* Footer Navigation */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
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

export default Contact;