import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface IngredientRecord {
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
  expiryDate: string | null;
  lastRestocked: string | null;
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

export interface IngredientFormData {
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  costPerUnit: number;
  supplier: string;
  supplierContact: string;
  expiryDate: string | null;
  lastRestocked: string | null;
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
}

// Utility: map db row to IngredientRecord, as before
function mapDbToIngredient(i: any): IngredientRecord {
  return {
    id: i.id,
    name: i.name,
    category: i.category,
    unit: i.unit,
    currentStock: Number(i.current_stock ?? 0),
    minimumStock: Number(i.minimum_stock ?? 0),
    maximumStock: Number(i.maximum_stock ?? 0),
    costPerUnit: Number(i.cost_per_unit ?? 0),
    supplier: i.supplier ?? "",
    supplierContact: i.supplier_contact ?? "",
    expiryDate: i.expiry_date ?? null,
    lastRestocked: i.last_restocked ?? null,
    isPerishable: !!i.is_perishable,
    storageLocation: i.storage_location ?? "",
    allergens: Array.isArray(i.allergens) ? i.allergens : [],
    nutritionalInfo: {
      calories: Number(i.nutritional_calories ?? 0),
      protein: Number(i.nutritional_protein ?? 0),
      carbs: Number(i.nutritional_carbs ?? 0),
      fat: Number(i.nutritional_fat ?? 0),
      fiber: Number(i.nutritional_fiber ?? 0),
    },
    createdAt: i.created_at,
    updatedAt: i.updated_at,
  };
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState<IngredientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // LOAD
  useEffect(() => {
    setLoading(true);
    // @ts-expect-error: 'ingredients' is not in generated Supabase types
    supabase
      .from("ingredients")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast({
            title: "Failed to load ingredients",
            description: error.message,
            variant: "destructive"
          });
          setIngredients([]);
        } else if (data) {
          setIngredients(data.map(mapDbToIngredient));
        }
        setLoading(false);
      });
  }, []);

  // ADD
  const addIngredient = async (form: IngredientFormData) => {
    if (!form.name || !form.category || !form.unit) {
      toast({
        title: "Please complete all required fields",
        description: "Name, Category, and Unit are required.",
        variant: "destructive"
      });
      return null;
    }
    setLoading(true);
    // @ts-expect-error: 'ingredients' is not in generated Supabase types
    const { error, data } = await supabase
      .from("ingredients")
      .insert({
        name: form.name,
        category: form.category,
        unit: form.unit,
        current_stock: form.currentStock ?? 0,
        minimum_stock: form.minimumStock ?? 0,
        maximum_stock: form.maximumStock ?? 0,
        cost_per_unit: form.costPerUnit ?? 0,
        supplier: form.supplier,
        supplier_contact: form.supplierContact,
        expiry_date: form.expiryDate || null,
        last_restocked: form.lastRestocked || null,
        is_perishable: form.isPerishable ?? false,
        storage_location: form.storageLocation,
        allergens: form.allergens ?? [],
        nutritional_calories: form.nutritionalInfo.calories ?? 0,
        nutritional_protein: form.nutritionalInfo.protein ?? 0,
        nutritional_carbs: form.nutritionalInfo.carbs ?? 0,
        nutritional_fat: form.nutritionalInfo.fat ?? 0,
        nutritional_fiber: form.nutritionalInfo.fiber ?? 0,
      })
      .select("*")
      .single();

    if (error) {
      toast({
        title: "Error adding ingredient",
        description: error.message,
        variant: "destructive"
      });
      setLoading(false);
      return null;
    }

    // Refetch all
    // @ts-expect-error: 'ingredients' is not in generated Supabase types
    const { data: allData } = await supabase
      .from("ingredients")
      .select("*")
      .order("created_at", { ascending: false });
    setIngredients((allData || []).map(mapDbToIngredient));
    setLoading(false);

    toast({
      title: "Ingredient added!",
      description: `"${form.name}" has been successfully created.`,
      variant: "default"
    });

    return data ? mapDbToIngredient(data) : null;
  };

  return { ingredients, loading, addIngredient };
}
