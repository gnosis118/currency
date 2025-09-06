import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Shield, TrendingUp, Users, Award, ExternalLink, CheckCircle, AlertTriangle, Globe, Clock, DollarSign, BarChart3, BookOpen, MessageCircle } from 'lucide-react';

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
      eurUsdSpread: '0.98',
      leverage: '30:1',
      platforms: 'Proprietary, MT4',
      pros: ['Exceptional regulation', 'Award-winning platform', 'Extensive markets', 'Outstanding support'],
      cons: ['Higher spreads on some pairs', 'Inactivity fees'],
      description: 'Industry leader with nearly 50 years of operation and exceptional regulatory oversight.',
      trustScore: 99,
      founded: 1974,
      website: 'https://www.ig.com',
      countries: ['UK', 'US', 'AU', 'SG', 'DE', 'FR', 'ES', 'IT'],
      instruments: 19537,
      mobileApp: true,
      demoAccount: true,
      education: 'Excellent',
      support: '24/7',
      fees: 'Low',
      execution: 'Fast'
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
      eurUsdSpread: '0.59',
      leverage: '50:1',
      platforms: 'TWS, Mobile, WebTrader',
      pros: ['Lowest costs', 'Advanced tools', 'Global markets', 'Institutional grade'],
      cons: ['Complex for beginners', 'Inactivity fees'],
      description: 'Premier choice for professional traders with institutional-grade infrastructure.',
      trustScore: 98,
      founded: 1978,
      website: 'https://www.interactivebrokers.com',
      countries: ['US', 'UK', 'AU', 'CA', 'DE', 'FR', 'SG', 'JP'],
      instruments: 8500,
      mobileApp: true,
      demoAccount: true,
      education: 'Good',
      support: '24/5',
      fees: 'Very Low',
      execution: 'Very Fast'
    },
    {
      id: 3,
      name: 'Saxo Bank',
      rating: 4.6,
      stars: 5,
      category: 'Research & Analysis',
      regulation: 'FCA, DFSA, ASIC',
      minDeposit: '$0',
      spreads: 'From 0.7 pips',
      eurUsdSpread: '1.1',
      leverage: '30:1',
      platforms: 'SaxoTraderGO, SaxoTraderPRO',
      pros: ['Premium research', 'Global access', 'Advanced tools', 'Excellent platform'],
      cons: ['Higher minimums for some accounts', 'Complex for beginners'],
      description: 'Premium choice for serious traders with exceptional research and global market access.',
      trustScore: 97,
      founded: 1992,
      website: 'https://www.saxo.com',
      countries: ['UK', 'AU', 'SG', 'DK', 'DE', 'FR', 'ES', 'IT', 'NL'],
      instruments: 40000,
      mobileApp: true,
      demoAccount: true,
      education: 'Excellent',
      support: '24/5',
      fees: 'Medium',
      execution: 'Fast'
    },
    {
      id: 4,
      name: 'CMC Markets',
      rating: 4.5,
      stars: 5,
      category: 'Low Spreads',
      regulation: 'FCA, ASIC, MAS',
      minDeposit: '$0',
      spreads: 'From 0.5 pips',
      eurUsdSpread: '1.3',
      leverage: '30:1',
      platforms: 'Next Generation, MT4',
      pros: ['Competitive spreads', 'Advanced platform', 'Good education', 'Global presence'],
      cons: ['Inactivity fees', 'Limited US access'],
      description: 'Leading CFD and forex broker with competitive spreads and advanced trading technology.',
      trustScore: 95,
      founded: 1989,
      website: 'https://www.cmcmarkets.com',
      countries: ['UK', 'AU', 'SG', 'DE', 'FR', 'ES', 'IT', 'NZ'],
      instruments: 10000,
      mobileApp: true,
      demoAccount: true,
      education: 'Good',
      support: '24/5',
      fees: 'Low',
      execution: 'Fast'
    },
    {
      id: 5,
      name: 'FOREX.com',
      rating: 4.4,
      stars: 4,
      category: 'Education',
      regulation: 'CFTC, FCA, ASIC',
      minDeposit: '$100',
      spreads: 'From 1.0 pips',
      eurUsdSpread: '1.4',
      leverage: '50:1',
      platforms: 'Web platform, MT4, Mobile',
      pros: ['Excellent education', 'Good research', 'Multiple platforms', 'Strong support'],
      cons: ['Higher spreads', 'Limited advanced features'],
      description: 'Outstanding educational resources and market research for developing traders.',
      trustScore: 92,
      founded: 1999,
      website: 'https://www.forex.com',
      countries: ['US', 'UK', 'AU', 'CA', 'SG'],
      instruments: 5500,
      mobileApp: true,
      demoAccount: true,
      education: 'Excellent',
      support: '24/5',
      fees: 'Medium',
      execution: 'Good'
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
        <h1 className="text-4xl font-bold mb-4">Best Forex Brokers 2025 - Expert Reviews & Rankings</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Our comprehensive analysis of 50+ forex brokers evaluates regulation, costs, platforms, and features. 
          Find the perfect broker for your trading needs with our expert-backed recommendations.
        </p>
        
        {/* Expert Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Expert Analysis by Trading Professionals</h3>
              <p className="text-sm text-muted-foreground">25+ years combined experience in forex markets</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>50+ brokers tested hands-on</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>10-factor weighted methodology</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Updated quarterly with real data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">Best Overall</div>
            <div className="text-xl font-semibold mb-2">IG Group</div>
            <div className="flex justify-center mb-2">
              {renderStars(5)}
            </div>
            <div className="text-sm text-muted-foreground mb-4">Exceptional regulation & platform</div>
            <Button size="sm" className="w-full">View Review</Button>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">Best for Beginners</div>
            <div className="text-xl font-semibold mb-2">FOREX.com</div>
            <div className="flex justify-center mb-2">
              {renderStars(4)}
            </div>
            <div className="text-sm text-muted-foreground mb-4">Easy-to-use with great education</div>
            <Button size="sm" className="w-full">View Review</Button>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">Best for Professionals</div>
            <div className="text-xl font-semibold mb-2">Interactive Brokers</div>
            <div className="flex justify-center mb-2">
              {renderStars(5)}
            </div>
            <div className="text-sm text-muted-foreground mb-4">Advanced tools & lowest costs</div>
            <Button size="sm" className="w-full">View Review</Button>
          </CardContent>
        </Card>
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

      {/* Enhanced Broker Rankings Table */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Forex Brokers 2025 - Complete Rankings
          </CardTitle>
          <CardDescription>
            Based on our comprehensive 10-factor analysis with real-time data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Rank</th>
                  <th className="text-left p-4 font-semibold">Broker</th>
                  <th className="text-left p-4 font-semibold">Rating</th>
                  <th className="text-left p-4 font-semibold">EUR/USD Spread</th>
                  <th className="text-left p-4 font-semibold">Min Deposit</th>
                  <th className="text-left p-4 font-semibold">Trust Score</th>
                  <th className="text-left p-4 font-semibold">Best For</th>
                  <th className="text-left p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((broker, index) => (
                  <tr key={broker.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <Badge variant={index < 3 ? "default" : "secondary"} className="text-lg px-3 py-1">
                        #{index + 1}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-lg">{broker.name}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(broker.stars)}
                          <span className="ml-2 text-sm font-medium">{broker.rating}/5</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {broker.instruments.toLocaleString()} instruments
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{broker.rating}</div>
                        <div className="text-xs text-muted-foreground">out of 5</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{broker.eurUsdSpread} pips</div>
                        <div className="text-xs text-muted-foreground">EUR/USD</div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="font-semibold">{broker.minDeposit}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{broker.trustScore}/100</div>
                        <div className="text-xs text-muted-foreground">Trust Score</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">{broker.category}</Badge>
                    </td>
                    <td className="p-4">
                      <Button size="sm" asChild className="w-full">
                        <a href={broker.website} target="_blank" rel="noopener noreferrer">
                          Visit Broker <ExternalLink className="h-3 w-3 ml-1" />
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
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Regulation
                  </h4>
                  <p className="text-sm text-muted-foreground">{broker.regulation}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Min Deposit
                  </h4>
                  <p className="text-sm text-muted-foreground">{broker.minDeposit}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    EUR/USD Spread
                  </h4>
                  <p className="text-sm text-muted-foreground">{broker.eurUsdSpread} pips</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Max Leverage
                  </h4>
                  <p className="text-sm text-muted-foreground">{broker.leverage}</p>
                </div>
              </div>

              {/* Additional Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Available Countries
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {broker.countries.slice(0, 4).map((country, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{country}</Badge>
                    ))}
                    {broker.countries.length > 4 && (
                      <Badge variant="outline" className="text-xs">+{broker.countries.length - 4} more</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Education
                  </h4>
                  <p className="text-sm text-muted-foreground">{broker.education}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Support
                  </h4>
                  <p className="text-sm text-muted-foreground">{broker.support}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Execution
                  </h4>
                  <p className="text-sm text-muted-foreground">{broker.execution}</p>
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

      {/* Enhanced Methodology Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Our Comprehensive Rating Methodology
          </CardTitle>
          <CardDescription>
            How we evaluate and rank forex brokers using 10 weighted factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-lg">Primary Factors (Weighted)</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Regulation & Safety</span>
                  <Badge variant="default">25%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Trading Costs</span>
                  <Badge variant="secondary">20%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Platforms & Technology</span>
                  <Badge variant="outline">15%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">Available Instruments</span>
                  <Badge variant="outline">10%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Account Features</span>
                  <Badge variant="outline">10%</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Secondary Factors</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Customer Support</span>
                  <Badge variant="outline">8%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Educational Resources</span>
                  <Badge variant="outline">5%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Deposit/Withdrawal</span>
                  <Badge variant="outline">3%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Company Reputation</span>
                  <Badge variant="outline">2%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Innovation & Features</span>
                  <Badge variant="outline">2%</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-900">Our Testing Process</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                <div>
                  <div className="font-medium">Hands-on Testing</div>
                  <div className="text-muted-foreground">Real account testing with live data</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                <div>
                  <div className="font-medium">Regulatory Verification</div>
                  <div className="text-muted-foreground">Direct verification with regulators</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                <div>
                  <div className="font-medium">Quarterly Updates</div>
                  <div className="text-muted-foreground">Regular reviews and updates</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Common questions about choosing a forex broker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">What makes a forex broker trustworthy?</h4>
              <p className="text-sm text-muted-foreground">
                Look for regulation by major authorities (FCA, SEC, ASIC), a long operating history, 
                transparent fee structures, and positive user reviews. Our Trust Score combines all these factors.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How important are trading costs?</h4>
              <p className="text-sm text-muted-foreground">
                Trading costs directly impact your profitability. We evaluate spreads, commissions, 
                and hidden fees. Lower costs mean more profit stays in your pocket.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Should I choose a broker based on leverage?</h4>
              <p className="text-sm text-muted-foreground">
                High leverage can amplify both gains and losses. Choose based on your risk tolerance 
                and experience level. Most professional traders use lower leverage ratios.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What's the difference between ECN and Market Maker brokers?</h4>
              <p className="text-sm text-muted-foreground">
                ECN brokers connect you directly to the interbank market, while Market Makers create 
                their own prices. ECN typically offers better spreads but may have higher minimum deposits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Forex Brokers Guide */}
      <div className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Best Forex Brokers for 2025: Top Platforms, Fees & Features</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Picking the right forex broker can really change your trading outcome. With so many platforms fighting for your attention in 2025, 
            finding one that's actually reliable and fairly priced feels trickier than ever.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12">
          <img 
            src="https://koala.sh/api/image/v2-10miel-zhpw6.jpg?width=1216&height=832&dream" 
            alt="Business professionals analyzing forex charts on multiple monitors in a modern office with a city skyline visible through large windows."
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Key Takeaway */}
        <Card className="mb-12 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">IG stands out as the best overall forex broker for 2025</h3>
                <p className="text-muted-foreground">
                  Offering excellent trading platforms, comprehensive research tools, and regulation in eight major jurisdictions. 
                  Interactive Brokers grabs second place with the widest market range and competitive pricing. 
                  Saxo lands in the top three for its outstanding technology across desktop and mobile.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Key Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span>IG leads the pack for 2025 with strong regulation, solid platforms, and a ton of educational resources.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span>The best brokers keep pricing competitive, execution reliable, and offer thousands of tradeable instruments beyond just forex pairs.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span>Proper regulation and financial backing matter a lot for safety and reliability—don't skip checking those.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Best Forex Brokers 2025 Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Best Forex Brokers for 2025</h2>
          <img 
            src="https://koala.sh/api/image/v2-10mif7-qy50d.jpg?width=1216&height=832&dream" 
            alt="A business professional analyzing forex charts on multiple monitors in a modern office with a city skyline view."
            className="w-full h-auto rounded-lg shadow-lg mb-6"
          />
          <p className="text-muted-foreground mb-6">
            The 2025 forex scene has a few brokers that really shine in different ways. IC Markets and Pepperstone top the list for execution speed and tight spreads.
          </p>
        </div>

        {/* Top Overall Brokers */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Top Overall Brokers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-lg mb-2">IC Markets</h4>
                <p className="text-muted-foreground mb-2">
                  Keeps showing up among the best for its tight spreads, quick execution, and multiple account types. 
                  You get MetaTrader 4, MetaTrader 5, and cTrader, with spreads from 0.0 pips on major currency pairs.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-lg mb-2">Pepperstone</h4>
                <p className="text-muted-foreground mb-2">
                  Offers institutional-grade execution speeds—usually under 30 milliseconds—and competitive pricing on over 100 currency pairs. 
                  Plus, you can plug right into TradingView if that's your thing.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-lg mb-2">OANDA</h4>
                <p className="text-muted-foreground mb-2">
                  Stands out for its research tools and educational resources. Fractional pip pricing and flexible position sizes 
                  make it friendly for both new and advanced traders.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-lg mb-2">IG Group</h4>
                <p className="text-muted-foreground mb-2">
                  Gives you access to over 80 currency markets. Their proprietary platform comes packed with advanced charting 
                  and risk management tools that serious traders appreciate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Platforms Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Trading Platforms and Technology</h2>
          <div className="mb-6">
            <iframe 
              style={{aspectRatio: "16 / 9", width: "100%"}} 
              src="https://www.youtube.com/embed/it-kg2BfRCo" 
              title="Trading Platforms Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
          <p className="text-muted-foreground mb-6">
            Your trading platform can really make or break your results. These days, brokers offer everything from classic MetaTrader to slick proprietary systems with AI features.
          </p>
        </div>

        {/* MetaTrader Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>MetaTrader 4 (MT4) and MetaTrader 5 (MT5)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              MetaTrader still sets the standard for forex in 2025. MT4 dominates retail trading with its simple interface and massive EA library.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-blue-600">MT4 Key Features</h4>
                <ul className="space-y-2 text-sm">
                  <li>• 2,000+ built-in indicators</li>
                  <li>• MQL4 for custom EAs</li>
                  <li>• One-click trading, trailing stops</li>
                  <li>• Mobile apps for iOS and Android</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-600">MT5 Advantages</h4>
                <ul className="space-y-2 text-sm">
                  <li>• 21 timeframes (vs. MT4's 9)</li>
                  <li>• Economic calendar integration</li>
                  <li>• Advanced order types</li>
                  <li>• MQL5 cloud network for algo trading</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Types Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Account Types and Trading Costs</h2>
          <img 
            src="https://koala.sh/api/image/v2-10migl-sc6df.jpg?width=1216&height=832&dream" 
            alt="A person analyzing forex trading charts on multiple computer screens in a bright office."
            className="w-full h-auto rounded-lg shadow-lg mb-6"
          />
          <p className="text-muted-foreground mb-6">
            Most forex brokers offer a few account types, each with its own pricing structure. The big split is between commission-free accounts with wider spreads, and commission-based accounts with raw, tight spreads.
          </p>
        </div>

        {/* Cost Comparison Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Cost Comparison Example</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-semibold">Account Type</th>
                    <th className="text-left p-4 font-semibold">EUR/USD Spread</th>
                    <th className="text-left p-4 font-semibold">Commission</th>
                    <th className="text-left p-4 font-semibold">Total Cost (1 lot)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Standard</td>
                    <td className="p-4">1.5 pips</td>
                    <td className="p-4">$0</td>
                    <td className="p-4">$15</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">ECN</td>
                    <td className="p-4">0.3 pips</td>
                    <td className="p-4">$7 per side</td>
                    <td className="p-4">$17</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Regulation Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Regulation and Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Strong regulatory oversight and security measures make or break a broker's trustworthiness. Top regulated forex brokers for 2025 need licenses from tier-1 authorities, must protect clients from excessive losses, and keep trader funds totally separate from company cash.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-blue-600">Tier-1 Regulated Brokers</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>IG:</strong> FCA (UK), ASIC (Australia)</li>
                  <li>• <strong>OANDA:</strong> FCA (UK), CFTC/NFA (US)</li>
                  <li>• <strong>CMC Markets:</strong> FCA (UK), ASIC (Australia)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-600">Multi-Jurisdictional Coverage</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>XM:</strong> CySEC (Cyprus), ASIC (Australia)</li>
                  <li>• <strong>AvaTrade:</strong> CBI (Ireland), ASIC (Australia)</li>
                  <li>• <strong>eToro:</strong> CySEC (Cyprus), FCA (UK)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Common questions about choosing a forex broker in 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">What factors should traders consider when choosing a Forex broker in 2025?</h4>
                <p className="text-sm text-muted-foreground">
                  Regulatory compliance stands out as the most crucial factor when picking a broker. It's best to double-check registration with authorities like the CFTC, NFA, FCA, or ASIC. Trading costs—spreads, commissions, overnight fees, withdrawal charges—directly affect your bottom line. Platform stability and execution speed really do make or break trades.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">How do regulations impact the safety of trading with Forex brokers?</h4>
                <p className="text-sm text-muted-foreground">
                  Regulatory oversight pushes brokers to follow strict financial standards. Licensed brokers keep client funds separate and go through regular audits. Client fund protection depends on where the broker operates. European brokers might offer up to €20,000 in compensation, and US brokers sometimes cover even more.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Which Forex brokers offer the most competitive spreads?</h4>
                <p className="text-sm text-muted-foreground">
                  ECN brokers almost always have the tightest spreads since they connect traders directly to liquidity providers. These brokers charge separate commissions instead of marking up the spread. Major currency pairs like EUR/USD often come with spreads below 1 pip at top brokers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What technological advancements have Forex brokers incorporated to enhance trading in 2025?</h4>
                <p className="text-sm text-muted-foreground">
                  Artificial intelligence now powers advanced market analysis tools. Brokers offer AI-driven trade signals and risk management features. Mobile trading apps bring almost all platform features to your phone. Social trading platforms connect traders around the world, and API integration makes algorithmic trading easier.
                </p>
              </div>
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
    </div>
  );
};

export default Brokers;

