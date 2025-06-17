
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface SalesTarget {
  id: string;
  target_name: string;
  target_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  target_amount: number;
  target_date: string;
  current_amount: number;
  achieved: boolean;
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

      // Transform the data to match our interface
      const transformedData: SalesTarget[] = (data || []).map(item => ({
        id: item.id,
        target_name: item.target_name,
        target_type: item.target_type as 'daily' | 'weekly' | 'monthly' | 'yearly',
        target_amount: Number(item.target_amount),
        target_date: item.target_date,
        current_amount: Number(item.current_amount || 0),
        achieved: Boolean(item.achieved),
        staff_id: item.staff_id,
        created_by: item.created_by,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setTargets(transformedData);
    } catch (error) {
      console.error('Error fetching sales targets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTarget = async (targetData: Omit<SalesTarget, 'id' | 'created_at' | 'updated_at'>): Promise<SalesTarget | null> => {
    try {
      const { data, error } = await supabase
        .from('sales_targets')
        .insert([{
          target_name: targetData.target_name,
          target_type: targetData.target_type,
          target_amount: targetData.target_amount,
          target_date: targetData.target_date,
          current_amount: targetData.current_amount,
          achieved: targetData.achieved,
          staff_id: targetData.staff_id,
          created_by: targetData.created_by
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating sales target:', error);
        return null;
      }

      if (data) {
        const transformedData: SalesTarget = {
          id: data.id,
          target_name: data.target_name,
          target_type: data.target_type as 'daily' | 'weekly' | 'monthly' | 'yearly',
          target_amount: Number(data.target_amount),
          target_date: data.target_date,
          current_amount: Number(data.current_amount || 0),
          achieved: Boolean(data.achieved),
          staff_id: data.staff_id,
          created_by: data.created_by,
          created_at: data.created_at,
          updated_at: data.updated_at
        };

        setTargets(prev => [transformedData, ...prev]);
        return transformedData;
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
        .update({
          target_name: updates.target_name,
          target_type: updates.target_type,
          target_amount: updates.target_amount,
          target_date: updates.target_date,
          current_amount: updates.current_amount,
          achieved: updates.achieved,
          staff_id: updates.staff_id,
          created_by: updates.created_by
        })
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
