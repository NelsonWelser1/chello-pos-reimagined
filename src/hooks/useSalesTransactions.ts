
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

      // Transform the data to match our interface
      const transformedData: SalesTransaction[] = (data || []).map(item => ({
        id: item.id,
        transaction_id: item.transaction_id,
        order_id: item.order_id,
        customer_id: item.customer_id,
        staff_id: item.staff_id,
        total_amount: Number(item.total_amount),
        subtotal: Number(item.subtotal),
        tax_amount: Number(item.tax_amount),
        discount_amount: item.discount_amount ? Number(item.discount_amount) : 0,
        payment_method: item.payment_method,
        payment_status: item.payment_status,
        transaction_date: item.transaction_date,
        refund_amount: item.refund_amount ? Number(item.refund_amount) : 0,
        refund_reason: item.refund_reason,
        notes: item.notes,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setTransactions(transformedData);
    } catch (error) {
      console.error('Error fetching sales transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: Omit<SalesTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<SalesTransaction | null> => {
    try {
      const { data, error } = await supabase
        .from('sales_transactions')
        .insert([{
          transaction_id: transactionData.transaction_id,
          order_id: transactionData.order_id,
          customer_id: transactionData.customer_id,
          staff_id: transactionData.staff_id,
          total_amount: transactionData.total_amount,
          subtotal: transactionData.subtotal,
          tax_amount: transactionData.tax_amount,
          discount_amount: transactionData.discount_amount,
          payment_method: transactionData.payment_method,
          payment_status: transactionData.payment_status,
          transaction_date: transactionData.transaction_date,
          refund_amount: transactionData.refund_amount,
          refund_reason: transactionData.refund_reason,
          notes: transactionData.notes
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating sales transaction:', error);
        return null;
      }

      if (data) {
        const transformedData: SalesTransaction = {
          id: data.id,
          transaction_id: data.transaction_id,
          order_id: data.order_id,
          customer_id: data.customer_id,
          staff_id: data.staff_id,
          total_amount: Number(data.total_amount),
          subtotal: Number(data.subtotal),
          tax_amount: Number(data.tax_amount),
          discount_amount: data.discount_amount ? Number(data.discount_amount) : 0,
          payment_method: data.payment_method,
          payment_status: data.payment_status,
          transaction_date: data.transaction_date,
          refund_amount: data.refund_amount ? Number(data.refund_amount) : 0,
          refund_reason: data.refund_reason,
          notes: data.notes,
          created_at: data.created_at,
          updated_at: data.updated_at
        };

        setTransactions(prev => [transformedData, ...prev]);
        return transformedData;
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
        .update({
          transaction_id: updates.transaction_id,
          order_id: updates.order_id,
          customer_id: updates.customer_id,
          staff_id: updates.staff_id,
          total_amount: updates.total_amount,
          subtotal: updates.subtotal,
          tax_amount: updates.tax_amount,
          discount_amount: updates.discount_amount,
          payment_method: updates.payment_method,
          payment_status: updates.payment_status,
          transaction_date: updates.transaction_date,
          refund_amount: updates.refund_amount,
          refund_reason: updates.refund_reason,
          notes: updates.notes
        })
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
