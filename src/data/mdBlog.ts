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

// Vite will import raw markdown strings from multiple locations
const blogModules = import.meta.glob('/src/content/blog/**/*.md', { as: 'raw', eager: true });
const rootArticleModules = import.meta.glob('/article_*.md', { as: 'raw', eager: true });
const competitiveModules = import.meta.glob('/article_competitive_*.md', { as: 'raw', eager: true });
const otherResearchModules = import.meta.glob('/{ai-forex-trading-beginners-guide-2025,ai_forex_research,competitive_research_findings,forex_broker_reviews_2025,forex_brokers_restructured,brokers_restructured_content}.md', { as: 'raw', eager: true });

export function loadAllBlogPosts(): MarkdownBlogPost[] {
  const posts: MarkdownBlogPost[] = [];

  const allModules = { ...blogModules, ...rootArticleModules, ...competitiveModules, ...otherResearchModules } as Record<string, string>;

  for (const path in allModules) {
    const raw = allModules[path] as string;
    const { data, content } = matter(raw);

    // Derive slug from filename if not provided
    const filename = path.split('/').pop() || '';
    const baseSlug = filename.replace(/\.md$/, '');

    posts.push({
      title: data.title ?? baseSlug,
      slug: data.slug ?? baseSlug,
      excerpt: data.excerpt,
      publishDate: data.date ?? new Date().toISOString().split('T')[0],
      readTime: data.readTime,
      category: data.category,
      featured: Boolean(data.featured),
      image: data.image,
      tags: Array.isArray(data.tags) ? data.tags : undefined,
      metaDescription: data.metaDescription ?? data.description,
      content: content.trim(),
    });
  }

  // Sort newest first by publishDate
  posts.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
  return posts;
}

export function loadPostBySlug(slug: string): MarkdownBlogPost | undefined {
  return loadAllBlogPosts().find((p) => p.slug === slug);
}


