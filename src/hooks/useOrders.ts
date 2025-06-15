
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
  customer_id?: string;
  staff_id?: string;
  table_number?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  modifiers?: any;
  special_instructions?: string;
  created_at?: string;
  updated_at?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Use raw SQL query to fetch orders since the types aren't updated yet
      const { data, error } = await supabase
        .rpc('get_orders_with_items', {});

      if (error) {
        console.error('Error fetching orders:', error);
        // Fallback to basic query
        const { data: basicOrders, error: basicError } = await supabase
          .from('orders' as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (basicError) {
          toast({
            title: 'Error fetching orders',
            description: basicError.message,
            variant: 'destructive',
          });
          setOrders([]);
        } else {
          setOrders(basicOrders || []);
        }
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error in fetchOrders:', error);
      setOrders([]);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (orderData: {
    total_amount: number;
    subtotal: number;
    tax_amount: number;
    payment_method: string;
    status: string;
    items: Array<{
      menu_item_id: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
  }) => {
    try {
      // Insert order using any type to bypass TypeScript errors
      const { data: order, error: orderError } = await (supabase as any)
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

        const { error: itemsError } = await (supabase as any)
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
