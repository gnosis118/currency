// Lightweight frontmatter parser to avoid Node-only Buffer in the browser
import { getBlogImage } from '@/assets/blog-images';

export interface MarkdownBlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  publishDate: string;
  readTime?: string;
  wordCount?: number;
  category?: string;
  featured?: boolean;
  image?: string;
  tags?: string[];
  metaDescription?: string;
  published?: boolean;
  content: string;
}

// Parse simple YAML-like frontmatter delimited by leading --- blocks
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const result: { data: Record<string, any>; content: string } = { data: {}, content: raw };
  if (!raw || !raw.startsWith('---')) return result;
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return result;
  const fmBlock = raw.substring(3, end).trim();
  const body = raw.substring(end + 4).trim();
  const data: Record<string, any> = {};
  fmBlock.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) return;
    const key = m[1];
    let value: any = m[2];
    // Strip wrapping quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
      value = value.slice(1, -1);
    }
    // Booleans and numbers
    if (/^(true|false)$/i.test(value)) value = /^true$/i.test(value);
    else if (!isNaN(Number(value))) value = Number(value);
    data[key] = value;
  });
  result.data = data;
  result.content = body;
  return result;
}

// Vite will import raw strings from blog content directories (support both Markdown and HTML)
const modulesA = import.meta.glob('/src/content/blog/**/*.{md,html}', { query: '?raw', import: 'default', eager: true });
// Relative to this file (src/data) → src/content/blog
const modulesB = import.meta.glob('../content/blog/**/*.{md,html}', { query: '?raw', import: 'default', eager: true });
// Optional additional pattern in case of alternate root
const modulesC = import.meta.glob('/content/blog/**/*.{md,html}', { query: '?raw', import: 'default', eager: true });
const modules = { ...(modulesA as any), ...(modulesB as any), ...(modulesC as any) } as Record<string, unknown>;

export function loadAllBlogPosts(): MarkdownBlogPost[] {
  const posts: MarkdownBlogPost[] = [];

  console.log('Available markdown modules:', Object.keys(modules));

  for (const path in modules) {
    try {
      const raw = (modules as any)[path] as string;
      
      // Parse frontmatter (lightweight parser compatible with browser)
      const { data, content } = parseFrontmatter(raw);

      // Derive slug from filename if not provided
      const filename = path.split('/').pop() || '';
      const baseSlug = filename.replace(/\.(md|html)$/i, '');

      // No filtering: show all posts regardless of flags

      // Extract title depending on format (frontmatter/MD/HTML)
      let title = data.title as string | undefined;
      if (!title) {
        const isHtml = path.endsWith('.html');
        if (isHtml) {
          const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
          const titleTag = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          title = (h1Match?.[1] || titleTag?.[1])?.replace(/<[^>]+>/g, '').trim();
        } else {
          const firstHeading = content.match(/^#\s+(.+)$/m);
          title = firstHeading ? firstHeading[1].trim() : undefined;
        }
        if (!title) title = baseSlug.replace(/[-_]/g, ' ');
      }

      // For HTML files, extract <body> content as main content and meta description
      const isHtml = path.endsWith('.html');
      const htmlBodyMatch = isHtml ? content.match(/<body[^>]*>([\s\S]*?)<\/body>/i) : null;
      const mainContent = isHtml ? (htmlBodyMatch?.[1]?.trim() || content.trim()) : content.trim();
      const htmlMetaDesc = isHtml ? content.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i)?.[1] : undefined;

      // Create excerpt/meta/keywords automatically
      let excerpt = data.excerpt || data.description || htmlMetaDesc;
      if (!excerpt && mainContent) {
        if (path.endsWith('.html')) {
          const pMatch = mainContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
          const text = (pMatch?.[1] || mainContent)
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          excerpt = text.substring(0, 200) + (text.length > 200 ? '...' : '');
        } else {
          // Get first paragraph after headings for markdown
          const paragraphs = mainContent.split('\n\n').filter(p => 
            p.trim() && !p.startsWith('#') && !p.startsWith('*Posted by')
          );
          const text = (paragraphs[0] || '')
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1');
          excerpt = text.substring(0, 200) + (text.length > 200 ? '...' : '');
        }
      }

      // Compute word count and reading time (200 wpm default)
      const plainText = mainContent
        .replace(/<[^>]+>/g, ' ') // strip HTML tags if present
        .replace(/```[\s\S]*?```/g, '') // remove code blocks
        .replace(/`[^`]*`/g, '') // inline code
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // links -> text
        .replace(/[#>*_~`\-]/g, ' ') // markdown symbols
        .replace(/\s+/g, ' ') // collapse whitespace
        .trim();
      const wordCount = plainText ? plainText.split(/\s+/).length : 0;
      const minutes = Math.max(1, Math.ceil(wordCount / 200));
      const readTime = `${minutes} min read`;

      // Auto keywords from content frequency
      const autoKeywords = (() => {
        const words = plainText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
        const stop = new Set(['the','and','a','to','of','in','for','on','is','with','by','at','as','it','this','that','from','or','be','an','are','was','were','than','can','will','your','you','we','our']);
        const freq = new Map<string, number>();
        for (const w of words) {
          if (stop.has(w) || w.length < 3) continue;
          freq.set(w, (freq.get(w) || 0) + 1);
        }
        return Array.from(freq.entries()).sort((a,b) => b[1]-a[1]).slice(0, 10).map(([w]) => w);
      })();

      posts.push({
        title: title || baseSlug,
        slug: data.slug || baseSlug,
        excerpt: excerpt,
        publishDate: data.date || data.publishDate || '2025-08-01',
        readTime: data.readTime || readTime,
        wordCount,
        category: data.category || 'Currency',
        featured: Boolean(data.featured),
        image: data.image || data.cover || getBlogImage(baseSlug, data.category) || (() => {
          const imgMatch = mainContent.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
          return imgMatch?.[1] || '/placeholder.svg';
        })(),
        tags: Array.isArray(data.tags) ? data.tags : autoKeywords,
        metaDescription: data.metaDescription || data.description || htmlMetaDesc || excerpt,
        published: data.published !== false, // kept for compatibility but not used to filter
        content: mainContent,
      });
    } catch (error) {
      console.warn(`Error processing markdown file ${path}:`, error);
    }
  }

  console.log(`Loaded ${posts.length} markdown blog posts`);
  
  // Sort newest first by publishDate
  posts.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
  return posts;
}

export function loadPostBySlug(slug: string): MarkdownBlogPost | undefined {
  return loadAllBlogPosts().find((p) => p.slug === slug);
}

// Ultra-tolerant fallback: derive minimal post info without relying on frontmatter
export function loadAllBlogPostsFallback(): Pick<MarkdownBlogPost, 'title'|'slug'|'excerpt'|'publishDate'|'content'|'image'>[] {
  const posts: Pick<MarkdownBlogPost, 'title'|'slug'|'excerpt'|'publishDate'|'content'|'image'>[] = [];
  for (const path in modules) {
    try {
      const raw = (modules as any)[path] as string;
      const filename = path.split('/').pop() || '';
      const baseSlug = filename.replace(/\.(md|html)$/i, '');
      const isHtml = /\.html$/i.test(filename);
      let title = '';
      if (isHtml) {
        const h1 = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
        const t = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
        title = (h1 || t || baseSlug).replace(/<[^>]+>/g, '').trim();
      } else {
        title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() || baseSlug;
      }
      let excerpt = '';
      if (isHtml) {
        const p = raw.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || raw;
        excerpt = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
      } else {
        const para = raw.split(/\n\n+/).find(s => s.trim() && !s.startsWith('#')) || '';
        excerpt = para.replace(/\[(.*?)\]\((.*?)\)/g, '$1').trim().slice(0, 200);
      }
      const image = getBlogImage(baseSlug) || (() => {
        const m = raw.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
        return m?.[1] || '/placeholder.svg';
      })();
      posts.push({
        title,
        slug: baseSlug,
        excerpt,
        publishDate: '2025-08-01',
        content: '',
        image,
      });
    } catch {}
  }
  posts.sort((a,b) => (a.title > b.title ? 1 : -1));
  return posts;
}

