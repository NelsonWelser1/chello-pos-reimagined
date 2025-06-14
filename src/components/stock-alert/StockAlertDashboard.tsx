
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Clock, Zap, Package, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  expiryDate: string;
  isPerishable: boolean;
  dailyUsage: number;
  leadTime: number;
}

interface StockPrediction extends Ingredient {
  daysUntilStockout: number;
  stockoutDate: string;
  urgency: 'critical' | 'high' | 'medium';
}

interface StockAlertDashboardProps {
  ingredients: Ingredient[];
  lowStockItems: Ingredient[];
  expiringItems: Ingredient[];
  stockoutPredictions: StockPrediction[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

export default function StockAlertDashboard({
  ingredients,
  lowStockItems,
  expiringItems,
  stockoutPredictions
}: StockAlertDashboardProps) {
  const criticalAlerts = stockoutPredictions.filter(p => p.urgency === 'critical').length;
  const totalAlerts = lowStockItems.length + expiringItems.length + criticalAlerts;

  // Chart data for stock levels
  const stockChartData = ingredients.slice(0, 6).map(item => ({
    name: item.name.split(' ')[0],
    current: item.currentStock,
    minimum: item.minimumStock,
    usage: item.dailyUsage
  }));

  // Pie chart data for categories
  const categoryData = ingredients.reduce((acc, item) => {
    const existing = acc.find(cat => cat.name === item.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="space-y-6">
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Critical Alerts</p>
                <p className="text-3xl font-black">{criticalAlerts}</p>
                <p className="text-red-200 text-sm">Immediate action needed</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Low Stock Items</p>
                <p className="text-3xl font-black">{lowStockItems.length}</p>
                <p className="text-orange-200 text-sm">Below minimum threshold</p>
              </div>
              <TrendingDown className="w-12 h-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Expiring Soon</p>
                <p className="text-3xl font-black">{expiringItems.length}</p>
                <p className="text-yellow-200 text-sm">Within 7 days</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Alerts</p>
                <p className="text-3xl font-black">{totalAlerts}</p>
                <p className="text-purple-200 text-sm">Across all categories</p>
              </div>
              <Zap className="w-12 h-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Stock Levels vs Minimum Threshold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#3b82f6" name="Current Stock" />
                <Bar dataKey="minimum" fill="#ef4444" name="Minimum Stock" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Inventory by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Section */}
      {criticalAlerts > 0 && (
        <Card className="border-red-300 bg-red-50 shadow-lg">
          <CardHeader className="bg-red-100 border-b border-red-200">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Stock Alerts - Immediate Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              {stockoutPredictions
                .filter(prediction => prediction.urgency === 'critical')
                .slice(0, 3)
                .map(prediction => (
                  <div key={prediction.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div>
                        <h4 className="font-bold text-gray-900">{prediction.name}</h4>
                        <p className="text-sm text-gray-600">
                          {prediction.currentStock} {prediction.unit} remaining
                        </p>
                        <p className="text-sm text-red-600 font-medium">
                          Stockout in {prediction.daysUntilStockout} days
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="destructive">Critical</Badge>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Reorder Now
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center gap-2">
              <Package className="w-6 h-6" />
              <span>Bulk Reorder</span>
            </Button>
            <Button className="h-16 bg-green-600 hover:bg-green-700 flex flex-col items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              <span>Generate Purchase Orders</span>
            </Button>
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <span>Schedule Deliveries</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
