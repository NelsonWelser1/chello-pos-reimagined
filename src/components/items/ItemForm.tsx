import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  stockCount: number;
  lowStockAlert: number;
  allergens: string[];
  modifiers: string[];
  preparationTime: number;
  calories: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  createdAt: string;
  updatedAt: string;
}
interface FormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stockCount: number;
  lowStockAlert: number;
  allergens: string[];
  modifiers: string[];
  preparationTime: number;
  calories: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}
interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: Item | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
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
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingItem ? 'Edit Item' : 'Create New Item'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-bold">Item Name</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))} placeholder="Enter item name" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="price" className="text-sm font-bold">Price ($)</Label>
              <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData(prev => ({
              ...prev,
              price: parseFloat(e.target.value) || 0
            }))} placeholder="0.00" className="mt-1" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-bold">Description</Label>
            <Textarea id="description" value={formData.description} onChange={e => setFormData(prev => ({
            ...prev,
            description: e.target.value
          }))} placeholder="Enter item description" className="mt-1" rows={3} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-bold">Category</Label>
              <select id="category" value={formData.category} onChange={e => setFormData(prev => ({
              ...prev,
              category: e.target.value
            }))} className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background">
                {categories.filter(cat => cat !== 'All').map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            
            
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stockCount" className="text-sm font-bold">Stock Count</Label>
              <Input id="stockCount" type="number" value={formData.stockCount} onChange={e => setFormData(prev => ({
              ...prev,
              stockCount: parseInt(e.target.value) || 0
            }))} className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="lowStockAlert" className="text-sm font-bold">Low Stock Alert</Label>
              <Input id="lowStockAlert" type="number" value={formData.lowStockAlert} onChange={e => setFormData(prev => ({
              ...prev,
              lowStockAlert: parseInt(e.target.value) || 5
            }))} className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="preparationTime" className="text-sm font-bold">Prep Time (min)</Label>
              <Input id="preparationTime" type="number" value={formData.preparationTime} onChange={e => setFormData(prev => ({
              ...prev,
              preparationTime: parseInt(e.target.value) || 5
            }))} className="mt-1" />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-bold">Dietary Options</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isVegetarian} onChange={e => setFormData(prev => ({
                ...prev,
                isVegetarian: e.target.checked
              }))} />
                <span className="text-sm">Vegetarian</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isVegan} onChange={e => setFormData(prev => ({
                ...prev,
                isVegan: e.target.checked
              }))} />
                <span className="text-sm">Vegan</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isGlutenFree} onChange={e => setFormData(prev => ({
                ...prev,
                isGlutenFree: e.target.checked
              }))} />
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
    </Dialog>;
}