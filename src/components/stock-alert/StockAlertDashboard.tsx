
import AlertSummaryCards from "./dashboard/AlertSummaryCards";
import StockLevelsChart from "./dashboard/StockLevelsChart";
import CategoryPieChart from "./dashboard/CategoryPieChart";
import CriticalAlertsSection from "./dashboard/CriticalAlertsSection";
import QuickActionsSection from "./dashboard/QuickActionsSection";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  expiryDate: string;
  isPerishable: boolean;
  dailyUsage: number;
  leadTime: number;
}

interface StockPrediction extends Ingredient {
  daysUntilStockout: number;
  stockoutDate: string;
  urgency: 'critical' | 'high' | 'medium';
}

interface StockAlertDashboardProps {
  ingredients: Ingredient[];
  lowStockItems: Ingredient[];
  expiringItems: Ingredient[];
  stockoutPredictions: StockPrediction[];
}

export default function StockAlertDashboard({
  ingredients,
  lowStockItems,
  expiringItems,
  stockoutPredictions
}: StockAlertDashboardProps) {
  const criticalAlerts = stockoutPredictions.filter(p => p.urgency === 'critical').length;
  const totalAlerts = lowStockItems.length + expiringItems.length + criticalAlerts;

  return (
    <div className="space-y-6">
      <AlertSummaryCards
        criticalAlerts={criticalAlerts}
        lowStockCount={lowStockItems.length}
        expiringCount={expiringItems.length}
        totalAlerts={totalAlerts}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockLevelsChart ingredients={ingredients} />
        <CategoryPieChart ingredients={ingredients} />
      </div>

      <CriticalAlertsSection
        stockoutPredictions={stockoutPredictions}
        criticalAlerts={criticalAlerts}
      />

      <QuickActionsSection />
    </div>
  );
}
