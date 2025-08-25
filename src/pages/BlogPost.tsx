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
    "wordCount": (currentPost as any).wordCount || Math.max(1, (currentPost.content || '').split(/\s+/).length)
  };

  // Build optional FAQPage schema if FAQs detected
  const buildFaq = () => {
    const qas: Array<{ q: string; a: string }> = [];
    const content = currentPost.content || '';
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

        <div className="prose prose-lg max-w-none" data-sb-field-path="body">
          {isHtmlPost ? (
            <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
          ) : (
            currentPost.content.split('\n\n').map((paragraph: string, index: number) => {
              if (paragraph.trim() === '<BrokerComparisonChart />') return <BrokerComparisonChart key={index} className="my-8" />;
              if (paragraph.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary">{paragraph.substring(3)}</h2>;
              if (paragraph.startsWith('### ')) return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.substring(4)}</h3>;
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

          {currentPost.content.length < 500 && (
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

        <BlogSEOBooster currentSlug={slug} className="mt-12" />
      </article>
    </div>
  );
};

export default BlogPost;