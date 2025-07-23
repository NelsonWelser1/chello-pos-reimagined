export interface MenuItemIngredient {
  id: string;
  menu_item_id: string;
  ingredient_id: string;
  quantity_required: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface StockAdjustment {
  id: string;
  ingredient_id: string;
  adjustment_type: 'restock' | 'waste' | 'correction' | 'transfer';
  quantity_change: number;
  reason?: string;
  performed_by_staff_id?: string;
  supplier?: string;
  cost_per_unit?: number;
  total_cost?: number;
  reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StockAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  ingredient_id?: string;
  menu_item_id?: string;
  created_at: string;
}

export interface RecipeFormData {
  menu_item_id: string;
  ingredients: {
    ingredient_id: string;
    quantity_required: number;
    unit: string;
  }[];
}