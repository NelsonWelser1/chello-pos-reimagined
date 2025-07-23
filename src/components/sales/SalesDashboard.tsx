
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Clock, 
  Target,
  ArrowUp,
  ArrowDown,
  Eye
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';
import { useSalesAnalytics } from "@/hooks/useSalesAnalytics";
import { useDataSynchronization } from "@/hooks/useDataSynchronization";
import { salesService } from "@/services/salesService";

export function SalesDashboard() {
  const { getTodaysAnalytics } = useSalesAnalytics();
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    peakHour: '7:00 PM',
    dailyGrowth: 0,
    weeklyGrowth: 0
  });
  const [hourlySales, setHourlySales] = useState<Array<{ time: string; amount: number; orders: number }>>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch today's metrics
      const metricsData = await salesService.getTodaysMetrics();
      setMetrics(metricsData);

      // Fetch hourly sales data
      const hourlyData = await salesService.getHourlySalesData();
      const formattedHourlyData = hourlyData.map(item => ({
        time: item.hour,
        amount: item.sales,
        orders: item.orders
      }));
      setHourlySales(formattedHourlyData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Setup comprehensive data synchronization
  const { isConnected, syncStatus } = useDataSynchronization({
    onSalesUpdate: fetchData,
    onOrderUpdate: fetchData,
    onTransactionUpdate: fetchData,
    onKitchenUpdate: fetchData, // Kitchen completion affects sales
  });

  useEffect(() => {
    fetchData();
  }, []);

  const kpiData = [
    {
      title: "Today's Revenue",
      value: `$${metrics.todayRevenue.toFixed(2)}`,
      change: `${metrics.dailyGrowth > 0 ? '+' : ''}${metrics.dailyGrowth.toFixed(1)}%`,
      trend: metrics.dailyGrowth >= 0 ? "up" : "down",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Average Order",
      value: `$${metrics.averageOrderValue.toFixed(2)}`,
      change: `${metrics.weeklyGrowth > 0 ? '+' : ''}${metrics.weeklyGrowth.toFixed(1)}%`,
      trend: metrics.weeklyGrowth >= 0 ? "up" : "down",
      icon: Target,
      gradient: "from-purple-500 to-violet-600"
    },
    {
      title: "Peak Hour",
      value: metrics.peakHour,
      change: `$${(metrics.todayRevenue * 0.15).toFixed(0)}`,
      trend: "neutral",
      icon: Clock,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="text-xl text-slate-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === "up" ? (
                      <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : kpi.trend === "down" ? (
                      <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                    ) : (
                      <div className="w-4 h-4 mr-1" />
                    )}
                    <span className={`text-sm font-semibold ${
                      kpi.trend === "up" ? "text-green-600" : 
                      kpi.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${kpi.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <kpi.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Today's Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlySales}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performance Metrics */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
              <Users className="w-6 h-6 text-purple-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-lg">Customer Satisfaction</p>
                  <p className="text-sm text-gray-600">Based on recent feedback</p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">4.8/5.0</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-lg">Order Accuracy</p>
                  <p className="text-sm text-gray-600">Last 100 orders</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">98.5%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-lg">Avg. Service Time</p>
                  <p className="text-sm text-gray-600">Peak hours</p>
                </div>
                <Badge className="bg-orange-100 text-orange-800 text-lg px-4 py-2">12 min</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-lg">Repeat Customers</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">67%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-slate-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-lg font-bold">
              <Eye className="w-6 h-6 mr-3" />
              View Live Orders
            </Button>
            <Button className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg font-bold">
              <DollarSign className="w-6 h-6 mr-3" />
              Process Payment
            </Button>
            <Button className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-lg font-bold">
              <TrendingUp className="w-6 h-6 mr-3" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
