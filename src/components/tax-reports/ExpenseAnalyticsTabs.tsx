
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryBreakdown, VendorAnalysis, TaxAnalysis, CostOptimization, RecentExpense, COLORS } from "./ExpenseReportTypes";

interface ExpenseAnalyticsTabsProps {
  filteredData: CategoryBreakdown[];
  vendorAnalysis: VendorAnalysis[];
  taxAnalysis: TaxAnalysis;
  costOptimization: CostOptimization[];
  recentExpenses: RecentExpense[];
}

export default function ExpenseAnalyticsTabs({
  filteredData,
  vendorAnalysis,
  taxAnalysis,
  costOptimization,
  recentExpenses
}: ExpenseAnalyticsTabsProps) {
  return (
    <Tabs defaultValue="performance" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
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

      <TabsContent value="transactions" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Expense Transactions</CardTitle>
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
                  {recentExpenses.map((expense) => (
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
              <CardTitle>Top Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vendorAnalysis.slice(0, 5).map((vendor, index) => (
                  <div key={vendor.vendor} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{vendor.vendor}</h4>
                      <p className="text-xs text-muted-foreground">{vendor.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">${vendor.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{vendor.transactions} transactions</div>
                    </div>
                  </div>
                ))}
              </div>
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
  );
}
