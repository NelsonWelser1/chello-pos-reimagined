
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface StockPrediction {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  daysUntilStockout: number;
  urgency: 'critical' | 'high' | 'medium';
}

interface CriticalAlertsSectionProps {
  stockoutPredictions: StockPrediction[];
  criticalAlerts: number;
}

export default function CriticalAlertsSection({ 
  stockoutPredictions, 
  criticalAlerts 
}: CriticalAlertsSectionProps) {
  if (criticalAlerts === 0) return null;

  return (
    <Card className="border-red-300 bg-red-50 shadow-lg">
      <CardHeader className="bg-red-100 border-b border-red-200">
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Critical Stock Alerts - Immediate Action Required
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          {stockoutPredictions
            .filter(prediction => prediction.urgency === 'critical')
            .slice(0, 3)
            .map(prediction => (
              <div key={prediction.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{prediction.name}</h4>
                    <p className="text-sm text-gray-600">
                      {prediction.currentStock} {prediction.unit} remaining
                    </p>
                    <p className="text-sm text-red-600 font-medium">
                      Stockout in {prediction.daysUntilStockout} days
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="destructive">Critical</Badge>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Reorder Now
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
