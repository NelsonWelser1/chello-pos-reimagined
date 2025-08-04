import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Phone, Mail, DollarSign, Shield, User, UserX, Crown, ChefHat } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { toast } from "sonner";

interface StaffTableProps {
  staff: any[];
  isLoading: boolean;
  onEdit: (staff: any) => void;
  onRefresh: () => void;
}

export function StaffTable({ staff, isLoading, onEdit, onRefresh }: StaffTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { deleteUser, isDeletingUser, permissions } = useUserPermissions();

  const handleDelete = async (staffMember: any) => {
    if (!confirm(`Are you sure you want to delete ${staffMember.name}? This will also delete their user account and cannot be undone.`)) return;
    
    setDeletingId(staffMember.id);
    try {
      if (staffMember.auth_user_id) {
        // Delete auth user (cascades to staff and permissions)
        deleteUser(staffMember.auth_user_id);
      } else {
        // Delete only staff record if no auth user
        const { error } = await supabase
          .from('staff')
          .delete()
          .eq('id', staffMember.id);

        if (error) throw error;
        
        toast.success("Staff member deleted successfully");
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error("Failed to delete staff member");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Crown className="w-4 h-4" />;
      case 'Manager': return <Shield className="w-4 h-4" />;
      case 'Chef': return <ChefHat className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'Manager': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Chef': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Waiter': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cashier': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPermissionsBadge = (staffMember: any) => {
    const userPermission = permissions.find(p => p.staff_id === staffMember.id);
    if (!userPermission) return (
      <Badge variant="outline" className="text-xs">
        No Permissions
      </Badge>
    );

    const accessLevel = userPermission.can_manage_permissions ? 'Full Admin' :
                       userPermission.can_create_users ? 'User Manager' :
                       userPermission.system_access ? 'System Access' : 'Limited Access';

    const variant = userPermission.can_manage_permissions ? 'destructive' :
                   userPermission.can_create_users ? 'default' :
                   userPermission.system_access ? 'secondary' : 'outline';

    return (
      <Badge variant={variant} className="flex items-center gap-1 text-xs">
        <Shield className="w-3 h-3" />
        {accessLevel}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!staff || staff.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-600 mb-2">No Staff Members</h3>
        <p className="text-slate-500">Start by adding your first team member</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-bold text-slate-700 py-4">Staff Member</TableHead>
            <TableHead className="font-bold text-slate-700">Role</TableHead>
            <TableHead className="font-bold text-slate-700">Permissions</TableHead>
            <TableHead className="font-bold text-slate-700">Contact</TableHead>
            <TableHead className="font-bold text-slate-700">Rate</TableHead>
            <TableHead className="font-bold text-slate-700">Status</TableHead>
            <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id} className="hover:bg-slate-50 transition-colors">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {member.name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{member.name}</div>
                    <div className="text-sm text-slate-500">{member.email}</div>
                    {member.auth_user_id && (
                      <Badge variant="outline" className="text-xs mt-1">
                        <User className="w-3 h-3 mr-1" />
                        User Account
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className={`${getRoleColor(member.role)} font-medium px-3 py-1 flex items-center gap-2 w-fit`}>
                  {getRoleIcon(member.role)}
                  {member.role}
                </Badge>
              </TableCell>

              <TableCell>
                {getPermissionsBadge(member)}
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {member.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {member.email}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                {member.hourly_rate ? (
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  UGX {member.hourly_rate}/hr
                </div>
                ) : (
                  <span className="text-slate-400">Not set</span>
                )}
              </TableCell>
              
              <TableCell>
                <Badge className={member.is_active 
                  ? "bg-green-100 text-green-700 border-green-200" 
                  : "bg-red-100 text-red-700 border-red-200"
                }>
                  {member.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(member)}
                    className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(member)}
                    disabled={deletingId === member.id || isDeletingUser}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                  >
                    {member.auth_user_id ? <UserX className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}