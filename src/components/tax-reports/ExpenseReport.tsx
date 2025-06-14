
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ScatterChart, Scatter } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Calendar, FileText, Download, Filter, Target, Search, Eye, BarChart3, PieChart as PieChartIcon, Activity, Zap } from "lucide-react";

// Enhanced mock expense data with more realistic and comprehensive information
const mockExpenseData = {
  summary: {
    totalExpenses: 67850.75,
    monthlyAverage: 22616.92,
    budgetUtilization: 78.5,
    overBudgetCategories: 3,
    pendingExpenses: 4750.00,
    approvedExpenses: 63100.75,
    taxDeductible: 58475.50,
    nonDeductible: 9375.25,
    projectedAnnualExpenses: 271403.00,
    costSavingsOpportunity: 8950.00
  },
  
  categoryBreakdown: [
    { category: "Food & Beverage", amount: 24500, budget: 25000, percentage: 36.1, trend: "+2.8%", status: "on-track", variance: -500, efficiency: 92 },
    { category: "Labor", amount: 18900, budget: 18000, percentage: 27.9, trend: "+5.0%", status: "over-budget", variance: 900, efficiency: 85 },
    { category: "Rent & Utilities", amount: 12200, budget: 12000, percentage: 18.0, trend: "+1.7%", status: "over-budget", variance: 200, efficiency: 95 },
    { category: "Marketing", amount: 6100, budget: 8000, percentage: 9.0, trend: "-23.8%", status: "under-budget", variance: -1900, efficiency: 76 },
    { category: "Equipment", amount: 3850, budget: 5000, percentage: 5.7, trend: "-23.0%", status: "under-budget", variance: -1150, efficiency: 88 },
    { category: "Maintenance", amount: 2300, budget: 3000, percentage: 3.4, trend: "-23.3%", status: "under-budget", variance: -700, efficiency: 91 }
  ],

  monthlyTrends: [
    { month: "Jan", expenses: 21200, budget: 22000, variance: -800, forecast: 22500 },
    { month: "Feb", expenses: 23100, budget: 22000, variance: 1100, forecast: 23200 },
    { month: "Mar", expenses: 23550, budget: 22500, variance: 1050, forecast: 23800 },
    { month: "Apr", expenses: 22800, budget: 22500, variance: 300, forecast: 22900 },
    { month: "May", expenses: 21950, budget: 22500, variance: -550, forecast: 22100 },
    { month: "Jun", expenses: 22650, budget: 22500, variance: 150, forecast: 22750 }
  ],

  weeklyTrends: [
    { week: "Week 1", expenses: 5600, target: 5500 },
    { week: "Week 2", expenses: 5450, target: 5500 },
    { week: "Week 3", expenses: 5800, target: 5500 },
    { week: "Week 4", expenses: 5800, target: 5500 }
  ],

  vendorAnalysis: [
    { vendor: "Premier Food Distributors", amount: 12500, transactions: 28, category: "Food & Beverage", reliability: 98, paymentTerms: "Net 30", avgDeliveryTime: "1.2 days" },
    { vendor: "Elite Staffing Solutions", amount: 15000, transactions: 6, category: "Labor", reliability: 100, paymentTerms: "Net 15", avgDeliveryTime: "Same day" },
    { vendor: "Metro Utility Services", amount: 6200, transactions: 12, category: "Utilities", reliability: 95, paymentTerms: "Net 15", avgDeliveryTime: "2-3 days" },
    { vendor: "Digital Marketing Pro", amount: 4800, transactions: 15, category: "Marketing", reliability: 92, paymentTerms: "Net 30", avgDeliveryTime: "1-2 days" },
    { vendor: "Professional Equipment Co", amount: 2850, transactions: 8, category: "Equipment", reliability: 88, paymentTerms: "Net 45", avgDeliveryTime: "3-5 days" }
  ],

  taxAnalysis: {
    totalTaxPaid: 6785.50,
    deductibleExpenses: 58475.50,
    nonDeductibleExpenses: 9375.25,
    estimatedTaxSavings: 17542.65,
    quarterlyProjection: 52627.95,
    categories: [
      { category: "Food & Beverage", deductible: 24500, nonDeductible: 0, taxSavings: 7350, rate: 0.30 },
      { category: "Labor", deductible: 18900, nonDeductible: 0, taxSavings: 5670, rate: 0.30 },
      { category: "Rent & Utilities", deductible: 12200, nonDeductible: 0, taxSavings: 3660, rate: 0.30 },
      { category: "Marketing", deductible: 6100, nonDeductible: 0, taxSavings: 1830, rate: 0.30 },
      { category: "Equipment", deductible: 3850, nonDeductible: 0, taxSavings: 1155, rate: 0.30 }
    ]
  },

  costOptimization: [
    { 
      category: "Food & Beverage", 
      currentCost: 24500, 
      potentialSavings: 2450, 
      recommendation: "Negotiate volume discounts and seasonal pricing with suppliers",
      priority: "High",
      implementationTime: "2-4 weeks",
      roi: 245
    },
    { 
      category: "Labor", 
      currentCost: 18900, 
      potentialSavings: 1890, 
      recommendation: "Implement dynamic scheduling based on customer traffic patterns",
      priority: "Medium",
      implementationTime: "4-6 weeks",
      roi: 189
    },
    { 
      category: "Utilities", 
      currentCost: 6200, 
      potentialSavings: 620, 
      recommendation: "Upgrade to energy-efficient equipment and smart controls",
      priority: "Medium",
      implementationTime: "6-8 weeks",
      roi: 62
    },
    { 
      category: "Marketing", 
      currentCost: 4800, 
      potentialSavings: 960, 
      recommendation: "Focus budget on high-converting digital channels",
      priority: "High",
      implementationTime: "1-2 weeks",
      roi: 96
    }
  ],

  expenseForecasting: [
    { month: "Jul", predicted: 23100, confidence: 85, factors: ["Seasonal increase", "New marketing campaign"] },
    { month: "Aug", predicted: 23800, confidence: 82, factors: ["Peak season", "Equipment upgrade"] },
    { month: "Sep", predicted: 22900, confidence: 88, factors: ["Post-summer normalization"] },
    { month: "Oct", predicted: 22400, confidence: 90, factors: ["Stable operations"] }
  ]
};

const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function ExpenseReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");
  const [selectedMetric, setSelectedMetric] = useState("amount");
  const [activeChart, setActiveChart] = useState("overview");

  const { summary, categoryBreakdown, monthlyTrends, weeklyTrends, vendorAnalysis, taxAnalysis, costOptimization, expenseForecasting } = mockExpenseData;

  // Filter data based on search and category selection
  const filteredData = useMemo(() => {
    let filtered = categoryBreakdown;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchTerm, selectedCategory, categoryBreakdown]);

  // Transform data for different chart types
  const trendsData = selectedTimeframe === "weekly" ? weeklyTrends : monthlyTrends;
  
  const efficiencyData = categoryBreakdown.map(item => ({
    category: item.category.split(' ')[0],
    efficiency: item.efficiency,
    amount: item.amount
  }));

  const varianceData = monthlyTrends.map(item => ({
    ...item,
    varianceColor: item.variance > 0 ? '#EF4444' : '#10B981'
  }));

  // Export functionality
  const handleExport = (format: string) => {
    console.log(`Exporting expense report as ${format}`);
    // In a real app, this would trigger actual export functionality
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Advanced Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Advanced Expense Analytics
          </h2>
          <p className="text-muted-foreground mt-1">Comprehensive expense analysis with AI-powered insights</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-48"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryBreakdown.map(item => (
                <SelectItem key={item.category} value={item.category}>
                  {item.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced Summary Cards with Advanced Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold">${summary.totalExpenses.toLocaleString()}</p>
                <p className="text-blue-200 text-xs mt-1">
                  Projected Annual: ${summary.projectedAnnualExpenses.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Budget Efficiency</p>
                <p className="text-2xl font-bold">{summary.budgetUtilization}%</p>
                <p className="text-green-200 text-xs mt-1">
                  Savings Opportunity: ${summary.costSavingsOpportunity.toLocaleString()}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Tax Deductible</p>
                <p className="text-2xl font-bold">${summary.taxDeductible.toLocaleString()}</p>
                <p className="text-orange-200 text-xs mt-1">
                  Est. Tax Savings: ${taxAnalysis.estimatedTaxSavings.toLocaleString()}
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Over Budget</p>
                <p className="text-2xl font-bold">{summary.overBudgetCategories}</p>
                <p className="text-red-200 text-xs mt-1">
                  Pending: ${summary.pendingExpenses.toLocaleString()}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Chart Selection */}
      <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
        <Button
          variant={activeChart === "overview" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveChart("overview")}
        >
          <Eye className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeChart === "trends" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveChart("trends")}
        >
          <Activity className="w-4 h-4 mr-2" />
          Trends
        </Button>
        <Button
          variant={activeChart === "efficiency" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveChart("efficiency")}
        >
          <Zap className="w-4 h-4 mr-2" />
          Efficiency
        </Button>
        <Button
          variant={activeChart === "forecasting" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveChart("forecasting")}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Forecasting
        </Button>
      </div>

      {/* Dynamic Chart Display */}
      {activeChart === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Expense Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category.split(' ')[0]}: ${percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Budget Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                  <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
                  <Bar dataKey="amount" fill="#3B82F6" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeChart === "trends" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {selectedTimeframe === "weekly" ? "Weekly" : "Monthly"} Expense Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={selectedTimeframe === "weekly" ? "week" : "month"} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Area type="monotone" dataKey={selectedTimeframe === "weekly" ? "target" : "budget"} stackId="1" stroke="#E5E7EB" fill="#E5E7EB" name="Target/Budget" />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#3B82F6" fill="#3B82F6" name="Actual" />
                {selectedTimeframe === "monthly" && (
                  <Area type="monotone" dataKey="forecast" stackId="3" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Forecast" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {activeChart === "efficiency" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Category Efficiency Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="efficiency" name="Efficiency %" />
                <YAxis dataKey="amount" name="Amount ($)" />
                <Tooltip formatter={(value, name) => [
                  name === "efficiency" ? `${value}%` : `$${Number(value).toLocaleString()}`,
                  name === "efficiency" ? "Efficiency" : "Amount"
                ]} />
                <Scatter dataKey="amount" fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {activeChart === "forecasting" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI-Powered Expense Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={expenseForecasting}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === "confidence" ? `${value}%` : `$${Number(value).toLocaleString()}`,
                  name === "confidence" ? "Confidence" : "Predicted Amount"
                ]} />
                <Line type="monotone" dataKey="predicted" stroke="#3B82F6" strokeWidth={3} name="Predicted Expenses" />
                <Line type="monotone" dataKey="confidence" stroke="#10B981" strokeDasharray="5 5" name="Confidence %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="tax">Tax Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                      <div>
                        <h4 className="font-medium">{category.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${category.amount.toLocaleString()} of ${category.budget.toLocaleString()} 
                          • Efficiency: {category.efficiency}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={category.status === 'over-budget' ? 'destructive' : category.status === 'under-budget' ? 'default' : 'secondary'}>
                        {category.status}
                      </Badge>
                      <div className={`text-sm font-medium ${category.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                        {category.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorAnalysis.map((vendor, index) => (
                  <div key={vendor.vendor} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{vendor.vendor}</h4>
                        <p className="text-sm text-muted-foreground">
                          {vendor.category} • {vendor.transactions} transactions • {vendor.paymentTerms}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg Delivery: {vendor.avgDeliveryTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">${vendor.amount.toLocaleString()}</div>
                      <Badge variant="outline" className="mb-1">
                        {vendor.reliability}% reliable
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Optimization Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Deductible Expenses</span>
                    <span className="font-bold">${taxAnalysis.deductibleExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Non-Deductible Expenses</span>
                    <span className="font-bold text-red-600">${taxAnalysis.nonDeductibleExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quarterly Projection</span>
                    <span className="font-bold text-blue-600">${taxAnalysis.quarterlyProjection.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Estimated Tax Savings</span>
                    <span className="font-bold text-green-600">${taxAnalysis.estimatedTaxSavings.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Savings by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={taxAnalysis.categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Tax Savings']} />
                    <Bar dataKey="taxSavings" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Cost Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {costOptimization.map((item, index) => (
                  <div key={item.category} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{item.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current monthly cost: ${item.currentCost.toLocaleString()}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <Badge variant={item.priority === "High" ? "destructive" : "default"}>
                            {item.priority} Priority
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Implementation: {item.implementationTime}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="bg-green-100 text-green-800 mb-2">
                          Save ${item.potentialSavings.toLocaleString()}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          ROI: ${item.roi}/month
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-4">{item.recommendation}</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${(item.potentialSavings / item.currentCost) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Potential savings: {((item.potentialSavings / item.currentCost) * 100).toFixed(1)}% of current costs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
