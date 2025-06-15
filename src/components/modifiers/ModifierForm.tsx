import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Modifier } from '@/hooks/useModifiers';

interface FormData {
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  applicableItems: string[];
  modifierType: 'addon' | 'substitute' | 'removal';
  maxQuantity: number;
  isRequired: boolean;
  sortOrder: number;
}

interface ModifierFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingModifier: Modifier | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSave: () => void;
  categories: string[];
}

const availableItems = ['Burgers', 'Pizza', 'Salads', 'Sandwiches', 'Beverages', 'Desserts', 'Seafood', 'Wings', 'Tacos', 'Pasta'];

export default function ModifierForm({ 
  isOpen, 
  onClose, 
  editingModifier, 
  formData, 
  setFormData, 
  onSave, 
  categories 
}: ModifierFormProps) {
  const handleApplicableItemToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      applicableItems: prev.applicableItems.includes(item)
        ? prev.applicableItems.filter(i => i !== item)
        : [...prev.applicableItems, item]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingModifier ? 'Edit Modifier' : 'Create New Modifier'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-bold">Modifier Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter modifier name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="price" className="text-sm font-bold">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
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
              placeholder="Enter modifier description"
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-bold">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                {categories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="modifierType" className="text-sm font-bold">Modifier Type</Label>
              <select
                id="modifierType"
                value={formData.modifierType}
                onChange={(e) => setFormData(prev => ({ ...prev, modifierType: e.target.value as 'addon' | 'substitute' | 'removal' }))}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="addon">Add-on</option>
                <option value="substitute">Substitute</option>
                <option value="removal">Removal</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="maxQuantity" className="text-sm font-bold">Max Quantity</Label>
              <Input
                id="maxQuantity"
                type="number"
                min="1"
                value={formData.maxQuantity}
                onChange={(e) => setFormData(prev => ({ ...prev, maxQuantity: parseInt(e.target.value) || 1 }))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sortOrder" className="text-sm font-bold">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
              className="mt-1"
              placeholder="Display order (lower numbers appear first)"
            />
          </div>
          
          <div>
            <Label className="text-sm font-bold mb-3 block">Applicable Items</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-32 overflow-y-auto border rounded-lg p-3">
              {availableItems.map(item => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={formData.applicableItems.includes(item)}
                    onCheckedChange={() => handleApplicableItemToggle(item)}
                  />
                  <Label htmlFor={item} className="text-sm cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-bold">Options</Label>
            <div className="flex gap-6 mt-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
                />
                <Label htmlFor="isActive" className="text-sm cursor-pointer">
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRequired"
                  checked={formData.isRequired}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked as boolean }))}
                />
                <Label htmlFor="isRequired" className="text-sm cursor-pointer">
                  Required Selection
                </Label>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onSave} className="flex-1 bg-purple-500 hover:bg-purple-600">
              {editingModifier ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
