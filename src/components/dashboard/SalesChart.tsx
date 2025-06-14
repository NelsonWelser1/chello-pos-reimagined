
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from "lucide-react";

const salesData = [
  { time: '9:00', sales: 120, orders: 8 },
  { time: '10:00', sales: 280, orders: 15 },
  { time: '11:00', sales: 450, orders: 22 },
  { time: '12:00', sales: 680, orders: 35 },
  { time: '13:00', sales: 920, orders: 48 },
  { time: '14:00', sales: 750, orders: 38 },
  { time: '15:00', sales: 580, orders: 28 },
  { time: '16:00', sales: 640, orders: 32 },
  { time: '17:00', sales: 820, orders: 42 },
  { time: '18:00', sales: 1100, orders: 55 },
  { time: '19:00', sales: 1350, orders: 67 },
  { time: '20:00', sales: 980, orders: 45 },
];

export function SalesChart() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Sales Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
