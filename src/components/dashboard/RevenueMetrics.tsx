
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const revenueData = [
  { name: 'Food', value: 2840, color: '#3b82f6' },
  { name: 'Beverages', value: 1260, color: '#10b981' },
  { name: 'Desserts', value: 680, color: '#f59e0b' },
  { name: 'Others', value: 320, color: '#8b5cf6' },
];

export function RevenueMetrics() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <DollarSign className="w-5 h-5 text-purple-600" />
          Revenue Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {revenueData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">${item.value}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    +5.2%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
