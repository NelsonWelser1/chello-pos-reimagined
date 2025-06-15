
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

export const updateStockCounts = async (cart: CartItem[], menuItems: MenuItem[]) => {
  try {
    for (const item of cart) {
      const menuItem = menuItems.find(m => m.id === item.id);
      if (menuItem) {
        const newStockCount = Math.max(0, menuItem.stock_count - item.quantity);
        
        const { error } = await supabase
          .from('menu_items')
          .update({ stock_count: newStockCount })
          .eq('id', item.id);

        if (error) {
          console.error('Error updating stock:', error);
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Error updating stock counts:', error);
    throw error;
  }
};
