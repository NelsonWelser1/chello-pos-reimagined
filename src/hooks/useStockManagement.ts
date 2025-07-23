import { useState, useEffect } from 'react';
import { StockService } from '@/services/stockService';
import { useIngredients } from '@/hooks/useIngredients';
import { type StockAdjustment, type StockAlert } from '@/types/stock';

export function useStockManagement() {
  const { ingredients } = useIngredients();
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdjustments = async (ingredientId?: string) => {
    setLoading(true);
    try {
      const data = await StockService.getStockAdjustments(ingredientId);
      setAdjustments(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const data = await StockService.getStockAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const createAdjustment = async (adjustment: Omit<StockAdjustment, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    const success = await StockService.createStockAdjustment(adjustment);
    if (success) {
      await fetchAdjustments();
      await fetchAlerts();
    }
    return success;
  };

  const validateOrderStock = async (orderItems: { menu_item_id: string; quantity: number }[]) => {
    return await StockService.validateStockForOrder(orderItems);
  };

  useEffect(() => {
    fetchAdjustments();
    fetchAlerts();
  }, []);

  return {
    ingredients,
    adjustments,
    alerts,
    loading,
    createAdjustment,
    validateOrderStock,
    fetchAdjustments,
    fetchAlerts
  };
}