#!/usr/bin/env node
/*
 * Prerender minimal static HTML pages for key dynamic routes to improve indexing.
 * - Generates public/convert/{pair}/index.html for popular currency pairs
 * - Generates public/blog/{slug}/index.html for blog posts found in src/data/blogPosts.ts
 *
 * This is not full SSR. It produces lightweight, crawlable HTML with canonical,
 * robots, JSON-LD, and visible content so Google can index reliably.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_BASE = process.env.PRERENDER_OUT_DIR || (fs.existsSync('dist') ? 'dist' : 'public');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function htmlTemplate({ title, description, canonical, body, robots = 'index, follow', structuredData = null, amphtml = null }) {
  const ld = structuredData
    ? `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`
    : '';
  const amp = amphtml ? `\n  <link rel="amphtml" href="${amphtml}" />` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${canonical}" />${amp}

  <!-- Performance optimizations -->
  <link rel="preconnect" href="https://api.polygon.io" crossorigin />
  <link rel="dns-prefetch" href="//api.polygon.io" />
  <link rel="dns-prefetch" href="//fonts.googleapis.com" />
  <link rel="dns-prefetch" href="//www.googletagmanager.com" />

  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="Currency to Currency" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content="https://currencytocurrency.app/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:url" content="${canonical}" />
  <meta name="twitter:image" content="https://currencytocurrency.app/og-image.jpg" />

  <!-- Mobile optimization -->
  <meta name="theme-color" content="#3b82f6" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="format-detection" content="telephone=no" />

  ${ld}

  <!-- Deferred CSS loading for better FCP -->
  <link rel="preload" href="/assets/index.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="/assets/index.css" /></noscript>
</head>
<body>
  <noscript>
    <header>
      <h1>${title}</h1>
      <p>${description}</p>
    </header>
  </noscript>
  <div id="root">
    <main>
      ${body}
    </main>
  </div>
  <!-- Deferred JavaScript loading for better TTI -->
  <script type="module" src="/src/main.tsx" defer></script>
</body>
</html>`;
}

function ampHtmlTemplate({ title, description, canonical, body }) {
  return `<!doctype html>
<html ⚡ lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="canonical" href="${canonical}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <meta name="description" content="${description}" />
</head>
<body>
  <main>
    ${body}
  </main>
</body>
</html>`;
}

function prerenderCurrencyPairs() {
  const TODAY = new Date().toISOString().split('T')[0];
  const majors = ['usd','eur','gbp','jpy','aud','cad','chf','nzd','cny','inr','hkd','sgd','sek','nok','mxn','zar'];
  const pairs = [];
  for (const a of majors) for (const b of majors) { if (a !== b) pairs.push(`${a}-to-${b}`); }
  let count = 0;
  for (const pair of pairs) {
    const [from, to] = pair.split('-to-');
    const FROM = from.toUpperCase();
    const TO = to.toUpperCase();
    const canonical = `https://currencytocurrency.app/convert/${pair}`;
    const amphtml = `${canonical}/amp`;
    const title = `${FROM} to ${TO} Converter - Live Exchange Rate | Currency to Currency`;
    const description = `Convert ${FROM} to ${TO} with real-time exchange rates. Free ${FROM}-${TO} currency converter updated frequently.`;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonical,
      mainEntity: {
        '@type': 'FinancialProduct',
        name: `${FROM} to ${TO} Currency Converter`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      dateModified: TODAY
    };
    // Generate related currency pairs for internal linking
    const relatedPairs = [];
    const otherMajors = majors.filter(c => c !== from && c !== to).slice(0, 6);
    for (const other of otherMajors) {
      relatedPairs.push(`${from}-to-${other}`);
      relatedPairs.push(`${to}-to-${other}`);
    }
    const uniqueRelated = [...new Set(relatedPairs)].slice(0, 8);

    const relatedLinks = uniqueRelated.map(p => {
      const [f, t] = p.split('-to-');
      return `<a href="/convert/${p}">${f.toUpperCase()} to ${t.toUpperCase()}</a>`;
    }).join(' | ');

    const body = `
      <article>
        <h1>${FROM} to ${TO} Currency Converter</h1>
        <p>Convert ${FROM} (${from.toUpperCase()}) to ${TO} (${to.toUpperCase()}) with real-time exchange rates. Our free currency converter provides accurate, up-to-date conversion rates for ${FROM} to ${TO} and supports over 150 global currencies.</p>

        <h2>How to Convert ${FROM} to ${TO}</h2>
        <p>Use our interactive ${FROM} to ${TO} converter to get instant exchange rates. Simply enter the amount you want to convert, and our calculator will show you the current ${FROM} to ${TO} exchange rate along with historical charts and trends.</p>

        <h2>Current ${FROM} to ${TO} Exchange Rate</h2>
        <p>The ${FROM} to ${TO} exchange rate updates in real-time. Our converter uses live market data to ensure you get the most accurate ${FROM} to ${TO} conversion rates available. Track ${FROM} to ${TO} trends with our historical charts and set price alerts to monitor rate changes.</p>

        <h2>Related Currency Conversions</h2>
        <p>${relatedLinks}</p>

        <p><strong><a href="/convert/${pair}">Open Interactive ${FROM} to ${TO} Converter →</a></strong></p>

        <p>Looking for more currency tools? Visit our <a href="/charts">currency charts</a>, set up <a href="/alerts">price alerts</a>, or explore our <a href="/blog">currency exchange guides</a>.</p>
      </article>
    `;
    const html = htmlTemplate({ title, description, canonical, body, structuredData, amphtml });
    const ampBody = `
      <article>
        <h1>${FROM} to ${TO} Converter</h1>
        <p>Convert ${FROM} to ${TO} with real-time exchange rates. Free ${FROM}-${TO} currency converter with live market data.</p>
        <h2>Related Conversions</h2>
        <p>${relatedLinks}</p>
        <p><a href="/convert/${pair}">Open Interactive Converter</a></p>
      </article>
    `;
    const ampHtml = ampHtmlTemplate({ title, description, canonical, body: ampBody });
    const out = path.join(OUTPUT_BASE, 'convert', pair, 'index.html');
    const outAmp = path.join(OUTPUT_BASE, 'convert', pair, 'amp', 'index.html');
    writeFile(out, html);
    writeFile(outAmp, ampHtml);
    count++;
  }
  return count;
}

function parseBlogPosts() {
  const srcPath = path.join('src', 'data', 'blogPosts.ts');
  if (!fs.existsSync(srcPath)) return [];
  const content = fs.readFileSync(srcPath, 'utf8');
  const matches = content.match(/\{\s*title:\s*['"][^'\"]+['\"][\s\S]*?slug:\s*['"][^'\"]+['\"][\s\S]*?publishDate:\s*['"][^'\"]+['\"][\s\S]*?\}/g) || [];
  const posts = [];
  for (const m of matches) {
    const title = (m.match(/title:\s*['"]([^'\"]+)['"]/ )||[])[1];
    const slug  = (m.match(/slug:\s*['"]([^'\"]+)['"]/ )||[])[1];
    const meta  = (m.match(/metaDescription:\s*['"]([^'\"]+)['"]/ )||[])[1]
               || (m.match(/excerpt:\s*['"]([^'\"]+)['"]/ )||[])[1]
               || '';
    if (title && slug) posts.push({ title, slug, description: meta });
  }
  return posts;
}

function prerenderBlogPosts() {
  const posts = parseBlogPosts();
  let count = 0;
  for (const { title, slug, description } of posts) {
    const canonical = `https://currencytocurrency.app/blog/${slug}`;
    const amphtml = `${canonical}/amp`;
    const safeDesc = description || `${title} — Article on currency exchange, forex and conversion strategies.`;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      url: canonical
    };
    const body = `
      <article>
        <h1>${title}</h1>
        <p>${safeDesc}</p>
        <p><a href="/blog/${slug}">Read the full article</a></p>
      </article>
    `;
    const html = htmlTemplate({ title, description: safeDesc, canonical, body, structuredData, amphtml });
    const ampBody = `
      <article>
        <h1>${title}</h1>
        <p>${safeDesc}</p>
        <p><a href="/blog/${slug}">Open interactive article</a></p>
      </article>
    `;
    const ampHtml = ampHtmlTemplate({ title, description: safeDesc, canonical, body: ampBody });
    const out = path.join('public', 'blog', slug, 'index.html');
    const outAmp = path.join('public', 'blog', slug, 'amp', 'index.html');
    writeFile(out, html);
    writeFile(outAmp, ampHtml);
    count++;
  }
  return count;
}

function main() {
  const pairCount = prerenderCurrencyPairs();
  const blogCount = prerenderBlogPosts();
  console.log(`✅ Prerender complete: ${pairCount} currency pair pages, ${blogCount} blog pages.`);
}

if (require.main === module) {
  try { main(); } catch (e) {
    console.error('❌ Prerender failed:', e.message);
    process.exit(1);
  }
}
