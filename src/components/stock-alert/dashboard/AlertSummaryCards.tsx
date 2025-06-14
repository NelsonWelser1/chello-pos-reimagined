
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, TrendingDown, Clock, Zap } from "lucide-react";

interface AlertSummaryCardsProps {
  criticalAlerts: number;
  lowStockCount: number;
  expiringCount: number;
  totalAlerts: number;
}

export default function AlertSummaryCards({
  criticalAlerts,
  lowStockCount,
  expiringCount,
  totalAlerts
}: AlertSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Critical Alerts</p>
              <p className="text-3xl font-black">{criticalAlerts}</p>
              <p className="text-red-200 text-sm">Immediate action needed</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Low Stock Items</p>
              <p className="text-3xl font-black">{lowStockCount}</p>
              <p className="text-orange-200 text-sm">Below minimum threshold</p>
            </div>
            <TrendingDown className="w-12 h-12 text-orange-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Expiring Soon</p>
              <p className="text-3xl font-black">{expiringCount}</p>
              <p className="text-yellow-200 text-sm">Within 7 days</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Alerts</p>
              <p className="text-3xl font-black">{totalAlerts}</p>
              <p className="text-purple-200 text-sm">Across all categories</p>
            </div>
            <Zap className="w-12 h-12 text-purple-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
