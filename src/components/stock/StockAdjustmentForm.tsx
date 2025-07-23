import { useState } from "react";
import { Save, Package, TrendingUp, AlertTriangle, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIngredients } from "@/hooks/useIngredients";
import { useStaff } from "@/hooks/useStaff";
import { type StockAdjustment } from "@/types/stock";

interface StockAdjustmentFormProps {
  onSubmit: (adjustment: Omit<StockAdjustment, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onClose: () => void;
}

export default function StockAdjustmentForm({ onSubmit, onClose }: StockAdjustmentFormProps) {
  const { ingredients } = useIngredients();
  const { staff } = useStaff();
  const [formData, setFormData] = useState({
    ingredient_id: '',
    adjustment_type: 'restock' as const,
    quantity_change: 0,
    reason: '',
    performed_by_staff_id: '',
    supplier: '',
    cost_per_unit: 0,
    total_cost: 0,
    reference_number: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      onClose();
    }
  };

  const adjustmentTypes = [
    { value: 'restock', label: 'Restock', icon: TrendingUp, color: 'text-green-600' },
    { value: 'waste', label: 'Waste/Loss', icon: AlertTriangle, color: 'text-red-600' },
    { value: 'correction', label: 'Inventory Correction', icon: ArrowUpDown, color: 'text-blue-600' },
    { value: 'transfer', label: 'Transfer', icon: Package, color: 'text-purple-600' }
  ];

  const selectedType = adjustmentTypes.find(t => t.value === formData.adjustment_type);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {selectedType && <selectedType.icon className={`w-5 h-5 ${selectedType.color}`} />}
          Stock Adjustment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ingredient">Ingredient *</Label>
              <Select
                value={formData.ingredient_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, ingredient_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {ingredients.map(ing => (
                    <SelectItem key={ing.id} value={ing.id}>
                      {ing.name} (Current: {ing.currentStock} {ing.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="adjustment_type">Adjustment Type *</Label>
              <Select
                value={formData.adjustment_type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, adjustment_type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adjustmentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className={`w-4 h-4 ${type.color}`} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity_change">
                Quantity Change * 
                <span className="text-sm text-muted-foreground ml-1">
                  (use negative values for reductions, positive for increases)
                </span>
              </Label>
              <Input
                id="quantity_change"
                type="number"
                step="0.1"
                value={formData.quantity_change}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity_change: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="performed_by">Performed By</Label>
              <Select
                value={formData.performed_by_staff_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, performed_by_staff_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Brief reason for adjustment"
              required
            />
          </div>

          {formData.adjustment_type === 'restock' && (
            <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <Label htmlFor="cost_per_unit">Cost per Unit</Label>
                <Input
                  id="cost_per_unit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost_per_unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost_per_unit: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="total_cost">Total Cost</Label>
                <Input
                  id="total_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total_cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_cost: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reference_number">Reference Number</Label>
              <Input
                id="reference_number"
                value={formData.reference_number}
                onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
                placeholder="Invoice, receipt, or order number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Record Adjustment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}