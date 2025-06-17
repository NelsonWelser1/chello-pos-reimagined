
import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import IngredientStats from "@/components/ingredients/IngredientStats";
import IngredientTable from "@/components/ingredients/IngredientTable";
import IngredientForm from "@/components/ingredients/IngredientForm";
import { useIngredients } from "@/hooks/useIngredients";

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

export default function Ingredients() {
  const {
    ingredients,
    loading,
    addIngredient,
  } = useIngredients();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  // Filter for search
  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for adding via form, create with Supabase and show toast
  const handleAddIngredient = async (ingredientData) => {
    const added = await addIngredient(ingredientData);
    if (added) setShowForm(false);
  };

  // No longer allow local editing, but keep existing structure
  // Editing could be enabled later via update logic to Supabase
  const handleEditIngredient = (_updatedIngredient) => {
    // Not implemented: Add updateIngredient to hook if needed.
    setEditingIngredient(null);
    setShowForm(false);
  };

  const handleDeleteIngredient = (id: string) => {
    // Not implemented: Add deleteIngredient to hook if needed.
  };

  const openEditForm = (ingredient: any) => {
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingIngredient(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 ml-0 border-l border-gray-200 bg-white">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
            <SidebarTrigger className="hover:bg-green-50 transition-colors rounded-md p-2" />
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  🥬 Ingredients Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Track inventory, manage suppliers, and monitor ingredient costs
                </p>
              </div>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Ingredient
              </Button>
            </div>
            <IngredientStats ingredients={ingredients} />

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search ingredients, categories, or suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-green-500 rounded-lg"
                  />
                </div>
              </div>

              <IngredientTable
                ingredients={filteredIngredients}
                onEdit={openEditForm}
                onDelete={handleDeleteIngredient}
              />
            </div>

            {showForm && (
              <IngredientForm
                ingredient={editingIngredient}
                onSubmit={editingIngredient ? handleEditIngredient : handleAddIngredient}
                onCancel={closeForm}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
