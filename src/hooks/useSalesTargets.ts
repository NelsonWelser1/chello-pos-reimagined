
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface SalesTarget {
  id: string;
  target_name: string;
  target_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  target_amount: number;
  target_date: string;
  current_amount?: number;
  achieved?: boolean;
  staff_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
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
        .order('target_date', { ascending: false });

      if (error) {
        console.error('Error fetching sales targets:', error);
        return;
      }

      setTargets(data || []);
    } catch (error) {
      console.error('Error fetching sales targets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTarget = async (targetData: Partial<SalesTarget>): Promise<SalesTarget | null> => {
    try {
      const { data, error } = await supabase
        .from('sales_targets')
        .insert([targetData])
        .select()
        .single();

      if (error) {
        console.error('Error creating sales target:', error);
        return null;
      }

      if (data) {
        setTargets(prev => [data, ...prev]);
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error creating sales target:', error);
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
        return false;
      }

      setTargets(prev => 
        prev.map(target => 
          target.id === id ? { ...target, ...updates } : target
        )
      );

      return true;
    } catch (error) {
      console.error('Error updating sales target:', error);
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
    refetch: fetchTargets
  };
}
