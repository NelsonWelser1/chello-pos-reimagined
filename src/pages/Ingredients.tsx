
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import IngredientStats from "@/components/ingredients/IngredientStats";
import IngredientTable from "@/components/ingredients/IngredientTable";
import IngredientForm from "@/components/ingredients/IngredientForm";

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
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: "1",
      name: "Fresh Tomatoes",
      category: "Vegetables",
      unit: "kg",
      currentStock: 25.5,
      minimumStock: 10,
      maximumStock: 50,
      costPerUnit: 3.50,
      supplier: "Fresh Farm Co",
      supplierContact: "+1-555-0123",
      expiryDate: "2024-06-20",
      lastRestocked: "2024-06-15",
      isPerishable: true,
      storageLocation: "Cold Storage A",
      allergens: [],
      nutritionalInfo: {
        calories: 18,
        protein: 0.9,
        carbs: 3.9,
        fat: 0.2,
        fiber: 1.2
      },
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-06-15T14:30:00Z"
    },
    {
      id: "2",
      name: "Mozzarella Cheese",
      category: "Dairy",
      unit: "kg",
      currentStock: 8.2,
      minimumStock: 5,
      maximumStock: 20,
      costPerUnit: 12.99,
      supplier: "Dairy Excellence Ltd",
      supplierContact: "+1-555-0456",
      expiryDate: "2024-07-01",
      lastRestocked: "2024-06-10",
      isPerishable: true,
      storageLocation: "Refrigerator B",
      allergens: ["dairy"],
      nutritionalInfo: {
        calories: 300,
        protein: 22,
        carbs: 2,
        fat: 22,
        fiber: 0
      },
      createdAt: "2024-01-20T09:00:00Z",
      updatedAt: "2024-06-10T16:15:00Z"
    },
    {
      id: "3",
      name: "Olive Oil",
      category: "Oils & Fats",
      unit: "liters",
      currentStock: 12.5,
      minimumStock: 8,
      maximumStock: 25,
      costPerUnit: 8.75,
      supplier: "Mediterranean Oils",
      supplierContact: "+1-555-0789",
      expiryDate: "2025-03-15",
      lastRestocked: "2024-05-20",
      isPerishable: false,
      storageLocation: "Pantry Shelf 3",
      allergens: [],
      nutritionalInfo: {
        calories: 884,
        protein: 0,
        carbs: 0,
        fat: 100,
        fiber: 0
      },
      createdAt: "2024-02-01T11:00:00Z",
      updatedAt: "2024-05-20T13:45:00Z"
    },
    {
      id: "4",
      name: "Whole Wheat Flour",
      category: "Grains & Flour",
      unit: "kg",
      currentStock: 45.0,
      minimumStock: 20,
      maximumStock: 100,
      costPerUnit: 2.25,
      supplier: "Golden Grain Mills",
      supplierContact: "+1-555-0321",
      expiryDate: "2024-12-31",
      lastRestocked: "2024-06-01",
      isPerishable: false,
      storageLocation: "Dry Storage A",
      allergens: ["gluten"],
      nutritionalInfo: {
        calories: 340,
        protein: 13,
        carbs: 72,
        fat: 2.5,
        fiber: 11
      },
      createdAt: "2024-02-15T08:30:00Z",
      updatedAt: "2024-06-01T10:20:00Z"
    },
    {
      id: "5",
      name: "Chicken Breast",
      category: "Meat & Poultry",
      unit: "kg",
      currentStock: 15.8,
      minimumStock: 10,
      maximumStock: 30,
      costPerUnit: 8.99,
      supplier: "Premium Poultry",
      supplierContact: "+1-555-0654",
      expiryDate: "2024-06-18",
      lastRestocked: "2024-06-16",
      isPerishable: true,
      storageLocation: "Freezer A",
      allergens: [],
      nutritionalInfo: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0
      },
      createdAt: "2024-03-01T12:00:00Z",
      updatedAt: "2024-06-16T09:15:00Z"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIngredient = (newIngredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const ingredient: Ingredient = {
      ...newIngredient,
      id: (ingredients.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setIngredients([...ingredients, ingredient]);
    setShowForm(false);
  };

  const handleEditIngredient = (updatedIngredient: Ingredient) => {
    setIngredients(ingredients.map(ingredient =>
      ingredient.id === updatedIngredient.id
        ? { ...updatedIngredient, updatedAt: new Date().toISOString() }
        : ingredient
    ));
    setEditingIngredient(null);
    setShowForm(false);
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const openEditForm = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingIngredient(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
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

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
