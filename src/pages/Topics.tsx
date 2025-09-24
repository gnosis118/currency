import { Link } from 'react-router-dom';
import EnhancedSEOHead from '@/components/EnhancedSEOHead';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadAllBlogPosts } from '@/data/mdBlog';

const sections = [
  {
    slug: 'fx-hedging',
    title: 'FX Hedging',
    description:
      'Understand forwards, options, and practical hedging frameworks for SMEs. Actionable guidance to lock in rates and protect margins.',
    match: (p: any) =>
      /forward|hedg|option|derivative|exposure|risk/i.test(p.title + ' ' + (p.excerpt || '')),
  },
  {
    slug: 'international-transfers',
    title: 'International Transfers',
    description:
      'Fees, speed, corridors, and best practices to send and receive money across borders efficiently.',
    match: (p: any) => /transfer|remittance|send money|wire|swift/i.test(p.title + ' ' + (p.excerpt || '')),
  },
  {
    slug: 'apps-and-tools',
    title: 'Apps & Tools',
    description:
      'Reviews and comparisons of currency apps, platforms, and calculators to get more done.',
    match: (p: any) => /app|tool|software|platform|compare|review/i.test(p.title + ' ' + (p.excerpt || '')),
  },
  {
    slug: 'sme-treasury',
    title: 'SME Treasury',
    description:
      'Policies, governance, reporting, and bank relationship playbooks for small and mid‑size teams.',
    match: (p: any) => /treasury|policy|governance|board|committee|controls|accounting|audit/i.test(p.title + ' ' + (p.excerpt || '')),
  },
  {
    slug: 'travel-money',
    title: 'Travel Money',
    description:
      'Practical exchange tips, card usage, and budgeting for travelers by destination.',
    match: (p: any) => /travel|trip|abroad|vacation|tour|airport|budget/i.test(p.title + ' ' + (p.excerpt || '')),
  },
  {
    slug: 'trading-basics',
    title: 'Trading Basics',
    description:
      'Foundations of FX markets, rates, and terminology explained simply.',
    match: (p: any) => /basics|beginner|guide|what is|explained|definition|glossary|rate/i.test(p.title + ' ' + (p.excerpt || '')),
  },
];

export default function Topics() {
  const posts = loadAllBlogPosts();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Currency to Currency Topic Hubs',
    url: 'https://currencytocurrency.app/topics',
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <EnhancedSEOHead
        title="FX Topic Hubs: Hedging, Transfers, Apps, SME Treasury | Currency to Currency"
        description="Explore curated hubs that organize 40+ articles into FX Hedging, International Transfers, Apps & Tools, SME Treasury, Travel Money, and Trading Basics."
        canonicalUrl="https://currencytocurrency.app/topics"
        structuredData={structuredData}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <BreadcrumbNav className="mb-4" />
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Topic Hubs</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We’ve grouped our content into focused hubs to help you dive deep into the subject you care about. Each hub
            features a short primer and hand‑picked articles.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {sections.map((sec) => {
            const list = posts.filter(sec.match).slice(0, 6);
            return (
              <Card key={sec.slug} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{sec.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{sec.description}</p>
                  {list.length ? (
                    <ul className="list-disc ml-5 space-y-2">
                      {list.map((p: any) => (
                        <li key={p.slug}>
                          <Link className="text-primary hover:underline" to={`/blog/${p.slug}`}>
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">New hub—articles coming soon.</p>
                  )}
                  <div className="mt-4 text-sm">
                    <Link to="/blog" className="text-primary hover:underline">
                      See all articles →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

