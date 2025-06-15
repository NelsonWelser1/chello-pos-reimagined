
import { ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KitchenOrder } from "@/types/kitchen";
import KitchenOrderCard from "./KitchenOrderCard";

interface OrderCounts {
  pending: number;
  preparing: number;
  ready: number;
  total: number;
}

interface OrderManagementProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  orderCounts: OrderCounts;
  filteredOrders: KitchenOrder[];
  onUpdateOrderStatus: (orderId: string, status: KitchenOrder['status']) => void;
}

export default function OrderManagement({ 
  activeTab, 
  onTabChange, 
  orderCounts, 
  filteredOrders, 
  onUpdateOrderStatus 
}: OrderManagementProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-black text-slate-800">Order Queue Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all" className="font-bold">
              All Orders ({orderCounts.total})
            </TabsTrigger>
            <TabsTrigger value="pending" className="font-bold">
              Pending ({orderCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="preparing" className="font-bold">
              Preparing ({orderCounts.preparing})
            </TabsTrigger>
            <TabsTrigger value="ready" className="font-bold">
              Ready ({orderCounts.ready})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={onUpdateOrderStatus}
                />
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium text-lg">
                  No orders in this category
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  New orders from the POS system will appear here automatically
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
