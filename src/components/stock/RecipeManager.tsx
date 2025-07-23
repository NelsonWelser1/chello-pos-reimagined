import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIngredients } from "@/hooks/useIngredients";
import { useRecipeManagement } from "@/hooks/useRecipeManagement";
import { type RecipeFormData } from "@/types/stock";

interface RecipeManagerProps {
  menuItemId: string;
  menuItemName: string;
  onClose: () => void;
}

export default function RecipeManager({ menuItemId, menuItemName, onClose }: RecipeManagerProps) {
  const { ingredients } = useIngredients();
  const { recipe, loading, saveRecipe } = useRecipeManagement(menuItemId);
  const [formData, setFormData] = useState<RecipeFormData>({
    menu_item_id: menuItemId,
    ingredients: []
  });

  useEffect(() => {
    if (recipe.length > 0) {
      setFormData({
        menu_item_id: menuItemId,
        ingredients: recipe.map(r => ({
          ingredient_id: r.ingredient_id,
          quantity_required: r.quantity_required,
          unit: r.unit
        }))
      });
    }
  }, [recipe, menuItemId]);

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, {
        ingredient_id: '',
        quantity_required: 0,
        unit: 'units'
      }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const handleSave = async () => {
    const success = await saveRecipe(formData);
    if (success) {
      onClose();
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading recipe...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recipe for {menuItemName}
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Ingredients Required</Label>
            <Button onClick={addIngredient} size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Ingredient
            </Button>
          </div>

          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg">
              <div className="col-span-5">
                <Label>Ingredient</Label>
                <Select
                  value={ingredient.ingredient_id}
                  onValueChange={(value) => updateIngredient(index, 'ingredient_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ingredient" />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredients.map(ing => (
                      <SelectItem key={ing.id} value={ing.id}>
                        {ing.name} ({ing.currentStock} {ing.unit} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-3">
                <Label>Quantity Required</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredient.quantity_required}
                  onChange={(e) => updateIngredient(index, 'quantity_required', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="col-span-3">
                <Label>Unit</Label>
                <Select
                  value={ingredient.unit}
                  onValueChange={(value) => updateIngredient(index, 'unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="g">Grams</SelectItem>
                    <SelectItem value="l">Liters</SelectItem>
                    <SelectItem value="ml">Milliliters</SelectItem>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="tbsp">Tablespoons</SelectItem>
                    <SelectItem value="tsp">Teaspoons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {formData.ingredients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              No ingredients added yet. Click "Add Ingredient" to get started.
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}