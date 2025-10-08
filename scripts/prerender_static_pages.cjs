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
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${canonical}" />${amp}
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
    const body = `
      <article>
        <h1>${FROM} to ${TO} Converter</h1>
        <p>Real-time conversion from ${FROM} to ${TO}. This page is prerendered for faster discovery by search engines.</p>
        <p><a href="/convert/${pair}">Open interactive converter</a></p>
      </article>
    `;
    const html = htmlTemplate({ title, description, canonical, body, structuredData, amphtml });
    const ampBody = `
      <article>
        <h1>${FROM} to ${TO} Converter</h1>
        <p>Real-time conversion from ${FROM} to ${TO}. Fast, lightweight AMP version.</p>
        <p><a href="/convert/${pair}">Open interactive converter</a></p>
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
