
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KitchenOrder } from "@/types/kitchen";
import { 
  fetchKitchenOrders, 
  updateKitchenOrderStatus, 
  createKitchenOrderFromOrder 
} from "@/services/kitchenOrderService";

export function useKitchenOrders() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadKitchenOrders = async () => {
    try {
      setLoading(true);
      const kitchenOrders = await fetchKitchenOrders();
      setOrders(kitchenOrders);
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (kitchenOrderId: string, newStatus: KitchenOrder['status']) => {
    try {
      const success = await updateKitchenOrderStatus(kitchenOrderId, newStatus);
      
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive"
        });
        return false;
      }

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === kitchenOrderId 
          ? { ...order, status: newStatus }
          : order
      ));

      const order = orders.find(o => o.id === kitchenOrderId);
      if (order) {
        toast({
          title: "Order Updated",
          description: `Order ${order.order_number} marked as ${newStatus}`,
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  const createKitchenOrder = async (orderId: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    try {
      const data = await createKitchenOrderFromOrder(orderId, priority);
      
      if (data) {
        // Refresh orders to include the new one
        await loadKitchenOrders();
      }
      
      return data;
    } catch (error) {
      console.error('Error creating kitchen order:', error);
      return null;
    }
  };

  useEffect(() => {
    loadKitchenOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel('kitchen-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kitchen_orders'
        },
        () => {
          console.log('Kitchen orders updated, refreshing...');
          loadKitchenOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    orders,
    loading,
    updateOrderStatus,
    createKitchenOrderFromOrder: createKitchenOrder,
    refetch: loadKitchenOrders
  };
}

// Export types for backward compatibility
export type { KitchenOrder, KitchenOrderItem } from "@/types/kitchen";
