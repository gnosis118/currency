// Migrate long-form markdown articles in project root into src/content/blog with proper frontmatter
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC_CONTENT = path.join(ROOT, 'src', 'content', 'blog');

if (!fs.existsSync(SRC_CONTENT)) {
  fs.mkdirSync(SRC_CONTENT, { recursive: true });
}

const SOURCE_FILES = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith('.md'))
  .filter((f) => !f.startsWith('README'))
  .filter((f) => !f.startsWith('PROJECT_'))
  .filter((f) => !f.startsWith('SEO_'))
  .filter((f) => !f.startsWith('complete_pdf'))
  .filter((f) => !f.startsWith('pdf_'))
  .filter((f) => !f.startsWith('index'))
  .filter((f) => !f.startsWith('package'))
  .filter((f) => !f.startsWith('FOREX_BROKER_REVIEW_SUMMARY.md'));

function toSlug(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function stripMd(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^---[\s\S]*?---/m, ' ')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[#!>*_`~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function readingTime(words) {
  const min = Math.max(1, Math.ceil(words / 200));
  return `${min} min read`;
}

function extractTitle(raw) {
  const m = raw.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function ensureFrontmatter(raw, defaults) {
  if (/^---[\s\S]*?---/m.test(raw)) return raw;
  const fm = ['---', ...Object.entries(defaults).map(([k,v]) => `${k}: ${v}`), '---', ''].join('\n');
  return fm + raw;
}

let migrated = 0;

for (const f of SOURCE_FILES) {
  const abs = path.join(ROOT, f);
  let raw = fs.readFileSync(abs, 'utf8');
  const title = extractTitle(raw) || f.replace(/_/g, ' ').replace(/\.md$/, '');
  const slug = toSlug(title);
  const text = stripMd(raw);
  const words = text ? text.split(/\s+/).length : 0;
  const rt = readingTime(words);
  const defaults = {
    title: JSON.stringify(title),
    description: JSON.stringify(title),
    slug: JSON.stringify(slug),
    date: JSON.stringify('2025-08-10'),
    updated: JSON.stringify('2025-08-10'),
    author: JSON.stringify('Gavin Victor Clay'),
    category: JSON.stringify('Guide'),
    published: 'true',
    readingTime: JSON.stringify(rt),
    wordCount: JSON.stringify(words)
  };
  raw = ensureFrontmatter(raw, defaults);
  const dest = path.join(SRC_CONTENT, `${slug}.md`);
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, raw);
    migrated++;
  }
}

console.log(`Migrated ${migrated} article(s) to src/content/blog.`);

