
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useStaff() {
  const { data: staff, isLoading, error, refetch } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching staff:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  return {
    staff: staff || [],
    isLoading,
    error,
    refetch
  };
}
