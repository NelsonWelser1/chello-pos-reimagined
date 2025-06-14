
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Bar, ReferenceLine
} from "recharts";
import { 
  TrendingUp, Zap, Calendar, Target, AlertTriangle, 
  Brain, BarChart3, PieChart, Activity
} from "lucide-react";

interface OverallReportsForecastingProps {
  selectedPeriod: string;
}

export default function OverallReportsForecasting({ selectedPeriod }: OverallReportsForecastingProps) {
  const forecastData = [
    // Historical data
    { month: "Jan", actual: 98000, predicted: null, confidence: null },
    { month: "Feb", actual: 105000, predicted: null, confidence: null },
    { month: "Mar", actual: 112000, predicted: null, confidence: null },
    { month: "Apr", actual: 119000, predicted: null, confidence: null },
    { month: "May", actual: 124000, predicted: null, confidence: null },
    { month: "Jun", actual: 127890, predicted: null, confidence: null },
    // Forecasted data
    { month: "Jul", actual: null, predicted: 132500, confidence: 0.85 },
    { month: "Aug", actual: null, predicted: 135200, confidence: 0.82 },
    { month: "Sep", actual: null, predicted: 138900, confidence: 0.78 },
    { month: "Oct", actual: null, predicted: 142100, confidence: 0.75 },
    { month: "Nov", actual: null, predicted: 145800, confidence: 0.72 },
    { month: "Dec", actual: null, predicted: 149500, confidence: 0.68 }
  ];

  const scenarioAnalysis = [
    {
      scenario: "Conservative",
      probability: 0.3,
      revenue: 1580000,
      growth: 8.5,
      color: "#EF4444"
    },
    {
      scenario: "Most Likely",
      probability: 0.5,
      revenue: 1685000,
      growth: 12.8,
      color: "#3B82F6"
    },
    {
      scenario: "Optimistic",
      probability: 0.2,
      revenue: 1790000,
      growth: 18.2,
      color: "#10B981"
    }
  ];

  const seasonalTrends = [
    { month: "Jan", multiplier: 0.85, historical: [0.82, 0.87, 0.86] },
    { month: "Feb", multiplier: 0.92, historical: [0.89, 0.95, 0.91] },
    { month: "Mar", multiplier: 1.05, historical: [1.02, 1.08, 1.04] },
    { month: "Apr", multiplier: 1.12, historical: [1.09, 1.15, 1.11] },
    { month: "May", multiplier: 1.18, historical: [1.15, 1.21, 1.17] },
    { month: "Jun", multiplier: 1.22, historical: [1.19, 1.25, 1.21] },
    { month: "Jul", multiplier: 1.28, historical: [1.25, 1.31, 1.27] },
    { month: "Aug", multiplier: 1.25, historical: [1.22, 1.28, 1.24] },
    { month: "Sep", multiplier: 1.15, historical: [1.12, 1.18, 1.14] },
    { month: "Oct", multiplier: 1.08, historical: [1.05, 1.11, 1.07] },
    { month: "Nov", multiplier: 0.95, historical: [0.92, 0.98, 0.94] },
    { month: "Dec", multiplier: 1.32, historical: [1.28, 1.36, 1.31] }
  ];

  const keyPredictors = [
    {
      factor: "Economic Indicators",
      impact: "High",
      current: "Positive",
      trend: "up",
      weight: 0.25
    },
    {
      factor: "Seasonal Patterns",
      impact: "High",
      current: "Peak Season",
      trend: "up",
      weight: 0.20
    },
    {
      factor: "Marketing Campaigns",
      impact: "Medium",
      current: "Active",
      trend: "up",
      weight: 0.15
    },
    {
      factor: "Competition Activity",
      impact: "Medium",
      current: "Moderate",
      trend: "neutral",
      weight: 0.15
    },
    {
      factor: "Weather Patterns",
      impact: "Low",
      current: "Favorable",
      trend: "up",
      weight: 0.10
    },
    {
      factor: "Local Events",
      impact: "Medium",
      current: "Several Planned",
      trend: "up",
      weight: 0.15
    }
  ];

  const riskFactors = [
    {
      risk: "Economic Downturn",
      probability: 0.25,
      impact: "High",
      mitigation: "Diversify revenue streams, cost optimization"
    },
    {
      risk: "New Competition",
      probability: 0.35,
      impact: "Medium",
      mitigation: "Enhance customer loyalty programs"
    },
    {
      risk: "Supply Chain Disruption",
      probability: 0.15,
      impact: "High",
      mitigation: "Develop multiple supplier relationships"
    },
    {
      risk: "Staff Shortage",
      probability: 0.20,
      impact: "Medium",
      mitigation: "Improve employee retention programs"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Forecast Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium">Next Month Forecast</p>
                <p className="text-3xl font-black text-blue-800">$132,500</p>
                <p className="text-sm text-blue-600">+3.6% growth</p>
              </div>
              <Brain className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium">Q3 Projection</p>
                <p className="text-3xl font-black text-green-800">$406,600</p>
                <p className="text-sm text-green-600">12.8% growth</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-medium">Year-End Target</p>
                <p className="text-3xl font-black text-purple-800">$1.69M</p>
                <p className="text-sm text-purple-600">85% confidence</p>
              </div>
              <Target className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecast Chart */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              AI-Powered Revenue Forecast
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select defaultValue="revenue">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
              <Badge className="bg-blue-100 text-blue-800">
                82% Average Accuracy
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="actual" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} name="Historical" />
              <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeWidth={3} strokeDasharray="5 5" name="Forecast" />
              <ReferenceLine x="Jun" stroke="#EF4444" strokeDasharray="2 2" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Analysis */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <PieChart className="w-6 h-6 text-purple-600" />
              Scenario Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {scenarioAnalysis.map((scenario, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{scenario.scenario}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scenario.color }}></div>
                      <Badge variant="outline">{(scenario.probability * 100).toFixed(0)}%</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Projected Revenue</p>
                      <p className="font-bold text-lg">${scenario.revenue.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Growth Rate</p>
                      <p className="font-bold text-lg">{scenario.growth}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Patterns */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-orange-600" />
              Seasonal Trends Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={seasonalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}x`, 'Multiplier']} />
                <Line type="monotone" dataKey="multiplier" stroke="#F59E0B" strokeWidth={2} name="Current Pattern" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Predictors */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-green-600" />
            Key Performance Predictors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyPredictors.map((predictor, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{predictor.factor}</h4>
                  <Badge variant={predictor.impact === "High" ? "default" : predictor.impact === "Medium" ? "secondary" : "outline"}>
                    {predictor.impact}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Status</span>
                    <span className="font-medium">{predictor.current}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Weight</span>
                    <span className="font-medium">{(predictor.weight * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Risk Assessment & Mitigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{risk.risk}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={risk.impact === "High" ? "destructive" : "secondary"}>
                      {risk.impact} Impact
                    </Badge>
                    <Badge variant="outline">
                      {(risk.probability * 100).toFixed(0)}% Chance
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-blue-600" />
            AI-Generated Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">🎯 Immediate Actions (Next 30 Days)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Launch summer menu promotion to capitalize on seasonal demand</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Increase staff scheduling for projected 15% order volume increase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Secure additional inventory for high-demand items</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800">🚀 Strategic Actions (Next 90 Days)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Develop loyalty program to increase customer retention by 12%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Expand delivery radius to capture additional market share</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Invest in kitchen automation to handle increased volume</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
