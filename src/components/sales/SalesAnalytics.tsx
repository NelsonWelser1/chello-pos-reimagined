
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Star,
  ChefHat,
  Calendar,
  Target
} from "lucide-react";
import { toast } from "sonner";
import { SalesTargetManager } from "./SalesTargetManager";

const weeklyData = [
  { day: 'Mon', sales: 4200, orders: 95, customers: 78 },
  { day: 'Tue', sales: 3800, orders: 87, customers: 72 },
  { day: 'Wed', sales: 4600, orders: 102, customers: 85 },
  { day: 'Thu', sales: 5200, orders: 118, customers: 92 },
  { day: 'Fri', sales: 6800, orders: 145, customers: 115 },
  { day: 'Sat', sales: 7200, orders: 156, customers: 125 },
  { day: 'Sun', sales: 6400, orders: 138, customers: 108 },
];

const menuPerformance = [
  { name: 'Burgers', sales: 2840, percentage: 28, color: '#3b82f6' },
  { name: 'Pizza', sales: 2320, percentage: 23, color: '#10b981' },
  { name: 'Pasta', sales: 1680, percentage: 17, color: '#f59e0b' },
  { name: 'Salads', sales: 1240, percentage: 12, color: '#8b5cf6' },
  { name: 'Desserts', sales: 980, percentage: 10, color: '#ef4444' },
  { name: 'Beverages', sales: 940, percentage: 10, color: '#06b6d4' },
];

const hourlyTrends = [
  { hour: '6AM', orders: 5, revenue: 120 },
  { hour: '7AM', orders: 12, revenue: 280 },
  { hour: '8AM', orders: 18, revenue: 420 },
  { hour: '9AM', orders: 25, revenue: 580 },
  { hour: '10AM', orders: 32, revenue: 720 },
  { hour: '11AM', orders: 45, revenue: 980 },
  { hour: '12PM', orders: 65, revenue: 1420 },
  { hour: '1PM', orders: 78, revenue: 1680 },
  { hour: '2PM', orders: 72, revenue: 1520 },
  { hour: '3PM', orders: 55, revenue: 1180 },
  { hour: '4PM', orders: 48, revenue: 980 },
  { hour: '5PM', orders: 52, revenue: 1120 },
  { hour: '6PM', orders: 68, revenue: 1480 },
  { hour: '7PM', orders: 85, revenue: 1820 },
  { hour: '8PM', orders: 92, revenue: 1980 },
  { hour: '9PM', orders: 75, revenue: 1620 },
];

const customerMetrics = [
  { name: 'Satisfaction', value: 92, color: '#10b981' },
  { name: 'Retention', value: 78, color: '#3b82f6' },
  { name: 'Referrals', value: 65, color: '#8b5cf6' },
];

export function SalesAnalytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl font-black text-slate-800">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            Advanced Sales Analytics
          </CardTitle>
          <p className="text-lg text-gray-600 font-medium">Comprehensive insights and performance metrics</p>
        </CardHeader>
      </Card>

      {/* Weekly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
              <Calendar className="w-6 h-6 text-blue-600" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
              <ChefHat className="w-6 h-6 text-green-600" />
              Menu Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={menuPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="sales"
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                  >
                    {menuPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Trends */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
            <Clock className="w-6 h-6 text-purple-600" />
            Hourly Sales Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customer Metrics and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
              <Users className="w-6 h-6 text-orange-600" />
              Customer Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {customerMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/70 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: metric.color }}
                    />
                    <span className="font-bold text-lg">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${metric.value}%`,
                          backgroundColor: metric.color 
                        }}
                      />
                    </div>
                    <span className="font-black text-xl" style={{ color: metric.color }}>
                      {metric.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
              <Star className="w-6 h-6 text-yellow-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl">
                <div>
                  <p className="font-black text-lg">Best Selling Item</p>
                  <p className="text-yellow-700 font-semibold">Grilled Salmon</p>
                </div>
                <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">145 sold</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                <div>
                  <p className="font-black text-lg">Highest Revenue</p>
                  <p className="text-green-700 font-semibold">Premium Steaks</p>
                </div>
                <Badge className="bg-green-500 text-white text-lg px-4 py-2">$8,420</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                <div>
                  <p className="font-black text-lg">Peak Hour</p>
                  <p className="text-blue-700 font-semibold">8:00 PM</p>
                </div>
                <Badge className="bg-blue-500 text-white text-lg px-4 py-2">92 orders</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Targets Section */}
      <SalesTargetManager />

      {/* Action Buttons */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Button 
              className="flex-1 h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-lg font-bold"
              onClick={() => {
                const element = document.querySelector('[role="tablist"] button[value="reports"]') as HTMLElement;
                if (element) element.click();
                toast.info("Navigate to Reports tab for forecasting analysis");
              }}
            >
              <TrendingUp className="w-6 h-6 mr-3" />
              Forecast Analysis
            </Button>
            <Button 
              className="flex-1 h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-lg font-bold"
              onClick={() => {
                const element = document.querySelector('[role="tablist"] button[value="reports"]') as HTMLElement;
                if (element) element.click();
                toast.info("Navigate to Reports tab for custom reports");
              }}
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              Custom Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
