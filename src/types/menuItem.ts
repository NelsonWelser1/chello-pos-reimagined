
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
  stockCount: number;
  lowStockAlert: number;
  allergens: string[];
  modifiers: string[];
  preparationTime: number;
  calories: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}
