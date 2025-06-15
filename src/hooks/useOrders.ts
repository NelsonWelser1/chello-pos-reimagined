
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export interface Order {
  id: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  payment_method: string;
  status: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id?: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  menu_item?: {
    name: string;
    category: string;
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_item:menu_items (
            name,
            category
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching orders',
        description: error.message,
        variant: 'destructive',
      });
      setOrders([]);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          total_amount: orderData.total_amount,
          subtotal: orderData.subtotal,
          tax_amount: orderData.tax_amount,
          payment_method: orderData.payment_method,
          status: orderData.status
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      if (order && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: order.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      await fetchOrders();
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error creating order',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    orders,
    loading,
    createOrder,
    refetch: fetchOrders
  };
}
