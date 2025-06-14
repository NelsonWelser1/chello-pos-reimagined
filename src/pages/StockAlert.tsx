
import { useState, useMemo } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockAlertDashboard from "@/components/stock-alert/StockAlertDashboard";
import LowStockAlerts from "@/components/stock-alert/LowStockAlerts";
import ExpiryAlerts from "@/components/stock-alert/ExpiryAlerts";
import AlertSettings from "@/components/stock-alert/AlertSettings";
import StockPredictions from "@/components/stock-alert/StockPredictions";

// Mock data for demonstration
const mockIngredients = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    currentStock: 3,
    minimumStock: 10,
    maximumStock: 50,
    unit: "kg",
    costPerUnit: 3.50,
    supplier: "Fresh Farm Co",
    expiryDate: "2024-06-18",
    lastRestocked: "2024-06-15",
    isPerishable: true,
    storageLocation: "Cold Storage A",
    dailyUsage: 2.5,
    leadTime: 2
  },
  {
    id: "2",
    name: "Mozzarella Cheese",
    category: "Dairy",
    currentStock: 2,
    minimumStock: 5,
    maximumStock: 20,
    unit: "kg",
    costPerUnit: 12.99,
    supplier: "Dairy Excellence Ltd",
    expiryDate: "2024-06-19",
    lastRestocked: "2024-06-10",
    isPerishable: true,
    storageLocation: "Refrigerator B",
    dailyUsage: 1.8,
    leadTime: 1
  },
  {
    id: "3",
    name: "Olive Oil",
    category: "Oils & Fats",
    currentStock: 5,
    minimumStock: 8,
    maximumStock: 25,
    unit: "liters",
    costPerUnit: 8.75,
    supplier: "Mediterranean Oils",
    expiryDate: "2025-03-15",
    lastRestocked: "2024-05-20",
    isPerishable: false,
    storageLocation: "Pantry Shelf 3",
    dailyUsage: 0.8,
    leadTime: 3
  },
  {
    id: "4",
    name: "Whole Wheat Flour",
    category: "Grains & Flour",
    currentStock: 12,
    minimumStock: 20,
    maximumStock: 100,
    unit: "kg",
    costPerUnit: 2.25,
    supplier: "Golden Grain Mills",
    expiryDate: "2024-12-31",
    lastRestocked: "2024-06-01",
    isPerishable: false,
    storageLocation: "Dry Storage A",
    dailyUsage: 3.2,
    leadTime: 5
  },
  {
    id: "5",
    name: "Chicken Breast",
    category: "Meat & Poultry",
    currentStock: 1,
    minimumStock: 10,
    maximumStock: 30,
    unit: "kg",
    costPerUnit: 8.99,
    supplier: "Premium Poultry",
    expiryDate: "2024-06-17",
    lastRestocked: "2024-06-16",
    isPerishable: true,
    storageLocation: "Freezer A",
    dailyUsage: 4.1,
    leadTime: 1
  }
];

export default function StockAlert() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [alertSettings, setAlertSettings] = useState({
    lowStockThreshold: 7,
    expiryWarningDays: 7,
    autoReorderEnabled: false,
    emailNotifications: true,
    smsNotifications: false
  });

  // Calculate alerts
  const lowStockItems = useMemo(() => {
    return mockIngredients.filter(item => 
      item.currentStock <= item.minimumStock ||
      item.currentStock <= alertSettings.lowStockThreshold
    );
  }, [alertSettings.lowStockThreshold]);

  const expiringItems = useMemo(() => {
    return mockIngredients.filter(item => {
      if (!item.isPerishable) return false;
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= alertSettings.expiryWarningDays && daysUntilExpiry >= 0;
    });
  }, [alertSettings.expiryWarningDays]);

  const stockoutPredictions = useMemo(() => {
    return mockIngredients.map(item => {
      const daysUntilStockout = item.dailyUsage > 0 ? Math.floor(item.currentStock / item.dailyUsage) : 999;
      const stockoutDate = new Date();
      stockoutDate.setDate(stockoutDate.getDate() + daysUntilStockout);
      
      const urgency: 'critical' | 'high' | 'medium' = 
        daysUntilStockout <= item.leadTime ? 'critical' : 
        daysUntilStockout <= item.leadTime + 2 ? 'high' : 'medium';
      
      return {
        ...item,
        daysUntilStockout,
        stockoutDate: stockoutDate.toISOString(),
        urgency
      };
    }).filter(item => item.daysUntilStockout <= 14);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="p-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 min-h-screen">
            <div className="mb-8">
              <h1 className="text-5xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-4">
                🚨 Smart Stock Alert System
              </h1>
              <p className="text-xl text-gray-600 mt-4 font-medium">
                AI-powered inventory monitoring and predictive analytics
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 lg:w-2/3">
                <TabsTrigger value="dashboard" className="font-bold">Dashboard</TabsTrigger>
                <TabsTrigger value="low-stock" className="font-bold">Low Stock</TabsTrigger>
                <TabsTrigger value="expiry" className="font-bold">Expiry</TabsTrigger>
                <TabsTrigger value="predictions" className="font-bold">Predictions</TabsTrigger>
                <TabsTrigger value="settings" className="font-bold">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <StockAlertDashboard
                  ingredients={mockIngredients}
                  lowStockItems={lowStockItems}
                  expiringItems={expiringItems}
                  stockoutPredictions={stockoutPredictions}
                />
              </TabsContent>

              <TabsContent value="low-stock">
                <LowStockAlerts
                  lowStockItems={lowStockItems}
                  alertSettings={alertSettings}
                />
              </TabsContent>

              <TabsContent value="expiry">
                <ExpiryAlerts
                  expiringItems={expiringItems}
                  alertSettings={alertSettings}
                />
              </TabsContent>

              <TabsContent value="predictions">
                <StockPredictions
                  predictions={stockoutPredictions}
                  ingredients={mockIngredients}
                />
              </TabsContent>

              <TabsContent value="settings">
                <AlertSettings
                  settings={alertSettings}
                  onSettingsChange={setAlertSettings}
                />
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
