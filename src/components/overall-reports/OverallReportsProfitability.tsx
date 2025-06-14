
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, TrendingUp, TrendingDown, PieChart as PieChartIcon, 
  BarChart3, Target, Percent
} from "lucide-react";
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

interface OverallReportsProfitabilityProps {
  selectedPeriod: string;
}

export default function OverallReportsProfitability({ selectedPeriod }: OverallReportsProfitabilityProps) {
  const profitabilityData = [
    { month: "Jan", revenue: 98000, cogs: 32340, labor: 19600, overhead: 14700, profit: 31360 },
    { month: "Feb", revenue: 105000, cogs: 34650, labor: 21000, overhead: 15750, profit: 33600 },
    { month: "Mar", revenue: 112000, cogs: 36960, labor: 22400, overhead: 16800, profit: 35840 },
    { month: "Apr", revenue: 119000, cogs: 39270, labor: 23800, overhead: 17850, profit: 38080 },
    { month: "May", revenue: 124000, cogs: 40920, labor: 24800, overhead: 18600, profit: 39680 },
    { month: "Jun", revenue: 127890, cogs: 42201, labor: 25578, overhead: 19183, profit: 40928 }
  ];

  const costBreakdown = [
    { name: "Cost of Goods", value: 42201, color: "#EF4444", percentage: 33.0 },
    { name: "Labor Costs", value: 25578, color: "#F59E0B", percentage: 20.0 },
    { name: "Overhead", value: 19183, color: "#8B5CF6", percentage: 15.0 },
    { name: "Profit", value: 40928, color: "#10B981", percentage: 32.0 }
  ];

  const profitMargins = [
    { category: "Food Items", grossMargin: 68, netMargin: 22, target: 25 },
    { category: "Beverages", grossMargin: 78, netMargin: 35, target: 30 },
    { category: "Delivery", grossMargin: 45, netMargin: 15, target: 18 },
    { category: "Catering", grossMargin: 72, netMargin: 28, target: 25 }
  ];

  const benchmarkData = [
    { metric: "Food Cost %", actual: 33.0, industry: 28.0, target: 30.0 },
    { metric: "Labor Cost %", actual: 20.0, industry: 25.0, target: 22.0 },
    { metric: "Overhead %", actual: 15.0, industry: 18.0, target: 16.0 },
    { metric: "Net Margin %", actual: 32.0, industry: 29.0, target: 30.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Profitability Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium">Gross Profit</p>
                <p className="text-3xl font-black text-green-800">$85,689</p>
                <p className="text-sm text-green-600">67.0% margin</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium">Net Profit</p>
                <p className="text-3xl font-black text-blue-800">$40,928</p>
                <p className="text-sm text-blue-600">32.0% margin</p>
              </div>
              <Target className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 font-medium">EBITDA</p>
                <p className="text-3xl font-black text-orange-800">$48,250</p>
                <p className="text-sm text-orange-600">37.7% margin</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-medium">ROI</p>
                <p className="text-3xl font-black text-purple-800">24.8%</p>
                <p className="text-sm text-purple-600">vs 20% target</p>
              </div>
              <Percent className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit Trend Analysis */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Profit & Loss Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              <Bar dataKey="cogs" stackId="costs" fill="#EF4444" name="COGS" />
              <Bar dataKey="labor" stackId="costs" fill="#F59E0B" name="Labor" />
              <Bar dataKey="overhead" stackId="costs" fill="#8B5CF6" name="Overhead" />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} name="Net Profit" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Structure */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <PieChartIcon className="w-6 h-6 text-green-600" />
              Cost Structure Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ percentage }) => `${percentage}%`}
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {costBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${item.value.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Margins */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="w-6 h-6 text-purple-600" />
              Category Profit Margins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profitMargins.map((category, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{category.category}</h4>
                    <Badge variant={category.netMargin >= category.target ? "default" : "destructive"}>
                      {category.netMargin}% vs {category.target}% target
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Gross Margin</span>
                      <span className="font-bold">{category.grossMargin}%</span>
                    </div>
                    <Progress value={category.grossMargin} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Net Margin</span>
                      <span className="font-bold">{category.netMargin}%</span>
                    </div>
                    <Progress value={category.netMargin} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benchmark Comparison */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-orange-600" />
            Industry Benchmark Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benchmarkData.map((item, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold text-center">{item.metric}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Actual</span>
                    <span className="font-bold text-blue-600">{item.actual}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Target</span>
                    <span className="font-bold text-green-600">{item.target}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Industry</span>
                    <span className="font-bold text-gray-600">{item.industry}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={(item.actual / Math.max(item.actual, item.industry, item.target)) * 100} className="h-2" />
                    <Badge 
                      className="absolute -top-8 right-0"
                      variant={item.actual <= item.target ? "default" : "destructive"}
                    >
                      {item.actual <= item.target ? "✓" : "⚠"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
