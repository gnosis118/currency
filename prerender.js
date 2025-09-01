const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// List of routes to pre-render
const routes = [
  '/',
  '/convert',
  '/charts',
  '/alerts',
  '/travel',
  '/blog',
  '/faq',
  '/privacy-policy',
  '/terms-of-service'
];

// Function to pre-render a route
async function prerenderRoute(route) {
  try {
    console.log(`Pre-rendering: ${route}`);
    
    // Create the HTML content for each route
    let htmlContent = '';
    
    if (route === '/') {
      htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Free Currency Converter - Live Exchange Rates | Currency to Currency</title>
    <meta name="description" content="Convert 150+ currencies instantly with live rates. Free real-time forex calculator with crypto support, charts & alerts. No registration required.">
    <meta name="keywords" content="currency converter, exchange rates, live rates, cryptocurrency prices, currency conversion, foreign exchange, forex, bitcoin converter, real-time rates, USD to EUR, GBP to USD, currency calculator, money converter">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="https://currencytocurrency.app/">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Free Currency Converter - Live Exchange Rates | Currency to Currency">
    <meta property="og:description" content="Convert 150+ currencies instantly with live rates. Free real-time forex calculator with crypto support, charts & alerts. No registration required.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://currencytocurrency.app/">
    <meta property="og:site_name" content="Currency to Currency">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Free Currency Converter - Live Exchange Rates | Currency to Currency">
    <meta name="twitter:description" content="Convert 150+ currencies instantly with live rates. Free real-time forex calculator with crypto support, charts & alerts. No registration required.">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Currency to Currency",
      "description": "Free real-time currency converter with live exchange rates for 150+ currencies and cryptocurrencies",
      "url": "https://currencytocurrency.app/",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "Currency to Currency"
      }
    }
    </script>
</head>
<body>
    <div id="root">
        <header>
            <h1>Currency Converter</h1>
            <p>Get real-time exchange rates and convert currencies instantly</p>
        </header>
        <main>
            <section>
                <h2>Convert 150+ Currencies</h2>
                <p>Get instant currency conversions, track historical exchange rates, set price alerts, and access travel money tips. Our free currency converter provides accurate real-time data for over 150 fiat currencies and 100+ cryptocurrencies.</p>
                <ul>
                    <li>Real-time rates</li>
                    <li>150+ currencies</li>
                    <li>Historical charts</li>
                    <li>Price alerts</li>
                    <li>Travel guides</li>
                </ul>
            </section>
            <section>
                <h2>Popular Currency Conversions</h2>
                <div>
                    <a href="/convert/usd-to-eur">USD to EUR</a>
                    <a href="/convert/gbp-to-usd">GBP to USD</a>
                    <a href="/convert/eur-to-gbp">EUR to GBP</a>
                    <a href="/convert/usd-to-cad">USD to CAD</a>
                </div>
            </section>
        </main>
    </div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
    } else if (route === '/convert') {
      htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currency Converter - Real-time Exchange Rates | Currency to Currency</title>
    <meta name="description" content="Convert currencies instantly with live exchange rates. Support for 150+ fiat currencies and 100+ cryptocurrencies. Free real-time currency converter.">
    <link rel="canonical" href="https://currencytocurrency.app/convert">
</head>
<body>
    <div id="root">
        <h1>Currency Converter</h1>
        <p>Convert currencies with real-time exchange rates</p>
    </div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
    } else if (route === '/blog') {
      htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currency Exchange Blog - Expert Forex Insights | Currency to Currency</title>
    <meta name="description" content="Expert forex insights, currency exchange analysis & conversion strategies. Latest market trends, rate forecasts & money-saving tips for travelers.">
    <link rel="canonical" href="https://currencytocurrency.app/blog">
</head>
<body>
    <div id="root">
        <h1>Currency Exchange Blog</h1>
        <p>Expert insights on currency exchange and forex trends</p>
    </div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
    }
    
    // Write the HTML file
    const outputPath = path.join(__dirname, 'dist', route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`✓ Pre-rendered: ${outputPath}`);
    
  } catch (error) {
    console.error(`Error pre-rendering ${route}:`, error);
  }
}

// Main pre-rendering function
async function prerender() {
  console.log('Starting pre-rendering...');
  
  for (const route of routes) {
    await prerenderRoute(route);
  }
  
  console.log('Pre-rendering complete!');
}

// Run pre-rendering
prerender();
