import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from '@/components/AuthGuard';
import EnhancedSEOHead from '@/components/EnhancedSEOHead';

const Auth = () => {
  const navigate = useNavigate();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Authentication - Currency to Currency",
    "description": "Secure login and registration for Currency to Currency converter app",
    "url": "https://currencytocurrency.app/auth"
  };

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === 'SIGNED_IN') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-converter-bg">
      <EnhancedSEOHead
        title="Authentication - Currency to Currency | Secure Login"
        description="Secure authentication for Currency to Currency converter. Access personalized features and rate alerts."
        canonicalUrl="https://currencytocurrency.app/auth"
        keywords="login, authentication, currency converter account, secure access"
        structuredData={structuredData}
        pageType="website"
      />
      <AuthGuard>
        {() => <div></div>}
      </AuthGuard>
    </div>
  );
};

export default Auth;