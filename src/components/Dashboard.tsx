
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Coffee,
  UtensilsCrossed,
  Pizza,
  Cake
} from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🏠</span>
            </div>
            Welcome to Chello Restaurant POS
          </h1>
          <p className="text-slate-600 mt-2">Manage your restaurant operations efficiently</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">$2,847</p>
                <p className="text-xs opacity-80">+12% from yesterday</p>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs opacity-80">23 pending</p>
              </div>
              <ShoppingCart className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs opacity-80">+8 new today</p>
              </div>
              <Users className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">$32</p>
                <p className="text-xs opacity-80">+5% this week</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex-col bg-slate-800 hover:bg-slate-700">
                <ShoppingCart className="w-6 h-6 mb-2" />
                <span>New Order</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Coffee className="w-6 h-6 mb-2" />
                <span>Add Item</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Users className="w-6 h-6 mb-2" />
                <span>Manage Staff</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Pizza className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order #1234</p>
                    <p className="text-sm text-slate-600">Table 8 • $45.99</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Preparing
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order #1235</p>
                    <p className="text-sm text-slate-600">Table 3 • $28.50</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Cake className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order #1236</p>
                    <p className="text-sm text-slate-600">Table 12 • $67.25</p>
                  </div>
                </div>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Point of Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Streamlined ordering system with intuitive interface for quick and accurate order processing.
            </p>
            <Button variant="outline" size="sm">
              Access POS
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Kitchen Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Real-time order tracking and kitchen display system to optimize food preparation workflow.
            </p>
            <Button variant="outline" size="sm">
              View Kitchen
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Analytics & Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Comprehensive reporting and analytics to track sales, inventory, and business performance.
            </p>
            <Button variant="outline" size="sm">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
