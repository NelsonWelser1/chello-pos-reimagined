import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface SalesTarget {
  id: string;
  target_name: string;
  target_type: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  achieved: boolean;
  staff_id?: string;
  created_at: string;
  updated_at: string;
}

interface CreateTargetData {
  target_name: string;
  target_type: string;
  target_amount: number;
  target_date: string;
  current_amount: number;
  achieved: boolean;
  staff_id?: string;
}

export function useSalesTargets() {
  const [targets, setTargets] = useState<SalesTarget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales_targets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sales targets:', error);
        toast.error('Failed to fetch sales targets');
        return;
      }

      setTargets(data || []);
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      toast.error('Failed to fetch sales targets');
    } finally {
      setLoading(false);
    }
  };

  const createTarget = async (targetData: Omit<CreateTargetData, 'current_amount' | 'achieved'>): Promise<SalesTarget | null> => {
    try {
      const { data, error } = await supabase
        .from('sales_targets')
        .insert([{
          ...targetData,
          current_amount: 0,
          achieved: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating sales target:', error);
        toast.error('Failed to create sales target');
        return null;
      }

      setTargets(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating sales target:', error);
      toast.error('Failed to create sales target');
      return null;
    }
  };

  const updateTarget = async (id: string, updates: Partial<SalesTarget>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_targets')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating sales target:', error);
        toast.error('Failed to update sales target');
        return false;
      }

      setTargets(prev => prev.map(target => 
        target.id === id ? { ...target, ...updates } : target
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating sales target:', error);
      toast.error('Failed to update sales target');
      return false;
    }
  };

  const deleteTarget = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_targets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting sales target:', error);
        toast.error('Failed to delete sales target');
        return false;
      }

      setTargets(prev => prev.filter(target => target.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting sales target:', error);
      toast.error('Failed to delete sales target');
      return false;
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  return {
    targets,
    loading,
    createTarget,
    updateTarget,
    deleteTarget,
    refetch: fetchTargets
  };
}