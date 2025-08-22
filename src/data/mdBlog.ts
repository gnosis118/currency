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

  for (const path in modules) {
    const raw = (modules as any)[path] as string;
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


