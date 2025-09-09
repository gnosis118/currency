import { Navigate, useLocation } from 'react-router-dom';

const RedirectRoute = () => {
  const location = useLocation();
  
  // Handle legacy '/usd-to-eur' -> '/convert/usd-to-eur'
  const toFormat = /^\/([a-z]{3}-to-[a-z]{3})$/i;
  const m1 = location.pathname.match(toFormat);
  if (m1) {
    const pair = m1[1].toLowerCase();
    return <Navigate to={`/convert/${pair}`} replace />;
  }

  // Handle short '/usd-eur' -> '/convert/usd-to-eur'
  const shortFormat = /^\/([a-z]{3})-([a-z]{3})$/i;
  const m2 = location.pathname.match(shortFormat);
  if (m2) {
    const from = m2[1].toLowerCase();
    const to = m2[2].toLowerCase();
    return <Navigate to={`/convert/${from}-to-${to}`} replace />;
  }

  // If no specific redirect rule, go to home
  return <Navigate to="/" replace />;
};

export default RedirectRoute;

