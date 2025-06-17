
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

      // Transform the data to match our interface
      const transformedData: SalesAnalytics[] = (data || []).map(item => ({
        id: item.id,
        date: item.date,
        total_sales: Number(item.total_sales),
        total_orders: item.total_orders,
        average_order_value: Number(item.average_order_value),
        total_customers: item.total_customers,
        peak_hour: item.peak_hour,
        peak_hour_sales: item.peak_hour_sales ? Number(item.peak_hour_sales) : undefined,
        staff_performance: Array.isArray(item.staff_performance) ? item.staff_performance : [],
        menu_performance: Array.isArray(item.menu_performance) ? item.menu_performance : [],
        payment_methods_breakdown: typeof item.payment_methods_breakdown === 'object' ? item.payment_methods_breakdown : {},
        hourly_sales: Array.isArray(item.hourly_sales) ? item.hourly_sales : [],
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setAnalytics(transformedData);
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

      if (!data) return null;

      // Transform the data to match our interface
      const transformedData: SalesAnalytics = {
        id: data.id,
        date: data.date,
        total_sales: Number(data.total_sales),
        total_orders: data.total_orders,
        average_order_value: Number(data.average_order_value),
        total_customers: data.total_customers,
        peak_hour: data.peak_hour,
        peak_hour_sales: data.peak_hour_sales ? Number(data.peak_hour_sales) : undefined,
        staff_performance: Array.isArray(data.staff_performance) ? data.staff_performance : [],
        menu_performance: Array.isArray(data.menu_performance) ? data.menu_performance : [],
        payment_methods_breakdown: typeof data.payment_methods_breakdown === 'object' ? data.payment_methods_breakdown : {},
        hourly_sales: Array.isArray(data.hourly_sales) ? data.hourly_sales : [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return transformedData;
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

      // Transform the data to match our interface
      const transformedData: SalesAnalytics[] = (data || []).map(item => ({
        id: item.id,
        date: item.date,
        total_sales: Number(item.total_sales),
        total_orders: item.total_orders,
        average_order_value: Number(item.average_order_value),
        total_customers: item.total_customers,
        peak_hour: item.peak_hour,
        peak_hour_sales: item.peak_hour_sales ? Number(item.peak_hour_sales) : undefined,
        staff_performance: Array.isArray(item.staff_performance) ? item.staff_performance : [],
        menu_performance: Array.isArray(item.menu_performance) ? item.menu_performance : [],
        payment_methods_breakdown: typeof item.payment_methods_breakdown === 'object' ? item.payment_methods_breakdown : {},
        hourly_sales: Array.isArray(item.hourly_sales) ? item.hourly_sales : [],
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      return transformedData;
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
