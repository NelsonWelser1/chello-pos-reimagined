
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, Clock, DollarSign, Table as TableIcon, Calendar } from "lucide-react";

export function TableAnalytics() {
  const occupancyData = [
    { hour: "11:00", occupancy: 25 },
    { hour: "12:00", occupancy: 45 },
    { hour: "13:00", occupancy: 75 },
    { hour: "14:00", occupancy: 60 },
    { hour: "15:00", occupancy: 30 },
    { hour: "16:00", occupancy: 20 },
    { hour: "17:00", occupancy: 40 },
    { hour: "18:00", occupancy: 85 },
    { hour: "19:00", occupancy: 95 },
    { hour: "20:00", occupancy: 90 },
    { hour: "21:00", occupancy: 70 },
    { hour: "22:00", occupancy: 45 },
  ];

  const tablePerformanceData = [
    { table: "Table 1", revenue: 1250, turnover: 4.2 },
    { table: "Table 2", revenue: 890, turnover: 3.8 },
    { table: "Table 3", revenue: 1580, turnover: 3.5 },
    { table: "Table 4", revenue: 920, turnover: 4.0 },
    { table: "Table 5", revenue: 2100, turnover: 2.8 },
    { table: "Table 6", revenue: 740, turnover: 4.5 },
  ];

  const statusDistribution = [
    { name: "Available", value: 35, color: "#10b981" },
    { name: "Occupied", value: 45, color: "#ef4444" },
    { name: "Reserved", value: 15, color: "#f59e0b" },
    { name: "Cleaning", value: 5, color: "#6b7280" },
  ];

  const waitTimeData = [
    { day: "Mon", avgWait: 12 },
    { day: "Tue", avgWait: 8 },
    { day: "Wed", avgWait: 15 },
    { day: "Thu", avgWait: 18 },
    { day: "Fri", avgWait: 25 },
    { day: "Sat", avgWait: 35 },
    { day: "Sun", avgWait: 28 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Table Analytics</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Occupancy</p>
                <p className="text-2xl font-bold text-blue-600">68%</p>
                <p className="text-xs text-gray-500">24/35 tables occupied</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-yellow-600">12 min</p>
                <p className="text-xs text-gray-500">-3 min from yesterday</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Table Turnover</p>
                <p className="text-2xl font-bold text-green-600">3.8x</p>
                <p className="text-xs text-gray-500">+0.2 from last week</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                <p className="text-2xl font-bold text-purple-600">$8,450</p>
                <p className="text-xs text-gray-500">+12% from yesterday</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Occupancy"]} />
                <Bar dataKey="occupancy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Table Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Table Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Table Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tablePerformanceData.map((table) => (
                <div key={table.table} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{table.table}</span>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">${table.revenue}</Badge>
                      <Badge>{table.turnover}x turnover</Badge>
                    </div>
                  </div>
                  <Progress value={(table.revenue / 2500) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wait Time Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Wait Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waitTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} min`, "Avg Wait Time"]} />
                <Line type="monotone" dataKey="avgWait" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <TableIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">35</p>
              <p className="text-sm text-gray-600">Total Tables</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">124</p>
              <p className="text-sm text-gray-600">Reservations Today</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">186</p>
              <p className="text-sm text-gray-600">Customers Served</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
