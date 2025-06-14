
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart } from "lucide-react";

const ordersData = [
  { day: 'Mon', orders: 45, completed: 42 },
  { day: 'Tue', orders: 52, completed: 48 },
  { day: 'Wed', orders: 38, completed: 35 },
  { day: 'Thu', orders: 61, completed: 58 },
  { day: 'Fri', orders: 78, completed: 72 },
  { day: 'Sat', orders: 95, completed: 89 },
  { day: 'Sun', orders: 87, completed: 82 },
];

export function OrdersChart() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <ShoppingCart className="w-5 h-5 text-green-600" />
          Weekly Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
