
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertTriangle, Clock } from "lucide-react";

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

interface IngredientTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => void;
}

export default function IngredientTable({ ingredients, onEdit, onDelete }: IngredientTableProps) {
  const getStockStatus = (ingredient: Ingredient) => {
    if (ingredient.currentStock <= ingredient.minimumStock) {
      return { status: "Low", color: "bg-red-500" };
    }
    if (ingredient.currentStock >= ingredient.maximumStock * 0.8) {
      return { status: "High", color: "bg-orange-500" };
    }
    return { status: "Normal", color: "bg-green-500" };
  };

  const getExpiryStatus = (expiryDate: string, isPerishable: boolean) => {
    if (!isPerishable) return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: "Expired", color: "bg-red-500", icon: AlertTriangle };
    }
    if (daysUntilExpiry <= 7) {
      return { status: "Expiring Soon", color: "bg-orange-500", icon: Clock };
    }
    return null;
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-black">Name</TableHead>
            <TableHead className="font-black">Category</TableHead>
            <TableHead className="font-black">Stock Status</TableHead>
            <TableHead className="font-black">Current Stock</TableHead>
            <TableHead className="font-black">Cost/Unit</TableHead>
            <TableHead className="font-black">Supplier</TableHead>
            <TableHead className="font-black">Expiry</TableHead>
            <TableHead className="font-black">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient) => {
            const stockStatus = getStockStatus(ingredient);
            const expiryStatus = getExpiryStatus(ingredient.expiryDate, ingredient.isPerishable);
            
            return (
              <TableRow key={ingredient.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-semibold">{ingredient.name}</div>
                    <div className="text-sm text-gray-500">{ingredient.storageLocation}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-medium">
                    {ingredient.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stockStatus.color}`}></div>
                    <span className="text-sm font-medium">{stockStatus.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold">
                      {ingredient.currentStock} {ingredient.unit}
                    </div>
                    <div className="text-sm text-gray-500">
                      Min: {ingredient.minimumStock} | Max: {ingredient.maximumStock}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  ${ingredient.costPerUnit.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{ingredient.supplier}</div>
                    <div className="text-sm text-gray-500">{ingredient.supplierContact}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {ingredient.isPerishable ? (
                      <>
                        <div className="text-sm">
                          {new Date(ingredient.expiryDate).toLocaleDateString()}
                        </div>
                        {expiryStatus && (
                          <Badge className={`${expiryStatus.color} text-white text-xs`}>
                            <expiryStatus.icon className="w-3 h-3 mr-1" />
                            {expiryStatus.status}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Non-perishable
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(ingredient)}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(ingredient.id)}
                      className="hover:bg-red-50 hover:border-red-300 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
