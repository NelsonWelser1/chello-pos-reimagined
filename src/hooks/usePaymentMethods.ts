
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethodFormData } from '@/components/payment-methods/forms/PaymentMethodFormSchema';
import { toast } from 'sonner';

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  provider?: string;
  enabled: boolean;
  processing_fee_percentage: number;
  processing_fee_fixed: number;
  daily_limit?: number;
  monthly_limit?: number;
  currency: string;
  description?: string;
  api_key?: string;
  webhook_url?: string;
  merchant_id?: string;
  terminal_id?: string;
  created_at: string;
  updated_at: string;
}

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to fetch payment methods');
        return;
      }

      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (data: PaymentMethodFormData) => {
    try {
      const { data: newPaymentMethod, error } = await supabase
        .from('payment_methods')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error adding payment method:', error);
        toast.error('Failed to add payment method');
        return false;
      }

      setPaymentMethods(prev => [newPaymentMethod, ...prev]);
      toast.success('Payment method added successfully');
      return true;
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method');
      return false;
    }
  };

  const updatePaymentMethod = async (id: string, data: Partial<PaymentMethodFormData>) => {
    try {
      const { data: updatedPaymentMethod, error } = await supabase
        .from('payment_methods')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment method:', error);
        toast.error('Failed to update payment method');
        return false;
      }

      setPaymentMethods(prev => 
        prev.map(method => method.id === id ? updatedPaymentMethod : method)
      );
      toast.success('Payment method updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Failed to update payment method');
      return false;
    }
  };

  const togglePaymentMethod = async (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    if (!method) return;

    return updatePaymentMethod(id, { enabled: !method.enabled });
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
    loading,
    addPaymentMethod,
    updatePaymentMethod,
    togglePaymentMethod,
    refetch: fetchPaymentMethods
  };
}
