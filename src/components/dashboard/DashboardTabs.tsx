
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesChart } from "./SalesChart";
import { OrdersChart } from "./OrdersChart";
import { RevenueMetrics } from "./RevenueMetrics";
import { LiveOrders } from "./LiveOrders";
import { TopItems } from "./TopItems";
import { QuickActions } from "./QuickActions";
import { StaffPerformance } from "./StaffPerformance";

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border shadow-lg">
        <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white">
          Live Orders
        </TabsTrigger>
        <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
          Performance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActions />
          <LiveOrders />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueMetrics />
          </div>
          <TopItems />
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <OrdersChart />
        </div>
        <RevenueMetrics />
      </TabsContent>

      <TabsContent value="orders" className="space-y-6">
        <LiveOrders />
      </TabsContent>

      <TabsContent value="performance" className="space-y-6">
        <StaffPerformance />
      </TabsContent>
    </Tabs>
  );
}
