#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'blog');
const MIN_WORDS = parseInt(process.env.MIN_BLOG_WORDS || '2500', 10);
const DELETE_SHORT = String(process.env.DELETE_SHORT || '').toLowerCase() === 'true';

function listFiles(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.html'));
}

function stripMarkdownAndHtml(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ') // HTML tags
    .replace(/^---[\s\S]*?---/m, ' ') // frontmatter
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // links text
    .replace(/[#!>*_`~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateReadingTime(words) {
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function updateFrontmatter(raw, updates) {
  const fmMatch = raw.match(/^---[\s\S]*?---/m);
  const fm = fmMatch ? fmMatch[0] : null;
  const body = fmMatch ? raw.slice(fmMatch[0].length).trimStart() : raw;
  const lines = fm ? fm.split('\n').slice(1, -1) : [];
  const map = new Map(lines.map(l => {
    const idx = l.indexOf(':');
    if (idx === -1) return [l.trim(), ''];
    const key = l.slice(0, idx).trim();
    const val = l.slice(idx + 1).trim();
    return [key, val];
  }));
  Object.entries(updates).forEach(([k, v]) => {
    map.set(k, typeof v === 'string' ? v : JSON.stringify(v));
  });
  const newFm = ['---', ...Array.from(map.entries()).map(([k, v]) => `${k}: ${v}`), '---'].join('\n');
  return `${newFm}\n\n${body}`;
}

function ensureFrontmatter(raw) {
  return /^---[\s\S]*?---/m.test(raw) ? raw : `---\npublished: true\n---\n\n${raw}`;
}

function processFile(fp) {
  const abs = path.join(CONTENT_DIR, fp);
  let raw = fs.readFileSync(abs, 'utf8');
  raw = ensureFrontmatter(raw);
  const text = stripMarkdownAndHtml(raw);
  const words = text ? text.split(/\s+/).length : 0;
  const readingTime = estimateReadingTime(words);
  const updated = updateFrontmatter(raw, { wordCount: String(words), readingTime: JSON.stringify(readingTime) });
  if (updated !== raw) fs.writeFileSync(abs, updated);
  return { file: fp, words };
}

if (!fs.existsSync(CONTENT_DIR)) {
  console.log('No blog content directory found, skipping quality enforcement.');
  process.exit(0);
}

const files = listFiles(CONTENT_DIR);
const results = files.map(processFile);

const tooShort = results.filter(r => r.words < MIN_WORDS);

if (tooShort.length) {
  if (DELETE_SHORT) {
    tooShort.forEach(({ file }) => fs.unlinkSync(path.join(CONTENT_DIR, file)));
    console.error(`Deleted ${tooShort.length} post(s) below ${MIN_WORDS} words:`);
    tooShort.forEach(r => console.error(` - ${r.file} (${r.words} words)`));
  } else {
    console.error(`Found posts below ${MIN_WORDS} words:`);
    tooShort.forEach(r => console.error(` - ${r.file} (${r.words} words)`));
    console.error('Set DELETE_SHORT=true to auto-delete short posts, or increase word counts.');
    process.exit(1);
  }
}

console.log(`Quality OK. ${results.length} file(s) checked. Min words: ${MIN_WORDS}.`);

