import { supabase } from "@/integrations/supabase/client";

export interface Modifier {
  id: string;
  name: string;
  description?: string;
  category: string;
  modifier_type: 'single' | 'multiple' | 'required';
  price?: number;
  is_active: boolean;
  is_required: boolean;
  max_quantity: number;
  sort_order: number;
  applicable_items: string[];
  created_at: string;
  updated_at: string;
}

export type NewModifier = Omit<Modifier, 'id' | 'created_at' | 'updated_at'>;
export type UpdateModifier = Partial<NewModifier>;

export interface ModifierStats {
  totalModifiers: number;
  activeModifiers: number;
  categoriesCount: number;
  mostUsedModifiers: Array<{
    id: string;
    name: string;
    usage_count: number;
    revenue: number;
  }>;
  averagePrice: number;
  categoryBreakdown: Record<string, number>;
}

export class ModifierService {
  // Get all modifiers
  static async getModifiers(): Promise<Modifier[]> {
    try {
      const { data, error } = await supabase
        .from('modifiers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching modifiers:', error);
        throw error;
      }

      return (data || []) as Modifier[];
    } catch (error) {
      console.error('Error in getModifiers:', error);
      throw error;
    }
  }

  // Get modifiers by category
  static async getModifiersByCategory(category: string): Promise<Modifier[]> {
    try {
      const { data, error } = await supabase
        .from('modifiers')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching modifiers by category:', error);
        throw error;
      }

      return (data || []) as Modifier[];
    } catch (error) {
      console.error('Error in getModifiersByCategory:', error);
      throw error;
    }
  }

  // Get modifier by ID
  static async getModifierById(id: string): Promise<Modifier | null> {
    try {
      const { data, error } = await supabase
        .from('modifiers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching modifier by ID:', error);
        return null;
      }

      return data as Modifier;
    } catch (error) {
      console.error('Error in getModifierById:', error);
      return null;
    }
  }

  // Create new modifier
  static async createModifier(modifierData: NewModifier): Promise<Modifier | null> {
    try {
      const { data, error } = await supabase
        .from('modifiers')
        .insert(modifierData)
        .select()
        .single();

      if (error) {
        console.error('Error creating modifier:', error);
        throw error;
      }

      return data as Modifier;
    } catch (error) {
      console.error('Error in createModifier:', error);
      throw error;
    }
  }

  // Update modifier
  static async updateModifier(id: string, modifierData: UpdateModifier): Promise<Modifier | null> {
    try {
      const { data, error } = await supabase
        .from('modifiers')
        .update({ ...modifierData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating modifier:', error);
        throw error;
      }

      return data as Modifier;
    } catch (error) {
      console.error('Error in updateModifier:', error);
      throw error;
    }
  }

  // Delete modifier
  static async deleteModifier(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('modifiers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting modifier:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteModifier:', error);
      throw error;
    }
  }

  // Get modifier statistics
  static async getModifierStats(): Promise<ModifierStats> {
    try {
      const modifiers = await this.getModifiers();
      
      const totalModifiers = modifiers.length;
      const activeModifiers = modifiers.filter(m => m.is_active).length;
      
      const categories = new Set(modifiers.map(m => m.category));
      const categoriesCount = categories.size;
      
      const averagePrice = modifiers.length > 0 
        ? modifiers.reduce((sum, m) => sum + (m.price || 0), 0) / modifiers.length 
        : 0;

      const categoryBreakdown = modifiers.reduce((acc, m) => {
        acc[m.category] = (acc[m.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Mock most used modifiers - would need order data to calculate real usage
      const mostUsedModifiers = modifiers.slice(0, 5).map(m => ({
        id: m.id,
        name: m.name,
        usage_count: 0,
        revenue: 0
      }));

      return {
        totalModifiers,
        activeModifiers,
        categoriesCount,
        mostUsedModifiers,
        averagePrice,
        categoryBreakdown
      };
    } catch (error) {
      console.error('Error getting modifier stats:', error);
      throw error;
    }
  }

  // Search modifiers
  static async searchModifiers(query: string): Promise<Modifier[]> {
    try {
      const { data, error } = await supabase
        .from('modifiers')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error searching modifiers:', error);
        throw error;
      }

      return (data || []) as Modifier[];
    } catch (error) {
      console.error('Error in searchModifiers:', error);
      throw error;
    }
  }

  // Toggle modifier active status
  static async toggleModifierStatus(id: string, currentStatus: boolean): Promise<Modifier | null> {
    try {
      return await this.updateModifier(id, { is_active: !currentStatus });
    } catch (error) {
      console.error('Error toggling modifier status:', error);
      throw error;
    }
  }

  // Get modifiers for menu item
  static async getModifiersForMenuItem(menuItemId: string): Promise<Modifier[]> {
    try {
      const { data, error } = await supabase
        .from('modifiers')
        .select('*')
        .contains('applicable_items', [menuItemId])
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching modifiers for menu item:', error);
        throw error;
      }

      return (data || []) as Modifier[];
    } catch (error) {
      console.error('Error in getModifiersForMenuItem:', error);
      throw error;
    }
  }

  // Get all modifier categories
  static async getModifierCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('modifiers')
        .select('category')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching modifier categories:', error);
        throw error;
      }

      const categories = [...new Set(data?.map(m => m.category) || [])];
      return categories.sort();
    } catch (error) {
      console.error('Error in getModifierCategories:', error);
      throw error;
    }
  }
}