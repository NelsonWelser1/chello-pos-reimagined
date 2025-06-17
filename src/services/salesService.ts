
import { supabase } from "@/integrations/supabase/client";
import { SalesTransaction } from "@/hooks/useSalesTransactions";

export interface SalesMetrics {
  todayRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  peakHour: string;
  dailyGrowth: number;
  weeklyGrowth: number;
}

export interface PaymentMethodBreakdown {
  cash: number;
  card: number;
  mobile: number;
}

export const salesService = {
  // Get real-time sales metrics
  async getTodaysMetrics(): Promise<SalesMetrics> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's analytics
      const { data: todayData } = await supabase
        .from('sales_analytics')
        .select('*')
        .eq('date', today)
        .single();

      // Get yesterday's data for comparison
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const { data: yesterdayData } = await supabase
        .from('sales_analytics')
        .select('*')
        .eq('date', yesterday.toISOString().split('T')[0])
        .single();

      // Get last week's data for comparison
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const { data: lastWeekData } = await supabase
        .from('sales_analytics')
        .select('*')
        .eq('date', lastWeek.toISOString().split('T')[0])
        .single();

      const todayRevenue = todayData?.total_sales || 0;
      const yesterdayRevenue = yesterdayData?.total_sales || 0;
      const lastWeekRevenue = lastWeekData?.total_sales || 0;

      return {
        todayRevenue,
        totalOrders: todayData?.total_orders || 0,
        averageOrderValue: todayData?.average_order_value || 0,
        peakHour: todayData?.peak_hour ? `${todayData.peak_hour}:00` : '7:00 PM',
        dailyGrowth: yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0,
        weeklyGrowth: lastWeekRevenue > 0 ? ((todayRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 : 0
      };
    } catch (error) {
      console.error('Error fetching today\'s metrics:', error);
      return {
        todayRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        peakHour: '7:00 PM',
        dailyGrowth: 0,
        weeklyGrowth: 0
      };
    }
  },

  // Get payment method breakdown
  async getPaymentMethodBreakdown(): Promise<PaymentMethodBreakdown> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data } = await supabase
        .from('sales_transactions')
        .select('payment_method, total_amount')
        .gte('transaction_date', today)
        .lt('transaction_date', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      const breakdown: PaymentMethodBreakdown = { cash: 0, card: 0, mobile: 0 };

      data?.forEach(transaction => {
        const method = transaction.payment_method.toLowerCase();
        if (method === 'cash') {
          breakdown.cash += transaction.total_amount;
        } else if (method.includes('card') || method.includes('credit') || method.includes('debit')) {
          breakdown.card += transaction.total_amount;
        } else {
          breakdown.mobile += transaction.total_amount;
        }
      });

      return breakdown;
    } catch (error) {
      console.error('Error fetching payment method breakdown:', error);
      return { cash: 0, card: 0, mobile: 0 };
    }
  },

  // Get hourly sales data for charts
  async getHourlySalesData(): Promise<Array<{ hour: string; sales: number; orders: number }>> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data } = await supabase
        .from('sales_transactions')
        .select('transaction_date, total_amount')
        .gte('transaction_date', today)
        .lt('transaction_date', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Group by hour
      const hourlyData: Record<string, { sales: number; orders: number }> = {};
      
      data?.forEach(transaction => {
        const hour = new Date(transaction.transaction_date).getHours();
        const hourKey = `${hour}:00`;
        
        if (!hourlyData[hourKey]) {
          hourlyData[hourKey] = { sales: 0, orders: 0 };
        }
        
        hourlyData[hourKey].sales += transaction.total_amount;
        hourlyData[hourKey].orders += 1;
      });

      // Convert to array format for charts
      return Object.entries(hourlyData).map(([hour, data]) => ({
        hour,
        sales: data.sales,
        orders: data.orders
      })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    } catch (error) {
      console.error('Error fetching hourly sales data:', error);
      return [];
    }
  },

  // Update sales target progress
  async updateTargetProgress(targetId: string, currentAmount: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sales_targets')
        .update({ 
          current_amount: currentAmount,
          achieved: currentAmount >= 0 // Will be updated by trigger based on target_amount
        })
        .eq('id', targetId);

      if (error) {
        console.error('Error updating target progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating target progress:', error);
      return false;
    }
  }
};
