// Generate a JSON index of all blog posts at build time
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const blogDir = path.join(root, 'src', 'content', 'blog');
const outDir = path.join(root, 'public');
const outFile = path.join(outDir, 'blog-index.json');

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

function extractTitleFromHtml(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const raw = (h1 || t || '').replace(/<[^>]+>/g, '').trim();
  return raw || undefined;
}

function firstParagraph(html) {
  const p = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || html;
  return p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function toPost(file, raw) {
  const isHtml = /\.html$/i.test(file);
  const { data, content } = matter(raw || '');
  const baseSlug = path.basename(file).replace(/\.(md|html)$/i, '');
  let title = data.title;
  if (!title) {
    title = isHtml ? extractTitleFromHtml(content) : (content.match(/^#\s+(.+)$/m)?.[1]?.trim());
  }
  if (!title) title = baseSlug.replace(/[-_]/g, ' ');

  const mainContent = isHtml ? (content.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || content) : content;
  let excerpt = data.excerpt || data.description;
  if (!excerpt) {
    if (isHtml) excerpt = firstParagraph(mainContent).slice(0, 200);
    else {
      const para = mainContent.split(/\n\n+/).find(s => s.trim() && !s.startsWith('#')) || '';
      excerpt = para.replace(/\[(.*?)\]\((.*?)\)/g, '$1').trim().slice(0,200);
    }
  }
  const imgMatch = mainContent.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  const plainText = (isHtml ? mainContent.replace(/<[^>]+>/g, ' ') : mainContent)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[#>*_~`\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return {
    title,
    slug: data.slug || baseSlug,
    excerpt,
    publishDate: data.date || data.publishDate || '2025-01-30',
    image: data.image || data.cover || (imgMatch?.[1] || '/placeholder.svg'),
    readTime: data.readTime || `${minutes} min read`,
    wordCount,
    category: data.category || 'Currency',
    metaDescription: data.metaDescription || data.description || excerpt,
  };
}

function main() {
  if (!fs.existsSync(blogDir)) {
    console.log('[blog-index] Blog directory missing:', blogDir);
    return;
  }
  const files = fs.readdirSync(blogDir).filter(f => /\.(md|html)$/i.test(f));
  const posts = files.map(f => {
    const raw = readFileSafe(path.join(blogDir, f));
    try { return toPost(f, raw); } catch { return null; }
  }).filter(Boolean);
  posts.sort((a,b) => (a.publishDate < b.publishDate ? 1 : -1));
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(posts, null, 2));
  console.log(`[blog-index] Wrote ${posts.length} posts to ${outFile}`);
}

main();


