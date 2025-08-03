
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

// Type for creating order items that matches Supabase expectations
export interface CreateOrderItem {
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  modifiers?: any;
  special_instructions?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders((data as unknown as Order[]) || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders' as any)
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        return null;
      }

      if (data) {
        const newOrder = data as unknown as Order;
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
      }

      return null;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  const createOrderItems = async (items: CreateOrderItem[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('order_items' as any)
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

  const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('orders' as any)
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating order:', error);
        return false;
      }

      if (data) {
        const updatedOrder = data as unknown as Order;
        setOrders(prev => prev.map(order => order.id === orderId ? updatedOrder : order));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  };

  const fetchOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    try {
      const { data, error } = await supabase
        .from('order_items' as any)
        .select('*')
        .eq('order_id', orderId);

      if (error) {
        console.error('Error fetching order items:', error);
        return [];
      }

      return (data as unknown as OrderItem[]) || [];
    } catch (error) {
      console.error('Error fetching order items:', error);
      return [];
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
    updateOrder,
    fetchOrderItems,
    refetch: fetchOrders
  };
}
