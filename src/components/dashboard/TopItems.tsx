
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp } from "lucide-react";

const topItems = [
  { name: "Margherita Pizza", sales: 45, revenue: "UGX 540,000", trend: "+12%" },
  { name: "Caesar Salad", sales: 32, revenue: "UGX 384,000", trend: "+8%" },
  { name: "Cappuccino", sales: 67, revenue: "UGX 201,000", trend: "+15%" },
  { name: "Grilled Chicken", sales: 28, revenue: "UGX 420,000", trend: "+5%" },
  { name: "Chocolate Cake", sales: 19, revenue: "UGX 152,000", trend: "+3%" },
];

export function TopItems() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-600" />
          Top Selling Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topItems.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-600">{item.sales} sold today</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">{item.revenue}</p>
                <Badge variant="secondary" className="text-green-600 bg-green-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {item.trend}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
