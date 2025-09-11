
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import RedirectRoute from "@/components/RedirectRoute";
import MobileEnhancement from "@/components/MobileEnhancement";
import MobilePerformance from "@/components/MobilePerformance";
import CoreWebVitalsMonitor from "@/components/CoreWebVitalsMonitor";
import AccessibilityEnhancements from "@/components/AccessibilityEnhancements";
import CookieConsent from "@/components/CookieConsent";
import AccessibilityNavigationLink from "@/components/AccessibilityNavigationLink";
import PrivacyComplianceChecker from "@/components/PrivacyComplianceChecker";


// Lazy load all route components for better code splitting
const Index = React.lazy(() => import("./pages/Index"));
const Charts = React.lazy(() => import("./pages/Charts"));
const Alerts = React.lazy(() => import("./pages/Alerts"));
const Travel = React.lazy(() => import("./pages/Travel"));
const Auth = React.lazy(() => import("./pages/Auth"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const CurrencyPair = React.lazy(() => import("./pages/CurrencyPair"));
const Convert = React.lazy(() => import("./pages/Convert"));
const Brokers = React.lazy(() => import("./pages/Brokers"));
const About = React.lazy(() => import("./pages/About"));
const Help = React.lazy(() => import("./pages/Help"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Admin = React.lazy(() => import("./pages/Admin"));


// Loading component for route transitions
const RouteLoader = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary fallback={<div>Application failed to load</div>}>
      {/* Global Google Consent Mode & Cookiebot Scripts */}
      <Helmet>
        {/* Google Consent Mode (must precede gtag.js/GTM) */}
        <script data-cookieconsent="ignore">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("consent", "default", {
              ad_personalization: "denied",
              ad_storage: "denied",
              ad_user_data: "denied",
              analytics_storage: "denied",
              functionality_storage: "denied",
              personalization_storage: "denied",
              security_storage: "granted",
              wait_for_update: 500,
            });
            gtag("set", "ads_data_redaction", true);
            gtag("set", "url_passthrough", false);
          `}
        </script>

        {/* Cookiebot Script */}
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="a316e185-0703-4964-b697-d0301f10cdb9"
          data-blockingmode="auto"
          type="text/javascript"
        />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4QQQGLR7SC"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4QQQGLR7SC', {
              page_title: document.title,
              page_location: window.location.href
            });
          `}
        </script>
      </Helmet>

      <MobileEnhancement />
      <MobilePerformance />
      <CoreWebVitalsMonitor />
      <AccessibilityEnhancements />
      <BrowserRouter>
        {/* Skip to main content link for accessibility */}
        <AccessibilityNavigationLink />
        <div className="min-h-screen">
          <Header />
          <ErrorBoundary>
            <React.Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/charts" element={<Charts />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/travel" element={<Travel />} />
                <Route path="/brokers" element={<Brokers />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/convert" element={<Convert />} />
                <Route path="/convert/:pair" element={<CurrencyPair />} />

                {/* Dedicated routes for major currency pairs (redirect short to canonical) */}
                <Route path="/usd-eur" element={<RedirectRoute />} />
                <Route path="/usd-gbp" element={<RedirectRoute />} />
                <Route path="/usd-jpy" element={<RedirectRoute />} />
                <Route path="/usd-cad" element={<RedirectRoute />} />
                <Route path="/usd-aud" element={<RedirectRoute />} />
                <Route path="/usd-chf" element={<RedirectRoute />} />
                <Route path="/gbp-usd" element={<RedirectRoute />} />
                <Route path="/eur-usd" element={<RedirectRoute />} />
                <Route path="/eur-gbp" element={<RedirectRoute />} />
                <Route path="/eur-jpy" element={<RedirectRoute />} />
                <Route path="/jpy-usd" element={<RedirectRoute />} />
                <Route path="/aud-usd" element={<RedirectRoute />} />
                <Route path="/cad-usd" element={<RedirectRoute />} />
                <Route path="/chf-usd" element={<RedirectRoute />} />
                <Route path="/gbp-eur" element={<RedirectRoute />} />
                <Route path="/gbp-jpy" element={<RedirectRoute />} />
                <Route path="/aud-eur" element={<RedirectRoute />} />
                <Route path="/cad-eur" element={<RedirectRoute />} />
                <Route path="/chf-eur" element={<RedirectRoute />} />
                <Route path="/jpy-eur" element={<RedirectRoute />} />
                <Route path="/nzd-usd" element={<RedirectRoute />} />
                <Route path="/sek-usd" element={<RedirectRoute />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />

                {/* Redirect routes for old currency pair URLs */}
                <Route path="/usd-to-eur" element={<RedirectRoute />} />
                <Route path="/usd-to-gbp" element={<RedirectRoute />} />
                <Route path="/usd-to-jpy" element={<RedirectRoute />} />
                <Route path="/usd-to-cad" element={<RedirectRoute />} />
                <Route path="/usd-to-aud" element={<RedirectRoute />} />
                <Route path="/usd-to-chf" element={<RedirectRoute />} />
                <Route path="/gbp-to-usd" element={<RedirectRoute />} />
                <Route path="/eur-to-usd" element={<RedirectRoute />} />
                <Route path="/eur-to-gbp" element={<RedirectRoute />} />
                <Route path="/eur-to-jpy" element={<RedirectRoute />} />
                <Route path="/jpy-to-usd" element={<RedirectRoute />} />
                <Route path="/aud-to-usd" element={<RedirectRoute />} />
                <Route path="/cad-to-usd" element={<RedirectRoute />} />
                <Route path="/chf-to-usd" element={<RedirectRoute />} />
                <Route path="/nzd-to-usd" element={<RedirectRoute />} />
                <Route path="/sek-to-usd" element={<RedirectRoute />} />

                <Route path="/sitemap.xml" element={null} />
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Site-wide footer (legal links) - Enhanced for Privacy Compliance */}
              <footer className="border-t mt-8 py-8 bg-muted/30" role="contentinfo">
                <div className="container mx-auto px-4">
                  {/* Main footer content */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Company Info */}
                    <div>
                      <h3 className="font-semibold text-sm mb-3">Currency to Currency</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Real-time currency conversion and financial data platform
                      </p>
                      <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Currency to Currency. All rights reserved.
                      </p>
                    </div>

                    {/* Privacy & Legal - Prominent Section */}
                    <div>
                      <h3 className="font-semibold text-sm mb-3 text-primary">Privacy & Legal</h3>
                      <nav className="space-y-2" aria-label="Privacy and legal information">
                        <a 
                          href="/privacy-policy" 
                          className="block text-sm hover:text-primary hover:underline transition-colors"
                          aria-label="Read our privacy policy"
                        >
                          📄 Privacy Policy
                        </a>
                        <a 
                          href="/terms-of-service" 
                          className="block text-sm hover:text-primary hover:underline transition-colors"
                          aria-label="Read our terms of service"
                        >
                          📋 Terms of Service
                        </a>
                        <button
                          type="button"
                          onClick={() => (window as any).openCookieSettings?.() || (window as any).withdrawConsent?.()}
                          className="block text-sm hover:text-primary hover:underline transition-colors text-left"
                          aria-label="Manage your cookie preferences"
                        >
                          🍪 Cookie Settings
                        </button>
                        <a 
                          href="/contact" 
                          className="block text-sm hover:text-primary hover:underline transition-colors"
                          aria-label="Contact us for support or privacy inquiries"
                        >
                          📧 Contact & Data Protection
                        </a>
                      </nav>
                    </div>

                    {/* Data Protection Rights */}
                    <div>
                      <h3 className="font-semibold text-sm mb-3">Your Data Rights</h3>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          🛡️ GDPR & CCPA Compliant
                        </p>
                        <p className="text-xs text-muted-foreground">
                          📧 DPO: dpo@currencytocurrency.app
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ⏱️ Response within 72 hours
                        </p>
                        <button
                          type="button"
                          onClick={() => (window as any).withdrawConsent?.()}
                          className="text-xs text-primary hover:underline"
                          aria-label="Withdraw your consent for data processing"
                        >
                          Withdraw Consent
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom bar with essential links */}
                  <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      Built with privacy by design • Secure & compliant
                    </div>
                    <nav className="flex flex-wrap gap-4 text-xs" aria-label="Quick legal links">
                      <a href="/privacy-policy" className="hover:text-primary underline">Privacy</a>
                      <a href="/terms-of-service" className="hover:text-primary underline">Terms</a>
                      <a href="/contact" className="hover:text-primary underline">Contact</a>
                    </nav>
                  </div>
                </div>
              </footer>

              {/* Global Cookie Consent Banner */}
              <CookieConsent />
              
              {/* Privacy Compliance Checker (Development Only) */}
              <PrivacyComplianceChecker />

            </React.Suspense>
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;