import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import blogHero from '@/assets/blog-hero.jpg';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { getBlogImage } from '@/assets/blog-images';

const Blog = () => {
  // Build-time map of local assets so we can resolve '/src/assets/*' and filenames safely at runtime
  const localAssetModules = import.meta.glob('@/assets/*', { eager: true, import: 'default' }) as Record<string, string>;
  const assetBasenameToUrl: Record<string, string> = Object.fromEntries(
    Object.entries(localAssetModules).map(([path, url]) => [path.split('/').pop() as string, url])
  );
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

  const getSafeImageSrc = (src?: string, slug?: string, category?: string) => {
    // First try the reliable blog image mapping
    if (slug) {
      const mappedImage = getBlogImage(slug, category);
      if (mappedImage !== blogHero) {
        return mappedImage;
      }
    }

    if (!src) return blogHero;
    let url = src.trim();

    // Handle external URLs first (these should work)
    if (url.startsWith('https://')) return url;
    if (url.startsWith('http://')) return url.replace(/^http:\/\//, 'https://');

    // Handle different image path formats
    if (url.startsWith('/public/')) url = url.replace(/^\/public\//, '/');
    if (url.startsWith('public/')) url = url.replace(/^public\//, '/');

    // Resolve any /src/assets/* (or src/assets/*) to built asset URL via basename match
    if (url.startsWith('/src/assets/')) {
      const basename = url.split('/').pop() as string;
      const resolvedUrl = assetBasenameToUrl[basename];
      if (resolvedUrl) {
        return resolvedUrl;
      } else {
        console.warn(`Asset not found: ${basename}, using mapped image for ${slug}`);
        return slug ? getBlogImage(slug, category) : blogHero;
      }
    }
    if (url.startsWith('src/assets/')) {
      const basename = url.split('/').pop() as string;
      const resolvedUrl = assetBasenameToUrl[basename];
      if (resolvedUrl) {
        return resolvedUrl;
      } else {
        console.warn(`Asset not found: ${basename}, using mapped image for ${slug}`);
        return slug ? getBlogImage(slug, category) : blogHero;
      }
    }

    // As a last resort, try matching by basename even if path is different
    if (!url.startsWith('http') && !url.startsWith('/images/')) {
      const basename = url.split('/').pop() as string;
      if (assetBasenameToUrl[basename]) return assetBasenameToUrl[basename];
    }

    // Handle /images/ paths
    if (url.startsWith('images/')) url = '/' + url;
    if (url.startsWith('/images/')) return url;

    // Final fallback to mapped image
    return slug ? getBlogImage(slug, category) : blogHero;
  };

  // Use ONLY the static JSON to avoid duplicates
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastLoaded, setLastLoaded] = useState<string>('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Force fresh data with cache-busting and no-cache headers
        const cacheBuster = new Date().getTime();
        const response = await fetch(`/blog-index.json?v=${cacheBuster}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            // Remove any duplicates that might still exist
            const seen = new Set();
            const uniquePosts = data.filter(post => {
              if (seen.has(post.slug)) {
                console.warn(`Duplicate post removed: ${post.slug} - ${post.title}`);
                return false;
              }
              seen.add(post.slug);
              return true;
            });

            console.log(`Loaded ${uniquePosts.length} unique posts from blog-index.json`);
            console.log('Posts loaded:', uniquePosts.map(p => ({ slug: p.slug, title: p.title })));
            setPosts(uniquePosts.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1)));
            setLastLoaded(new Date().toLocaleTimeString());
          }
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages) - 1;
  const currentPosts = posts.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  // Canonical and pagination URLs
  const baseBlogUrl = 'https://currencytocurrency.app/blog';
  const canonical = currentPage > 1 ? `${baseBlogUrl}?page=${currentPage}` : baseBlogUrl;
  const prevUrl = currentPage > 1 ? (currentPage === 2 ? baseBlogUrl : `${baseBlogUrl}?page=${currentPage - 1}`) : null;
  const nextUrl = currentPage < totalPages ? `${baseBlogUrl}?page=${currentPage + 1}` : null;


  // High-value internal links to pass authority to converter pages
  const topConversions: Array<{ from: string; to: string; label?: string }> = [
    { from: 'USD', to: 'EUR' },
    { from: 'EUR', to: 'USD' },
    { from: 'GBP', to: 'USD' },
    { from: 'USD', to: 'JPY' },
    { from: 'USD', to: 'CAD' },
    { from: 'AUD', to: 'USD' },
    { from: 'USD', to: 'INR' },
    { from: 'USD', to: 'MXN' },
  ];

  // Order by observed popularity (client-side heuristic via localStorage)
  const [orderedConversions, setOrderedConversions] = useState(topConversions);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('conversionClicks') || '{}';
      const map = JSON.parse(raw) as Record<string, number>;
      const scored = topConversions.map((p) => ({
        p,
        c: map[`${p.from.toLowerCase()}-${p.to.toLowerCase()}`] || 0,
      }));
      scored.sort((a, b) => b.c - a.c);
      setOrderedConversions(scored.map((s) => s.p));
    } catch {
      // ignore
    }
  }, []);

  const trackConversionClick = (from: string, to: string) => {
    try {
      const key = `${from.toLowerCase()}-${to.toLowerCase()}`;
      const raw = localStorage.getItem('conversionClicks') || '{}';
      const map = JSON.parse(raw) as Record<string, number>;
      map[key] = (map[key] || 0) + 1;
      localStorage.setItem('conversionClicks', JSON.stringify(map));
    } catch {
      // ignore
    }
  };



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
        canonical={canonical}
        structuredData={structuredData}
      />
      <Helmet>
        <link rel="alternate" hrefLang="en" href={canonical} />
        <link rel="alternate" hrefLang="x-default" href={canonical} />
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}
      </Helmet>

      <div className="container mx-auto px-3 md:px-4 max-w-6xl">
        <BreadcrumbNav className="mb-4" />

        {/* Hero Section */}
        <div className="relative mb-8 md:mb-12 rounded-xl md:rounded-2xl overflow-hidden">
          <div
            className="h-64 md:h-96 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${blogHero})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
              <div>
                <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4">
                  Currency Exchange Blog
                </h1>
                <p className="text-sm md:text-xl max-w-2xl mx-auto opacity-90">
                  Expert insights on forex trends, exchange rate analysis, and currency conversion strategies
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Loading blog posts...</span>
              </div>
            ) : (
              <>
                {lastLoaded && (
                  <div className="text-xs text-muted-foreground mb-4 text-center">
                    Data loaded at: {lastLoaded} | Total posts: {posts.length}
                  </div>
                )}
              {/* Featured Recent Posts */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {posts.slice(0, 3).map((post) => (
                    <Card key={`featured-${post.slug}`} className="overflow-hidden group hover:shadow-lg transition-shadow border-0 md:border shadow-sm md:shadow-md">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={getSafeImageSrc((post as any).image, post.slug, post.category)}
                          alt={post.title}
                          width={1200}
                          height={675}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            img.onerror = null;
                            img.src = getBlogImage(post.slug, post.category); // Use mapped image as fallback
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          {post.category && <Badge variant="secondary" className="text-xs">{post.category}</Badge>}
                          <Badge variant="default" className="text-xs">New</Badge>
                        </div>
                        <CardTitle className="text-lg hover:text-primary transition-colors mb-2 leading-tight line-clamp-2">
                          <Link to={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </CardTitle>
                        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishDate).toLocaleDateString()}
                          </div>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-primary hover:underline font-medium text-sm"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Posts */}
              <div className="space-y-6 md:space-y-8">
                {currentPosts.map((post) => (
                  <Card key={post.slug} className="overflow-hidden group hover:shadow-lg transition-shadow border-0 md:border shadow-sm md:shadow-md">
                    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                      {/* Featured Image */}
                      <div className="md:col-span-1">
                        <div className="aspect-video md:aspect-square overflow-hidden">
                          <img
                            src={getSafeImageSrc((post as any).image, post.slug, post.category)}
                            alt={post.title}
                            width={1200}
                            height={675}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.onerror = null;
                              img.src = getBlogImage(post.slug, post.category); // Use mapped image as fallback
                            }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:col-span-2 p-4 md:p-6">
                        <div className="flex items-center gap-2 md:gap-4 mb-3">
                          {post.category && <Badge variant="secondary" className="text-xs md:text-sm">{post.category}</Badge>}
                          {(post as any).featured && <Badge variant="default" className="text-xs md:text-sm">Featured</Badge>}
                        </div>

                        <CardTitle className="text-lg md:text-2xl hover:text-primary transition-colors mb-3 leading-tight">
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

                {/* Pagination */}
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
              </>
            )}
          </div>

          {/* Sidebar */}
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
            <Card>
              <CardHeader>
                <CardTitle>Top Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {orderedConversions.map(({ from, to, label }) => (
                    <Link
                      key={`${from}-${to}`}
                      to={`/convert/${from.toLowerCase()}-to-${to.toLowerCase()}`}
                      onClick={() => trackConversionClick(from, to)}
                      className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition-colors"
                    >
                      {label || `${from} → ${to}`}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>


        </div>
      </div>
    </div>
  );
};

export default Blog;