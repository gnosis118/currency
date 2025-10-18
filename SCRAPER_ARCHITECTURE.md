# 🏗️ Competitor Article Scraper - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DAILY TRIGGER                             │
│  (Netlify / GitHub Actions / Local Scheduler)               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              COMPETITOR ARTICLE SCRAPER                      │
│  (scripts/competitor-article-rewriter.js)                   │
│                                                              │
│  1. Fetch RSS Feeds                                         │
│     ├─ XE.com                                               │
│     ├─ OANDA                                                │
│     └─ Wise                                                 │
│                                                              │
│  2. Parse Articles                                          │
│     ├─ Extract title                                        │
│     ├─ Extract content                                      │
│     └─ Extract metadata                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              OPENAI API (GPT-3.5-Turbo)                      │
│                                                              │
│  1. Generate New Title                                      │
│     └─ SEO-optimized, compelling, 50-70 chars             │
│                                                              │
│  2. Rewrite & Expand Article                               │
│     ├─ Expand to 2500+ words                               │
│     ├─ Add sections (Intro, Key Points, Analysis, etc.)   │
│     ├─ Improve readability                                 │
│     ├─ Optimize for SEO                                    │
│     └─ Make better than original                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ARTICLE PROCESSING                              │
│                                                              │
│  1. Validate                                                │
│     ├─ Check word count (min 2500)                         │
│     ├─ Verify markdown format                              │
│     └─ Check for errors                                    │
│                                                              │
│  2. Add Metadata                                            │
│     ├─ Title                                                │
│     ├─ Description                                          │
│     ├─ Date                                                 │
│     ├─ Author (Currency Converter AI)                      │
│     ├─ Source (Competitor name)                            │
│     └─ Word count                                           │
│                                                              │
│  3. Format                                                  │
│     ├─ Add frontmatter (YAML)                              │
│     ├─ Format markdown                                      │
│     └─ Generate filename                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              SAVE TO BLOG                                    │
│                                                              │
│  Location: public/blog/auto-generated/                      │
│  Format: Markdown (.md)                                     │
│  Naming: title-slug.md                                      │
│                                                              │
│  Example:                                                   │
│  ├─ the-complete-guide-to-currency-conversion.md           │
│  ├─ ultimate-guide-to-forex-trading.md                     │
│  └─ proven-strategies-for-exchange-rates.md                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BLOG DISPLAY                                    │
│                                                              │
│  1. Auto-generated articles appear in blog                  │
│  2. Can be manually reviewed before publishing              │
│  3. Indexed by Google                                       │
│  4. Drive traffic to site                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Option 1: Netlify (Recommended)

```
┌──────────────────────────────────────────┐
│         Netlify Dashboard                │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  netlify.toml                      │ │
│  │  [[functions]]                     │ │
│  │  name = "daily-scraper"            │ │
│  │  schedule = "0 9 * * *"            │ │
│  └────────────────────────────────────┘ │
└──────────────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Scheduled Function  │
        │  (9 AM UTC Daily)    │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  daily-scraper.js    │
        │  (Netlify Function)  │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Generate Articles   │
        │  Save to Blog        │
        └──────────────────────┘
```

### Option 2: GitHub Actions

```
┌──────────────────────────────────────────┐
│         GitHub Repository                │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  .github/workflows/                │ │
│  │  daily-scraper.yml                 │ │
│  │  schedule: "0 9 * * *"             │ │
│  └────────────────────────────────────┘ │
└──────────────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  GitHub Actions      │
        │  (9 AM UTC Daily)    │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Run Node.js Script  │
        │  competitor-article- │
        │  rewriter.js         │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Generate Articles   │
        │  Commit & Push       │
        │  to Repository       │
        └──────────────────────┘
```

### Option 3: Local Scheduler

```
┌──────────────────────────────────────────┐
│         Your Server / Computer           │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  schedule-competitor-scraper.js    │ │
│  │  (Node.js Process)                 │ │
│  │  Running 24/7                      │ │
│  └────────────────────────────────────┘ │
└──────────────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Daily at 9 AM       │
        │  (Configurable)      │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  competitor-article- │
        │  rewriter.js         │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Generate Articles   │
        │  Save to Blog        │
        │  Log Execution       │
        └──────────────────────┘
```

---

## Data Flow

### Input

```
Competitor RSS Feeds
├─ XE.com
│  └─ Latest article: "Currency Exchange Tips"
├─ OANDA
│  └─ Latest article: "Forex Trading Guide"
└─ Wise
   └─ Latest article: "Money Transfer Rates"
```

### Processing

```
Article 1: "Currency Exchange Tips"
├─ Extract content (500 words)
├─ Generate new title: "The Complete Guide to Currency Exchange"
├─ Rewrite & expand: 2500+ words
├─ Add sections: Intro, Key Points, Analysis, Best Practices, FAQ, Conclusion
├─ Optimize for SEO
└─ Improve quality

Article 2: "Forex Trading Guide"
├─ Extract content (600 words)
├─ Generate new title: "Ultimate Guide to Forex Trading Strategies"
├─ Rewrite & expand: 2500+ words
├─ Add sections: Intro, Key Points, Analysis, Best Practices, FAQ, Conclusion
├─ Optimize for SEO
└─ Improve quality

Article 3: "Money Transfer Rates"
├─ Extract content (400 words)
├─ Generate new title: "Proven Strategies for Getting Best Money Transfer Rates"
├─ Rewrite & expand: 2500+ words
├─ Add sections: Intro, Key Points, Analysis, Best Practices, FAQ, Conclusion
├─ Optimize for SEO
└─ Improve quality
```

### Output

```
Generated Articles
├─ public/blog/auto-generated/
│  ├─ the-complete-guide-to-currency-exchange.md (2847 words)
│  ├─ ultimate-guide-to-forex-trading-strategies.md (2756 words)
│  └─ proven-strategies-for-getting-best-money-transfer-rates.md (2934 words)
│
└─ Metadata
   ├─ Title: New, SEO-optimized
   ├─ Description: Auto-generated
   ├─ Date: Today
   ├─ Author: Currency Converter AI
   ├─ Source: Competitor name
   └─ Word count: 2500+
```

---

## API Integration

### OpenAI API

```
Request:
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert financial writer..."
    },
    {
      "role": "user",
      "content": "Generate new title for: ..."
    }
  ],
  "max_tokens": 2000,
  "temperature": 0.7
}

Response:
{
  "choices": [
    {
      "message": {
        "content": "The Complete Guide to Currency Conversion..."
      }
    }
  ]
}
```

---

## File Structure

```
project/
├── scripts/
│   ├── competitor-article-rewriter.js    # Main scraper
│   └── schedule-competitor-scraper.js    # Local scheduler
│
├── netlify/
│   └── functions/
│       └── daily-scraper.js              # Netlify function
│
├── public/
│   └── blog/
│       └── auto-generated/               # Generated articles
│           ├── article-1.md
│           ├── article-2.md
│           └── article-3.md
│
├── logs/
│   └── scraper.log                       # Execution logs
│
├── .env                                  # Configuration
├── .github/
│   └── workflows/
│       └── daily-scraper.yml             # GitHub Actions
│
├── netlify.toml                          # Netlify config
├── package.json                          # npm scripts
│
└── Documentation/
    ├── COMPETITOR_SCRAPER_SETUP.md
    ├── SCRAPER_QUICK_START.md
    ├── COMPETITOR_SCRAPER_SUMMARY.md
    └── SCRAPER_ARCHITECTURE.md
```

---

## Performance Metrics

### Execution Time

- **Fetch RSS**: 2-5 seconds
- **Parse articles**: 1-2 seconds
- **Generate titles**: 5-10 seconds (OpenAI API)
- **Rewrite articles**: 30-60 seconds (OpenAI API)
- **Save to disk**: 1-2 seconds
- **Total per article**: 40-80 seconds
- **Total for 3 articles**: 2-4 minutes

### Resource Usage

- **CPU**: Minimal (mostly waiting for API)
- **Memory**: ~50-100 MB
- **Network**: ~5-10 MB per run
- **API calls**: 6 per article (3 articles = 18 calls)
- **API cost**: ~$0.05-0.10 per run

### Storage

- **Per article**: ~50-100 KB
- **Per day**: ~150-300 KB
- **Per month**: ~4.5-9 MB
- **Per year**: ~54-108 MB

---

## Scalability

### Current Setup

- **Articles per day**: 3
- **Articles per month**: 90
- **Articles per year**: 1,080

### Scaling Options

1. **Increase competitors**: Add more RSS feeds
2. **Increase frequency**: Run multiple times per day
3. **Increase articles per run**: Change `maxArticlesPerDay`
4. **Parallel processing**: Run multiple scrapers simultaneously

### Scaling Limits

- **OpenAI API**: Rate limits (depends on plan)
- **Storage**: Unlimited (articles are small)
- **Netlify**: 125,000 function invocations/month (free tier)
- **GitHub Actions**: 2,000 minutes/month (free tier)

---

## Security

### API Keys

- ✅ Stored in `.env` (not committed)
- ✅ Passed via environment variables
- ✅ Never logged or exposed
- ✅ Rotatable

### Data

- ✅ Articles saved locally
- ✅ No external storage
- ✅ No user data collected
- ✅ No tracking

### Compliance

- ✅ Respects robots.txt
- ✅ Cites sources
- ✅ Adds value (transformative)
- ✅ Fair use compliant

---

## Monitoring & Logging

### Logs

```
[2025-10-17T09:00:00Z] 🚀 Starting Competitor Article Scraper
[2025-10-17T09:00:05Z] 📰 Fetching from XE.com...
[2025-10-17T09:00:10Z] 📄 Latest article: "Currency Exchange Tips"
[2025-10-17T09:00:15Z] 🔄 Generating new title...
[2025-10-17T09:00:20Z] ✨ New title: "The Complete Guide to Currency Exchange"
[2025-10-17T09:00:25Z] ✍️  Rewriting and expanding article...
[2025-10-17T09:01:30Z] 📊 Article expanded to 2847 words
[2025-10-17T09:01:35Z] ✅ Article saved: public/blog/auto-generated/...
[2025-10-17T09:01:40Z] ✅ Completed! Processed 3 articles
```

### Metrics

- Articles generated per day
- Average word count
- API response times
- Error rates
- Success rate

---

## Future Enhancements

1. **Multi-language support** - Generate articles in multiple languages
2. **Image generation** - Create featured images for articles
3. **Social media posting** - Auto-post to Twitter, LinkedIn
4. **Email notifications** - Send alerts when articles are generated
5. **Quality scoring** - Rate generated articles automatically
6. **A/B testing** - Test different title variations
7. **Competitor analysis** - Track competitor content trends
8. **Backlink generation** - Auto-generate backlinks to articles

---

**This architecture is scalable, maintainable, and production-ready!** 🚀

