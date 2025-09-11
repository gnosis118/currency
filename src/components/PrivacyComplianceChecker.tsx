import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shield, Info } from 'lucide-react';

/**
 * Privacy Compliance Verification Component
 * Checks and displays the status of various privacy compliance requirements
 */

interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  details?: string;
  impact?: string;
}

const PrivacyComplianceChecker = () => {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const runComplianceChecks = () => {
      const results: ComplianceCheck[] = [];

      // Check 1: Privacy Policy Accessibility
      const privacyLinks = document.querySelectorAll('a[href*="privacy"], a[href*="Privacy"]');
      const footerPrivacyLinks = document.querySelectorAll('footer a[href*="privacy"]');
      const headerPrivacyLinks = document.querySelectorAll('header a[href*="privacy"]');
      
      results.push({
        id: 'privacy-policy-accessibility',
        name: 'Privacy Policy Accessibility',
        description: 'Privacy policy links are prominently displayed in header and footer',
        status: (footerPrivacyLinks.length > 0 && headerPrivacyLinks.length > 0) ? 'pass' : 
                (privacyLinks.length > 0) ? 'warning' : 'fail',
        details: `Found ${privacyLinks.length} privacy policy links (${footerPrivacyLinks.length} in footer, ${headerPrivacyLinks.length} in header)`,
        impact: 'Critical for GDPR compliance and user trust'
      });

      // Check 2: Cookie Consent Banner
      const cookieConsent = document.querySelector('[data-cookieconsent], #CookieDeclaration, [class*="cookie"]');
      const cookieButtons = document.querySelectorAll('button[onclick*="cookie"], button[onclick*="consent"]');
      
      results.push({
        id: 'cookie-compliance',
        name: 'Cookie Consent Mechanism',
        description: 'Cookie consent banner and management options are present',
        status: (cookieConsent || cookieButtons.length > 0) ? 'pass' : 'fail',
        details: cookieConsent ? 'Cookie consent system detected' : 'No cookie consent mechanism found',
        impact: 'Required for GDPR and ePrivacy compliance'
      });

      // Check 3: Data Protection Contact Information
      const dpoEmails = document.querySelectorAll('a[href*="dpo@"], a[href*="privacy@"]');
      const contactPages = document.querySelectorAll('a[href*="contact"]');
      
      results.push({
        id: 'data-protection-contacts',
        name: 'Data Protection Contact Information',
        description: 'DPO and privacy contact information is easily accessible',
        status: dpoEmails.length > 0 ? 'pass' : (contactPages.length > 0 ? 'warning' : 'fail'),
        details: `Found ${dpoEmails.length} data protection contacts and ${contactPages.length} contact pages`,
        impact: 'Required for GDPR Article 37 compliance'
      });

      // Check 4: Terms of Service Accessibility
      const termsLinks = document.querySelectorAll('a[href*="terms"], a[href*="Terms"]');
      
      results.push({
        id: 'terms-accessibility',
        name: 'Terms of Service Accessibility',
        description: 'Terms of service are easily accessible',
        status: termsLinks.length > 0 ? 'pass' : 'fail',
        details: `Found ${termsLinks.length} terms of service links`,
        impact: 'Important for legal protection and user clarity'
      });

      // Check 5: ARIA Labels and Accessibility
      const elementsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      const totalUnlabeled = elementsWithoutLabels.length + inputsWithoutLabels.length;
      
      results.push({
        id: 'accessibility-compliance',
        name: 'WCAG 2.1 AA Accessibility',
        description: 'Interactive elements have proper accessibility labels',
        status: totalUnlabeled === 0 ? 'pass' : (totalUnlabeled < 5 ? 'warning' : 'fail'),
        details: `${totalUnlabeled} elements without proper accessibility labels`,
        impact: 'Required for WCAG 2.1 AA compliance and inclusive design'
      });

      // Check 6: Security Headers and HTTPS
      const isHTTPS = window.location.protocol === 'https:';
      
      results.push({
        id: 'security-practices',
        name: 'Security Implementation',
        description: 'Website uses HTTPS and follows security best practices',
        status: isHTTPS ? 'pass' : 'fail',
        details: isHTTPS ? 'Site is served over HTTPS' : 'Site is not using HTTPS',
        impact: 'Critical for data protection and user trust'
      });

      // Check 7: Data Subject Rights Information
      const rightsInfo = document.querySelectorAll('[class*="rights"], [aria-label*="rights"], [title*="rights"]');
      const gdprReferences = document.querySelectorAll('[class*="gdpr"], [aria-label*="GDPR"], [title*="GDPR"]');
      
      results.push({
        id: 'data-subject-rights',
        name: 'Data Subject Rights Information',
        description: 'Information about user data rights is clearly displayed',
        status: (rightsInfo.length > 0 || gdprReferences.length > 0) ? 'pass' : 'warning',
        details: `Found ${rightsInfo.length + gdprReferences.length} references to data rights`,
        impact: 'Required for GDPR transparency'
      });

      // Check 8: Consent Withdrawal Options
      const withdrawalButtons = document.querySelectorAll('button[onclick*="withdraw"], button[aria-label*="withdraw"]');
      
      results.push({
        id: 'consent-withdrawal',
        name: 'Consent Withdrawal Mechanism',
        description: 'Users can easily withdraw their consent',
        status: withdrawalButtons.length > 0 ? 'pass' : 'warning',
        details: `Found ${withdrawalButtons.length} consent withdrawal options`,
        impact: 'Required for GDPR Article 7(3)'
      });

      setChecks(results);

      // Calculate overall score
      const passCount = results.filter(r => r.status === 'pass').length;
      const totalCount = results.length;
      const score = Math.round((passCount / totalCount) * 100);
      setOverallScore(score);
    };

    // Run checks after component mounts and DOM is ready
    setTimeout(runComplianceChecks, 1000);

    // Re-run checks when DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(runComplianceChecks, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const getStatusIcon = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'fail':
        return <Badge variant="destructive">Needs Fix</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>;
      case 'info':
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4" />
            Privacy Compliance Check
          </CardTitle>
          <CardDescription className="text-xs">
            Development mode compliance verification
          </CardDescription>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score:</span>
            <span className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start gap-3 p-2 rounded border">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(check.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium truncate">{check.name}</h4>
                  {getStatusBadge(check.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {check.description}
                </p>
                {check.details && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {check.details}
                  </p>
                )}
                {check.impact && (
                  <p className="text-xs text-blue-600">
                    Impact: {check.impact}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyComplianceChecker;