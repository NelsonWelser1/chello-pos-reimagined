
import { Card, CardContent } from "@/components/ui/card";
import { Package, AlertTriangle, DollarSign, TrendingUp, Clock } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  costPerUnit: number;
  supplier: string;
  supplierContact: string;
  expiryDate: string;
  lastRestocked: string;
  isPerishable: boolean;
  storageLocation: string;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface IngredientStatsProps {
  ingredients: Ingredient[];
}

export default function IngredientStats({ ingredients }: IngredientStatsProps) {
  const lowStockIngredients = ingredients.filter(
    ingredient => ingredient.currentStock <= ingredient.minimumStock
  );
  
  const expiringIngredients = ingredients.filter(ingredient => {
    if (!ingredient.isPerishable) return false;
    const expiryDate = new Date(ingredient.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });

  const totalInventoryValue = ingredients.reduce(
    (sum, ingredient) => sum + (ingredient.currentStock * ingredient.costPerUnit), 0
  );

  const averageCostPerUnit = ingredients.length > 0 
    ? ingredients.reduce((sum, ingredient) => sum + ingredient.costPerUnit, 0) / ingredients.length 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Ingredients</p>
              <p className="text-3xl font-black">{ingredients.length}</p>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Low Stock</p>
              <p className="text-3xl font-black">{lowStockIngredients.length}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Expiring Soon</p>
              <p className="text-3xl font-black">{expiringIngredients.length}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Value</p>
              <p className="text-3xl font-black">${totalInventoryValue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Avg Cost/Unit</p>
              <p className="text-3xl font-black">${averageCostPerUnit.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
