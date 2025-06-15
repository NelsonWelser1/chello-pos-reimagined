
import { supabase } from "@/integrations/supabase/client";
import { KitchenOrder, KitchenOrderItem } from "@/types/kitchen";

export const fetchKitchenOrders = async (): Promise<KitchenOrder[]> => {
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
    return [];
  }

  // Transform data to match our interface
  return (kitchenOrders || []).map((kitchenOrder: any) => {
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
};

export const updateKitchenOrderStatus = async (
  kitchenOrderId: string, 
  newStatus: KitchenOrder['status']
): Promise<boolean> => {
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
    return false;
  }

  return true;
};

export const createKitchenOrderFromOrder = async (
  orderId: string, 
  priority: 'low' | 'medium' | 'high' = 'medium'
) => {
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

  return data;
};
