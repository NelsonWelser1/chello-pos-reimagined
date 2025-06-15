
import { useState, useEffect } from "react";
import { CategoryService } from "@/services/categoryService";
import { type Category } from "@/types/category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchCategories() {
    setLoading(true);
    const data = await CategoryService.fetchAll();
    setCategories(data);
    setLoading(false);
  }

  async function addCategory(formData: Omit<Category, "id" | "created_at" | "updated_at" | "is_active">) {
    const newCat = await CategoryService.create(formData);
    if (newCat) {
      setCategories((prev) => [newCat, ...prev]);
      return true;
    }
    return false;
  }

  async function updateCategory(id: string, fields: Partial<Category>) {
    const updated = await CategoryService.update(id, fields);
    if (updated) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updated : cat))
      );
      return true;
    }
    return false;
  }

  async function deleteCategory(id: string) {
    const ok = await CategoryService.delete(id);
    if (ok) setCategories((prev) => prev.filter((cat) => cat.id !== id));
    return ok;
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
