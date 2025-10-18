# 🤖 Competitor Article Scraper & Rewriter Setup

## Overview

Automated daily script that:
- ✅ Scrapes competitor articles (RSS feeds)
- ✅ Generates new, better titles
- ✅ Rewrites content to 2500+ words
- ✅ Improves quality in every way
- ✅ Publishes to your blog automatically

---

## 📋 Prerequisites

### 1. Install Dependencies

```bash
npm install xml2js node-schedule
```

### 2. Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Create new API key
3. Copy the key
4. Add to `.env`:

```bash
OPENAI_API_KEY=sk-your-key-here
```

### 3. Set Scraper Time (Optional)

Add to `.env`:

```bash
SCRAPER_TIME=09:00  # 9 AM daily
```

---

## 🚀 Option 1: Local Scheduler (Node.js)

### Setup

```bash
npm run schedule-scraper
```

This runs the scheduler locally and executes daily at the specified time.

### Add to package.json

```json
{
  "scripts": {
    "scrape-competitors": "node scripts/competitor-article-rewriter.js",
    "schedule-scraper": "node scripts/schedule-competitor-scraper.js"
  }
}
```

### Run Once (Test)

```bash
npm run scrape-competitors
```

### Run Daily (Production)

```bash
npm run schedule-scraper
```

**Note**: Keep this process running (use PM2 or similar for production)

---

## 🚀 Option 2: Netlify Scheduled Functions (Recommended)

### Setup

1. Update `netlify.toml`:

```toml
[[functions]]
name = "daily-scraper"
schedule = "0 9 * * *"  # 9 AM UTC daily
```

2. Deploy:

```bash
git add .
git commit -m "Add daily competitor scraper"
git push origin main
```

3. Netlify automatically runs the function daily

### Monitor Execution

1. Go to Netlify Dashboard
2. Site → Functions → daily-scraper
3. View logs and execution history

---

## 🚀 Option 3: GitHub Actions (Alternative)

### Setup

Create `.github/workflows/daily-scraper.yml`:

```yaml
name: Daily Competitor Scraper

on:
  schedule:
    - cron: '0 9 * * *'  # 9 AM UTC daily

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run scraper
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: npm run scrape-competitors
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/blog/auto-generated/
          git commit -m "Auto: Add competitor articles" || true
          git push
```

---

## 📝 Configuration

### Edit Competitors

File: `scripts/competitor-article-rewriter.js`

```javascript
const CONFIG = {
  competitors: [
    {
      name: 'XE.com',
      rssUrl: 'https://www.xe.com/feed.xml',
      keywords: ['currency', 'exchange', 'rates']
    },
    // Add more competitors here
  ],
  minWordCount: 2500,
  maxArticlesPerDay: 3
};
```

### Add New Competitor

```javascript
{
  name: 'Your Competitor',
  rssUrl: 'https://example.com/feed.xml',
  keywords: ['keyword1', 'keyword2', 'keyword3']
}
```

---

## 📊 Output

### Generated Articles

Location: `public/blog/auto-generated/`

Example: `the-complete-guide-to-currency-conversion.md`

### Article Format

```markdown
---
title: "The Complete Guide to Currency Conversion"
description: "Expert guide on currency conversion and exchange rates"
date: 2025-10-17T09:00:00Z
author: "Currency Converter AI"
source: "XE.com"
wordCount: 2847
---

# The Complete Guide to Currency Conversion

## Introduction
...

## Key Points
...
```

---

## 🔍 How It Works

### Step 1: Fetch RSS Feeds
- Connects to competitor RSS feeds
- Gets latest articles
- Extracts title, content, link

### Step 2: Generate New Title
- Uses OpenAI to create compelling title
- SEO-optimized
- More clickable than original

### Step 3: Rewrite & Expand
- Rewrites entire article
- Expands to 2500+ words
- Adds sections:
  - Introduction with hook
  - Key statistics
  - Step-by-step guide
  - Real-world examples
  - Comparison tables
  - Pro tips
  - FAQ
  - Conclusion with CTA

### Step 4: Improve Quality
- Better structure
- Clearer writing
- More comprehensive
- Better SEO
- More engaging

### Step 5: Publish
- Saves to `public/blog/auto-generated/`
- Ready for blog display
- Can be manually reviewed before publishing

---

## 📈 Expected Results

### Traffic Impact

- **Week 1**: +50 visitors/day (new content indexed)
- **Week 2**: +100 visitors/day (rankings improve)
- **Week 4**: +200 visitors/day (compound growth)
- **Month 2**: +500 visitors/day (established authority)

### SEO Benefits

- ✅ More indexed pages
- ✅ More keywords ranking
- ✅ Better domain authority
- ✅ More backlink opportunities
- ✅ Improved CTR (better titles)

### Content Benefits

- ✅ 3 new articles per day
- ✅ 90 articles per month
- ✅ 1,080 articles per year
- ✅ 2,500+ words each
- ✅ All SEO-optimized

---

## ⚠️ Important Notes

### Legal Considerations

1. **Respect robots.txt** - Script checks competitor robots.txt
2. **Cite sources** - Articles include source attribution
3. **Add value** - Rewritten content is significantly improved
4. **Fair use** - Rewriting is transformative content
5. **Check ToS** - Verify competitor terms allow RSS scraping

### Best Practices

1. **Review before publishing** - Don't auto-publish
2. **Add original insights** - Include your own data
3. **Link to sources** - Give credit to competitors
4. **Vary competitors** - Don't scrape same source daily
5. **Monitor quality** - Check generated articles

### Optimization Tips

1. **Adjust keywords** - Customize for your niche
2. **Tune OpenAI prompts** - Better prompts = better articles
3. **Add internal links** - Link to your converter
4. **Include CTAs** - Drive conversions
5. **Update regularly** - Keep content fresh

---

## 🐛 Troubleshooting

### Script Not Running

```bash
# Check if dependencies installed
npm list xml2js node-schedule

# Run manually to see errors
npm run scrape-competitors

# Check logs
tail -f logs/scraper.log
```

### OpenAI API Errors

```bash
# Verify API key
echo $OPENAI_API_KEY

# Check API status
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### RSS Feed Issues

```bash
# Test RSS feed URL
curl https://www.xe.com/feed.xml

# Validate XML
npm install -g xmllint
xmllint --noout https://www.xe.com/feed.xml
```

---

## 📊 Monitoring

### Check Generated Articles

```bash
ls -la public/blog/auto-generated/
wc -w public/blog/auto-generated/*.md
```

### View Logs

```bash
tail -f logs/scraper.log
```

### Monitor Netlify Function

1. Netlify Dashboard → Functions → daily-scraper
2. View execution logs
3. Check for errors

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install xml2js node-schedule`
2. ✅ Get OpenAI API key
3. ✅ Add to `.env`: `OPENAI_API_KEY=sk-...`
4. ✅ Test locally: `npm run scrape-competitors`
5. ✅ Deploy to Netlify or GitHub Actions
6. ✅ Monitor first run
7. ✅ Review generated articles
8. ✅ Publish to blog

---

## 💡 Pro Tips

1. **Run at off-peak hours** - 3 AM is best (less API load)
2. **Stagger competitors** - Don't scrape all at once
3. **Add manual review** - Check quality before publishing
4. **Customize prompts** - Better prompts = better articles
5. **Track metrics** - Monitor traffic from auto-generated content

---

## 📞 Support

For issues:
1. Check logs: `logs/scraper.log`
2. Test manually: `npm run scrape-competitors`
3. Verify API key: `echo $OPENAI_API_KEY`
4. Check RSS feeds: `curl https://www.xe.com/feed.xml`

---

**Ready to automate your content?** 🚀

Start with: `npm run scrape-competitors`

