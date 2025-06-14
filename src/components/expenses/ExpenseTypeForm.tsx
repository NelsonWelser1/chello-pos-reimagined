
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import type { ExpenseType } from "../../pages/Expenses";

interface ExpenseTypeFormProps {
  expenseType?: ExpenseType | null;
  onSubmit: (expenseType: Omit<ExpenseType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const categories = [
  'Food & Beverage',
  'Labor',
  'Rent & Utilities',
  'Marketing',
  'Equipment',
  'Maintenance',
  'Other'
] as const;

const colors = [
  '#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', 
  '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'
];

export default function ExpenseTypeForm({ expenseType, onSubmit, onCancel }: ExpenseTypeFormProps) {
  const [formData, setFormData] = useState({
    name: expenseType?.name || '',
    description: expenseType?.description || '',
    category: expenseType?.category || 'Other' as const,
    budgetLimit: expenseType?.budgetLimit || 0,
    isActive: expenseType?.isActive ?? true,
    color: expenseType?.color || colors[0],
    taxDeductible: expenseType?.taxDeductible ?? true,
    requiresApproval: expenseType?.requiresApproval ?? false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            {expenseType ? 'Edit Expense Type' : 'Add New Expense Type'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Food Supplies"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of this expense type"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetLimit">Monthly Budget Limit ($) *</Label>
                <Input
                  id="budgetLimit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budgetLimit}
                  onChange={(e) => handleChange('budgetLimit', parseFloat(e.target.value) || 0)}
                  placeholder="5000.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleChange('color', color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="taxDeductible"
                  checked={formData.taxDeductible}
                  onCheckedChange={(checked) => handleChange('taxDeductible', checked)}
                />
                <Label htmlFor="taxDeductible">Tax Deductible</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresApproval"
                  checked={formData.requiresApproval}
                  onCheckedChange={(checked) => handleChange('requiresApproval', checked)}
                />
                <Label htmlFor="requiresApproval">Requires Approval</Label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {expenseType ? 'Update Expense Type' : 'Create Expense Type'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
