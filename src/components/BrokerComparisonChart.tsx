import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Broker data for charts
const brokerRatings = [
  { name: 'IG Group', overall: 9.6, regulation: 10, costs: 8.5, platform: 10, education: 9, color: '#2563eb' },
  { name: 'Interactive Brokers', overall: 9.4, regulation: 10, costs: 10, platform: 10, education: 7, color: '#dc2626' },
  { name: 'Saxo Bank', overall: 9.2, regulation: 10, costs: 8, platform: 10, education: 9, color: '#16a34a' },
  { name: 'tastyfx', overall: 9.0, regulation: 10, costs: 8.5, platform: 9, education: 8, color: '#ca8a04' },
  { name: 'OANDA', overall: 8.8, regulation: 10, costs: 7.5, platform: 8.5, education: 10, color: '#9333ea' },
  { name: 'FOREX.com', overall: 8.6, regulation: 10, costs: 7, platform: 8.5, education: 10, color: '#c2410c' },
  { name: 'XM Group', overall: 8.4, regulation: 9, costs: 7.5, platform: 8, education: 9, color: '#0891b2' },
  { name: 'Pepperstone', overall: 8.2, regulation: 9, costs: 9, platform: 8.5, education: 7, color: '#be123c' },
];

const costComparison = [
  { broker: 'Interactive Brokers', eurUsdSpread: 0.2, commission: 0.20, minDeposit: 0 },
  { broker: 'Pepperstone', eurUsdSpread: 0.3, commission: 3.50, minDeposit: 0 },
  { broker: 'IG Group', eurUsdSpread: 0.6, commission: 0, minDeposit: 0 },
  { broker: 'tastyfx', eurUsdSpread: 0.8, commission: 0, minDeposit: 0 },
  { broker: 'OANDA', eurUsdSpread: 1.2, commission: 0, minDeposit: 0 },
  { broker: 'Saxo Bank', eurUsdSpread: 1.0, commission: 3.00, minDeposit: 0 },
  { broker: 'FOREX.com', eurUsdSpread: 1.3, commission: 0, minDeposit: 100 },
  { broker: 'XM Group', eurUsdSpread: 1.6, commission: 0, minDeposit: 5 },
];

const regulationData = [
  { broker: 'IG Group', regulators: ['FCA', 'ASIC', 'FINMA', 'MAS'], score: 10 },
  { broker: 'Interactive Brokers', regulators: ['SEC', 'FINRA', 'FCA', 'ASIC'], score: 10 },
  { broker: 'Saxo Bank', regulators: ['FCA', 'MiFID II', 'FINMA'], score: 10 },
  { broker: 'tastyfx', regulators: ['CFTC', 'NFA'], score: 10 },
  { broker: 'OANDA', regulators: ['FCA', 'ASIC', 'CFTC'], score: 10 },
  { broker: 'FOREX.com', regulators: ['CFTC', 'NFA', 'FCA'], score: 10 },
  { broker: 'XM Group', regulators: ['CySEC', 'ASIC', 'IFSC'], score: 9 },
  { broker: 'Pepperstone', regulators: ['FCA', 'ASIC', 'CySEC'], score: 9 },
];

interface BrokerComparisonChartProps {
  className?: string;
}

const BrokerComparisonChart = ({ className }: BrokerComparisonChartProps) => {
  return (
    <div className={className}>
      {/* Overall Ratings Bar Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Overall Broker Ratings Comparison
            <Badge variant="outline">2025 Rankings</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={brokerRatings} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                formatter={(value, name) => [`${value}/10`, 'Overall Rating']}
                labelFormatter={(label) => `Broker: ${label}`}
              />
              <Legend />
              <Bar dataKey="overall" name="Overall Rating" radius={[4, 4, 0, 0]}>
                {brokerRatings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Factor Radar Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Top 5 Brokers - Multi-Factor Analysis
            <Badge variant="outline">Radar View</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={brokerRatings.slice(0, 5)}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" fontSize={12} />
              <PolarRadiusAxis domain={[0, 10]} tick={false} />
              <Radar
                name="Regulation"
                dataKey="regulation"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Trading Costs"
                dataKey="costs"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Platform Quality"
                dataKey="platform"
                stroke="#16a34a"
                fill="#16a34a"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Education"
                dataKey="education"
                stroke="#ca8a04"
                fill="#ca8a04"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost Comparison Scatter Plot */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Trading Costs Analysis
            <Badge variant="outline">EUR/USD Spreads vs Commission</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              data={costComparison}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="eurUsdSpread" 
                name="EUR/USD Spread" 
                unit=" pips"
                domain={[0, 2]}
              />
              <YAxis 
                type="number" 
                dataKey="commission" 
                name="Commission" 
                unit="$"
                domain={[0, 4]}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name) => {
                  if (name === 'commission') return [`$${value}`, 'Commission per lot'];
                  if (name === 'eurUsdSpread') return [`${value} pips`, 'EUR/USD Spread'];
                  return [value, name];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `Broker: ${payload[0].payload.broker}`;
                  }
                  return '';
                }}
              />
              <Scatter name="Brokers" dataKey="commission" fill="#2563eb" />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-muted-foreground">
            <p><strong>Lower left is better:</strong> Low spreads + Low commission = Lower trading costs</p>
          </div>
        </CardContent>
      </Card>

      {/* Regulation Strength */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛡️ Regulatory Protection Strength
            <Badge variant="outline">Safety Analysis</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regulationData.map((broker, index) => (
              <div key={broker.broker} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{broker.broker}</h4>
                    <div className="flex gap-1 mt-1">
                      {broker.regulators.map((reg) => (
                        <Badge key={reg} variant="secondary" className="text-xs">
                          {reg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{broker.score}/10</div>
                  <div className="text-sm text-muted-foreground">Safety Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrokerComparisonChart;

