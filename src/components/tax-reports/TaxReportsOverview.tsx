
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, Receipt, AlertTriangle, TrendingUp, Calendar, 
  Target, FileText, Calculator, Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

interface TaxReportsOverviewProps {
  selectedPeriod: string;
  selectedTaxType: string;
}

export default function TaxReportsOverview({ selectedPeriod, selectedTaxType }: TaxReportsOverviewProps) {
  // Mock tax data
  const taxSummary = {
    totalTaxLiability: 45690,
    taxesPaid: 42150,
    taxesOwed: 3540,
    totalDeductions: 18750,
    effectiveTaxRate: 24.8,
    complianceScore: 92
  };

  const monthlyTaxData = [
    { month: "Jan", salesTax: 3200, incomeTax: 8500, payrollTax: 4200, total: 15900 },
    { month: "Feb", salesTax: 3450, incomeTax: 8200, payrollTax: 4350, total: 16000 },
    { month: "Mar", salesTax: 3780, incomeTax: 8900, payrollTax: 4180, total: 16860 },
    { month: "Apr", salesTax: 3560, incomeTax: 9200, payrollTax: 4420, total: 17180 },
    { month: "May", salesTax: 3890, incomeTax: 8750, payrollTax: 4350, total: 16990 },
    { month: "Jun", salesTax: 4120, incomeTax: 9500, payrollTax: 4580, total: 18200 }
  ];

  const taxBreakdown = [
    { name: "Sales Tax", value: 22680, color: "#10B981", percentage: 49.6 },
    { name: "Income Tax", value: 15240, color: "#3B82F6", percentage: 33.4 },
    { name: "Payroll Tax", value: 5890, color: "#EF4444", percentage: 12.9 },
    { name: "Property Tax", value: 1880, color: "#F59E0B", percentage: 4.1 }
  ];

  const upcomingDeadlines = [
    { type: "Sales Tax Return", dueDate: "2024-07-20", amount: 3890, status: "pending" },
    { type: "Quarterly Estimated Tax", dueDate: "2024-07-15", amount: 12500, status: "urgent" },
    { type: "Payroll Tax Deposit", dueDate: "2024-06-28", amount: 4580, status: "overdue" },
    { type: "Annual Property Tax", dueDate: "2024-08-31", amount: 1880, status: "upcoming" }
  ];

  const deductionCategories = [
    { category: "Food & Supplies", amount: 8450, percentage: 45.1 },
    { category: "Equipment & Maintenance", amount: 3920, percentage: 20.9 },
    { category: "Marketing & Advertising", amount: 2850, percentage: 15.2 },
    { category: "Professional Services", amount: 1890, percentage: 10.1 },
    { category: "Utilities", amount: 1640, percentage: 8.7 }
  ];

  return (
    <div className="space-y-6">
      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <Badge variant="destructive" className="font-bold">
                ${taxSummary.taxesOwed.toLocaleString()} Owed
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Tax Liability</h3>
                <p className="text-3xl font-black text-slate-800">${taxSummary.totalTaxLiability.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taxes Paid</span>
                  <span className="font-bold">${taxSummary.taxesPaid.toLocaleString()}</span>
                </div>
                <Progress value={(taxSummary.taxesPaid / taxSummary.totalTaxLiability) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <Badge variant="default" className="font-bold">
                {taxSummary.effectiveTaxRate}%
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Deductions</h3>
                <p className="text-3xl font-black text-slate-800">${taxSummary.totalDeductions.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Effective Tax Rate</span>
                  <span className="font-bold">{taxSummary.effectiveTaxRate}%</span>
                </div>
                <p className="text-xs text-muted-foreground">Optimized deduction strategy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <Badge variant={taxSummary.complianceScore >= 90 ? "default" : "destructive"} className="font-bold">
                {taxSummary.complianceScore}%
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Compliance Score</h3>
                <p className="text-3xl font-black text-slate-800">{taxSummary.complianceScore}%</p>
              </div>
              <div className="space-y-2">
                <Progress value={taxSummary.complianceScore} className="h-2" />
                <p className="text-xs text-muted-foreground">Based on filing accuracy & timeliness</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Trend Analysis */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Monthly Tax Obligations Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyTaxData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="salesTax" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
              <Area type="monotone" dataKey="incomeTax" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
              <Area type="monotone" dataKey="payrollTax" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Type Breakdown */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-green-600" />
              Tax Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={taxBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taxBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {taxBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${item.value.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-600" />
              Upcoming Tax Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  deadline.status === 'overdue' ? 'bg-red-50 border-red-500' :
                  deadline.status === 'urgent' ? 'bg-orange-50 border-orange-500' :
                  deadline.status === 'pending' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{deadline.type}</h4>
                      <p className="text-sm text-muted-foreground">Due: {deadline.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${deadline.amount.toLocaleString()}</div>
                      <Badge variant={
                        deadline.status === 'overdue' ? 'destructive' :
                        deadline.status === 'urgent' ? 'default' :
                        'secondary'
                      }>
                        {deadline.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Deduction Categories */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-purple-600" />
            Top Tax Deduction Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deductionCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
              <Bar dataKey="amount" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
