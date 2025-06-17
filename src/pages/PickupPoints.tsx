
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PickupPointsHeader } from "@/components/pickup-points/PickupPointsHeader";
import { PickupPointsList } from "@/components/pickup-points/PickupPointsList";
import { OrderTracking } from "@/components/pickup-points/OrderTracking";
import { LocationManager } from "@/components/pickup-points/LocationManager";
import { PickupAnalytics } from "@/components/pickup-points/PickupAnalytics";
import { useState } from "react";

const PickupPoints = () => {
  const [activeTab, setActiveTab] = useState("locations");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 ml-80 bg-white">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
            <SidebarTrigger className="hover:bg-blue-50 transition-colors rounded-md p-2" />
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <PickupPointsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
              
              {activeTab === "locations" && <PickupPointsList />}
              {activeTab === "orders" && <OrderTracking />}
              {activeTab === "manager" && <LocationManager />}
              {activeTab === "analytics" && <PickupAnalytics />}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PickupPoints;
