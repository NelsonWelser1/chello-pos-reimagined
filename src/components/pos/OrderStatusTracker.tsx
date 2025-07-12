import { useState, useEffect } from "react";
import { Clock, CheckCircle, Truck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { useKitchenOrders } from "@/hooks/useKitchenOrders";
import { useToast } from "@/hooks/use-toast";

export default function OrderStatusTracker() {
  const { orders, refetch: refetchOrders } = useOrders();
  const { orders: kitchenOrders, updateOrderStatus } = useKitchenOrders();
  const { toast } = useToast();

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchOrders();
    }, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [refetchOrders]);

  const getOrderKitchenStatus = (orderId: string) => {
    return kitchenOrders.find(ko => ko.order_id === orderId);
  };

  const handleMarkAsServed = async (kitchenOrder: any) => {
    try {
      const success = await updateOrderStatus(kitchenOrder.id, 'served');
      if (success) {
        toast({
          title: "Order Marked as Served",
          description: `Order ${kitchenOrder.order_number} has been marked as served.`,
        });
      }
    } catch (error) {
      console.error('Error marking order as served:', error);
      toast({
        title: "Error",
        description: "Failed to mark order as served.",
        variant: "destructive",
      });
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'completed');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Active Orders ({activeOrders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {activeOrders.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            No active orders
          </div>
        ) : (
          activeOrders.map(order => {
            const kitchenOrder = getOrderKitchenStatus(order.id);
            const status = kitchenOrder?.status || 'pending';
            
            return (
              <div key={order.id} className="p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={status === 'ready' ? 'default' : 'secondary'}
                      className={`${
                        status === 'pending' ? 'bg-yellow-500' :
                        status === 'preparing' ? 'bg-blue-500' :
                        status === 'ready' ? 'bg-green-500' :
                        'bg-gray-500'
                      } text-white`}
                    >
                      {status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {status === 'preparing' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {status === 'ready' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {status === 'served' && <Truck className="w-3 h-3 mr-1" />}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                    <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                  </div>
                  <span className="text-sm text-slate-600">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
                
                <div className="text-sm text-slate-600 mb-2">
                  Payment: {order.payment_method.toUpperCase()} • Table: {order.table_number || 'N/A'}
                </div>
                
                {status === 'ready' && kitchenOrder && (
                  <Button
                    onClick={() => handleMarkAsServed(kitchenOrder)}
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Mark as Served
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}