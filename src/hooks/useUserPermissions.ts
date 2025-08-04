import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserPermissions {
  id?: string;
  user_id: string;
  staff_id?: string;
  module_access: Record<string, boolean>;
  system_access: boolean;
  can_create_users: boolean;
  can_delete_users: boolean;
  can_manage_permissions: boolean;
}

export function useUserPermissions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['user-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select(`
          *,
          staff:staff_id(name, email, role)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async ({ email, password, name, role, permissions }: {
      email: string;
      password: string;
      name: string;
      role: string;
      permissions: Partial<UserPermissions>;
    }) => {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) throw authError;

        // Create staff record
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .insert({
            name,
            email,
            role: role as "Admin" | "Manager" | "Chef" | "Waiter" | "Cashier",
            auth_user_id: authData.user.id,
          })
          .select()
          .single();

      if (staffError) throw staffError;

      // Create user permissions
      const { error: permError } = await supabase
        .from('user_permissions')
        .insert({
          user_id: authData.user.id,
          staff_id: staffData.id,
          ...permissions,
        });

      if (permError) throw permError;

      return { authData, staffData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ userId, permissions }: {
      userId: string;
      permissions: Partial<UserPermissions>;
    }) => {
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          ...permissions,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update permissions",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Delete from auth (cascade will handle staff and permissions)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  return {
    permissions: permissions || [],
    isLoading,
    createUser: createUserMutation.mutate,
    updatePermissions: updatePermissionsMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreatingUser: createUserMutation.isPending,
    isUpdatingPermissions: updatePermissionsMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
  };
}