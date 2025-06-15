
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Staff = Database['public']['Tables']['staff']['Row'];
export type NewStaff = Database['public']['Tables']['staff']['Insert'];
export type UpdateStaff = Database['public']['Tables']['staff']['Update'];
export type StaffRole = Database['public']['Enums']['staff_role'];

const STAFF_QUERY_KEY = "staff";

// Fetch all staff members
export const useGetStaff = () => {
  return useQuery({
    queryKey: [STAFF_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
};

// Add a new staff member
export const useAddStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (staff: NewStaff) => {
      const { data, error } = await supabase.from("staff").insert(staff).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_QUERY_KEY] });
    },
  });
};

// Update a staff member
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateStaff & { id: string }) => {
      const { data, error } = await supabase.from("staff").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_QUERY_KEY] });
    },
  });
};

// Delete a staff member
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_QUERY_KEY] });
    },
  });
};
