
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, Save, X, Briefcase, KeyRound, DollarSign } from "lucide-react";
import type { Staff, NewStaff, StaffRole, UpdateStaff } from "@/hooks/useStaff";
import { Constants } from "@/integrations/supabase/types";

interface StaffFormProps {
  staffMember: Staff | null;
  onSubmit: (data: NewStaff | (UpdateStaff & { id: string })) => void;
  onCancel: () => void;
}

const initialData: NewStaff = {
    name: "",
    email: "",
    phone: "",
    role: "Waiter",
    is_active: true,
    pin_code: "",
    hourly_rate: 0
};

export default function StaffForm({ staffMember, onSubmit, onCancel }: StaffFormProps) {
  const [formData, setFormData] = useState<NewStaff | Staff>(initialData);

  useEffect(() => {
    if (staffMember) {
      setFormData(staffMember);
    } else {
      setFormData(initialData);
    }
  }, [staffMember]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || null : value }));
  };

  const handleRoleChange = (value: StaffRole) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };
  
  const handleActiveChange = (checked: boolean) => {
      setFormData((prev) => ({ ...prev, is_active: checked }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffMember) {
        const { id, created_at, updated_at, ...updateData } = formData as Staff;
        onSubmit({ id, ...updateData });
    } else {
        onSubmit(formData as NewStaff);
    }
  };

  const staffRoles = Constants.public.Enums.staff_role;

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5" />
            {staffMember ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email"><Mail className="inline w-3 h-3 mr-1" />Email Address *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="staff@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone"><Phone className="inline w-3 h-3 mr-1" />Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="+1 (555) 123-4567" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select onValueChange={handleRoleChange} value={formData.role || undefined}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {staffRoles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="hourly_rate"><DollarSign className="inline w-3 h-3 mr-1" />Hourly Rate ($)</Label>
                        <Input id="hourly_rate" name="hourly_rate" type="number" step="0.01" value={formData.hourly_rate || ''} onChange={handleChange} placeholder="e.g. 15.50" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pin_code"><KeyRound className="inline w-3 h-3 mr-1" />PIN Code</Label>
                        <Input id="pin_code" name="pin_code" type="password" value={formData.pin_code || ''} onChange={handleChange} placeholder="4-digit PIN" />
                    </div>
                    <div className="space-y-2 flex flex-col justify-end">
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleActiveChange} />
                            <Label htmlFor="is_active">{formData.is_active ? 'Active' : 'Inactive'}</Label>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />Cancel</Button>
            <Button type="submit"><Save className="w-4 h-4 mr-2" />{staffMember ? "Update Staff" : "Save Staff"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
