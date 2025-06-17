
import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockAlertDashboard from "@/components/stock-alert/StockAlertDashboard";
import LowStockAlerts from "@/components/stock-alert/LowStockAlerts";
import ExpiryAlerts from "@/components/stock-alert/ExpiryAlerts";
import AlertSettings from "@/components/stock-alert/AlertSettings";
import StockPredictions from "@/components/stock-alert/StockPredictions";
import AutomatedReorderSystem from "@/components/stock-alert/AutomatedReorderSystem";
import SupplierIntegration from "@/components/stock-alert/SupplierIntegration";
import SystemIntegrationHub from "@/components/stock-alert/SystemIntegrationHub";
import StockAlertHeader from "@/components/stock-alert/StockAlertHeader";
import { mockIngredients } from "@/data/mockIngredients";
import { useStockAlerts, AlertSettings as AlertSettingsType } from "@/hooks/useStockAlerts";

export default function StockAlert() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [alertSettings, setAlertSettings] = useState<AlertSettingsType>({
    lowStockThreshold: 7,
    expiryWarningDays: 7,
    autoReorderEnabled: false,
    emailNotifications: true,
    smsNotifications: false
  });

  const { lowStockItems, expiringItems, stockoutPredictions } = useStockAlerts(mockIngredients, alertSettings);

  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log(`Notification ${notificationId} action: ${action}`);
    // Here you would integrate with other systems based on the action
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 ml-80 bg-white">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
            <SidebarTrigger className="hover:bg-red-50 transition-colors rounded-md p-2" />
          </div>
          
          <div className="p-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 min-h-[calc(100vh-80px)]">
            <StockAlertHeader onNotificationAction={handleNotificationAction} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-8 lg:w-4/5 bg-white border border-gray-200">
                <TabsTrigger value="dashboard" className="font-bold">Dashboard</TabsTrigger>
                <TabsTrigger value="low-stock" className="font-bold">Low Stock</TabsTrigger>
                <TabsTrigger value="expiry" className="font-bold">Expiry</TabsTrigger>
                <TabsTrigger value="predictions" className="font-bold">Predictions</TabsTrigger>
                <TabsTrigger value="automation" className="font-bold">Automation</TabsTrigger>
                <TabsTrigger value="suppliers" className="font-bold">Suppliers</TabsTrigger>
                <TabsTrigger value="integration" className="font-bold">Integration</TabsTrigger>
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

              <TabsContent value="automation">
                <AutomatedReorderSystem />
              </TabsContent>

              <TabsContent value="suppliers">
                <SupplierIntegration />
              </TabsContent>

              <TabsContent value="integration">
                <SystemIntegrationHub />
              </TabsContent>

              <TabsContent value="settings">
                <AlertSettings
                  settings={alertSettings}
                  onSettingsChange={setAlertSettings}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
