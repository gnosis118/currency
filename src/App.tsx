
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";

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
                <Route path="/auth" element={<Auth />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/convert" element={<Convert />} />
                <Route path="/convert/:pair" element={<CurrencyPair />} />
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