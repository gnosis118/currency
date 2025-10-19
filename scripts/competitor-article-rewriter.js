#!/usr/bin/env node

/**
 * Competitor Article Scraper & Rewriter
 *
 * Daily automation script that:
 * 1. Scrapes competitor articles (RSS feeds)
 * 2. Rewrites with new titles
 * 3. Expands to 2500+ words
 * 4. Improves content quality
 * 5. Publishes to blog
 *
 * Usage: node scripts/competitor-article-rewriter.js
 * Or: npm run scrape-competitors
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  competitors: [
    {
      name: 'XE.com',
      rssUrl: 'https://www.xe.com/feed.xml',
      keywords: ['currency', 'exchange', 'rates']
    },
    {
      name: 'OANDA',
      rssUrl: 'https://www.oanda.com/feed.xml',
      keywords: ['forex', 'currency', 'trading']
    },
    {
      name: 'Wise',
      rssUrl: 'https://wise.com/feed.xml',
      keywords: ['money transfer', 'exchange rates', 'currency']
    }
  ],
  openaiApiKey: process.env.OPENAI_API_KEY,
  outputDir: path.join(__dirname, '../public/blog/auto-generated'),
  minWordCount: 2500,
  maxArticlesPerDay: 3
};

/**
 * Fetch RSS feed from competitor
 */
async function fetchRSSFeed(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

/**
 * Parse RSS feed XML
 */
async function parseRSSFeed(xmlData) {
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlData);
  
  const items = result.rss?.channel?.[0]?.item || [];
  return items.map(item => ({
    title: item.title?.[0] || 'Untitled',
    description: item.description?.[0] || '',
    link: item.link?.[0] || '',
    pubDate: item.pubDate?.[0] || new Date().toISOString(),
    content: item['content:encoded']?.[0] || item.description?.[0] || ''
  }));
}

/**
 * Fetch article content from URL
 */
async function fetchArticleContent(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Extract text content (basic HTML stripping)
        const text = data
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        resolve(text);
      });
    }).on('error', reject);
  });
}

/**
 * Generate new title using OpenAI
 */
async function generateNewTitle(originalTitle, content) {
  if (!CONFIG.openaiApiKey) {
    console.warn('⚠️  OpenAI API key not set. Using fallback title generation.');
    return generateFallbackTitle(originalTitle);
  }

  const prompt = `Given this article title: "${originalTitle}"
  
Generate 5 alternative, more compelling titles that:
- Are SEO-optimized for currency conversion
- Include power words (Best, Complete, Ultimate, Proven, etc.)
- Are 50-70 characters
- Would attract more clicks

Return ONLY the titles, one per line, no numbering.`;

  try {
    const response = await callOpenAI(prompt);
    const titles = response.split('\n').filter(t => t.trim());
    return titles[0] || generateFallbackTitle(originalTitle);
  } catch (error) {
    console.error('Error generating title:', error);
    return generateFallbackTitle(originalTitle);
  }
}

/**
 * Fallback title generation (no API)
 */
function generateFallbackTitle(originalTitle) {
  const prefixes = [
    'The Complete Guide to',
    'Ultimate Guide to',
    'Proven Strategies for',
    'Expert Tips on',
    'How to Master',
    'The Best Way to',
    'Advanced Techniques for'
  ];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix} ${originalTitle}`;
}

/**
 * Rewrite and expand article content
 */
async function rewriteArticle(originalContent, originalTitle, newTitle) {
  if (!CONFIG.openaiApiKey) {
    console.warn('⚠️  OpenAI API key not set. Using basic expansion.');
    return expandArticleBasic(originalContent, newTitle);
  }

  const wordCount = originalContent.split(/\s+/).length;
  const expandBy = Math.max(2500 - wordCount, 500);

  const prompt = `You are an expert financial writer specializing in currency conversion and forex.

Original article title: "${originalTitle}"
New title: "${newTitle}"

Original content (${wordCount} words):
${originalContent.substring(0, 2000)}...

Task:
1. Rewrite the article with the new title
2. Expand to at least 2500 words
3. Add these sections if missing:
   - Introduction with hook
   - Key statistics and data
   - Step-by-step guide
   - Real-world examples
   - Comparison tables
   - Pro tips and best practices
   - FAQ section
   - Conclusion with CTA
4. Improve readability with:
   - Short paragraphs (2-3 sentences max)
   - Subheadings every 150 words
   - Bullet points for lists
   - Bold key terms
5. Optimize for SEO:
   - Include keywords naturally
   - Use H2 and H3 subheadings
   - Add internal link suggestions [INTERNAL_LINK: topic]
6. Make it better than the original in every way

Return the complete article in markdown format.`;

  try {
    const response = await callOpenAI(prompt, 4000);
    return response;
  } catch (error) {
    console.error('Error rewriting article:', error);
    return expandArticleBasic(originalContent, newTitle);
  }
}

/**
 * Basic article expansion (no API)
 */
function expandArticleBasic(content, title) {
  const sections = [
    `# ${title}\n\n`,
    `## Introduction\n${content.substring(0, 500)}\n\n`,
    `## Key Points\n- Point 1\n- Point 2\n- Point 3\n\n`,
    `## Detailed Analysis\n${content.substring(500, 1500)}\n\n`,
    `## Best Practices\n- Practice 1\n- Practice 2\n- Practice 3\n\n`,
    `## Conclusion\n${content.substring(1500)}\n\n`,
    `## FAQ\n**Q: What is this about?**\nA: This article covers important information about currency conversion.\n\n`
  ];

  return sections.join('');
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt, maxTokens = 2000) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert financial writer specializing in currency conversion, forex, and international money transfer.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${CONFIG.openaiApiKey}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', chunk => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          const content = parsed.choices?.[0]?.message?.content || '';
          resolve(content);
        } catch (error) {
          reject(new Error(`Failed to parse OpenAI response: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Save article to file
 */
async function saveArticle(title, content, competitor) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // Generate filename from title
  const filename = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  const filepath = path.join(CONFIG.outputDir, `${filename}.md`);

  // Add frontmatter
  const frontmatter = `---
title: "${title}"
description: "Expert guide on currency conversion and exchange rates"
date: ${new Date().toISOString()}
author: "Currency Converter AI"
source: "${competitor}"
wordCount: ${content.split(/\s+/).length}
---

`;

  const fullContent = frontmatter + content;

  fs.writeFileSync(filepath, fullContent);
  console.log(`✅ Article saved: ${filepath}`);

  return filepath;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Competitor Article Scraper & Rewriter');
  console.log(`📅 ${new Date().toISOString()}\n`);

  let articlesProcessed = 0;

  for (const competitor of CONFIG.competitors) {
    if (articlesProcessed >= CONFIG.maxArticlesPerDay) {
      console.log(`⏹️  Reached max articles per day (${CONFIG.maxArticlesPerDay})`);
      break;
    }

    try {
      console.log(`\n📰 Fetching from ${competitor.name}...`);
      
      // Fetch RSS feed
      const rssData = await fetchRSSFeed(competitor.rssUrl);
      const articles = await parseRSSFeed(rssData);

      if (articles.length === 0) {
        console.log(`⚠️  No articles found from ${competitor.name}`);
        continue;
      }

      // Get most recent article
      const latestArticle = articles[0];
      console.log(`📄 Latest article: "${latestArticle.title}"`);

      // Generate new title
      console.log('🔄 Generating new title...');
      const newTitle = await generateNewTitle(latestArticle.title, latestArticle.content);
      console.log(`✨ New title: "${newTitle}"`);

      // Rewrite and expand article
      console.log('✍️  Rewriting and expanding article...');
      const rewrittenContent = await rewriteArticle(
        latestArticle.content,
        latestArticle.title,
        newTitle
      );

      // Verify word count
      const wordCount = rewrittenContent.split(/\s+/).length;
      if (wordCount < CONFIG.minWordCount) {
        console.warn(`⚠️  Article only ${wordCount} words (target: ${CONFIG.minWordCount})`);
      } else {
        console.log(`📊 Article expanded to ${wordCount} words`);
      }

      // Save article
      await saveArticle(newTitle, rewrittenContent, competitor.name);

      articlesProcessed++;

    } catch (error) {
      console.error(`❌ Error processing ${competitor.name}:`, error.message);
    }
  }

  console.log(`\n✅ Completed! Processed ${articlesProcessed} articles`);
}

// Run if executed directly
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { main, fetchRSSFeed, parseRSSFeed, rewriteArticle };

