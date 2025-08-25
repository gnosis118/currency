import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import blogHero from '@/assets/blog-hero.jpg';
import blogPostBackground from '@/assets/blog-post-background.jpg';
import { loadAllBlogPosts } from '@/data/mdBlog';
import BreadcrumbNav from '@/components/BreadcrumbNav';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const pageSize = 10;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Currency to Currency Blog",
    "description": "Expert insights on currency exchange, forex trends, and conversion strategies",
    "url": "https://currencytocurrency.app/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Currency to Currency"
    }
  };

  // Load all posts (md/html) and show them all with no filters
  const loaded = loadAllBlogPosts();
  const visibleSorted = loaded
    .slice()
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
  const totalPages = Math.max(1, Math.ceil(visibleSorted.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages) - 1;
  const posts = visibleSorted.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, newPage));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(clamped));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <SEOHead
        title="Currency Exchange Blog - Expert Forex Insights | Currency to Currency"
        description="Expert forex insights, currency exchange analysis & conversion strategies. Latest market trends, rate forecasts & money-saving tips for travelers."
        keywords="forex blog, currency exchange insights, exchange rate analysis, forex news, currency trends"
        canonical="https://currencytocurrency.app/blog"
        structuredData={structuredData}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <BreadcrumbNav className="mb-4" />
        {/* Hero Section */}
        <div className="relative mb-12 rounded-2xl overflow-hidden">
          <div 
            className="h-96 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${blogHero})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
              <div>
                <h1 className="text-5xl font-bold mb-4">
                  Currency Exchange Blog
                </h1>
                <p className="text-xl max-w-2xl mx-auto opacity-90">
                  Expert insights on forex trends, exchange rate analysis, and currency conversion strategies
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {posts.map((post) => (
                <Card key={post.slug} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Featured Image */}
                    <div className="md:col-span-1">
                      <div className="aspect-video md:aspect-square overflow-hidden">
                        <img 
                          src={post.image || '/placeholder.svg'} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-center gap-4 mb-3">
                        {post.category && <Badge variant="secondary">{post.category}</Badge>}
                        {(post as any).featured && <Badge variant="default">Featured</Badge>}
                      </div>
                      <CardTitle className="text-2xl hover:text-primary transition-colors mb-3">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishDate).toLocaleDateString()}
                          </div>
                          {(post as any).readTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {(post as any).readTime}
                            </div>
                          )}
                        </div>
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="text-primary hover:underline font-medium"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <div className="flex items-center justify-between pt-4">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="text-sm disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline"
                >
                  ← Newer Posts
                </button>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="text-sm disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline"
                >
                  Older Posts →
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['USD to EUR', 'GBP to USD', 'Currency Forecasts', 'Forex Trading', 'Travel Money'].map((topic) => (
                    <span key={topic}>
                      <Badge variant="outline" className="mr-2 mb-2">
                        {topic}
                      </Badge>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Convert</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Need a quick conversion? Use our live converter.
                </p>
                <Link 
                  to="/"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Open Converter
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;