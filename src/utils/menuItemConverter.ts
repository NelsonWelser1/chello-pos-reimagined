
import { type MenuItemFormData } from '@/types/menuItem';

export function convertFormDataToDbData(formData: MenuItemFormData) {
  return {
    name: formData.name,
    description: formData.description,
    price: formData.price,
    category: formData.category,
    image: formData.image,
    stock_count: formData.stockCount,
    low_stock_alert: formData.lowStockAlert,
    allergens: formData.allergens,
    modifiers: formData.modifiers,
    preparation_time: formData.preparationTime,
    calories: formData.calories,
    is_vegetarian: formData.isVegetarian,
    is_vegan: formData.isVegan,
    is_gluten_free: formData.isGlutenFree,
  };
}
