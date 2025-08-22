#!/usr/bin/env node
/*
  Gap-filling generator:
  - Scans existing markdown in src/content/blog and src/content/pages
  - Reads research notes in project root (e.g. keyword_research_findings.md, competitive_research_findings.md)
  - Identifies topic gaps based on simple heuristics
  - Writes one new markdown draft per run with frontmatter
*/
const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '..', 'src', 'content', 'blog');
const RESEARCH_FILES = [
  'keyword_research_findings.md',
  'competitive_research_findings.md',
  'fx_broker_research.md',
  'forex_brokers_restructured.md',
  'FOREX_BROKER_REVIEW_SUMMARY.md'
].map(p => path.resolve(__dirname, '..', p));

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function existingSlugs() {
  ensureDir(BLOG_DIR);
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

function extractKeywords(text) {
  const words = text.toLowerCase().match(/[a-z0-9\-]{3,}/g) || [];
  const stop = new Set(['the','and','for','with','you','are','this','that','from','have','has','will','your','about','into','into','use','using','when','how','what','why','can','not','all','our','their','them','they','was','were','but','per','min','max','guide','best','top','vs','review','2025','currency','forex','trading','exchange','rate','rates']);
  const freq = new Map();
  for (const w of words) {
    if (stop.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return [...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0, 300).map(([k])=>k);
}

function readExistingContentCorpus() {
  const blogText = existingSlugs().map(slug => readFileSafe(path.join(BLOG_DIR, slug + '.md'))).join('\n');
  const researchText = RESEARCH_FILES.map(readFileSafe).join('\n');
  return { blogText, researchText };
}

function findGaps() {
  const { blogText, researchText } = readExistingContentCorpus();
  const have = new Set(extractKeywords(blogText));
  const wantList = extractKeywords(researchText);
  const gaps = wantList.filter(k => !have.has(k));
  // Group simple multi-word candidates from research
  const multi = researchText.match(/([A-Za-z][A-Za-z\-]+\s+[A-Za-z0-9][A-Za-z0-9\-]+(?:\s+[A-Za-z0-9\-]+){0,3})/g) || [];
  const cleanedMulti = multi
    .map(s => s.trim().toLowerCase())
    .filter(s => s.split(' ').length >= 2 && s.length <= 60)
    .filter(s => !s.match(/^(the|and|for|with|how|what|why|can|not)\b/));
  const multiScore = new Map();
  for (const phrase of cleanedMulti) {
    const terms = phrase.split(/\s+/);
    const score = terms.reduce((acc,t)=>acc + (gaps.includes(t) ? 2 : 0.5), 0);
    if (score > 2) multiScore.set(phrase, (multiScore.get(phrase)||0) + score);
  }
  const ranked = [...multiScore.entries()].sort((a,b)=>b[1]-a[1]);
  // Deduplicate by existing slugs
  const slugs = new Set(existingSlugs());
  const pick = ranked.find(([phrase]) => !slugs.has(slugify(phrase)));
  if (pick) return pick[0];
  // Fallback to top single-word gap not present as slug
  const singlePick = gaps.find(k => !slugs.has(slugify(k)));
  return singlePick || 'forex strategy insights';
}

function titleCase(s){
  return s.replace(/\b([a-z])/g, (m,c)=>c.toUpperCase()).replace(/\bAi\b/g,'AI');
}

function slugify(s){
  return s.toLowerCase().replace(/[^a-z0-9\s\-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');
}

function estimateReadTime(text){
  const words = (text.match(/\w+/g) || []).length;
  const minutes = Math.max(3, Math.round(words / 220));
  return `${minutes} min read`;
}

function trimTo(str, max){
  return str.length > max ? str.slice(0, max - 1).trimEnd() + '…' : str;
}

function generateFromChecklist(topic){
  const date = new Date().toISOString().split('T')[0];
  const rawTitle = titleCase(`${topic} — 2025 Guide with Practical Steps`);
  const title = trimTo(rawTitle, 65);
  const slug = `${date}-${slugify(topic)}`;
  const primaryKeyword = topic;
  const secondary = [
    `${topic} tips`,
    `${topic} strategy`,
    `${topic} for beginners`
  ];
  const metaRaw = `Actionable ${topic} guide for 2025 with steps, examples, visuals, and next steps.`;
  const meta = trimTo(metaRaw, 160);

  const body = `# ${title}

> Educates better than the top results and gives you practical next steps.

> Primary keyword: ${primaryKeyword}. Secondary: ${secondary.join(', ')}.

## Who Is This For
- Traveler, investor, or small business evaluating ${topic}

## Introduction
Hook the reader in 2–3 sentences by addressing a concrete pain point and promising a clear benefit. Include the primary keyword naturally in the first 100 words.

## Key Takeaways
- Clear steps, tables, and internal resources
- Focus on reducing fees and risk

## What Is ${titleCase(topic)}
Explain simply in 2–3 short paragraphs. Link to an internal primer if available.

## Step-by-Step Implementation
1. Define goal and constraints
2. Choose the right tools or accounts
3. Execute with a checklist

## Comparison Table
| Option | Pros | Cons | Best For |
|---|---|---|---|
| A |  |  |  |
| B |  |  |  |

## Costs and Risks
- Fees, slippage, regulation, counterparty

## Pro Tips
- Short, experience-based insights

## Visuals & Media
Add at least one custom image with descriptive alt text:
![${titleCase(topic)} visual showing key steps](/images/uploads/${slug}.jpg)
Consider adding a chart or infographic summarizing key decisions.

## Links for Depth and Credibility
- Internal: [Currency Converter](/), [Rate Alerts](/alerts)
- External: [Investopedia](https://www.investopedia.com/) reference for key term clarification

## Next Steps
- Try our converter and set a rate alert
- Read related posts listed below
 
## Conclusion
Summarize the problem → solution and invite the reader to take action (subscribe, try a tool, or read a related guide).

---
Related posts: add 2–3 internal links here after publishing.
`;

  const frontmatter = `---
title: "${title}"
slug: "${slug}"
date: "${date}"
image: "/images/uploads/${slug}.jpg"
readTime: "${estimateReadTime(body)}"
category: "Guides"
featured: false
tags: ["${primaryKeyword}", "${secondary[0]}", "${secondary[1]}"]
metaDescription: "${meta}"
excerpt: "${trimTo(meta, 155)}"
---
`;

  return frontmatter + '\n' + body.trim() + '\n';
}

function main(){
  ensureDir(BLOG_DIR);
  const topic = findGaps();
  const content = generateFromChecklist(topic);
  const match = content.match(/slug:\s*"([^"]+)"/);
  const slug = match ? match[1] : slugify(topic);
  const target = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(target)) {
    console.log('Already generated today or slug exists, skipping:', target);
    return;
  }
  fs.writeFileSync(target, content, 'utf8');
  console.log('Generated:', target);
}

main();


