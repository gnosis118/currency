import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, TrendingUp, ArrowUpDown, RefreshCw } from 'lucide-react';
import EnhancedSEOHead from '@/components/EnhancedSEOHead';
import BlogSEOBooster from '@/components/BlogSEOBooster';
import SimpleImage from '@/components/SimpleImage';
import BrokerComparisonChart from '@/components/BrokerComparisonChart';
import { useToast } from '@/hooks/use-toast';
import { loadAllBlogPosts } from '@/data/mdBlog';
import BreadcrumbNav from '@/components/BreadcrumbNav';

const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();

  const loaded = loadAllBlogPosts();
  const currentPost = slug
    ? (loaded.find(p => p.slug === slug) as any)
    : undefined;

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Post Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const isHtmlPost = /^\s*</.test(currentPost.content || '');

  // Filter out any schema data from the content to prevent it from being rendered as visible text
  const cleanContent = (content: string) => {
    // Remove any JSON-LD schema blocks that might be in the content
    return content.replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '')
                  .replace(/schema:\s*\{[\s\S]*?\}/gi, '')
                  .replace(/@context[\s\S]*?schema\.org[\s\S]*?}/gi, '');
  };

  const processedContent = cleanContent(currentPost.content || '');

  // Build BlogPosting schema
  const blogPosting = {
    "@type": "BlogPosting",
    "headline": currentPost.title,
    "description": currentPost.metaDescription,
    "image": currentPost.image,
    "datePublished": currentPost.publishDate,
    "dateModified": new Date().toISOString().split('T')[0],
    "author": [{ "@type": "Person", "name": currentPost.author || 'Gavin Victor Clay' }],
    "publisher": {
      "@type": "Organization",
      "name": "Currency to Currency",
      "logo": { "@type": "ImageObject", "url": "https://currencytocurrency.app/icon-512.png" }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://currencytocurrency.app/blog/${slug}` },
    "url": `https://currencytocurrency.app/blog/${slug}`,
    "articleSection": currentPost.category || 'Guide',
    "wordCount": (currentPost as any).wordCount || Math.max(1, (processedContent || '').split(/\s+/).length)
  };

  // Mini TOC: build heading list (h2/h3) and ensure anchor ids
  const slugify = (str: string) =>
    String(str || '')
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/&[a-z]+;/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  type TOCItem = { level: 2 | 3; text: string; id: string };
  const tocHeadings: TOCItem[] = [];

  let htmlWithAnchors: string | null = null;
  if (isHtmlPost) {
    const seen = new Set<string>();
    htmlWithAnchors = processedContent.replace(/<h(2|3)([^>]*)>([\s\S]*?)<\/h\1>/gi, (m, lvl, attrs, inner) => {
      const textOnly = String(inner).replace(/<[^>]+>/g, '').trim();
      let idMatch = String(attrs).match(/\bid=["']([^"']+)["']/i);
      let id = idMatch ? idMatch[1] : slugify(textOnly);
      let base = id;
      let k = 1;
      while (seen.has(id)) { id = `${base}-${k++}`; }
      seen.add(id);
      tocHeadings.push({ level: Number(lvl) as 2 | 3, text: textOnly, id });
      // inject or replace id attribute
      if (idMatch) {
        return m.replace(idMatch[0], `id="${id}"`);
      }
      const space = attrs && String(attrs).trim().length ? ' ' : '';
      return `<h${lvl}${space}${String(attrs).trim()} id="${id}">${inner}</h${lvl}>`;
    });
  } else {
    // Markdown-like content: scan for lines starting with ## / ###
    const lines = processedContent.split('\n');
    const seen = new Set<string>();
    for (const line of lines) {
      if (/^##\s+/.test(line) || /^###\s+/.test(line)) {
        const level = line.startsWith('###') ? 3 : 2;
        const text = line.replace(/^###?\s+/, '').trim();
        let id = slugify(text);
        let base = id; let k = 1; while (seen.has(id)) { id = `${base}-${k++}`; }
        seen.add(id);
        tocHeadings.push({ level: level as 2 | 3, text, id });
      }
    }
  }

  const showTOC = tocHeadings.length >= 3 || (processedContent?.length || 0) > 2500;

  // Back-to-top affordance
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });



  // Build optional FAQPage schema if FAQs detected
  const buildFaq = () => {
    const qas: Array<{ q: string; a: string }> = [];
    const content = processedContent;
    if (isHtmlPost) {
      const faqBlock = content.match(/<h2[^>]*>\s*Frequently Asked Questions[\s\S]*?<\/h2>([\s\S]*)/i)?.[1] || content;
      const qMatches = [...faqBlock.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)];
      qMatches.forEach((m) => {
        const q = m[1]?.replace(/<[^>]+>/g, '').trim();
        const a = m[2]?.replace(/<[^>]+>/g, '').trim();
        if (q && a) qas.push({ q, a });
      });
    } else {
      const lines = content.split('\n');
      let inFaq = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^##\s*FAQ/i.test(line) || /^##\s*FAQs/i.test(line) || /^##\s*Frequently Asked Questions/i.test(line)) inFaq = true;
        if (inFaq && /^###\s+/.test(line)) {
          const q = line.replace(/^###\s+/, '').trim();
          let a = '';
          let j = i + 1;
          while (j < lines.length && !/^###\s+/.test(lines[j]) && !/^##\s+/.test(lines[j])) {
            a += (lines[j] + ' ');
            j++;
          }
          a = a.replace(/\[(.+?)\]\((.+?)\)/g, '$1').trim();
          if (q && a) qas.push({ q, a });
        }
      }
    }
    if (!qas.length) return null;
    return {
      "@type": "FAQPage",
      "mainEntity": qas.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a }
      }))
    };
  };

  const faqSchema = buildFaq();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": faqSchema ? [blogPosting, faqSchema] : [blogPosting]
  };

  // Related posts based on tags/keywords and title similarity
  const relatedPosts = (() => {
    try {
      const currentTags: string[] = Array.isArray((currentPost as any).tags) ? (currentPost as any).tags.map((t: string) => String(t).toLowerCase()) : [];
      const titleWords = String(currentPost.title || '').toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean);
      const score = (p: any) => {
        let s = 0;
        const tags: string[] = Array.isArray(p.tags) ? p.tags.map((t: string) => String(t).toLowerCase()) : [];
        if (currentTags.length && tags.length) {
          const set = new Set(tags);
          for (const t of currentTags) if (set.has(t)) s += 3;
        }
        const candTitle = String(p.title || '').toLowerCase();
        for (const w of titleWords) if (w.length > 3 && candTitle.includes(w)) s += 1;
        return s;
      };
      return loaded
        .filter((p: any) => p.slug !== (currentPost as any).slug)
        .map((p: any) => ({ p, s: score(p) }))
        .sort((a, b) => b.s - a.s)
        .slice(0, 5)
        .map(({ p }) => p);
    } catch {
      return loaded.filter((p: any) => p.slug !== (currentPost as any).slug).slice(0, 5);
    }
  })();
  // Build related currency conversion links from content/title or fallbacks
  const relatedConversionPairs = (() => {
    const supported = new Set([
      'USD','EUR','GBP','JPY','AUD','CAD','CHF','NZD','CNY','INR','SEK','NOK','ZAR','MXN','SGD','HKD'
    ]);

    const text = `${currentPost.title || ''} ${processedContent || ''}`
      .replace(/<[^>]+>/g, ' ') // strip any HTML tags
      .toUpperCase();

    // Collect unique currency codes appearing in text
    const found: string[] = [];
    supported.forEach(code => {
      const re = new RegExp(`(^|[^A-Z])${code}([^A-Z]|$)`);
      if (re.test(text)) found.push(code);
    });

    // Helper to dedupe pairs
    const seen = new Set<string>();
    const addPair = (a: string, b: string, acc: Array<{from: string; to: string}>) => {
      if (!a || !b || a === b) return;
      const key = `${a}-${b}`;
      if (!seen.has(key)) { seen.add(key); acc.push({ from: a, to: b }); }
    };

    const result: Array<{from: string; to: string}> = [];

    if (found.length >= 2) {
      // Use up to first 3 codes to keep links focused
      const codes = found.slice(0, 3);
      for (let i = 0; i < codes.length; i++) {
        for (let j = 0; j < codes.length; j++) {
          if (i !== j) addPair(codes[i], codes[j], result);
        }
      }
      return result.slice(0, 8);
    }

    // Fallbacks by category/topic
    const cat = String(currentPost.category || '').toLowerCase();
    const fallbackLists: Record<string, string[]> = {
      travel: ['USD-EUR','USD-JPY','EUR-GBP','USD-CAD'],
      trading: ['EUR-USD','USD-JPY','GBP-USD','USD-CHF'],
      freelancing: ['USD-EUR','USD-GBP','USD-INR','USD-MXN'],
      'small business': ['USD-EUR','USD-CNY','EUR-GBP','USD-CAD'],
      comparison: ['USD-EUR','EUR-USD','GBP-USD','USD-JPY']
    };
    const list = fallbackLists[cat] || ['USD-EUR','EUR-USD','GBP-USD','USD-JPY'];
    list.forEach(pair => {
      const [a, b] = pair.split('-');
      if (supported.has(a) && supported.has(b)) addPair(a, b, result);
    });
    return result;
  })();


  return (
    <div className="min-h-screen bg-background py-8">
      <EnhancedSEOHead
        title={currentPost.title}
        description={currentPost.metaDescription}
        canonicalUrl={`https://currencytocurrency.app/blog/${slug}`}
        structuredData={structuredData}
        pageType="article"
        ogImage={currentPost.image}
      />
      <article className="container mx-auto px-4 max-w-4xl" data-sb-object-id={String(currentPost.slug || '')}>
        <BreadcrumbNav className="mb-4" />
        <div className="mb-8 rounded-lg overflow-hidden" data-sb-field-path="cover">
          <SimpleImage
            src={currentPost.image}
            alt={currentPost.title}
            className="w-full h-[400px]"
            width={800}
            height={400}
          />
        </div>

        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge data-sb-field-path="category">{currentPost.category}</Badge>
            {currentPost.featured && <Badge variant="outline">Featured</Badge>}
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4" data-sb-field-path="title">{currentPost.title}</h1>
          <div className="flex items-center gap-6 text-muted-foreground" data-sb-field-path="date">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(currentPost.publishDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {currentPost.readTime}
            </div>
          </div>
        </header>


        {showTOC && tocHeadings.length > 0 && (
          <nav aria-label="Table of contents" className="mb-8 rounded-md border bg-muted/30 p-4">
            <div className="text-sm font-semibold mb-2">In this article</div>
            <ul className="space-y-2">
              {tocHeadings.map((h) => (
                <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
                  <a href={`#${h.id}`} className="text-primary hover:underline">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="prose prose-lg max-w-none" data-sb-field-path="body">
          {isHtmlPost ? (
            <div dangerouslySetInnerHTML={{ __html: htmlWithAnchors || processedContent }} />
          ) : (
            processedContent.split('\n\n').map((paragraph: string, index: number) => {
              if (paragraph.trim() === '<BrokerComparisonChart />') return <BrokerComparisonChart key={index} className="my-8" />;
              if (paragraph.startsWith('## ')) {
                const text = paragraph.substring(3);
                const id = slugify(text);
                return <h2 key={index} id={id} className="text-2xl font-bold mt-8 mb-4 text-primary">{text}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                const text = paragraph.substring(4);
                const id = slugify(text);
                return <h3 key={index} id={id} className="text-xl font-semibold mt-6 mb-3">{text}</h3>;
              }
              if (paragraph.startsWith('#### ')) return <h4 key={index} className="text-lg font-semibold mt-4 mb-2">{paragraph.substring(5)}</h4>;
              if (paragraph.includes('- ')) {
                const items = paragraph.split('\n').filter((line: string) => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc ml-6 space-y-2 mb-6">
                    {items.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} dangerouslySetInnerHTML={{
                        __html: item.substring(2)
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
                      }} />
                    ))}
                  </ul>
                );
              }
              if (/^\d+\./.test(paragraph)) {
                const items = paragraph.split('\n').filter((line: string) => /^\d+\./.test(line));
                return (
                  <ol key={index} className="list-decimal ml-6 space-y-2 mb-6">
                    {items.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} dangerouslySetInnerHTML={{
                        __html: item.replace(/^\d+\.\s*/, '')
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
                      }} />
                    ))}
                  </ol>
                );
              }
              if (paragraph.trim() && !paragraph.startsWith('---')) {
                return (
                  <p key={index} className="mb-6 leading-relaxed"
                     dangerouslySetInnerHTML={{
                       __html: paragraph
                         .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                         .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
                     }}
                  />
                );
              }
              return null;
            })
          )}

          {processedContent.length < 500 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
              <p className="text-amber-800 mb-2">
                <strong>📝 Content Preview</strong>
              </p>
              <p className="text-amber-700 mb-0">
                This article preview shows the key highlights. Our full in-depth analysis is currently being expanded to provide comprehensive coverage of this topic.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>

        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((rp: any) => (
                <Link key={rp.slug} to={`/blog/${rp.slug}`} className="group rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={rp.image || '/placeholder.svg'}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.onerror = null;
                        img.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">{rp.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{rp.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {relatedConversionPairs && relatedConversionPairs.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border" aria-label="Related currency conversions">
            <h2 className="text-2xl font-semibold mb-4">Related Conversions</h2>
            <p className="text-sm text-muted-foreground mb-4">Quick links to popular currency pairs mentioned in this article:</p>
            <div className="flex flex-wrap gap-2">
              {relatedConversionPairs.map(({ from, to }) => (
                <Link
                  key={`${from}-${to}`}
                  to={`/convert/${from.toLowerCase()}-to-${to.toLowerCase()}`}
                  className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition-colors"
                >


                  {from} → {to}
                </Link>
              ))}
            </div>
          </div>
        )}


        <BlogSEOBooster currentSlug={slug} className="mt-12" />
      </article>

      {showBackToTop && (
        <button
          aria-label="Back to top"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 h-10 w-10 flex items-center justify-center"
        >
          <span className="sr-only">Back to top</span>
          ↑
        </button>
      )}

    </div>
  );
};

export default BlogPost;