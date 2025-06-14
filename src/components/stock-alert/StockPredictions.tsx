
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, Calendar, Zap, Target, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  dailyUsage: number;
  leadTime: number;
}

interface StockPrediction extends Ingredient {
  daysUntilStockout: number;
  stockoutDate: string;
  urgency: 'critical' | 'high' | 'medium';
}

interface StockPredictionsProps {
  predictions: StockPrediction[];
  ingredients: Ingredient[];
}

export default function StockPredictions({ predictions, ingredients }: StockPredictionsProps) {
  // Generate prediction chart data for the next 14 days
  const generateChartData = (ingredient: Ingredient) => {
    const data = [];
    for (let day = 0; day <= 14; day++) {
      const predictedStock = Math.max(0, ingredient.currentStock - (ingredient.dailyUsage * day));
      data.push({
        day: `Day ${day}`,
        stock: predictedStock,
        minimum: ingredient.minimumStock || 0,
        dayNumber: day
      });
    }
    return data;
  };

  const urgencyColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500'
  };

  const urgencyLabels = {
    critical: 'CRITICAL',
    high: 'HIGH PRIORITY',
    medium: 'MONITOR'
  };

  // Get top 3 most critical items for detailed chart
  const topCriticalItems = predictions
    .filter(p => p.urgency === 'critical')
    .slice(0, 3);

  const calculateOptimalReorderPoint = (item: Ingredient) => {
    // Reorder point = (Daily usage × Lead time) + Safety stock
    const safetyStock = item.dailyUsage * 2; // 2 days safety stock
    return (item.dailyUsage * item.leadTime) + safetyStock;
  };

  const getRecommendedAction = (prediction: StockPrediction) => {
    if (prediction.urgency === 'critical') {
      return 'Order immediately';
    } else if (prediction.urgency === 'high') {
      return 'Prepare purchase order';
    } else {
      return 'Monitor closely';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <TrendingDown className="w-8 h-8" />
            AI-Powered Stock Predictions
          </CardTitle>
          <p className="text-purple-100">
            Predictive analytics based on consumption patterns and lead times
          </p>
        </CardHeader>
      </Card>

      {/* Prediction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium">Critical Stockouts</p>
                <p className="text-2xl font-bold text-red-700">
                  {predictions.filter(p => p.urgency === 'critical').length}
                </p>
                <p className="text-sm text-red-600">Within lead time</p>
              </div>
              <Zap className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium">High Priority</p>
                <p className="text-2xl font-bold text-orange-700">
                  {predictions.filter(p => p.urgency === 'high').length}
                </p>
                <p className="text-sm text-orange-600">Need attention soon</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium">Monitor Items</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {predictions.filter(p => p.urgency === 'medium').length}
                </p>
                <p className="text-sm text-yellow-600">Track consumption</p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Predictions Chart */}
      {topCriticalItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Critical Items - 14-Day Stock Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {topCriticalItems.map(item => {
                const chartData = generateChartData(item);
                return (
                  <div key={item.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <Badge className={`text-white ${urgencyColors[item.urgency]}`}>
                        {urgencyLabels[item.urgency]}
                      </Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} ${item.unit}`,
                            name === 'stock' ? 'Predicted Stock' : 'Minimum Level'
                          ]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="stock" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.3}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="minimum" 
                          stroke="#ef4444" 
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Stock Predictions ({predictions.length})
            </CardTitle>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Generate Purchase Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Daily Usage</TableHead>
                  <TableHead>Days Until Stockout</TableHead>
                  <TableHead>Stockout Date</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Optimal Reorder Point</TableHead>
                  <TableHead>Recommended Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map(prediction => {
                  const optimalReorderPoint = calculateOptimalReorderPoint(prediction);
                  const recommendedAction = getRecommendedAction(prediction);
                  
                  return (
                    <TableRow key={prediction.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{prediction.name}</div>
                          <div className="text-sm text-gray-500">{prediction.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {prediction.currentStock} {prediction.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        {prediction.dailyUsage} {prediction.unit}/day
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${urgencyColors[prediction.urgency]} ${
                            prediction.urgency === 'critical' ? 'animate-pulse' : ''
                          }`}></div>
                          <span className="font-medium">{prediction.daysUntilStockout} days</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(prediction.stockoutDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-white ${urgencyColors[prediction.urgency]}`}>
                          {urgencyLabels[prediction.urgency]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-blue-600">
                          {optimalReorderPoint.toFixed(1)} {prediction.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          className={
                            prediction.urgency === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                            prediction.urgency === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
                            'bg-yellow-600 hover:bg-yellow-700'
                          }
                        >
                          {recommendedAction}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div>
              <h4 className="font-bold mb-2">Consumption Patterns:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Weekday consumption is 20% higher than weekends</li>
                <li>Vegetable usage spikes during lunch hours</li>
                <li>Dairy products show seasonal variation patterns</li>
                <li>Consider adjusting order frequencies for better optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Optimization Opportunities:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Reduce order quantities for low-turnover items</li>
                <li>Negotiate bulk discounts for high-usage ingredients</li>
                <li>Consider alternative suppliers for better lead times</li>
                <li>Implement dynamic safety stock levels</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
