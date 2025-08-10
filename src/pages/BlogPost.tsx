import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, TrendingUp, ArrowUpDown, RefreshCw } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import BlogSEOBooster from '@/components/BlogSEOBooster';
import WebPOptimizedImage from '@/components/WebPOptimizedImage';
import { useToast } from '@/hooks/use-toast';
import { blogPosts } from '@/data/blogPosts';

const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();

  // Find the current blog post
  const currentPost = blogPosts.find(post => post.slug === slug);
  
  // Debug logging
  console.log('Current slug:', slug);
  console.log('Available slugs:', blogPosts.map(post => post.slug));
  console.log('Found post:', currentPost ? currentPost.title : 'Not found');
  console.log('Post content length:', currentPost ? currentPost.content.length : 0);

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

  // Universal blog post renderer
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": currentPost.title,
    "description": currentPost.metaDescription,
    "datePublished": currentPost.publishDate,
    "dateModified": new Date().toISOString().split('T')[0],
    "author": { "@type": "Organization", "name": "Currency to Currency" },
    "publisher": { "@type": "Organization", "name": "Currency to Currency" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://currencytocurrency.app/blog/${slug}` },
    "image": currentPost.image
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <SEOHead
        title={currentPost.title}
        description={currentPost.metaDescription}
        canonical={`https://currencytocurrency.app/blog/${slug}`}
        structuredData={structuredData}
      />
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <WebPOptimizedImage 
            src={currentPost.image} 
            alt={currentPost.title} 
            className="w-full h-[400px] object-cover" 
            priority={true}
            width={800}
            height={400}
          />
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge>{currentPost.category}</Badge>
            {currentPost.featured && <Badge variant="outline">Featured</Badge>}
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">{currentPost.title}</h1>
          <div className="flex items-center gap-6 text-muted-foreground">
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

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {currentPost.content.split('\n\n').map((paragraph, index) => {
            // Handle headings
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary">{paragraph.substring(3)}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.substring(4)}</h3>;
            }
            if (paragraph.startsWith('#### ')) {
              return <h4 key={index} className="text-lg font-semibold mt-4 mb-2">{paragraph.substring(5)}</h4>;
            }
            
            // Handle lists
            if (paragraph.includes('- ')) {
              const items = paragraph.split('\n').filter(line => line.startsWith('- '));
              return (
                <ul key={index} className="list-disc ml-6 space-y-2 mb-6">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} dangerouslySetInnerHTML={{ 
                      __html: item.substring(2)
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>') 
                    }} />
                  ))}
                </ul>
              );
            }
            
            // Handle numbered lists
            if (/^\d+\./.test(paragraph)) {
              const items = paragraph.split('\n').filter(line => /^\d+\./.test(line));
              return (
                <ol key={index} className="list-decimal ml-6 space-y-2 mb-6">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} dangerouslySetInnerHTML={{ 
                      __html: item.replace(/^\d+\.\s*/, '')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>') 
                    }} />
                  ))}
                </ol>
              );
            }
            
            // Handle regular paragraphs
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
          })}
          
          {/* If content is short, add disclaimer */}
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

        {/* Navigation */}
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