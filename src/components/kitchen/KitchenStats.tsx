
import { AlertCircle, CheckCircle, Flame, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderCounts {
  pending: number;
  preparing: number;
  ready: number;
  total: number;
}

interface KitchenStatsProps {
  orderCounts: OrderCounts;
}

export default function KitchenStats({ orderCounts }: KitchenStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Pending Orders</p>
              <p className="text-3xl font-black text-orange-800">{orderCounts.pending}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">In Preparation</p>
              <p className="text-3xl font-black text-blue-800">{orderCounts.preparing}</p>
            </div>
            <Flame className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Ready to Serve</p>
              <p className="text-3xl font-black text-green-800">{orderCounts.ready}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Active</p>
              <p className="text-3xl font-black text-purple-800">{orderCounts.total}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
