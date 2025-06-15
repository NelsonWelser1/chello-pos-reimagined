
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { type MenuItem, type MenuItemFormData } from '@/types/menuItem';
import { validateMenuItemForm } from '@/utils/menuItemValidation';
import { convertFormDataToDbData } from '@/utils/menuItemConverter';

export class MenuItemService {
  static async fetchAll(): Promise<MenuItem[]> {
    try {
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
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading items.",
        variant: "destructive",
      });
      return [];
    }
  }

  static async create(formData: MenuItemFormData): Promise<MenuItem | null> {
    if (!validateMenuItemForm(formData)) {
      return null;
    }

    try {
      const dbData = convertFormDataToDbData(formData);

      const { data, error } = await supabase
        .from('menu_items')
        .insert([dbData])
        .select()
        .single();

      if (error) {
        console.error('Error creating menu item:', error);
        toast({
          title: "Error",
          description: "Failed to create menu item. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      if (data) {
        toast({
          title: "Success",
          description: `"${formData.name}" has been added to the menu!`,
        });
        return data;
      }

      return null;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the item.",
        variant: "destructive",
      });
      return null;
    }
  }

  static async update(id: string, formData: MenuItemFormData): Promise<MenuItem | null> {
    if (!validateMenuItemForm(formData)) {
      return null;
    }

    try {
      const dbData = convertFormDataToDbData(formData);

      const { data, error } = await supabase
        .from('menu_items')
        .update(dbData)
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
        return null;
      }

      if (data) {
        toast({
          title: "Success",
          description: `"${formData.name}" has been updated!`,
        });
        return data;
      }

      return null;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the item.",
        variant: "destructive",
      });
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
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
  }

  static async toggleAvailability(id: string, currentAvailability: boolean, itemName: string): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ is_available: !currentAvailability })
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
        return null;
      }

      if (data) {
        toast({
          title: "Success",
          description: `"${itemName}" is now ${data.is_available ? 'available' : 'unavailable'}.`,
        });
        return data;
      }

      return null;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating availability.",
        variant: "destructive",
      });
      return null;
    }
  }
}
