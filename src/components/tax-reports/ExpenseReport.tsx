
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Calendar, FileText, Download, Filter, Target } from "lucide-react";

// Mock expense data for comprehensive reporting
const mockExpenseData = {
  summary: {
    totalExpenses: 45750.50,
    monthlyAverage: 15250.17,
    budgetUtilization: 73.2,
    overBudgetCategories: 2,
    pendingExpenses: 3250.00,
    approvedExpenses: 42500.50,
    taxDeductible: 38475.25,
    nonDeductible: 7275.25
  },
  
  categoryBreakdown: [
    { category: "Food & Beverage", amount: 18500, budget: 20000, percentage: 40.4, trend: "+5.2%", status: "on-track" },
    { category: "Labor", amount: 15600, budget: 15000, percentage: 34.1, trend: "+4.0%", status: "over-budget" },
    { category: "Rent & Utilities", amount: 8200, budget: 8000, percentage: 17.9, trend: "+2.5%", status: "over-budget" },
    { category: "Marketing", amount: 2100, budget: 3000, percentage: 4.6, trend: "-15.2%", status: "under-budget" },
    { category: "Equipment", amount: 1350, budget: 2000, percentage: 3.0, trend: "-32.5%", status: "under-budget" }
  ],

  monthlyTrends: [
    { month: "Jan", expenses: 14200, budget: 15000, variance: -800 },
    { month: "Feb", expenses: 15800, budget: 15000, variance: 800 },
    { month: "Mar", expenses: 15750, budget: 15000, variance: 750 },
    { month: "Apr", expenses: 16200, budget: 15500, variance: 700 },
    { month: "May", expenses: 14950, budget: 15500, variance: -550 },
    { month: "Jun", expenses: 15850, budget: 15500, variance: 350 }
  ],

  vendorAnalysis: [
    { vendor: "Food Distributors Inc", amount: 8500, transactions: 24, category: "Food & Beverage", reliability: 98 },
    { vendor: "Payroll Services", amount: 12000, transactions: 3, category: "Labor", reliability: 100 },
    { vendor: "Utility Company", amount: 4200, transactions: 6, category: "Utilities", reliability: 95 },
    { vendor: "Marketing Agency", amount: 1800, transactions: 8, category: "Marketing", reliability: 92 },
    { vendor: "Equipment Rental", amount: 950, transactions: 4, category: "Equipment", reliability: 88 }
  ],

  taxAnalysis: {
    totalTaxPaid: 4575.50,
    deductibleExpenses: 38475.25,
    nonDeductibleExpenses: 7275.25,
    estimatedTaxSavings: 11542.58,
    categories: [
      { category: "Food & Beverage", deductible: 18500, nonDeductible: 0, taxSavings: 5550 },
      { category: "Labor", deductible: 15600, nonDeductible: 0, taxSavings: 4680 },
      { category: "Rent & Utilities", deductible: 8200, nonDeductible: 0, taxSavings: 2460 },
      { category: "Marketing", deductible: 2100, nonDeductible: 0, taxSavings: 630 },
      { category: "Equipment", deductible: 1350, nonDeductible: 0, taxSavings: 405 }
    ]
  },

  costOptimization: [
    { category: "Food & Beverage", currentCost: 18500, potentialSavings: 1850, recommendation: "Negotiate bulk discounts with suppliers" },
    { category: "Labor", currentCost: 15600, potentialSavings: 780, recommendation: "Optimize staff scheduling during slow periods" },
    { category: "Utilities", currentCost: 4200, potentialSavings: 420, recommendation: "Implement energy-saving equipment" },
    { category: "Marketing", currentCost: 2100, potentialSavings: 315, recommendation: "Focus on higher ROI digital channels" }
  ]
};

const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function ExpenseReport() {
  const { summary, categoryBreakdown, monthlyTrends, vendorAnalysis, taxAnalysis, costOptimization } = mockExpenseData;

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📊 Expense Report Analytics</h2>
          <p className="text-muted-foreground">Comprehensive expense analysis and optimization insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold">${summary.totalExpenses.toLocaleString()}</p>
                <p className="text-blue-200 text-xs mt-1">Last 3 months</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Budget Utilization</p>
                <p className="text-2xl font-bold">{summary.budgetUtilization}%</p>
                <p className="text-green-200 text-xs mt-1">Within target range</p>
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
                <p className="text-orange-200 text-xs mt-1">Est. savings: ${taxAnalysis.estimatedTaxSavings.toLocaleString()}</p>
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
                <p className="text-red-200 text-xs mt-1">Categories need attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="tax">Tax Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Expense by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget vs Actual */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryBreakdown}>
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

          {/* Category Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                      <div>
                        <h4 className="font-medium">{category.category}</h4>
                        <p className="text-sm text-muted-foreground">${category.amount.toLocaleString()} of ${category.budget.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
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

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expense Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="budget" stackId="1" stroke="#E5E7EB" fill="#E5E7EB" name="Budget" />
                  <Area type="monotone" dataKey="expenses" stackId="2" stroke="#3B82F6" fill="#3B82F6" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Variance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Variance']} />
                  <Bar dataKey="variance" fill={(data) => data.variance > 0 ? '#EF4444' : '#10B981'} name="Budget Variance" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Vendors by Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorAnalysis.map((vendor, index) => (
                  <div key={vendor.vendor} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{vendor.vendor}</h4>
                        <p className="text-sm text-muted-foreground">{vendor.category} • {vendor.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${vendor.amount.toLocaleString()}</div>
                      <Badge variant="outline">
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
                <CardTitle>Tax Deduction Summary</CardTitle>
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
              <CardTitle>Cost Optimization Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {costOptimization.map((item, index) => (
                  <div key={item.category} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{item.category}</h4>
                        <p className="text-sm text-muted-foreground">Current monthly cost: ${item.currentCost.toLocaleString()}</p>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Save ${item.potentialSavings.toLocaleString()}
                      </Badge>
                    </div>
                    <p className="text-sm">{item.recommendation}</p>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(item.potentialSavings / item.currentCost) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Potential savings: {((item.potentialSavings / item.currentCost) * 100).toFixed(1)}%
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
