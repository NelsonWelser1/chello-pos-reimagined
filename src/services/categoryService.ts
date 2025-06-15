
import { supabase } from "@/integrations/supabase/client";
import { type Category } from "@/types/category";

export class CategoryService {
  static async fetchAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    return data as Category[];
  }

  static async create(category: Omit<Category, "id" | "created_at" | "updated_at" | "is_active">): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ ...category }])
      .select()
      .single();
    if (error) {
      console.error("Error creating category:", error);
      return null;
    }
    return data as Category;
  }

  static async update(id: string, fields: Partial<Category>): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating category:", error);
      return null;
    }
    return data as Category;
  }

  static async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error deleting category:", error);
      return false;
    }
    return true;
  }
}
