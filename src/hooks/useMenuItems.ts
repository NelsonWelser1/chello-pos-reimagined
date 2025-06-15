
import { useState, useEffect } from 'react';
import { type MenuItem, type MenuItemFormData } from '@/types/menuItem';
import { MenuItemService } from '@/services/menuItemService';

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all menu items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await MenuItemService.fetchAll();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  // Create a new menu item
  const createItem = async (formData: MenuItemFormData): Promise<boolean> => {
    const newItem = await MenuItemService.create(formData);
    
    if (newItem) {
      setItems(prev => [newItem, ...prev]);
      return true;
    }
    
    return false;
  };

  // Update a menu item
  const updateItem = async (id: string, formData: MenuItemFormData): Promise<boolean> => {
    const updatedItem = await MenuItemService.update(id, formData);
    
    if (updatedItem) {
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return true;
    }
    
    return false;
  };

  // Delete a menu item
  const deleteItem = async (id: string): Promise<boolean> => {
    const success = await MenuItemService.delete(id);
    
    if (success) {
      setItems(prev => prev.filter(item => item.id !== id));
      return true;
    }
    
    return false;
  };

  // Toggle item availability
  const toggleAvailability = async (id: string): Promise<boolean> => {
    const item = items.find(i => i.id === id);
    if (!item) return false;

    const updatedItem = await MenuItemService.toggleAvailability(id, item.is_available, item.name);
    
    if (updatedItem) {
      setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
      return true;
    }
    
    return false;
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

export { type MenuItem, type MenuItemFormData };
