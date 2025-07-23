
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  ArrowUp,
  Target,
  Star,
  Zap
} from "lucide-react";

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium opacity-90 flex items-center justify-between">
            Today's Revenue
            <ArrowUp className="w-4 h-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">UGX 4,247,000</p>
              <p className="text-xs opacity-80 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18% from yesterday
              </p>
            </div>
            <DollarSign className="w-10 h-10 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium opacity-90 flex items-center justify-between">
            Orders Today
            <Target className="w-4 h-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">156</p>
              <p className="text-xs opacity-80">34 pending • 122 completed</p>
            </div>
            <ShoppingCart className="w-10 h-10 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium opacity-90 flex items-center justify-between">
            Active Customers
            <Zap className="w-4 h-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">89</p>
              <p className="text-xs opacity-80">+12 new customers</p>
            </div>
            <Users className="w-10 h-10 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium opacity-90 flex items-center justify-between">
            Avg. Order Value
            <Star className="w-4 h-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">UGX 42,000</p>
              <p className="text-xs opacity-80 flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                +8% this week
              </p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
