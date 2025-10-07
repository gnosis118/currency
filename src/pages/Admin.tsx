import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the admin interface
    const adminUrl = '/admin/';
    
    // Check if we're in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // In development, redirect to local admin
      window.location.href = adminUrl;
    } else {
      // In production, show instructions
      alert('Admin interface is only available in development mode. Please run "npm run admin" locally.');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SEOHead
        title="Admin Access - Currency to Currency"
        description="Administrative access for content management. This page is not indexed by search engines."
        robots="noindex, nofollow"
        canonical="https://currencytocurrency.app/admin"
      />

      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-primary mb-2">Redirecting to Admin...</h1>
        <p className="text-muted-foreground">Please wait while we redirect you to the content management system.</p>
      </div>
    </div>
  );
};

export default Admin;
