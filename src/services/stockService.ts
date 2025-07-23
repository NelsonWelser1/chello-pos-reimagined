
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { type MenuItemIngredient, type StockAdjustment, type RecipeFormData } from '@/types/stock';

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

export class StockService {
  // Recipe Management
  static async getMenuItemRecipe(menuItemId: string): Promise<MenuItemIngredient[]> {
    try {
      const { data, error } = await supabase
        .from('menu_item_ingredients')
        .select(`
          *,
          ingredients:ingredient_id (
            id,
            name,
            unit,
            current_stock,
            minimum_stock
          )
        `)
        .eq('menu_item_id', menuItemId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching menu item recipe:', error);
      toast({
        title: "Error",
        description: "Failed to load recipe information.",
        variant: "destructive",
      });
      return [];
    }
  }

  static async saveMenuItemRecipe(recipeData: RecipeFormData): Promise<boolean> {
    try {
      // First, delete existing recipe ingredients
      const { error: deleteError } = await supabase
        .from('menu_item_ingredients')
        .delete()
        .eq('menu_item_id', recipeData.menu_item_id);

      if (deleteError) throw deleteError;

      // Insert new recipe ingredients
      if (recipeData.ingredients.length > 0) {
        const ingredientsToInsert = recipeData.ingredients.map(ing => ({
          menu_item_id: recipeData.menu_item_id,
          ingredient_id: ing.ingredient_id,
          quantity_required: ing.quantity_required,
          unit: ing.unit
        }));

        const { error: insertError } = await supabase
          .from('menu_item_ingredients')
          .insert(ingredientsToInsert);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Recipe saved successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Stock Adjustments
  static async createStockAdjustment(adjustment: Omit<StockAdjustment, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('stock_adjustments')
        .insert([adjustment]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Stock ${adjustment.adjustment_type} recorded successfully!`,
      });
      return true;
    } catch (error) {
      console.error('Error creating stock adjustment:', error);
      toast({
        title: "Error",
        description: "Failed to record stock adjustment.",
        variant: "destructive",
      });
      return false;
    }
  }

  static async getStockAdjustments(ingredientId?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('stock_adjustments')
        .select(`
          *,
          ingredient:ingredient_id (name),
          staff:performed_by_staff_id (name)
        `)
        .order('created_at', { ascending: false });

      if (ingredientId) {
        query = query.eq('ingredient_id', ingredientId);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching stock adjustments:', error);
      return [];
    }
  }

  // Stock Validation
  static async validateStockForOrder(orderItems: { menu_item_id: string; quantity: number }[]): Promise<{
    valid: boolean;
    insufficientIngredients: string[];
  }> {
    try {
      const insufficientIngredients: string[] = [];

      for (const item of orderItems) {
        const recipe = await this.getMenuItemRecipe(item.menu_item_id);
        
        for (const ingredient of recipe) {
          const requiredQuantity = ingredient.quantity_required * item.quantity;
          const { data: ingredientData } = await supabase
            .from('ingredients')
            .select('current_stock, name')
            .eq('id', ingredient.ingredient_id)
            .single();

          if (ingredientData && ingredientData.current_stock < requiredQuantity) {
            insufficientIngredients.push(ingredientData.name);
          }
        }
      }

      return {
        valid: insufficientIngredients.length === 0,
        insufficientIngredients
      };
    } catch (error) {
      console.error('Error validating stock:', error);
      return { valid: false, insufficientIngredients: [] };
    }
  }

  // Stock Alerts
  static async getStockAlerts(): Promise<any[]> {
    try {
      // Get all ingredients and filter in JavaScript to avoid PostgreSQL comparison issues
      const { data: allIngredients, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*');

      if (ingredientsError) throw ingredientsError;

      // Filter low stock ingredients in JavaScript
      const lowStockIngredients = allIngredients?.filter(ingredient => 
        ingredient.current_stock <= ingredient.minimum_stock || ingredient.current_stock === 0
      ) || [];

      // Get menu items with low stock
      const { data: lowStockMenuItems, error: menuItemsError } = await supabase
        .from('menu_items')
        .select('*')
        .or('stock_count.lte.low_stock_alert,stock_count.eq.0');

      if (menuItemsError) throw menuItemsError;

      const alerts = [];

      // Create alerts for ingredients
      lowStockIngredients?.forEach(ingredient => {
        alerts.push({
          id: `ingredient-${ingredient.id}`,
          type: ingredient.current_stock === 0 ? 'out_of_stock' : 'low_stock',
          severity: ingredient.current_stock === 0 ? 'critical' : 'high',
          message: `${ingredient.name} is ${ingredient.current_stock === 0 ? 'out of stock' : 'running low'}`,
          ingredient_id: ingredient.id,
          created_at: new Date().toISOString()
        });
      });

      // Create alerts for menu items
      lowStockMenuItems?.forEach(item => {
        alerts.push({
          id: `menu-item-${item.id}`,
          type: item.stock_count === 0 ? 'out_of_stock' : 'low_stock',
          severity: item.stock_count === 0 ? 'critical' : 'medium',
          message: `${item.name} is ${item.stock_count === 0 ? 'out of stock' : 'running low'}`,
          menu_item_id: item.id,
          created_at: new Date().toISOString()
        });
      });

      return alerts;
    } catch (error) {
      console.error('Error fetching stock alerts:', error);
      return [];
    }
  }
}
