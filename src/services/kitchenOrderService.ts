
import { supabase } from "@/integrations/supabase/client";

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
