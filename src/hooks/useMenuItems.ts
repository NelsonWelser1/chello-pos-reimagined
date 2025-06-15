
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_available: boolean;
  stock_count: number;
  low_stock_alert: number;
  allergens: string[];
  modifiers: string[];
  preparation_time: number;
  calories: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock_count: number;
  low_stock_alert: number;
  allergens: string[];
  modifiers: string[];
  preparation_time: number;
  calories: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
}

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all menu items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Error",
          description: "Failed to load menu items. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setItems(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new menu item
  const createItem = async (formData: MenuItemFormData): Promise<boolean> => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Item name is required.",
          variant: "destructive",
        });
        return false;
      }

      if (!formData.category.trim()) {
        toast({
          title: "Validation Error",
          description: "Category is required.",
          variant: "destructive",
        });
        return false;
      }

      if (formData.price <= 0) {
        toast({
          title: "Validation Error",
          description: "Price must be greater than 0.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert([formData])
        .select()
        .single();

      if (error) {
        console.error('Error creating menu item:', error);
        toast({
          title: "Error",
          description: "Failed to create menu item. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        setItems(prev => [data, ...prev]);
        toast({
          title: "Success",
          description: `"${formData.name}" has been added to the menu!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the item.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update a menu item
  const updateItem = async (id: string, formData: MenuItemFormData): Promise<boolean> => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Item name is required.",
          variant: "destructive",
        });
        return false;
      }

      if (!formData.category.trim()) {
        toast({
          title: "Validation Error",
          description: "Category is required.",
          variant: "destructive",
        });
        return false;
      }

      if (formData.price <= 0) {
        toast({
          title: "Validation Error",
          description: "Price must be greater than 0.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating menu item:', error);
        toast({
          title: "Error",
          description: "Failed to update menu item. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        setItems(prev => prev.map(item => item.id === id ? data : item));
        toast({
          title: "Success",
          description: `"${formData.name}" has been updated!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the item.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete a menu item
  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting menu item:', error);
        toast({
          title: "Error",
          description: "Failed to delete menu item. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Menu item has been deleted.",
      });
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the item.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Toggle item availability
  const toggleAvailability = async (id: string): Promise<boolean> => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return false;

      const { data, error } = await supabase
        .from('menu_items')
        .update({ is_available: !item.is_available })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling availability:', error);
        toast({
          title: "Error",
          description: "Failed to update item availability. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        setItems(prev => prev.map(i => i.id === id ? data : i));
        toast({
          title: "Success",
          description: `"${item.name}" is now ${data.is_available ? 'available' : 'unavailable'}.`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating availability.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Load items on hook initialization
  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    toggleAvailability,
    refetch: fetchItems
  };
}
