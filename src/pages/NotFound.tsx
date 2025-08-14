import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>Page Not Found (404) - Currency to Currency</title>
        <meta name="description" content="The page you're looking for doesn't exist. Find currency conversion tools and popular exchange rates on our homepage." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6 text-foreground">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="space-y-4">
          <a 
            href="/" 
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
          >
            Return to Home
          </a>
          <div className="text-sm text-muted-foreground">
            <p>Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <a href="/charts" className="text-primary hover:underline">Currency Charts</a>
              <a href="/alerts" className="text-primary hover:underline">Rate Alerts</a>
              <a href="/travel" className="text-primary hover:underline">Travel Money</a>
              <a href="/faq" className="text-primary hover:underline">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
