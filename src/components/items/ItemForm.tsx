import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { type MenuItem, type MenuItemFormData } from '@/hooks/useMenuItems';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: MenuItem | null;
  formData: MenuItemFormData;
  setFormData: React.Dispatch<React.SetStateAction<MenuItemFormData>>;
  onSave: () => void;
  categories: string[];
}

export default function ItemForm({ 
  isOpen, 
  onClose, 
  editingItem, 
  formData, 
  setFormData, 
  onSave, 
  categories 
}: ItemFormProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setFormData(prev => ({ ...prev, image: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-bold">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="price" className="text-sm font-bold">Price (UGX)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="UGX 0.00"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-bold">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter item description"
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-bold">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="image" className="text-sm font-bold">Item Image</Label>
              <div className="mt-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex items-center justify-center w-full h-10 px-3 rounded-md border border-input bg-background cursor-pointer hover:bg-accent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.image ? 'Change Image' : 'Upload Image'}
                </label>
                {formData.image && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stockCount" className="text-sm font-bold">Stock Count</Label>
              <Input
                id="stockCount"
                type="number"
                value={formData.stockCount}
                onChange={(e) => setFormData(prev => ({ ...prev, stockCount: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="lowStockAlert" className="text-sm font-bold">Low Stock Alert</Label>
              <Input
                id="lowStockAlert"
                type="number"
                value={formData.lowStockAlert}
                onChange={(e) => setFormData(prev => ({ ...prev, lowStockAlert: parseInt(e.target.value) || 5 }))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="preparationTime" className="text-sm font-bold">Prep Time (min)</Label>
              <Input
                id="preparationTime"
                type="number"
                value={formData.preparationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 5 }))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="calories" className="text-sm font-bold">Calories</Label>
            <Input
              id="calories"
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
              className="mt-1"
              placeholder="Enter calories"
            />
          </div>
          
          <div>
            <Label className="text-sm font-bold">Dietary Options</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVegetarian}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                />
                <span className="text-sm">Vegetarian</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVegan}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVegan: e.target.checked }))}
                />
                <span className="text-sm">Vegan</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isGlutenFree}
                  onChange={(e) => setFormData(prev => ({ ...prev, isGlutenFree: e.target.checked }))}
                />
                <span className="text-sm">Gluten Free</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onSave} className="flex-1 bg-blue-500 hover:bg-blue-600">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
