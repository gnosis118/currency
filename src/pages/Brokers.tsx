import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Shield, TrendingUp, DollarSign, Globe, Award, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, Cell } from "recharts";

// Broker data for comparisons and charts
const brokerData = [
  {
    id: 1,
    name: "OANDA",
    logo: "🏦",
    rating: 4.8,
    minDeposit: 0,
    spread: 0.8,
    leverage: "50:1",
    regulation: "CFTC, NFA",
    founded: 1996,
    headquarters: "Toronto, Canada",
    tradingPlatforms: ["OANDA Trade", "MetaTrader 4", "TradingView"],
    currencies: 68,
    features: ["No minimum deposit", "Advanced charting", "API access", "Educational resources"],
    pros: ["Excellent research tools", "Competitive spreads", "Strong regulation", "No dealing desk"],
    cons: ["Limited crypto offerings", "Higher fees for small accounts"],
    overallScore: 9.2,
    regulation_score: 9.5,
    costs_score: 8.8,
    platform_score: 9.0,
    education_score: 9.5,
    description: "OANDA is a well-established forex broker known for its competitive spreads and excellent research tools."
  },
  {
    id: 2,
    name: "FOREX.com",
    logo: "💱",
    rating: 4.6,
    minDeposit: 100,
    spread: 1.2,
    leverage: "50:1",
    regulation: "CFTC, NFA",
    founded: 1999,
    headquarters: "New York, USA",
    tradingPlatforms: ["FOREX.com Platform", "MetaTrader 4", "TradingView"],
    currencies: 80,
    features: ["Advanced platform", "Mobile trading", "Market analysis", "Demo account"],
    pros: ["Strong platform technology", "Good customer service", "Comprehensive education", "Multiple platforms"],
    cons: ["Higher spreads than competitors", "Inactivity fees"],
    overallScore: 8.8,
    regulation_score: 9.0,
    costs_score: 8.2,
    platform_score: 9.2,
    education_score: 9.0,
    description: "FOREX.com offers a comprehensive trading experience with advanced platforms and educational resources."
  },
  {
    id: 3,
    name: "Interactive Brokers",
    logo: "📊",
    rating: 4.7,
    minDeposit: 0,
    spread: 0.2,
    leverage: "50:1",
    regulation: "SEC, CFTC, FCA",
    founded: 1978,
    headquarters: "Greenwich, USA",
    tradingPlatforms: ["Trader Workstation", "IBKR Mobile", "WebTrader"],
    currencies: 100,
    features: ["Low costs", "Global markets", "Advanced tools", "API trading"],
    pros: ["Lowest costs", "Global market access", "Professional tools", "Strong technology"],
    cons: ["Complex for beginners", "High minimum for some features"],
    overallScore: 9.0,
    regulation_score: 9.8,
    costs_score: 9.8,
    platform_score: 8.5,
    education_score: 8.0,
    description: "Interactive Brokers is ideal for active traders seeking low costs and access to global markets."
  },
  {
    id: 4,
    name: "TD Ameritrade",
    logo: "🏛️",
    rating: 4.5,
    minDeposit: 0,
    spread: 1.3,
    leverage: "50:1",
    regulation: "CFTC, NFA",
    founded: 1971,
    headquarters: "Omaha, USA",
    tradingPlatforms: ["thinkorswim", "TD Ameritrade Mobile", "Web Platform"],
    currencies: 70,
    features: ["No minimum deposit", "Advanced charting", "Paper trading", "Education center"],
    pros: ["Excellent education", "Powerful thinkorswim platform", "No minimum deposit", "Strong research"],
    cons: ["Higher spreads", "Limited international markets"],
    overallScore: 8.6,
    regulation_score: 9.0,
    costs_score: 7.8,
    platform_score: 9.5,
    education_score: 9.8,
    description: "TD Ameritrade excels in education and platform technology, perfect for learning traders."
  },
  {
    id: 5,
    name: "Charles Schwab",
    logo: "🏢",
    rating: 4.4,
    minDeposit: 0,
    spread: 1.4,
    leverage: "50:1",
    regulation: "CFTC, NFA",
    founded: 1971,
    headquarters: "San Francisco, USA",
    tradingPlatforms: ["StreetSmart Edge", "Schwab Mobile", "Web Platform"],
    currencies: 50,
    features: ["No minimum deposit", "Commission-free trades", "Research tools", "24/7 support"],
    pros: ["No minimum deposit", "Strong customer service", "Comprehensive research", "Bank integration"],
    cons: ["Limited currency pairs", "Higher spreads", "Fewer advanced features"],
    overallScore: 8.4,
    regulation_score: 9.2,
    costs_score: 8.0,
    platform_score: 8.2,
    education_score: 8.5,
    description: "Charles Schwab offers reliable trading with excellent customer service and research capabilities."
  }
];

// Chart data for visualizations
const ratingData = brokerData.map(broker => ({
  name: broker.name,
  rating: broker.overallScore,
  color: broker.overallScore >= 9 ? "#22c55e" : broker.overallScore >= 8.5 ? "#3b82f6" : "#f59e0b"
}));

const radarData = brokerData.slice(0, 3).map(broker => ({
  broker: broker.name,
  regulation: broker.regulation_score,
  costs: broker.costs_score,
  platform: broker.platform_score,
  education: broker.education_score
}));

const costSpreadData = brokerData.map(broker => ({
  name: broker.name,
  spread: broker.spread,
  minDeposit: broker.minDeposit,
  rating: broker.overallScore
}));

const Brokers = () => {
  const [selectedBroker, setSelectedBroker] = useState<number | null>(null);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Best Forex Brokers 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Compare top-rated forex brokers with detailed reviews, live spreads, and expert analysis
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  Regulated Brokers Only
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Live Spread Data
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Award className="w-4 h-4 mr-2" />
                  Expert Reviews
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="charts">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Top 5 Brokers Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top 5 Forex Brokers - Overall Ratings
                  </CardTitle>
                  <CardDescription>
                    Based on regulation, costs, platform quality, and educational resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ratingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[7, 10]} />
                      <Tooltip 
                        formatter={(value) => [`${value}/10`, 'Overall Score']}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Bar dataKey="rating" radius={[4, 4, 0, 0]}>
                        {ratingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quick Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brokerData.slice(0, 6).map((broker) => (
                  <Card key={broker.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{broker.logo}</span>
                          <div>
                            <CardTitle className="text-lg">{broker.name}</CardTitle>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{broker.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          #{broker.id}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Min Deposit:</span>
                          <p className="font-medium">${broker.minDeposit}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Spread:</span>
                          <p className="font-medium">{broker.spread} pips</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Leverage:</span>
                          <p className="font-medium">{broker.leverage}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Regulation:</span>
                          <p className="font-medium text-xs">{broker.regulation}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{broker.description}</p>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedBroker(broker.id)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Broker Comparison</CardTitle>
                  <CardDescription>
                    Compare key features, costs, and regulations across all brokers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Broker</th>
                          <th className="text-left p-4">Rating</th>
                          <th className="text-left p-4">Min Deposit</th>
                          <th className="text-left p-4">Spread</th>
                          <th className="text-left p-4">Leverage</th>
                          <th className="text-left p-4">Regulation</th>
                          <th className="text-left p-4">Platforms</th>
                        </tr>
                      </thead>
                      <tbody>
                        {brokerData.map((broker) => (
                          <tr key={broker.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{broker.logo}</span>
                                <div>
                                  <p className="font-medium">{broker.name}</p>
                                  <p className="text-sm text-gray-600">Est. {broker.founded}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{broker.rating}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-medium">${broker.minDeposit}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-medium">{broker.spread} pips</span>
                            </td>
                            <td className="p-4">
                              <span className="font-medium">{broker.leverage}</span>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="text-xs">
                                {broker.regulation.split(',')[0]}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className="text-sm">{broker.tradingPlatforms.length} platforms</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-8">
              {brokerData.map((broker) => (
                <Card key={broker.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{broker.logo}</span>
                        <div>
                          <CardTitle className="text-2xl">{broker.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{broker.rating}/5</span>
                            </div>
                            <Badge variant="outline">
                              Overall Score: {broker.overallScore}/10
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Broker
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700">{broker.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900">Founded</h4>
                        <p className="text-2xl font-bold text-blue-700">{broker.founded}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900">Min Deposit</h4>
                        <p className="text-2xl font-bold text-green-700">${broker.minDeposit}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900">Currencies</h4>
                        <p className="text-2xl font-bold text-purple-700">{broker.currencies}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-medium text-orange-900">Spread</h4>
                        <p className="text-2xl font-bold text-orange-700">{broker.spread} pips</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-green-700 mb-3">✅ Pros</h4>
                        <ul className="space-y-2">
                          {broker.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span className="text-sm">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-700 mb-3">❌ Cons</h4>
                        <ul className="space-y-2">
                          {broker.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span className="text-sm">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {broker.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Trading Platforms</h4>
                      <div className="flex flex-wrap gap-2">
                        {broker.tradingPlatforms.map((platform, index) => (
                          <Badge key={index} variant="outline">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Charts Tab */}
            <TabsContent value="charts" className="space-y-8">
              {/* Multi-Factor Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Multi-Factor Broker Analysis</CardTitle>
                  <CardDescription>
                    Compare brokers across regulation, costs, platform quality, and education
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="broker" />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} />
                      <Radar
                        name="Regulation"
                        dataKey="regulation"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.1}
                      />
                      <Radar
                        name="Costs"
                        dataKey="costs"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.1}
                      />
                      <Radar
                        name="Platform"
                        dataKey="platform"
                        stroke="#ffc658"
                        fill="#ffc658"
                        fillOpacity={0.1}
                      />
                      <Radar
                        name="Education"
                        dataKey="education"
                        stroke="#ff7300"
                        fill="#ff7300"
                        fillOpacity={0.1}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cost vs Spread Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Trading Costs Analysis</CardTitle>
                  <CardDescription>
                    Compare minimum deposits vs spreads (bubble size = overall rating)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart data={costSpreadData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="spread" 
                        name="Spread (pips)"
                        label={{ value: 'Spread (pips)', position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis 
                        dataKey="minDeposit" 
                        name="Min Deposit ($)"
                        label={{ value: 'Min Deposit ($)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'spread' ? `${value} pips` : `$${value}`,
                          name === 'spread' ? 'Spread' : 'Min Deposit'
                        ]}
                        labelFormatter={(label) => `Broker: ${label}`}
                      />
                      <Scatter dataKey="rating" fill="#8884d8">
                        {costSpreadData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.rating >= 9 ? "#22c55e" : entry.rating >= 8.5 ? "#3b82f6" : "#f59e0b"}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Regulatory Protection Rankings */}
              <Card>
                <CardHeader>
                  <CardTitle>Regulatory Protection Rankings</CardTitle>
                  <CardDescription>
                    Safety scores based on regulatory oversight and compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {brokerData
                      .sort((a, b) => b.regulation_score - a.regulation_score)
                      .map((broker, index) => (
                        <div key={broker.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="text-2xl">{broker.logo}</span>
                            <div>
                              <h4 className="font-medium">{broker.name}</h4>
                              <p className="text-sm text-gray-600">{broker.regulation}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-lg">{broker.regulation_score}/10</p>
                              <p className="text-sm text-gray-600">Safety Score</p>
                            </div>
                            <Shield className={`w-6 h-6 ${
                              broker.regulation_score >= 9.5 ? 'text-green-500' :
                              broker.regulation_score >= 9 ? 'text-blue-500' : 'text-yellow-500'
                            }`} />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
              <p className="text-xl mb-6 opacity-90">
                Choose from our top-rated brokers and start your forex trading journey today
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Compare Spreads
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  <Globe className="w-5 h-5 mr-2" />
                  View All Brokers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Brokers;

