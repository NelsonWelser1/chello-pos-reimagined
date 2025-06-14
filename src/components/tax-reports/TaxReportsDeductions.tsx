
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, Receipt, TrendingUp, Target, DollarSign, 
  FileText, AlertTriangle, CheckCircle, Plus
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface TaxReportsDeductionsProps {
  selectedPeriod: string;
}

export default function TaxReportsDeductions({ selectedPeriod }: TaxReportsDeductionsProps) {
  const deductionSummary = {
    totalDeductions: 47850,
    potentialSavings: 12450,
    utilizationRate: 78.5,
    missedOpportunities: 8900
  };

  const deductionCategories = [
    {
      category: "Food & Beverage Costs",
      claimed: 18750,
      potential: 22000,
      percentage: 85.2,
      status: "optimized",
      description: "Cost of goods sold, ingredients, beverages"
    },
    {
      category: "Equipment & Maintenance",
      claimed: 8450,
      potential: 9200,
      percentage: 91.8,
      status: "good",
      description: "Kitchen equipment, POS systems, maintenance"
    },
    {
      category: "Marketing & Advertising",
      claimed: 5230,
      potential: 7800,
      percentage: 67.1,
      status: "opportunity",
      description: "Digital marketing, print ads, promotional materials"
    },
    {
      category: "Professional Services",
      claimed: 3890,
      potential: 4200,
      percentage: 92.6,
      status: "good",
      description: "Accounting, legal, consulting fees"
    },
    {
      category: "Utilities & Rent",
      claimed: 7200,
      potential: 7500,
      percentage: 96.0,
      status: "optimized",
      description: "Electricity, gas, water, rent payments"
    },
    {
      category: "Employee Benefits",
      claimed: 2850,
      potential: 5100,
      percentage: 55.9,
      status: "missed",
      description: "Health insurance, retirement contributions"
    },
    {
      category: "Vehicle & Travel",
      claimed: 1480,
      potential: 2200,
      percentage: 67.3,
      status: "opportunity",
      description: "Delivery vehicles, business travel, fuel"
    }
  ];

  const monthlyDeductions = [
    { month: "Jan", claimed: 6850, potential: 8200 },
    { month: "Feb", claimed: 7120, potential: 8500 },
    { month: "Mar", claimed: 7890, potential: 9100 },
    { month: "Apr", claimed: 8200, potential: 9800 },
    { month: "May", claimed: 8950, potential: 10200 },
    { month: "Jun", claimed: 8840, potential: 10100 }
  ];

  const pieData = deductionCategories.map(cat => ({
    name: cat.category,
    value: cat.claimed,
    color: cat.status === "optimized" ? "#10B981" : 
           cat.status === "good" ? "#3B82F6" :
           cat.status === "opportunity" ? "#F59E0B" : "#EF4444"
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "optimized":
        return <Badge className="bg-green-100 text-green-800">Optimized</Badge>;
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case "opportunity":
        return <Badge className="bg-orange-100 text-orange-800">Opportunity</Badge>;
      case "missed":
        return <Badge variant="destructive">Missed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimized":
      case "good":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "opportunity":
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case "missed":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Deduction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Deductions</h3>
              <p className="text-3xl font-black text-slate-800">${deductionSummary.totalDeductions.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Potential Savings</h3>
              <p className="text-3xl font-black text-slate-800">${deductionSummary.potentialSavings.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Utilization Rate</h3>
              <p className="text-3xl font-black text-slate-800">{deductionSummary.utilizationRate}%</p>
              <Progress value={deductionSummary.utilizationRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Missed Opportunities</h3>
              <p className="text-3xl font-black text-slate-800">${deductionSummary.missedOpportunities.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Deduction Trend */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Monthly Deduction Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyDeductions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              <Bar dataKey="claimed" fill="#10B981" name="Claimed" />
              <Bar dataKey="potential" fill="#E5E7EB" name="Potential" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deduction Category Breakdown */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Receipt className="w-6 h-6 text-green-600" />
              Deduction Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Optimization Opportunities */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="w-6 h-6 text-orange-600" />
              Optimization Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deductionCategories
                .filter(cat => cat.status === "opportunity" || cat.status === "missed")
                .sort((a, b) => (b.potential - b.claimed) - (a.potential - a.claimed))
                .map((category, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{category.category}</h4>
                      <Badge variant="secondary">
                        +${(category.potential - category.claimed).toLocaleString()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Current: ${category.claimed.toLocaleString()}</span>
                      <span>Potential: ${category.potential.toLocaleString()}</span>
                    </div>
                    <Progress value={(category.claimed / category.potential) * 100} className="h-1 mt-2" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Category Analysis */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-600" />
              Deduction Category Analysis
            </CardTitle>
            <Button className="bg-gradient-to-r from-green-500 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add New Deduction
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deductionCategories.map((category, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(category.status)}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium">{category.category}</h4>
                        {getStatusBadge(category.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Claimed</span>
                    <p className="font-bold">${category.claimed.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Potential</span>
                    <p className="font-bold">${category.potential.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Utilization</span>
                    <p className="font-bold">{category.percentage.toFixed(1)}%</p>
                  </div>
                </div>
                
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
