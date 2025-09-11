import React, { useState } from 'react';
import { X, Shield, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * Privacy Policy Announcement Banner
 * Ensures maximum visibility of privacy policy for compliance
 */
const PrivacyPolicyBanner = () => {
  const [dismissed, setDismissed] = useState(() => {
    // Check if user has already seen and dismissed this banner
    return localStorage.getItem('privacy-banner-dismissed') === 'true';
  });

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('privacy-banner-dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <Alert className="border-blue-200 bg-blue-50 mb-6">
      <Shield className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-blue-800 font-medium">🛡️ Your Privacy Matters</span>
          <span className="text-blue-700">
            We're committed to protecting your data. Read our 
            <a 
              href="/privacy-policy" 
              className="underline font-semibold hover:text-blue-900 ml-1"
              aria-label="Read our comprehensive privacy policy"
            >
              Privacy Policy
            </a>
            {" "}
            to understand how we handle your information.
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <a href="/privacy-policy">
            <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:bg-blue-100">
              <Eye className="h-3 w-3 mr-1" />
              View Policy
            </Button>
          </a>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-800 h-6 w-6 p-0"
            aria-label="Dismiss privacy notice"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PrivacyPolicyBanner;