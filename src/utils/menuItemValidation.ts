
import { toast } from '@/hooks/use-toast';
import { type MenuItemFormData } from '@/types/menuItem';

export function validateMenuItemForm(formData: MenuItemFormData): boolean {
  if (!formData.name.trim()) {
    toast({
      title: "Validation Error",
      description: "Item name is required.",
      variant: "destructive",
    });
    return false;
  }

  if (!formData.category.trim()) {
    toast({
      title: "Validation Error",
      description: "Category is required.",
      variant: "destructive",
    });
    return false;
  }

  if (formData.price <= 0) {
    toast({
      title: "Validation Error",
      description: "Price must be greater than 0.",
      variant: "destructive",
    });
    return false;
  }

  return true;
}
