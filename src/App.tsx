
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import RedirectRoute from "@/components/RedirectRoute";
import MobileEnhancement from "@/components/MobileEnhancement";
import MobilePerformance from "@/components/MobilePerformance";

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
      </Helmet>
      
      <MobileEnhancement />
      <MobilePerformance />
      <BrowserRouter>
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
                
                {/* Dedicated routes for major currency pairs */}
                <Route path="/usd-eur" element={<CurrencyPair />} />
                <Route path="/usd-gbp" element={<CurrencyPair />} />
                <Route path="/usd-jpy" element={<CurrencyPair />} />
                <Route path="/usd-cad" element={<CurrencyPair />} />
                <Route path="/usd-aud" element={<CurrencyPair />} />
                <Route path="/usd-chf" element={<CurrencyPair />} />
                <Route path="/gbp-usd" element={<CurrencyPair />} />
                <Route path="/eur-usd" element={<CurrencyPair />} />
                <Route path="/eur-gbp" element={<CurrencyPair />} />
                <Route path="/eur-jpy" element={<CurrencyPair />} />
                <Route path="/jpy-usd" element={<CurrencyPair />} />
                <Route path="/aud-usd" element={<CurrencyPair />} />
                <Route path="/cad-usd" element={<CurrencyPair />} />
                <Route path="/chf-usd" element={<CurrencyPair />} />
                <Route path="/gbp-eur" element={<CurrencyPair />} />
                <Route path="/gbp-jpy" element={<CurrencyPair />} />
                <Route path="/aud-eur" element={<CurrencyPair />} />
                <Route path="/cad-eur" element={<CurrencyPair />} />
                <Route path="/chf-eur" element={<CurrencyPair />} />
                <Route path="/jpy-eur" element={<CurrencyPair />} />
                <Route path="/nzd-usd" element={<CurrencyPair />} />
                <Route path="/sek-usd" element={<CurrencyPair />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
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
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;