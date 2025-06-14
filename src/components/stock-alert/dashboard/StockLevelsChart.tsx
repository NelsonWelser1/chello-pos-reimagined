
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Ingredient {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  dailyUsage: number;
}

interface StockLevelsChartProps {
  ingredients: Ingredient[];
}

export default function StockLevelsChart({ ingredients }: StockLevelsChartProps) {
  const stockChartData = ingredients.slice(0, 6).map(item => ({
    name: item.name.split(' ')[0],
    current: item.currentStock,
    minimum: item.minimumStock,
    usage: item.dailyUsage
  }));

  return (
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
  );
}
