
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Clock, TrendingUp, Activity, Zap, Target, 
  ChefHat, ShoppingCart, Truck, Star
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ComposedChart, Area, AreaChart
} from "recharts";

interface OverallReportsOperationalProps {
  selectedPeriod: string;
}

export default function OverallReportsOperational({ selectedPeriod }: OverallReportsOperationalProps) {
  const operationalMetrics = [
    {
      title: "Order Fulfillment Time",
      value: "12.5 min",
      target: "15 min",
      trend: "+8.2%",
      status: "good",
      icon: Clock,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Kitchen Efficiency",
      value: "94.2%",
      target: "90%",
      trend: "+3.1%",
      status: "excellent",
      icon: ChefHat,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Staff Utilization",
      value: "87.5%",
      target: "85%",
      trend: "+2.4%",
      status: "good",
      icon: Users,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Customer Wait Time",
      value: "4.2 min",
      target: "5 min",
      trend: "-12.8%",
      status: "excellent",
      icon: Activity,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Order Accuracy",
      value: "98.7%",
      target: "95%",
      trend: "+1.2%",
      status: "excellent",
      icon: Target,
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Delivery Success Rate",
      value: "96.4%",
      target: "95%",
      trend: "+0.8%",
      status: "good",
      icon: Truck,
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const efficiencyData = [
    { hour: "09:00", orders: 45, fulfillmentTime: 14.2, staffCount: 8, accuracy: 97.5 },
    { hour: "10:00", orders: 52, fulfillmentTime: 13.8, staffCount: 8, accuracy: 98.2 },
    { hour: "11:00", orders: 78, fulfillmentTime: 12.5, staffCount: 10, accuracy: 98.8 },
    { hour: "12:00", orders: 124, fulfillmentTime: 11.2, staffCount: 12, accuracy: 99.1 },
    { hour: "13:00", orders: 156, fulfillmentTime: 10.8, staffCount: 14, accuracy: 98.9 },
    { hour: "14:00", orders: 89, fulfillmentTime: 11.5, staffCount: 12, accuracy: 98.7 },
    { hour: "15:00", orders: 67, fulfillmentTime: 12.8, staffCount: 10, accuracy: 98.3 },
    { hour: "16:00", orders: 43, fulfillmentTime: 13.2, staffCount: 8, accuracy: 97.9 }
  ];

  const departmentPerformance = [
    { department: "Kitchen", efficiency: 94.2, capacity: 85, satisfaction: 4.8 },
    { department: "Service", efficiency: 91.5, capacity: 78, satisfaction: 4.7 },
    { department: "Delivery", efficiency: 88.7, capacity: 92, satisfaction: 4.5 },
    { department: "Management", efficiency: 96.3, capacity: 65, satisfaction: 4.9 }
  ];

  const qualityMetrics = [
    { metric: "Food Quality", score: 4.8, target: 4.5, reviews: 1247 },
    { metric: "Service Speed", score: 4.6, target: 4.3, reviews: 1189 },
    { metric: "Cleanliness", score: 4.9, target: 4.7, reviews: 892 },
    { metric: "Staff Friendliness", score: 4.7, target: 4.5, reviews: 1034 },
    { metric: "Value for Money", score: 4.4, target: 4.2, reviews: 967 },
    { metric: "Overall Experience", score: 4.7, target: 4.5, reviews: 1456 }
  ];

  return (
    <div className="space-y-6">
      {/* Operational KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operationalMetrics.map((metric, index) => (
          <Card key={index} className="shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant={metric.status === "excellent" ? "default" : "secondary"}>
                  {metric.trend}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                <p className="text-3xl font-black text-slate-800">{metric.value}</p>
                <p className="text-sm text-muted-foreground">Target: {metric.target}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hourly Efficiency Trends */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-600" />
            Hourly Operational Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="fulfillmentTime" stroke="#EF4444" strokeWidth={2} name="Fulfillment Time (min)" />
              <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} name="Accuracy %" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-600" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{dept.department}</h4>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{dept.satisfaction}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Efficiency</span>
                        <span className="font-bold">{dept.efficiency}%</span>
                      </div>
                      <Progress value={dept.efficiency} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Capacity</span>
                        <span className="font-bold">{dept.capacity}%</span>
                      </div>
                      <Progress value={dept.capacity} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-600" />
              Quality & Satisfaction Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{metric.metric}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-600">{metric.score}</span>
                        <span className="text-sm text-muted-foreground">/ 5.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress value={(metric.score / 5) * 100} className="h-2 flex-1 mr-4" />
                      <div className="text-right">
                        <Badge variant={metric.score >= metric.target ? "default" : "secondary"}>
                          Target: {metric.target}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{metric.reviews} reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Optimization Insights */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-orange-600" />
            Process Optimization Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2">Peak Hour Optimization</h4>
              <p className="text-sm text-green-700">Consider adding 2 more staff during 12-1 PM to reduce wait times by 15%</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-800 mb-2">Kitchen Workflow</h4>
              <p className="text-sm text-blue-700">Prep station reorganization could improve order fulfillment by 8%</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-800 mb-2">Technology Integration</h4>
              <p className="text-sm text-orange-700">Automated order tracking could reduce manual errors by 23%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
