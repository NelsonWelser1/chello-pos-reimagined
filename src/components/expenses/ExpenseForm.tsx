
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import type { Expense, ExpenseType } from "../../pages/Expenses";

interface ExpenseFormProps {
  expense?: Expense | null;
  expenseTypes: ExpenseType[];
  onSubmit: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Check'] as const;
const statuses = ['Pending', 'Approved', 'Rejected', 'Paid'] as const;
const recurringPeriods = ['Daily', 'Weekly', 'Monthly', 'Yearly'] as const;

export default function ExpenseForm({ expense, expenseTypes, onSubmit, onCancel }: ExpenseFormProps) {
  const selectedType = expense ? expenseTypes.find(t => t.id === expense.typeId) : null;
  
  const [formData, setFormData] = useState({
    typeId: expense?.typeId || '',
    typeName: expense?.typeName || '',
    amount: expense?.amount || 0,
    description: expense?.description || '',
    date: expense?.date || new Date().toISOString().split('T')[0],
    vendor: expense?.vendor || '',
    receiptNumber: expense?.receiptNumber || '',
    paymentMethod: expense?.paymentMethod || 'Cash' as const,
    status: expense?.status || 'Pending' as const,
    approvedBy: expense?.approvedBy || '',
    category: expense?.category || selectedType?.category || '',
    taxAmount: expense?.taxAmount || 0,
    isRecurring: expense?.isRecurring || false,
    recurringPeriod: expense?.recurringPeriod || 'Monthly' as const,
    notes: expense?.notes || '',
    attachments: expense?.attachments || [],
    createdBy: expense?.createdBy || 'Current User'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedExpenseType = expenseTypes.find(t => t.id === formData.typeId);
    if (!selectedExpenseType) return;

    onSubmit({
      ...formData,
      typeName: selectedExpenseType.name,
      category: selectedExpenseType.category,
      approvedAt: formData.status === 'Approved' ? new Date().toISOString() : undefined
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (typeId: string) => {
    const selectedType = expenseTypes.find(t => t.id === typeId);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        typeId,
        typeName: selectedType.name,
        category: selectedType.category
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeId">Expense Type *</Label>
                <Select value={formData.typeId} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.filter(type => type.isActive).map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} - {type.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="125.50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of the expense"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  value={formData.vendor}
                  onChange={(e) => handleChange('vendor', e.target.value)}
                  placeholder="Vendor name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receiptNumber">Receipt Number</Label>
                <Input
                  id="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={(e) => handleChange('receiptNumber', e.target.value)}
                  placeholder="REC-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxAmount">Tax Amount ($)</Label>
                <Input
                  id="taxAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.taxAmount}
                  onChange={(e) => handleChange('taxAmount', parseFloat(e.target.value) || 0)}
                  placeholder="12.50"
                />
              </div>
            </div>

            {(formData.status === 'Approved' || formData.status === 'Paid') && (
              <div className="space-y-2">
                <Label htmlFor="approvedBy">Approved By</Label>
                <Input
                  id="approvedBy"
                  value={formData.approvedBy}
                  onChange={(e) => handleChange('approvedBy', e.target.value)}
                  placeholder="Manager name"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => handleChange('isRecurring', checked)}
                  />
                  <Label htmlFor="isRecurring">Recurring Expense</Label>
                </div>
                
                {formData.isRecurring && (
                  <div className="space-y-2">
                    <Label htmlFor="recurringPeriod">Recurring Period</Label>
                    <Select value={formData.recurringPeriod} onValueChange={(value) => handleChange('recurringPeriod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        {recurringPeriods.map(period => (
                          <SelectItem key={period} value={period}>
                            {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional notes about this expense"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {expense ? 'Update Expense' : 'Create Expense'}
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
