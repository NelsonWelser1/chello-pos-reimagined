
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  special_instructions?: string;
  prep_time: number;
  status: 'pending' | 'preparing' | 'ready';
}

export interface KitchenOrder {
  id: string;
  order_id: string;
  order_number: string;
  items: KitchenOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served';
  priority: 'low' | 'medium' | 'high';
  estimated_time: number;
  customer_name?: string;
  table_number?: number;
  created_at: string;
  notes?: string;
}

export function useKitchenOrders() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchKitchenOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch kitchen orders with related order data
      const { data: kitchenOrders, error: kitchenError } = await supabase
        .from('kitchen_orders')
        .select(`
          *,
          orders (
            id,
            table_number,
            customer_id,
            customers (
              name
            ),
            order_items (
              id,
              quantity,
              special_instructions,
              menu_items (
                name,
                preparation_time
              )
            )
          )
        `)
        .order('created_at', { ascending: true });

      if (kitchenError) {
        console.error('Error fetching kitchen orders:', kitchenError);
        return;
      }

      // Transform data to match our interface
      const transformedOrders: KitchenOrder[] = (kitchenOrders || []).map((kitchenOrder: any) => {
        const order = kitchenOrder.orders;
        const items: KitchenOrderItem[] = (order?.order_items || []).map((item: any) => ({
          id: item.id,
          name: item.menu_items?.name || 'Unknown Item',
          quantity: item.quantity,
          special_instructions: item.special_instructions,
          prep_time: item.menu_items?.preparation_time || 5,
          status: 'pending' as const
        }));

        return {
          id: kitchenOrder.id,
          order_id: kitchenOrder.order_id,
          order_number: `ORD-${order?.id?.slice(-3) || '000'}`,
          items,
          status: kitchenOrder.status,
          priority: kitchenOrder.priority,
          estimated_time: kitchenOrder.estimated_time,
          customer_name: order?.customers?.name || 'Walk-in Customer',
          table_number: order?.table_number,
          created_at: kitchenOrder.created_at,
          notes: kitchenOrder.notes
        };
      });

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (kitchenOrderId: string, newStatus: KitchenOrder['status']) => {
    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Add timestamps for status changes
      if (newStatus === 'preparing') {
        updateData.actual_start_time = new Date().toISOString();
      } else if (newStatus === 'ready') {
        updateData.actual_completion_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('kitchen_orders')
        .update(updateData)
        .eq('id', kitchenOrderId);

      if (error) {
        console.error('Error updating order status:', error);
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

  const createKitchenOrderFromOrder = async (orderId: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    try {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .insert([{
          order_id: orderId,
          priority,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating kitchen order:', error);
        return null;
      }

      // Refresh orders to include the new one
      await fetchKitchenOrders();
      return data;
    } catch (error) {
      console.error('Error creating kitchen order:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchKitchenOrders();

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
          fetchKitchenOrders();
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
    createKitchenOrderFromOrder,
    refetch: fetchKitchenOrders
  };
}
