
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, DollarSign, Receipt, Users, Clock, 
  Target, AlertTriangle, Award, Activity, Zap
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface OverallReportsKPIProps {
  selectedPeriod: string;
}

export default function OverallReportsKPI({ selectedPeriod }: OverallReportsKPIProps) {
  // Mock data - in real app this would come from API
  const kpiData = [
    {
      title: "Total Revenue",
      value: "$127,890",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      target: 120000,
      actual: 127890,
      description: "Monthly revenue target achievement"
    },
    {
      title: "Net Profit Margin",
      value: "18.4%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600",
      target: 16,
      actual: 18.4,
      description: "Profit margin vs industry benchmark"
    },
    {
      title: "Total Orders",
      value: "3,247",
      change: "-3.2%",
      trend: "down",
      icon: Receipt,
      color: "from-purple-500 to-violet-600",
      target: 3500,
      actual: 3247,
      description: "Monthly order volume"
    },
    {
      title: "Average Order Value",
      value: "$39.42",
      change: "+8.7%",
      trend: "up",
      icon: Target,
      color: "from-orange-500 to-red-600",
      target: 35,
      actual: 39.42,
      description: "Revenue per order optimization"
    },
    {
      title: "Customer Satisfaction",
      value: "4.7/5",
      change: "+0.2",
      trend: "up",
      icon: Award,
      color: "from-pink-500 to-rose-600",
      target: 4.5,
      actual: 4.7,
      description: "Average customer rating"
    },
    {
      title: "Cost per Order",
      value: "$28.95",
      change: "-5.1%",
      trend: "up",
      icon: Activity,
      color: "from-indigo-500 to-purple-600",
      target: 30,
      actual: 28.95,
      description: "Operational efficiency metric"
    }
  ];

  const performanceData = [
    { month: "Jan", revenue: 98000, expenses: 82000, profit: 16000 },
    { month: "Feb", revenue: 105000, expenses: 86000, profit: 19000 },
    { month: "Mar", revenue: 112000, expenses: 89000, profit: 23000 },
    { month: "Apr", revenue: 119000, expenses: 92000, profit: 27000 },
    { month: "May", revenue: 124000, expenses: 94000, profit: 30000 },
    { month: "Jun", revenue: 127890, expenses: 96500, profit: 31390 }
  ];

  const categoryBreakdown = [
    { name: "Food Sales", value: 72000, color: "#10B981" },
    { name: "Beverage Sales", value: 28000, color: "#3B82F6" },
    { name: "Delivery Fees", value: 15890, color: "#EF4444" },
    { name: "Catering", value: 12000, color: "#F59E0B" }
  ];

  const alerts = [
    { type: "warning", message: "Food cost percentage above target (32% vs 28%)", priority: "high" },
    { type: "info", message: "Peak hour staffing optimization opportunity", priority: "medium" },
    { type: "success", message: "Customer retention rate improved by 15%", priority: "low" }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const progress = (kpi.actual / kpi.target) * 100;
          
          return (
            <Card key={index} className="shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant={kpi.trend === "up" ? "default" : "destructive"} className="font-bold">
                    {kpi.change}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{kpi.title}</h3>
                    <p className="text-3xl font-black text-slate-800">{kpi.value}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Target Progress</span>
                      <span className="font-bold">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Trend */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Performance Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
              <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} />
              <Area type="monotone" dataKey="profit" stackId="3" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-600" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {categoryBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold">${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Alerts */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Smart Alerts & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-orange-50 border-orange-500' :
                  alert.type === 'success' ? 'bg-green-50 border-green-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{alert.message}</p>
                    <Badge variant={
                      alert.priority === 'high' ? 'destructive' :
                      alert.priority === 'medium' ? 'default' :
                      'secondary'
                    }>
                      {alert.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
