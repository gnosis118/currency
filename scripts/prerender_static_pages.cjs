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

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function htmlTemplate({ title, description, canonical, body, robots = 'index, follow' , structuredData = null }) {
  const ld = structuredData
    ? `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  ${ld}
</head>
<body>
  <noscript>
    <header>
      <h1>${title}</h1>
      <p>${description}</p>
    </header>
  </noscript>
  <main>
    ${body}
  </main>
</body>
</html>`;
}

function prerenderCurrencyPairs() {
  const TODAY = new Date().toISOString().split('T')[0];
  const pairs = [
    'usd-to-eur','usd-to-gbp','usd-to-jpy','eur-to-gbp','usd-to-cad','usd-to-aud','usd-to-chf',
    'gbp-to-usd','eur-to-usd','jpy-to-usd','aud-to-usd','cad-to-usd','chf-to-usd','nzd-to-usd','sek-to-usd'
  ];
  let count = 0;
  for (const pair of pairs) {
    const [from, to] = pair.split('-to-');
    const FROM = from.toUpperCase();
    const TO = to.toUpperCase();
    const canonical = `https://currencytocurrency.app/convert/${pair}`;
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
    const body = `
      <article>
        <h1>${FROM} to ${TO} Converter</h1>
        <p>Real-time conversion from ${FROM} to ${TO}. This page is prerendered for faster discovery by search engines.</p>
        <p><a href="/convert/${pair}">Open interactive converter</a></p>
      </article>
    `;
    const html = htmlTemplate({ title, description, canonical, body, structuredData });
    const out = path.join('public', 'convert', pair, 'index.html');
    writeFile(out, html);
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
    const html = htmlTemplate({ title, description: safeDesc, canonical, body, structuredData });
    const out = path.join('public', 'blog', slug, 'index.html');
    writeFile(out, html);
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
