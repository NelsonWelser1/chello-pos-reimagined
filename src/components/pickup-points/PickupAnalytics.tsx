
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Package, Users, MapPin } from "lucide-react";

export function PickupAnalytics() {
  const analyticsData = {
    totalOrders: 142,
    ordersChange: 12.5,
    avgWaitTime: 8.3,
    waitTimeChange: -15.2,
    pickupRate: 94.2,
    pickupRateChange: 2.1,
    customerSatisfaction: 4.7,
    satisfactionChange: 0.3
  };

  const locationPerformance = [
    { name: "Downtown Hub", orders: 65, avgWait: 7.2, satisfaction: 4.8 },
    { name: "Mall Location", orders: 45, avgWait: 9.1, satisfaction: 4.6 },
    { name: "University Campus", orders: 32, avgWait: 10.5, satisfaction: 4.5 }
  ];

  const hourlyData = [
    { hour: "8AM", orders: 5 },
    { hour: "9AM", orders: 12 },
    { hour: "10AM", orders: 18 },
    { hour: "11AM", orders: 22 },
    { hour: "12PM", orders: 35 },
    { hour: "1PM", orders: 42 },
    { hour: "2PM", orders: 28 },
    { hour: "3PM", orders: 15 },
    { hour: "4PM", orders: 25 },
    { hour: "5PM", orders: 38 },
    { hour: "6PM", orders: 32 },
    { hour: "7PM", orders: 20 }
  ];

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    suffix = "" 
  }: { 
    title: string; 
    value: number; 
    change: number; 
    icon: any; 
    suffix?: string; 
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}{suffix}</p>
          </div>
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <div className="flex items-center mt-2">
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">from last week</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pickup Analytics</h2>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Orders"
          value={analyticsData.totalOrders}
          change={analyticsData.ordersChange}
          icon={Package}
        />
        <MetricCard
          title="Avg Wait Time"
          value={analyticsData.avgWaitTime}
          change={analyticsData.waitTimeChange}
          icon={Clock}
          suffix=" min"
        />
        <MetricCard
          title="Pickup Rate"
          value={analyticsData.pickupRate}
          change={analyticsData.pickupRateChange}
          icon={Users}
          suffix="%"
        />
        <MetricCard
          title="Customer Satisfaction"
          value={analyticsData.customerSatisfaction}
          change={analyticsData.satisfactionChange}
          icon={TrendingUp}
          suffix="/5"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Location Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationPerformance.map((location) => (
                <div key={location.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{location.name}</h4>
                    <p className="text-sm text-gray-500">{location.orders} orders today</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{location.avgWait} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>{location.satisfaction}/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Orders by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hourlyData.map((data) => (
                <div key={data.hour} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{data.hour}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(data.orders / 42) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{data.orders}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-600">12</h3>
              <p className="text-sm text-orange-700">Orders in Preparation</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">8</h3>
              <p className="text-sm text-green-700">Ready for Pickup</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">3</h3>
              <p className="text-sm text-blue-700">Waiting for Customer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
