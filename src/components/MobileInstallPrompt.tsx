import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Zap, Wifi, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Mobile-optimized PWA installation prompt
 * Provides native app-like installation experience for mobile users
 */
const MobileInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay for better UX
      setTimeout(() => {
        if (isMobile && !isInstalled) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isMobile, isInstalled]);

  // Handle install button click
  const handleInstall = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !isMobile || sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  // iOS installation instructions
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
        <div className="bg-white rounded-t-2xl p-6 w-full max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Install Currency Converter</h3>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">To install this app on your iPhone:</p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <p className="text-sm">Tap the Share button in Safari</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <p className="text-sm">Scroll down and tap "Add to Home Screen"</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <p className="text-sm">Tap "Add" to install the app</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main install prompt
  if (!showPrompt && !isIOS) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Install Currency Converter
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Get the full app experience with offline support and faster loading
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="flex items-center space-x-1">
                <Wifi className="h-3 w-3 text-green-500" />
                <span className="text-xs text-gray-600">Offline</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-gray-600">Fast</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-gray-600">Secure</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>{isIOS ? 'Instructions' : 'Install'}</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .fixed {
            animation: slideUp 0.3s ease-out;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MobileInstallPrompt;
