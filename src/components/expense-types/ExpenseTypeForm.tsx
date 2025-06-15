
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExpenseType, NewExpenseType } from "@/hooks/useExpenseTypes";

interface ExpenseTypeFormProps {
  expenseType?: ExpenseType | null;
  onSubmit: (expenseType: NewExpenseType) => void;
  onCancel: () => void;
}

const categories = [
  'Food & Beverage', 'Labor', 'Rent & Utilities', 'Marketing', 'Equipment', 'Maintenance', 'Other'
] as const;

const priorities = ['Low', 'Medium', 'High', 'Critical'] as const;
const budgetPeriods = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'] as const;

const colors = [
  '#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', 
  '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'
];

export default function ExpenseTypeForm({ expenseType, onSubmit, onCancel }: ExpenseTypeFormProps) {
  const [formData, setFormData] = useState<NewExpenseType>({
    name: '',
    description: null,
    category: 'Other',
    budgetLimit: 0,
    isActive: true,
    color: colors[0],
    taxDeductible: true,
    requiresApproval: false,
    approvalThreshold: 1000,
    autoRecurring: false,
    defaultVendors: [],
    glCode: null,
    costCenter: null,
    priority: 'Medium',
    budgetPeriod: 'Monthly',
    notificationThreshold: 80,
    allowOverBudget: false,
    restrictedUsers: [],
    tags: []
  });

  useEffect(() => {
    if (expenseType) {
      const { id, createdAt, updatedAt, ...editData } = expenseType;
      setFormData(editData);
    }
  }, [expenseType]);

  const [newVendor, setNewVendor] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: NewExpenseType = {
        ...formData,
        description: formData.description || null,
        glCode: formData.glCode || null,
        costCenter: formData.costCenter || null,
    };
    onSubmit(dataToSubmit);
  };

  const handleChange = (field: keyof NewExpenseType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addVendor = () => {
    if (newVendor.trim() && !(formData.defaultVendors || []).includes(newVendor.trim())) {
      handleChange('defaultVendors', [...(formData.defaultVendors || []), newVendor.trim()]);
      setNewVendor('');
    }
  };

  const removeVendor = (vendor: string) => {
    handleChange('defaultVendors', (formData.defaultVendors || []).filter(v => v !== vendor));
  };

  const addTag = () => {
    if (newTag.trim() && !(formData.tags || []).includes(newTag.trim())) {
      handleChange('tags', [...(formData.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    handleChange('tags', (formData.tags || []).filter(t => t !== tag));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of this expense type"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetLimit">Budget Limit ($) *</Label>
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
                <Label htmlFor="budgetPeriod">Budget Period</Label>
                <Select value={formData.budgetPeriod} onValueChange={(value) => handleChange('budgetPeriod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetPeriods.map(period => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="glCode">GL Code</Label>
                <Input
                  id="glCode"
                  value={formData.glCode || ''}
                  onChange={(e) => handleChange('glCode', e.target.value)}
                  placeholder="FOOD-001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="costCenter">Cost Center</Label>
                <Input
                  id="costCenter"
                  value={formData.costCenter || ''}
                  onChange={(e) => handleChange('costCenter', e.target.value)}
                  placeholder="Kitchen"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationThreshold">Alert Threshold (%)</Label>
                <Input
                  id="notificationThreshold"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.notificationThreshold}
                  onChange={(e) => handleChange('notificationThreshold', parseInt(e.target.value) || 80)}
                  placeholder="80"
                />
              </div>
            </div>

            {formData.requiresApproval && (
              <div className="space-y-2">
                <Label htmlFor="approvalThreshold">Approval Threshold ($)</Label>
                <Input
                  id="approvalThreshold"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.approvalThreshold}
                  onChange={(e) => handleChange('approvalThreshold', parseFloat(e.target.value) || 0)}
                  placeholder="1000.00"
                />
              </div>
            )}

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

            <div className="space-y-4">
              <Label>Default Vendors</Label>
              <div className="flex gap-2">
                <Input
                  value={newVendor}
                  onChange={(e) => setNewVendor(e.target.value)}
                  placeholder="Add vendor name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVendor())}
                />
                <Button type="button" onClick={addVendor} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.defaultVendors || []).map(vendor => (
                  <Badge key={vendor} variant="secondary" className="cursor-pointer" onClick={() => removeVendor(vendor)}>
                    {vendor} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.tags || []).map(tag => (
                  <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange('isActive', !!checked)}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="taxDeductible"
                    checked={formData.taxDeductible}
                    onCheckedChange={(checked) => handleChange('taxDeductible', !!checked)}
                  />
                  <Label htmlFor="taxDeductible">Tax Deductible</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresApproval"
                    checked={formData.requiresApproval}
                    onCheckedChange={(checked) => handleChange('requiresApproval', !!checked)}
                  />
                  <Label htmlFor="requiresApproval">Requires Approval</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoRecurring"
                    checked={formData.autoRecurring}
                    onCheckedChange={(checked) => handleChange('autoRecurring', !!checked)}
                  />
                  <Label htmlFor="autoRecurring">Auto Recurring</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowOverBudget"
                    checked={formData.allowOverBudget}
                    onCheckedChange={(checked) => handleChange('allowOverBudget', !!checked)}
                  />
                  <Label htmlFor="allowOverBudget">Allow Over Budget</Label>
                </div>
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
