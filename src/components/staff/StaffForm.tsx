import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Save, User, Mail, Phone, DollarSign, Shield, Key, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type StaffRole = Database["public"]["Enums"]["staff_role"];

interface StaffFormProps {
  staff?: any;
  onClose: () => void;
}

export function StaffForm({ staff, onClose }: StaffFormProps) {
  const { createUser, updatePermissions, isCreatingUser } = useUserPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewUser, setIsNewUser] = useState(!staff);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Waiter' as StaffRole,
    hourly_rate: '',
    pin_code: '',
    is_active: true,
    password: '',
  });

  const [permissions, setPermissions] = useState({
    system_access: true,
    can_create_users: false,
    can_delete_users: false,
    can_manage_permissions: false,
    module_access: {
      dashboard: true,
      pos: true,
      kitchen: true,
      items: false,
      modifiers: false,
      categories: false,
      ingredients: false,
      customers: true,
      orders: true,
      'service-tables': true,
      sales: false,
      'stock-alert': false,
      'payment-methods': false,
      expenses: false,
      'expense-types': false,
      staff: false,
      backup: false,
      'imports-exports': false,
    },
  });

  useEffect(() => {
    if (staff) {
      setIsNewUser(false);
      setFormData({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role || 'Waiter',
        hourly_rate: staff.hourly_rate?.toString() || '',
        pin_code: staff.pin_code || '',
        is_active: staff.is_active !== false,
        password: '',
      });
      
      // Load existing permissions if editing
      if (staff.auth_user_id) {
        fetchUserPermissions(staff.auth_user_id);
      }
    }
  }, [staff]);

  const fetchUserPermissions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPermissions({
          system_access: data.system_access,
          can_create_users: data.can_create_users,
          can_delete_users: data.can_delete_users,
          can_manage_permissions: data.can_manage_permissions,
          module_access: (typeof data.module_access === 'object' && data.module_access !== null) 
            ? { ...permissions.module_access, ...data.module_access }
            : permissions.module_access,
        });
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (isNewUser && !formData.password) {
      toast.error("Password is required for new users");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isNewUser) {
        // Create new user with auth and permissions
        createUser({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
          permissions: {
            ...permissions,
            module_access: permissions.module_access,
          },
        });
      } else if (staff?.id) {
        // Update existing staff
        const staffData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          role: formData.role,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          pin_code: formData.pin_code || null,
          is_active: formData.is_active,
        };

        const { error } = await supabase
          .from('staff')
          .update(staffData)
          .eq('id', staff.id);

        if (error) throw error;

        // Update permissions if user has auth_user_id
        if (staff.auth_user_id) {
          updatePermissions({
            userId: staff.auth_user_id,
            permissions: {
              ...permissions,
              module_access: permissions.module_access,
            },
          });
        }

        toast.success("Staff member updated successfully");
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving staff:', error);
      toast.error(error.message || "Failed to save staff member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleModuleAccess = (module: string) => {
    setPermissions(prev => ({
      ...prev,
      module_access: {
        ...prev.module_access,
        [module]: !prev.module_access[module],
      },
    }));
  };

  const modules = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'pos', label: 'POS System' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'items', label: 'Menu Items' },
    { key: 'modifiers', label: 'Modifiers' },
    { key: 'categories', label: 'Categories' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'customers', label: 'Customers' },
    { key: 'orders', label: 'Orders' },
    { key: 'service-tables', label: 'Service Tables' },
    { key: 'sales', label: 'Cashier' },
    { key: 'stock-alert', label: 'Stock Alerts' },
    { key: 'payment-methods', label: 'Payment Methods' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'expense-types', label: 'Expense Types' },
    { key: 'staff', label: 'Staff Management' },
    { key: 'backup', label: 'Backup' },
    { key: 'imports-exports', label: 'Import/Export' },
  ];

  const roles: StaffRole[] = ['Admin', 'Manager', 'Chef', 'Waiter', 'Cashier'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              {isNewUser ? 'Create New User & Staff' : 'Edit Staff Member'}
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
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                {isNewUser && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      required={isNewUser}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value: StaffRole) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
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
                  <Label htmlFor="hourly_rate">Hourly Rate</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    placeholder="Enter hourly rate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pin_code">PIN Code</Label>
                  <Input
                    id="pin_code"
                    value={formData.pin_code}
                    onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                    placeholder="Enter PIN code"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active Status</Label>
                </div>
              </div>
            </div>

            {/* System Permissions */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                System Permissions
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="system_access"
                    checked={permissions.system_access}
                    onCheckedChange={(checked) =>
                      setPermissions(prev => ({ ...prev, system_access: !!checked }))
                    }
                  />
                  <Label htmlFor="system_access">System Access</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="can_create_users"
                    checked={permissions.can_create_users}
                    onCheckedChange={(checked) =>
                      setPermissions(prev => ({ ...prev, can_create_users: !!checked }))
                    }
                  />
                  <Label htmlFor="can_create_users">Can Create Users</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="can_delete_users"
                    checked={permissions.can_delete_users}
                    onCheckedChange={(checked) =>
                      setPermissions(prev => ({ ...prev, can_delete_users: !!checked }))
                    }
                  />
                  <Label htmlFor="can_delete_users">Can Delete Users</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="can_manage_permissions"
                    checked={permissions.can_manage_permissions}
                    onCheckedChange={(checked) =>
                      setPermissions(prev => ({ ...prev, can_manage_permissions: !!checked }))
                    }
                  />
                  <Label htmlFor="can_manage_permissions">Manage Permissions</Label>
                </div>
              </div>
            </div>

            {/* Module Access */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Key className="w-5 h-5 text-green-600" />
                Module Access
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {modules.map((module) => (
                  <div key={module.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={module.key}
                      checked={permissions.module_access[module.key] || false}
                      onCheckedChange={() => toggleModuleAccess(module.key)}
                    />
                    <Label htmlFor={module.key} className="text-sm">
                      {module.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isCreatingUser}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {(isSubmitting || isCreatingUser) ? 'Saving...' : 
                 isNewUser ? 'Create User & Staff' : 'Update Staff'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}