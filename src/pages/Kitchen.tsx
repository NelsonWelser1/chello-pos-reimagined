
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useKitchenOrders, type KitchenOrder } from "@/hooks/useKitchenOrders";
import { useKitchenSounds } from "@/hooks/useKitchenSounds";
import { useToast } from "@/hooks/use-toast";
import KitchenHeader from "@/components/kitchen/KitchenHeader";
import KitchenStats from "@/components/kitchen/KitchenStats";
import OrderManagement from "@/components/kitchen/OrderManagement";
import { getOrderCounts, filterOrders } from "@/utils/kitchenUtils";

export default function Kitchen() {
  const { orders, loading, updateOrderStatus } = useKitchenOrders();
  const { soundEnabled, toggleSound, playReadyAlert } = useKitchenSounds();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [previousReadyCount, setPreviousReadyCount] = useState(0);

  const orderCounts = getOrderCounts(orders);
  const filteredOrders = filterOrders(orders, activeTab);

  // Sound alert when new orders become ready
  useEffect(() => {
    const currentReadyCount = orderCounts.ready;
    if (currentReadyCount > previousReadyCount && previousReadyCount > 0) {
      playReadyAlert();
      toast({
        title: "🔔 Order Ready!",
        description: `${currentReadyCount - previousReadyCount} order(s) ready to serve`,
        duration: 5000,
      });
    }
    setPreviousReadyCount(currentReadyCount);
  }, [orderCounts.ready, previousReadyCount, playReadyAlert, toast]);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 ml-0 border-l border-gray-200 bg-white">
            <KitchenHeader soundEnabled={soundEnabled} onToggleSound={toggleSound} />
            
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-xl text-slate-600">Loading kitchen orders...</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 ml-0 border-l border-gray-200 bg-white">
          <KitchenHeader soundEnabled={soundEnabled} onToggleSound={toggleSound} />
          
          <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6 min-h-[calc(100vh-80px)]">
            <div className="max-w-7xl mx-auto">
              <KitchenStats orderCounts={orderCounts} />
              
              <OrderManagement
                activeTab={activeTab}
                onTabChange={setActiveTab}
                orderCounts={orderCounts}
                filteredOrders={filteredOrders}
                onUpdateOrderStatus={updateOrderStatus}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
