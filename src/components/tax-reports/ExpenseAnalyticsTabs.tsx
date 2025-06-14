
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CategoryBreakdown, VendorAnalysis, TaxAnalysis, CostOptimization, COLORS } from "./ExpenseReportTypes";

interface ExpenseAnalyticsTabsProps {
  filteredData: CategoryBreakdown[];
  vendorAnalysis: VendorAnalysis[];
  taxAnalysis: TaxAnalysis;
  costOptimization: CostOptimization[];
}

export default function ExpenseAnalyticsTabs({
  filteredData,
  vendorAnalysis,
  taxAnalysis,
  costOptimization
}: ExpenseAnalyticsTabsProps) {
  return (
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
  );
}
