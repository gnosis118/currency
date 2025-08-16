import { Navigate, useLocation } from 'react-router-dom';

const RedirectRoute = () => {
  const location = useLocation();
  
  // Handle currency pair redirects (e.g., /usd-to-eur -> /convert/usd-to-eur)
  const currencyPairPattern = /^\/([a-z]{3}-to-[a-z]{3})$/i;
  const match = location.pathname.match(currencyPairPattern);
  
  if (match) {
    const pair = match[1].toLowerCase();
    return <Navigate to={`/convert/${pair}`} replace />;
  }
  
  // If no specific redirect rule, go to home
  return <Navigate to="/" replace />;
};

export default RedirectRoute;

