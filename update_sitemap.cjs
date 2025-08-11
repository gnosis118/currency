const fs = require('fs');

// Get all blog post slugs from blogPosts.ts
const blogPostsContent = fs.readFileSync('src/data/blogPosts.ts', 'utf8');

// Extract all slugs using regex
const slugMatches = blogPostsContent.match(/slug: ['"]([^'"]+)['"]/g);
const slugs = slugMatches ? slugMatches.map(match => match.match(/slug: ['"]([^'"]+)['"]/)[1]) : [];

console.log('Found slugs:', slugs);

// Extract titles for each slug
const titleMatches = blogPostsContent.match(/title: ['"]([^'"]+)['"]/g);
const titles = titleMatches ? titleMatches.map(match => match.match(/title: ['"]([^'"]+)['"]/)[1]) : [];

console.log('Found titles:', titles.length);

// Extract publish dates
const dateMatches = blogPostsContent.match(/publishDate: ['"]([^'"]+)['"]/g);
const dates = dateMatches ? dateMatches.map(match => match.match(/publishDate: ['"]([^'"]+)['"]/)[1]) : [];

console.log('Found dates:', dates.length);

// Create sitemap content
let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Blog main page -->
  <url>
    <loc>https://currencytocurrency.app/blog</loc>
    <lastmod>2025-02-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://currencytocurrency.app/blog" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://currencytocurrency.app/blog" />
  </url>

  <!-- Blog posts -->
`;

// Add each blog post to sitemap
slugs.forEach((slug, index) => {
  const title = titles[index] || 'Blog Post';
  const date = dates[index] || '2025-08-11';
  const priority = slug === 'forex-broker-reviews-2025' ? '1.0' : '0.9';
  
  sitemapContent += `  <url>
    <loc>https://currencytocurrency.app/blog/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://currencytocurrency.app/blog/${slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://currencytocurrency.app/blog/${slug}" />
    <news:news>
      <news:publication>
        <news:name>Currency to Currency</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${date}</news:publication_date>
      <news:title>${title.replace(/&/g, '&amp;')}</news:title>
    </news:news>
  </url>

`;
});

sitemapContent += `</urlset>`;

// Write the updated sitemap
fs.writeFileSync('public/sitemap-blog.xml', sitemapContent);
console.log('✅ Sitemap updated with', slugs.length, 'blog posts');

