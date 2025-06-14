
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, Area, AreaChart
} from "recharts";
import { 
  TrendingUp, TrendingDown, Calendar, Target, Award, 
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";

interface OverallReportsComparativeProps {
  selectedPeriod: string;
  comparisonPeriod: string;
}

export default function OverallReportsComparative({ selectedPeriod, comparisonPeriod }: OverallReportsComparativeProps) {
  const periodComparisons = [
    {
      metric: "Total Revenue",
      current: 127890,
      previous: 114250,
      change: 11.9,
      trend: "up",
      unit: "$"
    },
    {
      metric: "Total Orders",
      current: 3247,
      previous: 3458,
      change: -6.1,
      trend: "down",
      unit: ""
    },
    {
      metric: "Average Order Value",
      current: 39.42,
      previous: 33.04,
      change: 19.3,
      trend: "up",
      unit: "$"
    },
    {
      metric: "Customer Count",
      current: 2156,
      previous: 2234,
      change: -3.5,
      trend: "down",
      unit: ""
    },
    {
      metric: "Net Profit Margin",
      current: 32.0,
      previous: 28.5,
      change: 12.3,
      trend: "up",
      unit: "%"
    },
    {
      metric: "Customer Satisfaction",
      current: 4.7,
      previous: 4.5,
      change: 4.4,
      trend: "up",
      unit: "/5"
    }
  ];

  const yearOverYearData = [
    { month: "Jan", currentYear: 98000, previousYear: 89000, industry: 92000 },
    { month: "Feb", currentYear: 105000, previousYear: 94000, industry: 98000 },
    { month: "Mar", currentYear: 112000, previousYear: 98000, industry: 105000 },
    { month: "Apr", currentYear: 119000, previousYear: 105000, industry: 112000 },
    { month: "May", currentYear: 124000, previousYear: 112000, industry: 118000 },
    { month: "Jun", currentYear: 127890, previousYear: 114250, industry: 121000 }
  ];

  const competitorBenchmark = [
    { category: "Revenue Growth", us: 11.9, competitor1: 8.5, competitor2: 15.2, industry: 10.1 },
    { category: "Profit Margin", us: 32.0, competitor1: 28.5, competitor2: 25.8, industry: 29.0 },
    { category: "Customer Satisfaction", us: 4.7, competitor1: 4.4, competitor2: 4.6, industry: 4.5 },
    { category: "Order Fulfillment", us: 12.5, competitor1: 15.2, competitor2: 11.8, industry: 13.8 },
    { category: "Staff Efficiency", us: 94.2, competitor1: 88.7, competitor2: 91.5, industry: 90.1 }
  ];

  const goalTracking = [
    {
      goal: "Monthly Revenue Target",
      target: 120000,
      actual: 127890,
      progress: 106.6,
      status: "exceeded"
    },
    {
      goal: "Customer Acquisition",
      target: 2500,
      actual: 2156,
      progress: 86.2,
      status: "behind"
    },
    {
      goal: "Profit Margin",
      target: 30.0,
      actual: 32.0,
      progress: 106.7,
      status: "exceeded"
    },
    {
      goal: "Order Accuracy",
      target: 95.0,
      actual: 98.7,
      progress: 103.9,
      status: "exceeded"
    }
  ];

  const getChangeIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case "down": return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Comparison Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {periodComparisons.map((item, index) => (
          <Card key={index} className="shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{item.metric}</h3>
                <div className="flex items-center gap-1">
                  {getChangeIcon(item.trend)}
                  <Badge variant={item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"}>
                    {item.change > 0 ? "+" : ""}{item.change.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current</span>
                  <span className="font-bold text-lg">
                    {item.unit}{item.current.toLocaleString()}{item.unit === "%" || item.unit === "/5" ? "" : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Previous</span>
                  <span className="text-sm text-gray-600">
                    {item.unit}{item.previous.toLocaleString()}{item.unit === "%" || item.unit === "/5" ? "" : ""}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Year-over-Year Comparison */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              Year-over-Year Performance
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select defaultValue="revenue">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="profit">Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={yearOverYearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="industry" fill="#E5E7EB" stroke="#9CA3AF" name="Industry Average" />
              <Bar dataKey="previousYear" fill="#94A3B8" name="Previous Year" />
              <Line type="monotone" dataKey="currentYear" stroke="#3B82F6" strokeWidth={3} name="Current Year" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Benchmark */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Award className="w-6 h-6 text-purple-600" />
              Competitive Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {competitorBenchmark.map((item, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="font-semibold">{item.category}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm">Our Performance</span>
                      </div>
                      <span className="font-bold text-blue-600">{item.us}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded"></div>
                        <span className="text-sm">Industry Average</span>
                      </div>
                      <span className="font-bold text-gray-600">{item.industry}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded"></div>
                        <span className="text-sm">Top Competitor</span>
                      </div>
                      <span className="font-bold text-red-600">{Math.max(item.competitor1, item.competitor2)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goal Tracking */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="w-6 h-6 text-green-600" />
              Goal Achievement Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goalTracking.map((goal, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{goal.goal}</h4>
                    <Badge variant={goal.status === "exceeded" ? "default" : "destructive"}>
                      {goal.progress.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Target: {goal.target.toLocaleString()}</span>
                      <span>Actual: {goal.actual.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          goal.status === "exceeded" ? "bg-green-500" : "bg-orange-500"
                        }`}
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      ></div>
                    </div>
                    {goal.progress > 100 && (
                      <p className="text-xs text-green-600 font-medium">
                        Exceeded target by {(goal.progress - 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Performance Summary & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-green-800 mb-2">🎯 Strong Performance</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Revenue growth exceeding targets</li>
                <li>• Profit margins above industry average</li>
                <li>• Customer satisfaction improving</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-orange-800 mb-2">⚠️ Areas for Improvement</h4>
              <ul className="text-sm space-y-1 text-orange-700">
                <li>• Customer acquisition below target</li>
                <li>• Order volume declining</li>
                <li>• Peak hour efficiency gaps</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-blue-800 mb-2">🚀 Recommendations</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Focus on customer retention</li>
                <li>• Optimize marketing spend</li>
                <li>• Enhance peak hour operations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
