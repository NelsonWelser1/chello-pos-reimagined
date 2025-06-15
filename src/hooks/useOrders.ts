
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  modifiers?: any;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        return null;
      }

      if (data) {
        setOrders(prev => [data, ...prev]);
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  const createOrderItems = async (items: Partial<OrderItem>[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('order_items')
        .insert(items);

      if (error) {
        console.error('Error creating order items:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating order items:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    createOrder,
    createOrderItems,
    refetch: fetchOrders
  };
}
