
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { 
  Search, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Filter,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Zap,
  Eye,
  RefreshCw
} from "lucide-react";

// Enhanced mock data with more detailed information
const expenseData = {
  summary: {
    totalExpenses: 125750.50,
    monthlyAverage: 31437.63,
    budgetUtilization: 82.3,
    overBudgetCategories: 4,
    pendingApprovals: 8750.00,
    approvedExpenses: 117000.50,
    taxDeductible: 98250.75,
    projectedSavings: 15500.00
  },
  
  categories: [
    { name: "Food & Beverage", amount: 45250, budget: 50000, percentage: 36.0, status: "on-track", trend: "+2.5%", efficiency: 90 },
    { name: "Labor Costs", amount: 38900, budget: 35000, percentage: 31.0, status: "over-budget", trend: "+11.1%", efficiency: 78 },
    { name: "Utilities", amount: 15200, budget: 16000, percentage: 12.1, status: "under-budget", trend: "-5.0%", efficiency: 95 },
    { name: "Marketing", amount: 12800, budget: 15000, percentage: 10.2, status: "under-budget", trend: "-14.7%", efficiency: 85 },
    { name: "Equipment", amount: 8600, budget: 10000, percentage: 6.8, status: "under-budget", trend: "-14.0%", efficiency: 92 },
    { name: "Maintenance", amount: 5000, budget: 6000, percentage: 4.0, status: "on-track", trend: "-16.7%", efficiency: 88 }
  ],

  monthlyTrends: [
    { month: "Jan", amount: 28500, budget: 30000, variance: -1500 },
    { month: "Feb", amount: 32100, budget: 30000, variance: 2100 },
    { month: "Mar", amount: 31800, budget: 31000, variance: 800 },
    { month: "Apr", amount: 33350, budget: 32000, variance: 1350 }
  ],

  recentExpenses: [
    { id: 1, description: "Fresh Seafood Delivery", category: "Food & Beverage", amount: 2850, date: "2024-04-15", status: "approved", vendor: "Ocean Fresh Suppliers" },
    { id: 2, description: "Social Media Campaign", category: "Marketing", amount: 1200, date: "2024-04-14", status: "pending", vendor: "Digital Marketing Pro" },
    { id: 3, description: "Kitchen Equipment Repair", category: "Maintenance", amount: 850, date: "2024-04-13", status: "approved", vendor: "TechRepair Solutions" },
    { id: 4, description: "Utility Bill - Electric", category: "Utilities", amount: 3200, date: "2024-04-12", status: "approved", vendor: "Metro Electric Co" },
    { id: 5, description: "Staff Training Program", category: "Labor Costs", amount: 1500, date: "2024-04-11", status: "pending", vendor: "ProTraining Institute" }
  ]
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ExpenseReport() {
  const [activeView, setActiveView] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeframe, setTimeframe] = useState("monthly");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter data based on search and category
  const filteredCategories = useMemo(() => {
    let filtered = expenseData.categories;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(cat => cat.name === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchTerm, selectedCategory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleExport = () => {
    console.log("Exporting expense report...");
    // Simulate export functionality
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            💰 Smart Expense Analytics
          </h1>
          <p className="text-slate-600 mt-2 text-lg">AI-powered insights for optimal financial management</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-slate-300 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 border-slate-300 focus:border-blue-500">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {expenseData.categories.map(cat => (
                <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-slate-300 hover:border-blue-500 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold">${expenseData.summary.totalExpenses.toLocaleString()}</p>
                <p className="text-blue-200 text-sm mt-1">+5.2% from last month</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Budget Utilization</p>
                <p className="text-3xl font-bold">{expenseData.summary.budgetUtilization}%</p>
                <p className="text-green-200 text-sm mt-1">Within target range</p>
              </div>
              <Target className="w-12 h-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Approvals</p>
                <p className="text-3xl font-bold">${expenseData.summary.pendingApprovals.toLocaleString()}</p>
                <p className="text-orange-200 text-sm mt-1">8 items pending</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Projected Savings</p>
                <p className="text-3xl font-bold">${expenseData.summary.projectedSavings.toLocaleString()}</p>
                <p className="text-purple-200 text-sm mt-1">AI optimization potential</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Section */}
      <Card className="bg-white shadow-lg border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-800">Expense Analytics Dashboard</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={activeView === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("overview")}
                className="transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeView === "trends" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("trends")}
                className="transition-colors"
              >
                <Activity className="w-4 h-4 mr-2" />
                Trends
              </Button>
              <Button
                variant={activeView === "efficiency" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("efficiency")}
                className="transition-colors"
              >
                <Zap className="w-4 h-4 mr-2" />
                Efficiency
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {activeView === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={filteredCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name.split(' ')[0]}: ${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {filteredCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Budget vs Actual</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={filteredCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                    <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
                    <Bar dataKey="amount" fill="#3B82F6" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeView === "trends" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Monthly Expense Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={expenseData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="budget" stackId="1" stroke="#E5E7EB" fill="#E5E7EB" name="Budget" />
                  <Area type="monotone" dataKey="amount" stackId="2" stroke="#3B82F6" fill="#3B82F6" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeView === "efficiency" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Category Efficiency Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category, index) => (
                  <Card key={category.name} className="border border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-800">{category.name}</h4>
                        <Badge 
                          variant={category.status === 'on-track' ? 'default' : category.status === 'over-budget' ? 'destructive' : 'secondary'}
                        >
                          {category.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Efficiency:</span>
                          <span className="font-medium">{category.efficiency}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Trend:</span>
                          <span className={`font-medium ${category.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                            {category.trend}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${category.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Expenses Table */}
      <Card className="bg-white shadow-lg border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-xl font-bold text-slate-800">Recent Expense Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-700">Description</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Category</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Amount</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Vendor</th>
                </tr>
              </thead>
              <tbody>
                {expenseData.recentExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{expense.description}</td>
                    <td className="p-4 text-slate-600">{expense.category}</td>
                    <td className="p-4 font-semibold text-slate-800">${expense.amount.toLocaleString()}</td>
                    <td className="p-4 text-slate-600">{expense.date}</td>
                    <td className="p-4">
                      <Badge variant={expense.status === 'approved' ? 'default' : 'secondary'}>
                        {expense.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-600">{expense.vendor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
