
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface SalesTransaction {
  id: string;
  transaction_id: string;
  order_id?: string;
  customer_id?: string;
  staff_id?: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  discount_amount?: number;
  payment_method: string;
  payment_status: string;
  transaction_date: string;
  refund_amount?: number;
  refund_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useSalesTransactions() {
  const [transactions, setTransactions] = useState<SalesTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching sales transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching sales transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: Partial<SalesTransaction>): Promise<SalesTransaction | null> => {
    try {
      const { data, error } = await supabase
        .from('sales_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) {
        console.error('Error creating sales transaction:', error);
        return null;
      }

      if (data) {
        setTransactions(prev => [data, ...prev]);
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error creating sales transaction:', error);
      return null;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<SalesTransaction>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_transactions')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating sales transaction:', error);
        return false;
      }

      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? { ...transaction, ...updates } : transaction
        )
      );

      return true;
    } catch (error) {
      console.error('Error updating sales transaction:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    createTransaction,
    updateTransaction,
    refetch: fetchTransactions
  };
}
