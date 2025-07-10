import { useState, useEffect } from "react";
import { Clock, ChefHat, CheckCircle, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useKitchenOrders, type KitchenOrder } from "@/hooks/useKitchenOrders";
import { useToast } from "@/hooks/use-toast";
import BillingHandler from "./BillingHandler";

export default function KitchenMonitor() {
  const { orders, loading, refetch } = useKitchenOrders();

  const getStatusIcon = (status: KitchenOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'served':
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: KitchenOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      case 'served':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleBillGenerated = () => {
    // Refresh orders to get updated status
    refetch();
  };

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Kitchen Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-slate-600">Loading kitchen orders...</div>
        </CardContent>
      </Card>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');
  const servedOrders = orders.filter(order => order.status === 'served');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ChefHat className="w-5 h-5" />
          Kitchen Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Summary */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-yellow-50 p-2 rounded">
            <div className="text-lg font-bold text-yellow-700">{pendingOrders.length}</div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-lg font-bold text-blue-700">{preparingOrders.length}</div>
            <div className="text-xs text-blue-600">Preparing</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-lg font-bold text-green-700">{readyOrders.length}</div>
            <div className="text-xs text-green-600">Ready</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-lg font-bold text-gray-700">{servedOrders.length}</div>
            <div className="text-xs text-gray-600">Served</div>
          </div>
        </div>

        {/* Ready Orders - Ready for billing */}
        {readyOrders.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-green-700 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Ready for Billing ({readyOrders.length})
            </h4>
            {readyOrders.map(order => (
              <BillingHandler
                key={order.id}
                order={order}
                onBillGenerated={handleBillGenerated}
              />
            ))}
          </div>
        )}

        {/* Active Orders */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {orders.filter(order => order.status !== 'served').map(order => (
            <div key={order.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
                  {getStatusIcon(order.status)}
                </Badge>
                <div>
                  <div className="font-medium text-sm">{order.order_number}</div>
                  <div className="text-xs text-slate-600">
                    {order.customer_name} • {order.items.length} items
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                {order.estimated_time}min
              </div>
            </div>
          ))}
        </div>

        {orders.filter(order => order.status !== 'served').length === 0 && (
          <div className="text-center py-4 text-slate-500">
            No active kitchen orders
          </div>
        )}
      </CardContent>
    </Card>
  );
}