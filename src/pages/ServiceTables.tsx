
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ServiceTablesHeader } from "@/components/service-tables/ServiceTablesHeader";
import { TableLayout } from "@/components/service-tables/TableLayout";
import { TableManagement } from "@/components/service-tables/TableManagement";
import { ReservationManager } from "@/components/service-tables/ReservationManager";
import { TableAnalytics } from "@/components/service-tables/TableAnalytics";
import { useState } from "react";

const ServiceTables = () => {
  const [activeTab, setActiveTab] = useState("layout");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <ServiceTablesHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === "layout" && <TableLayout />}
            {activeTab === "management" && <TableManagement />}
            {activeTab === "reservations" && <ReservationManager />}
            {activeTab === "analytics" && <TableAnalytics />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ServiceTables;
