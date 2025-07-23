import { useState, useEffect } from 'react';
import { StockService } from '@/services/stockService';
import { type MenuItemIngredient, type RecipeFormData } from '@/types/stock';

export function useRecipeManagement(menuItemId?: string) {
  const [recipe, setRecipe] = useState<MenuItemIngredient[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipe = async (itemId: string) => {
    setLoading(true);
    try {
      const data = await StockService.getMenuItemRecipe(itemId);
      setRecipe(data);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async (recipeData: RecipeFormData): Promise<boolean> => {
    const success = await StockService.saveMenuItemRecipe(recipeData);
    if (success && menuItemId) {
      await fetchRecipe(menuItemId);
    }
    return success;
  };

  useEffect(() => {
    if (menuItemId) {
      fetchRecipe(menuItemId);
    }
  }, [menuItemId]);

  return {
    recipe,
    loading,
    saveRecipe,
    refetch: () => menuItemId && fetchRecipe(menuItemId)
  };
}