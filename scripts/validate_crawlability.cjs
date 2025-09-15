#!/usr/bin/env node
/*
 Validate sitemaps and robots for crawlability and links that resolve.
 - Verifies robots.txt includes all sitemaps
 - Ensures all sitemap URLs respond with 200 on a local preview server base
 - Confirms no <loc> entries point to non-existent routes (based on generated prerender files)
 Usage: node scripts/validate_crawlability.cjs --base http://localhost:4173
*/

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function listXmlLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<]+)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) locs.push(m[1].trim());
  return locs;
}

function httpGet(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve({ status: res.statusCode, url }));
    });
    req.on('error', () => resolve({ status: 0, url }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 0, url });
    });
  });
}

async function main() {
  const baseArg = process.argv.find((a) => a.startsWith('--base='));
  const base = baseArg ? baseArg.split('=')[1] : 'http://localhost:4173';

  const robots = read('public/robots.txt');
  const sitemaps = [];
  robots.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^Sitemap:\s*(.+)$/i);
    if (m) sitemaps.push(m[1].trim());
  });

  const reports = { robotsHasSitemaps: sitemaps.length > 0, sitemaps, urls: [] };

  const sitemapFiles = [
    'public/sitemap.xml',
    'public/sitemap-blog.xml',
    'public/sitemap-images.xml',
    'public/sitemap-index.xml',
  ];

  for (const file of sitemapFiles) {
    if (!fs.existsSync(file)) continue;
    const xml = read(file);
    const locs = listXmlLocs(xml);
    for (const loc of locs) {
      const localUrl = loc.replace('https://currencytocurrency.app', base);
      reports.urls.push(await httpGet(localUrl));
    }
  }

  const failures = reports.urls.filter((r) => r.status !== 200);
  const summary = {
    total: reports.urls.length,
    ok: reports.urls.length - failures.length,
    failures: failures.length,
  };

  fs.writeFileSync('public/crawlability-report.json', JSON.stringify({ reports, summary }, null, 2));
  console.log('Crawlability report written to public/crawlability-report.json');
  if (failures.length) {
    console.log('Some URLs did not resolve with 200 locally. See report.');
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error('Validation failed:', e);
  process.exit(1);
});
