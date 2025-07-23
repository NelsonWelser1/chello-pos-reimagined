
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertTriangle, Coffee, Pizza, Cake, Eye } from "lucide-react";

const liveOrders = [
  {
    id: "#1234",
    table: "Table 8",
    amount: "UGX 45,990",
    status: "preparing",
    time: "12:34 PM",
    items: ["Margherita Pizza", "Caesar Salad"],
    icon: Pizza,
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    id: "#1235",
    table: "Table 3",
    amount: "UGX 28,500",
    status: "ready",
    time: "12:28 PM",
    items: ["Cappuccino", "Croissant"],
    icon: Coffee,
    color: "bg-green-100 text-green-800"
  },
  {
    id: "#1236",
    table: "Table 12",
    amount: "UGX 67,250",
    status: "pending",
    time: "12:42 PM",
    items: ["Chocolate Cake", "Espresso"],
    icon: Cake,
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: "#1237",
    table: "Table 5",
    amount: "UGX 32,800",
    status: "urgent",
    time: "12:15 PM",
    items: ["Grilled Chicken", "Fries"],
    icon: AlertTriangle,
    color: "bg-red-100 text-red-800"
  },
];

export function LiveOrders() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Live Orders
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {liveOrders.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {liveOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-white/70 rounded-lg border hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                  <order.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800">{order.id}</p>
                    <Badge className={order.color}>
                      {order.status === 'preparing' && <Clock className="w-3 h-3 mr-1" />}
                      {order.status === 'ready' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {order.status === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{order.table} • {order.amount}</p>
                  <p className="text-xs text-slate-500">{order.items.join(", ")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600">{order.time}</p>
                <Button size="sm" variant="outline" className="mt-2">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
