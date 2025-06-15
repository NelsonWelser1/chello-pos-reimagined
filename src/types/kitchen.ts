
export interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  special_instructions?: string;
  prep_time: number;
  status: 'pending' | 'preparing' | 'ready';
}

export interface KitchenOrder {
  id: string;
  order_id: string;
  order_number: string;
  items: KitchenOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served';
  priority: 'low' | 'medium' | 'high';
  estimated_time: number;
  customer_name?: string;
  table_number?: number;
  created_at: string;
  notes?: string;
}
