
import { useState } from "react";
import { ChefHat, Grid3X3, Grid2X2, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

type DisplayMode = 'compact' | 'standard' | 'large';

export default function OrderManagement({ 
  activeTab, 
  onTabChange, 
  orderCounts, 
  filteredOrders, 
  onUpdateOrderStatus 
}: OrderManagementProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('standard');

  const getGridClasses = () => {
    switch (displayMode) {
      case 'compact':
        return 'grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4';
      case 'standard':
        return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';
      case 'large':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8';
      default:
        return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';
    }
  };
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black text-slate-800">Order Queue Management</CardTitle>
          <ToggleGroup 
            type="single" 
            value={displayMode} 
            onValueChange={(value: DisplayMode) => value && setDisplayMode(value)}
            className="border rounded-lg p-1"
          >
            <ToggleGroupItem value="compact" aria-label="Compact view" size="sm">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="standard" aria-label="Standard view" size="sm">
              <Grid2X2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="large" aria-label="Large view" size="sm">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
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
            <div className={getGridClasses()}>
              {filteredOrders.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={onUpdateOrderStatus}
                  compact={displayMode === 'compact'}
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
