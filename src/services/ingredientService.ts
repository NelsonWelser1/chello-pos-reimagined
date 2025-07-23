import { supabase } from "@/integrations/supabase/client";

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  cost_per_unit: number;
  supplier?: string;
  supplier_contact?: string;
  storage_location?: string;
  expiry_date?: string;
  last_restocked?: string;
  is_perishable: boolean;
  allergens: string[];
  nutritional_calories: number;
  nutritional_protein: number;
  nutritional_carbs: number;
  nutritional_fat: number;
  nutritional_fiber: number;
  created_at: string;
  updated_at: string;
}

export type NewIngredient = Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>;
export type UpdateIngredient = Partial<NewIngredient>;

export interface IngredientStats {
  totalIngredients: number;
  lowStockCount: number;
  expiringSoonCount: number;
  totalValue: number;
  averageCostPerUnit: number;
  categoryBreakdown: Record<string, number>;
  stockLevels: {
    healthy: number;
    warning: number;
    critical: number;
  };
}

export interface StockAdjustment {
  ingredient_id: string;
  adjustment_type: 'purchase' | 'waste' | 'correction' | 'transfer';
  quantity_change: number;
  cost_per_unit?: number;
  total_cost?: number;
  supplier?: string;
  reference_number?: string;
  reason?: string;
  notes?: string;
  performed_by_staff_id?: string;
}

export class IngredientService {
  // Get all ingredients
  static async getIngredients(): Promise<Ingredient[]> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getIngredients:', error);
      throw error;
    }
  }

  // Get ingredient by ID
  static async getIngredientById(id: string): Promise<Ingredient | null> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching ingredient by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getIngredientById:', error);
      return null;
    }
  }

  // Create new ingredient
  static async createIngredient(ingredientData: NewIngredient): Promise<Ingredient | null> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .insert(ingredientData)
        .select()
        .single();

      if (error) {
        console.error('Error creating ingredient:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createIngredient:', error);
      throw error;
    }
  }

  // Update ingredient
  static async updateIngredient(id: string, ingredientData: UpdateIngredient): Promise<Ingredient | null> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .update({ ...ingredientData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating ingredient:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateIngredient:', error);
      throw error;
    }
  }

  // Delete ingredient
  static async deleteIngredient(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting ingredient:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteIngredient:', error);
      throw error;
    }
  }

  // Get ingredient statistics
  static async getIngredientStats(): Promise<IngredientStats> {
    try {
      const ingredients = await this.getIngredients();
      
      const totalIngredients = ingredients.length;
      const lowStockCount = ingredients.filter(ing => 
        ing.current_stock <= ing.minimum_stock
      ).length;
      
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const expiringSoonCount = ingredients.filter(ing => 
        ing.expiry_date && new Date(ing.expiry_date) <= thirtyDaysFromNow
      ).length;

      const totalValue = ingredients.reduce((sum, ing) => 
        sum + (ing.current_stock * ing.cost_per_unit), 0
      );

      const averageCostPerUnit = totalIngredients > 0 
        ? ingredients.reduce((sum, ing) => sum + ing.cost_per_unit, 0) / totalIngredients 
        : 0;

      const categoryBreakdown = ingredients.reduce((acc, ing) => {
        acc[ing.category] = (acc[ing.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const stockLevels = ingredients.reduce((acc, ing) => {
        const stockRatio = ing.current_stock / ing.maximum_stock;
        if (stockRatio >= 0.5) acc.healthy++;
        else if (stockRatio >= 0.2) acc.warning++;
        else acc.critical++;
        return acc;
      }, { healthy: 0, warning: 0, critical: 0 });

      return {
        totalIngredients,
        lowStockCount,
        expiringSoonCount,
        totalValue,
        averageCostPerUnit,
        categoryBreakdown,
        stockLevels
      };
    } catch (error) {
      console.error('Error getting ingredient stats:', error);
      throw error;
    }
  }

  // Get low stock ingredients
  static async getLowStockIngredients(): Promise<Ingredient[]> {
    try {
      // Get ingredients with low stock using a simpler approach
      const { data: allIngredients, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('current_stock', { ascending: true });

      if (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
      }

      // Filter low stock ingredients on the client side
      const lowStockIngredients = (allIngredients || []).filter(
        ingredient => ingredient.current_stock <= ingredient.minimum_stock
      );

      return lowStockIngredients;
    } catch (error) {
      console.error('Error in getLowStockIngredients:', error);
      throw error;
    }
  }

  // Get expiring ingredients
  static async getExpiringIngredients(days = 30): Promise<Ingredient[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .not('expiry_date', 'is', null)
        .lte('expiry_date', futureDate.toISOString().split('T')[0])
        .order('expiry_date', { ascending: true });

      if (error) {
        console.error('Error fetching expiring ingredients:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getExpiringIngredients:', error);
      throw error;
    }
  }

  // Search ingredients
  static async searchIngredients(query: string): Promise<Ingredient[]> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,supplier.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error searching ingredients:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchIngredients:', error);
      throw error;
    }
  }

  // Adjust stock
  static async adjustStock(adjustment: StockAdjustment): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('stock_adjustments')
        .insert(adjustment);

      if (error) {
        console.error('Error adjusting stock:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in adjustStock:', error);
      throw error;
    }
  }

  // Get stock adjustment history
  static async getStockAdjustmentHistory(ingredientId?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('stock_adjustments')
        .select(`
          *,
          ingredients(name)
        `)
        .order('created_at', { ascending: false });

      if (ingredientId) {
        query = query.eq('ingredient_id', ingredientId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching stock adjustment history:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStockAdjustmentHistory:', error);
      throw error;
    }
  }

  // Get ingredient categories
  static async getIngredientCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('category');

      if (error) {
        console.error('Error fetching ingredient categories:', error);
        throw error;
      }

      const categories = [...new Set(data?.map(ing => ing.category) || [])];
      return categories.sort();
    } catch (error) {
      console.error('Error in getIngredientCategories:', error);
      throw error;
    }
  }

  // Get ingredients by category
  static async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching ingredients by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getIngredientsByCategory:', error);
      throw error;
    }
  }
}