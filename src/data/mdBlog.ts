import matter from 'gray-matter';

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

// Vite will import raw markdown or HTML strings from blog content directories
// Use multiple patterns for cross-env compatibility (absolute and relative)
const modulesA = import.meta.glob('../content/blog/**/*.{md,html}', { query: '?raw', import: 'default', eager: true });
const modulesB = import.meta.glob('/src/content/blog/**/*.{md,html}', { query: '?raw', import: 'default', eager: true });
const modulesC = import.meta.glob('../../content/blog/**/*.{md,html}', { query: '?raw', import: 'default', eager: true });
const modulesD = import.meta.glob('/content/blog/**/*.{md,html}', { query: '?raw', import: 'default', eager: true });
const modules = { ...(modulesA as any), ...(modulesB as any), ...(modulesC as any), ...(modulesD as any) } as Record<string, unknown>;

export function loadAllBlogPosts(): MarkdownBlogPost[] {
  const posts: MarkdownBlogPost[] = [];

  console.log('Available markdown modules:', Object.keys(modules));

  for (const path in modules) {
    try {
      const raw = (modules as any)[path] as string;
      
      // Parse frontmatter (gray-matter handles files without frontmatter gracefully)
      const { data, content } = matter(raw);

      // Derive slug from filename if not provided
      const filename = path.split('/').pop() || '';
      const baseSlug = filename.replace(/\.(md|html)$/i, '');

      // Skip unpublished/draft/hidden content and hard-removed slugs
      const hiddenSlugs = new Set<string>([
        'fx_broker_research',
        'forex_brokers_restructured',
        'new_forex_content',
        'seo_fixes_summary',
        'competitive_research_findings',
        'brokers_restructured_content',
      ]);
      const effectiveSlug = (data.slug || baseSlug) as string;
      if (data?.draft === true || data?.published === false || data?.hide === true) {
        continue;
      }
      if (hiddenSlugs.has(effectiveSlug)) {
        continue;
      }

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

      // Create excerpt from content if not provided
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

      posts.push({
        title: title || baseSlug,
        slug: data.slug || baseSlug,
        excerpt: excerpt,
        publishDate: data.date || data.publishDate || '2025-01-30',
        readTime: data.readTime || readTime,
        wordCount,
        category: data.category || 'Currency',
        featured: Boolean(data.featured),
        image: data.image || data.cover || (() => {
          const imgMatch = mainContent.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
          return imgMatch?.[1] || '/placeholder.svg';
        })(),
        tags: Array.isArray(data.tags) ? data.tags : ['Forex', 'Currency'],
        metaDescription: data.metaDescription || data.description || htmlMetaDesc || excerpt,
        published: data.published !== false,
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


