import matter from 'gray-matter';

export interface MarkdownBlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  publishDate: string;
  readTime?: string;
  category?: string;
  featured?: boolean;
  image?: string;
  tags?: string[];
  metaDescription?: string;
  content: string;
}

// Vite will import raw markdown strings from blog content directory
const modules = import.meta.glob('/src/content/blog/**/*.md', { as: 'raw', eager: true });

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
      const baseSlug = filename.replace(/\.md$/, '');

      // Extract title from first heading if not in frontmatter
      let title = data.title;
      if (!title) {
        const firstHeading = content.match(/^#\s+(.+)$/m);
        title = firstHeading ? firstHeading[1].trim() : baseSlug.replace(/[-_]/g, ' ');
      }

      // Create excerpt from content if not provided
      let excerpt = data.excerpt || data.description;
      if (!excerpt && content) {
        // Get first paragraph after headings
        const paragraphs = content.split('\n\n').filter(p => 
          p.trim() && !p.startsWith('#') && !p.startsWith('*Posted by')
        );
        excerpt = paragraphs[0]?.substring(0, 200) + '...' || '';
      }

      posts.push({
        title: title || baseSlug,
        slug: data.slug || baseSlug,
        excerpt: excerpt,
        publishDate: data.date || data.publishDate || '2025-01-30',
        readTime: data.readTime || '5 min read',
        category: data.category || 'Currency',
        featured: Boolean(data.featured),
        image: data.image || '/placeholder.svg',
        tags: Array.isArray(data.tags) ? data.tags : ['Forex', 'Currency'],
        metaDescription: data.metaDescription || data.description || excerpt,
        content: content.trim(),
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


