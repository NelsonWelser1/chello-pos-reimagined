
import { useMemo } from "react";
import { Ingredient } from "@/data/mockIngredients";

export interface AlertSettings {
  lowStockThreshold: number;
  expiryWarningDays: number;
  autoReorderEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface StockPrediction extends Ingredient {
  daysUntilStockout: number;
  stockoutDate: string;
  urgency: 'critical' | 'high' | 'medium';
}

export function useStockAlerts(ingredients: Ingredient[], alertSettings: AlertSettings) {
  const lowStockItems = useMemo(() => {
    return ingredients.filter(item => 
      item.currentStock <= item.minimumStock ||
      item.currentStock <= alertSettings.lowStockThreshold
    );
  }, [ingredients, alertSettings.lowStockThreshold]);

  const expiringItems = useMemo(() => {
    return ingredients.filter(item => {
      if (!item.isPerishable) return false;
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= alertSettings.expiryWarningDays && daysUntilExpiry >= 0;
    });
  }, [ingredients, alertSettings.expiryWarningDays]);

  const stockoutPredictions = useMemo(() => {
    return ingredients.map(item => {
      const daysUntilStockout = item.dailyUsage > 0 ? Math.floor(item.currentStock / item.dailyUsage) : 999;
      const stockoutDate = new Date();
      stockoutDate.setDate(stockoutDate.getDate() + daysUntilStockout);
      
      const urgency: 'critical' | 'high' | 'medium' = 
        daysUntilStockout <= item.leadTime ? 'critical' : 
        daysUntilStockout <= item.leadTime + 2 ? 'high' : 'medium';
      
      return {
        ...item,
        daysUntilStockout,
        stockoutDate: stockoutDate.toISOString(),
        urgency
      };
    }).filter(item => item.daysUntilStockout <= 14) as StockPrediction[];
  }, [ingredients]);

  return {
    lowStockItems,
    expiringItems,
    stockoutPredictions
  };
}
