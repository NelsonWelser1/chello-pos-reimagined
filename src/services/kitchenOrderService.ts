
import { supabase } from "@/integrations/supabase/client";
import { KitchenOrder } from "@/types/kitchen";

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  image?: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  is_available: boolean;
  stock_count: number;
  preparation_time: number;
}

export const fetchKitchenOrders = async (): Promise<KitchenOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('kitchen_orders')
      .select(`
        *,
        orders!inner(
          order_number: id,
          customer_name: customers(name),
          table_number
        ),
        kitchen_order_items(
          *,
          order_items(
            *,
            menu_items(name)
          )
        )
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching kitchen orders:', error);
      throw error;
    }

    // Transform the data to match our KitchenOrder interface
    const transformedOrders: KitchenOrder[] = (data || []).map(order => ({
      id: order.id,
      order_id: order.order_id,
      order_number: `ORD-${order.orders.order_number.slice(-6)}`,
      status: order.status,
      priority: order.priority,
      estimated_time: order.estimated_time,
      customer_name: order.orders.customer_name?.name || 'Walk-in Customer',
      table_number: order.orders.table_number,
      created_at: order.created_at,
      notes: order.notes,
      items: (order.kitchen_order_items || []).map((item: any) => ({
        id: item.id,
        name: item.order_items?.menu_items?.name || 'Unknown Item',
        quantity: item.order_items?.quantity || 1,
        special_instructions: item.special_instructions,
        prep_time: item.prep_time,
        status: item.status
      }))
    }));

    return transformedOrders;
  } catch (error) {
    console.error('Error fetching kitchen orders:', error);
    throw error;
  }
};

export const updateKitchenOrderStatus = async (kitchenOrderId: string, status: KitchenOrder['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('kitchen_orders')
      .update({ 
        status,
        actual_start_time: status === 'preparing' ? new Date().toISOString() : undefined,
        actual_completion_time: status === 'ready' ? new Date().toISOString() : undefined
      })
      .eq('id', kitchenOrderId);

    if (error) {
      console.error('Error updating kitchen order status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating kitchen order status:', error);
    return false;
  }
};

export const createKitchenOrderFromOrder = async (orderId: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<any> => {
  try {
    // First, get the order details
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          menu_items(preparation_time)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      console.error('Error fetching order:', orderError);
      throw orderError;
    }

    // Calculate estimated time based on order items
    const maxPrepTime = Math.max(...(orderData.order_items || []).map((item: any) => 
      item.menu_items?.preparation_time || 5
    ));

    // Create kitchen order
    const { data: kitchenOrder, error: kitchenError } = await supabase
      .from('kitchen_orders')
      .insert([{
        order_id: orderId,
        priority,
        estimated_time: maxPrepTime + 5, // Add 5 minutes buffer
        status: 'pending'
      }])
      .select()
      .single();

    if (kitchenError) {
      console.error('Error creating kitchen order:', kitchenError);
      throw kitchenError;
    }

    // Create kitchen order items
    const kitchenOrderItems = (orderData.order_items || []).map((item: any) => ({
      kitchen_order_id: kitchenOrder.id,
      order_item_id: item.id,
      prep_time: item.menu_items?.preparation_time || 5,
      special_instructions: item.special_instructions,
      status: 'pending'
    }));

    const { error: itemsError } = await supabase
      .from('kitchen_order_items')
      .insert(kitchenOrderItems);

    if (itemsError) {
      console.error('Error creating kitchen order items:', itemsError);
      throw itemsError;
    }

    return kitchenOrder;
  } catch (error) {
    console.error('Error creating kitchen order from order:', error);
    throw error;
  }
};

export const createKitchenOrder = async (orderId: string, cart: CartItem[], menuItems: MenuItem[]) => {
  try {
    // Calculate estimated time based on menu items
    const maxPrepTime = Math.max(...cart.map(item => {
      const menuItem = menuItems.find(m => m.id === item.id);
      return menuItem?.preparation_time || 5;
    }));

    // Determine priority based on order size and complexity
    let priority: 'low' | 'medium' | 'high' = 'medium';
    if (cart.length > 5) priority = 'high';
    else if (cart.length <= 2) priority = 'low';

    const { error } = await supabase
      .from('kitchen_orders')
      .insert([{
        order_id: orderId,
        priority,
        estimated_time: maxPrepTime + 5, // Add 5 minutes buffer
        status: 'pending'
      }]);

    if (error) {
      console.error('Error creating kitchen order:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating kitchen order:', error);
    throw error;
  }
};
