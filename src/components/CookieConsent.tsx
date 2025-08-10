import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useIsMobile } from '../hooks/use-mobile';

// Extend window type to include gtag and silktideCookieBannerManager
declare global {
  interface Window {
    gtag: (command: string, action: string, parameters?: any) => void;
    dataLayer: any[];
    silktideCookieBannerManager?: {
      updateCookieBannerConfig: (config: any) => void;
    };
    isEEARegion?: boolean;
    consentDebug?: any;
  }
}

// Consent persistence utility
const ConsentManager = {
  STORAGE_KEY: 'consent_preferences',
  EXPIRY_DAYS: 365,

  saveConsent(preferences: Record<string, boolean>) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.EXPIRY_DAYS);
    
    const consentData = {
      preferences,
      timestamp: Date.now(),
      expiry: expiryDate.getTime(),
      region: window.isEEARegion ? 'EEA' : 'Non-EEA'
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consentData));
    
    // Track consent event
    if (window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'consent_saved',
        consent_region: consentData.region,
        consent_timestamp: consentData.timestamp,
        analytics_granted: preferences.analytical,
        advertising_granted: preferences.advertising
      });
    }
  },

  loadConsent() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      if (Date.now() > data.expiry) {
        localStorage.removeItem(this.STORAGE_KEY);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  },

  clearConsent() {
    localStorage.removeItem(this.STORAGE_KEY);
    
    // Track withdrawal event
    if (window.gtag) {
      window.dataLayer.push({
        event: 'consent_withdrawn',
        timestamp: Date.now()
      });
    }
  }
};

// Native cookie consent component as fallback
const NativeCookieConsent = ({ onAccept, onReject, onSettings }: {
  onAccept: () => void;
  onReject: () => void;
  onSettings: () => void;
}) => {
  const isEEA = window?.isEEARegion || false;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg safe-area-inset-bottom">
      <div className="container mx-auto max-w-6xl">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">🍪 Cookie Notice</Badge>
                  {isEEA && <Badge variant="secondary">GDPR Compliant</Badge>}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isEEA 
                    ? "We use cookies to enhance your experience and analyze our traffic. Under EU privacy laws, we need your consent for certain types of cookies."
                    : "We use cookies to enhance your experience and analyze our traffic."
                  }
                  {" "}
                  <a href="/privacy" className="underline text-primary hover:text-primary/80 touch-target-44" target="_blank">
                    Read our Cookie Policy
                  </a>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" onClick={onSettings} className="touch-target-44 text-xs sm:text-sm">
                  Manage Preferences
                </Button>
                <Button variant="outline" size="sm" onClick={onReject} className="touch-target-44 text-xs sm:text-sm">
                  {isEEA ? "Reject Non-Essential" : "Reject All"}
                </Button>
                <Button size="sm" onClick={onAccept} className="touch-target-44 text-xs sm:text-sm">
                  Accept All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Settings modal for cookie preferences
const CookieSettings = ({ isOpen, onClose, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: { analytical: boolean; advertising: boolean }) => void;
}) => {
  const [analytical, setAnalytical] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const isEEA = window?.isEEARegion || false;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 safe-area-inset">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Cookie Preferences</CardTitle>
          <CardDescription>
            {isEEA 
              ? "Under EU privacy laws, you have the right to control how your data is processed."
              : "Choose which cookies you'd like to allow."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Necessary Cookies</p>
                <p className="text-sm text-muted-foreground">Required for the website to function</p>
              </div>
              <Badge>Always Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Analytics Cookies</p>
                <p className="text-sm text-muted-foreground">Help us improve the website</p>
              </div>
              <Button
                variant={analytical ? "default" : "outline"}
                size="sm"
                onClick={() => setAnalytical(!analytical)}
              >
                {analytical ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Advertising Cookies</p>
                <p className="text-sm text-muted-foreground">Used for personalized ads</p>
              </div>
              <Button
                variant={advertising ? "default" : "outline"}
                size="sm"
                onClick={() => setAdvertising(!advertising)}
              >
                {advertising ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => onSave({ analytical, advertising })} className="flex-1">
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [silktideLoaded, setSilktideLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if consent is already given
    const savedConsent = ConsentManager.loadConsent();
    if (savedConsent) {
      // Apply saved consent
      const { analytical, advertising } = savedConsent.preferences;
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: analytical ? 'granted' : 'denied',
          ad_storage: advertising ? 'granted' : 'denied',
          ad_user_data: advertising ? 'granted' : 'denied',
          ad_personalization: advertising ? 'granted' : 'denied',
        });
      }
      return;
    }

    // Try to initialize Silktide with timeout
    const initializeSilktide = () => {
      if (typeof window === 'undefined') return false;
      
      if (!window.silktideCookieBannerManager) {
        return false;
      }

      setSilktideLoaded(true);

      const isEEA = window.isEEARegion || false;
      
      // Enhanced descriptions for legal compliance
      const analyticalDescription = isEEA 
        ? "<p>These cookies collect information about how you use our website, such as which pages you visit most often. This data helps us improve our website and your user experience. We use Google Analytics for this purpose. <strong>We need your explicit consent to use these cookies.</strong></p>"
        : "<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>";
        
      const advertisingDescription = isEEA
        ? "<p>These cookies enable us and our advertising partners to show you relevant advertisements both on our site and on other websites you visit. They also help measure the effectiveness of advertising campaigns. <strong>Under GDPR, we require your explicit consent for advertising cookies.</strong></p>"
        : "<p>These cookies provide extra features and personalization to improve your experience. They may be set by us or by partners whose services we use.</p>";

      const bannerDescription = isEEA
        ? "<p>We use cookies to enhance your experience and analyze our traffic. Under EU privacy laws, we need your consent for certain types of cookies. You can manage your preferences at any time. <a href=\"/privacy\" target=\"_blank\">Read our Cookie Policy</a> for more details.</p>"
        : "<p>We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic. <a href=\"/privacy\" target=\"_blank\">Cookie Policy.</a></p>";

      try {
        window.silktideCookieBannerManager!.updateCookieBannerConfig({
        background: {
          showBackground: true
        },
        cookieIcon: {
          position: "bottomLeft"
        },
        cookieTypes: [
          {
            id: "necessary",
            name: "Necessary",
            description: "<p>These cookies are necessary for the website to function properly and cannot be switched off. They help with things like logging in and setting your privacy preferences.</p>",
            required: true,
            onAccept: function() {
              console.log('Necessary cookies accepted');
              // Necessary cookies don't need consent mode updates as they're always granted
            }
          },
          {
            id: "analytical",
            name: "Analytical",
            description: analyticalDescription,
            required: false,
            onAccept: function() {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('consent', 'update', {
                  analytics_storage: 'granted',
                });
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  'event': 'consent_accepted_analytical',
                  'consent_method': 'banner',
                  'region': isEEA ? 'EEA' : 'Non-EEA'
                });
              }
              ConsentManager.saveConsent({ analytical: true, advertising: false });
            },
            onReject: function() {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('consent', 'update', {
                  analytics_storage: 'denied',
                });
                window.dataLayer.push({
                  'event': 'consent_rejected_analytical',
                  'region': isEEA ? 'EEA' : 'Non-EEA'
                });
              }
              ConsentManager.saveConsent({ analytical: false, advertising: false });
            }
          },
          {
            id: "advertising",
            name: "Advertising",
            description: advertisingDescription,
            required: false,
            onAccept: function() {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('consent', 'update', {
                  ad_storage: 'granted',
                  ad_user_data: 'granted',
                  ad_personalization: 'granted',
                });
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  'event': 'consent_accepted_advertising',
                  'consent_method': 'banner',
                  'region': isEEA ? 'EEA' : 'Non-EEA'
                });
              }
              ConsentManager.saveConsent({ analytical: true, advertising: true });
            },
            onReject: function() {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('consent', 'update', {
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                });
                window.dataLayer.push({
                  'event': 'consent_rejected_advertising',
                  'region': isEEA ? 'EEA' : 'Non-EEA'
                });
              }
              ConsentManager.saveConsent({ analytical: false, advertising: false });
            }
          }
        ],
        text: {
          banner: {
            description: bannerDescription,
            acceptAllButtonText: "Accept all",
            acceptAllButtonAccessibleLabel: "Accept all cookies",
            rejectNonEssentialButtonText: isEEA ? "Reject non-essential" : "Reject non-essential",
            rejectNonEssentialButtonAccessibleLabel: "Reject non-essential cookies",
            preferencesButtonText: "Manage preferences",
            preferencesButtonAccessibleLabel: "Manage cookie preferences"
          },
          preferences: {
            title: isEEA ? "Your Privacy Rights - Cookie Preferences" : "Customize your cookie preferences",
            description: isEEA 
              ? "<p>Under EU privacy laws, you have the right to control how your data is processed. You can withdraw consent at any time. Your preferences will be saved and respected across our website.</p>"
              : "<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>",
            creditLinkText: "Get this banner for free",
            creditLinkAccessibleLabel: "Get this banner for free"
          }
        },
        position: {
          banner: "bottomCenter"
        }
        });
        return true;
      } catch (error) {
        console.warn('Failed to initialize Silktide banner:', error);
        return false;
      }
    };

    // Mobile-optimized retry logic - faster fallback for mobile users
    const maxAttempts = isMobile ? 8 : 15;
    const retryInterval = isMobile ? 150 : 200;
    let attempts = 0;
    
    // Force fallback on mobile if localStorage is restricted
    const isMobileRestricted = isMobile && (() => {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return false;
      } catch {
        return true;
      }
    })();
    
    const checkSilktide = () => {
      // Debug logging for mobile
      if (isMobile) {
        console.log(`[Mobile Cookie Debug] Attempt ${attempts + 1}/${maxAttempts}, Silktide available: ${!!window.silktideCookieBannerManager}`);
      }
      
      // Force fallback for mobile with localStorage restrictions
      if (isMobileRestricted) {
        console.log('[Mobile Cookie Debug] localStorage restricted, using fallback banner');
        setShowBanner(true);
        return;
      }
      
      if (initializeSilktide()) {
        console.log('Silktide cookie banner initialized successfully');
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkSilktide, retryInterval);
      } else {
        console.warn(`Cookie Consent Manager not available after ${maxAttempts} attempts - using fallback banner`);
        // Show native fallback banner
        setShowBanner(true);
        
        // Set conservative default consent when Silktide fails
        if (window.gtag) {
          window.gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
          });
        }
      }
    };

    checkSilktide();

    // Expose consent withdrawal function globally for privacy page
    (window as any).withdrawConsent = () => {
      ConsentManager.clearConsent();
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
      setShowBanner(true);
      setShowSettings(false);
    };
  }, []);

  const handleAcceptAll = () => {
    const preferences = { analytical: true, advertising: true };
    ConsentManager.saveConsent(preferences);
    
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const preferences = { analytical: false, advertising: false };
    ConsentManager.saveConsent(preferences);
    
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = (preferences: { analytical: boolean; advertising: boolean }) => {
    ConsentManager.saveConsent(preferences);
    
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: preferences.analytical ? 'granted' : 'denied',
        ad_storage: preferences.advertising ? 'granted' : 'denied',
        ad_user_data: preferences.advertising ? 'granted' : 'denied',
        ad_personalization: preferences.advertising ? 'granted' : 'denied',
      });
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  // Render native banner if Silktide failed or not loaded
  if (!silktideLoaded && showBanner) {
    return (
      <>
        <NativeCookieConsent
          onAccept={handleAcceptAll}
          onReject={handleRejectAll}
          onSettings={() => setShowSettings(true)}
        />
        <CookieSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleSavePreferences}
        />
      </>
    );
  }

  return null;
};

export default CookieConsent;