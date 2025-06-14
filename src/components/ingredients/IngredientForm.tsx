
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

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

interface IngredientFormProps {
  ingredient?: Ingredient | null;
  onSubmit: (ingredient: any) => void;
  onCancel: () => void;
}

const categories = [
  "Vegetables", "Fruits", "Meat & Poultry", "Seafood", "Dairy", 
  "Grains & Flour", "Oils & Fats", "Spices & Herbs", "Beverages", "Other"
];

const units = ["kg", "grams", "liters", "ml", "pieces", "packages", "cans", "bottles"];

const commonAllergens = [
  "dairy", "eggs", "fish", "shellfish", "tree nuts", "peanuts", 
  "wheat", "gluten", "soy", "sesame"
];

export default function IngredientForm({ ingredient, onSubmit, onCancel }: IngredientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    currentStock: 0,
    minimumStock: 0,
    maximumStock: 0,
    costPerUnit: 0,
    supplier: "",
    supplierContact: "",
    expiryDate: "",
    lastRestocked: "",
    isPerishable: false,
    storageLocation: "",
    allergens: [] as string[],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    }
  });

  const [newAllergen, setNewAllergen] = useState("");

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
        currentStock: ingredient.currentStock,
        minimumStock: ingredient.minimumStock,
        maximumStock: ingredient.maximumStock,
        costPerUnit: ingredient.costPerUnit,
        supplier: ingredient.supplier,
        supplierContact: ingredient.supplierContact,
        expiryDate: ingredient.expiryDate,
        lastRestocked: ingredient.lastRestocked,
        isPerishable: ingredient.isPerishable,
        storageLocation: ingredient.storageLocation,
        allergens: ingredient.allergens,
        nutritionalInfo: ingredient.nutritionalInfo
      });
    }
  }, [ingredient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addAllergen = (allergen: string) => {
    if (allergen && !formData.allergens.includes(allergen)) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, allergen]
      });
    }
    setNewAllergen("");
  };

  const removeAllergen = (allergen: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter(a => a !== allergen)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-black">
            {ingredient ? "Edit Ingredient" : "Add New Ingredient"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Ingredient Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stock Information */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  step="0.1"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="minimumStock">Minimum Stock</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  step="0.1"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({ ...formData, minimumStock: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="maximumStock">Maximum Stock</Label>
                <Input
                  id="maximumStock"
                  type="number"
                  step="0.1"
                  value={formData.maximumStock}
                  onChange={(e) => setFormData({ ...formData, maximumStock: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Cost and Supplier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="costPerUnit">Cost per Unit ($)</Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  step="0.01"
                  value={formData.costPerUnit}
                  onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="supplierContact">Supplier Contact</Label>
                <Input
                  id="supplierContact"
                  value={formData.supplierContact}
                  onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                />
              </div>
            </div>

            {/* Storage and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="storageLocation">Storage Location</Label>
                <Input
                  id="storageLocation"
                  value={formData.storageLocation}
                  onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastRestocked">Last Restocked</Label>
                <Input
                  id="lastRestocked"
                  type="date"
                  value={formData.lastRestocked}
                  onChange={(e) => setFormData({ ...formData, lastRestocked: e.target.value })}
                />
              </div>
              <div>
                <div className="flex items-center space-x-2 mt-8">
                  <Checkbox
                    id="isPerishable"
                    checked={formData.isPerishable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPerishable: checked as boolean })}
                  />
                  <Label htmlFor="isPerishable">Is Perishable</Label>
                </div>
              </div>
            </div>

            {formData.isPerishable && (
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            )}

            {/* Allergens */}
            <div>
              <Label>Allergens</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.allergens.map(allergen => (
                  <Badge key={allergen} variant="secondary" className="flex items-center gap-1">
                    {allergen}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeAllergen(allergen)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add custom allergen"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen(newAllergen))}
                />
                <Button type="button" variant="outline" onClick={() => addAllergen(newAllergen)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {commonAllergens.map(allergen => (
                  <Button
                    key={allergen}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAllergen(allergen)}
                    disabled={formData.allergens.includes(allergen)}
                  >
                    {allergen}
                  </Button>
                ))}
              </div>
            </div>

            {/* Nutritional Information */}
            <div>
              <Label className="text-lg font-semibold">Nutritional Information (per 100g/ml)</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    step="0.1"
                    value={formData.nutritionalInfo.calories}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        calories: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={formData.nutritionalInfo.protein}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        protein: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={formData.nutritionalInfo.carbs}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        carbs: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={formData.nutritionalInfo.fat}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        fat: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="fiber">Fiber (g)</Label>
                  <Input
                    id="fiber"
                    type="number"
                    step="0.1"
                    value={formData.nutritionalInfo.fiber}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        fiber: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                {ingredient ? "Update Ingredient" : "Add Ingredient"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
