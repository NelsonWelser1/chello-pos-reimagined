
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, User, Mail, Phone, DollarSign, Shield, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StaffFormProps {
  staff?: any;
  onClose: () => void;
}

export function StaffForm({ staff, onClose }: StaffFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Waiter',
    hourly_rate: '',
    pin_code: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role || 'Waiter',
        hourly_rate: staff.hourly_rate?.toString() || '',
        pin_code: staff.pin_code || '',
        is_active: staff.is_active !== false
      });
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        pin_code: formData.pin_code || null,
        is_active: formData.is_active
      };

      if (staff) {
        const { error } = await supabase
          .from('staff')
          .update(submitData)
          .eq('id', staff.id);
        
        if (error) throw error;
        toast.success("Staff member updated successfully");
      } else {
        const { error } = await supabase
          .from('staff')
          .insert(submitData);
        
        if (error) throw error;
        toast.success("Staff member added successfully");
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error("Failed to save staff member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = ['Admin', 'Manager', 'Chef', 'Waiter', 'Cashier'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="border-slate-300 focus:border-blue-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="border-slate-300 focus:border-blue-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="border-slate-300 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-700 font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="border-slate-300 focus:border-blue-400">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourly_rate" className="text-slate-700 font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Hourly Rate
                </Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                  placeholder="Enter hourly rate"
                  className="border-slate-300 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin_code" className="text-slate-700 font-medium flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  PIN Code
                </Label>
                <Input
                  id="pin_code"
                  value={formData.pin_code}
                  onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                  placeholder="Enter PIN code"
                  className="border-slate-300 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="is_active" className="text-slate-700 font-medium">
                  Active Status
                </Label>
                <p className="text-sm text-slate-500">
                  Inactive staff members cannot access the system
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : staff ? 'Update Staff' : 'Add Staff'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
