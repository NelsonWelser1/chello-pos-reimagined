
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface SalesAnalytics {
  id: string;
  date: string;
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  total_customers: number;
  peak_hour?: number;
  peak_hour_sales?: number;
  staff_performance?: any[];
  menu_performance?: any[];
  payment_methods_breakdown?: any;
  hourly_sales?: any[];
  created_at: string;
  updated_at: string;
}

export function useSalesAnalytics() {
  const [analytics, setAnalytics] = useState<SalesAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (dateRange?: { from: string; to: string }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('sales_analytics')
        .select('*')
        .order('date', { ascending: false });

      if (dateRange) {
        query = query
          .gte('date', dateRange.from)
          .lte('date', dateRange.to);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching sales analytics:', error);
        return;
      }

      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysAnalytics = async (): Promise<SalesAnalytics | null> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('sales_analytics')
        .select('*')
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching today\'s analytics:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching today\'s analytics:', error);
      return null;
    }
  };

  const getWeeklyAnalytics = async (): Promise<SalesAnalytics[]> => {
    try {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const { data, error } = await supabase
        .from('sales_analytics')
        .select('*')
        .gte('date', weekAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching weekly analytics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching weekly analytics:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    fetchAnalytics,
    getTodaysAnalytics,
    getWeeklyAnalytics,
    refetch: fetchAnalytics
  };
}
