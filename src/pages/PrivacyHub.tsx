import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Mail, Clock, Globe, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedSEOHead from '@/components/EnhancedSEOHead';

/**
 * Privacy Hub - Central privacy information page
 * Ensures all privacy-related information is easily discoverable
 */
const PrivacyHub = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Hub - Your Data Rights & Protection",
    "description": "Complete privacy information center: privacy policy, data rights, contact information, and compliance details.",
    "url": "https://currencytocurrency.app/privacy",
    "mainEntity": {
      "@type": "Organization",
      "name": "Currency to Currency Privacy Team",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Data Protection Officer",
        "email": "dpo@currencytocurrency.app"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" tabIndex={-1} role="main" aria-label="Privacy information hub">
        <EnhancedSEOHead
          title="Privacy Hub - Your Data Rights | Currency to Currency"
          description="Complete privacy information: policy, data rights, GDPR compliance, and contact details for all privacy-related inquiries."
          canonicalUrl="https://currencytocurrency.app/privacy"
          keywords="privacy policy, data protection, GDPR, CCPA, data rights, privacy compliance"
          structuredData={structuredData}
          pageType="article"
        />

        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-5xl font-bold">Privacy Hub</h1>
            </div>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Your privacy matters to us. Find everything you need to know about how we protect and handle your data.
            </p>
          </div>

          {/* Compliance Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8" aria-label="Compliance badges">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" /> GDPR
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" /> CCPA
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-600" /> Cookie Consent Active
            </Badge>
          </div>


          {/* Quick Access Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Privacy Policy */}
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Privacy Policy
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive policy covering data collection, processing, storage, and your rights under GDPR and CCPA.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>CCPA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <Link to="/privacy-policy">
                  <Button className="w-full">
                    Read Full Privacy Policy
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Data Rights */}
            <Card className="border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Your Data Rights
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Exercise your data protection rights including access, rectification, erasure, and data portability.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Request data access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Data correction & deletion</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Withdraw consent</span>
                  </div>
                </div>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Exercise Your Rights
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Privacy Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Data Protection Officer</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Email:</strong> dpo@currencytocurrency.app
                    </p>
                    <p className="text-sm">
                      <strong>Response Time:</strong> Within 72 hours
                    </p>
                    <p className="text-sm">
                      <strong>Languages:</strong> English
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Privacy Inquiries</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>General Privacy:</strong> privacy@currencytocurrency.app
                    </p>
                    <p className="text-sm">
                      <strong>Security Issues:</strong> security@currencytocurrency.app
                    </p>
                    <p className="text-sm">
                      <strong>Website:</strong> currencytocurrency.app
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Privacy Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/privacy-policy" className="block">
                  <Button variant="outline" className="w-full h-auto p-4">
                    <div className="text-center">
                      <FileText className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-medium">Privacy Policy</div>
                      <div className="text-xs text-muted-foreground">Full policy details</div>
                    </div>
                  </Button>
                </Link>

                <Link to="/terms-of-service" className="block">
                  <Button variant="outline" className="w-full h-auto p-4">
                    <div className="text-center">
                      <FileText className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-medium">Terms of Service</div>
                      <div className="text-xs text-muted-foreground">Legal terms</div>
                    </div>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full h-auto p-4"
                  onClick={() => (window as any).openCookieSettings?.()}
                >
                  <div className="text-center">
                    <Globe className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Cookie Settings</div>
                    <div className="text-xs text-muted-foreground">Manage preferences</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Navigation */}
          <div className="text-center mt-8">
            <Link to="/">
              <Button variant="outline">
                Return to Currency Converter
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyHub;