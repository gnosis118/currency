import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Shield, TrendingUp, Users, Award, ExternalLink } from 'lucide-react';

const Brokers = () => {
  const brokers = [
    {
      id: 1,
      name: 'IG Group',
      rating: 4.8,
      stars: 5,
      category: 'Overall Excellence',
      regulation: 'FCA, ASIC, CFTC',
      minDeposit: '$0',
      spreads: 'From 0.6 pips',
      leverage: '30:1',
      platforms: 'Proprietary, MT4',
      pros: ['Exceptional regulation', 'Award-winning platform', 'Extensive markets', 'Outstanding support'],
      cons: ['Higher spreads on some pairs', 'Inactivity fees'],
      description: 'Industry leader with nearly 50 years of operation and exceptional regulatory oversight.',
      trustScore: 99,
      founded: 1974,
      website: 'https://www.ig.com'
    },
    {
      id: 2,
      name: 'Interactive Brokers',
      rating: 4.7,
      stars: 5,
      category: 'Professional Traders',
      regulation: 'SEC, CFTC, FCA',
      minDeposit: '$0',
      spreads: 'From 0.2 pips',
      leverage: '50:1',
      platforms: 'TWS, Mobile, WebTrader',
      pros: ['Lowest costs', 'Advanced tools', 'Global markets', 'Institutional grade'],
      cons: ['Complex for beginners', 'Inactivity fees'],
      description: 'Premier choice for professional traders with institutional-grade infrastructure.',
      trustScore: 98,
      founded: 1978,
      website: 'https://www.interactivebrokers.com'
    },
    {
      id: 3,
      name: 'tastyfx',
      rating: 4.6,
      stars: 5,
      category: 'US Traders',
      regulation: 'CFTC, NFA',
      minDeposit: '$100',
      spreads: 'From 0.8 pips',
      leverage: '50:1',
      platforms: 'tastyfx platform, Mobile',
      pros: ['US regulation', 'Excellent mobile app', 'Good education', 'Fast execution'],
      cons: ['Limited to US clients', 'Fewer currency pairs'],
      description: 'Top choice for US traders with excellent mobile platform and education.',
      trustScore: 96,
      founded: 2021,
      website: 'https://www.tastyfx.com'
    },
    {
      id: 4,
      name: 'OANDA',
      rating: 4.4,
      stars: 4,
      category: 'Beginners',
      regulation: 'CFTC, FCA, ASIC',
      minDeposit: '$0',
      spreads: 'From 1.2 pips',
      leverage: '50:1',
      platforms: 'fxTrade, MT4, Mobile',
      pros: ['Beginner friendly', 'No minimum deposit', 'Good education', 'Reliable execution'],
      cons: ['Higher spreads', 'Limited advanced tools'],
      description: 'Excellent choice for beginners with comprehensive educational resources.',
      trustScore: 94,
      founded: 1996,
      website: 'https://www.oanda.com'
    },
    {
      id: 5,
      name: 'FOREX.com',
      rating: 4.2,
      stars: 4,
      category: 'Education',
      regulation: 'CFTC, FCA',
      minDeposit: '$100',
      spreads: 'From 1.4 pips',
      leverage: '50:1',
      platforms: 'Web platform, MT4, Mobile',
      pros: ['Excellent education', 'Good research', 'Multiple platforms', 'Strong support'],
      cons: ['Higher spreads', 'Limited advanced features'],
      description: 'Outstanding educational resources and market research for developing traders.',
      trustScore: 92,
      founded: 1999,
      website: 'https://www.forex.com'
    }
  ];

  const renderStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Best Forex Brokers 2025 - Updated</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Expert reviews and star ratings of the top forex brokers. Our comprehensive analysis 
          evaluates regulation, costs, platforms, and features to help you choose the right broker.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm text-muted-foreground">Brokers Analyzed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">10</div>
            <div className="text-sm text-muted-foreground">Rating Factors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">Top Rated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">2025</div>
            <div className="text-sm text-muted-foreground">Latest Reviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Broker Rankings Table */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Top Forex Brokers 2025 - Complete Rankings</CardTitle>
          <CardDescription>
            Based on our comprehensive 10-factor analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Rank</th>
                  <th className="text-left p-4">Broker</th>
                  <th className="text-left p-4">Rating</th>
                  <th className="text-left p-4">Regulation</th>
                  <th className="text-left p-4">Min Deposit</th>
                  <th className="text-left p-4">Spreads</th>
                  <th className="text-left p-4">Best For</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((broker, index) => (
                  <tr key={broker.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        #{index + 1}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-semibold">{broker.name}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(broker.stars)}
                          <span className="ml-2 text-sm">{broker.rating}/5</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>Trust Score: {broker.trustScore}/100</div>
                        <div>Founded: {broker.founded}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{broker.regulation}</td>
                    <td className="p-4 text-sm">{broker.minDeposit}</td>
                    <td className="p-4 text-sm">{broker.spreads}</td>
                    <td className="p-4">
                      <Badge variant="outline">{broker.category}</Badge>
                    </td>
                    <td className="p-4">
                      <Button size="sm" asChild>
                        <a href={broker.website} target="_blank" rel="noopener noreferrer">
                          Visit <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Broker Cards */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Detailed Broker Reviews</h2>
        {brokers.map((broker, index) => (
          <Card key={broker.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      #{index + 1}
                    </Badge>
                    <CardTitle className="text-2xl">{broker.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {renderStars(broker.stars)}
                      <span className="ml-2 font-semibold">{broker.rating}/5</span>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {broker.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline">{broker.category}</Badge>
                    <div className="text-sm text-muted-foreground">
                      Trust Score: {broker.trustScore}/100
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Founded: {broker.founded}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <a href={broker.website} target="_blank" rel="noopener noreferrer">
                      Visit Broker <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Regulation</h4>
                  <p className="text-sm text-muted-foreground">{broker.regulation}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Min Deposit</h4>
                  <p className="text-sm text-muted-foreground">{broker.minDeposit}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Spreads</h4>
                  <p className="text-sm text-muted-foreground">{broker.spreads}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Max Leverage</h4>
                  <p className="text-sm text-muted-foreground">{broker.leverage}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Pros</h4>
                  <ul className="space-y-2">
                    {broker.pros.map((pro, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Cons</h4>
                  <ul className="space-y-2">
                    {broker.cons.map((con, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-600 mt-1">✗</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Methodology Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Our Rating Methodology</CardTitle>
          <CardDescription>
            How we evaluate and rank forex brokers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Factors (Weighted)</h4>
              <ul className="space-y-2 text-sm">
                <li>• Regulation & Safety (25%)</li>
                <li>• Trading Costs (20%)</li>
                <li>• Platforms & Technology (15%)</li>
                <li>• Available Instruments (10%)</li>
                <li>• Account Features (10%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Additional Criteria</h4>
              <ul className="space-y-2 text-sm">
                <li>• Customer Support (8%)</li>
                <li>• Educational Resources (5%)</li>
                <li>• Deposit/Withdrawal (3%)</li>
                <li>• Company Reputation (2%)</li>
                <li>• Innovation & Features (2%)</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Our comprehensive analysis evaluates over 50 forex brokers across 10 critical factors. 
              We prioritize regulation and safety above all else, ensuring recommended brokers provide 
              maximum protection for your trading capital.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Risk Warning:</strong> Trading forex involves substantial risk and may not be suitable for all investors. 
          Past performance is not indicative of future results. Please ensure you fully understand the risks involved 
          and seek independent advice if necessary.
        </p>
      </div>
    </div>
  );
};

export default Brokers;

