#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Simple frontmatter parser
function parseFrontmatter(content) {
  const lines = content.split('\n');
  if (lines[0] !== '---') return { data: {}, content };
  
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      endIndex = i;
      break;
    }
  }
  
  if (endIndex === -1) return { data: {}, content };
  
  const frontmatterLines = lines.slice(1, endIndex);
  const data = {};
  
  frontmatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      data[key] = value === 'true' ? true : value === 'false' ? false : value;
    }
  });
  
  return { data, content: lines.slice(endIndex + 1).join('\n') };
}

// Function to read markdown files from content directory
function loadBlogPosts() {
  const blogDir = path.resolve(__dirname, '..', 'src', 'content', 'blog');
  const posts = [];
  
  if (!fs.existsSync(blogDir)) {
    console.log('Blog directory not found:', blogDir);
    return posts;
  }
  
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  files.forEach(file => {
    try {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = parseFrontmatter(fileContent);
      
      // Derive slug from filename if not provided
      const baseSlug = file.replace(/\.md$/, '');
      
      // Extract title from first line if not in frontmatter
      let title = data.title;
      if (!title) {
        const firstLine = fileContent.split('\n').find(line => line.startsWith('# '));
        title = firstLine ? firstLine.replace('# ', '') : baseSlug;
      }
      
      posts.push({
        slug: data.slug || baseSlug,
        title: title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        date: data.date || data.publishDate || '2025-01-30',
        featured: Boolean(data.featured),
        filename: file
      });
    } catch (error) {
      console.warn(`Error processing ${file}:`, error.message);
    }
  });
  
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Load blog posts from TypeScript file as fallback
function loadTSBlogPosts() {
  const posts = [];
  try {
    const blogPostsContent = fs.readFileSync('src/data/blogPosts.ts', 'utf8');
    const objectMatches = blogPostsContent.match(/{\s*title:\s*['"][^'"]+['"][\s\S]*?content:\s*`[\s\S]*?`\s*}/g);

    if (objectMatches) {
      objectMatches.forEach(objStr => {
        const slugMatch = objStr.match(/slug:\s*['"]([^'"]+)['"]/);
        const titleMatch = objStr.match(/title:\s*['"]([^'"]+)['"]/);
        const dateMatch = objStr.match(/publishDate:\s*['"]([^'"]+)['"]/);
        const featuredMatch = objStr.match(/featured:\s*(true|false)/);
        
        if (slugMatch && titleMatch && dateMatch) {
          posts.push({
            slug: slugMatch[1],
            title: titleMatch[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
            date: dateMatch[1],
            featured: featuredMatch ? featuredMatch[1] === 'true' : false,
            source: 'typescript'
          });
        }
      });
    }
  } catch (error) {
    console.warn('Error loading TypeScript blog posts:', error.message);
  }
  return posts;
}

// Merge markdown and TypeScript posts, prefer markdown when slug collides
function getAllBlogPosts() {
  const mdPosts = loadBlogPosts();
  const tsPosts = loadTSBlogPosts();
  
  const mdSlugs = new Set(mdPosts.map(p => p.slug));
  const uniqueTsPosts = tsPosts.filter(p => !mdSlugs.has(p.slug));
  
  const allPosts = [...mdPosts, ...uniqueTsPosts];
  console.log(`Found ${mdPosts.length} markdown posts, ${uniqueTsPosts.length} unique TypeScript posts`);
  console.log(`Total blog posts: ${allPosts.length}`);
  
  return allPosts;
}

// Define static pages with their priorities and change frequencies
const staticPages = [
  {
    url: 'https://currencytocurrency.app/',
    lastmod: '2025-01-30',
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    url: 'https://currencytocurrency.app/convert',
    lastmod: '2025-01-30',
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    url: 'https://currencytocurrency.app/charts',
    lastmod: '2025-01-30',
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    url: 'https://currencytocurrency.app/alerts',
    lastmod: '2025-01-30',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    url: 'https://currencytocurrency.app/travel',
    lastmod: '2025-01-30',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    url: 'https://currencytocurrency.app/brokers',
    lastmod: '2025-01-30',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    url: 'https://currencytocurrency.app/blog',
    lastmod: '2025-01-30',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    url: 'https://currencytocurrency.app/faq',
    lastmod: '2025-01-30',
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    url: 'https://currencytocurrency.app/privacy-policy',
    lastmod: '2025-01-30',
    changefreq: 'yearly',
    priority: '0.3'
  },
  {
    url: 'https://currencytocurrency.app/terms-of-service',
    lastmod: '2025-01-30',
    changefreq: 'yearly',
    priority: '0.3'
  }
];

// Popular currency conversion pages
const currencyPairs = [
  'usd-to-eur', 'usd-to-gbp', 'usd-to-jpy', 'eur-to-gbp', 'usd-to-cad',
  'usd-to-aud', 'gbp-to-usd', 'eur-to-usd', 'jpy-to-usd', 'aud-to-usd',
  'usd-to-chf', 'eur-to-jpy', 'cad-to-usd', 'chf-to-usd', 'usd-to-nzd',
  'nzd-to-usd'
];

function generateSitemaps() {
  const blogPosts = getAllBlogPosts();
  
  // Generate main sitemap
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

`;

  // Add static pages
  staticPages.forEach(page => {
    sitemapContent += `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${page.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${page.url}" />
  </url>

`;
  });

  // Add blog posts
  blogPosts.forEach(post => {
    const priority = post.featured ? '0.9' : '0.8';
    const changefreq = post.featured ? 'weekly' : 'monthly';
    
    sitemapContent += `  <url>
    <loc>https://currencytocurrency.app/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://currencytocurrency.app/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://currencytocurrency.app/blog/${post.slug}" />
    <news:news>
      <news:publication>
        <news:name>Currency to Currency</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${post.date}</news:publication_date>
      <news:title>${post.title}</news:title>
    </news:news>
  </url>

`;
  });

  // Add currency conversion pages
  currencyPairs.forEach(pair => {
    sitemapContent += `  <url>
    <loc>https://currencytocurrency.app/convert/${pair}</loc>
    <lastmod>2025-01-30</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://currencytocurrency.app/convert/${pair}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://currencytocurrency.app/convert/${pair}" />
  </url>

`;
  });

  sitemapContent += `</urlset>`;

  // Write the main sitemap
  fs.writeFileSync('public/sitemap.xml', sitemapContent);

  // Create a separate blog sitemap
  let blogSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Blog main page -->
  <url>
    <loc>https://currencytocurrency.app/blog</loc>
    <lastmod>2025-01-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://currencytocurrency.app/blog" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://currencytocurrency.app/blog" />
  </url>

  <!-- Blog posts -->
`;

  blogPosts.forEach(post => {
    const priority = post.featured ? '0.9' : '0.8';
    
    blogSitemapContent += `  <url>
    <loc>https://currencytocurrency.app/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://currencytocurrency.app/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://currencytocurrency.app/blog/${post.slug}" />
    <news:news>
      <news:publication>
        <news:name>Currency to Currency</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${post.date}</news:publication_date>
      <news:title>${post.title}</news:title>
    </news:news>
  </url>

`;
  });

  blogSitemapContent += `</urlset>`;
  fs.writeFileSync('public/sitemap-blog.xml', blogSitemapContent);

  // Create sitemap index
  const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://currencytocurrency.app/sitemap.xml</loc>
    <lastmod>2025-01-30</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://currencytocurrency.app/sitemap-blog.xml</loc>
    <lastmod>2025-01-30</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://currencytocurrency.app/sitemap-images.xml</loc>
    <lastmod>2025-01-30</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync('public/sitemap-index.xml', sitemapIndexContent);

  console.log('✅ Generated dynamic sitemaps:');
  console.log(`   - Main sitemap: ${staticPages.length + currencyPairs.length} static pages`);
  console.log(`   - Blog sitemap: ${blogPosts.length} blog posts`);
  console.log(`   - Total URLs: ${staticPages.length + currencyPairs.length + blogPosts.length}`);
  console.log('   - Sitemap index created');
  
  // Log sample blog posts for verification
  if (blogPosts.length > 0) {
    console.log('\nSample blog posts in sitemap:');
    blogPosts.slice(0, 5).forEach(post => {
      console.log(`   - ${post.slug} (${post.date}) ${post.featured ? '[FEATURED]' : ''}`);
    });
  }
}

// Run the generator
if (require.main === module) {
  generateSitemaps();
}

module.exports = { generateSitemaps, getAllBlogPosts };
